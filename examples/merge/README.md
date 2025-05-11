# Demonstrate merging PDF and Image files

This directory demonstrates using PDF Document Maker to merge multiple PDF and Image files into one PDF.

In many document creation scenarios, one is assembling a PDF document from multiple input files.

For example we might need to submit or distribute a single PDF file consisting of a cover letter and multiple supporting documents.  These might be PDF or Image files.  The goal in this case is to create a single PDF file containing every required input file.

USAGE:

```
$ npx pdf-document-maker.mjs merge --help
Usage: pdf-document-maker merge [options] <files...>

Merge multiple PDF, PNG, JPG, into one document

Options:
  --output <outputFN>  File name for merged document
  -h, --help           display help for command
```

The input files are listed on the command-line, and anything other than PDF, PNG, or JPEG files are ignored.  The output file is specified with the `--output` flag.

Example of attaching a screenshot to the user guide document:

```shell
$ npx pdf-document-maker --output merged.pdf \
     ../../guide/PDF/guide.pdf \
     ./Screenshot-merge-example.png
Reading input PDF ../../guide/PDF/guide.pdf application/pdf
Reading input IMAGE ./Screenshot-merge-example.png image/png
Write File merged.pdf
```
