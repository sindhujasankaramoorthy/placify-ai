export interface PreviousYearComparison {
  has_comparison: boolean;
  previous_academic_year?: string | null;
  placed_change_pct?: number | null;
  offers_change_pct?: number | null;
  avg_package_change_pct?: number | null;
  placement_rate_change_pct?: number | null;
}

export interface PlacementSummary {
  academic_year: string;
  total_eligible_students: number;
  students_placed: number;
  students_not_placed: number;
  placement_percentage: number;
  total_companies_recruiting: number;
  total_offers_received: number;
  students_multiple_offers: number;
  highest_package_lpa: number;
  average_package_lpa: number;
  median_package_lpa: number;
  comparison: PreviousYearComparison;
  last_updated: string;
}

export interface CompanyPlacementStat {
  company_id: number;
  company_name: string;
  industry: string;
  tier: string;
  recruitment_drive: string;
  academic_year: string;
  eligible_students: number;
  students_applied: number;
  students_shortlisted: number;
  students_selected: number;
  unique_students_placed: number;
  total_offers: number;
  average_package_lpa: number;
  highest_package_lpa: number;
  conversion_rate: number;
}

export interface CompanyListResponse {
  items: CompanyPlacementStat[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CompanyPlacedStudent {
  student_id: number;
  name: string;
  register_number: string;
  department: string;
  department_code: string;
  graduation_batch: string;
  email: string;
  role: string;
  package_lpa: number;
  selection_date?: string | null;
  offer_status: string;
  is_accepted: boolean;
  drive_title?: string | null;
}

export interface CompanyStudentsResponse {
  company_id: number;
  company_name: string;
  industry: string;
  academic_year: string;
  total_placed_students: number;
  students: CompanyPlacedStudent[];
}

export interface StudentPlacementRecord {
  student_id: number;
  name: string;
  register_number: string;
  department: string;
  department_code: string;
  graduation_batch: string;
  email: string;
  phone?: string | null;
  cgpa: number;
  company_name?: string | null;
  job_role?: string | null;
  recruitment_drive?: string | null;
  selection_date?: string | null;
  offer_status?: string | null;
  package_lpa?: number | null;
  number_of_offers: number;
  placement_status: string;
  is_accepted_offer: boolean;
}

export interface StudentListResponse {
  items: StudentPlacementRecord[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface OfferItem {
  id: number;
  company_name: string;
  industry: string;
  role: string;
  package_lpa: number;
  offer_date: string;
  offer_status: string;
  is_accepted: boolean;
  notes?: string | null;
}

export interface ApplicationItem {
  id: number;
  company_name: string;
  role: string;
  stage: string;
  applied_date: string;
}

export interface StudentDetailProfile {
  student_id: number;
  name: string;
  register_number: string;
  department: string;
  department_code: string;
  graduation_batch: string;
  academic_year: string;
  email: string;
  phone?: string | null;
  cgpa: number;
  is_eligible: boolean;
  placement_status: string;
  offers_count: number;
  highest_package_lpa?: number | null;
  accepted_company?: string | null;
  offers: OfferItem[];
  applications: ApplicationItem[];
}

export interface CompanyChartItem {
  company: string;
  placed_students: number;
  total_offers: number;
  avg_package: number;
  company_id: number;
}

export interface DepartmentChartItem {
  department: string;
  department_code: string;
  eligible: number;
  placed: number;
  placement_percentage: number;
  avg_package: number;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PackageDistributionItem {
  bracket: string;
  count: number;
  percentage: number;
}

export interface AcademicYearTrendItem {
  academic_year: string;
  placement_percentage: number;
  total_offers: number;
  average_package: number;
  students_placed: number;
}

export interface TopCompanyItem {
  company_id: number;
  company: string;
  industry: string;
  unique_placed: number;
  total_offers: number;
  highest_package: number;
  avg_package: number;
}

export interface PlacementAnalyticsResponse {
  academic_year: string;
  company_chart: CompanyChartItem[];
  department_chart: DepartmentChartItem[];
  status_distribution: StatusDistributionItem[];
  package_distribution: PackageDistributionItem[];
  academic_year_trend: AcademicYearTrendItem[];
  top_companies: TopCompanyItem[];
}

export interface PlacementFilters {
  academic_year?: string;
  department?: string;
  company_id?: number;
  placement_status?: string;
  min_package?: number;
  max_package?: number;
  multiple_offers_only?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

import { getActiveUser } from "@/lib/auth";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api/v1";

function getAdminAuthHeaders(): Record<string, string> {
  const user = getActiveUser();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token || "placify_admin_token"}`,
  };
}


export async function fetchPlacementSummary(filters: PlacementFilters = {}): Promise<PlacementSummary> {
  const params = new URLSearchParams();
  if (filters.academic_year) params.append("academic_year", filters.academic_year);
  if (filters.department) params.append("department", filters.department);
  if (filters.company_id) params.append("company_id", String(filters.company_id));

  const res = await fetch(`${API_BASE_URL}/admin/placements/summary?${params.toString()}`, {
    method: "GET",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch placement summary: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCompanyPlacements(filters: PlacementFilters = {}): Promise<CompanyListResponse> {
  const params = new URLSearchParams();
  if (filters.academic_year) params.append("academic_year", filters.academic_year);
  if (filters.department) params.append("department", filters.department);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.sort_order) params.append("sort_order", filters.sort_order);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  const res = await fetch(`${API_BASE_URL}/admin/placements/companies?${params.toString()}`, {
    method: "GET",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch company placements: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCompanyStudents(companyId: number, academicYear?: string): Promise<CompanyStudentsResponse> {
  const params = new URLSearchParams();
  if (academicYear) params.append("academic_year", academicYear);

  const res = await fetch(`${API_BASE_URL}/admin/placements/companies/${companyId}/students?${params.toString()}`, {
    method: "GET",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch company students: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchStudentRegister(filters: PlacementFilters = {}): Promise<StudentListResponse> {
  const params = new URLSearchParams();
  if (filters.academic_year) params.append("academic_year", filters.academic_year);
  if (filters.department) params.append("department", filters.department);
  if (filters.company_id) params.append("company_id", String(filters.company_id));
  if (filters.placement_status) params.append("placement_status", filters.placement_status);
  if (filters.min_package !== undefined) params.append("min_package", String(filters.min_package));
  if (filters.max_package !== undefined) params.append("max_package", String(filters.max_package));
  if (filters.multiple_offers_only) params.append("multiple_offers_only", "true");
  if (filters.search) params.append("search", filters.search);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.sort_order) params.append("sort_order", filters.sort_order);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));

  const res = await fetch(`${API_BASE_URL}/admin/placements/students?${params.toString()}`, {
    method: "GET",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch student register: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchStudentDetail(studentId: number): Promise<StudentDetailProfile> {
  const res = await fetch(`${API_BASE_URL}/admin/placements/students/${studentId}`, {
    method: "GET",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch student details: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchPlacementAnalytics(academicYear?: string, department?: string): Promise<PlacementAnalyticsResponse> {
  const params = new URLSearchParams();
  if (academicYear) params.append("academic_year", academicYear);
  if (department) params.append("department", department);

  const res = await fetch(`${API_BASE_URL}/admin/placements/analytics?${params.toString()}`, {
    method: "GET",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch placement analytics: ${res.statusText}`);
  }
  return res.json();
}

export function getExportDownloadUrl(exportType: "students" | "companies" | "departments", academicYear?: string, department?: string, placementStatus?: string): string {
  const params = new URLSearchParams();
  params.append("export_type", exportType);
  if (academicYear) params.append("academic_year", academicYear);
  if (department) params.append("department", department);
  if (placementStatus) params.append("placement_status", placementStatus);

  return `${API_BASE_URL}/admin/placements/export?${params.toString()}`;
}

export async function triggerDemoDataSeed(): Promise<{ status: string; message: string; seeded_counts: Record<string, number> }> {
  const res = await fetch(`${API_BASE_URL}/admin/placements/seed`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to seed data: ${res.statusText}`);
  }
  return res.json();
}
