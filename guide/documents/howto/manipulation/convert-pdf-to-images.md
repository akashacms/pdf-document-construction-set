---
layout: article.njk
title: Extracting the pages of a PDF as PNG images or SVG diagrams
---

In some cases we want a PNG or SVG representing one page of a PDF.  For example we might want to show thumbnail images of some pages, or there might be a page with significant content, or a document production process may require individual images for each page.

The task is we have a PDF file, and to produce PNG or SVG files of one or more pages of that PDF.  It's likely we want to supply a directory name, the tool will create that directory as needed, then extract the image files into that directory into files named `pageN.png` where `N` is the page number.

_PDF Document Maker_ does not yet implement this feature.  However, there are plenty of other tools which do.

Tools in Node.js:

* https://www.npmjs.com/package/pdf-extractor
* https://www.npmjs.com/package/pdf-to-image-generator
* https://www.npmjs.com/package/pdf-to-img
* https://www.npmjs.com/package/pdfsnap -- Requires Poppler
* https://www.npmjs.com/package/node-poppler -- Requires Poppler
* https://www.npmjs.com/package/node-pdftocairo -- Requires Poppler
* https://github.com/jjwilly16/node-pdftk/ -- Requires PDFtk
* https://www.npmjs.com/package/pdf2pic -- Requires Graphicsmagick or Ghostscript
* https://www.npmjs.com/package/@brakebein/pdf2png -- Requires Ghostscript

Since many of those Node.js packages are wrappers around other tools, we could just use those tools directly.

# Using Ghostscript to extract pages of a PDF as PNG images or SVG diagrams

Ghostscript is primarily an open source implementation of Postscript, and is widely used as a printer driver.  It also has top-notch PDF support.  The project is very mature, dating back to the 1990s or earlier.

It is available as source code, packages for many/all Linux distributions, macOS, and Windows.

The [official documentation](https://ghostscript.readthedocs.io/en/gs10.05.1/Install.html) describes what to do.  For Linux systems the project only supplies RPM or SNAP packages.  But, you should be able to find it in the official repo's for every Linux distro.

For example, on Ubuntu:

```shell
$ sudo apt-get install ghostscript
```

Basic Command

```shell
$ gs -dNOPAUSE -dBATCH -sDEVICE=png16m -r300 -sOutputFile=page_%03d.png input.pdf
```

The command breakdown:

* `gs` - Ghostscript command
* `-dNOPAUSE` - Don't pause between pages
* `-dBATCH` - Exit after processing (no interactive prompts)
* `-sDEVICE=png16m` - Output device (24-bit color PNG)
* `-r300` - Resolution in DPI (300 is high quality)
* `-sOutputFile=page_%03d.png` - Output filename pattern
* `input.pdf` - Your PDF file

This says to use the `png16m` output device at 300 DPI.  The output file names are generated as `page_001.png`, `page_002.png` and so on.

The available device names are:

* `png16m` - 24-bit color (most common)
* `pnggray` - Grayscale
* `png256` - 8-bit color with palette
* `png16` - 4-bit color

Other resolutions you might consider:

* `-r150` - Standard quality (smaller files)
* `-r300` - High quality (recommended for printing)
* `-r600` - Very high quality (large files)

To extract specific pages, insert these options:

* `-dFirstPage=5 -dLastPage=10 ` -- Extract pages 5-10
* `-dFirstPage=3 -dLastPage=3 -sOutputFile=page_3.png` -- Extract only page 3

If you run into font problems try:

* `-dSubstituteFont=true`

**Discussion**: This command produces a PNG file, which means that Ghostscript renders the pages to an image.  Since PDFs are a vector graphics format, this loses some capabilities but gains the simplicity of producing images.

## Using Ghostscript to extract pages of a PDF as SVG diagrams

Producing SVG diagrams using Ghostscript uses a similar command-line, but with a few tweaks.

The device name changes to:  `-sDEVICE=svg`.

The output file name should have a `.svg` file extension.

# Using pdf2svg to extract pages of a PDF as SVG diagrams

Pdf2svg is a purpose-built tool for SVG extraction from a PDF file.  See https://github.com/dawbarton/pdf2svg.  It uses the Poppler tools.

Usage:

```shell
# Convert all pages
pdf2svg input.pdf page_%03d.svg all

# Convert specific page
pdf2svg input.pdf page_5.svg 5
```

# Using GraphicsMagick to extract pages of a PDF as PNG images or SVG diagrams

GraphicsMagick (http://www.graphicsmagick.org/index.html) is billed as a "swiss army knife of image manipulation.  The project is widely used, and is very mature with over 20 years of history behind it.

Its PDF support comes by way of using Ghostscript.  You're probably better off using the Ghostscript commands in the previous sections.

For installation instructions, the project website discusses compilation from source.  How 1980s of them.  These commands should be available in every package management system for every distribution.  

For example, Ubuntu:

```shell
$ sudo apt-get install graphicsmagick
```

Command usage is `gm COMMAND .. options`, with complete documentation at http://www.graphicsmagick.org/utilities.html

There is a similar tool, ImageMagick, https://imagemagick.org/index.php, that serves a very similar purpose.  You may find it useful to install both.

For example this command is widely given for using GraphicsMagick to extract all pages of the PDF:

```shell
$ gm convert input.pdf output.png
```

But, this only extracts the first page.

But, this ImageMagick command does work:

```shell
$ convert input.pdf output.png
```

The output file names are `output-0.png`, `output-1.png`, and so forth.  It can export to JPEG by substituting `jpg` as the extension.

## Using GraphicsMagick or ImageMagick to extract pages of a PDF as SVG diagrams

To output as SVG simply use the `.svg` extension in the commands shown in the previous section.

However, this approach does not produce vector graphics.  Both PDF and SVG are vector graphics formats, giving them many advantages.

While GraphicsMagick does produce an SVG file, it contains a rasterized version of the image expressed as an SVG.  It means you cannot use CSS on the SVG to manipulate the graphics, nor can you edit the grphics with a regular text editor, and so forth.

Using `pdf2svg` and Ghostscript, both discussed earlier, are the recommended tools for extracting PDF pages as SVG.

# A few words about vector and raster graphics

Both PDF and SVG are vector graphics formats.  This means each are text files containing vector graphics commands - such as draw a line from A,B to C,D, and the like.  PDF is closely related to PostScript (PS) which is also a vector graphics format.

PNG, JPEG, and the like are raster graphics formats.  This means they are binary files that are essentially an array of pixels.  Each pixel has a color code, and the entire image is represented by setting the correct colors for each pixel.

The primary use for SVG is on web pages.  In that context the SVG structure becomes part of the DOM, and we can use CSS styles to manipulate the appearance of an SVG, or use JavaScript to manipulate its structure.

Usually the vector graphics files are smaller, and they can be edited using a regular text editor.

Whether you choose PNG or SVG depends on the needs of your project.
