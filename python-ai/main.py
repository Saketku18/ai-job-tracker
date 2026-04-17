from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil

from chains.extractor import extract_job
from chains.matcher import match_resume
from chains.advisor import get_advice
from utils.pdf_reader import get_retriever

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
@app.post("/upload-resume")
def upload_resume(file: UploadFile = File(...)):

    with open("resume.pdf", "wb") as f:

        shutil.copyfileobj(file.file, f)

    retriever = get_retriever("resume.pdf")

    resume_context_store.clear()

    resume_context_store["retriever"] = retriever

    return {
        "success": True,
        "message": "Resume uploaded successfully"
    }
# ===============================
# Extract Job
# ===============================
@app.post("/extract")
def extract(data: dict):
    # Clean special characters
    jd = data["job_description"]

    jd = jd.replace("–", "-").replace("—", "-")

    jd = jd.encode("ascii", "ignore").decode()
    job_data = extract_job(jd)
    job_data_store["job"] = job_data

    print("✅ JOB STORED:", job_data)
    return {"success": True, "data": job_data}
# ===============================
# Match Resume
# ===============================
@app.post("/match")
def match():

    retriever = resume_context_store.get("retriever")
    job_data = job_data_store.get("job")   # ✅ ADD THIS

    # safety check
    if not retriever:
        return {"error": "Resume not uploaded"}

    if not job_data:
        return {"error": "Job not extracted"}

    query = ", ".join(job_data["skills"])

    docs = retriever.invoke(query)

    context = "\n".join([doc.page_content for doc in docs])

    result = match_resume(context, job_data)

    return {"success": True, "data": result}
# ===============================
# Advise
# ===============================
@app.post("/advise")
def advise():

    retriever = resume_context_store.get("retriever")
    job_data = job_data_store.get("job")

    if not retriever or not job_data:
        return {"error": "Missing data"}

    query = ", ".join(job_data["skills"])
    docs = retriever.invoke(query)

    context = "\n".join([doc.page_content for doc in docs])

    match_result = match_resume(context, job_data)

    advice = get_advice(match_result, job_data)

    return {"success": True, "data": advice}