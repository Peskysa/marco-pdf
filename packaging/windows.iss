#define AppName "Marco PDF"
[Setup]
AppId={{1CD837DC-06B5-4D1D-9E4B-4CED340AE041}
AppName={#AppName}
AppVersion=1.1.0
AppPublisher=Marco Pescador
DefaultDirName={localappdata}\Programs\Marco PDF
DefaultGroupName=Marco PDF
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=Marco-PDF-Windows-Instalador
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
UninstallDisplayIcon={app}\Marco PDF.exe
[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
[Files]
Source: "..\dist\Marco PDF\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{group}\Marco PDF"; Filename: "{app}\Marco PDF.exe"
Name: "{autodesktop}\Marco PDF"; Filename: "{app}\Marco PDF.exe"
[Run]
Filename: "{app}\Marco PDF.exe"; Description: "Abrir Marco PDF"; Flags: nowait postinstall skipifsilent
