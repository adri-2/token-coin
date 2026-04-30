from wallet import Wallet

# 1. Création du wallet
wallet = Wallet()

private_key = wallet.get_private_key()
public_key = wallet.get_public_key()
address = wallet.get_address()

print("Private:", private_key)
print("Public :", public_key)
print("Address:", address)

# 2. Simulation transaction
receiver = "Bob"
amount = 10

tx_data = f'{public_key}{receiver}{amount}'

# 3. Signature
signature = wallet.sign_transaction(tx_data)

print("Signature:", signature)