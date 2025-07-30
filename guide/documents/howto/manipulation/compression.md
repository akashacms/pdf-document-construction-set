---
layout: article.njk
title: How to compress PDF files using open source tools
---

We might create a beautiful looking PDF file with sharp crisp graphics on every page, only to run into a size limitation.  For example, one time I needed to submit a PDF to a website through a web form that limited the size to 5 megabytes.

This goal of squeezing a PDF file runs the risk of ruining those crisp graphics.  Just as I had to compress the PDF to accomplish the task, you may also find yourself needing to compress your PDF creation.

_PDF Document Maker_ does not yet implement this feature.  However, there are plenty of other tools which do.

## Why compress PDF files?

Ideally PDF files are distributed with full fidelity and crisp graphics.  But, there are many scenarios where we must limit the size.

* Submission through e-mail or a web form where the size is limited
* Easing distribution through social networking
* Storage constraints on servers or devices
* Faster download times for end users
* Meeting platform-specific size requirements

## Tools for PDF Compression

This article covers several approaches to PDF compression using open source tools:

1. **Ghostscript** (gs) - https://www.ghostscript.com/ - The most powerful and flexible command-line tool for PDF manipulation and compression.
2. **LibreOffice** - https://www.libreoffice.org/ - GUI-based approach that can open PDFs and re-export with compression settings.
3. **compress-pdf** (Node.js) - https://www.npmjs.com/package/compress-pdf - A convenient wrapper around Ghostscript for automated compression.
4. **ImageMagick** - https://imagemagick.org/ - Primarily for image manipulation but capable of basic PDF compression.
5. **GraphicsMagick** - http://www.graphicsmagick.org/ - A fork of ImageMagick with similar PDF capabilities.
6. **PDFtk** - https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/ - PDF toolkit with basic compression features.
7. **qpdf** - https://qpdf.sourceforge.io/ - QPDF is a command-line tool and C++ library that performs content-preserving transformations on PDF files.

## Method 1: Ghostscript (Recommended)

Ghostscript is the most comprehensive solution for PDF compression. It offers fine-grained control over compression settings.

You must have first installed Ghostscript on your computer.  It is available through most or all open source software package management ecosystems.

### Basic Compression

```bash
# Light compression - good quality, moderate size reduction
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/prepress \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf

# Medium compression - balanced quality and size
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/printer \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf

# High compression - smaller size, lower quality
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf

# Maximum compression - smallest size, lowest quality
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen \
   -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
```

### Advanced Ghostscript Options

```bash
# Custom image compression settings
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/ebook \
   -dColorImageDownsampleType=/Bicubic \
   -dColorImageResolution=150 \
   -dGrayImageDownsampleType=/Bicubic \
   -dGrayImageResolution=150 \
   -dMonoImageDownsampleType=/Bicubic \
   -dMonoImageResolution=150 \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=compressed.pdf input.pdf

# Remove metadata and optimize structure
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/ebook \
   -dEmbedAllFonts=true \
   -dSubsetFonts=true \
   -dCompressFonts=true \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=optimized.pdf input.pdf
```

These command examples work by changing the resolution from the default 300dpi to either 150dpi or the resolutions shown in this list:

* `/screen` - 72 DPI images, maximum compression
* `/ebook` - 150 DPI images, good for e-readers
* `/printer` - 300 DPI images, good print quality
* `/prepress` - 300+ DPI images, high quality for printing

## Method 2: LibreOffice

LibreOffice can open PDF files and re-export them with different compression settings.

You must have first installed Libre Office on your computer.  It is available via the libreoffice.org website, or through most package management systems.

### GUI Method
1. Open LibreOffice Draw
2. File → Open → Select your PDF
3. File → Export as PDF
4. In the export dialog:
   - Set JPEG compression quality (lower = smaller file)
   - Enable "Reduce image resolution"
   - Set image DPI (72-150 for web, 300 for print)

### Command Line Method

```bash
# Convert PDF with compression using LibreOffice headless mode
libreoffice --headless --convert-to pdf:"writer_pdf_Export:{\
SelectPdfVersion:1,\
UseTaggedPDF:false,\
ExportFormFields:false,\
FormsType:0,\
ExportBookmarks:false,\
ExportNotes:false,\
Quality:50}" input.pdf
```

## Method 3: compress-pdf (Node.js)

A convenient wrapper around Ghostscript for automated compression.

To use this you must first install Node.js on your computer.  It is available through nodejs.org, or through most or all package management systems.

```bash
# Install as part of a project
# In a directory containing a package.json file
npm install compress-pdf --save-dev

# Install globally
npm install -g compress-pdf

# Basic usage
compress-pdf input.pdf output.pdf

# With quality settings (0-4, where 0 is highest compression)
compress-pdf -q 2 input.pdf output.pdf

# Batch compress all PDFs in a directory
for pdf in *.pdf; do
    compress-pdf "$pdf" "compressed_$pdf"
done
```

Normally, I recommend against global installation of a Node.js package.  A tool like _compress-pdf_ is a general purpose tool which might make a good candidate for global installation.  Installing it as part of a package/project directory records the dependency in the `package.json` so that in the future one can setup the package simply by running `npm install`.

## Method 4: ImageMagick

ImageMagick can handle basic PDF compression, though it's primarily designed for images.

ImageMagick must first be installed on your computer, and it is available through most or all package management systems.

