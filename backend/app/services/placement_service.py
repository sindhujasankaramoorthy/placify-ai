import csv
import io
import math
import statistics
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, desc, asc, and_, or_

from backend.app.models.placement import (
    Company,
    RecruitmentDrive,
    Student,
    JobApplication,
    PlacementOffer,
)


def get_academic_years(db: Session) -> List[str]:
    """Retrieve distinct academic years present in the database."""
    years = db.query(distinct(Student.academic_year)).filter(Student.academic_year.isnot(None)).order_by(desc(Student.academic_year)).all()
    result = [y[0] for y in years if y[0]]
    if not result:
        return ["2025-2026", "2024-2025", "2023-2024"]
    return result


def apply_student_filters(
    query,
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
    company_id: Optional[int] = None,
    placement_status: Optional[str] = None,
    min_package: Optional[float] = None,
    max_package: Optional[float] = None,
    multiple_offers_only: Optional[bool] = None,
    search: Optional[str] = None,
):
    if academic_year and academic_year != "All Batches" and academic_year != "all":
        query = query.filter(Student.academic_year == academic_year)

    if department and department != "All Departments" and department != "all":
        query = query.filter(
            or_(
                Student.department == department,
                Student.department_code == department
            )
        )

    if company_id:
        # Filter to students who have an offer or application with this company
        student_ids_with_company = query.session.query(PlacementOffer.student_id).filter(
            PlacementOffer.company_id == company_id
        ).subquery()
        query = query.filter(Student.id.in_(student_ids_with_company))

    if placement_status and placement_status != "All" and placement_status != "all":
        query = query.filter(Student.placement_status == placement_status)

    if min_package is not None:
        query = query.filter(Student.highest_package_lpa >= min_package)

    if max_package is not None:
        query = query.filter(Student.highest_package_lpa <= max_package)

    if multiple_offers_only:
        query = query.filter(Student.offers_count > 1)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Student.name.ilike(search_term),
                Student.register_number.ilike(search_term),
                Student.email.ilike(search_term),
                Student.department.ilike(search_term),
                Student.department_code.ilike(search_term),
            )
        )

    return query


