
from weasyprint import HTML, CSS


def create():

    # Render HTML to PDF
    weasy_html = HTML(filename='shared/book.html')
    weasy_css = CSS(filename='shared/book.css')
    weasy_doc = weasy_html.render(stylesheets=[weasy_css])
    num_pages = len(weasy_doc.pages)
    weasy_doc.write_pdf('shared/book.pdf')


create()
