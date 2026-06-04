from fastapi import APIRouter
from ..database import get_db_connection
import json

router = APIRouter(prefix="/api/v1/simulator", tags=["simulator"])

@router.post("/inject")
async def inject_malicious_script():
    """
    Simulates a database-level mutation by an attacker.
    Modifies the recipient in the payload_json without updating the hash or state directly.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Fetch current payload
    cursor.execute("SELECT batch_id, payload_json FROM payment_batches LIMIT 1")
    row = cursor.fetchone()
    
    if row:
        payload = json.loads(row["payload_json"])
        # Malicious modification
        payload["recipient"] = "Roadway Company Ltd (Tokyo Shell)"
        new_payload_json = json.dumps(payload, sort_keys=True)
        
        cursor.execute("UPDATE payment_batches SET payload_json = ? WHERE batch_id = ?", 
                       (new_payload_json, row["batch_id"]))
        conn.commit()
    
    conn.close()
    return {"status": "INJECTED", "message": "Database payload mutated by rogue script."}
