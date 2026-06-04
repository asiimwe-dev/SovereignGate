import random
from typing import List, Tuple
from ..config import SECP256K1_ORDER
from starkbank_ecdsa import PrivateKey, Ecdsa

class CryptoEngine:
    @staticmethod
    def _extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
        if a == 0:
            return b, 0, 1
        else:
            g, y, x = CryptoEngine._extended_gcd(b % a, a)
            return g, x - (b // a) * y, y

    @staticmethod
    def _mod_inverse(a: int, m: int) -> int:
        g, x, y = CryptoEngine._extended_gcd(a, m)
        if g != 1:
            raise Exception('Modular inverse does not exist')
        else:
            return x % m

    @staticmethod
    def split_secret(secret: int, k: int, n: int) -> List[Tuple[int, int]]:
        """Splits a secret into n shares with a threshold of k using SSS over secp256k1 field."""
        if k > n:
            raise ValueError("Threshold k cannot be greater than n")
        
        # Polynomial coefficients: a0 = secret, a1...ak-1 are random
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
        """Reconstructs the secret from shares using Lagrange interpolation at x=0."""
        secret = 0
        for i, (xi, yi) in enumerate(shares):
            li = 1
            for j, (xj, yj) in enumerate(shares):
                if i == j:
                    continue
                num = (0 - xj) % SECP256K1_ORDER
                den = (xi - xj) % SECP256K1_ORDER
                li = (li * num * CryptoEngine._mod_inverse(den, SECP256K1_ORDER)) % SECP256K1_ORDER
            secret = (secret + yi * li) % SECP256K1_ORDER
        return secret

    @staticmethod
    def sign_payload(private_key_int: int, payload: str) -> str:
        """Signs a payload using ECDSA with the reconstructed private key."""
        priv_key = PrivateKey(secret=private_key_int)
        signature = Ecdsa.sign(payload, priv_key)
        return signature.toBase64()
