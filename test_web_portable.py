import unittest
import urllib.request
import urllib.error
from web_portable import start_server


class LocalWebTests(unittest.TestCase):
    def test_local_assets_and_readonly_server(self):
        from pathlib import Path
        if not Path('web/dist/index.html').exists():
            self.skipTest('Build web/dist first')
        server, url = start_server()
        try:
            self.assertEqual(server.server_address[0], '127.0.0.1')
            for asset in ('', 'ocr/spa.traineddata.gz', 'ocr/eng.traineddata.gz', 'ocr/fra.traineddata.gz'):
                with urllib.request.urlopen(url + asset) as response:
                    self.assertEqual(response.status, 200)
                    self.assertTrue(response.read())
            with self.assertRaises(urllib.error.HTTPError) as error:
                urllib.request.urlopen(urllib.request.Request(url, data=b'no upload', method='POST'))
            self.assertEqual(error.exception.code, 501)
        finally:
            server.shutdown()
            server.server_close()
