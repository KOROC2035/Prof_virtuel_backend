import time # Ajout pour mesurer la performance
import tempfile
import requests
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader

from core.config import settings
from services.firebase_db import get_firestore_history, save_ai_message, save_error_message
from core.logger import log # <--- Import du logger

SYSTEM_PROMPT = """Tu es le professeur virtuel de KRAK 2, une plateforme éducative pour les lycéens de Côte d'Ivoire. Ton objectif n'est pas de donner la réponse immédiate, mais de faire réfléchir l'élève pour identifier ses lacunes.

Tu dois STRICTEMENT respecter le processus suivant :

1. L'ÉVALUATION (Quand l'élève pose une nouvelle question) :
- Ne donne JAMAIS l'explication complète ou la solution tout de suite.
- Salue l'élève avec bienveillance.
- Pose 1 ou 2 questions très précises et ciblées pour évaluer ce qu'il a déjà compris du concept ou de l'exercice.
- Attends sa réponse.

2. L'EXPLICATION CHIRURGICALE (Quand l'élève a répondu à tes questions) :
- Analyse sa réponse pour comprendre exactement où se trouve son blocage.
- Fournis une explication claire, précise et découpée étape par étape, focalisée UNIQUEMENT sur ce qu'il n'avait pas compris.
- Utilise des analogies simples et donne toujours une astuce pour retenir.

TON TON :
- Pédagogue, patient et encourageant.
- Utilise des emojis pour structurer (✅, 💡, 🎯, ⚠️).
- Parle un français naturel et accessible."""

def extract_text_from_url(file_url: str, file_type: str) -> str:
    """Télécharge silencieusement le fichier et extrait son texte."""
    try:
        log.info(f"Début de l'extraction documentaire pour un fichier {file_type}")
        response = requests.get(file_url, stream=True)
        if response.status_code != 200:
            return "Erreur : Impossible de télécharger le document."

        with tempfile.NamedTemporaryFile(delete=True, suffix=f".{file_type}") as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            temp_file.flush()

            extracted_text = ""
            if file_type == 'pdf':
                loader = PyPDFLoader(temp_file.name)
                docs = loader.load()
                extracted_text = "\n".join([doc.page_content for doc in docs])
            
            elif file_type in ['docx', 'doc']:
                loader = Docx2txtLoader(temp_file.name)
                docs = loader.load()
                extracted_text = "\n".join([doc.page_content for doc in docs])

            return extracted_text

    except Exception as e:
        log.error(f"Erreur lors de l'extraction documentaire : {e}")
        return "Le système n'a pas pu lire le contenu de ce document."

# Ajout des paramètres file_url et file_type (optionnels)
def generate_and_save_explanation(channel_id: str, concept: str, file_url: str = None, file_type: str = None) -> None:
    log.info(f"Début du traitement IA pour le salon [{channel_id}] - Concept: '{concept}'")
    start_time = time.time()
    
    try:
        # 1. Préparation de la mémoire (Historique + Prompt Système)
        history = get_firestore_history(channel_id)
        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        
        if history:
            messages.extend(history) # Injection de l'historique de la conversation
            log.debug(f"[{channel_id}] Historique récupéré : {len(history)} messages.")

        # 2. ROUTAGE TACTIQUE SELON LE FICHIER
        # --- CAS A : IMAGE (Déploiement du modèle Vision) ---
        if file_url and file_type in ['png', 'jpg', 'jpeg', 'webp', 'image']:
            log.info("Fichier image détecté : Basculement sur Groq Vision.")
            llm = ChatGoogleGenerativeAI(
                api_key=settings.GOOGLE_API_KEY,
                model="gemini-1.5-flash", # Le modèle qui "voit"
                temperature=settings.LLM_TEMPERATURE
            )
            
            human_content = [
                {
                    "type": "text", 
                    "text": f"L'élève a fourni une image de son exercice/cours.\nQuestion de l'élève : {concept}\nAnalyse attentivement cette image pour comprendre son blocage."
                },
                {
                    "type": "image_url", 
                    "image_url": {"url": file_url}
                }
            ]
            messages.append(HumanMessage(content=human_content))

        # --- CAS B : TEXTE OU SANS FICHIER (Modèle Standard ultra-rapide) ---
        else:
            llm = ChatGoogleGenerativeAI(
                api_key=settings.GOOGLE_API_KEY,
                model=settings.LLM_MODEL, # Utilise le modèle défini dans tes settings
                temperature=settings.LLM_TEMPERATURE
            )
            
            document_context = ""
            if file_url and file_type in ['pdf', 'docx', 'doc']:
                extracted_text = extract_text_from_url(file_url, file_type)
                document_context = f"\n\n--- DOCUMENT SOUMIS PAR L'ÉLÈVE ---\n{extracted_text}\n-----------------------------------\nAnalysez ce document en priorité."

            human_content = f"{document_context}\nQuestion de l'élève : {concept}"
            messages.append(HumanMessage(content=human_content))

        # 3. Exécution de la frappe
        log.debug("Génération de la réponse en cours...")
        response = llm.invoke(messages)

        # Mesure du temps écoulé
        execution_time = round(time.time() - start_time, 2)
        log.info(f"Génération réussie en {execution_time}s pour le salon [{channel_id}]")

        save_ai_message(channel_id, response.content)

    except Exception as e:
        # L'argument exc_info=True est magique : il écrit toute la pile d'erreur (Traceback) 
        # dans le fichier log sans faire crasher ton application !
        log.error(f"Échec critique de l'IA pour [{channel_id}]: {str(e)}", exc_info=True)
        
        save_error_message(channel_id, "Désolé, j'ai rencontré un problème technique en analysant ta demande.")