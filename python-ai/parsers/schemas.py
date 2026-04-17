from pydantic import BaseModel, Field
from typing import List, Optional


class JobExtraction(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: Optional[str] = None
    salary: Optional[str] = None


class ResumeMatch(BaseModel):

    matchScore: int

    strengths: List[str]

    missingSkills: List[str]

    missingCertifications: List[str] = []   # ⭐ ADD THIS

    suggestion: str
class DecisionSupport(BaseModel):
    shouldApply: bool = Field(description="True if candidate should apply")
    reason: str = Field(description="Why they should or should not apply")
    improvements: List[str] = Field(description="Things to improve before applying")
    encouragement: str = Field(description="Motivational one liner for the candidate")