@echo off
cd /d "%~dp0"
if exist "dist\Marco PDF\Marco PDF.exe" (
    start "" "dist\Marco PDF\Marco PDF.exe"
) else if exist ".venv\Scripts\pythonw.exe" (
    start "" ".venv\Scripts\pythonw.exe" app.py
) else (
    echo Ejecuta primero preparar.ps1 o descarga la version portable.
    pause
)
