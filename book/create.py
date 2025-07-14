
import subprocess

from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


def create_pdf():
    font_config = FontConfiguration()
    weasy_html = HTML(filename='shared/dist_pdf/book.html')
    weasy_css = CSS(filename='shared/dist_pdf/book.css', font_config=font_config)
    weasy_doc = weasy_html.render(stylesheets=[weasy_css], font_config=font_config)
    weasy_doc.write_pdf('shared/book.pdf')


def create_epub():
    subprocess.run(
        ['pandoc', 'book.html', '-o', '../book.epub', '--toc'],
        cwd='shared/dist_epub',
        check=True,
    )


create_epub()
create_pdf()
