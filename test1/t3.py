from bockchain import Blockchain , Node
import time
t1= time.time()
my_coin = Blockchain()

my_coin.add_transaction("Alice", "Bob", 10)
# 
my_coin.add_transaction("Bob", "Charlie", 5)
my_coin.add_transaction("Bob", "Alice", 45)

my_coin.mine_pending_transactions("Miner1")
print(f"#----------------------------------star time {time.time()-t1}")
t2= time.time()
my_coin.add_transaction("Alice", "Charlie", 20)
my_coin.add_transaction("Tom", "Charlie", 20)

my_coin.mine_pending_transactions("Miner1")
print(f"#----------------------------------star time {time.time()-t2}")

print("Validité de la chaîne:", my_coin.is_chain_valid())


for block in my_coin.chain:
    print(vars(block))
    
# print("Balance de Miner1:", my_coin.get_balance("Miner1"))
    
# nodeA = Node("Node A")
# nodeB = Node("Node B")
# nodeC = Node("Node C")

# # connecter les nœuds
# nodeA.add_peer(nodeB)
# nodeA.add_peer(nodeC)

# nodeB.add_peer(nodeA)
# nodeB.add_peer(nodeC)

# nodeC.add_peer(nodeA)
# nodeC.add_peer(nodeB)

# # transaction
# nodeA.broadcast_transaction("Alice", "Bob", 10)

# # minage
# nodeA.mine()

# nodeB.broadcast_transaction("Alice", "Bob", 100)

# # minage
# nodeB.mine()

# # vérifier les chaînes
# print(len(nodeA.blockchain.chain))
# print(len(nodeB.blockchain.chain))
# print(len(nodeC.blockchain.chain))

# # Création des nœuds
# nodeA = Node("Node A")
# nodeB = Node("Node B")
# nodeC = Node("Node C")

# # Connexion
# nodeA.add_peer(nodeB)
# nodeA.add_peer(nodeC)

# nodeB.add_peer(nodeA)
# nodeB.add_peer(nodeC)

# nodeC.add_peer(nodeA)
# nodeC.add_peer(nodeB)

# # Transactions
# nodeA.broadcast_transaction("Alice", "Bob", 10)
# nodeA.broadcast_transaction("Bob", "Charlie", 5)

# # Minage
# nodeA.mine()

# # Nouvelle transaction
# nodeB.broadcast_transaction("Alice", "Charlie", 20)

# # Nouveau minage
# nodeC.mine()

# # Vérification
# print("Node A valid:", nodeA.blockchain.is_chain_valid())
# print("Node B valid:", nodeB.blockchain.is_chain_valid())
# print("Node C valid:", nodeC.blockchain.is_chain_valid())

# # Taille des chaînes
# print(len(nodeA.blockchain.chain))
# print(len(nodeB.blockchain.chain))
# print(len(nodeC.blockchain.chain))