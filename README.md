# PDF Document Maker - Tooling to generate high fidelity PDF documents from Markdown or AsciiDoc

Generating a PDF of a Markdown or AsciiDoc document is not straightforward. With a WYSIWYG editor like LibreOffice we can just _print to pdf_.  But, because Markdown or AsciiDoc doesn't inherently contain rich formatting styles, a simple _print to pdf_ is very plain looking.

_PDF Document Maker_ allows creating richly formatted documents into PDF.  The features include:

* Supporting A3, A4, A5, Legal, Letter or Tabloid page formats
* Customizable header and footer on each page
* CSS stylesheets
* Layout and Partial templates for custom formatting, using template engines like Nunjucks, Mustache, or EJS
* Using PlantUML or Mermaid to support drawings
* Using KaTeX to support equations
* ??? Music
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
  --config <configFN>               AkashaCMS configuration file. If specified it disables auto-generated config file.
  --format <format>                 Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"
  --pdf-output <pdfDir>             Output directory for PDF generation. Default process.cwd()/PDF
  --html-output <htmlDir>           Output directory for HTML generation
  --template-header <tmplHeader     HTML template for page header
  --height-header <height>          Height of header block. Valid units are mm, cm, in and px.
  --template-footer <tmplFooter     HTML template for page footer
  --height-footer <height>          Height of footer block. Valid units are mm, cm, in and px.
  --style <cssFile>                 File name of CSS style sheet
  --layout-dir <layoutDir...>       One or more directories for layout templates
  --partial-dir <partialDir...>     One or more directories for partial templates
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
  --no-md-header-sections           Disable the markdown-it-header-sections extension
  --no-md-highlightjs               Disable the markdown-it-highlightjs extension
  --no-md-image-figures             Disable the markdown-it-image-figures extension
  --no-md-multimd-table             Disable the markdown-it-multimd-table extension
  --no-md-table-captions            Disable the markdown-it-table-captions extension
  --no-md-plantuml                  Disable the markdown-it-plantuml extension
  --funcs <funcsFN>                 Name a JS file containing Mahafuncs for custom processing
  -h, --help                        display help for command
```

