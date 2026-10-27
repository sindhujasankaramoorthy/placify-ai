from backend.app.schemas.user import UserBase, UserCreate, UserUpdate, UserResponse
from backend.app.schemas.resume import (
    ResumeCreateSchema,
    ResumeUpdateSchema,
    ResumeResponseSchema,
    ResumeContentSchema,
    AITailorRequestSchema,
    AITailorResponseSchema,
)

from backend.app.schemas.ats import (
    ATSJobPresetSchema,
    ATSPresetsResponseSchema,
    ATSScanRequestSchema,
    ATSScanResultSchema,
    ATSScanResponseSchema,
    ATSHistoryItemSchema,
    ATSHistoryResponseSchema,
)

__all__ = [
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "ResumeCreateSchema",
    "ResumeUpdateSchema",
    "ResumeResponseSchema",
    "ResumeContentSchema",
    "AITailorRequestSchema",
    "AITailorResponseSchema",
    "ATSJobPresetSchema",
    "ATSPresetsResponseSchema",
    "ATSScanRequestSchema",
    "ATSScanResultSchema",
    "ATSScanResponseSchema",
    "ATSHistoryItemSchema",
    "ATSHistoryResponseSchema",
    "PlacementSummaryResponse",
    "CompanyPlacementStat",
    "CompanyListResponse",
    "CompanyStudentsResponse",
    "StudentPlacementRecord",
    "StudentListResponse",
    "StudentDetailProfile",
    "PlacementAnalyticsResponse",
    "SeedResponse",
]

from backend.app.schemas.placement import (
    PlacementSummaryResponse,
    CompanyPlacementStat,
    CompanyListResponse,
    CompanyStudentsResponse,
    StudentPlacementRecord,
    StudentListResponse,
    StudentDetailProfile,
    PlacementAnalyticsResponse,
    SeedResponse,
)

