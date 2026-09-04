from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PersonalInfoSchema(BaseModel):
    fullName: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    portfolio: str = ""


class EducationSchema(BaseModel):
    id: str
    institution: str = ""
    degree: str = ""
    fieldOfStudy: str = ""
    startDate: str = ""
    endDate: str = ""
    gpa: str = ""
    location: str = ""


class WorkExperienceSchema(BaseModel):
    id: str
    company: str = ""
    position: str = ""
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    isCurrent: bool = False
    bullets: List[str] = Field(default_factory=list)


class InternshipSchema(BaseModel):
    id: str
    company: str = ""
    role: str = ""
    location: str = ""
    startDate: str = ""
    endDate: str = ""
    bullets: List[str] = Field(default_factory=list)


class ProjectSchema(BaseModel):
    id: str
    title: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    githubLink: str = ""
    liveLink: str = ""
    bullets: List[str] = Field(default_factory=list)


class SkillCategorySchema(BaseModel):
    id: str
    categoryName: str = ""
    skills: List[str] = Field(default_factory=list)


class CertificationSchema(BaseModel):
    id: str
    name: str = ""
    issuer: str = ""
    issueDate: str = ""
    url: str = ""


class AchievementSchema(BaseModel):
    id: str
    title: str = ""
    description: str = ""
    date: str = ""


class LanguageSchema(BaseModel):
    id: str
    language: str = ""
    proficiency: str = "Fluent"


class ResumeContentSchema(BaseModel):
    personalInfo: PersonalInfoSchema = Field(default_factory=PersonalInfoSchema)
    summary: str = ""
    education: List[EducationSchema] = Field(default_factory=list)
    experience: List[WorkExperienceSchema] = Field(default_factory=list)
    internships: List[InternshipSchema] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    skills: List[SkillCategorySchema] = Field(default_factory=list)
    certifications: List[CertificationSchema] = Field(default_factory=list)
    achievements: List[AchievementSchema] = Field(default_factory=list)
    languages: List[LanguageSchema] = Field(default_factory=list)


class ResumeCreateSchema(BaseModel):
    title: str = "Untitled Resume"
    template_id: str = "modern"
    content: Dict[str, Any] = Field(default_factory=dict)


class ResumeUpdateSchema(BaseModel):
    title: Optional[str] = None
    template_id: Optional[str] = None
    content: Optional[Dict[str, Any]] = None


class ResumeResponseSchema(BaseModel):
    id: int
    user_id: int
    title: str
    template_id: str
    content: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AITailorRequestSchema(BaseModel):
    target_role: str
    content: Dict[str, Any]


class AITailorResponseSchema(BaseModel):
    target_role: str
    tailored_content: Dict[str, Any]
    ats_score: int
    summary_of_changes: List[str]
