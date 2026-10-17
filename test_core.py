import unittest
import pymupdf as pdf
from core import pages_from_spec, split_pages, split_megabytes, ocr_document


class PDFTests(unittest.TestCase):
    def setUp(self):
        self.doc = pdf.open()
        for i in range(5):
            self.doc.new_page().insert_text((40, 60), f'Marco PDF pagina {i+1}')

    def tearDown(self):
        self.doc.close()

    def test_ranges(self):
        self.assertEqual(pages_from_spec('1-3,5,2', 5), [0, 1, 2, 4])
        for invalid in ['0', '6', '3-1', 'x', '1,', '1-2-3']:
            with self.assertRaises(ValueError):
                pages_from_spec(invalid, 5)

    def test_page_split_preserves_order(self):
        parts = split_pages(self.doc, list(range(5)), 2)
        self.assertEqual(len(parts), 3)
        extracted = []
        for data in parts:
            with pdf.open('pdf', data) as doc:
                extracted.extend(p.get_text().strip() for p in doc)
        self.assertEqual(extracted, [f'Marco PDF pagina {i+1}' for i in range(5)])

    def test_actual_size(self):
        parts = split_megabytes(self.doc, list(range(5)), .0015)
        self.assertGreater(len(parts), 1)
        self.assertTrue(all(len(part) <= 1500 for part in parts))
        with self.assertRaisesRegex(ValueError, 'página 1'):
            split_megabytes(self.doc, [0], .0001)
        for bad in [0, -1, float('nan'), float('inf')]:
            with self.assertRaises(ValueError):
                split_megabytes(self.doc, [0], bad)

    def test_ocr_scanned_page(self):
        with pdf.open() as scan:
            pix = self.doc[0].get_pixmap(dpi=200)
            page = scan.new_page(width=595, height=842)
            page.insert_image(page.rect, pixmap=pix)
            self.assertFalse(page.get_text().strip())
            data = ocr_document(scan, [0], 'spa+eng')
        with pdf.open('pdf', data) as recognized:
            self.assertIn('Marco', recognized[0].get_text())

    def test_ocr_keeps_existing_text(self):
        with pdf.open('pdf', ocr_document(self.doc, [0, 2], 'spa')) as result:
            self.assertEqual(len(result), 2)
            self.assertIn('pagina 3', result[1].get_text())


if __name__ == '__main__':
    unittest.main()
