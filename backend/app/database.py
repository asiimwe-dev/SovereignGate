import json
import sqlite3

from .config import FUNDING_VOTE, INITIAL_BATCH_ID, INITIAL_PAYLOAD, SOURCE_ACCOUNT

DB_PATH = "sovereign_gate.db"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payment_batches (
            batch_id TEXT PRIMARY KEY,
            funding_vote TEXT,
            source_account TEXT,
            payload_json TEXT,
            status TEXT,
            combined_signature TEXT,
            rejection_reason TEXT
        )
    """)

    # 1. Seed initial data
    cursor.execute(
        "SELECT batch_id FROM payment_batches WHERE batch_id = ?", (INITIAL_BATCH_ID,)
    )
    if not cursor.fetchone():
        cursor.execute(
            """
            INSERT INTO payment_batches 
            (batch_id, funding_vote, source_account, payload_json, status)
            VALUES (?, ?, ?, ?, ?)
        """,
            (
                INITIAL_BATCH_ID,
                FUNDING_VOTE,
                SOURCE_ACCOUNT,
                json.dumps(INITIAL_PAYLOAD, sort_keys=True),
                "PENDING_SIGNATURE",
            ),
        )

    # 2. Seed Sample Batch 2 (Ministry of Internal Affairs)
    batch2_id = "VOTE-120-2026-06-05"
    cursor.execute(
        "SELECT batch_id FROM payment_batches WHERE batch_id = ?", (batch2_id,)
    )
    if not cursor.fetchone():
        batch2_payload = {
            "amount": 2500000000,
            "currency": "UGX",
            "recipient": "Uganda Police Force - Logistics Division",
            "description": "Quarterly Operational Funding Q1 FY26/27",
        }
        cursor.execute(
            """
            INSERT INTO payment_batches 
            (batch_id, funding_vote, source_account, payload_json, status)
            VALUES (?, ?, ?, ?, ?)
        """,
            (
                batch2_id,
                "Vote 120 (Ministry of Internal Affairs)",
                "BOU-UCF-0019283",
                json.dumps(batch2_payload, sort_keys=True),
                "PENDING_SIGNATURE",
            ),
        )

    # 3. Seed Sample Batch 3 (Electoral Commission)
    batch3_id = "VOTE-142-2026-06-06"
    cursor.execute(
        "SELECT batch_id FROM payment_batches WHERE batch_id = ?", (batch3_id,)
    )
    if not cursor.fetchone():
        batch3_payload = {
            "amount": 7800000000,
            "currency": "UGX",
            "recipient": "Smartmatic International Ltd",
            "description": "Procurement of Voter Verification Hardware Upgrade",
        }
        cursor.execute(
            """
            INSERT INTO payment_batches 
            (batch_id, funding_vote, source_account, payload_json, status)
            VALUES (?, ?, ?, ?, ?)
        """,
            (
                batch3_id,
                "Vote 142 (Electoral Commission)",
                "BOU-EC-0077812",
                json.dumps(batch3_payload, sort_keys=True),
                "PENDING_SIGNATURE",
            ),
        )

    # 4. Seed Sample Batch 4 (Uganda Road Fund)
    batch4_id = "VOTE-167-2026-06-07"
    cursor.execute(
        "SELECT batch_id FROM payment_batches WHERE batch_id = ?", (batch4_id,)
    )
    if not cursor.fetchone():
        batch4_payload = {
            "amount": 4200000000,
            "currency": "UGX",
            "recipient": "China Road and Bridge Corporation",
            "description": "Kampala-Jinja Expressway Construction Phase 1B",
        }
        cursor.execute(
            """
            INSERT INTO payment_batches 
            (batch_id, funding_vote, source_account, payload_json, status)
            VALUES (?, ?, ?, ?, ?)
        """,
            (
                batch4_id,
                "Vote 167 (Uganda Road Fund)",
                "BOU-UCF-0019283",
                json.dumps(batch4_payload, sort_keys=True),
                "PENDING_SIGNATURE",
            ),
        )

    conn.commit()
    conn.close()


def reset_db():
    """Wipes the database and re-initializes with seed data."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM payment_batches")
    conn.commit()
    conn.close()
    init_db()
