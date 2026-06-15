import os
import time
import firebase_admin
from firebase_admin import credentials, firestore

# 1. Charger les variables d'environnement (si tu utilises un fichier .env)
# Tu peux aussi les exporter directement dans ton terminal avant de lancer le script
from core.config import settings
from services.ai_teacher import generate_and_save_explanation
from core.logger import log

def run_local_test():
    print("--- DÉMARRAGE DU TEST LOCAL DE L'AGENT IA ---")
    
    # 2. Initialisation de Firebase Admin (comme dans main.py)
    if not firebase_admin._apps:
        log.info(f"Initialisation de Firebase avec la clé : {settings.FIREBASE_KEY_PATH}")
        cred = credentials.Certificate(settings.FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    
    # ID de salon fictif pour le test
    channel_id = "salon_test_maieutique"
    messages_ref = db.collection("channels").document(channel_id).collection("messages")
    
    print(f"\n[INFO] Le test va utiliser le salon Firestore : '{channel_id}'")
    print("[INFO] Vous pouvez ouvrir votre console Firebase pour voir les changements en temps réel.")
    print("[INFO] Tapez 'quitter' pour arrêter la simulation.\n")
    
    while True:
        # 3. Saisie de l'élève
        user_input = input("\nÉlève (Vous) : ")
        if user_input.strip().lower() == "quitter":
            print("Fin du test.")
            break
            
        if not user_input.strip():
            continue
            
        # 4. Simulation du Frontend : Écriture du message de l'élève dans Firestore
        print("[Système] Enregistrement de votre message dans Firestore...")
        messages_ref.add({
            "senderId": "test_user_id",
            "senderName": "Roger (Élève)",
            "text": user_input,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "status": "sent"
        })
        
        # Un léger délai pour laisser Firestore attribuer le timestamp
        time.sleep(1)
        
        # 5. Déclenchement de l'IA
        print("[Système] Appel de l'agent de maïeutique (LangChain)...")
        # Ici, on l'appelle de manière synchrone pour le test pour pouvoir afficher la réponse directement après
        generate_and_save_explanation(channel_id=channel_id, concept=user_input)
        
        # 6. Lecture de la réponse générée dans Firestore
        # On récupère le tout dernier message du salon pour vérifier l'écriture
        time.sleep(1) # Attente de la propagation Firestore
        dernier_message_doc = messages_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
        
        if dernier_message_doc:
            data = dernier_message_doc[0].to_dict()
            if data.get("senderId") == "ai_teacher_bot":
                print(f"\nProf Virtuel : {data.get('text')}")
            else:
                print("\n[Erreur] Le dernier message en base n'est pas celui de l'IA. Vérifiez les logs.")
        else:
            print("\n[Erreur] Aucun message trouvé dans Firestore.")

if __name__ == "__main__":
    # Assure-toi que tes clés d'API sont bien configurées avant de lancer
    # ex en local : os.environ["OPENAI_API_KEY"] = "sk-..."
    run_local_test()
    
    