def calculate_placement_summary(
    db: Session,
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
    company_id: Optional[int] = None,
) -> Dict[str, Any]:
    """Calculate institutional placement KPIs matching exact data integrity rules."""
    seed_placement_demo_data_if_empty(db)

    # Base query for students in the filtered cohort
    student_q = db.query(Student)
    if academic_year and academic_year not in ("All Batches", "all"):
        student_q = student_q.filter(Student.academic_year == academic_year)
    if department and department not in ("All Departments", "all"):
        student_q = student_q.filter(
            or_(Student.department == department, Student.department_code == department)
        )
    if company_id:
        co_student_ids = db.query(PlacementOffer.student_id).filter(
            PlacementOffer.company_id == company_id
        ).subquery()
        student_q = student_q.filter(Student.id.in_(co_student_ids))

    all_students = student_q.all()
    total_eligible = sum(1 for s in all_students if s.is_eligible)

    # Unique students placed (qualifying offer: Offer Accepted or Offer Released)
    placed_students = [s for s in all_students if s.is_eligible and s.placement_status == "Placed"]
    unique_placed = len(placed_students)
    not_placed = max(0, total_eligible - unique_placed)

    placement_pct = round((unique_placed / total_eligible * 100), 1) if total_eligible > 0 else 0.0

    # Offers query
    offer_q = db.query(PlacementOffer).join(Student, PlacementOffer.student_id == Student.id)
    if academic_year and academic_year not in ("All Batches", "all"):
        offer_q = offer_q.filter(Student.academic_year == academic_year)
    if department and department not in ("All Departments", "all"):
        offer_q = offer_q.filter(
            or_(Student.department == department, Student.department_code == department)
        )
    if company_id:
        offer_q = offer_q.filter(PlacementOffer.company_id == company_id)

    offers = offer_q.filter(
        PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
    ).all()

    total_offers = len(offers)

    # Multiple offers count: unique students who hold > 1 valid offer
    student_offer_counts: Dict[int, int] = {}
    for off in offers:
        student_offer_counts[off.student_id] = student_offer_counts.get(off.student_id, 0) + 1
    multiple_offer_students = sum(1 for cnt in student_offer_counts.values() if cnt > 1)

    # Companies recruiting
    recruiting_company_ids = set(off.company_id for off in offers)
    total_companies = len(recruiting_company_ids)

    # Package statistics (from qualifying offers)
    packages = [off.package_lpa for off in offers if off.package_lpa is not None and off.package_lpa > 0]
    highest_package = round(max(packages), 2) if packages else 0.0
    avg_package = round(statistics.mean(packages), 2) if packages else 0.0
    median_package = round(statistics.median(packages), 2) if packages else 0.0

    # Historical comparison with previous academic year (only if reliable previous data exists)
    comparison = {
        "has_comparison": False,
        "previous_academic_year": None,
        "placed_change_pct": None,
        "offers_change_pct": None,
        "avg_package_change_pct": None,
        "placement_rate_change_pct": None,
    }

    if academic_year and academic_year not in ("All Batches", "all"):
        # Determine previous academic year (e.g., "2025-2026" -> "2024-2025")
        parts = academic_year.split("-")
        if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
            prev_year = f"{int(parts[0]) - 1}-{int(parts[1]) - 1}"
            prev_students = db.query(Student).filter(Student.academic_year == prev_year).all()
            if prev_students:
                prev_eligible = sum(1 for s in prev_students if s.is_eligible)
                prev_placed = sum(1 for s in prev_students if s.is_eligible and s.placement_status == "Placed")
                prev_offers = db.query(PlacementOffer).join(Student).filter(
                    Student.academic_year == prev_year,
                    PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
                ).all()
                prev_packages = [o.package_lpa for o in prev_offers if o.package_lpa]

                prev_rate = (prev_placed / prev_eligible * 100) if prev_eligible > 0 else 0.0
                prev_avg_pkg = statistics.mean(prev_packages) if prev_packages else 0.0

                comparison["has_comparison"] = True
                comparison["previous_academic_year"] = prev_year
                if prev_placed > 0:
                    comparison["placed_change_pct"] = round(((unique_placed - prev_placed) / prev_placed) * 100, 1)
                if len(prev_offers) > 0:
                    comparison["offers_change_pct"] = round(((total_offers - len(prev_offers)) / len(prev_offers)) * 100, 1)
                if prev_avg_pkg > 0:
                    comparison["avg_package_change_pct"] = round(((avg_package - prev_avg_pkg) / prev_avg_pkg) * 100, 1)
                comparison["placement_rate_change_pct"] = round(placement_pct - prev_rate, 1)

    return {
        "academic_year": academic_year or "All Batches",
        "total_eligible_students": total_eligible,
        "students_placed": unique_placed,
        "students_not_placed": not_placed,
        "placement_percentage": placement_pct,
        "total_companies_recruiting": total_companies,
        "total_offers_received": total_offers,
        "students_multiple_offers": multiple_offer_students,
        "highest_package_lpa": highest_package,
        "average_package_lpa": avg_package,
        "median_package_lpa": median_package,
        "comparison": comparison,
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


def get_company_placement_stats(
    db: Session,
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "unique_placed",
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10,
) -> Dict[str, Any]:
    """Retrieve company-wise placement statistics with search, sorting, and pagination."""
    seed_placement_demo_data_if_empty(db)

    companies = db.query(Company).filter(Company.is_active == True).all()
    results = []

    for comp in companies:
        # Filter applications and offers for this company
        app_q = db.query(JobApplication).join(Student, JobApplication.student_id == Student.id).filter(
            JobApplication.company_id == comp.id
        )
        off_q = db.query(PlacementOffer).join(Student, PlacementOffer.student_id == Student.id).filter(
            PlacementOffer.company_id == comp.id,
            PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
        )

        if academic_year and academic_year not in ("All Batches", "all"):
            app_q = app_q.filter(Student.academic_year == academic_year)
            off_q = off_q.filter(Student.academic_year == academic_year)

        if department and department not in ("All Departments", "all"):
            app_q = app_q.filter(
                or_(Student.department == department, Student.department_code == department)
            )
            off_q = off_q.filter(
                or_(Student.department == department, Student.department_code == department)
            )

        apps = app_q.all()
        offers = off_q.all()

        applied_count = len(apps)
        shortlisted_count = sum(1 for a in apps if a.stage in ("Shortlisted", "Interview", "Selected"))
        selected_count = sum(1 for a in apps if a.stage == "Selected")

        # Unique students placed at this company
        unique_student_ids = set(o.student_id for o in offers)
        unique_placed = len(unique_student_ids)
        total_offers = len(offers)

        # Skip companies with no activity if filtered
        if applied_count == 0 and total_offers == 0 and academic_year and academic_year not in ("All Batches", "all"):
            continue

        packages = [o.package_lpa for o in offers if o.package_lpa]
        avg_pkg = round(statistics.mean(packages), 2) if packages else 0.0
        max_pkg = round(max(packages), 2) if packages else 0.0

        # Placement Conversion Rate: unique placed / applied * 100
        conv_rate = round((unique_placed / applied_count * 100), 1) if applied_count > 0 else 0.0

        # Drive info
        drive = db.query(RecruitmentDrive).filter(
            RecruitmentDrive.company_id == comp.id
        ).order_by(desc(RecruitmentDrive.id)).first()
        drive_title = drive.title if drive else f"{comp.name} Campus Drive"

        stat = {
            "company_id": comp.id,
            "company_name": comp.name,
            "industry": comp.industry,
            "tier": comp.tier,
            "recruitment_drive": drive_title,
            "academic_year": academic_year or "2025-2026",
            "eligible_students": 120,  # cohort pool
            "students_applied": max(applied_count, unique_placed),
            "students_shortlisted": max(shortlisted_count, unique_placed),
            "students_selected": max(selected_count, unique_placed),
            "unique_students_placed": unique_placed,
            "total_offers": total_offers,
            "average_package_lpa": avg_pkg,
            "highest_package_lpa": max_pkg,
            "conversion_rate": conv_rate,
        }

        # Apply search if provided
        if search:
            st = search.lower().strip()
            if st not in comp.name.lower() and st not in comp.industry.lower() and st not in comp.tier.lower():
                continue

        results.append(stat)

    # Sorting
    reverse = (sort_order.lower() == "desc")
    sort_key_map = {
        "unique_placed": "unique_students_placed",
        "total_offers": "total_offers",
        "company_name": "company_name",
        "average_package": "average_package_lpa",
        "highest_package": "highest_package_lpa",
        "conversion_rate": "conversion_rate",
        "students_applied": "students_applied",
    }
    actual_key = sort_key_map.get(sort_by, "unique_students_placed")
    results.sort(key=lambda x: (x[actual_key] if x[actual_key] is not None else 0), reverse=reverse)

    total_count = len(results)
    total_pages = max(1, math.ceil(total_count / limit))
    start_idx = (page - 1) * limit
    paginated_items = results[start_idx : start_idx + limit]

    return {
        "items": paginated_items,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


def get_company_students(
    db: Session,
    company_id: int,
    academic_year: Optional[str] = None,
) -> Dict[str, Any]:
    """Retrieve the exact list of students placed at a specific company."""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        return {
            "company_id": company_id,
            "company_name": "Unknown",
            "industry": "Unknown",
            "academic_year": academic_year or "All Batches",
            "total_placed_students": 0,
            "students": [],
        }

    offer_q = db.query(PlacementOffer, Student, RecruitmentDrive).join(
        Student, PlacementOffer.student_id == Student.id
    ).outerjoin(
        RecruitmentDrive, PlacementOffer.drive_id == RecruitmentDrive.id
    ).filter(
        PlacementOffer.company_id == company_id,
        PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
    )

    if academic_year and academic_year not in ("All Batches", "all"):
        offer_q = offer_q.filter(Student.academic_year == academic_year)

    rows = offer_q.order_by(desc(PlacementOffer.package_lpa)).all()

    student_list = []
    seen_student_ids = set()

    for offer, student, drive in rows:
        student_list.append({
            "student_id": student.id,
            "name": student.name,
            "register_number": student.register_number,
            "department": student.department,
            "department_code": student.department_code,
            "graduation_batch": student.graduation_batch,
            "email": student.email,
            "role": offer.role,
            "package_lpa": offer.package_lpa,
            "selection_date": offer.offer_date.strftime("%Y-%m-%d") if offer.offer_date else None,
            "offer_status": offer.offer_status,
            "is_accepted": offer.is_accepted,
            "drive_title": drive.title if drive else f"{company.name} Recruitment Drive",
        })
        seen_student_ids.add(student.id)

    return {
        "company_id": company.id,
        "company_name": company.name,
        "industry": company.industry,
        "academic_year": academic_year or "All Batches",
        "total_placed_students": len(seen_student_ids),
        "students": student_list,
    }


def get_student_placement_register(
    db: Session,
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
    company_id: Optional[int] = None,
    placement_status: Optional[str] = None,
    min_package: Optional[float] = None,
    max_package: Optional[float] = None,
    multiple_offers_only: Optional[bool] = None,
    search: Optional[str] = None,
    sort_by: str = "name",
    sort_order: str = "asc",
    page: int = 1,
    limit: int = 15,
) -> Dict[str, Any]:
    """Retrieve full student placement register with comprehensive filtering and multiple-offer indicators."""
    seed_placement_demo_data_if_empty(db)

    query = db.query(Student)
    query = apply_student_filters(
        query=query,
        academic_year=academic_year,
        department=department,
        company_id=company_id,
        placement_status=placement_status,
        min_package=min_package,
        max_package=max_package,
        multiple_offers_only=multiple_offers_only,
        search=search,
    )

    # Sorting
    order_func = desc if sort_order.lower() == "desc" else asc
    if sort_by == "package":
        query = query.order_by(order_func(Student.highest_package_lpa))
    elif sort_by == "offers":
        query = query.order_by(order_func(Student.offers_count))
    elif sort_by == "register_number":
        query = query.order_by(order_func(Student.register_number))
    elif sort_by == "department":
        query = query.order_by(order_func(Student.department_code))
    elif sort_by == "status":
        query = query.order_by(order_func(Student.placement_status))
    else:
        query = query.order_by(order_func(Student.name))

    total_count = query.count()
    total_pages = max(1, math.ceil(total_count / limit))
    students = query.offset((page - 1) * limit).limit(limit).all()

    items = []
    for s in students:
        # Determine primary offer / accepted company
        primary_offer = db.query(PlacementOffer, Company, RecruitmentDrive).join(
            Company, PlacementOffer.company_id == Company.id
        ).outerjoin(
            RecruitmentDrive, PlacementOffer.drive_id == RecruitmentDrive.id
        ).filter(
            PlacementOffer.student_id == s.id
        ).order_by(
            desc(PlacementOffer.is_accepted), desc(PlacementOffer.package_lpa)
        ).first()

        company_name = primary_offer[1].name if primary_offer else None
        role = primary_offer[0].role if primary_offer else None
        drive_title = primary_offer[2].title if (primary_offer and primary_offer[2]) else None
        selection_date = primary_offer[0].offer_date.strftime("%Y-%m-%d") if (primary_offer and primary_offer[0].offer_date) else None
        offer_status = primary_offer[0].offer_status if primary_offer else None
        package_lpa = primary_offer[0].package_lpa if primary_offer else s.highest_package_lpa
        is_accepted = primary_offer[0].is_accepted if primary_offer else False

        items.append({
            "student_id": s.id,
            "name": s.name,
            "register_number": s.register_number,
            "department": s.department,
            "department_code": s.department_code,
            "graduation_batch": s.graduation_batch,
            "email": s.email,
            "phone": s.phone,
            "cgpa": s.cgpa,
            "company_name": company_name,
            "job_role": role,
            "recruitment_drive": drive_title,
            "selection_date": selection_date,
            "offer_status": offer_status,
            "package_lpa": package_lpa,
            "number_of_offers": s.offers_count,
            "placement_status": s.placement_status,
            "is_accepted_offer": is_accepted,
        })

    return {
        "items": items,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
    }


def get_student_detail(db: Session, student_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve detailed student profile including all placement offers and application history."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return None

    # Offers
    offers_raw = db.query(PlacementOffer, Company).join(
        Company, PlacementOffer.company_id == Company.id
    ).filter(PlacementOffer.student_id == student.id).order_by(
        desc(PlacementOffer.is_accepted), desc(PlacementOffer.package_lpa)
    ).all()

    offer_items = []
    for off, comp in offers_raw:
        offer_items.append({
            "id": off.id,
            "company_name": comp.name,
            "industry": comp.industry,
            "role": off.role,
            "package_lpa": off.package_lpa,
            "offer_date": off.offer_date.strftime("%Y-%m-%d") if off.offer_date else "",
            "offer_status": off.offer_status,
            "is_accepted": off.is_accepted,
            "notes": off.notes,
        })

    # Applications
    apps_raw = db.query(JobApplication, Company).join(
        Company, JobApplication.company_id == Company.id
    ).filter(JobApplication.student_id == student.id).order_by(
        desc(JobApplication.applied_date)
    ).all()

    app_items = []
    for app, comp in apps_raw:
        app_items.append({
            "id": app.id,
            "company_name": comp.name,
            "role": app.role,
            "stage": app.stage,
            "applied_date": app.applied_date.strftime("%Y-%m-%d") if app.applied_date else "",
        })

    accepted_company_name = None
    if student.accepted_company_id:
        acc_comp = db.query(Company).filter(Company.id == student.accepted_company_id).first()
        accepted_company_name = acc_comp.name if acc_comp else None

    return {
        "student_id": student.id,
        "name": student.name,
        "register_number": student.register_number,
        "department": student.department,
        "department_code": student.department_code,
        "graduation_batch": student.graduation_batch,
        "academic_year": student.academic_year,
        "email": student.email,
        "phone": student.phone,
        "cgpa": student.cgpa,
        "is_eligible": student.is_eligible,
        "placement_status": student.placement_status,
        "offers_count": student.offers_count,
        "highest_package_lpa": student.highest_package_lpa,
        "accepted_company": accepted_company_name,
        "offers": offer_items,
        "applications": app_items,
    }


def get_placement_analytics(
    db: Session,
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
) -> Dict[str, Any]:
    """Calculate data for all visual analytics and interactive charts."""
    seed_placement_demo_data_if_empty(db)

    year_filter = academic_year if academic_year and academic_year not in ("All Batches", "all") else None

    # 1. Company Recruitment Chart (Bar chart: unique students placed per company, sorted desc)
    comp_stats_res = get_company_placement_stats(
        db, academic_year=year_filter, department=department, limit=20, sort_by="unique_placed", sort_order="desc"
    )
    company_chart = [
        {
            "company": c["company_name"],
            "placed_students": c["unique_students_placed"],
            "total_offers": c["total_offers"],
            "avg_package": c["average_package_lpa"],
            "company_id": c["company_id"],
        }
        for c in comp_stats_res["items"] if c["unique_students_placed"] > 0
    ][:12]

    # 2. Department-wise Placement Rate
    dept_query = db.query(
        Student.department,
        Student.department_code,
        func.count(Student.id).label("total_students"),
    )
    if year_filter:
        dept_query = dept_query.filter(Student.academic_year == year_filter)
    dept_rows = dept_query.group_by(Student.department, Student.department_code).all()

    department_chart = []
    for dept_name, code, total_s in dept_rows:
        placed_q = db.query(Student).filter(
            Student.department_code == code,
            Student.placement_status == "Placed",
            Student.is_eligible == True,
        )
        if year_filter:
            placed_q = placed_q.filter(Student.academic_year == year_filter)
        placed_count = placed_q.count()

        eligible_q = db.query(Student).filter(
            Student.department_code == code,
            Student.is_eligible == True,
        )
        if year_filter:
            eligible_q = eligible_q.filter(Student.academic_year == year_filter)
        eligible_count = eligible_q.count()

        pct = round((placed_count / eligible_count * 100), 1) if eligible_count > 0 else 0.0

        offers = db.query(PlacementOffer.package_lpa).join(Student).filter(
            Student.department_code == code,
            PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
        )
        if year_filter:
            offers = offers.filter(Student.academic_year == year_filter)
        pkgs = [p[0] for p in offers.all() if p[0]]
        avg_pkg = round(statistics.mean(pkgs), 1) if pkgs else 0.0

        department_chart.append({
            "department": dept_name,
            "department_code": code,
            "eligible": eligible_count,
            "placed": placed_count,
            "placement_percentage": pct,
            "avg_package": avg_pkg,
        })
    department_chart.sort(key=lambda x: x["placement_percentage"], reverse=True)

    # 3. Placement Status Distribution (Donut chart)
    status_q = db.query(Student.placement_status, func.count(Student.id))
    if year_filter:
        status_q = status_q.filter(Student.academic_year == year_filter)
    if department and department not in ("All Departments", "all"):
        status_q = status_q.filter(
            or_(Student.department == department, Student.department_code == department)
        )
    status_counts = dict(status_q.group_by(Student.placement_status).all())

    total_stat = sum(status_counts.values()) or 1
    status_distribution = [
        {
            "status": "Placed",
            "count": status_counts.get("Placed", 0),
            "percentage": round(status_counts.get("Placed", 0) / total_stat * 100, 1),
            "color": "#10b981", # emerald
        },
        {
            "status": "In Progress",
            "count": status_counts.get("In Progress", 0),
            "percentage": round(status_counts.get("In Progress", 0) / total_stat * 100, 1),
            "color": "#f59e0b", # amber
        },
        {
            "status": "Not Placed",
            "count": status_counts.get("Not Placed", 0),
            "percentage": round(status_counts.get("Not Placed", 0) / total_stat * 100, 1),
            "color": "#64748b", # slate
        },
    ]

    # 4. Package Distribution (Salary Brackets)
    offer_pkgs_q = db.query(PlacementOffer.package_lpa).join(Student).filter(
        PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
    )
    if year_filter:
        offer_pkgs_q = offer_pkgs_q.filter(Student.academic_year == year_filter)
    if department and department not in ("All Departments", "all"):
        offer_pkgs_q = offer_pkgs_q.filter(
            or_(Student.department == department, Student.department_code == department)
        )

    all_pkgs = [p[0] for p in offer_pkgs_q.all() if p[0]]
    total_pkgs = len(all_pkgs) or 1

    brackets = [
        {"bracket": "< 5 LPA", "min": 0, "max": 4.99},
        {"bracket": "5 - 8 LPA", "min": 5.0, "max": 7.99},
        {"bracket": "8 - 12 LPA", "min": 8.0, "max": 11.99},
        {"bracket": "12 - 18 LPA", "min": 12.0, "max": 17.99},
        {"bracket": "> 18 LPA", "min": 18.0, "max": 999.0},
    ]

    package_distribution = []
    for b in brackets:
        cnt = sum(1 for p in all_pkgs if b["min"] <= p <= b["max"])
        package_distribution.append({
            "bracket": b["bracket"],
            "count": cnt,
            "percentage": round(cnt / total_pkgs * 100, 1),
        })

    # 5. Academic Year Trend
    years = ["2023-2024", "2024-2025", "2025-2026"]
    academic_year_trend = []
    for yr in years:
        yr_students = db.query(Student).filter(Student.academic_year == yr).all()
        if yr_students:
            yr_eligible = sum(1 for s in yr_students if s.is_eligible)
            yr_placed = sum(1 for s in yr_students if s.is_eligible and s.placement_status == "Placed")
            yr_rate = round((yr_placed / yr_eligible * 100), 1) if yr_eligible > 0 else 0.0

            yr_offers = db.query(PlacementOffer).join(Student).filter(
                Student.academic_year == yr,
                PlacementOffer.offer_status.in_(["Offer Accepted", "Offer Released"])
            ).all()
            yr_packages = [o.package_lpa for o in yr_offers if o.package_lpa]
            yr_avg_pkg = round(statistics.mean(yr_packages), 1) if yr_packages else 0.0

            academic_year_trend.append({
                "academic_year": yr,
                "placement_percentage": yr_rate,
                "total_offers": len(yr_offers),
                "average_package": yr_avg_pkg,
                "students_placed": yr_placed,
            })

    # 6. Top Recruiting Companies
    top_companies = [
        {
            "company_id": c["company_id"],
            "company": c["company_name"],
            "industry": c["industry"],
            "unique_placed": c["unique_students_placed"],
            "total_offers": c["total_offers"],
            "highest_package": c["highest_package_lpa"],
            "avg_package": c["average_package_lpa"],
        }
        for c in comp_stats_res["items"] if c["unique_students_placed"] > 0
    ][:5]

    return {
        "academic_year": year_filter or "All Batches",
        "company_chart": company_chart,
        "department_chart": department_chart,
        "status_distribution": status_distribution,
        "package_distribution": package_distribution,
        "academic_year_trend": academic_year_trend,
        "top_companies": top_companies,
    }


def generate_placement_export_csv(
    db: Session,
    export_type: str = "students",
    academic_year: Optional[str] = None,
    department: Optional[str] = None,
    placement_status: Optional[str] = None,
) -> str:
    """Generate RFC 4180 compliant CSV export data for students, companies, or department breakdown."""
    output = io.StringIO()
    writer = csv.writer(output)

    if export_type == "companies":
        writer.writerow([
            "Company Name",
            "Industry",
            "Recruitment Drive",
            "Academic Year",
            "Eligible Students",
            "Students Applied",
            "Students Shortlisted",
            "Students Selected",
            "Unique Students Placed",
            "Total Offers",
            "Average Package (LPA)",
            "Highest Package (LPA)",
            "Conversion Rate (%)",
        ])
        data = get_company_placement_stats(db, academic_year=academic_year, department=department, limit=500)
        for c in data["items"]:
            writer.writerow([
                c["company_name"],
                c["industry"],
                c["recruitment_drive"],
                c["academic_year"],
                c["eligible_students"],
                c["students_applied"],
                c["students_shortlisted"],
                c["students_selected"],
                c["unique_students_placed"],
                c["total_offers"],
                f"₹{c['average_package_lpa']} LPA",
                f"₹{c['highest_package_lpa']} LPA",
                f"{c['conversion_rate']}%",
            ])

    elif export_type == "departments":
        writer.writerow([
            "Department Name",
            "Code",
            "Eligible Students",
            "Students Placed",
            "Placement Percentage",
            "Average Package (LPA)",
        ])
        analytics = get_placement_analytics(db, academic_year=academic_year)
        for d in analytics["department_chart"]:
            writer.writerow([
                d["department"],
                d["department_code"],
                d["eligible"],
                d["placed"],
                f"{d['placement_percentage']}%",
                f"₹{d['avg_package']} LPA",
            ])

    else:
        # Default: Students Placement Register
        writer.writerow([
            "Student Name",
            "Register Number",
            "Department",
            "Batch",
            "Email",
            "Company Name",
            "Job Role",
            "Recruitment Drive",
            "Selection Date",
            "Offer Status",
            "Package (LPA)",
            "Number of Offers",
            "Placement Status",
            "Offer Accepted",
        ])
        reg = get_student_placement_register(
            db, academic_year=academic_year, department=department, placement_status=placement_status, limit=1000
        )
        for s in reg["items"]:
            writer.writerow([
                s["name"],
                s["register_number"],
                s["department"],
                s["graduation_batch"],
                s["email"],
                s["company_name"] or "N/A",
                s["job_role"] or "N/A",
                s["recruitment_drive"] or "N/A",
                s["selection_date"] or "N/A",
                s["offer_status"] or "N/A",
                f"₹{s['package_lpa']} LPA" if s['package_lpa'] else "N/A",
                s["number_of_offers"],
                s["placement_status"],
                "Yes" if s["is_accepted_offer"] else "No",
            ])

    return output.getvalue()


def seed_placement_demo_data_if_empty(db: Session) -> Dict[str, int]:
    """Seed comprehensive institutional placement dataset for Placify AI if tables are empty."""
    student_count = db.query(Student).count()
    if student_count > 0:
        return {
            "students": student_count,
            "companies": db.query(Company).count(),
            "offers": db.query(PlacementOffer).count(),
        }

    # 1. Companies
    companies_data = [
        {"name": "Amazon", "industry": "Product / Cloud", "tier": "Super Dream", "website": "https://amazon.jobs"},
        {"name": "Zoho Corporation", "industry": "Software / SaaS", "tier": "Dream", "website": "https://zoho.com/careers"},
        {"name": "Tata Consultancy Services (TCS)", "industry": "IT Services & Consulting", "tier": "Core / Mass", "website": "https://tcs.com/careers"},
        {"name": "Infosys", "industry": "IT Services & Consulting", "tier": "Core / Mass", "website": "https://infosys.com/careers"},
        {"name": "Cisco", "industry": "Networking / Cloud", "tier": "Super Dream", "website": "https://cisco.com/careers"},
        {"name": "Cognizant", "industry": "IT Services", "tier": "Core / Mass", "website": "https://cognizant.com"},
        {"name": "Robert Bosch", "industry": "Automotive / Embedded", "tier": "Core / Dream", "website": "https://bosch.in"},
        {"name": "Microsoft", "industry": "Product / Enterprise", "tier": "Super Dream", "website": "https://careers.microsoft.com"},
        {"name": "Wipro Technologies", "industry": "IT Services", "tier": "Core / Mass", "website": "https://wipro.com"},
        {"name": "Razorpay", "industry": "FinTech / SaaS", "tier": "Super Dream", "website": "https://razorpay.com/jobs"},
        {"name": "Accenture", "industry": "Consulting & Technology", "tier": "Core / Mass", "website": "https://accenture.com"},
        {"name": "Qualcomm", "industry": "Semiconductors / VLSI", "tier": "Super Dream", "website": "https://qualcomm.com"},
    ]

    company_objs: Dict[str, Company] = {}
    for cd in companies_data:
        comp = Company(**cd)
        db.add(comp)
        db.flush()
        company_objs[cd["name"]] = comp

    # 2. Recruitment Drives
    drives_data = [
        ("Amazon", "Amazon SDE & Cloud Campus Drive 2025-26", "2025-2026", "On-Campus"),
        ("Zoho Corporation", "Zoho Software Craftsman On-Campus Drive 2025-26", "2025-2026", "On-Campus"),
        ("Tata Consultancy Services (TCS)", "TCS Prime & Digital Campus Recruitment 2025-26", "2025-2026", "On-Campus"),
        ("Infosys", "Infosys Specialist Programmer & SE Drive 2025-26", "2025-2026", "On-Campus"),
        ("Cisco", "Cisco Consulting Engineer & SWE Drive 2025-26", "2025-2026", "On-Campus"),
        ("Cognizant", "Cognizant GenC Elevate & Next Drive 2025-26", "2025-2026", "On-Campus"),
        ("Robert Bosch", "Bosch Mobility & Embedded Systems Drive 2025-26", "2025-2026", "On-Campus"),
        ("Microsoft", "Microsoft Engage & FTE Drive 2025-26", "2025-2026", "Pool Campus"),
        ("Razorpay", "Razorpay Backend & Product Engineering 2025-26", "2025-2026", "On-Campus"),
        ("Accenture", "Accenture Advanced Technology Centers Drive 2025-26", "2025-2026", "On-Campus"),
        ("Qualcomm", "Qualcomm Embedded & Hardware Drive 2025-26", "2025-2026", "On-Campus"),
        # Historical 2024-25 drives
        ("Tata Consultancy Services (TCS)", "TCS Campus Hiring 2024-25", "2024-2025", "On-Campus"),
        ("Infosys", "Infosys Campus Recruitment 2024-25", "2024-2025", "On-Campus"),
        ("Zoho Corporation", "Zoho Campus Hiring 2024-25", "2024-2025", "On-Campus"),
        ("Amazon", "Amazon Campus Drive 2024-25", "2024-2025", "On-Campus"),
        # Historical 2023-24 drives
        ("Tata Consultancy Services (TCS)", "TCS National Qualifier Test 2023-24", "2023-2024", "On-Campus"),
        ("Infosys", "Infosys HackWithInfy Drive 2023-24", "2023-2024", "On-Campus"),
    ]

    drive_objs: List[RecruitmentDrive] = []
    for c_name, title, ay, dtype in drives_data:
        comp = company_objs.get(c_name)
        if comp:
            dr = RecruitmentDrive(
                company_id=comp.id,
                title=title,
                academic_year=ay,
                drive_type=dtype,
                drive_date=datetime.now(timezone.utc) - timedelta(days=60),
                status="Completed",
            )
            db.add(dr)
            drive_objs.append(dr)
    db.flush()

    # 3. Department definitions
    departments = [
        ("Computer Science & Engineering", "CSE"),
        ("Information Technology", "IT"),
        ("Artificial Intelligence & Data Science", "AI&DS"),
        ("Electronics & Communication Engineering", "ECE"),
        ("Electrical & Electronics Engineering", "EEE"),
        ("Mechanical Engineering", "MECH"),
    ]

    # Generate synthetic students for 2025-26 cohort
    students_2026_data = [
        # (Name, RegNo, DeptName, Code, CGPA, Placed, Offers: [(Comp, Role, LPA, Accepted)])
        ("Sindhuja Sankaramoorthy", "718122CS101", "Computer Science & Engineering", "CSE", 9.15, "Placed", [
            ("Amazon", "Software Development Engineer (SDE-1)", 18.0, True),
            ("Tata Consultancy Services (TCS)", "TCS Digital Specialist", 7.5, False),
        ]),
        ("Kaviarasan Mohan", "718122CS102", "Computer Science & Engineering", "CSE", 8.80, "Placed", [
            ("Zoho Corporation", "Software Craftsman (SDE)", 10.0, True),
            ("Infosys", "Specialist Programmer", 9.5, False),
        ]),
        ("Dhanush Kumar", "718122CS103", "Computer Science & Engineering", "CSE", 8.45, "Placed", [
            ("Tata Consultancy Services (TCS)", "TCS Prime Developer", 9.0, True),
        ]),
        ("Priyanka Venkat", "718122IT201", "Information Technology", "IT", 8.90, "Placed", [
            ("Cisco", "Consulting Engineer - Cloud", 16.5, True),
            ("Zoho Corporation", "Member Technical Staff", 8.5, False),
        ]),
        ("Aravind Swaminathan", "718122IT202", "Information Technology", "IT", 8.20, "Placed", [
            ("Infosys", "Systems Engineer Specialist", 6.5, True),
        ]),
        ("Abinaya Ramesh", "718122AI301", "Artificial Intelligence & Data Science", "AI&DS", 9.30, "Placed", [
            ("Microsoft", "AI Platform Engineer", 24.5, True),
            ("Amazon", "Data Engineer", 17.5, False),
        ]),
        ("Harish Balaji", "718122AI302", "Artificial Intelligence & Data Science", "AI&DS", 8.60, "Placed", [
            ("Razorpay", "Data Platform Engineer", 18.0, True),
        ]),
        ("Naveen Prakash", "718122EC401", "Electronics & Communication Engineering", "ECE", 8.75, "Placed", [
            ("Qualcomm", "Embedded Software Engineer", 21.0, True),
            ("Robert Bosch", "Automotive Systems Engineer", 9.5, False),
        ]),
        ("Deepika Chandran", "718122EC402", "Electronics & Communication Engineering", "ECE", 8.10, "Placed", [
            ("Robert Bosch", "Embedded Firmware Engineer", 8.0, True),
            ("Tata Consultancy Services (TCS)", "TCS Ninja", 4.0, False),
        ]),
        ("Vigneshwaran K", "718122EE501", "Electrical & Electronics Engineering", "EEE", 8.30, "Placed", [
            ("Robert Bosch", "Control Systems Engineer", 8.5, True),
        ]),
        ("Suresh Kannan", "718122ME601", "Mechanical Engineering", "MECH", 7.90, "Placed", [
            ("Cognizant", "Associate Engineer", 5.5, True),
        ]),
        ("Ananya Krishnan", "718122CS104", "Computer Science & Engineering", "CSE", 8.95, "Placed", [
            ("Amazon", "Cloud Support Associate", 14.0, True),
            ("Accenture", "Advanced App Engineering Analyst", 6.5, False),
        ]),
        ("Manoj Prabhakar", "718122CS105", "Computer Science & Engineering", "CSE", 7.80, "Placed", [
            ("Tata Consultancy Services (TCS)", "TCS Ninja Engineer", 3.8, True),
        ]),
        ("Pavithra Selvam", "718122IT203", "Information Technology", "IT", 8.15, "Placed", [
            ("Cognizant", "GenC Next Developer", 6.75, True),
        ]),
        ("Rithvik Sundar", "718122AI303", "Artificial Intelligence & Data Science", "AI&DS", 8.70, "Placed", [
            ("Zoho Corporation", "Product Developer", 9.5, True),
        ]),
        ("Sandhya Natarajan", "718122EC403", "Electronics & Communication Engineering", "ECE", 8.40, "Placed", [
            ("Cisco", "Technical Solutions Specialist", 15.0, True),
        ]),
        ("Gokulnath R", "718122CS106", "Computer Science & Engineering", "CSE", 7.60, "Placed", [
            ("Wipro Technologies", "Project Engineer", 4.5, True),
        ]),
        ("Keerthana Murugan", "718122IT204", "Information Technology", "IT", 8.05, "Placed", [
            ("Accenture", "Application Development Analyst", 6.5, True),
        ]),
        # In Progress Students
        ("Ajith Kumar S", "718122CS107", "Computer Science & Engineering", "CSE", 7.45, "In Progress", []),
        ("Divya Bharathi", "718122IT205", "Information Technology", "IT", 7.60, "In Progress", []),
        ("Karthikeyan P", "718122EC404", "Electronics & Communication Engineering", "ECE", 7.30, "In Progress", []),
        ("Lakshmi Priya", "718122AI304", "Artificial Intelligence & Data Science", "AI&DS", 8.10, "In Progress", []),
        # Not Placed Students
        ("Santhosh Kumar", "718122ME602", "Mechanical Engineering", "MECH", 6.85, "Not Placed", []),
        ("Sneha Radhakrishnan", "718122EE502", "Electrical & Electronics Engineering", "EEE", 7.10, "Not Placed", []),
        ("Vijay Anand", "718122CS108", "Computer Science & Engineering", "CSE", 6.95, "Not Placed", []),
        ("Meena Subash", "718122EC405", "Electronics & Communication Engineering", "ECE", 6.70, "Not Placed", []),
    ]

    total_created_students = 0
    total_created_offers = 0

    for name, reg, dept, code, cgpa, status, offers in students_2026_data:
        accepted_cid = None
        highest_pkg = None
        if offers:
            pkgs = [o[2] for o in offers]
            highest_pkg = max(pkgs)
            acc_list = [o for o in offers if o[3]]
            if acc_list:
                comp_obj = company_objs.get(acc_list[0][0])
                if comp_obj:
                    accepted_cid = comp_obj.id

        stu = Student(
            register_number=reg,
            name=name,
            email=f"{reg.lower()}@srishakthi.ac.in",
            phone="+91 98401 23456",
            department=dept,
            department_code=code,
            graduation_batch="2026",
            academic_year="2025-2026",
            cgpa=cgpa,
            is_eligible=True,
            placement_status=status,
            offers_count=len(offers),
            highest_package_lpa=highest_pkg,
            accepted_company_id=accepted_cid,
        )
        db.add(stu)
        db.flush()
        total_created_students += 1

        # Applications and Offers
        for c_name, role, lpa, is_acc in offers:
            c_obj = company_objs.get(c_name)
            if c_obj:
                # Add application record
                app = JobApplication(
                    student_id=stu.id,
                    company_id=c_obj.id,
                    role=role,
                    stage="Selected",
                    applied_date=datetime.now(timezone.utc) - timedelta(days=45),
                )
                db.add(app)

                # Add offer record
                offer_status_str = "Offer Accepted" if is_acc else "Offer Released"
                off = PlacementOffer(
                    student_id=stu.id,
                    company_id=c_obj.id,
                    role=role,
                    package_lpa=lpa,
                    offer_date=datetime.now(timezone.utc) - timedelta(days=20),
                    offer_status=offer_status_str,
                    is_accepted=is_acc,
                    notes="Verified campus selection",
                )
                db.add(off)
                total_created_offers += 1

    # Add historical cohorts: 2024-2025 (22 students) & 2023-2024 (18 students)
    hist_cohorts = [
        ("2024-2025", "2025", 22, 16, 5.8, 18.0),
        ("2023-2024", "2024", 18, 12, 5.2, 16.0),
    ]

    for ay, batch, total_count, placed_count, avg_p, max_p in hist_cohorts:
        for idx in range(1, total_count + 1):
            is_pl = (idx <= placed_count)
            d_name, d_code = departments[(idx - 1) % len(departments)]
            reg_num = f"7181{batch[-2:]}{d_code}{100 + idx}"

            stu = Student(
                register_number=reg_num,
                name=f"Alumni Student {batch}-{idx}",
                email=f"{reg_num.lower()}@srishakthi.ac.in",
                phone="+91 94432 00000",
                department=d_name,
                department_code=d_code,
                graduation_batch=batch,
                academic_year=ay,
                cgpa=round(7.0 + (idx % 25) * 0.1, 2),
                is_eligible=True,
                placement_status="Placed" if is_pl else "Not Placed",
                offers_count=1 if is_pl else 0,
                highest_package_lpa=round(avg_p + ((idx % 5) - 2) * 1.2, 2) if is_pl else None,
            )
            db.add(stu)
            db.flush()
            total_created_students += 1

            if is_pl:
                # Assign to TCS, Infosys, Zoho, or Amazon
                hist_comps = ["Tata Consultancy Services (TCS)", "Infosys", "Zoho Corporation", "Amazon"]
                chosen_comp_name = hist_comps[idx % len(hist_comps)]
                comp_obj = company_objs[chosen_comp_name]
                stu.accepted_company_id = comp_obj.id

                off = PlacementOffer(
                    student_id=stu.id,
                    company_id=comp_obj.id,
                    role="Associate Software Engineer",
                    package_lpa=stu.highest_package_lpa or avg_p,
                    offer_date=datetime(int(batch) - 1, 11, 15, tzinfo=timezone.utc),
                    offer_status="Offer Accepted",
                    is_accepted=True,
                )
                db.add(off)
                total_created_offers += 1

    db.commit()

    return {
        "students": total_created_students,
        "companies": len(company_objs),
        "offers": total_created_offers,
    }
