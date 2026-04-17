from dotenv import load_dotenv
import os
load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_groq import ChatGroq
from parsers.schemas import ResumeMatch

# ===============================
# Parser
# ===============================
parser = PydanticOutputParser(
    pydantic_object=ResumeMatch
)

# ===============================
# Prompt
# ===============================
prompt = PromptTemplate(
    input_variables=[
        "context",
        "job_skills",
        "job_certifications",
        "format_instructions"
    ],
    template="""
You are an expert resume matcher.

Task:
Compare resume with job requirements.

Rules:

Skills:
- strengths = job skills found in resume
- missingSkills = job skills NOT found

Certifications:
- missingCertifications = required certifications NOT found

IMPORTANT:
Do NOT invent skills.
Do NOT return resume data.
Return JSON ONLY.

{format_instructions}

Resume:
{context}

Job Skills:
{job_skills}

Required Certifications:
{job_certifications}
"""
)

# ===============================
# LLM
# ===============================
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",
    temperature=0
)

chain = prompt | llm | parser


# ===============================
# Match Resume Function
# ===============================
def match_resume(context: str, job_data: dict) -> dict:

    # ===============================
    # Safety Checks
    # ===============================

    if not context:
        return {
            "matchScore": 0,
            "missingSkills": [],
            "missingCertifications": [],
            "strengths": [],
            "suggestion": "Resume not uploaded"
        }

    if not job_data:
        return {
            "matchScore": 0,
            "missingSkills": [],
            "missingCertifications": [],
            "strengths": [],
            "suggestion": "Job not extracted"
        }

    print("\n📄 CONTEXT:", context[:300])
    print("\n📊 JOB DATA:", job_data)

    try:

        # ===============================
        # Invoke LLM
        # ===============================

        result = chain.invoke({
            "context": context,
            "job_skills": job_data.get("skills", []),
            "job_certifications": job_data.get("certifications", []),
            "format_instructions": parser.get_format_instructions()
        })
        def expand_job_skills(skills):

            expanded = []

            for skill in skills:

        # Split combined skills
                parts = skill.split("/")

                for p in parts:
                    expanded.append(p.strip())

            return expanded
        # ===============================
        # ⭐ FILTER STRENGTHS
        # (Fix >100% bug)
        # ===============================

        job_skills = expand_job_skills(
            job_data.get("skills", [])
        )
        job_skills_lower = [
            skill.lower()
            for skill in job_skills
        ]

        filtered_strengths = [
            skill
            for skill in result.strengths
            if skill.lower() in job_skills_lower
        ]

        # Replace strengths
        result.strengths = filtered_strengths

        # ===============================
        # Calculate Match Score
        # ===============================

        matched_count = len(filtered_strengths)

        total_skills = len(job_skills)

        if total_skills > 0:

            result.matchScore = int(
                (matched_count / total_skills) * 100
            )

        else:

            result.matchScore = 0

        # ===============================
        # Calculate Missing Skills
        # ===============================

        missing_skills = [
            skill
            for skill in job_skills
            if skill.lower()
            not in [
                s.lower()
                for s in filtered_strengths
            ]
        ]

        result.missingSkills = missing_skills

        return result.dict()

    except Exception as e:

        print("\n❌ Parsing failed:", e)

        # ===============================
        # Fallback Raw LLM
        # ===============================

        raw = (prompt | llm).invoke({
            "context": context,
            "job_skills": job_data.get("skills", []),
            "job_certifications": job_data.get("certifications", []),
            "format_instructions": parser.get_format_instructions()
        })

        output = raw.content.strip()

        print("\n🧾 RAW OUTPUT:\n", output)

        import re
        import json

        # Remove markdown
        if "```" in output:

            output = output.split("```")[1]

        # Extract JSON safely
        match = re.search(
            r'\{.*?\}',
            output,
            re.DOTALL
        )

        if match:

            output = match.group(0)

        print("\n🧾 CLEANED OUTPUT:\n", output)

        try:

            parsed = json.loads(output)

            job_skills = job_data.get("skills", [])

            job_skills_lower = [
                skill.lower()
                for skill in job_skills
            ]

            filtered_strengths = [
                skill
                for skill in parsed.get(
                    "strengths", []
                )
                if skill.lower()
                in job_skills_lower
            ]

            parsed["strengths"] = filtered_strengths

            matched_count = len(
                filtered_strengths
            )

            total_skills = len(job_skills)

            if total_skills > 0:

                parsed["matchScore"] = int(
                    (matched_count /
                     total_skills) * 100
                )

            else:

                parsed["matchScore"] = 0

            parsed["missingSkills"] = [
                skill
                for skill in job_skills
                if skill.lower()
                not in [
                    s.lower()
                    for s in filtered_strengths
                ]
            ]

            return parsed

        except:

            return {
                "matchScore": 0,
                "missingSkills": [],
                "missingCertifications": [],
                "strengths": [],
                "suggestion": "Parsing failed"
            }