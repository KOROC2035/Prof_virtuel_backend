from fastapi import FastAPI, Depends, BackgroundTasks, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import firebase_admin
from firebase_admin import credentials
import os
import shutil
import time
import tempfile
import base64 # <-- Le module secret pour transformer les images

from core.config import settings
from core.security import verify_firebase_token
from models.schemas import ConceptRequest
from services.ai_teacher import generate_and_save_explanation
from core.logger import log

# 1. Initialisation de Firebase
cred = credentials.Certificate(settings.FIREBASE_KEY_PATH)
firebase_admin.initialize_app(cred)

app = FastAPI(
    title="API Réseau Social Scolaire - Module IA",
    description="Backend FastAPI local pour KRAK"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://stately-wisp-8a406c.netlify.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Zone de stockage furtive (Hors de la vue de VS Code)
UPLOAD_DIR = os.path.join(tempfile.gettempdir(), "krak_uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# 3. ROUTE D'UPLOAD TACTIQUE (Mémoire vive + Dossier caché)
@app.post("/api/upload")
async def upload_file_proxy(
    file: UploadFile = File(...),
    user: dict = Depends(verify_firebase_token)
):
    log.info(f"Upload tactique reçu de l'élève [{user['uid']}] pour : {file.filename}")
    try:
        file_type = file.filename.split('.')[-1].lower()
        
        # --- CAS A : IMAGE (Transformation en Base64) ---
        if file_type in ['png', 'jpg', 'jpeg', 'webp']:
            file_bytes = await file.read()
            b64_string = base64.b64encode(file_bytes).decode('utf-8')
            
            # Formatage exigé par l'IA Vision de Groq
            mime_type = f"image/{file_type}" if file_type != 'jpg' else "image/jpeg"
            data_uri = f"data:{mime_type};base64,{b64_string}"
            
            # On renvoie le code brut de l'image, AUCUN fichier n'est écrit sur le PC
            return {"status": "success", "file_url": data_uri}
        
        # --- CAS B : PDF/WORD (Stockage hors du projet) ---
        else:
            timestamp = int(time.time())
            safe_filename = f"{timestamp}_{file.filename.replace(' ', '_')}"
            file_path = os.path.join(UPLOAD_DIR, safe_filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            local_file_url = f"https://prof-virtuel-backend.onrender.com/uploads/{safe_filename}"
            return {"status": "success", "file_url": local_file_url}
            
    except Exception as e:
        log.error(f"Échec de l'upload : {str(e)}", exc_info=True)
        return {"status": "error", "message": "Impossible de traiter le document."}


# 4. ROUTE D'EXPLICATION IA
@app.post("/api/explain", status_code=status.HTTP_202_ACCEPTED)
async def explain_concept(
    request: ConceptRequest,
    background_tasks: BackgroundTasks,
    user: dict = Depends(verify_firebase_token)
):
    log.info(f"Requête API reçue de l'élève [{user['uid']}] pour le concept: '{request.concept}'")
    
    background_tasks.add_task(
        generate_and_save_explanation,
        channel_id=request.channel_id,
        concept=request.concept,
        file_url=request.file_url,
        file_type=request.file_type
    )
    
    return {"status": "processing"}