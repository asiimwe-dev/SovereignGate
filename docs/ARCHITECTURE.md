# System Architecture

## Cryptographic Foundation

SovereignGate leverages Shamir's Secret Sharing (SSS) over the secp256k1 elliptic curve field order.

### Field Parameters
-   Curve: secp256k1
-   Field Order (p): 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141

### Threshold Logic (k=2, n=3)
The system generates a random polynomial f(x) of degree k-1 = 1:
f(x) = S + a1*x (mod p)
Where S is the master private key and a1 is a random coefficient.
Three shares are generated: (1, f(1)), (2, f(2)), (3, f(3)).

Reconstruction is performed using Lagrange Interpolation at x=0.

## System Components

### 1. Backend Services
-   CryptoEngine: Handles polynomial evaluation, modular inverse, and ECDSA signing.
-   MemoryBuffer: A thread-safe, in-memory volatile dictionary that stores incoming shares. It is strictly non-persistent.
-   FidoEmulator: Simulates hardware-level challenge-response for share submission.

### 2. Database Schema
The persistence layer uses SQLite to store payment batch metadata.
-   payment_batches: Stores batch_id, funding_vote, payload_json (encrypted/hashed), and status.

### 3. Frontend Orchestration
-   SystemContext: Manages global state, including polling intervals and the "Compromise Detection" hook.
-   MPCVisualizer: A live drawing component that visualizes the cryptographic mesh and node health.

## Data Flow
1.  Admin initiates a sign request via the UI.
2.  Hardware token challenge is validated.
3.  Admin share is sent to the backend and stored in _SHARE_BUFFER.
4.  Once share count reaches 2, the CryptoEngine reconstructs the key.
5.  The payload is signed using ECDSA.
6.  The batch status is updated to SETTLED.
7.  _SHARE_BUFFER is cleared.
