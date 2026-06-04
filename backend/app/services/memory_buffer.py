from typing import Dict, List, Tuple
import threading

# Volatile in-memory share storage
_SHARE_BUFFER: Dict[str, Dict[int, int]] = {}
_buffer_lock = threading.Lock()

class MemoryBuffer:
    @staticmethod
    def add_share(batch_id: str, admin_id: int, share_value: int):
        with _buffer_lock:
            if batch_id not in _SHARE_BUFFER:
                _SHARE_BUFFER[batch_id] = {}
            _SHARE_BUFFER[batch_id][admin_id] = share_value

    @staticmethod
    def get_shares(batch_id: str) -> List[Tuple[int, int]]:
        with _buffer_lock:
            if batch_id not in _SHARE_BUFFER:
                return []
            return [(admin_id, share_value) for admin_id, share_value in _SHARE_BUFFER[batch_id].items()]

    @staticmethod
    def clear_batch(batch_id: str):
        with _buffer_lock:
            if batch_id in _SHARE_BUFFER:
                del _SHARE_BUFFER[batch_id]
