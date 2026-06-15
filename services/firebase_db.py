from firebase_admin import firestore
from langchain_core.messages import HumanMessage, AIMessage


def get_firestore_history(channel_id: str, limit: int = 6) -> list:
    """
    Extrait l'historique récent d'un salon et le formate
    pour qu'il soit directement exploitable par LangChain.
    """
    db = firestore.client()
    messages_ref = db.collection("channels").document(channel_id).collection("messages")
    
    # Récupération des derniers messages ordonnés par timestamp décroissant
    docs = messages_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(limit).stream()
    
    history = []
    # On inverse pour respecter l'ordre chronologique attendu par le LLM
    for doc in reversed(list(docs)):
        data = doc.to_dict()
        if data.get("senderId") == "ai_teacher_bot":
            history.append(AIMessage(content=data.get("text", "")))
        else:
            history.append(HumanMessage(content=data.get("text", "")))
            
    return history

def save_ai_message(channel_id: str, text: str) -> None:
    """
    Enregistre la réponse générée par l'IA dans la sous-collection Firestore du salon.
    """
    db = firestore.client()
    messages_ref = db.collection("channels").document(channel_id).collection("messages")
    messages_ref.add({
        "senderId": "ai_teacher_bot",
        "senderName": "Prof Virtuel",
        "text": text,
        "timestamp": firestore.SERVER_TIMESTAMP,
        "status": "completed"
    })

def save_error_message(channel_id: str, error_text: str) -> None:
    """
    Enregistre un message d'erreur en cas d'échec du traitement en tâche de fond.
    """
    db = firestore.client()
    messages_ref = db.collection("channels").document(channel_id).collection("messages")
    messages_ref.add({
        "senderId": "ai_teacher_bot",
        "senderName": "Prof Virtuel",
        "text": error_text,
        "timestamp": firestore.SERVER_TIMESTAMP,
        "status": "error"
    })