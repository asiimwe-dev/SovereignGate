# Field order of secp256k1 curve
# p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
SECP256K1_ORDER = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

# Initial system parameters
INITIAL_BATCH_ID = "VOTE-130-2026-06-04"
FUNDING_VOTE = "Vote 130 (Debt Servicing)"
SOURCE_ACCOUNT = "BOU-UCF-0019283"
INITIAL_PAYLOAD = {
    "amount": 10000000000,
    "currency": "UGX",
    "recipient": "World Bank (IDA)",
    "description": "Debt Servicing - Principal Repayment FY25/26",
}

# The expected hash of the initial payload JSON string
import hashlib
import json


def calculate_hash(payload_dict):
    payload_str = json.dumps(payload_dict, sort_keys=True)
    return hashlib.sha256(payload_str.encode()).hexdigest()


EXPECTED_HASH = calculate_hash(INITIAL_PAYLOAD)
