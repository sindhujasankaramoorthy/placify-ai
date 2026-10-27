from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.session import Base


class Company(Base):
    __tablename__ = "placement_companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    industry = Column(String, index=True, nullable=False)  # e.g. "Software / SaaS", "Cloud / Product", "IT Services"
    tier = Column(String, default="Tier 2 / Core")         # "Super Dream", "Dream", "Core", "Mass"
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    drives = relationship("RecruitmentDrive", back_populates="company", cascade="all, delete-orphan")
    offers = relationship("PlacementOffer", back_populates="company", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="company", cascade="all, delete-orphan")


class RecruitmentDrive(Base):
    __tablename__ = "recruitment_drives"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("placement_companies.id"), nullable=False, index=True)
    title = Column(String, nullable=False)                 # e.g. "Amazon SDE Campus Drive 2025-26"
    academic_year = Column(String, index=True, nullable=False) # e.g. "2025-2026"
    drive_type = Column(String, default="On-Campus")       # "On-Campus", "Off-Campus", "Pool Campus"
    drive_date = Column(DateTime, nullable=True)
    status = Column(String, default="Completed")           # "Upcoming", "In Progress", "Completed"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    company = relationship("Company", back_populates="drives")
    offers = relationship("PlacementOffer", back_populates="drive")
    applications = relationship("JobApplication", back_populates="drive")


class Student(Base):
    __tablename__ = "placement_students"

    id = Column(Integer, primary_key=True, index=True)
    register_number = Column(String, unique=True, index=True, nullable=False) # e.g. "718122CS101"
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    department = Column(String, index=True, nullable=False)      # e.g. "Computer Science & Engineering"
    department_code = Column(String, index=True, nullable=False) # e.g. "CSE", "IT", "ECE", "AI&DS", "EEE", "MECH"
    graduation_batch = Column(String, index=True, nullable=False) # e.g. "2026"
    academic_year = Column(String, index=True, nullable=False)  # e.g. "2025-2026"
    cgpa = Column(Float, default=0.0)
    is_eligible = Column(Boolean, default=True)
    
    # Computed / Cached fields for fast lookup
    placement_status = Column(String, default="Not Placed", index=True) # "Placed", "In Progress", "Not Placed"
    offers_count = Column(Integer, default=0)
    highest_package_lpa = Column(Float, nullable=True)
    accepted_company_id = Column(Integer, ForeignKey("placement_companies.id"), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    applications = relationship("JobApplication", back_populates="student", cascade="all, delete-orphan")
    offers = relationship("PlacementOffer", back_populates="student", cascade="all, delete-orphan")
    accepted_company = relationship("Company", foreign_keys=[accepted_company_id])


class JobApplication(Base):
    __tablename__ = "placement_job_applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("placement_students.id"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("placement_companies.id"), nullable=False, index=True)
    drive_id = Column(Integer, ForeignKey("recruitment_drives.id"), nullable=True, index=True)
    role = Column(String, nullable=False)
    stage = Column(String, default="Applied", index=True) # "Applied", "Assessment", "Shortlisted", "Interview", "Selected", "Rejected", "Withdrawn"
    applied_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="applications")
    company = relationship("Company", back_populates="applications")
    drive = relationship("RecruitmentDrive", back_populates="applications")


class PlacementOffer(Base):
    __tablename__ = "placement_offers"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("placement_students.id"), nullable=False, index=True)
    company_id = Column(Integer, ForeignKey("placement_companies.id"), nullable=False, index=True)
    drive_id = Column(Integer, ForeignKey("recruitment_drives.id"), nullable=True, index=True)
    role = Column(String, nullable=False)
    package_lpa = Column(Float, nullable=False)             # In LPA, e.g. 18.0
    offer_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    offer_status = Column(String, default="Offer Released", index=True) # "Offer Accepted", "Offer Released", "Offer Declined", "Pending"
    is_accepted = Column(Boolean, default=False, index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    student = relationship("Student", back_populates="offers")
    company = relationship("Company", back_populates="offers")
    drive = relationship("RecruitmentDrive", back_populates="offers")
