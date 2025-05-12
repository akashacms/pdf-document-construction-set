# Show, edit, and copy PDF metadata

PDF files can carry metadata - data that describes the document but is not shown as part of the document.

Many document creators need to set metadata in their PDF files.

## Viewing metadata and other information

```
Usage: pdf-document-maker info [options] <inputFN>

Show information about the PDF

Options:
  -h, --help  display help for command
```

Example:

```shell
$ npx pdf-document-maker info guide/PDF/guide.pdf 
PDF Information for guide/PDF/guide.pdf
MIME: application/pdf
loadPDFfromFile guide/PDF/guide.pdf
Title: PDF Document Maker Guide
Subject: undefined
Author: undefined
Keywords: undefined
Producer: pdf-lib (https://github.com/Hopding/pdf-lib)
Creator: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36
Producer: pdf-lib (https://github.com/Hopding/pdf-lib)
CreationDate: Sun Feb 02 2025 18:58:34 GMT+0200 (Eastern European Standard Time)
ModDate: Sun May 11 2025 23:48:11 GMT+0300 (Eastern European Summer Time)
PageCount: 35
```

## Editing metadata values

```
Usage: pdf-document-maker set-metadata [options] <pdfFN> [saveToFN]

Set metadata values in a PDF

Arguments:
  pdfFN                       File name for PDF file
  saveToFN                    File name to which to save modified PDF file

Options:
  --title <title>             Document title
  --subject <subject>         Subject
  --author <author>           Author string
  --keyword <keyword...>      One keyword, may be used multiple times for multiple keywords
  --producer <producer>       Producor
  --creator <creator>         Creator
  --creation-date <date>      Date the document was created
  --modification-date <date>  Date the document was modified
  -h, --help                  display help for command
```

Example:

```shell
$ npx pdf-document-maker set-metadata guide/PDF/guide.pdf setmd.pdf \
    --subject 'New Subject' \
    --author 'Grace Hopper' \
    --keyword PDF --keyword AkashaCMS \
    --producer 'David Herron' \
    --creator 'God' \
    --creation-date 2024-01-01T00:00:00 \
    --modification-date 2025-05-11T23:42:00
```

## Copying metadata from one PDF to another

```
Usage: pdf-document-maker copy-metadata [options] <inputFN> <donorFN> [outputFN]

Copy metadata values from one PDF to another

Arguments:
  inputFN     File name for PDF file which is to recieve metadata
  donorFN     File name for PDF file from which to copy metadata
  outputFN    File name for PDF file to save with modified metadata

Options:
  -h, --help  display help for command
```

Example:

```shell
$ npx pdf-document-maker copy-metadata guide/PDF/guide.pdf setmd.pdf copied.pdf
loadPDFfromFile guide/PDF/guide.pdf
loadPDFfromFile setmd.pdf
savePDFtoFile copied.pdf
```