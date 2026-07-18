---
layout: article.njk
title: How to scan a book, creating a Markdown document, from which you create a clean PDF document
---
You might have an old book, on paper, where you want a digital copy to read in an e-book Reader device, or to make a clean modernized copy of the book, or to import into an AI system.  In other words, you want to refurbish an older book, making it easier to read, producing an up-to-date version of the book, or reuse its information in an AI system.

Here's a few specific cases to consider:

- On the `archive.org` website, there are lots of out-of-copyright old books that deserve to be republished, cherished, and reused in modern ways.  The site generally contains, for each book, PNGs of the scan for each page, a PDF file generated from those scans, a text file constructed from the scans, and an EPUB generated from the text file.  
- It might be a business or research or government document generated decades previously, where modern people want to republish or reuse the document.  The book might be on paper, or it might be already scanned.
- It might be a book we own, is hard to get, but is still under copyright.  Being hard to get often means no electronic copy is available.

What follows are several processing stages and the tools for each stage.

# Project setup

Create a work directory:

```shell
mkdir -p ~/Projects/ebooks/my-new-book
cd ~/Projects/ebooks/my-new-book
```

As discussed below, create images of the pages in the book from which you will create a PDF, then a Markdown file.  You might create images using a scanner, a camera, or a smart phone.  Or you might be working with images from a book on `archive.org`.

Save those images in a directory in the project directory:

```shell
mkdir -p ~/Projects/ebooks/my-new-book/images-orig
# Copy the images to that directory
```

Make another directory in which you'll be cleaning up the images:

```shell
mkdir -p ~/Projects/ebooks/my-new-book/images-book
# Duplicate the images into this directory
```

Install PDF Document Maker

```shell
nvm use 24   # Make sure you're using Node.js 24.x or later
npm init -y
npm install @akashacms/pdf-document-maker --save
```

This sets up a project directory, with all dependencies required to run PDF Document Maker.
# Scanning images of the document pages

In the best case you have a scanner that can generate a series of PNG files or a PDF file with good fidelity.  In such a case, the PNGs will always be oriented in the same way, the content will be relatively flat and well lit, and the text will be clean.  If so, you're in luck.

If, instead, you have a camera, here are a few considerations:

Make sure your environment while taking pictures:

1. Is well lit - to ensure the camera uses a short exposure time 
2. Is evenly lit
3. You are not casting a shadow on the material being photographed
4. You carefully frame each page of the document so it fills the frame
5. You make sure all four corners are visible within the frame
6. You make sure the document is as flat as possible.
7. If necessary, you might have to flatten the document with your fingers or other object.  If so, ensure that object is at the edge of the frame, and does not obscure anything important.
8. If possible, set up the camera on a tripod, adjusting it to be flat and horizontal
9. If there is no tripod, hold the camera as horizontally as possible
10. Orient the material carefully in the frame
11. Hold the camera as still as possible
12. Calmly press the shutter button
13. Output the images in PNG (preferable, JPG if you must) mode, or PDF

Take one picture at a time.  If you're uncertain a particular page was correctly photographed, take a second shot.

# Cleaning up scanned images of the document pages

Depending on how the scanned images were made, there may be issues to resolve.

It's good to use an image editor like Gimp to inspect each image.  The goal is to have one image per page, in portrait orientation, with the page fully filling the picture frame.

1. If necessary rotate the image
	1. GIMP: Image -> Transform -> Rotate
2. Crop the image  so all four corners are as near as possible to the corner of the frame
	1. GIMP: Keep the crop tool enabled. Select the smallest rectangle that includes all four corners of the page.  Click on that to crop the content.  Then, File -> Overwrite
3. If multiple pictures were taken of a page, select the best one
4. Make sure every page is accounted for
5. Make sure every file name is constructed so the file system automatically sorts the files into the correct order -- for example, use a serial number, or a date string in the form `yyyy-mm-dd-hh-mm-ss`

# Conversion of images to PDF

Document how to use PDF Document Maker to generate a PDF from the images

Name some alternate tools

# Conversion of the PDF to Markdown

Docling is an excellent tool for converting PDF to many forms, including Markdown

Review the Markdown comparing to the PDF.  If anything was not converted correctly, fix it up.

# Generating a new PDF from the Markdown

The steps above together have brought us from a series of scanned images to a clean Markdown file.

This file can be edited - to make a new version of a document - to annotate the document

Used as the source code, in PDF Document Maker, to create a new PDF file


