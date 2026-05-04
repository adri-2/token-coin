import hashlib
import json
import copy
import threading
from datetime import datetime, timezone
from ecdsa import VerifyingKey, SECP256k1, BadSignatureError
from urllib.parse import urlparse
import requests


# =========================
# UTIL: HASH TRANSACTION
# =========================
def calculate_tx_id(transaction):
    tx_copy = transaction.copy()
    tx_copy.pop("signature", None)

    tx_string = json.dumps(tx_copy, sort_keys=True).encode()
    return hashlib.sha256(tx_string).hexdigest()


# =========================
# BLOCK
# =========================
class Block:
    def __init__(self, index, transactions, timestamp, previous_hash, nonce=0):
        self.index = index
        self.transactions = copy.deepcopy(transactions)
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    @classmethod
    def from_dict(cls, data):
        block = cls(
            data["index"],
            data["transactions"],
            data["timestamp"],
            data["previous_hash"],
            data.get("nonce", 0)
        )
        block.hash = data["hash"]
        return block

    def calculate_hash(self):
        block_data = {
            "index": self.index,
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }
        block_string = json.dumps(block_data, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()


# =========================
# BLOCKCHAIN
# =========================
class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.pending_transactions = []
        self.difficulty = 2
        self.mining_reward = 1
        self.nodes = set()
        self.state_lock = threading.RLock()

    # ---------------------
    # GENESIS
    # ---------------------
    def create_genesis_block(self):
        return Block(0, [], datetime.now(timezone.utc).isoformat(), "0")

    def get_latest_block(self):
        return self.chain[-1]

    def has_transaction(self, tx_id):
        for transaction in self.pending_transactions:
            if transaction.get("tx_id") == tx_id:
                return True

        for block in self.chain:
            for transaction in block.transactions:
                if transaction.get("tx_id") == tx_id:
                    return True

        return False

    # ---------------------
    # NODES
    # ---------------------
    def register_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)

    # ---------------------
    # PROOF OF WORK
    # ---------------------
    def proof_of_work(self, block):
        while not block.hash.startswith("0" * self.difficulty):
            block.nonce += 1
            block.hash = block.calculate_hash()

    # ---------------------
    # SIGNATURE VERIFY
    # ---------------------
    def verify_transaction(self, transaction):
        try:
            sender = transaction["from"]
            receiver = transaction["to"]
            amount = transaction["amount"]
            signature = transaction["signature"]
        except KeyError as e:
            raise Exception(f"Champ manquant: {e}")

        public_key = VerifyingKey.from_string(
            bytes.fromhex(sender),
            curve=SECP256k1
        )

        tx_data = f"{sender}{receiver}{amount}"

        try:
            public_key.verify(bytes.fromhex(signature), tx_data.encode())
        except BadSignatureError:
            raise Exception("Signature invalide")

        return True

    # ---------------------
    # ADD TRANSACTION
    # ---------------------
    def add_transaction(self, sender, receiver, amount, signature):
        transaction = {
            "from": sender,
            "to": receiver,
            "amount": amount,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "signature": signature
        }
        transaction["tx_id"] = calculate_tx_id(transaction)

        with self.state_lock:
            if self.has_transaction(transaction["tx_id"]):
                return False

            if sender != "system":
                if not self.verify_transaction(transaction):
                    raise Exception("Signature invalide")

                if self.get_balance(sender) < amount:
                    raise Exception("Solde insuffisant")

            self.pending_transactions.append(transaction)
            return True

    # ---------------------
    # MINING
    # ---------------------
    def mine_pending_transactions(self, miner_address):
        with self.state_lock:
            if not self.pending_transactions:
                raise Exception("Aucune transaction à miner")

            # reward
            reward_tx = {
                "from": "system",
                "to": miner_address,
                "amount": self.mining_reward,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            reward_tx["tx_id"] = calculate_tx_id(reward_tx)

            self.pending_transactions.append(reward_tx)

            block = Block(
                len(self.chain),
                self.pending_transactions,
                datetime.now(timezone.utc).isoformat(),
                self.get_latest_block().hash
            )

            self.proof_of_work(block)
            self.chain.append(block)

            self.pending_transactions = []

            return block

    # ---------------------
    # BALANCE
    # ---------------------
    def get_balance(self, address):
        balance = 0

        for block in self.chain:
            for tx in block.transactions:
                if tx["from"] == address:
                    balance -= tx["amount"]
                if tx["to"] == address:
                    balance += tx["amount"]

        return balance

    # ---------------------
    # VALIDATION
    # ---------------------
    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            if current.hash != current.calculate_hash():
                return False

            if current.previous_hash != previous.hash:
                return False

            if not current.hash.startswith("0" * self.difficulty):
                return False

            # vérifier transactions
            for tx in current.transactions:
                if tx["from"] != "system":
                    try:
                        self.verify_transaction(tx)
                    except:
                        return False

        return True

    # ---------------------
    # CONSENSUS
    # ---------------------
    def is_chain_valid_external(self, chain):
        for i in range(1, len(chain)):
            current = chain[i]
            previous = chain[i - 1]

            if current["previous_hash"] != previous["hash"]:
                return False

        return True

    def resolve_conflicts(self):
        neighbours = list(self.nodes)
        new_chain = None

        with self.state_lock:
            max_length = len(self.chain)

        for node in neighbours:
            try:
                response = requests.get(f"http://{node}/chain", timeout=3)  # Timeout 3s

                if response.status_code == 200:
                    data = response.json()
                    length = data["length"]
                    chain = data["chain"]

                    if length > max_length and self.is_chain_valid_external(chain):
                        max_length = length
                        new_chain = [Block.from_dict(block) for block in chain]
            except:
                continue

        if new_chain:
            with self.state_lock:
                if len(new_chain) > len(self.chain):
                    self.chain = new_chain
                    return True

        return False