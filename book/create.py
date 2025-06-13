
from weasyprint import HTML


def create():

    # Render HTML to PDF
    weasy_html = HTML(filename='shared/book.html')
    weasy_doc = weasy_html.render()
    num_pages = len(weasy_doc.pages)
    weasy_doc.write_pdf('shared/book.pdf')


create()
