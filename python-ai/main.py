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

        with open("resume.txt", "w", encoding="utf-8") as f:
            f.write(resume_text)

        return {
            "success": True,
            "message": "Resume uploaded successfully"
        }

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        return {"error": str(e)}
    

from fastapi import Request

@app.post("/extract")
async def extract(request: Request):

    import json

    try:
        data = await request.json()

        jd = (
            data.get("text")
            or data.get("job_description")
            or ""
        )

    except:
        jd = await request.body()
        jd = jd.decode("utf-8")

    if not jd.strip():
        return {
            "success": False,
            "message": "Job description missing"
        }

    jd = jd.replace("–", "-").replace("—", "-")

    job_data = extract_job(jd)

    with open("job.json", "w") as f:
        json.dump(job_data, f)

    print("✅ JOB STORED:", job_data)

    return {
        "success": True,
        "data": job_data
    }
# Match Resume
# ===============================
@app.post("/match")
def match():
    import json
    import os
    from fastapi.responses import JSONResponse

    if not os.path.exists("resume.txt"):
        return JSONResponse(status_code=400, content={"error": "Resume not uploaded. Please upload a resume first."})

    if not os.path.exists("job.json"):
        return JSONResponse(status_code=400, content={"error": "Job description not extracted. Please enter a job description first."})

    try:
        with open("resume.txt", "r", encoding="utf-8") as f:
            resume_text = f.read()

        with open("job.json", "r", encoding="utf-8") as f:
            job_data = json.load(f)

        if not resume_text.strip():
            return JSONResponse(status_code=400, content={"error": "Resume text is empty"})

        if not job_data:
            return JSONResponse(status_code=400, content={"error": "Job data is empty"})

        result = match_resume(resume_text, job_data)
        return {"success": True, "data": result}
    except Exception as e:
        print("MATCH ERROR:", str(e))
        return JSONResponse(status_code=500, content={"error": f"Match calculation failed: {str(e)}"})

# ===============================
# Advise
# ===============================
@app.post("/advise")
def advise():
    import json
    import os
    from fastapi.responses import JSONResponse

    if not os.path.exists("resume.txt") or not os.path.exists("job.json"):
        return JSONResponse(status_code=400, content={"error": "Missing resume or job description"})

    try:
        with open("resume.txt", "r", encoding="utf-8") as f:
            resume_text = f.read()

        with open("job.json", "r", encoding="utf-8") as f:
            job_data = json.load(f)

        if not resume_text.strip() or not job_data:
            return JSONResponse(status_code=400, content={"error": "Missing resume or job data"})

        match_result = match_resume(resume_text, job_data)
        advice = get_advice(match_result, job_data)
        return {"success": True, "data": advice}
    except Exception as e:
        print("ADVISE ERROR:", str(e))
        return JSONResponse(status_code=500, content={"error": f"Advice generation failed: {str(e)}"})
