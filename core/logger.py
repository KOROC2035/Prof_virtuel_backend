import logging
import sys
from pathlib import Path

# Création automatique du dossier "logs" s'il n'existe pas
Path("logs").mkdir(exist_ok=True)

def setup_logger():
    # Création du logger principal
    logger = logging.getLogger("ai_teacher_app")
    logger.setLevel(logging.DEBUG) # On capture tout, on filtrera plus tard si besoin

    # Format très précis : Date | Niveau d'erreur | Fichier:Fonction:Ligne - Message
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(module)s:%(funcName)s:%(lineno)d - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # 1. Handler "Fichier" : Écrit dans logs/app.log (Niveau INFO minimum)
    file_handler = logging.FileHandler("logs/app.log", encoding="utf-8")
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.INFO)

    # 2. Handler "Console" : Affiche dans ton terminal (Niveau DEBUG minimum)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(logging.DEBUG)

    # On évite d'ajouter les handlers en double si la fonction est appelée plusieurs fois
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger

# Instance globale prête à être importée partout
log = setup_logger()