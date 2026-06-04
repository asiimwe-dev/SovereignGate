import sqlite3
import json
from .config import INITIAL_BATCH_ID, FUNDING_VOTE, SOURCE_ACCOUNT, INITIAL_PAYLOAD

DB_PATH = "sovereign_gate.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payment_batches (
            batch_id TEXT PRIMARY KEY,
            funding_vote TEXT,
            source_account TEXT,
            payload_json TEXT,
            status TEXT,
            combined_signature TEXT,
            rejection_reason TEXT
        )
    ''')
    
    # Seed initial data
    cursor.execute("SELECT batch_id FROM payment_batches WHERE batch_id = ?", (INITIAL_BATCH_ID,))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO payment_batches 
            (batch_id, funding_vote, source_account, payload_json, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            INITIAL_BATCH_ID,
            FUNDING_VOTE,
            SOURCE_ACCOUNT,
            json.dumps(INITIAL_PAYLOAD, sort_keys=True),
            "PENDING_SIGNATURE"
        ))
    
    conn.commit()
    conn.close()
