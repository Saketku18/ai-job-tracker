# 🤖 AI Job Tracker

An AI-powered Job Tracker that automatically extracts job details from job descriptions and helps track applications efficiently using modern AI and full-stack technologies.

---

## 🚀 Features

* 🔍 **AI Job Extraction**
  Automatically extracts:

  * Job Role
  * Company Name
  * Skills Required
  * Experience Required

* 📂 **Job Tracking System**
  Store and manage applied jobs.

* 🧠 **Semantic Search (FAISS)**
  Uses embeddings to search job descriptions intelligently.

* 🌐 **Full-Stack Application**

  * Frontend for managing job entries
  * Backend API for processing data
  * AI pipeline for extracting job information

* 🔐 **Secure API Handling**
  API keys stored using `.env`.

---

## 🏗️ Project Structure

```
ai-job-tracker/
│
├── client/              # Frontend (React)
│
├── server/              # Backend (Python)
│
├── faiss_index/         # Vector database (ignored in Git)
│
├── requirements.txt     # Python dependencies
│
├── .gitignore
│
└── README.md
```

---

## 🧰 Tech Stack

### Frontend

* React.js
* JavaScript
* CSS / Tailwind

### Backend

* Python
* FastAPI / Flask

### AI / ML

* LangChain
* FAISS
* LLM API (Groq / OpenAI)

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```
git clone https://github.com/Saketku18/ai-job-tracker.git
cd ai-job-tracker
```

---

### 2️⃣ Setup Python Environment

```
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

---

### 3️⃣ Create `.env`

Create a file:

```
.env
```

Add:

```
API_KEY=your_api_key_here
```

---

### 4️⃣ Run Backend

```
cd server
python app.py
```

---

### 5️⃣ Run Frontend

```
cd client
npm install
npm start
```

---

## 🧠 How It Works

1. User inputs job description
2. AI extracts structured job details
3. Data stored in database
4. FAISS enables semantic search
5. User tracks job applications easily

---

## 📦 Future Improvements

* Resume-job matching
* Job recommendations
* Interview preparation assistant
* Email notifications
* Cloud deployment

## 👨‍💻 Author

**Saket Kumar**

GitHub:
https://github.com/Saketku18

---

## ⭐ Project Highlights

This project demonstrates:

* AI-powered data extraction
* Vector database usage (FAISS)
* Full-stack development
* Real-world application design

Useful for:

* Software Developer roles
* AI/ML roles
* Full Stack Developer roles

---

## 📜 License

This project is licensed under the MIT License.
