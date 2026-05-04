from pydantic import BaseModel
import uuid
from typing import List

class NodesMode(BaseModel):
    nodes: List[str]


class TransactionModel(BaseModel):
    sender:str
    receiver:str
    amount: int 
    signature:str
    
    
