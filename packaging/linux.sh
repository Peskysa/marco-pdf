#!/usr/bin/env bash
set -euo pipefail
mkdir -p build/deb/opt/marco-pdf build/deb/usr/share/applications build/deb/usr/bin build/deb/DEBIAN
cp -a 'dist/Marco PDF/.' build/deb/opt/marco-pdf/
printf '#!/bin/sh\nexec /opt/marco-pdf/Marco\\ PDF "$@"\n' > build/deb/usr/bin/marco-pdf
chmod +x build/deb/usr/bin/marco-pdf
cat > build/deb/usr/share/applications/marco-pdf.desktop <<'EOF'
[Desktop Entry]
Type=Application
Name=Marco PDF
Comment=Lector PDF con OCR y división de documentos
Exec=marco-pdf
Terminal=false
Categories=Office;Viewer;
MimeType=application/pdf;
EOF
cat > build/deb/DEBIAN/control <<'EOF'
Package: marco-pdf
Version: 1.3.0
Architecture: amd64
Maintainer: Marco Pescador <101880444+Peskysa@users.noreply.github.com>
Depends: libc6 (>= 2.35), libx11-6, libxext6, libxrender1, libxft2
Section: utils
Priority: optional
Description: Lector PDF con OCR local en español, inglés y francés
 Lee, busca y divide documentos por páginas o tamaño máximo.
EOF
dpkg-deb --root-owner-group --build build/deb dist/Marco-PDF-Linux-amd64.deb

tar -czf dist/Marco-PDF-Linux-Portable.tar.gz -C dist "Marco PDF"
