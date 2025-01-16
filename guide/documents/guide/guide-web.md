---
layout: article.njk
title: Building websites with AkashaCMS and PDF Document Maker
---

_PDF Document Maker_ is an integrated application, built from _AkashaCMS_ components, for producing good-quality PDF documents from Markdown or AsciiDoc files.

In the [PDF Document Maker Guide](guide.html), we learned how to build a PDF document with this tool.

The same content can be reused between a PDF document and a website.  The project website (https://akashacms.github.io/pdf-document-construction-set/index.html) is an example of an AkashaCMS website containing the PDF Document Maker Guide as both [HTML](https://akashacms.github.io/pdf-document-construction-set/guide/guide.html) and [PDF](https://akashacms.github.io/pdf-document-construction-set/guide/guide.pdf).  In both cases, this content is built from the same file.

This page is meant to show how to build a website documenting an open source software project (_PDF Document Maker_), and to reuse part of that website to build a downloadable standalone PDF documenting how to use the application.

The same pattern could be used by other open source software projects.

## Quick overview of AkashaCMS website project configuration

The name _AkashaCMS_ is an umbrella term over a group of software components.  _AkashaRender_ is the core, and is primarily tasked with rendering content into websites.  _Mahabhuta_ is the engine for DOM manipulation.  The _plugins_ extend the capabilities, and the _Bootstrap theme_ component helps with making the website prettier.

The AkashaCMS website has lots of documentation of AkashaCMS project configuration.

* https://akashacms.com/quick-start/index.html - is the Getting Started guide
* https://akashacms.com/akasharender/toc.html - Detailed documentation on AkashaRender
* https://akashacms.com/plugins/index.html - List of, and documentation for, the AkashaCMS plugins

Rather than replicate all that material, this document will show by example how this works.

### The `package.json` is used for _AkashaCMS_ or _PDF Document Maker_ project administration

An _AkashaCMS_, or _PDF Document Maker_, project directory contains a `package.json` file containing the administrative information about the project, a Configuration file describing the structure of the project, and content files from which the website or document is produced.

The `package.json` file comes from the Node.js ecosystem.  The prototypical use for this file is informing the npm package registry (`npmjs.com`) the characteristics of a Node.js package.

An AkashaCMS project, or a PDF Document Maker project, uses this file in a slightly different way.  Neither a website project, nor a PDF document project, is suitable for distribution through the npm registry.  Instead, we use this file to record the dependencies required to build the website or document, as well as the build and deployment processes.

In https://github.com/akashacms/pdf-document-construction-set/blob/main/guide/package.json we see an example.


The _scripts_ section contains scripts for building the website, and the PDF document, as well as deploying the website to GitHub Pages.

```json
"scripts": {
    "preview": "live-server out",
    "build:site": "npx akasharender render --copy-assets config.mjs",
    "build:guide": "npm-run-all build:sample-1 build:sample-2 build:workflow build:mahabhuta build:render pdf2out",
    "build:sample-1": "npx mmdc -i documents/guide/img/simple-sample-1.mmd -o documents/guide/img/simple-sample-1.svg --outputFormat svg",
    "build:sample-2": "npx mmdc -i documents/guide/img/simple-sample-2.mmd -o documents/guide/img/simple-sample-2.svg --outputFormat svg",
    "build:workflow": "npx mmdc -i documents/guide/img/pdf-document-workflow.mmd -o documents/guide/img/pdf-document-workflow.svg --outputFormat svg",
    "build:mahabhuta": "npx mmdc -i documents/guide/img/mahabhuta-workflow.mmd -o documents/guide/img/mahabhuta-workflow.svg --outputFormat svg",
    "build:render": "node ../pdf-document-maker.mjs --partial-dir partials --layout-dir layouts --document-dir documents --lesscss style.css.less --pdf-output PDF --html-output out --title 'PDF Document Maker Guide' --format A4 --funcs ./mahafuncs.mjs guide/guide.md",
    "pdf2out": "cp PDF/guide.pdf out/guide/guide.pdf",
    "gh-pages": "npx akasharender gh-pages-publish config.mjs"
},
```

The `preview` script lets us view the formatted content before deploying to a live server.

The `build:site` script renders the full website content into the HTML output directory.  The `--copy-assets` parameter says to copy files from the `assets` directories.  The file, `config.mjs`, is the configuration file, which is discussed in the next section.

The other `build:` scripts deal with rendering and formatting the PDF document.  A side note is that the commands in this group which use `mmdc` (the Mermaid CLI) render Mermaid documents into their matching SVG file.  The website also needs to display these SVG files, but in `build:script` these other files are not rendered, and therefore the PDF needs to have been rendered before running `build:script`.

The `gh-pages` script handles deploying the website to the GitHub repository using the GitHub Pages feature.

The time required to execute these on a mid-2016 x86 laptop, 16 GB of memory, on Ubuntu Linux, is:

```shell
$ time npm run build:guide
...
real	0m20.722s
user	0m14.697s
sys	0m4.321s

$ time npm run build:site
...
real	0m3.535s
user	0m3.491s
sys	0m0.497s
```

It is quite easy to do this on a developers laptop or in a GitHub Actions script.  One consideration for the latter is that under the covers of _PDF Document Maker_ is Puppeteer, which relies on the Chromium web browser running in headless mode.  The memory requirements for that may exceed (this hasn't been tested) the capacity of GitHub Actions.

### Configuration file

Many of the scripts just mentioned reference the configuration file, https://github.com/akashacms/pdf-document-construction-set/blob/main/guide/config.mjs

An AkashaCMS configuration file is a JavaScript file where the goal is to instantiate and initialize a Configuration object.  This file is then used at every step of rendering content files to create the website or PDF document.

The configuration file includes:

**Lists of directories for input files, as well as the HTML Rendering output directory:**

```js
config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    })
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addPartialsDir('partials')
    .setRenderDestination('out');
```

All but the last of these are directories holding input files.  They fall into four groups: 

* `assets` are files which are simply copied to the HTML output directory
* `layouts` are the page layout templates
* `partials` are the templates used for snippets
* `documents` are the content files

The last, `setRenderDestination`, is the HTML output directory.  All files are either copied into or rendered into this directory tree.  It results in a directory tree which may be directly deployed to a normal web server.

In this case the `gh-pages` command uploads it to GitHub such that it is automatically published via GitHub Pages.

**The plugins to be used, along with any configuration settings:**

```js
import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';
import { BreadcrumbsPlugin } from '@akashacms/plugins-breadcrumbs';
import { BooknavPlugin } from '@akashacms/plugins-booknav';
import { BlogPodcastPlugin } from '@akashacms/plugins-blog-podcast';

config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin, {
        generateSitemapFlag: true
    })
    .use(BreadcrumbsPlugin)
    .use(BooknavPlugin)
    .use(BlogPodcastPlugin);
```

AkashaCMS plugins extend the capabilities in different ways.  For example the _BreadcrumbsPlugin_ builds a navigation trail like this:

```
» PDF Document Maker » PDF Document Maker Guide » Building websites with AkashaCMS and PDF Document Maker
```

**Possible configuration for the Markdown-IT engine, including adding Markdown extensions:**

```js

import { default as MarkdownItAttrs } from 'markdown-it-attrs';
import { default as MarkdownItDiv } from 'markdown-it-div';
config.findRendererName('.html.md')
    .use(MarkdownItAttrs, {
        allowedAttributes: [ 'id', 'class', 'caption', 'data' ]
    })
    .use(MarkdownItDiv);
```

This, `findRendererName('.html.md')`, accesses the component for rendering Markdown to HTML.  It then adds two Markdown extensions.

**Listing stylesheet and JavaScript files to be used on all webpages:**

```js
config
    .addFooterJavaScript({
        href: "/vendor/jquery/jquery.min.js"
    })
    .addFooterJavaScript({
        href: "/vendor/bootstrap/js/bootstrap.min.js"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap.min.css"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap-theme.min.css"
    })
    .addStylesheet({
        href: "/style.css"
    });
```

These file references are stored in a list, and a custom HTML element turns this list into a series of `<link>` or `<script>` tags.

**If there is one or more blogs, configuring the characteristics of each:**

```js
config.plugin('@akashacms/plugins-blog-podcast')
    .addBlogPodcast(config, "news", {
        rss: {
            title: "PDF Document Maker News",
            description: "News announcements for the PDF Document Maker project",
            site_url: "http://akashacms.github.io/pdf-document-construction-set/blog/index.html",
            managingEditor: 'David Herron',
            webMaster: 'David Herron',
            copyright: '2025 David Herron',
            language: 'en',
            categories: [
                "Node.js", "Content Management System", "HTML5", "Static website generator"
            ]
        },
        rssurl: "/blog/rss.xml",
        matchers: {
            layouts: [ "blog.njk" ],
            rootPath: 'blog/'
        }
    });
```

This says the _news_ blog is made of files within the VPath space starting with "_blog/_", and who are formatted using the `blog.njk` layout template.  The blog produces an RSS feed at `/blog/rss.xml`, and the rest are parameters held inside the RSS feed.

## Tour of important files in the _PDF Document Maker_ website

The repository » PDF Document Maker » PDF Document Maker Guide » PDF Document Maker Guidehttps://github.com/akashacms/pdf-document-construction-set contains:

* The source for the _PDF Document Maker_ application which is distributed through the npm repository
* A test suite for this package
* An examples directory to demonstrate its usage
* A guide directory containing the project documentation, both the website (including the page you're reading right now) and the PDF version of the users guide.

The files corresponding to the _PDF Document Maker_ application package are:

```shell
$ tree assets/ built-in.mjs layouts/ pdf-document-maker.mjs package.json README.md 
assets/
└── vendor
    └── printcss
        └── print.css
built-in.mjs
layouts/
└── page.njk
pdf-document-maker.mjs
package.json
README.md

4 directories, 6 files
```

The files corresponding to the documentation website, and users guide PDF, are:

```shell
$ cd guide
$ tree assets partials layouts documents
assets
partials
├── footer.html
├── header.html
├── site-navbar.html
└── toc.html.njk
layouts
├── article.njk
├── blog.njk
├── home-page.njk
└── index-blog.njk
documents
├── blog
│   ├── 2025
│   │   ├── 01
│   │   │   ├── announce.md
│   │   │   └── index.html.md
│   │   └── index.html.md
│   └── index.html.md
├── guide
│   ├── guide.md
│   ├── guide-web.md
│   ├── img
│   │   ├── draw-io-export.png
│   │   ├── draw-io-export-png.png
│   │   ├── example-drawio-diagram.png
│   │   ├── mahabhuta-workflow.mmd
│   │   ├── mahabhuta-workflow.svg
│   │   ├── pdf-document-workflow.mmd
│   │   ├── pdf-document-workflow.svg
│   │   ├── simple-sample-1.mmd
│   │   ├── simple-sample-1.svg
│   │   ├── simple-sample-2.mmd
│   │   └── simple-sample-2.svg
│   └── index.md
├── index.md
└── style.css.less

8 directories, 28 files
```

## Process for building the _PDF Document Maker_ website

To build the website:

```shell
$ cd guide
$ npm run build:site
$ npm run gh-pages
```

The `build:site` script simply uses AkashaRender to render the site to the output directory:

```json
"build:site": "npx akasharender render --copy-assets config.mjs",
```

It's expected you'll use `npm run preview` to preview the website locally, so you can edit the content, handle content layout issues, etc, before deploying it to the web server.

### Adding announcements (blog posts)

It is very easy to add new content to an AkashaCMS website.  You simply create a file in a `documents` directory.  The next time you run the `render` command it will be automatically rendered into the output directory.

In the tree shown above, the announcements blog is stored in `documents/blog`.  It is structured with a date-oriented directory tree so one can easily determine when a blog post was made.  The directory tree in an AkashaCMS blog is entirely arbitrary, and the Blog-Podcast plugin does not force any file structure.

The `index.html.md` files in that directory hierarchy form an index of postings in the child directories to that directory.  Hence, `blog/2025/index.html` will contain a different index from `blog/2025/01/index.html`.

## Process for building PDF of _PDF Document Maker Guide_

To build the user guide PDF:

```shell
$ cd guide
$ npm run build:guide
```

This script is defined as so:

```json
"build:guide": "npm-run-all build:sample-1 build:sample-2 build:workflow build:mahabhuta build:render pdf2out",
```

The `npm-run-all` program is a great way to simplify using `package.json` to define a build process.  This runs the individual scripts to build Mermaid documents, then to run PDF Document Maker to build the PDF, and finally copy the PDF to the HTML output directory.

Once the PDF is built, it's up to you how this it is distributed.  For this project, copying the PDF into the HTML output directory ensures we can distribute the PDF via the website.

Notice that the scripts for building the PDF refer to the same content files as are used to build the website.  The `documents` directory contains `guide/guide.md` which produces `guide/guide.html` on the website, and which produces the `guide.pdf` PDF document.

It's the exact same file.

## Process for auto-rebuild and live-reloading

By using Nodemon and Live Reload, we can improve the user experience of inspecting the results of our edits.

With what we've shown so far, after editing files you must go to a terminal and type `npm run build:guide` or `npm run build:site`.  While that's not onerous, we can improve on this.

This will rely on two tools:

* Nodemon - https://www.npmjs.com/package/nodemon
* Live Server - https://www.npmjs.com/package/@compodoc/live-server

The _Live Server_ application watches the directory containing HTML+CSS+JS files, and when there's a change it causes the browser to reload the page.

It is started with this `package.json` script:

```json
"preview": "live-server out",
```

The _Nodemon_ application is used in this case to watch the source files, and to run the `build:site` or `build:guide` script.

In the repository, the `guide/package.json` has these scripts tags:

```json
"watch:site": "npx nodemon -e less,md,css,html,png,mmd \
      --watch assets --watch documents --watch layouts --watch partials \
      --exec npm run build:site",
"watch:guide": "npx nodemon -e less,md,css,html,png,mmd \
      --watch assets --watch documents --watch layouts-pdf --watch partials \
      --exec npm run build:guide",
```

This has been reformatted for readability.  With these options, Nodemon watches the important directories, and if a change occurs it reruns the command named after `--exec`.

In one terminal window, run: `npm run watch:site` OR `npm run watch:guide`

In another terminal window, run: `npm run preview`

The last will automatically open a browser tab, and you can browse the website view of your content.

Go back to your editor, make a change, then go back to your browser, and the browser might have reloaded by the time you're able to switch windows.


