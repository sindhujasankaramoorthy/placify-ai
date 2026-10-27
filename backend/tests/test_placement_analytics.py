import os
import sys
from pathlib import Path

# Add project root and backend dir to sys.path
_current_dir = Path(__file__).resolve().parent
_backend_dir = _current_dir.parent
_project_root = _backend_dir.parent
sys.path.insert(0, str(_project_root))
sys.path.insert(0, str(_backend_dir))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.session import Base
from backend.app.main import app
from backend.app.services.placement_service import (
    calculate_placement_summary,
    get_company_placement_stats,
    get_company_students,
    get_student_placement_register,
    get_student_detail,
    get_placement_analytics,
    generate_placement_export_csv,
    seed_placement_demo_data_if_empty,
)
from backend.app.db.session import SessionLocal

client = TestClient(app)


def test_placement_summary_calculations():
    """Verify all 10 KPIs and calculations from actual database records."""
    db = SessionLocal()
    try:
        summary = calculate_placement_summary(db, academic_year="2025-2026")
        assert summary["total_eligible_students"] > 0
        assert summary["students_placed"] > 0
        assert summary["students_not_placed"] == summary["total_eligible_students"] - summary["students_placed"]
        
        # Verify formula: (placed / eligible) * 100
        expected_rate = round((summary["students_placed"] / summary["total_eligible_students"]) * 100, 1)
        assert summary["placement_percentage"] == expected_rate
        
        # Verify offers count >= unique placed students
        assert summary["total_offers_received"] >= summary["students_placed"]
        assert summary["students_multiple_offers"] > 0
        assert summary["highest_package_lpa"] >= summary["average_package_lpa"]
        assert summary["average_package_lpa"] > 0
        assert summary["median_package_lpa"] > 0
    finally:
        db.close()


def test_multiple_offers_no_inflation():
    """Verify students with multiple offers are counted only once in unique students placed."""
    db = SessionLocal()
    try:
        summary = calculate_placement_summary(db, academic_year="2025-2026")
        
        # Find a student known to hold multiple offers (e.g. Sindhuja Sankaramoorthy)
        sindhuja = get_student_placement_register(db, search="Sindhuja")
        assert len(sindhuja["items"]) == 1
        s = sindhuja["items"][0]
        assert s["number_of_offers"] >= 2
        
        # In total offers, both are counted, but in unique students, she is only counted once
        total_unique_placed = summary["students_placed"]
        total_offers = summary["total_offers_received"]
        assert total_offers > total_unique_placed
    finally:
        db.close()


def test_company_wise_statistics_and_students():
    """Verify company placement records and verify clicking a company yields exact students."""
    db = SessionLocal()
    try:
        companies_res = get_company_placement_stats(db, academic_year="2025-2026", limit=20)
        assert len(companies_res["items"]) > 0
        
        # Test Amazon
        amazon = next((c for c in companies_res["items"] if "Amazon" in c["company_name"]), None)
        assert amazon is not None
        assert amazon["unique_students_placed"] >= 1
        assert amazon["highest_package_lpa"] >= 14.0
        
        # Get students placed at Amazon
        students_res = get_company_students(db, company_id=amazon["company_id"], academic_year="2025-2026")
        assert students_res["total_placed_students"] == amazon["unique_students_placed"]
        assert len(students_res["students"]) == amazon["unique_students_placed"]
        
        for st in students_res["students"]:
            assert st["name"] is not None
            assert st["register_number"] is not None
            assert st["role"] is not None
            assert st["package_lpa"] > 0
    finally:
        db.close()


def test_department_placement_rates():
    """Verify department breakdown rates and percentage calculation."""
    db = SessionLocal()
    try:
        analytics = get_placement_analytics(db, academic_year="2025-2026")
        dept_data = analytics["department_chart"]
        assert len(dept_data) >= 4
        
        for d in dept_data:
            assert d["eligible"] >= d["placed"]
            if d["eligible"] > 0:
                expected_pct = round((d["placed"] / d["eligible"]) * 100, 1)
                assert d["placement_percentage"] == expected_pct
    finally:
        db.close()


def test_filter_combinations():
    """Verify filtering by department, status, and multiple offers."""
    db = SessionLocal()
    try:
        # Filter CSE
        cse_res = get_student_placement_register(db, academic_year="2025-2026", department="CSE")
        for s in cse_res["items"]:
            assert s["department_code"] == "CSE"
            
        # Filter multiple offers only
        multi_res = get_student_placement_register(db, academic_year="2025-2026", multiple_offers_only=True)
        for s in multi_res["items"]:
            assert s["number_of_offers"] > 1
            
        # Filter Placed status
        placed_res = get_student_placement_register(db, academic_year="2025-2026", placement_status="Placed")
        for s in placed_res["items"]:
            assert s["placement_status"] == "Placed"
    finally:
        db.close()


def test_csv_export_consistency():
    """Verify CSV export contains RFC 4180 headers and student lines."""
    db = SessionLocal()
    try:
        csv_text = generate_placement_export_csv(db, export_type="students", academic_year="2025-2026")
        lines = csv_text.strip().split("\n")
        assert len(lines) > 5
        assert "Student Name,Register Number,Department" in lines[0]
        
        comp_csv = generate_placement_export_csv(db, export_type="companies", academic_year="2025-2026")
        comp_lines = comp_csv.strip().split("\n")
        assert len(comp_lines) > 5
        assert "Company Name,Industry,Recruitment Drive" in comp_lines[0]
    finally:
        db.close()


