from typing import Any

from pydantic import BaseModel


class ShareSubmission(BaseModel):
    batch_id: str
    admin_id: int
    share_value: str  # Hex string for large ints
    hardware_token: str


class PaymentBatchResponse(BaseModel):
    batch_id: str
    funding_vote: str
    source_account: str
    payload: dict[str, Any]
    status: str
    combined_signature: str | None = None
    rejection_reason: str | None = None
