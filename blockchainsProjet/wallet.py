from ecdsa import SigningKey, SECP256k1
import hashlib

class Wallet:
    def __init__(self):
        self.private_key = SigningKey.generate(curve=SECP256k1)
        self.public_key = self.private_key.get_verifying_key()
                
    def get_private_key(self):
        return self.private_key.to_string().hex()
    
    def get_public_key(self):
        return self.public_key.to_string().hex()
    
    def get_address(self):
        public_key_bytes = self.public_key.to_string()
        return hashlib.sha256(public_key_bytes).hexdigest()
    
    def sign_transaction(self, transaction_data: str):
        return self.private_key.sign(transaction_data.encode()).hex()
    
    # def send(self,public_key,receiver,amount):
    #     tx_data = f'{public_key}{receiver}{amount}'
    #     return tx_data
        
        
    
    
