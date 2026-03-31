from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from typing import TypedDict, Annotated, Optional,List,Literal
from langgraph.graph.message import AnyMessage, add_messages
from langchain_core.messages import ToolMessage
from langgraph.types import interrupt
import json
import os
from langchain.tools import tool
import json
from dotenv import load_dotenv
load_dotenv()
from backend.Orchestration import Orchestration
#Building blocks of Desired Output Schema
class step1(BaseModel):
     usecasename: str
     problemstatement:str
     businessDomain:str
     targetUsers:str
     desiredoutcome:str
     keyconstraints:str
     Keyassumptions:str

class step2(BaseModel):
    reuserecommendation:Literal["As-Is","Extend","Build New"]
    reuseConfidence:str
    rationale:str

class step3(BaseModel):
    Buisnessvalue:Literal["High","Medium","Low"]
    TechnicalFeasibility:Literal["High","Medium","Low"]
    OverallConfidence:str
    risks:List[str]

class step4(BaseModel):
    remmendationAction:str
    recommendationPattern:str

class Marketplacepotential(BaseModel):
    reusableAsset:bool
    confidence:str
    notes:str

class step5(BaseModel):
    blueprintEnabled:bool
    executiveSummary:str
    scopeAndBoundaries:List[str]
    validationSumaary:List[str]
    solutionPattern:str
    conceptualWorkflow:List[str]
    conceptualArchitecture:List[str]
    effortAndTimeline:str
    governancecontrolpoints:List[str]
    factoryreadiness:List[str]
    marketplacepotential:Marketplacepotential
    targetArchitecture:List[str]
    dataIntegration:List[str]
    risksAndguardrails:List[str]
    nextsteps:List[str]
    marketplacereference:List[str]

#Desired Output Schema
class Usecaseeval(BaseModel):
    step1:step1
    step2:step2
    step3:step3
    step4:step4
    step5:step5

#Creating the llm call here
#Brain for the Sub-Agent
llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    api_key=os.environ.get("GROQ_API_KEY"),
    temperature=0.5
)


SYSTEM_PROMPT = """
You are an AI Use Case Evaluation Agent.

Your job is to analyze a given AI use case and produce a STRICT structured JSON output.

You MUST follow this EXACT schema:

{
  "step1": {
    "usecasename": "string",
    "problemstatement": "string",
    "businessDomain": "string",
    "targetUsers": "string",
    "desiredoutcome": "string",
    "keyconstraints": "string",
    "Keyassumptions": "string"
  },
  "step2": {
    "reuserecommendation": "As-Is | Extend | Build New",
    "reuseConfidence": "High | Medium | Low",
    "rationale": "string"
  },
  "step3": {
    "Buisnessvalue": "High | Medium | Low",
    "TechnicalFeasibility": "High | Medium | Low",
    "OverallConfidence": "High | Medium | Low",
    "risks": ["string"]
  },
  "step4": {
    "remmendationAction": "Build | Extend | Defer",
    "recommendationPattern": "Retrieval-Augemented Generation(RAG) | Task Automation | Agentic Workflow (React-based)"
  },
  "step5": {
    "blueprintEnabled": true,
    "executiveSummary": "string",
    "scopeAndBoundaries": ["string"],
    "validationSumaary": ["string"],
    "solutionPattern": "string",
    "conceptualWorkflow": ["string"],
    "conceptualArchitecture": ["string"],
    "effortAndTimeline": "string",
    "governancecontrolpoints": ["string"],
    "factoryreadiness": ["string"],
    "marketplacepotential": {
      "reusableAsset": true,
      "confidence": "High | Medium | Low",
      "notes": "string"
    },
    "targetArchitecture": ["string"],
    "dataIntegration": ["string"],
    "risksAndguardrails": ["string"],
    "nextsteps": ["string"],
    "marketplacereference": ["string"]
  }
}

STRICT RULES:
- Output ONLY JSON
- Do NOT wrap in ```json
- Do NOT add extra fields
- Do NOT rename keys
- All fields are mandatory
"""

def usecase_eval_worker(state:Orchestration) :
    """Use this  when user asks for AI use case evaluation or blueprint generation or new app creation."""
    user_query=state.get("query")
    response = llm.invoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Evaluate this use case:\n{user_query}")
    ])

    raw = response.content.strip()

    # Remove markdown if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    try:
        parsed = Usecaseeval.model_validate_json(raw)
        return {
            "blueprint": parsed.model_dump(),
            "agent_status": {"Blueprintcreation": "Completed"},
        }

    except Exception as e:
        print(f"[ERROR] Parsing failed: {e}")
        print("Raw output:\n", raw)
        raise




def human_approval(state:Orchestration):
    blueprint = state.get("blueprint")
    if not blueprint:
        return {}
    if state.get("human_decision") == "approve":
        return {}
    decision = interrupt({
        "blueprint": blueprint,
        "message": "Review the blueprint and approve or reject"
    })

    return {
        "human_decision": decision.get("human_decision") or decision.get("action")
    }