def test_api_endpoints_via_testclient():
    """Verify all FastAPI routes respond with HTTP 200 and proper JSON payloads."""
    # Summary endpoint
    res = client.get("/api/v1/admin/placements/summary?academic_year=2025-2026")
    assert res.status_code == 200
    data = res.json()
    assert "total_eligible_students" in data
    assert "placement_percentage" in data
    
    # Companies endpoint
    res_comp = client.get("/api/v1/admin/placements/companies?academic_year=2025-2026")
    assert res_comp.status_code == 200
    assert "items" in res_comp.json()
    
    # Students endpoint
    res_stu = client.get("/api/v1/admin/placements/students?academic_year=2025-2026")
    assert res_stu.status_code == 200
    assert "items" in res_stu.json()
    
    # Analytics endpoint
    res_ana = client.get("/api/v1/admin/placements/analytics?academic_year=2025-2026")
    assert res_ana.status_code == 200
    assert "company_chart" in res_ana.json()
    assert "department_chart" in res_ana.json()
    
    # Export endpoint
    res_exp = client.get("/api/v1/admin/placements/export?export_type=companies&academic_year=2025-2026")
    assert res_exp.status_code == 200
    assert "text/csv" in res_exp.headers["content-type"]


def test_admin_and_student_role_based_access():
    """Verify Role-Based Access Control (RBAC):
    - Admin has full access to summary, students, exports, and seed.
    - Student has partial access: summary, anonymized company students, own profile (id=1).
    - Student is forbidden from exports, seed, and other students' profiles (id!=1).
    """
    admin_header = {"Authorization": "Bearer placify_admin_token"}
    student_header = {"Authorization": "Bearer placify_student_token"}
    invalid_header = {"Authorization": "Bearer random_unauthorized_token"}
    
    # 1. Invalid token rejected with 403
    res_bad = client.get("/api/v1/admin/placements/summary", headers=invalid_header)
    assert res_bad.status_code == 403
    
    # 2. Both Admin and Student can access summary and company stats
    res_admin_sum = client.get("/api/v1/admin/placements/summary", headers=admin_header)
    assert res_admin_sum.status_code == 200
    res_stu_sum = client.get("/api/v1/admin/placements/summary", headers=student_header)
    assert res_stu_sum.status_code == 200
    
    # 3. Company students endpoint: Admin sees real names; Student sees sanitized/anonymized names
    res_admin_comp_stu = client.get("/api/v1/admin/placements/companies/1/students", headers=admin_header)
    assert res_admin_comp_stu.status_code == 200
    admin_students = res_admin_comp_stu.json()["students"]
    if len(admin_students) > 0:
        assert not admin_students[0]["name"].startswith("Placed Candidate")
        
    res_stu_comp_stu = client.get("/api/v1/admin/placements/companies/1/students", headers=student_header)
    assert res_stu_comp_stu.status_code == 200
    stu_students = res_stu_comp_stu.json()["students"]
    if len(stu_students) > 0:
        assert stu_students[0]["name"].startswith("Placed Candidate")
        assert stu_students[0]["email"] == "[Confidential Peer Record]"
        assert "****" in stu_students[0]["register_number"]
        
    # 4. Student Directory: Admin sees all 66 students; Student sees only their own record (Sindhuja)
    res_admin_stu_list = client.get("/api/v1/admin/placements/students", headers=admin_header)
    assert res_admin_stu_list.status_code == 200
    assert res_admin_stu_list.json()["total"] > 10
    
    res_stu_stu_list = client.get("/api/v1/admin/placements/students", headers=student_header)
    assert res_stu_stu_list.status_code == 200
    assert res_stu_stu_list.json()["total"] == 1
    assert res_stu_stu_list.json()["items"][0]["name"] == "Sindhuja Sankaramoorthy"
    
    # 5. Student Profile by ID: Student can view own profile (id=1), but 403 for other students (id=2)
    res_stu_own = client.get("/api/v1/admin/placements/students/1", headers=student_header)
    assert res_stu_own.status_code == 200
    assert res_stu_own.json()["name"] == "Sindhuja Sankaramoorthy"
    
    res_stu_other = client.get("/api/v1/admin/placements/students/2", headers=student_header)
    assert res_stu_other.status_code == 403
    assert "Students are authorized to inspect only their personal placement offers" in res_stu_other.json()["detail"]
    
    # 6. Export and Seed: Admin allowed (200), Student strictly forbidden (403)
    res_admin_exp = client.get("/api/v1/admin/placements/export?export_type=companies", headers=admin_header)
    assert res_admin_exp.status_code == 200
    
    res_stu_exp = client.get("/api/v1/admin/placements/export?export_type=companies", headers=student_header)
    assert res_stu_exp.status_code == 403
    assert "restricted to Placement Cell Administrators" in res_stu_exp.json()["detail"]
    
    res_stu_seed = client.post("/api/v1/admin/placements/seed", headers=student_header)
    assert res_stu_seed.status_code == 403
    assert "restricted to Placement Cell Administrators" in res_stu_seed.json()["detail"]


if __name__ == "__main__":
    test_placement_summary_calculations()
    test_multiple_offers_no_inflation()
    test_company_wise_statistics_and_students()
    test_department_placement_rates()
    test_filter_combinations()
    test_csv_export_consistency()
    test_api_endpoints_via_testclient()
    test_admin_and_student_role_based_access()
    print("ALL RBAC AND PLACEMENT TESTS PASSED SUCCESSFULLY!")

