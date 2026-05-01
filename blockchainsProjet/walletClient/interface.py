
from client import create_wallet,create_and_send_transaction,check_balance

while True:
    print("1. Créer un Wallet")
    print("2. Créer et Envoyer une Transaction")
    print("3. Vérifier le Solde")
    print("4. Quitter")

    choice = input("Entrez votre choix: ")
    
    if choice == '1':
        create_wallet()
    elif choice == '2':
        # sender = input("Enter sender's address: ")
        receiver = input("Entrez l'adresse du destinataire: ")
        amount = int(input("Entrez le montant à envoyer: "))
        create_and_send_transaction( receiver, amount)
    elif choice == '3':
        check_balance()
    elif choice == '4':
        break
    else:
        print("Choix invalide. Veuillez réessayer.")

