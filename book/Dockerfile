
FROM python:3.11-slim


# Install build-weasy deps, weasy deps, and calibre for ebook-convert
RUN apt-get update && apt-get install -y \
    build-essential cmake libtool autoconf automake libelf-dev git \
    libpango-1.0-0 libpangoft2-1.0-0 libharfbuzz-subset0 libjpeg-dev libopenjp2-7-dev libffi-dev \
    calibre

# Install weasyprint (need at least v66)
RUN python3 -m pip install --target /home/app/ "git+https://github.com/Kozea/WeasyPrint.git@main"

# Copy in the actual function
RUN mkdir -p /home/app/
COPY create.py /home/app/

# Execution settings
WORKDIR /home/app/
CMD ["/usr/local/bin/python", "create.py"]
