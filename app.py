"""Marco PDF: lector y herramientas PDF de escritorio."""
import os
import queue
import threading
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, simpledialog
from pathlib import Path
import pymupdf as pdf
from PIL import Image, ImageTk
from core import pages_from_spec, split_pages, split_megabytes, ocr_document


class MarcoPDF(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('Marco PDF')
        self.geometry('1180x820')
        self.minsize(900, 600)
        self.doc = None
        self.page = 0
        self.zoom = 1.0
        self.busy = False
        self.events = queue.Queue()
        style = ttk.Style(self)
        style.theme_use('clam')
        style.configure('TButton', padding=7)
        style.configure('Title.TLabel', font=('Segoe UI', 22, 'bold'), foreground='#156e87')
        top = ttk.Frame(self, padding=14)
        top.pack(fill='x')
        ttk.Label(top, text='Marco PDF', style='Title.TLabel').pack(side='left')
        ttk.Label(top, text='  Lector · OCR · Dividir', foreground='#506579').pack(side='left')
        ttk.Button(top, text='Abrir PDF', command=self.open_file).pack(side='right')
        bar = ttk.Frame(self, padding=(14, 0, 14, 10))
        bar.pack(fill='x')
        for label, action in [('◀', lambda: self.move(-1)), ('▶', lambda: self.move(1)),
                              ('− Zoom', lambda: self.scale(.8)), ('+ Zoom', lambda: self.scale(1.25)),
                              ('Ajustar ancho', self.fit), ('Buscar texto', self.search), ('Ver texto', self.text_view)]:
            ttk.Button(bar, text=label, command=action).pack(side='left', padx=2)
        self.counter = ttk.Label(bar, text='Sin documento')
        self.counter.pack(side='right')
        body = ttk.Frame(self)
        body.pack(fill='both', expand=True)
        tools = ttk.Frame(body, width=255, padding=16)
        tools.pack(side='left', fill='y')
        ttk.Label(tools, text='HERRAMIENTAS', font=('Segoe UI', 11, 'bold')).pack(anchor='w', pady=(0, 16))
        ttk.Label(tools, text='Páginas (vacío = todas)').pack(anchor='w')
        self.ranges = ttk.Entry(tools, width=27)
        self.ranges.pack(fill='x', pady=5)
        ttk.Label(tools, text='Ejemplo: 1-3,5,8-10', foreground='#617384').pack(anchor='w')
        ttk.Separator(tools).pack(fill='x', pady=18)
        ttk.Label(tools, text='Dividir cada N páginas').pack(anchor='w')
        self.chunk = ttk.Entry(tools)
        self.chunk.insert(0, '1')
        self.chunk.pack(fill='x', pady=5)
        ttk.Button(tools, text='Dividir por páginas', command=lambda: self.split(False)).pack(fill='x')
        ttk.Label(tools, text='Tamaño máximo en MB', padding=(0, 18, 0, 0)).pack(anchor='w')
        self.megabytes = ttk.Entry(tools)
        self.megabytes.insert(0, '10')
        self.megabytes.pack(fill='x', pady=5)
        ttk.Button(tools, text='Dividir por tamaño', command=lambda: self.split(True)).pack(fill='x')
        ttk.Label(tools, text='1 MB = 1.000.000 bytes\nSe conservan páginas completas.', foreground='#617384').pack(anchor='w', pady=6)
        ttk.Separator(tools).pack(fill='x', pady=18)
        ttk.Label(tools, text='Reconocimiento OCR').pack(anchor='w')
        self.language = ttk.Combobox(tools, values=['spa+eng', 'spa', 'eng'], state='readonly')
        self.language.set('spa+eng')
        self.language.pack(fill='x', pady=6)
        ttk.Button(tools, text='Crear PDF con texto', command=self.ocr).pack(fill='x')
        ttk.Label(tools, text='Procesamiento local.\nEl OCR conserva las páginas\nque ya tienen texto.', foreground='#617384').pack(anchor='w', pady=10)
        viewer = ttk.Frame(body)
        viewer.pack(side='left', fill='both', expand=True)
        self.canvas = tk.Canvas(viewer, bg='#233446', highlightthickness=0)
        sy = ttk.Scrollbar(viewer, orient='vertical', command=self.canvas.yview)
        sx = ttk.Scrollbar(viewer, orient='horizontal', command=self.canvas.xview)
        self.canvas.configure(yscrollcommand=sy.set, xscrollcommand=sx.set)
        sy.pack(side='right', fill='y')
        sx.pack(side='bottom', fill='x')
        self.canvas.pack(fill='both', expand=True)
        self.canvas.create_text(320, 220, text='Abre un PDF para empezar', fill='white', font=('Segoe UI', 22))
        self.canvas.bind('<MouseWheel>', lambda e: self.canvas.yview_scroll(-int(e.delta/120), 'units'))
        self.status = tk.StringVar(value='Listo · Tus documentos permanecen en tu equipo')
        ttk.Label(self, textvariable=self.status, padding=10).pack(fill='x')
        self.bind('<Control-o>', lambda e: self.open_file())
        self.protocol('WM_DELETE_WINDOW', self.close)
        self.after(100, self.poll)

    def ready(self):
        if self.busy:
            messagebox.showinfo('Marco PDF', 'Espera a que termine la operación actual.')
            return False
        if not self.doc:
            messagebox.showinfo('Marco PDF', 'Abre un PDF primero.')
            return False
        return True

    def open_file(self):
        if self.busy:
            return
        path = filedialog.askopenfilename(filetypes=[('Documentos PDF', '*.pdf')])
        if not path:
            return
        doc = None
        try:
            doc = pdf.open(path)
            if doc.needs_pass:
                password = simpledialog.askstring('PDF protegido', 'Contraseña:', show='*')
                if password is None or not doc.authenticate(password):
                    raise ValueError('No se pudo desbloquear el documento.')
            if not len(doc):
                raise ValueError('El documento no tiene páginas.')
            if self.doc:
                self.doc.close()
            self.doc, self.path, self.page = doc, Path(path), 0
            self.ranges.delete(0, 'end')
            self.title(f'{self.path.name} — Marco PDF')
            self.fit()
        except Exception as exc:
            if doc and doc is not self.doc:
                doc.close()
            messagebox.showerror('No se puede abrir', str(exc))

    def render(self):
        if not self.doc:
            return
        pix = self.doc[self.page].get_pixmap(matrix=pdf.Matrix(self.zoom, self.zoom), alpha=False)
        self.photo = ImageTk.PhotoImage(Image.frombytes('RGB', (pix.width, pix.height), pix.samples))
        self.canvas.delete('all')
        self.canvas.create_image(15, 15, anchor='nw', image=self.photo)
        self.canvas.configure(scrollregion=(0, 0, pix.width+30, pix.height+30))
        self.canvas.yview_moveto(0)
        self.counter.configure(text=f'{self.page+1} / {len(self.doc)} · {self.zoom:.0%}')

    def fit(self):
        if self.doc and not self.busy:
            self.update_idletasks()
            self.zoom = max(.2, min(3, (self.canvas.winfo_width()-35)/self.doc[self.page].rect.width))
            self.render()

    def move(self, step):
        if self.doc and not self.busy:
            self.page = max(0, min(len(self.doc)-1, self.page+step))
            self.render()

    def scale(self, factor):
        if self.doc and not self.busy:
            self.zoom = max(.2, min(3, self.zoom*factor))
            self.render()

    def search(self):
        if not self.ready():
            return
        query = simpledialog.askstring('Buscar', 'Texto a buscar:')
        if query:
            for offset in range(1, len(self.doc)+1):
                index = (self.page+offset) % len(self.doc)
                hits = self.doc[index].search_for(query)
                if hits:
                    self.page = index
                    self.render()
                    for rect in hits:
                        self.canvas.create_rectangle(15+rect.x0*self.zoom, 15+rect.y0*self.zoom,
                                                     15+rect.x1*self.zoom, 15+rect.y1*self.zoom,
                                                     outline='#e4a600', width=3)
                    self.status.set(f'{len(hits)} coincidencias en la página {index+1}')
                    return
            messagebox.showinfo('Buscar', 'Sin resultados. Si es un escaneo, crea primero un PDF con OCR y ábrelo.')

    def text_view(self):
        if self.ready():
            window = tk.Toplevel(self)
            window.title(f'Texto · Página {self.page+1}')
            text = tk.Text(window, wrap='word', font=('Segoe UI', 12))
            text.pack(fill='both', expand=True)
            text.insert('1.0', self.doc[self.page].get_text() or 'Esta página no tiene texto. Utiliza el OCR.')

    def selected(self):
        return pages_from_spec(self.ranges.get(), len(self.doc))

    def run_job(self, action):
        self.busy = True
        self.status.set('Procesando…')
        def worker():
            try:
                self.events.put(('done', action()))
            except Exception as exc:
                self.events.put(('error', str(exc)))
        threading.Thread(target=worker, daemon=True).start()

    def poll(self):
        try:
            while True:
                kind, text = self.events.get_nowait()
                self.status.set(text)
                if kind != 'progress':
                    self.busy = False
                    (messagebox.showerror if kind == 'error' else messagebox.showinfo)('Marco PDF', text)
        except queue.Empty:
            pass
        self.after(100, self.poll)

    def split(self, by_size):
        if not self.ready():
            return
        try:
            pages = self.selected()
            amount = float(self.megabytes.get().replace(',', '.')) if by_size else int(self.chunk.get())
            if amount <= 0:
                raise ValueError('Introduce un valor mayor que cero.')
        except ValueError as exc:
            messagebox.showerror('Revisa los datos', str(exc))
            return
        folder = filedialog.askdirectory(title='Carpeta para los archivos divididos')
        if not folder:
            return
        def action():
            parts = split_megabytes(self.doc, pages, amount) if by_size else split_pages(self.doc, pages, amount)
            import tempfile
            target = Path(tempfile.mkdtemp(prefix=f'{self.path.stem}_partes_', dir=folder))
            try:
                for n, data in enumerate(parts, 1):
                    (target / f'parte_{n:03}.pdf').write_bytes(data)
            except Exception:
                import shutil
                shutil.rmtree(target)
                raise
            return f'Creados {len(parts)} archivos en:\n{target}'
        self.run_job(action)

    def ocr(self):
        if not self.ready():
            return
        try:
            pages = self.selected()
        except ValueError as exc:
            messagebox.showerror('Páginas', str(exc))
            return
        destination = filedialog.asksaveasfilename(defaultextension='.pdf', initialfile=f'{self.path.stem}_ocr.pdf', filetypes=[('PDF', '*.pdf')])
        if not destination:
            return
        if Path(destination).resolve() == self.path.resolve():
            messagebox.showerror('Guardar', 'Elige otro nombre para conservar el original.')
            return
        language = self.language.get()
        def action():
            data = ocr_document(self.doc, pages, language, lambda n: self.events.put(('progress', f'OCR: {n}/{len(pages)} páginas')))
            import tempfile
            fd, temp = tempfile.mkstemp(dir=Path(destination).parent, suffix='.pdf')
            try:
                with os.fdopen(fd, 'wb') as stream:
                    stream.write(data)
                os.replace(temp, destination)
            finally:
                if os.path.exists(temp):
                    os.unlink(temp)
            return f'PDF con texto guardado en:\n{destination}'
        self.run_job(action)

    def close(self):
        if self.busy:
            messagebox.showinfo('Marco PDF', 'Espera a que termine el procesamiento antes de cerrar.')
            return
        if self.doc:
            self.doc.close()
        self.destroy()


if __name__ == '__main__':
    import sys
    if len(sys.argv) == 3 and sys.argv[1] == '--self-test':
        from portable_check import run
        sys.exit(run(sys.argv[2], MarcoPDF))
    MarcoPDF().mainloop()
