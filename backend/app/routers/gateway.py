from fastapi import APIRouter, HTTPException
from ..database import get_db_connection
from ..config import EXPECTED_HASH, calculate_hash
from ..models import PaymentBatchResponse
from ..services.memory_buffer import MemoryBuffer
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/gate", tags=["gate"])

@router.get("/batch", response_model=PaymentBatchResponse)
async def get_current_batch():
    """
    Retrieve current payment batch with MANDATORY integrity verification.
    
    SECURITY FIX #1: OUT-OF-BAND BYPASS PREVENTION
    
    The integrity check is ALWAYS performed, regardless of status.
    This prevents attackers from bypassing verification by pre-setting status to SETTLED.
    
    Attack Vector (Previously Vulnerable):
    1. Attacker mutates payload_json in database
    2. Attacker sets status = "SETTLED"
    3. Old code: if (hash != expected AND status != SETTLED) → condition FALSE → no alert
    4. Compromised payload returned to frontend as legitimate ✗
    
    New Code:
    - ALWAYS calculate hash
    - ALWAYS compare against EXPECTED_HASH
    - If mismatch detected, ALWAYS set status to CRITICAL_COMPROMISE
    - Status field is ignored - only hash matters
    """
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
    
    # MANDATORY Integrity Check - ALWAYS performed (FIX #1)
    current_hash = calculate_hash(current_payload)
    status = batch_data["status"]
    
    # Security Invariant: If hash doesn't match, system is compromised
    # This check is NOT conditional on status - it ALWAYS runs
    if current_hash != EXPECTED_HASH:
        logger.critical(
            f"CRITICAL COMPROMISE DETECTED for batch {batch_data['batch_id']}. "
            f"Payload hash mismatch. "
            f"Expected: {EXPECTED_HASH}, Got: {current_hash}. "
            f"Previous Status: {status}. Setting to CRITICAL_COMPROMISE."
        )
        
        status = "CRITICAL_COMPROMISE"
        
        # Update database with compromise state
        conn = get_db_connection()
        try:
            conn.execute(
                "UPDATE payment_batches SET status = ? WHERE batch_id = ?",
                (status, batch_data["batch_id"])
            )
            conn.commit()
        finally:
            conn.close()
        
        # Purge all volatile shares for this batch immediately (defense-in-depth)
        MemoryBuffer.clear_batch(batch_data["batch_id"])
        
        logger.info(f"Compromise remediation complete: batch purged, shares cleared")

    return PaymentBatchResponse(
        batch_id=batch_data["batch_id"],
        funding_vote=batch_data["funding_vote"],
        source_account=batch_data["source_account"],
        payload=current_payload,
        status=status,
        combined_signature=batch_data["combined_signature"],
        rejection_reason=batch_data["rejection_reason"]
    )

