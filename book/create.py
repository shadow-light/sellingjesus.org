
import subprocess
from pathlib import Path

from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


def create():
    # Define paths
    file_html = 'shared/dist/book.html'
    file_css = 'shared/dist/book.css'

    # Render HTML to PDF
    font_config = FontConfiguration()
    weasy_html = HTML(filename=file_html)
    weasy_css = CSS(filename=file_css, font_config=font_config)
    weasy_doc = weasy_html.render(stylesheets=[weasy_css], font_config=font_config)
    weasy_doc.write_pdf('shared/book.pdf')

    # Also build epub
    subprocess.run(
        ['pandoc', 'book.html', '-o', '../book.epub', '--css', 'book.css', '--toc'],
        cwd='shared/dist',
        check=True,
    )


create()
