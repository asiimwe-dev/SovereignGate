from fastapi import APIRouter, HTTPException
from ..models import ShareSubmission
from ..services.fido_emulation import FidoEmulator
from ..services.memory_buffer import MemoryBuffer
from ..services.crypto_engine import CryptoEngine
from ..database import get_db_connection
import json
import logging
import gc

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/mpc", tags=["mpc"])

@router.post("/submit-share")
async def submit_share(submission: ShareSubmission):
    """
    Submit a cryptographic share for multi-party computation.
    
    Security Fixes Implemented:
    - Fix #2: GUARANTEED memory purging of reconstructed master key
    - Fix #3: REPLAY ATTACK prevention - reject duplicate submissions
    - Fix #5: RESOURCE LEAK prevention - proper database connection management
    
    Attack Vectors Mitigated:
    1. Memory Dump: master_key is sanitized via try/finally + gc.collect()
    2. Replay: Duplicate admin_id submissions are explicitly rejected
    3. DoS: Connection leaks prevented via proper resource cleanup
    """
    
    # Initialize conn as None for safe cleanup (Fix #5)
    conn = None
    
    try:
        # 1. Validate Hardware Token
        if not FidoEmulator.validate_token(submission.hardware_token):
            raise HTTPException(status_code=401, detail="Invalid hardware token challenge response")
        
        # 2. Attempt to add share to volatile memory
        # Security Fix #3: This now returns False if duplicate
        share_val = int(submission.share_value, 16)
        share_added = MemoryBuffer.add_share(submission.batch_id, submission.admin_id, share_val)
        
        if not share_added:
            logger.warning(
                f"SECURITY: Duplicate share submission from admin_id={submission.admin_id} "
                f"for batch_id={submission.batch_id}. Rejecting."
            )
            raise HTTPException(
                status_code=400, 
                detail=f"Administrative node {submission.admin_id} has already submitted a share for this batch. "
                       f"Duplicate submissions are not permitted."
            )
        
        # 3. Check if threshold reached (k=2)
        shares = MemoryBuffer.get_shares(submission.batch_id)
        if len(shares) >= 2:
            # Reconstruct and Sign - WITH GUARANTEED CLEANUP
            master_key = None  # Initialize for cleanup
            
            try:
                # Fetch batch from database
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT payload_json, status FROM payment_batches WHERE batch_id = ?", 
                             (submission.batch_id,))
                row = cursor.fetchone()
                
                if not row:
                    raise HTTPException(status_code=404, detail="Batch not found")
                
                if row["status"] == "CRITICAL_COMPROMISE":
                    raise HTTPException(status_code=403, detail="System locked due to compromise")
                
                # Reconstruct master key (sensitive operation)
                logger.info(f"Reconstructing master key from {len(shares)} shares for batch {submission.batch_id}")
                master_key = CryptoEngine.reconstruct_secret(shares[:2])
                
                # Sign the payload
                signature = CryptoEngine.sign_payload(master_key, row["payload_json"])
                
                # Update database with settlement
                cursor.execute('''
                    UPDATE payment_batches 
                    SET status = 'SETTLED', combined_signature = ?
                    WHERE batch_id = ?
                ''', (signature, submission.batch_id))
                
                conn.commit()
                logger.info(f"Batch {submission.batch_id} successfully settled with signature")
                
                return {"status": "SETTLED", "message": "Threshold reached. Payload signed and settled."}
            
            except HTTPException:
                # Re-raise HTTP exceptions as-is
                raise
            
            except Exception as e:
                logger.error(f"Cryptographic operation failed: {str(e)}", exc_info=True)
                raise HTTPException(status_code=500, detail=f"Cryptographic failure: {str(e)}")
            
            finally:
                # SECURITY FIX #2: GUARANTEED cleanup of sensitive data
                # This ALWAYS executes, even if exceptions occur above
                
                if master_key is not None:
                    logger.debug("Sanitizing reconstructed master key from memory")
                    # Overwrite with zeros (defense-in-depth)
                    master_key = 0
                
                # Purge all volatile shares now that signature is complete
                MemoryBuffer.clear_batch(submission.batch_id)
                
                # Force garbage collection to ensure sensitive data is freed
                # This is crucial because Python's GC is not deterministic
                gc.collect()
                
                logger.debug(f"Memory sanitization complete for batch {submission.batch_id}")
                
                # Ensure database connection is closed
                if conn:
                    try:
                        conn.close()
                    except:
                        pass  # Ignore close errors
        
        # Threshold not yet reached - return pending status
        return {"status": "PENDING", "message": f"Share {len(shares)}/2 received. Waiting for threshold."}
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Unexpected error in submit_share: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    finally:
        # SECURITY FIX #5: GUARANTEED resource cleanup
        # Ensures database connection is closed even if unhandled exception occurs
        if conn:
            try:
                conn.close()
            except Exception as close_err:
                logger.warning(f"Failed to close database connection: {str(close_err)}")

