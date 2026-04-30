from pydantic import BaseModel
import uuid


class TransactionModel(BaseModel):
    sender:str
    receiver:str
    amount: int 
    signature:str
    
    
