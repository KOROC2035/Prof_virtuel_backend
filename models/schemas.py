from pydantic import BaseModel, Field
from typing import Optional

class ConceptRequest(BaseModel):
    concept: str = Field(..., description="Le concept ou la question posée par l'élève")
    channel_id: str = Field(..., description="L'ID du salon Firestore où se déroule la discussion")
    file_url: Optional[str] = Field(None, description="L'URL publique du fichier uploadé sur Firebase Storage")
    file_type: Optional[str] = Field(None, description="L'extension ou le type de fichier (ex: 'pdf', 'docx', 'image')")

class StandardResponse(BaseModel):
    status: str
    message: str