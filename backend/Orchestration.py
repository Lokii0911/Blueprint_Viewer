from typing_extensions import TypedDict,Annotated
from langgraph.graph.message import  AnyMessage,add_messages
import operator


def merge_dicts(a: dict, b: dict) -> dict:
    return {**a, **b}

class Orchestration(TypedDict,total=False):
    query:str
    blueprint:dict
    messages: Annotated[list[AnyMessage], add_messages]
    agent_status: Annotated[dict, merge_dicts]
    human_decision:str
    FactoryKit:dict
    project_struct:dict