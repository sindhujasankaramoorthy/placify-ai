from fastapi import APIRouter
from backend.app.api.v1.endpoints.resume import router as resume_router
from backend.app.api.v1.endpoints.ats import router as ats_router

api_router = APIRouter()
api_router.include_router(resume_router, prefix="", tags=["resume"])
api_router.include_router(ats_router, prefix="", tags=["ats"])
