
from pathlib import Path

from weasyprint import HTML, CSS, default_url_fetcher
from weasyprint.text.fonts import FontConfiguration


def modified_url_fetcher(url):
    if (url.startswith('file://') and url.endswith('.css')):
        raise ValueError("Block access to site CSS")  # Still allows remote font CSS
    if (url.startswith('file://')):
        url = url.replace('file://', 'file://' + str(Path(__file__).parent / 'shared/dist'))
    print(url)  # Helpful to know what is being fetched for debugging
    return default_url_fetcher(url)


def create():
    # Render HTML to PDF
    font_config = FontConfiguration()
    weasy_html = HTML(filename='shared/dist/book/index.html', url_fetcher=modified_url_fetcher)
    weasy_css = CSS(filename='shared/book.css', url_fetcher=modified_url_fetcher, font_config=font_config)
    weasy_doc = weasy_html.render(stylesheets=[weasy_css], font_config=font_config)
    num_pages = len(weasy_doc.pages)
    weasy_doc.write_pdf('shared/book.pdf')


create()
