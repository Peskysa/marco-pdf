"""Crea una clave Android privada y la guarda en secretos GitHub sin imprimirla."""
import base64
import datetime
from pathlib import Path
import secrets
import subprocess
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID

folder = Path(__file__).resolve().parent.parent / '.signing'
folder.mkdir(exist_ok=True)
keyfile, passwordfile = folder / 'marco-pdf.p12', folder / 'password.txt'
if not keyfile.exists():
    password = secrets.token_urlsafe(32)
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'Marco PDF')])
    now = datetime.datetime.now(datetime.timezone.utc)
    cert = x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(key.public_key()).serial_number(x509.random_serial_number()).not_valid_before(now - datetime.timedelta(days=1)).not_valid_after(now + datetime.timedelta(days=365*30)).sign(key, hashes.SHA256())
    keyfile.write_bytes(pkcs12.serialize_key_and_certificates(b'marco-pdf', key, cert, None, serialization.BestAvailableEncryption(password.encode())))
    passwordfile.write_text(password, encoding='utf-8')
gh = 'D:/PROGRAMAS/tools/gh/bin/gh.exe'
for name, data in [('ANDROID_KEYSTORE', base64.b64encode(keyfile.read_bytes())), ('ANDROID_KEY_PASSWORD', passwordfile.read_bytes())]:
    subprocess.run([gh, 'secret', 'set', name, '--repo', 'Peskysa/marco-pdf'], input=data, check=True)
print('Firma Android configurada. Copia privada guardada en .signing (excluida de Git).')
