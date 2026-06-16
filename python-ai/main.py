from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil

from chains.extractor import extract_job
from chains.matcher import match_resume
from chains.advisor import get_advice
from utils.pdf_reader import load_resume

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ GLOBAL STORE
job_data_store = {}
resume_context_store = {}


# ===============================
# Upload Resume
# ===============================


@app.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):
    try:

        with open("resume.pdf", "wb") as f:
            shutil.copyfileobj(file.file, f)

        documents = load_resume("resume.pdf")

        resume_text = "\n".join(
            [doc.page_content for doc in documents]
        )

        resume_context_store.clear()
        resume_context_store["resume"] = resume_text

        return {
            "success": True,
            "message": "Resume uploaded successfully"
        }

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        return {"error": str(e)}
# Match Resume
# ===============================
@app.post("/match")
def match():

    resume_text = resume_context_store.get("resume")
    job_data = job_data_store.get("job")

    if not resume_text:
        return {"error": "Resume not uploaded"}

    if not job_data:
        return {"error": "Job not extracted"}

    result = match_resume(
        resume_text,
        job_data
    )

    return {"success": True, "data": result}
# ===============================
# Advise
# ===============================
@app.post("/advise")
def advise():

    resume_text = resume_context_store.get("resume")
    job_data = job_data_store.get("job")

    if not resume_text or not job_data:
        return {"error": "Missing data"}

    match_result = match_resume(
        resume_text,
        job_data
    )

    advice = get_advice(
        match_result,
        job_data
    )

    return {"success": True, "data": advice}