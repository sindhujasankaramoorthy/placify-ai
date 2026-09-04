from datetime import datetime
from typing import List, Optional
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
    isCurrent: bool = False
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
    proficiency: str = ""


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
    content: ResumeContentSchema = Field(default_factory=ResumeContentSchema)


class ResumeUpdateSchema(BaseModel):
    title: Optional[str] = None
    template_id: Optional[str] = None
    content: Optional[ResumeContentSchema] = None
    ats_score: Optional[int] = None


class ResumeResponseSchema(BaseModel):
    id: int
    user_id: int
    title: str
    template_id: str
    content: ResumeContentSchema
    ats_score: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AITailorRequestSchema(BaseModel):
    content: ResumeContentSchema
    target_role: str = "Software Engineer"


class AITailorResponseSchema(BaseModel):
    tailored_content: ResumeContentSchema
    ats_analysis: dict

