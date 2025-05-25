# Reformatting a PDF from one page format to another

What if you've created a PDF in A4 format and must distribute the file to North America where the common page size is Letter?  More generally, you may need to repurpose a file on a different page size.

The `reformat` command does this.  Further, the `extract` and `merge` commands use the same option, `page-format` and can serve the same purpose.

```
Usage: pdf-document-maker reformat [options] <inputFN> [outputFN]

Change the document format (e.g. A4) to a new one (e.g. Letter

Arguments:
  inputFN                 PDF file name of source document
  outputFN                PDF file name of resized document. If not given, inputFN will be replaced

Options:
  --page-format <format>  Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"
  --rotate [rotation]     Rotate by 90, 180, or 270 degrees
  -h, --help              display help for command
```

The `reformat` command takes input and output file names.  If the latter is not given, then the reformatted file will be written to the input file.

The output content is the same as the input content, but with the pages resized to match the format name, and the content scaled to match.  If the `--rotate` option is specified, the pages are rotated by the number of degrees.

The same behavior applies to the `extract` and `merge` commands.

```shell
$ npx pdf-document-maker reformat input.pdf reformatted.pdf \
    --page-format A1 --rotate 90
```

This takes the file, `input.pdf`, scales the pages to the `A1` size, rotating the pages 90 degrees, then outputting to `reformatted.pdf`.

To see the list of supported page formats, run:

```shell
$ npx pdf-document-maker page-sizes
4A0: [ 4767.87, 6740.79 ]
2A0: [ 3370.39, 4767.87 ]
A0: [ 2383.94, 3370.39 ]
A1: [ 1683.78, 2383.94 ]
A2: [ 1190.55, 1683.78 ]
A3: [ 841.89, 1190.55 ]
A4: [ 595.28, 841.89 ]
A5: [ 419.53, 595.28 ]
A6: [ 297.64, 419.53 ]
A7: [ 209.76, 297.64 ]
A8: [ 147.4, 209.76 ]
A9: [ 104.88, 147.4 ]
A10: [ 73.7, 104.88 ]
B0: [ 2834.65, 4008.19 ]
B1: [ 2004.09, 2834.65 ]
B2: [ 1417.32, 2004.09 ]
B3: [ 1000.63, 1417.32 ]
B4: [ 708.66, 1000.63 ]
B5: [ 498.9, 708.66 ]
B6: [ 354.33, 498.9 ]
B7: [ 249.45, 354.33 ]
B8: [ 175.75, 249.45 ]
B9: [ 124.72, 175.75 ]
B10: [ 87.87, 124.72 ]
C0: [ 2599.37, 3676.54 ]
C1: [ 1836.85, 2599.37 ]
C2: [ 1298.27, 1836.85 ]
C3: [ 918.43, 1298.27 ]
C4: [ 649.13, 918.43 ]
C5: [ 459.21, 649.13 ]
C6: [ 323.15, 459.21 ]
C7: [ 229.61, 323.15 ]
C8: [ 161.57, 229.61 ]
C9: [ 113.39, 161.57 ]
C10: [ 79.37, 113.39 ]
RA0: [ 2437.8, 3458.27 ]
RA1: [ 1729.13, 2437.8 ]
RA2: [ 1218.9, 1729.13 ]
RA3: [ 864.57, 1218.9 ]
RA4: [ 609.45, 864.57 ]
SRA0: [ 2551.18, 3628.35 ]
SRA1: [ 1814.17, 2551.18 ]
SRA2: [ 1275.59, 1814.17 ]
SRA3: [ 907.09, 1275.59 ]
SRA4: [ 637.8, 907.09 ]
Executive: [ 521.86, 756 ]
Folio: [ 612, 936 ]
Legal: [ 612, 1008 ]
Letter: [ 612, 792 ]
Tabloid: [ 792, 1224 ]
```