# Extracting pages from a PDF

In many document creation scenarios, it is necessary to extract some pages from a PDF.  For example, one may want to merge a PDF with a few pages from another PDF.

USAGE:

```
Usage: pdf-document-maker extract [options] <inputFN> <outputFN> <pages...>

Extract page numbers from input PDF to output. The pages are numbered from 0.

Arguments:
  inputFN                 PDF file name to extract from
  outputFN                PDF file name that receives the extracted images
  pages                   Page numbers to extract, in the order of extraction

Options:
  --page-format <format>  Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"
  -h, --help              display help for command

```

The pages will be extracted from the PDF named in `inputFN`.

The pages will be extracted into the file named in `outputFN`.

You then put on the command-line the page numbers to extract.  These are numbered from zero, meaning the first page of the document is number 0.

Example:

```shell
$ npx pdf-document-maker.mjs extract \
    ../../guide/PDF/guide.pdf \
    extracted.pdf \
    0 2 4 6 8
```
