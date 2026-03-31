# Blueprint_Viewer
AI-powered system that converts product ideas into complete, production-ready project blueprints with automated code scaffolding, human approval workflow, and downloadable project structure.


##  Overview

Blueprint Viewer is designed to transform user ideas into structured outputs using AI orchestration. It combines:

* ⚙️ Backend powered by FastAPI
* 🧠 AI orchestration using LangGraph
* 🎨 Frontend interface for interaction and visualization

The system processes user inputs, generates structured blueprints, allows human review, and produces final outputs through a modular pipeline.

---

##  Architecture

The application follows a graph-based workflow:

```
START
 ├── blueprint (AI generation)
 ├── human_review_node (optional validation)
 ├── kit_generator (final output generation)
END
```

---

## ✨ Features

*  AI-powered blueprint generation
*  Graph-based workflow using LangGraph
*  Human-in-the-loop validation
*  Modular pipeline (extendable nodes)
*  Full-stack setup (backend + frontend)
*  FastAPI backend with async support
*  Clean separation of concerns


---

## 🛠️ Tech Stack

### Backend

* FastAPI
* LangGraph
* Python (uv for dependency management)
*  MongoDB Compass for Auth
  
### Frontend

* React / Vite
* Tailwind CSS

### Others

* Uvicorn (ASGI server)
* REST API architecture

---

## 📁 Project Structure

```
InfiniteAgent/
├── backend/              # FastAPI + LangGraph logic
├── blueprintai/          # Frontend (React app)
├── .gitignore
├── pyproject.toml
├── requirements.txt
├── uv.lock
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Blueprint_Viewer.git
cd Blueprint_Viewer
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Run backend:

```bash
uvicorn app:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### 3️⃣ Frontend Setup

```bash
cd blueprintai
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔗 CORS Configuration

Ensure backend allows frontend:

```python
allow_origins = ["http://localhost:3000"]
```

---

## 🔄 Workflow Explanation

1. User submits idea via frontend
2. Backend processes input using LangGraph
3. Blueprint is generated
4. Optional human review step
5. Final kit/output is produced

---
