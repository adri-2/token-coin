from ecdsa import SigningKey, SECP256k1
import hashlib
import json
import os


class Wallet:
    def __init__(self, private_key=None):
        if private_key:
            self.private_key = SigningKey.from_string(
                bytes.fromhex(private_key),
                curve=SECP256k1
            )
        else:
            self.private_key = SigningKey.generate(curve=SECP256k1)

        self.public_key = self.private_key.get_verifying_key()

    def get_private_key(self):
        return self.private_key.to_string().hex()

    def get_public_key(self):
        return self.public_key.to_string().hex()

    def get_address(self):
        return hashlib.sha256(self.public_key.to_string()).hexdigest()

    def sign_transaction(self, tx_data: str):
        return self.private_key.sign(tx_data.encode()).hex()

    def save_to_file(self, filename="keys.json"):
        data = {
            "private_key": self.get_private_key(),
            "public_key": self.get_public_key(),
            "address": self.get_address()
        }

        with open(filename, "w") as f:
            json.dump(data, f, indent=4)

    @staticmethod
    def load_from_file(filename="keys.json"):
        if not os.path.exists(filename):
            raise Exception("Fichier wallet introuvable")

        with open(filename, "r") as f:
            data = json.load(f)

        return Wallet(private_key=data["private_key"])