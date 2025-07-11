# Creating a PDF document from multiple individual Markdown files

For a large document it is unweildy to put the entire content in one Markdown file.  This is true irregardless of the document format.  It is simply unweildy to construct a large document in one file.  Instead, it is desirable when creating a large document to split it into multiple individual files.

It's typical to divide a large document into chapters and appendices.  Each should be its own file.

With PDF Document Maker you might run a command:

```shell
$ npx pdf-document-maker chap1.md chap2.md chap3.md chap4.md --pdf-output PDF
```

There are other options to add for a complete book project, but this demonstrates the issue.  Given the design of PDF Document Maker, this results in generating the files `PDF/chap1.pdf`, `PDF/chap2.pdf`, `PDF/chap3.pdf`, and `PDF/chap4.pdf`.

It's desirable to combine the chapters into one PDF file.  It was studied whether to add an option to the command-line to do so, but a different workflow was chosen.

```shell
$ npx pdf-document-maker chap1.md chap2.md chap3.md chap4.md --pdf-output PDF
$ npx pdf-document-maker merge \
        PDF/chap1.md PDF/chap2.md PDF/chap3.md PDF/chap4.md \
        --output book.pdf
```

This two-step process first renders the chapters as individual files, then merges the chapters into one PDF.

This workflow happens to match my experience with two different book publishers.  In both cases each chapter was a separate document, and separate PDF files were generated as intermediate assets of the book editing process.

