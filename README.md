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
<img width="949" height="455" alt="BP9" src="https://github.com/user-attachments/assets/654780ba-92b1-4a5d-b172-1e7fa249b57e" />

<img width="956" height="508" alt="BP1" src="https://github.com/user-attachments/assets/09545694-420b-4fa4-b1ee-ef95967993bb" />

<img width="958" height="515" alt="BP2" src="https://github.com/user-attachments/assets/db09ff43-a091-49fa-bc36-21bae409080b" />

<img width="956" height="509" alt="BP3" src="https://github.com/user-attachments/assets/719cf647-3883-40a7-8217-ed0245961b4c" />

<img width="957" height="504" alt="BP4" src="https://github.com/user-attachments/assets/53f4f6fa-856e-490a-95d1-f092eea8c24b" />

<img width="958" height="496" alt="BP5" src="https://github.com/user-attachments/assets/b9ae42ce-92cb-45d3-a0f9-f91411e7254d" />

<img width="958" height="503" alt="BP6" src="https://github.com/user-attachments/assets/458e97c5-5fbb-41f6-995c-17e1f6fd512b" />

<img width="955" height="500" alt="BP7" src="https://github.com/user-attachments/assets/b7e42665-f224-422c-ac7c-56595acebf87" />

<img width="959" height="506" alt="BP8" src="https://github.com/user-attachments/assets/ff2ff6d7-c9dd-4dc9-8c07-c63357b8aa5f" />









