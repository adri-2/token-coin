import json
import time
from web3 import Web3
from config import RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS, ABI_PATH

# ════════════════════════════════════════════════════════════════
#  CONNEXION
# ════════════════════════════════════════════════════════════════
try:
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
except Exception as e:
    raise ConnectionError(f"Erreur lors de la connexion à {RPC_URL} : {str(e)}")
    

if not w3.is_connected():
    raise ConnectionError(f"Impossible de se connecter à {RPC_URL}")

print(f"✅ Connecté au réseau  | Chain ID : {w3.eth.chain_id}")

# ── Compte ──────────────────────────────────────────────────────
account = w3.eth.account.from_key(PRIVATE_KEY)
print(f"👤 Compte              | {account.address}")
print(f"💰 Balance             | {w3.from_wei(w3.eth.get_balance(account.address), 'ether'):.4f} ETH\n")

# ── Contrat ─────────────────────────────────────────────────────
with open(ABI_PATH) as f:
    abi = json.load(f)

vault = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=abi
)


# ════════════════════════════════════════════════════════════════
#  UTILITAIRES
# ════════════════════════════════════════════════════════════════

def send_transaction(tx):
    """Signe, envoie une transaction et attend la confirmation."""
    tx["nonce"]    = w3.eth.get_transaction_count(account.address)
    tx["chainId"]  = w3.eth.chain_id
    tx["gas"]      = w3.eth.estimate_gas(tx)

    # EIP-1559 fee fields are expected by recent networks/web3 versions.
    latest_block = w3.eth.get_block("latest")
    base_fee = latest_block.get("baseFeePerGas")
    priority_fee = w3.to_wei(1, "gwei")

    if base_fee is not None:
        tx["maxPriorityFeePerGas"] = priority_fee
        tx["maxFeePerGas"] = base_fee * 2 + priority_fee
    else:
        tx["gasPrice"] = w3.eth.gas_price

    signed  = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    raw_tx = getattr(signed, "raw_transaction", None)
    if raw_tx is None:
        raw_tx = signed.rawTransaction
    tx_hash = w3.eth.send_raw_transaction(raw_tx)

    print(f"   ⏳ Tx envoyée        | {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    status  = "✅ Succès" if receipt.status == 1 else "❌ Échec"
    print(f"   {status}            | bloc #{receipt.blockNumber} | gas utilisé : {receipt.gasUsed}")
    return receipt


def separator(title=""):
    print("\n" + "─" * 50)
    if title:
        print(f"  {title}")
    print("─" * 50)


# ════════════════════════════════════════════════════════════════
#  LECTURE (appels view — gratuits, pas de gas)
# ════════════════════════════════════════════════════════════════

def get_my_balance():
    """Retourne le solde déposé par notre compte dans le Vault."""
    raw = vault.functions.getBalance().call({"from": account.address})
    eth = w3.from_wei(raw, "ether")
    print(f"   Mon solde Vault    | {eth:.4f} ETH")
    return raw


def get_total_deposit():
    """Retourne le total déposé dans le Vault (tous comptes)."""
    raw = vault.functions.totalDeposit().call()
    eth = w3.from_wei(raw, "ether")
    print(f"   Total Vault        | {eth:.4f} ETH")
    return raw


# ════════════════════════════════════════════════════════════════
#  ÉCRITURE (transactions — coûtent du gas)
# ════════════════════════════════════════════════════════════════

def deposit(amount_eth: float):
    """Dépose `amount_eth` ETH dans le Vault (minimum 1 ETH)."""
    separator(f"DÉPÔT de {amount_eth} ETH")
    amount_wei = w3.to_wei(amount_eth, "ether")

    tx = vault.functions.deposit().build_transaction({
        "from":  account.address,
        "value": amount_wei,
    })
    receipt = send_transaction(tx)

    # Lire l'event Deposit dans les logs
    logs = vault.events.Deposit().process_receipt(receipt)
    if logs:
        evt = logs[0]["args"]
        print(f"   Event Deposit      | from={evt['from']} | amount={w3.from_wei(evt['amount'], 'ether')} ETH")

    get_my_balance()
    get_total_deposit()
    return receipt


def withdraw(amount_eth: float):
    """Retire `amount_eth` ETH du Vault."""
    separator(f"RETRAIT de {amount_eth} ETH")
    amount_wei = w3.to_wei(amount_eth, "ether")

    tx = vault.functions.withdraw(amount_wei).build_transaction({
        "from": account.address,
    })
    receipt = send_transaction(tx)

    # Lire l'event Withdraw dans les logs
    logs = vault.events.Withdraw().process_receipt(receipt)
    if logs:
        evt = logs[0]["args"]
        print(f"   Event Withdraw     | to={evt['to']} | amount={w3.from_wei(evt['amount'], 'ether')} ETH")

    get_my_balance()
    get_total_deposit()
    return receipt


def send_eth_direct(amount_eth: float):
    """Envoie de l'ETH directement au contrat (déclenche receive())."""
    separator(f"ENVOI DIRECT de {amount_eth} ETH (receive)")
    amount_wei = w3.to_wei(amount_eth, "ether")

    tx = {
        "from":  account.address,
        "to":    Web3.to_checksum_address(CONTRACT_ADDRESS),
        "value": amount_wei,
    }
    receipt = send_transaction(tx)
    get_my_balance()
    return receipt


# ════════════════════════════════════════════════════════════════
#  ÉCOUTE DES EVENTS (en temps réel)
# ════════════════════════════════════════════════════════════════

def listen_events(duration_seconds: int = 30):
    """
    Écoute les events Deposit et Withdraw en temps réel
    pendant `duration_seconds` secondes.
    """
    separator(f"ÉCOUTE des events ({duration_seconds}s)")

    deposit_filter  = vault.events.Deposit.create_filter(from_block="latest")
    withdraw_filter = vault.events.Withdraw.create_filter(from_block="latest")

    print(f"   En attente d'events... (Ctrl+C pour arrêter)")
    deadline = time.time() + duration_seconds

    try:
        while time.time() < deadline:
            for evt in deposit_filter.get_new_entries():
                args = evt["args"]
                print(f"   📥 Deposit  | {args['from']} → {w3.from_wei(args['amount'], 'ether')} ETH")

            for evt in withdraw_filter.get_new_entries():
                args = evt["args"]
                print(f"   📤 Withdraw | {args['to']}  ← {w3.from_wei(args['amount'], 'ether')} ETH")

            time.sleep(1)
    except KeyboardInterrupt:
        print("   Arrêt de l'écoute.")


# ════════════════════════════════════════════════════════════════
#  HISTORIQUE DES EVENTS (depuis le bloc 0)
# ════════════════════════════════════════════════════════════════

def get_event_history():
    """Récupère tout l'historique des events Deposit et Withdraw."""
    separator("HISTORIQUE DES EVENTS")

    deposits  = vault.events.Deposit.create_filter(from_block=0).get_all_entries()
    withdraws = vault.events.Withdraw.create_filter(from_block=0).get_all_entries()

    print(f"   Dépôts      : {len(deposits)}")
    for evt in deposits:
        args = evt["args"]
        print(f"     bloc #{evt['blockNumber']} | {args['from']} | +{w3.from_wei(args['amount'], 'ether')} ETH")

    print(f"   Retraits    : {len(withdraws)}")
    for evt in withdraws:
        args = evt["args"]
        print(f"     bloc #{evt['blockNumber']} | {args['to']} | -{w3.from_wei(args['amount'], 'ether')} ETH")


# ════════════════════════════════════════════════════════════════
#  SCÉNARIO DE DÉMONSTRATION
# ════════════════════════════════════════════════════════════════

if __name__ == "__main__":

    separator("ÉTAT INITIAL")
    get_my_balance()
    get_total_deposit()

    # 1. Dépôt de 2 ETH
    deposit(2.0)

    # 2. Dépôt via receive() — envoi direct
    send_eth_direct(1.0)

    # 3. Retrait de 1 ETH
    withdraw(1.0)

    # 4. Historique complet
    get_event_history()

    separator("ÉTAT FINAL")
    get_my_balance()
    get_total_deposit()