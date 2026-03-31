from fastapi import FastAPI
from backend.routes import chat, auth
from fastapi.responses import FileResponse
import os

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(chat.router, prefix="/api")

@app.get("/download/{thread_id}.zip")
def download_zip(thread_id: str):
    file_path = f"./generated/{thread_id}.zip"

    if not os.path.exists(file_path):
        return {"error": "File not found"}

    return FileResponse(
        path=file_path,
        media_type="application/zip",
        filename=f"{thread_id}.zip"
    )