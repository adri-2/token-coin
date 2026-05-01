import requests
from wallet import Wallet

API_URL = "http://127.0.0.1:8000"


def create_wallet():
    wallet = Wallet()
    wallet.save_to_file()
    print("✅ Wallet créé et sauvegardé")
    print("Address:", wallet.get_address())


def load_wallet():
    return Wallet.load_from_file()


def create_and_send_transaction(receiver, amount):
    wallet = load_wallet()

    public_key = wallet.get_public_key()

    # message à signer
    tx_data = f'{public_key}{receiver}{amount}'

    # signature
    signature = wallet.sign_transaction(tx_data)

    transaction = {
        "sender": public_key,
        "receiver": receiver,
        "amount": amount,
        "signature": signature
    }

    response = requests.post(f"{API_URL}/transaction", json=transaction)

    print("📡 Réponse API:", response.json())


def check_balance():
    wallet = load_wallet()
    address = wallet.get_public_key()

    response = requests.get(f"{API_URL}/balance/{address}")
    print("💰 Solde:", response.json())