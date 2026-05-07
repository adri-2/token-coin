import os 
from dotenv import load_dotenv

load_dotenv()

RPC_URL  = os.getenv("RPC_URL","http://127.0.0.1:8545")

PRIVATE_KEY = os.getenv("PRIVATE_KEY", "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e")
# )

CONTRACT_ADDRESS = os.getenv(
    "CONTRACT_ADDRESS",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"  # adresse affichée par deploy.js
)

ABI_PATH = "vault_abi.json"



