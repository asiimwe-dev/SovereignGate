import logging
import threading

logger = logging.getLogger(__name__)

# Volatile in-memory share storage: {batch_id: {admin_id: share_value}}
_SHARE_BUFFER: dict[str, dict[int, int]] = {}
_buffer_lock = threading.Lock()


class MemoryBuffer:
    @staticmethod
    def add_share(batch_id: str, admin_id: int, share_value: int) -> bool:
        """
        Add a cryptographic share to the volatile memory buffer.

        Security Fix #3: REPLAY ATTACK PREVENTION
        - Prevents the same admin_id from submitting multiple times
        - Returns False if admin_id already has a share for this batch
        - Caller must check return value and reject duplicate submissions

        Args:
            batch_id: Transaction batch identifier
            admin_id: Administrative node ID (1, 2, or 3)
            share_value: Cryptographic share value (integer)

        Returns:
            True if share added successfully
            False if admin_id already submitted (duplicate detected)
        """
        with _buffer_lock:
            if batch_id not in _SHARE_BUFFER:
                _SHARE_BUFFER[batch_id] = {}

            # SECURITY FIX #3: Check for duplicate submission
            if admin_id in _SHARE_BUFFER[batch_id]:
                logger.warning(
                    f"SECURITY: Duplicate share submission detected for "
                    f"batch_id={batch_id}, admin_id={admin_id}. "
                    f"Rejecting replay attempt."
                )
                return False  # Reject duplicate

            # Add share only if not already present
            _SHARE_BUFFER[batch_id][admin_id] = share_value
            logger.info(
                f"Share accepted from admin_id={admin_id} for batch_id={batch_id}"
            )
            return True

    @staticmethod
    def get_shares(batch_id: str) -> list[tuple[int, int]]:
        """
        Retrieve all current shares for a batch in (admin_id, share_value) format.

        Returns:
            List of (admin_id, share_value) tuples
            Empty list if batch_id not in buffer
        """
        with _buffer_lock:
            if batch_id not in _SHARE_BUFFER:
                return []
            return [
                (admin_id, share_value)
                for admin_id, share_value in _SHARE_BUFFER[batch_id].items()
            ]

    @staticmethod
    def clear_batch(batch_id: str):
        """
        CRITICAL SECURITY: Immediately delete all share data for a batch.

        This is called in two scenarios:
        1. After successful settlement - transaction complete, shares no longer needed
        2. After compromise detection - purge sensitive data before locking system down

        Uses explicit del to ensure immediate garbage collection hints.
        Caller MUST follow with gc.collect() in try/finally block.
        """
        with _buffer_lock:
            if batch_id in _SHARE_BUFFER:
                # Explicitly delete to signal importance to garbage collector
                batch_shares = _SHARE_BUFFER[batch_id]
                for admin_id in list(batch_shares.keys()):
                    # Overwrite with zeros before deletion as defense-in-depth
                    batch_shares[admin_id] = 0

                # Delete the entire batch entry
                del _SHARE_BUFFER[batch_id]
                logger.info(f"Batch {batch_id} cleared from volatile memory")

    @staticmethod
    def has_share(batch_id: str, admin_id: int) -> bool:
        """
        Check if a specific admin has already submitted a share for this batch.
        Used by replay detection logic.
        """
        with _buffer_lock:
            return batch_id in _SHARE_BUFFER and admin_id in _SHARE_BUFFER[batch_id]
