import random
from typing import List, Tuple
from ..config import SECP256K1_ORDER
from Crypto.PublicKey import ECC
from Crypto.Signature import DSS
from Crypto.Hash import SHA256
import base64

class CryptoEngine:
    @staticmethod
    def _extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
        if a == 0: return b, 0, 1
        g, y, x = CryptoEngine._extended_gcd(b % a, a)
        return g, x - (b // a) * y, y

    @staticmethod
    def _mod_inverse(a: int, m: int) -> int:
        g, x, y = CryptoEngine._extended_gcd(a, m)
        if g != 1: raise Exception('Modular inverse does not exist')
        return x % m

    @staticmethod
    def split_secret(secret: int, k: int, n: int) -> List[Tuple[int, int]]:
        if k > n: raise ValueError("Threshold k cannot be greater than n")
        coeffs = [secret] + [random.SystemRandom().randint(1, SECP256K1_ORDER - 1) for _ in range(k - 1)]
        shares = []
        for i in range(1, n + 1):
            x = i
            y = 0
            for exp, coeff in enumerate(coeffs):
                y = (y + coeff * pow(x, exp, SECP256K1_ORDER)) % SECP256K1_ORDER
            shares.append((x, y))
        return shares

    @staticmethod
    def reconstruct_secret(shares: List[Tuple[int, int]]) -> int:
        secret = 0
        for i, (xi, yi) in enumerate(shares):
            li = 1
            for j, (xj, yj) in enumerate(shares):
                if i == j: continue
                num = (0 - xj) % SECP256K1_ORDER
                den = (xi - xj) % SECP256K1_ORDER
                li = (li * num * CryptoEngine._mod_inverse(den, SECP256K1_ORDER)) % SECP256K1_ORDER
            secret = (secret + yi * li) % SECP256K1_ORDER
        return secret

    @staticmethod
    def sign_payload(private_key_int: int, payload: str) -> str:
        key = ECC.construct(curve='secp256k1', d=private_key_int)
        h = SHA256.new(payload.encode('utf-8'))
        signer = DSS.new(key, 'fips-186-3')
        signature = signer.sign(h)
        return base64.b64encode(signature).decode('utf-8')
