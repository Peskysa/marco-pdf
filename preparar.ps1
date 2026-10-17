$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
py -3 -m venv .venv
& ./.venv/Scripts/python.exe -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar las dependencias.' }
New-Item -ItemType Directory -Force tessdata | Out-Null
foreach ($language in @('spa', 'eng')) {
    Invoke-WebRequest "https://github.com/tesseract-ocr/tessdata_fast/raw/main/$language.traineddata" -OutFile "tessdata/$language.traineddata"
}
Write-Host 'Preparado. Abre iniciar.bat para usar Marco PDF.'
