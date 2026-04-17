from dotenv import load_dotenv
import os
load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_groq import ChatGroq
from parsers.schemas import DecisionSupport

# ===============================
# Parser
# ===============================
parser = PydanticOutputParser(pydantic_object=DecisionSupport)

# ===============================
# Prompt (STRONG)
# ===============================
prompt = PromptTemplate(
    input_variables=["match_result", "job_data", "format_instructions"],
    template="""
You are an expert career advisor.

Your task:
- Analyze match_result and job_data
- Decide if user should apply

Rules:
- shouldApply = true if matchScore >= 70
- else false
- reason must be specific
- improvements must be actionable
- encouragement should be motivating

STRICT RULES:
- Return ONLY valid JSON
- DO NOT add explanation
- DO NOT add notes
- DO NOT add text after JSON

Example:
{{
  "shouldApply": true,
  "reason": "Strong match with required skills",
  "improvements": [],
  "encouragement": "You are a great fit!"
}}

{format_instructions}

Match Result:
{match_result}

Job Data:
{job_data}
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

# ===============================
# Chain
# ===============================
chain = prompt | llm | parser


# ===============================
# Function
# ===============================
def get_advice(match_result: dict, job_data: dict) -> dict:

    # ✅ Safety check
    if not match_result:
        return {
            "shouldApply": False,
            "reason": "Match result not available",
            "improvements": [],
            "encouragement": "Please try again"
        }

    if not job_data:
        return {
            "shouldApply": False,
            "reason": "Job data not available",
            "improvements": [],
            "encouragement": "Please try again"
        }

    try:
        result = chain.invoke({
            "match_result": match_result,
            "job_data": job_data,
            "format_instructions": parser.get_format_instructions()
        })

        return result.dict()

    except Exception as e:
        print("❌ Advice parsing failed:", e)

        # 🔥 fallback: raw LLM
        raw = (prompt | llm).invoke({
            "match_result": match_result,
            "job_data": job_data,
            "format_instructions": parser.get_format_instructions()
        })

        output = raw.content.strip()
        print("🧾 RAW OUTPUT:", output)

        # ===============================
        # CLEAN OUTPUT
        # ===============================
        import re

        # remove markdown
        if "```" in output:
            output = output.split("```")[1]

        # extract JSON safely
        match = re.search(r'\{.*\}', output, re.DOTALL)

        if match:
            output = match.group(0)

        print("🧾 CLEANED OUTPUT:", output)

        # ===============================
        # FINAL PARSE
        # ===============================
        import json
        try:
            return json.loads(output)
        except:
            return {
                "shouldApply": False,
                "reason": "Parsing failed",
                "improvements": [],
                "encouragement": "Try again"
            }