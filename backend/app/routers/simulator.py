from fastapi import APIRouter
from ..database import get_db_connection, reset_db
from ..services.memory_buffer import MemoryBuffer
from ..config import INITIAL_BATCH_ID
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/simulator", tags=["simulator"])

@router.post("/inject")
async def inject_malicious_script():
    """
    Simulates a database-level mutation by an attacker/rogue admin.
    
    Security Fix #6: FORENSIC LOGGING AND EVIDENCE PRESERVATION
    
    This endpoint demonstrates the attack but now includes:
    1. Detailed logging of mutation attempts
    2. Recording the original vs mutated payloads
    3. Timestamp of injection for audit trail
    4. Batch ID tracking for incident response
    
    The system is designed to detect this mutation when get_current_batch()
    is called and performs hash verification.
    """
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Fetch current payload
        cursor.execute("SELECT batch_id, payload_json, status FROM payment_batches LIMIT 1")
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return {"status": "ERROR", "message": "No batch found to mutate"}
        
        batch_id = row["batch_id"]
        original_payload = json.loads(row["payload_json"])
        original_recipient = original_payload.get("recipient")
        
        # Log the injection attempt (Security Fix #6)
        logger.warning(
            f"SIMULATED ATTACK: Database mutation initiated for batch {batch_id} at {datetime.utcnow().isoformat()}Z"
        )
        logger.warning(
            f"FORENSIC: Original recipient = {original_recipient}"
        )
        
        # Malicious modification
        mutated_payload = original_payload.copy()
        mutated_payload["recipient"] = "Roadway Company Ltd (Tokyo Shell)"
        mutated_recipient = mutated_payload["recipient"]
        new_payload_json = json.dumps(mutated_payload, sort_keys=True)
        
        logger.warning(
            f"FORENSIC: Mutated recipient = {mutated_recipient}"
        )
        
        # Update database with mutated payload
        # NOTE: We only modify payload_json, NOT status - so detection happens at read-time
        cursor.execute(
            "UPDATE payment_batches SET payload_json = ? WHERE batch_id = ?", 
            (new_payload_json, batch_id)
        )
        conn.commit()
        
        logger.warning(
            f"INJECTION_COMPLETE: Batch {batch_id} payload mutated. "
            f"Hash mismatch will trigger CRITICAL_COMPROMISE on next read."
        )
        
        return {
            "status": "INJECTED",
            "message": "Database payload mutated by rogue script.",
            "forensic_evidence": {
                "batch_id": batch_id,
                "original_recipient": original_recipient,
                "mutated_recipient": mutated_recipient,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
    
    except Exception as e:
        logger.error(f"Injection simulation failed: {str(e)}", exc_info=True)
        return {"status": "ERROR", "message": f"Failed to inject mutation: {str(e)}"}
    
    finally:
        conn.close()

@router.post("/reset")
async def reset_system():
    """
    Authorized recovery route to restore the database to its seed state
    and purge any volatile cryptographic shares.
    
    This is called by authorized administrators when:
    1. Compromise is detected and forensics are complete
    2. Testing cycle is complete and system needs reset
    3. Manual remediation is required
    """
    try:
        logger.warning("SYSTEM RESET INITIATED: Database rollback and credential purge")
        
        # Reset database to seed state
        reset_db()
        logger.info("Database reset to baseline state")
        
        # Purge volatile shares for initial batch
        MemoryBuffer.clear_batch(INITIAL_BATCH_ID)
        logger.info("Volatile cryptographic shares purged")
        
        logger.info("SYSTEM RESET COMPLETE: Forensic cleanup finished, normal operation resumed")
        
        return {
            "status": "RESTORED",
            "message": "System integrity restored. Forensic cleanup complete."
        }
    
    except Exception as e:
        logger.error(f"System reset failed: {str(e)}", exc_info=True)
        return {"status": "ERROR", "message": f"Reset failed: {str(e)}"}

