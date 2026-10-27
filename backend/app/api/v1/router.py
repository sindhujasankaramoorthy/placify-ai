from fastapi import APIRouter
from backend.app.api.v1.endpoints.resume import router as resume_router
from backend.app.api.v1.endpoints.ats import router as ats_router
from backend.app.api.v1.endpoints.admin_placements import router as admin_placements_router

api_router = APIRouter()
api_router.include_router(resume_router, prefix="", tags=["resume"])
api_router.include_router(ats_router, prefix="", tags=["ats"])
api_router.include_router(admin_placements_router, prefix="", tags=["admin-placements"])

