"""Servidor local de solo lectura y lanzador del portable web sin Internet."""
import functools
import http.server
import json
from pathlib import Path
import sys
import threading
import tkinter as tk
from tkinter import ttk
import webbrowser


class LocalHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.mjs': 'text/javascript', '.wasm': 'application/wasm',
                      '.gz': 'application/octet-stream'}

    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        super().end_headers()


def start_server(folder=None):
    base = Path(getattr(sys, '_MEIPASS', Path(__file__).parent))
    folder = Path(folder) if folder else base / 'web' / 'dist'
    if not (folder / 'index.html').is_file():
        raise RuntimeError('Falta la aplicación web. Compila web/dist antes de crear el portable web.')
    handler = functools.partial(LocalHandler, directory=str(folder))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f'http://127.0.0.1:{server.server_port}/'


def main():
    server, url = start_server()
    # Permite probar exactamente los recursos del EXE en un navegador automatizado.
    if len(sys.argv) == 3 and sys.argv[1] == '--serve-test':
        Path(sys.argv[2]).write_text(json.dumps({'url': url}), encoding='utf-8')
        try:
            threading.Event().wait()
        finally:
            server.shutdown()
            server.server_close()
        return
    window = tk.Tk()
    window.title('Marco PDF · Web Portable')
    window.geometry('510x260')
    window.resizable(False, False)
    panel = ttk.Frame(window, padding=24)
    panel.pack(fill='both', expand=True)
    ttk.Label(panel, text='Marco PDF · Web Portable', font=('Segoe UI', 18, 'bold')).pack(pady=(0, 14))
    ttk.Label(panel, text='ES · Abre el navegador. Mantén esta ventana abierta.\nEN · Open the browser. Keep this window open.\nFR · Ouvrez le navigateur. Gardez cette fenêtre ouverte.', justify='left').pack()
    ttk.Label(panel, text=url).pack(pady=10)
    ttk.Button(panel, text='Abrir / Open / Ouvrir', command=lambda: webbrowser.open(url)).pack()
    ttk.Button(panel, text='Cerrar / Close / Fermer', command=window.destroy).pack(pady=6)
    window.after(300, lambda: webbrowser.open(url))
    try:
        window.mainloop()
    finally:
        server.shutdown()
        server.server_close()


if __name__ == '__main__':
    main()
