import os
import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from backend.Orchestration import Orchestration
from pydantic import BaseModel
from typing import List, Dict, Any


class FileSpec(BaseModel):
    description: str
    responsibilities: List[str]


class FolderStructure(BaseModel):
    folder_structure: Dict[str, Any] # flexible nested structure


class APISpec(BaseModel):
    endpoint: str
    method: str
    request: Dict[str, Any]
    response: Dict[str, Any]


class DatabaseSchema(BaseModel):
    tables: List[Dict[str, Any]]


class BuildStep(BaseModel):
    step: str
    description: str


class FactoryKitSchema(BaseModel):
    architecture: Dict[str, Any]
    tech_stack: Dict[str, Any]
    folder_structure: Dict[str, Any]
    modules: List[Dict[str, Any]]
    api_design: List[APISpec]
    database_schema: DatabaseSchema
    build_plan: List[BuildStep]
    deployment: Dict[str, Any]

# -------------------------------
# LLM CONFIG
# -------------------------------
llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    api_key=os.environ.get("GROQ_API_KEY"),
    temperature=0.3  # lower = more structured output
)

# -------------------------------
# SYSTEM PROMPT (Tech Lead Agent)
# -------------------------------
SYSTEM_PROMPT = """
You are a Senior Technical Lead and Software Architect.

Your task is to convert a given AI product blueprint into a complete, production-ready project setup.

⚠️ VERY IMPORTANT:
You MUST strictly follow the JSON schema below.
DO NOT skip any field.
DO NOT rename any keys.
DO NOT return null.
ALWAYS return valid JSON.

---------------------------------------
REQUIRED JSON SCHEMA:

{
  "architecture": {},
  "tech_stack": {},

  "folder_structure": {
    "root_folder": {
      "subfolder_or_file": {
        "description": "string",
        "responsibilities": ["string"]
      }
    }
  },

  "modules": [
    {
      "name": "string",
      "description": "string"
    }
  ],

  "api_design": [
    {
      "endpoint": "string",
      "method": "GET | POST | PUT | DELETE",
      "request": {},
      "response": {}
    }
  ],

  "database_schema": {
    "tables": [
      {
        "name": "string",
        "fields": {
          "field_name": "type"
        }
      }
    ]
  },

  "build_plan": [
    {
      "step": "string",
      "description": "string"
    }
  ],

  "deployment": {}
}
---------------------------------------

Rules:
- Output ONLY JSON
- No markdown
- No explanations
- Every field MUST be present
- build_plan MUST contain at least 5 steps
- folder_structure MUST include files and descriptions
- api_design MUST include at least 2 endpoints
- database_schema MUST include at least 1 table

Your output must strictly match the schema above.
"""
# -------------------------------
# HELPER: CLEAN LLM OUTPUT
# -------------------------------
def clean_llm_output(raw: str) -> str:
    raw = raw.strip()

    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else raw
        if raw.startswith("json"):
            raw = raw[4:]

    return raw.strip()


def kit_generator_node(state: Orchestration):
    """
    Generates full project setup from blueprint.
    Acts as a Senior Tech Lead agent.
    """

    blueprint = state.get("blueprint")

    if not blueprint:
        raise ValueError("❌ Blueprint missing in state")

    try:
        # Call LLM
        response = llm.invoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(
                content=f"Generate full project setup for this blueprint:\n{json.dumps(blueprint, indent=2)}"
            )
        ])

        raw = clean_llm_output(response.content)

        # Parse JSON safely
        parsed = FactoryKitSchema.model_validate_json(raw)

        return {
            "FactoryKit": parsed.model_dump(),
            "agent_status": {"KitGeneration": "Completed"}
        }

    except json.JSONDecodeError as e:
        print("[ERROR] JSON parsing failed:", e)
        print("Raw output:\n", raw)
        raise

    except Exception as e:
        print("[ERROR] Kit generation failed:", e)
        raise