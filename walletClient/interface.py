
from client import create_wallet,create_and_send_transaction,check_balance,achat_fictif


while True:
    print("1. Créer un Wallet")
    print("2. Créer et Envoyer une Transaction")
    print("3. Vérifier le Solde")
    print("4. Achat fictif (pour tests)")
    print("5. Quitter")

    choice = input("Entrez votre choix: ")

    if choice == '1':
        create_wallet()
    elif choice == '2':
        receiver = input("Entrez l'adresse du destinataire: ")
        amount = int(input("Entrez le montant à envoyer: "))
        create_and_send_transaction(receiver, amount)
    elif choice == '3':
        check_balance()
    elif choice == '4':
        amount = int(input("Entrez le montant fictif à ajouter: "))
        achat_fictif(amount)
    elif choice == '5':
        break
    else:
        print("Choix invalide. Veuillez réessayer.")

