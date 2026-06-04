from pydantic import BaseModel
from typing import Optional, Dict, Any

class ShareSubmission(BaseModel):
    batch_id: str
    admin_id: int
    share_value: str # Hex string for large ints
    hardware_token: str

class PaymentBatchResponse(BaseModel):
    batch_id: str
    funding_vote: str
    source_account: str
    payload: Dict[str, Any]
    status: str
    combined_signature: Optional[str] = None
    rejection_reason: Optional[str] = None
