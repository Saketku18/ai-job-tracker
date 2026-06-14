# JobTrack — AI Powered Job Application Tracker

A full stack web application to track job applications with an AI powered resume analyzer built using React, Node.js, MongoDB, Python, LangChain, and Groq.

---

## Project Structure

```
job-tracker/
├── client/          # React frontend
├── server/          # Node.js backend
└── python-ai/       # Python AI microservice
```

---

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Custom CSS (dark theme)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Access Token + Refresh Token)
- bcrypt

### AI Service
- Python + FastAPI
- LangChain
- Groq (llama-3.1-8b-instant) — free LLM
- FAISS — vector store for RAG
- HuggingFace Embeddings
- Pydantic output parsers

---

## Features

### Job Tracker
- Register and login with JWT authentication
- Add job applications with role, company, location, skills
- Kanban board with 4 columns — Applied, Interview, Offer, Rejected
- Move applications between columns by changing status
- Delete applications
- Search applications by role or company
- Stats — Total, Applied, Interviews, Offers

### AI Resume Analyzer
- Upload resume PDF
- Paste job description
- Extract structured data from job description using AI
- Match resume against job description using RAG pipeline
- Get career advice — should apply or not

---

## AI Architecture

```
React Frontend
      ↓
Node.js Backend (port 5000)
      ↓
Python FastAPI AI Service (port 8000)
      ↓
Groq LLM — llama-3.1-8b-instant
      ↓
FAISS Vector Store (RAG)
```

### AI Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /upload-resume | Upload resume PDF |
| POST | /extract | Extract job data from JD |
| POST | /match | Match resume with JD |
| POST | /advise | Get career advice |

---

## Getting Started

### Prerequisites

- Node.js v18+
- Python 3.10+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in `server/`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

### 4. Setup Python AI Service

```bash
cd python-ai
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux
```

Install packages:

```bash
pip install fastapi uvicorn langchain langchain-groq langchain-community langchain-text-splitters langchain-core faiss-cpu sentence-transformers pypdf pydantic python-dotenv
```

Create `.env` file in `python-ai/`:

```
GROQ_API_KEY=your_groq_api_key
```

Run AI service:

```bash
uvicorn main:app --reload --port 8000
```

AI service runs on `http://localhost:8000`

---

### 5. MongoDB Atlas Setup

1. Go to MongoDB Atlas
2. Create a cluster
3. Get connection string
4. Go to Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
5. Paste connection string in server `.env`

---

## Running the Full Project

Open 3 terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev

# Terminal 3 — AI Service
cd python-ai
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Then open `http://localhost:5173` in browser.

---

## Folder Structure

### Backend
```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── application.controller.js
│   └── ai.controller.js
├── models/
│   ├── User.js
│   └── Application.js
├── routes/
│   ├── auth.routes.js
│   ├── application.routes.js
│   └── ai.routes.js
├── middleware/
│   └── auth.middleware.js
├── ai/
│   ├── extractor.js
│   └── prompts.js
├── app.js
└── server.js
```

### Frontend
```
client/
└── src/
    ├── components/
    │   ├── Navbar.jsx
    │   ├── KanbanBoard.jsx
    │   ├── ApplicationCard.jsx
    │   └── AddApplicationModal.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   └── AIAnalyzer.jsx
    ├── services/
    │   └── api.js
    └── App.jsx
```

### AI Service
```
python-ai/
├── chains/
│   ├── extractor.py
│   ├── matcher.py
│   └── advisor.py
├── parsers/
│   └── schemas.py
├── utils/
│   ├── pdf_reader.py
│   └── vectorstore.py
└── main.py
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications | Get all applications |
| POST | /api/applications | Create application |
| PUT | /api/applications/:id | Update application |
| DELETE | /api/applications/:id | Delete application |

### AI Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /upload-resume | Upload resume PDF |
| POST | /extract | Extract job description data |
| POST | /match | Match resume with job |
| POST | /advise | Get career advice |

---

## How AI Works

### 1. Job Description Extraction
```
User pastes job description
        ↓
LangChain PromptTemplate formats input
        ↓
Groq LLM (llama-3.1-8b-instant) processes
        ↓
Pydantic Output Parser validates JSON
        ↓
Returns: role, company, location, skills, experience, salary
```

### 2. Resume Matching (RAG Pipeline)
```
User uploads resume PDF
        ↓
PyPDFLoader reads text
        ↓
RecursiveCharacterTextSplitter splits into chunks
        ↓
HuggingFace Embeddings converts to vectors
        ↓
FAISS stores vectors locally
        ↓
Job description used to retrieve relevant chunks
        ↓
LLM compares resume chunks with JD
        ↓
Returns: matchScore, missingSkills, strengths, suggestion
```

### 3. Career Advice
```
Resume chunks + Job data
        ↓
LLM analyzes match
        ↓
Returns: shouldApply, reason, improvements, encouragement
```

---

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
```

### python-ai/.env
```
GROQ_API_KEY=
```

---

## Author

**Saket Kumar**
- GitHub: github.com/Saketku18
- Email: saket123yadav@gmail.com
- LinkedIn: linkedin.com/in/saket-kumar-8a571628b

---

## License

MIT License
