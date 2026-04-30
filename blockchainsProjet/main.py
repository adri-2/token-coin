from fastapi import FastAPI, HTTPException
from blockchain import Blockchain
from models import TransactionModel

app = FastAPI(title="Mini Blockchain API")

blockchain = Blockchain()


@app.get("/")
def home():
    return {"message": "Blockchain API running "}


@app.get("/chain")
def get_chain():
    return {
        "length": len(blockchain.chain),
        "chain": blockchain.chain
    }


@app.post("/transaction")
def create_transaction(tx: TransactionModel):
    try:
        blockchain.add_transaction(
            tx.sender,
            tx.receiver,
            tx.amount
        )
        return {"message": "Transaction ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/mine")
def mine():
    block = blockchain.mine_pending_transactions("miner_adrien")
    return {
        "message": "Bloc miné avec succès",
        "block": block.__dict__
    }


@app.get("/balance/{address}")
def get_balance(address: str):
    balance = blockchain.get_balance(address)
    return {"address": address, "balance": balance}


@app.get("/validate")
def validate():
    return {"is_valid": blockchain.is_chain_valid()}