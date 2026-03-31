# BlueprintAI Frontend

React + Vite + Tailwind v4 frontend for the BlueprintAI FastAPI backend.

## Setup

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

## Backend requirement

Add CORS to your FastAPI `app.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import chat, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(chat.router, prefix="/api")
```

Then run backend:
```bash
uvicorn backend.app:app --reload --port 8000
```

## Project structure

```
src/
├── pages/
│   ├── Login.jsx       → POST /auth/login
│   ├── Register.jsx    → POST /auth/register
│   └── Dashboard.jsx   → 3-panel layout
├── components/
│   ├── Sidebar.jsx     → Thread history from store
│   ├── ChatPanel.jsx   → POST /api/chat with JWT
│   └── BlueprintViewer.jsx → Renders full Usecaseeval schema
├── store/
│   └── useStore.js     → Zustand: auth, threads, blueprint, messages
└── lib/
    ├── api.js          → Axios with JWT interceptor
    └── utils.js        → cn()
```

## API mapping

| Frontend call | Backend endpoint | Notes |
|---|---|---|
| POST /auth/login | auth.py `/login` | Returns `{ token }` |
| POST /auth/register | auth.py `/register` | Returns `{ token }` |
| POST /api/chat | chat.py `/chat` | Bearer token, `{ query, thread_id? }` |

The chat response `result["messages"]` is scanned for ToolMessage objects
containing `Blueprintservicerespone` JSON — this is what BlueprintViewer renders.