```bash
# Basic compression
convert input.pdf -compress jpeg -quality 80 output.pdf

# Reduce DPI and compress
convert -density 150 input.pdf -compress jpeg -quality 60 output.pdf

# For multi-page PDFs, specify all pages
convert input.pdf[0-9] -compress jpeg -quality 70 output.pdf

# Monochrome compression for text-heavy documents
convert input.pdf -monochrome -compress group4 output.pdf
```

## Method 5: GraphicsMagick

Similar to ImageMagick but sometimes more efficient for batch operations.

GraphicsMagick must first be installed on your computer, and it is available through most or all package management systems.

```bash
# Basic compression
gm convert input.pdf -compress jpeg -quality 80 output.pdf

# Batch processing multiple files
gm batch -compress jpeg -quality 60 -output compressed_%f *.pdf

# Resize and compress
gm convert -density 150 input.pdf -resize 85% -compress jpeg -quality 70 output.pdf
```

## Method 6: PDFtk

PDFtk offers basic compression through optimization.  

The website offers a Windows GUI application, or their original command-line tool called PDFtk Server.  For the latter see https://www.pdflabs.com/tools/pdftk-server/

```bash
# Install pdftk
sudo apt-get install pdftk

# Basic optimization
pdftk input.pdf output output.pdf compress

# Uncompress for editing, then recompress
pdftk input.pdf output uncompressed.pdf uncompress
# Make edits...
pdftk uncompressed.pdf output final.pdf compress
```

## Method 7: qpdf

Modern PDF manipulation tool with good compression options.

* GitHub: https://github.com/qpdf/qpdf
* Documentation: https://qpdf.readthedocs.io/en/stable/

It must first be installed on your operating system.  It is available through most/all package management systems.

```bash
# Install qpdf
sudo apt-get install qpdf

# Basic compression
qpdf --optimize-images --compress-streams=y input.pdf output.pdf

# Object stream compression
qpdf --object-streams=generate input.pdf output.pdf

# Linearize for web (fast web view)
qpdf --linearize input.pdf output.pdf
```

## Tool Comparison

| Tool | Compression Quality | Speed | Ease of Use | Best For |
|------|-------------------|-------|-------------|----------|
| Ghostscript | Excellent | Fast | Moderate | All-purpose, fine control |
| LibreOffice | Good | Slow | Easy | GUI users, occasional use |
| compress-pdf | Good | Fast | Very Easy | Automation, simple tasks |
| ImageMagick | Fair | Fast | Moderate | Image-heavy PDFs |
| GraphicsMagick | Fair | Very Fast | Moderate | Batch processing |
| PDFtk | Basic | Fast | Easy | Simple optimization |
| qpdf | Good | Fast | Moderate | Modern workflows |

## Best Practices

1. **Always keep a backup** of your original PDF before compression
2. **Test different settings** - what works for one PDF may not work for another
3. **Consider your use case**:
   - Web display: 72-96 DPI, higher compression
   - E-readers: 150 DPI, medium compression  
   - Printing: 300 DPI, lower compression
4. **Check file size vs. quality** after compression
5. **For automation**, use Ghostscript or compress-pdf
6. **For GUI users**, LibreOffice is most accessible

## Troubleshooting

**Common Issues:**
- **Fonts look blurry**: Increase DPI or use `/printer` setting instead of `/ebook`
- **Images pixelated**: Reduce compression quality or increase resolution
- **File larger than original**: Try different compression settings or tools
- **Text becomes unselectable**: Avoid aggressive image conversion settings

**Checking Compression Results:**
```bash
# Compare file sizes
ls -lh original.pdf compressed.pdf

# Analyze PDF structure
qpdf --show-all-data original.pdf
gs -sDEVICE=inkcov -o - original.pdf
```

## Bash Script for Batch Compression

```bash
#!/bin/bash
# compress_pdfs.sh - Batch compress PDFs with Ghostscript

QUALITY="${1:-/ebook}"  # Default to ebook quality
INPUT_DIR="${2:-.}"     # Default to current directory
OUTPUT_DIR="${3:-compressed}"

mkdir -p "$OUTPUT_DIR"

for pdf in "$INPUT_DIR"/*.pdf; do
    if [[ -f "$pdf" ]]; then
        filename=$(basename "$pdf")
        echo "Compressing $filename..."
        gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
           -dPDFSETTINGS="$QUALITY" \
           -dNOPAUSE -dQUIET -dBATCH \
           -sOutputFile="$OUTPUT_DIR/$filename" \
           "$pdf"
        
        original_size=$(stat -f%z "$pdf" 2>/dev/null || stat -c%s "$pdf")
        compressed_size=$(stat -f%z "$OUTPUT_DIR/$filename" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$filename")
        reduction=$(( (original_size - compressed_size) * 100 / original_size ))
        
        echo "  Original: $(numfmt --to=iec $original_size)"
        echo "  Compressed: $(numfmt --to=iec $compressed_size)"
        echo "  Reduction: ${reduction}%"
        echo
    fi
done
```

Usage: `./compress_pdfs.sh /screen ./pdfs ./output`

This comprehensive guide covers the major open source tools for PDF compression, with practical command-line examples and best practices for different use cases.


## Conclusion

Whether a compression command be added to _PDF Document Maker__ seems to rely on integrating the QPDF library into Node.js.  There are a couple of existing projects for that purpose, but the status is unknown.

Compressing PDF files is easy with the correct tools.

* **LibreOffice** is the most approachable for casual users.
* **Ghostscript** and **qpdf** offer comprehensive capabilities, while requiring study to learn how to use each.

