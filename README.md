
<figure class="ml-auto mr-auto">
<img src="https://raw.githubusercontent.com/akashacms/pdf-document-construction-set/refs/heads/main/guide/assets/logo-pdf-document-maker.png" class="ml-auto mr-auto" alt="PDF Document Maker"/>
</figure>

# PDF Document Maker - Tooling to generate high fidelity PDF documents from Markdown or AsciiDoc

_PDF Document Maker_ supports creating richly formatted documents, in both HTML and PDF format, using file types (Markdown, CSS, etc) which are easily tracked in a source code repository, and which are easily edited with IDEs like Visual Studio Code.

There are many tools for creating richly formatted documents, such as WYSIWYG word processors like Libre Office.  But, they're not easily tracked in Git or other source code repositories.  Many kinds of technical projects require the ability to track all assets, including documentation, in a source repository, but also need to produce good looking documentation.

While Markdown is a flexible markup format, it produces plain looking output.  Generating a PDF with fidelity close to what we'd get from a WYSIWYG word processor like Libre Office requires significant ability to customize the Markdown-HTML conversion result.  PDF Document Maker gives you a head start on that, and also helps to precisely customize the HTML and CSS any way you like.

The features include:

* Supporting A3, A4, A5, Legal, Letter or Tabloid page formats
* Customizable header and footer on each page
* CSS stylesheets
* Layout and Partial templates for custom formatting, using template engines like Nunjucks, Mustache, or EJS
* Using PlantUML or Mermaid to support drawings
* Using KaTeX to support equations
* Using HighlightJS for styling code blocks
* Custom HTML elements to bring in external data sources
* Custom HTML/DOM processing
* Intermediate HTML output
* Using either/both Markdown and AsciiDoc
* Generating figure/img/caption structures for images
* Generating caption tag for tables
* Optional support for MultiMarkdown tables

# Project setup and Installation

PDF Document Maker runs on the Node.js platform, and is tested with Node.js v20.  It should work for later releases.

Full documentation is available at: https://akashacms.github.io/pdf-document-construction-set/

The website includes a comprehensive usage guide that's available both in PDF (built using this tool) and online.  The website also demonstrates the possibility of the SAME content document being used both on a website and in a PDF.

A project directory consists of a _package.json_ file which is used for listing dependencies and build processes.

```shell
$ npm init -y   # Set up the package.json
$ npm install pdf-document-maker --save
```

Once installed you can get help:

```shell
$ npx pdf-document-maker --help

Usage: pdf-document-maker [options] <docPaths...>

CLI to build PDF files from Markdown/AkashaCMS documents

Arguments:
  docPaths                          VPaths for documents to render

Options:
  -v, --version                     output the current version
  --config <configFN>               AkashaCMS configuration file. If specified
                                    it disables auto-generated config file.
  --title <title>                   Document title, overwriting any title in
                                    the document metadata.
  --layout <layoutTemplate>         File name, in a layouts directory, for the
                                    layout template. Overwrites any layout in
                                    the document metadata.
  --format <format>                 Page format, "A3", "A4", "A5", "Legal",
                                    "Letter" or "Tabloid"
  --pdf-output <pdfDir>             Output directory for PDF generation.
                                    Default process.cwd()/PDF
  --html-output <htmlDir>           Output directory for HTML generation
  --template-header <tmplHeader     HTML template for page header
  --height-header <height>          Height of header block. Valid units are
                                    mm, cm, in and px.
  --template-footer <tmplFooter     HTML template for page footer
  --height-footer <height>          Height of footer block. Valid units are
                                    mm, cm, in and px.
  --style <cssFile>                 File name of CSS style sheet
  --layout-dir <layoutDir...>       One or more directories for layout
                                    templates
  --partial-dir <partialDir...>     One or more directories for partial
                                    templates
  --asset-dir <assetsDir...>        One or more directories for assets
  --document-dir <documentsDir...>  One or more directories for documents
  --plantuml-url                    URL for a PlantUML server
  --no-headless                     Turn off headless mode
  --no-pdf                          Do not generate PDFs
  --no-printcss                     Disable the print.css stylesheet
  --no-md-anchor                    Disable the markdown-it-anchor extension
  --no-md-footnote                  Disable the markdown-it-footnote extension
  --no-md-attrs                     Disable the markdown-it-attrs extension
  --no-md-div                       Disable the markdown-it-div extension
  --no-md-header-sections           Disable the markdown-it-header-sections
                                    extension
  --no-md-highlightjs               Disable the markdown-it-highlightjs
                                    extension
  --no-md-image-figures             Disable the markdown-it-image-figures
                                    extension
  --no-md-multimd-table             Disable the markdown-it-multimd-table
                                    extension
  --no-md-table-captions            Disable the markdown-it-table-captions
                                    extension
  --no-md-plantuml                  Disable the markdown-it-plantuml extension
  --funcs <funcsFN>                 Name a JS file containing Mahafuncs for
                                    custom processing
  -h, --help                        display help for command

```

While that's a lot of options there are reasonable defaults for most.

# Example usage

For example, with a project directory initialized, create a directory named `documents` and put in it a Markdown file.  The search phrase "_standard markdown test file_" will turn up several such as this: https://github.com/mxstbr/markdown-test-file

With a file, `documents/TEST.md`, run this command:

```shell
$ npx pdf-document-maker  \
        --document-dir documents \
        --pdf-output PDF \
        --html-output out \
        --title 'Markdown test document' \
        --format A4 \
        TEST.md
```

This command creates two files:

* `out/TEST.html` - is the HTML intermediate file
* `PDF/TEST.pdf` - is the PDF result

The directory _documents_ is a place the tool looks for documents.  There can be more than one documents directory.

The file name `TEST.md` is relative to the root directory of the documents directories.  In the help text you will see `VPath` used at least once.  The name `TEST.md` is an example of a Virtual Path (a.k.a. VPath) because it is the virtual path within the directory/directories named via the `--document-dir` option.

If more than one directory is named with `--document-dir` then the directories are "stacked" with the later directories higher in the stack.  When a VPath is requested, the stacked directories are searched in order to find the actual file to use.

The directories named with `--partial-dir`, `--asset-dir`, and `--layout-dir`, are treated the same way.  There can be multiple such directories, they are organized in a stack, and are searched from the top of the stack.

