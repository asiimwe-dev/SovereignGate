from fastapi import APIRouter, HTTPException
from ..models import ShareSubmission
from ..services.fido_emulation import FidoEmulator
from ..services.memory_buffer import MemoryBuffer
from ..services.crypto_engine import CryptoEngine
from ..database import get_db_connection
import json

router = APIRouter(prefix="/api/v1/mpc", tags=["mpc"])

@router.post("/submit-share")
async def submit_share(submission: ShareSubmission):
    # 1. Validate Hardware Token
    if not FidoEmulator.validate_token(submission.hardware_token):
        raise HTTPException(status_code=401, detail="Invalid hardware token challenge response")

    # 2. Add share to volatile memory
    share_val = int(submission.share_value, 16)
    MemoryBuffer.add_share(submission.batch_id, submission.admin_id, share_val)

    # 3. Check if threshold reached (k=2)
    shares = MemoryBuffer.get_shares(submission.batch_id)
    if len(shares) >= 2:
        # Reconstruct and Sign
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT payload_json, status FROM payment_batches WHERE batch_id = ?", (submission.batch_id,))
            row = cursor.fetchone()
            
            if not row:
                raise HTTPException(status_code=404, detail="Batch not found")
            
            if row["status"] == "CRITICAL_COMPROMISE":
                raise HTTPException(status_code=403, detail="System locked due to compromise")

            master_key = CryptoEngine.reconstruct_secret(shares[:2])
            signature = CryptoEngine.sign_payload(master_key, row["payload_json"])

            # Update database
            cursor.execute('''
                UPDATE payment_batches 
                SET status = 'SETTLED', combined_signature = ?
                WHERE batch_id = ?
            ''', (signature, submission.batch_id))
            
            conn.commit()
            conn.close()

            # Wipe volatile memory immediately
            MemoryBuffer.clear_batch(submission.batch_id)
            
            return {"status": "SETTLED", "message": "Threshold reached. Payload signed and settled."}
        except Exception as e:
            if conn: conn.close()
            raise HTTPException(status_code=500, detail=f"Cryptographic failure: {str(e)}")

    return {"status": "PENDING", "message": f"Share {len(shares)} received. Waiting for threshold."}
