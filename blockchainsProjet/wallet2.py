from blockchainsProjet.walletClient.wallet import Wallet
import requests
wallet = Wallet()

public_key = wallet.get_public_key()
receiver = "Bob"
amount = 10

tx_data = f'{public_key}{receiver}{amount}'
signature = wallet.sign_transaction(tx_data)

transaction = {
    "sender": public_key,
    "receiver": receiver,
    "amount": amount,
    "signature": signature
}



requests.post("http://127.0.0.1:8000/transaction", json=transaction)
# from wallet import Wallet

# # 1. Création du wallet
# wallet = Wallet()

# private_key = wallet.get_private_key()
# public_key = wallet.get_public_key()
# address = wallet.get_address()

# print("Private:", private_key)
# print("Public :", public_key)
# print("Address:", address)

# # 2. Simulation transaction
# receiver = "Bob"
# amount = 10

# tx_data = f'{public_key}{receiver}{amount}'

# # 3. Signature
# signature = wallet.sign_transaction(tx_data)

# print("Signature:", signature)