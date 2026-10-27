from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ATSJobPresetSchema(BaseModel):
    id: str
    company: str
    role: str
    chipLabel: str
    badge: str
    description: str


class ATSPresetsResponseSchema(BaseModel):
    presets: List[ATSJobPresetSchema]


class ATSScanRequestSchema(BaseModel):
    jobDescription: str = Field(..., min_length=50, max_length=8500)
    resumeText: Optional[str] = None
    resumeData: Optional[Dict[str, Any]] = None


class ATSTechStackSchema(BaseModel):
    matched: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)


class ATSKeywordsSchema(BaseModel):
    matched: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)


class ATSScanResultSchema(BaseModel):
    overallScore: int = Field(ge=0, le=100)
    matchScore: int = Field(ge=0, le=100)
    formattingScore: int = Field(ge=0, le=100)
    structureScore: int = Field(ge=0, le=100)
    techStack: ATSTechStackSchema
    keywords: ATSKeywordsSchema
    sectionsFound: List[str] = Field(default_factory=list)
    sectionsMissing: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    verdict: str


class ATSScanResponseSchema(ATSScanResultSchema):
    id: int
    userId: int


class ATSHistoryItemSchema(BaseModel):
    id: int
    userId: int
    jobDescription: str
    result: Dict[str, Any]
    createdAt: str


class ATSHistoryResponseSchema(BaseModel):
    history: List[ATSHistoryItemSchema]
