# API Specification

The SovereignGate API is a RESTful service built with FastAPI, using JSON for all request/response payloads.

## Base URL
http://localhost:8000/api/v1

## Endpoints

### 1. Gateway Service

#### GET /gate/batch
Fetches the current active payment batch and performs an integrity check.
-   Response (200 OK): PaymentBatchResponse
-   Side Effect: Updates status to CRITICAL_COMPROMISE if payload hash mismatch is detected.

### 2. MPC Service

#### POST /mpc/submit-share
Submits a cryptographic share for a specific batch.
-   Payload:
    {
      "batch_id": "string",
      "admin_id": 1,
      "share_value": "hex_string",
      "hardware_token": "string"
    }
-   Responses:
    -   200 OK: Share received or threshold reached (Settled).
    -   401 Unauthorized: Invalid hardware token.
    -   403 Forbidden: System locked due to compromise.

### 3. Simulation Service (Internal/Debug)

#### POST /simulator/inject
Simulates a malicious database injection.
-   Response (200 OK): Confirmation of mutation.

## Data Models

### PaymentBatchResponse
{
  "batch_id": "string",
  "funding_vote": "string",
  "source_account": "string",
  "payload": {
    "amount": 10000000000,
    "recipient": "string",
    "description": "string"
  },
  "status": "PENDING_SIGNATURE | SETTLED | CRITICAL_COMPROMISE",
  "combined_signature": "string | null",
  "rejection_reason": "string | null"
}
hare submissions.
-   The frontend renders a non-bypassable overlay.
-   All cryptographic buffers associated with the compromised batch are purged.
