from fastapi import APIRouter, HTTPException
from ..database import get_db_connection
from ..config import EXPECTED_HASH, calculate_hash
from ..models import PaymentBatchResponse
import json

router = APIRouter(prefix="/api/v1/gate", tags=["gate"])

@router.get("/batch", response_model=PaymentBatchResponse)
async def get_current_batch():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM payment_batches LIMIT 1")
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="No active batch found")

    batch_data = dict(row)
    payload_json = batch_data["payload_json"]
    current_payload = json.loads(payload_json)
    
    # Dynamic Integrity Check
    current_hash = calculate_hash(current_payload)
    
    status = batch_data["status"]
    if current_hash != EXPECTED_HASH and status != "SETTLED":
        # Compromise detected!
        status = "CRITICAL_COMPROMISE"
        conn = get_db_connection()
        conn.execute("UPDATE payment_batches SET status = ? WHERE batch_id = ?", (status, batch_data["batch_id"]))
        conn.commit()
        conn.close()

    return PaymentBatchResponse(
        batch_id=batch_data["batch_id"],
        funding_vote=batch_data["funding_vote"],
        source_account=batch_data["source_account"],
        payload=current_payload,
        status=status,
        combined_signature=batch_data["combined_signature"],
        rejection_reason=batch_data["rejection_reason"]
    )
