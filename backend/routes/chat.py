from fastapi import APIRouter, Header
from backend.db import threads_col
from backend.auth import decode_token
from backend.Main import graph
from datetime import datetime, timezone
import uuid
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from langgraph.types import Command

router = APIRouter()
security = HTTPBearer()


@router.post("/chat")
async def chat(data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = decode_token(token)
    thread_id = data.get("thread_id") or str(uuid.uuid4())

    # LangGraph config — thread_id ties the checkpointer state to this session
    config = {"configurable": {"thread_id": thread_id}}

    # Fetch existing thread from DB
    thread = await threads_col.find_one({"_id": thread_id, "user_id": user_id})

    if not thread:
        state = {
            "query": data["query"],
            "messages": []
        }
    else:
        state = dict(thread.get("state", {}))
        state["query"] = data["query"]

    result = graph.invoke(state, config=config)

    # LangGraph surfaces interrupts as __interrupt__ key in the result dict
    if result.get("__interrupt__"):
        interrupts_list = result["__interrupt__"]
        interrupt_payload = interrupts_list[0].value if interrupts_list else {}
        blueprint_data = interrupt_payload.get("blueprint")

        await threads_col.update_one(
            {"_id": thread_id},
            {
                "$set": {
                    "user_id": user_id,
                    "status": "pending_approval",
                    "blueprint": blueprint_data,
                    "state": clean_state(result),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )

        return {
            "thread_id": thread_id,
            "status": "pending_approval",
            "blueprint": blueprint_data,
            "message": interrupt_payload.get("message", "Review the blueprint and approve or reject"),
            "download_url": None
        }

    # Normal completion path
    blueprint = result.get("blueprint")
    factory_kit = result.get("FactoryKit")


    if blueprint and factory_kit:
        await threads_col.update_one(
            {"_id": thread_id},
            {
                "$set": {
                    "user_id": user_id,
                    "status": "completed",
                    "blueprint": blueprint,
                    "FactoryKit": factory_kit,
                    "state": clean_state(result),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            },
            upsert=True
        )

    return {
        "thread_id": thread_id,
        "status": "completed",
        "response": result,
        "blueprint": blueprint,
        "state": clean_state(result),
    }


@router.post("/chat/resume")
async def resume_chat(data: dict, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Resume a graph interrupted at human_review_node.
    Expects: { thread_id, action: "approve" | "reject" }
    """
    token = credentials.credentials
    user_id = decode_token(token)

    thread_id = data.get("thread_id")
    action = data.get("action")  # "approve" or "reject"

    if not thread_id or action not in ("approve", "reject"):
        raise HTTPException(status_code=400, detail="thread_id and action ('approve'|'reject') are required")

    thread = await threads_col.find_one({"_id": thread_id, "user_id": user_id})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    config = {"configurable": {"thread_id": thread_id}}

    result = graph.invoke(
        Command(resume={"action": action}),
        config=config
    )

    # Check if it interrupted again (reject loops back to blueprint regeneration)
    if result.get("__interrupt__"):
        interrupts_list = result["__interrupt__"]
        interrupt_payload = interrupts_list[0].value if interrupts_list else {}
        blueprint_data = interrupt_payload.get("blueprint")

        await threads_col.update_one(
            {"_id": thread_id},
            {
                "$set": {
                    "status": "pending_approval",
                    "blueprint": blueprint_data,
                    "state": clean_state(result),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )

        return {
            "thread_id": thread_id,
            "status": "pending_approval",
            "blueprint": blueprint_data,
            "message": interrupt_payload.get("message", "Review the updated blueprint"),
        }

    # Completed after approval
    blueprint = result.get("blueprint")
    factory_kit = result.get("FactoryKit")


    await threads_col.update_one(
        {"_id": thread_id},
        {
            "$set": {
                "status": "completed",
                "blueprint": blueprint,
                "FactoryKit": factory_kit,
                "state": clean_state(result),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )

    return {
        "thread_id": thread_id,
        "status": "completed",
        "response": result,
        "blueprint": blueprint,
    }


def clean_state(result: dict):
    clean = dict(result)
    if "__interrupt__" in clean:
        clean.pop("__interrupt__")

    return clean