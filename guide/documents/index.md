---
layout: home-page.njk
title: PDF Document Maker
publicationDate: January 6, 2025
---

::: .jumbotron #main-page-hero
_PDF Document Maker_ is a comprehensive tool for producing good quality documentation, in PDF format, from Markdown or AsciiDoc files.

Easily edited Markdown or AsciiDoc files, combined with a curated set of Markdown extensions, diagramming tools like PlantUML or Mermaid, and CSS style-sheets, allow one to generate top-quality PDF documents.
:::


::: .card-group

::: .card
::: .card-body
#### Why Markdown/AsciiDoc versus Libre Office or other word processor? {.card-title}

Libre Office and other word processor applications are the traditional way to produce PDF documents.  They tend to do an excellent job, especially when one learns the art of template wizardry. {.card-text}

Both Markdown and AsciiDoc use simple text files, along with markup for various effects.  The markup available in both is limited, but cover a large portion of what is needed to produce documents. {.card-text}

As simple text files, Markdown and AsciiDoc are both easy to store in Git, or other systems, alongside our code. {.card-text}

The 80% rule has made Markdown a popular choice for technical projects using programmers text editors, like Visual Studio Code, and source code control systems like Git. {.card-text}
:::
:::


::: .card
::: .card-body
#### Bridging the gap from easy-to-edit to great-PDF-production {.card-title}

PDF Document Maker makes it possible to transition from an 80% solution to a 95% (or more) solution. {.card-text}

* A curated set of Markdown extensions increase what we can do while staying in the easy-to-edit paradigm. {.card-text}
* Excellent diagramming support using PlantUML or Mermaid integrates nicely. {.card-text}
* CSS lets us create top-notch customized visual effects just by adding class or ID specifiers. {.card-text}
* The Mahabhuta server-side DOM processing engine lets us create custom HTML tags or custom DOM manipulation. This creates an endless realm of possibilities. {.card-text}
* Custom templates let us tailor the presentation however we desire. {.card-text}

For example, with the above it is easy to extract information from an external data source like OpenAPI specifications or JSON schemas.  That data can be formatted using templates and CSS into tables describing API endpoints, data types, and more. {.card-text}
:::
:::

::: .card
::: .card-body
#### Easily reuse documentation between a PDF, and online {.card-title}

PDF Document Maker is based on AkashaCMS, a static website content management system.  The content files used in a PDF Document Maker project can easily be used in an AkashaCMS website project. {.card-text}

For example, the [PDF Document Maker guide](./guide/guide.html) (online version) is also available in [PDF](./guide/guide.pdf). {.card-text}
:::
:::

:::


::: .card
::: .card-body

## Features {.card-title}

<ul class="list-group list-group-flush">
<li class="list-group-item">Markdown or AsciiDoc documents - ease of editing, ease of version tracking</li>
<li class="list-group-item">Many Markdown extensions</li>
<li class="list-group-item">Integrated support for draw<i>.</i>io, PlantUML, or Mermaid diagramming</li>
<li class="list-group-item">Flexible formatting using any of several template engines, for both page layout and partials</li>
<li class="list-group-item">CSS for print devices</li>
<li class="list-group-item">Syntax highlighting in code blocks for many programming languages (HighlightJS)</li>
<li class="list-group-item">Custom DOM processing and custom HTML elements offering many capabilities, including importing data (e.g. JSON Schema or OpenAPI definitions) for display in the document</li>
<li class="list-group-item">Reuse of the same content between website and PDF (this website is an example)</li>
<li class="list-group-item">Lightweight enough to build even large complex documents or websites on your laptop -- e.g. building a site with 2200 pages takes 10 minutes on a 2016-era laptop</li>
</ul>

:::
:::