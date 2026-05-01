import hashlib
import json
import copy
from datetime import datetime, timezone
from ecdsa import VerifyingKey, SECP256k1, BadSignatureError


class Block:
    def __init__(self,index,transactions, timestamp,previous_hash,nonce=0):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()
    
    def calculate_hash(self):
        block_data = {
         "index":self.index ,
        "transactions":self.transactions ,
        "timestamp": self.timestamp ,
        "previous_hash": self.previous_hash ,
        "nonce": self.nonce 
        }
        block_string = json.dumps(block_data,sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.pending_transactions = []
        self.difficulty = 2
        self.mining_reward = 1
        
    def create_genesis_block(self):
        return Block(0,[],datetime.now(timezone.utc).isoformat(),"0")
    
    def get_latest_block(self):
        return self.chain[-1]
    
    def proof_of_work(self,block):
        while not block.hash.startswith("0" * self.difficulty):
            block.nonce += 1
            block.hash = block.calculate_hash()
            
    def verify_transaction(self, transaction):
        try:
            sender_hex = transaction["from"]
            receiver = transaction["to"]
            amount = transaction["amount"]
            signature_hex = transaction["signature"]
        except KeyError as exc:
            raise Exception(f"Champ manquant dans la transaction: {exc.args[0]}")

        try:
            public_key = VerifyingKey.from_string(
                bytes.fromhex(sender_hex),
                curve=SECP256k1
            )
        except Exception as exc:
            raise Exception(f"Clé publique invalide dans 'from': {exc}")

        tx_data = f'{sender_hex}{receiver}{amount}'

        try:
            public_key.verify(
                bytes.fromhex(signature_hex),
                tx_data.encode()
            )
        except BadSignatureError:
            raise Exception(
                f"Signature invalide: les données signées ne correspondent pas. tx_data={tx_data}"
            )
        except Exception as exc:
            raise Exception(f"Erreur pendant la vérification de signature: {exc}")

        return True
            
    def add_transaction(self,sender,receiver,amount,signature):
        # if sender != "system" and self.get_balance(sender) < amount:
        #     raise Exception("Solde insuffisant")
        
        transaction = {
            "from":sender,
            "to":receiver,
            "amount":amount,
            "signature":signature
        }
        if sender != "system":
            if not self.verify_transaction(transaction):
                raise Exception("Signature invalide")
            
            if self.get_balance(sender) < amount:
                raise Exception("Solde insuffisant")
        self.pending_transactions.append(transaction)
                
    
    def mine_pending_transactions(self,miner_address):
        # Vérifier s'il y a des transactions en attente
        if not self.pending_transactions:
            raise Exception("Aucune transaction à miner")
        
        # reward avenr minage
        self.pending_transactions.append({
            "from":"system",
            "to":miner_address,
            "amount":self.mining_reward
        })
        
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
    
    def get_balance(self,address):
        balance = 100
        
        for block in self.chain:
            for tx in block.transactions:
                if tx['from'] == address:
                    balance -= tx['amount']
                if tx['to'] == address:
                    balance += tx['amount']
        return balance
    
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
            
        return True