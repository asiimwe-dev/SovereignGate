import hashlib
import time


class FidoEmulator:
    @staticmethod
    def validate_token(token_id: str) -> bool:
        """
        Simulates a FIDO2 hardware challenge.
        In this simulation, any token starting with 'HW-' is valid.
        """
        if not token_id or not token_id.startswith("HW-"):
            return False
        # Simulate minor delay for hardware communication
        time.sleep(0.05)
        return True
