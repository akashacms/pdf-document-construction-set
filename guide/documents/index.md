---
layout: home-page.njk
title: PDF Document Maker
publicationDate: January 6, 2025
---

_PDF Document Maker_ is a comprehensive tool for producing good quality PDFs from Markdown or AsciiDoc files.

We normally produce PDF documents with word-processing applications like Libre Office.  But, such files are difficult to version in a source code repository like Git.  Markdown or AsciiDoc files are simple text with markup instructions, which are easy to track in a source repository like Git, but the results are very plain compared to what we can produce with a word-processor.

With PDF Document Maker, we can use a variety of templates to customize the output, apply CSS stylesheets, use tools like PlantUML, Mermaid, or KaTeX to insert diagrams or mathematics, and do custom HTML processing to further customize the output.  The latter allows us to create custom HTML tags which are converted into regular HTML, including the possibility of inserting data from external sources into the documents.

These features brings us close to the fidelity of what can be produced from a word-processor application, while having the openness of Markdown or AsciiDoc files.

This website includes

* Full documentation on using _PDF Document Maker_
* A demonstration of generating a full PDF file from Markdown and AsciiDoc files
* A demonstration of presenting that same content on the website
* A blog section for project announcements

In short, the website demonstrates some features required by typical open source software development projects for their public documentation website.

This website is hosted on GitHub Pages, because that's a free service offered by GitHub.  But, since the output is a simple HTML+CSS+JavaScript directory tree, the website could be hosted by any web hosting provider.