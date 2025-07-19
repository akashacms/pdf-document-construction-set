---
layout: blog.njk
title: "Heading towards v1.1, vision of serving serious document creators"
publicationDate: July 20, 2025
blogtag: news
---

As I've worked on PDF Document Maker the vision of this application's purpose is growing clearer.  The target audience is those who create high quality documents in PDF format, and who want their source content in Markdown or AsciiDoc format.

As an example, in my day job I am part of the tech team of a communications protocol used in the renewable electricity industry that helps with energy efficiency and management of distributed energy resources.  The Foundation behind this protocol is moving towards possibly embracing an open source model.  One aspect of this is that the official version of the specification is in Markdown format, along with OpenAPI and JSON Schema files.  The Foundation needs to produce a high quality PDF version of the specification for distribution on its website, and they had previously used DOCX and Microsoft Word for this task.

Using PDF Document Maker, I was able to easily set up a project structure for rendering PDF from the Markdown documents.  The result replicated the fidelity the previous PDF documents, while the Markdown files stayed within the feature set of GitHub Flavored Markdown.

How many open source project teams have Markdown documentation, and would appreciate being able to produce good quality PDFs?

These tasks have been accomplished over the last few months:

* [Set PDF Document Metadata](https://github.com/akashacms/pdf-document-construction-set/issues/48) - Several data items, such as the document creator, can be set inside the PDF.  Document creators can also [copy metadata from one PDF to another](https://github.com/akashacms/pdf-document-construction-set/issues/49).
* A [PDF Merge Tool](https://github.com/akashacms/pdf-document-construction-set/issues/50) allows a document creator to attach multiple PDF documents, or PNG/JPEG images, together into a master document.  In some projects, the output document gathers multiple individual documents, simply attaching them together.  For example, I've read government regulatory documents with a cover document, and subsequent documents providing additional details.
* The ability to [change the document orientation between landscape and portrait](https://github.com/akashacms/pdf-document-construction-set/issues/53).  Another command supports changing the page size such as US-Letter to A4.  All known page size codes are supported.
* [Splitting a PDF into multiple images](https://github.com/akashacms/pdf-document-construction-set/issues/62).
* [Add the Pintora diagram engine](https://github.com/akashacms/plugins-diagrams/issues/9) to support more options for diagrams.
* [Support GitHub's format for adding Mermaid diagrams](https://github.com/akashacms/plugins-diagrams/issues/7).  This will be extended to support both PlantUML and Pintora diagrams in the same way.

These were all implemented with the professional PDF document creator in mind.

Additional features that are being considered include:

* [Compressing PDF files](https://github.com/akashacms/pdf-document-construction-set/issues/45)
* [Adding more PDF manipulation commands, as appropriate](https://github.com/akashacms/pdf-document-construction-set/issues/47).  For inspiration, I'm looking at tools like Stirling PDF.
* [Reformatting a PDF into N-Up format](https://github.com/akashacms/pdf-document-construction-set/issues/57).
* [Support splitting large images into a PDF of normal size pages, where the image is tiled across the document pages](https://github.com/akashacms/pdf-document-construction-set/issues/61).  The idea here is to support those times where you have a regular printer, and want to create a large banner by taping together individual pages.
* [Watermarking a document with DRAFT or other words](https://github.com/akashacms/pdf-document-construction-set/issues/81).

Together these features would make a powerhouse application supporting a broader scope than originally envisioned.  The original idea was simply supporting document creation.  PDF Document Maker is now supporting PDF manipulation alongside document creation.

When these features are well enough developed, I'll declare "version 1.1".  At that point the task will become reaching out to inform people about its existence.
