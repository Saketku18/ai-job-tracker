# JobTrack — AI Powered Job Application Tracker

A full-stack web application to track job applications and analyze resumes using AI. Built with React, Node.js, MongoDB, FastAPI, LangChain, and Groq.

## Live Demo

Frontend: https://ai-job-tracker-weld.vercel.app

Backend API: https://jobtrack-backend-lc3f.onrender.com

AI Service: https://ai-job-tracker-s5x2.onrender.com

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Vite
* Custom Dark UI

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcrypt

### AI Service

* Python
* FastAPI
* LangChain
* Groq (llama-3.1-8b-instant)
* Pydantic
* PyPDF

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Render (AI Service)
* MongoDB Atlas

---

## Features

### Job Tracker

* User Registration & Login
* JWT Authentication
* Create Job Applications
* Update Application Status
* Delete Applications
* Search Jobs
* Application Statistics
* Kanban Workflow

### AI Resume Analyzer

* Upload Resume PDF
* Extract Structured Job Data
* Resume vs Job Matching
* Missing Skills Detection
* Strength Analysis
* AI Career Advice
* Apply / Not Apply Recommendation

---

## AI Workflow

Resume Upload
↓
PDF Text Extraction
↓
Store Resume Context
↓
Job Description Extraction
↓
AI Skill Matching
↓
Match Score Generation
↓
Career Advice

---

## AI Endpoints

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | /upload-resume | Upload Resume PDF      |
| POST   | /extract       | Extract Job Data       |
| POST   | /match         | Analyze Resume Match   |
| POST   | /advise        | Generate Career Advice |

---

## Project Structure

job-tracker/

client/ → React Frontend

server/ → Node Backend

python-ai/ → FastAPI AI Service

---

## Environment Variables

### Backend (.env)

PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

### AI Service (.env)

GROQ_API_KEY=

---

## Local Development

### Backend

npm install

npm run dev

### Frontend

npm install

npm run dev

### AI Service

pip install -r requirements.txt

uvicorn main:app --reload --port 8000

---

## Author

Saket Kumar

GitHub: https://github.com/Saketku18

LinkedIn: https://linkedin.com/in/saket-kumar-8a571628b

Email: [saket123yadav@gmail.com](mailto:saket123yadav@gmail.com)

---

## License

MIT License
