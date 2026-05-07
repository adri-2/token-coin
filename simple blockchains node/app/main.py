from pathlib import Path
import sys
import threading
import time 
import requests
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

NODE_ID = os.getenv("NODE_ID", "node_default")
PORT = os.getenv("PORT", "8000")

# Ajouter les chemins pour les imports
APP_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from fastapi import FastAPI, HTTPException
from blockchain import Blockchain
from models import NodesMode, TransactionModel
from walletClient.wallet import Wallet

app = FastAPI(title="Mini Blockchain API")
blockchain = Blockchain()



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
def create_transaction(tx: TransactionModel, forwarded: bool = False):
    try:
        added = blockchain.add_transaction(
            tx.sender,
            tx.receiver,
            tx.amount,
            tx.signature
        )

        if not added:
            return {"message": "Transaction déjà traitée"}

        # Un seul nœud diffuse la transaction. Les nœuds relais ne rebroadcastent pas.
        if not forwarded:
            payload = tx.model_dump()
            for node in blockchain.nodes:
                try:
                    requests.post(
                        f"http://{node}/transaction?forwarded=true",
                        json=payload,
                        timeout=2,
                    )
                except:
                    pass

        return {"message": "Transaction ajoutée"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    



@app.get("/mine")
def mine():
    import time
    try:
        block = blockchain.mine_pending_transactions(NODE_ID)
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

def auto_mine():
    while True:
        if len(blockchain.pending_transactions) > 0:
            print("⛏️ Minage automatique lancé...")
            blockchain.mine_pending_transactions("miner_auto")
        time.sleep(5)  # évite de spam CPU
        
def auto_syn():
    while True:
        try:
            print("🔄 Synchronisation automatique des nœuds...")
            replaced = blockchain.resolve_conflicts()
            if replaced:
                print("✅ Chaîne mise à jour depuis les nœuds pairs")
        except Exception as e:
            print(f"❌ Erreur de synchronisation: {e}")
        time.sleep(30)  # Synchronise tous les 30 secondes
        
        
@app.on_event("startup")
def start_miner():
    import os
    current = os.getenv("NODE_ID")
    print(f"🚀 Démarrage du nœud: {current} sur le port {PORT}")
    
    if current == "node2":
        blockchain.register_node("http://node1:8000")
        blockchain.register_node("http://node3:8000")
        print("✅ node2 enregistré avec node1 et node3")
    elif current == "node1":
        blockchain.register_node("http://node2:8000")
        blockchain.register_node("http://node3:8000")
        print("✅ node1 enregistré avec node2 et node3")
    elif current == "node3":
        blockchain.register_node("http://node1:8000")
        blockchain.register_node("http://node2:8000")
        print("✅ node3 enregistré avec node1 et node2")
        
    # Thread minage
    thread_mine = threading.Thread(target=auto_mine)
    thread_mine.daemon = True
    thread_mine.start()
    print("⛏️  Thread de minage lancé")
    
    # Thread synchronisation
    thread_sync = threading.Thread(target=auto_syn)
    thread_sync.daemon = True
    thread_sync.start()
    print("🔄 Thread de synchronisation lancé")
    

    
@app.post("/nodes/register")
def register_nodes(nodes:NodesMode):
    for node in nodes.nodes:
        blockchain.register_node(node)
    return {
        "message": "Noeuds ajoutes",
        "total_nodes": list(blockchain.nodes)
    }
    
@app.get("/nodes/resolve")
def consensus():
    replaced = blockchain.resolve_conflicts()

    if replaced:
        return {"message": "Chaîne remplacée"}
    else:
        return {"message": "Chaîne à jour"}
    