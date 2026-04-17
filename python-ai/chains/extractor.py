from dotenv import load_dotenv
import os
load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_groq import ChatGroq
from parsers.schemas import JobExtraction
from utils.json_parser import safe_parse

parser = PydanticOutputParser(pydantic_object=JobExtraction)

prompt = PromptTemplate(
    input_variables=["job_description", "format_instructions"],
    template="""
You are an expert job description parser.

Extract structured information.

Return ONLY JSON.

Example:
Input: Hiring React Developer at Zepto Bangalore. 3+ years. Salary 20LPA.
Output:
{{
  "role": "React Developer",
  "company": "Zepto",
  "location": "Bangalore",
  "skills": ["React"],
  "experience": "3+ years",
  "salary": "20LPA"
}}

{format_instructions}

Job Description:
{job_description}
"""
)

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",
    temperature=0
)

chain = prompt | llm | parser


def extract_job(job_description: str) -> dict:
    try:
        result = chain.invoke({
            "job_description": job_description,
            "format_instructions": parser.get_format_instructions()
        })
        return result.dict()
    except Exception as e:
        # Retry with cleaned text
        cleaned = job_description.replace("–", "-").replace("—", "-")
        cleaned = cleaned.encode("ascii", "ignore").decode() 
        result = chain.invoke({
            "job_description": cleaned,
            "format_instructions": parser.get_format_instructions()
        })
        return result.dict()