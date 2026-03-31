from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage
from langgraph.types import interrupt
from langgraph.checkpoint.memory import MemorySaver
from dotenv import load_dotenv
import os
load_dotenv()
from backend.Orchestration import Orchestration
from backend.BlueprintGen import usecase_eval_worker,human_approval
from backend.Factory import kit_generator_node
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from langchain.agents import create_agent


builder = StateGraph(Orchestration)

def entry_router(state: Orchestration):
    if state.get("human_decision") == "approve":
        return "kit_generator"
    return "blueprint"

def route(state:Orchestration):
    print(state.get("human_decision"))
    if state.get("human_decision")=="approve":
        return "kit_generator"

    return "blueprint"


#Building graph using the state
builder = StateGraph(Orchestration)
#Adding nodes to the graph
builder.add_node("blueprint",usecase_eval_worker)
builder.add_node("human_review_node", human_approval)
builder.add_node("kit_generator", kit_generator_node)
#Building graph
builder.add_conditional_edges(
    START,
    entry_router,
    {
        "blueprint": "blueprint",
        "kit_generator": "kit_generator"
    }
)
builder.add_edge("blueprint","human_review_node")
builder.add_conditional_edges(
    "human_review_node",
    route,
    {
        "kit_generator": "kit_generator", # If route returns "kit_genrator", go to that node
        "blueprint": "blueprint"   # If route returns "orchestrator", loop back
    }
)
builder.add_edge("kit_generator", END)
checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)
print(graph.get_graph().draw_mermaid())




