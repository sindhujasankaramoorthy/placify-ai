from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PreviousYearComparison(BaseModel):
    has_comparison: bool = False
    previous_academic_year: Optional[str] = None
    placed_change_pct: Optional[float] = None
    offers_change_pct: Optional[float] = None
    avg_package_change_pct: Optional[float] = None
    placement_rate_change_pct: Optional[float] = None


class PlacementSummaryResponse(BaseModel):
    academic_year: str
    total_eligible_students: int
    students_placed: int
    students_not_placed: int
    placement_percentage: float
    total_companies_recruiting: int
    total_offers_received: int
    students_multiple_offers: int
    highest_package_lpa: float
    average_package_lpa: float
    median_package_lpa: float
    comparison: PreviousYearComparison
    last_updated: str


class CompanyPlacementStat(BaseModel):
    company_id: int
    company_name: str
    industry: str
    tier: str
    recruitment_drive: str
    academic_year: str
    eligible_students: int
    students_applied: int
    students_shortlisted: int
    students_selected: int
    unique_students_placed: int
    total_offers: int
    average_package_lpa: float
    highest_package_lpa: float
    conversion_rate: float


class CompanyListResponse(BaseModel):
    items: List[CompanyPlacementStat]
    total: int
    page: int
    limit: int
    total_pages: int


class CompanyPlacedStudent(BaseModel):
    student_id: int
    name: str
    register_number: str
    department: str
    department_code: str
    graduation_batch: str
    email: str
    role: str
    package_lpa: float
    selection_date: Optional[str] = None
    offer_status: str
    is_accepted: bool
    drive_title: Optional[str] = None


class CompanyStudentsResponse(BaseModel):
    company_id: int
    company_name: str
    industry: str
    academic_year: str
    total_placed_students: int
    students: List[CompanyPlacedStudent]


class StudentPlacementRecord(BaseModel):
    student_id: int
    name: str
    register_number: str
    department: str
    department_code: str
    graduation_batch: str
    email: str
    phone: Optional[str] = None
    cgpa: float
    company_name: Optional[str] = None
    job_role: Optional[str] = None
    recruitment_drive: Optional[str] = None
    selection_date: Optional[str] = None
    offer_status: Optional[str] = None
    package_lpa: Optional[float] = None
    number_of_offers: int
    placement_status: str
    is_accepted_offer: bool


class StudentListResponse(BaseModel):
    items: List[StudentPlacementRecord]
    total: int
    page: int
    limit: int
    total_pages: int


class OfferItem(BaseModel):
    id: int
    company_name: str
    industry: str
    role: str
    package_lpa: float
    offer_date: str
    offer_status: str
    is_accepted: bool
    notes: Optional[str] = None


class ApplicationItem(BaseModel):
    id: int
    company_name: str
    role: str
    stage: str
    applied_date: str


class StudentDetailProfile(BaseModel):
    student_id: int
    name: str
    register_number: str
    department: str
    department_code: str
    graduation_batch: str
    academic_year: str
    email: str
    phone: Optional[str] = None
    cgpa: float
    is_eligible: bool
    placement_status: str
    offers_count: int
    highest_package_lpa: Optional[float] = None
    accepted_company: Optional[str] = None
    offers: List[OfferItem]
    applications: List[ApplicationItem]


class CompanyChartItem(BaseModel):
    company: str
    placed_students: int
    total_offers: int
    avg_package: float
    company_id: int


class DepartmentChartItem(BaseModel):
    department: str
    department_code: str
    eligible: int
    placed: int
    placement_percentage: float
    avg_package: float


class StatusDistributionItem(BaseModel):
    status: str
    count: int
    percentage: float
    color: str


class PackageDistributionItem(BaseModel):
    bracket: str
    count: int
    percentage: float


class AcademicYearTrendItem(BaseModel):
    academic_year: str
    placement_percentage: float
    total_offers: int
    average_package: float
    students_placed: int


class TopCompanyItem(BaseModel):
    company_id: int
    company: str
    industry: str
    unique_placed: int
    total_offers: int
    highest_package: float
    avg_package: float


class PlacementAnalyticsResponse(BaseModel):
    academic_year: str
    company_chart: List[CompanyChartItem]
    department_chart: List[DepartmentChartItem]
    status_distribution: List[StatusDistributionItem]
    package_distribution: List[PackageDistributionItem]
    academic_year_trend: List[AcademicYearTrendItem]
    top_companies: List[TopCompanyItem]


class SeedResponse(BaseModel):
    status: str
    message: str
    seeded_counts: Dict[str, int]
