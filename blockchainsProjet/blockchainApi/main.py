from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException
from blockchain import Blockchain
from models import TransactionModel

app = FastAPI(title="Mini Blockchain API")

blockchain = Blockchain()
from walletClient.wallet import Wallet



@app.get("/")
def home():
    return {"message": "Blockchain API running "}

@app.get("/wallet/new")
def create_wallet():
    wallet = Wallet()
    return {
        "private_key": wallet.get_private_key(),
        "public_key": wallet.get_public_key(),
        "address": wallet.get_address()
    }


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
            tx.amount,
            tx.signature
        )
        return {"message": "Transaction ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    



@app.get("/mine")
def mine():
    try:
        block = blockchain.mine_pending_transactions("miner_adrien")
        return {
            "message": "Bloc miné avec succès",
            "block": block.__dict__
        }
    except Exception as e:
        raise HTTPException(status_code=400,detail=str(e))


@app.get("/balance/{address}")
def get_balance(address: str):
    balance = blockchain.get_balance(address)
    return {"address": address, "balance": balance}


@app.get("/validate")
def validate():
    return {"is_valid": blockchain.is_chain_valid()}