import hashlib
import json
import time

class Block:
    def __init__(self, index, transactions, timestamp, previous_hash, nonce=0):
        self.index = index
        self.transactions = list(transactions)
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_data = {
            "index": self.index,
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
        }
        block_string = json.dumps(block_data, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()


class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.pending_transactions = []
        self.difficulty = 10
        self.mining_reward = 50

    def create_genesis_block(self):
        return Block(0, [], time.time(), "0")

    def get_latest_block(self):
        return self.chain[-1]

    def mine_pending_transactions(self, miner_address):
        block = Block(
            len(self.chain),
            self.pending_transactions,
            time.time(),
            self.get_latest_block().hash
        )

        print("⛏️ Minage en cours...")
        self.proof_of_work(block)

        self.chain.append(block)
        print("✅ Bloc miné:", block.hash)

        # Récompense
        self.pending_transactions = [{
            "from": "system",
            "to": miner_address,
            "amount": self.mining_reward
        }]

    def proof_of_work(self, block):
        while not block.hash.startswith("0" * self.difficulty):
            block.nonce += 1
            block.hash = block.calculate_hash()

    def add_transaction(self, sender, receiver, amount):
        self.pending_transactions.append({
            "from": sender,
            "to": receiver,
            "amount": amount
        })

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
    
    
class Node:
    def __init__(self,name):
        self.name = name
        self.blockchain = Blockchain()
        self.peers = []
    
    def add_peer(self,peer_node):
        self.peers.append(peer_node)
        
    def broadcast_transaction(self, sender, receiver, amount):
        print(f"{self.name} diffuse une transaction")

        self.blockchain.add_transaction(sender, receiver, amount)

        for peer in self.peers:
            peer.blockchain.add_transaction(sender, receiver, amount)
    
    def broadcast_block(self, block):
        print(f"{self.name} diffuse un bloc")

        for peer in self.peers:
            peer.receive_block(block)
            
    def receive_block(self, block):
        last_block = self.blockchain.get_latest_block()

        if block.previous_hash == last_block.hash:
            self.blockchain.chain.append(block)
        else:
            print(f"{self.name}: bloc rejeté")
            
    def mine(self):
        self.blockchain.mine_pending_transactions(self.name)
        new_block = self.blockchain.get_latest_block()

        self.broadcast_block(new_block)