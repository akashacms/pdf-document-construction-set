
import path from 'node:path';
import util   from 'node:util';
import akasha from 'akasharender';

import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';
import { BreadcrumbsPlugin } from '@akashacms/plugins-breadcrumbs';
import { BooknavPlugin } from '@akashacms/plugins-booknav';
// import { EmbeddablesPlugin } from '@akashacms/plugins-embeddables';
import { BlogPodcastPlugin } from '@akashacms/plugins-blog-podcast';

import { default as MarkdownITHighlightJS } from 'markdown-it-highlightjs';
import { default as MarkdownITBracketedSpans } from 'markdown-it-bracketed-spans';
import { default as MarkdownItAttrs } from 'markdown-it-attrs';
import { default as MarkdownItDiv } from 'markdown-it-div';
import { default as MarkdownItSections } from 'markdown-it-header-sections';
import { default as MarkdownItFootnote } from 'markdown-it-footnote';
import { default as MarkdownItImageFigures } from 'markdown-it-image-figures';
import { default as MarkdownItMultiMDTable } from 'markdown-it-multimd-table';
import { default as MarkdownItTableCaptions } from 'markdown-it-table-captions';
// import { default as MarkdownItKaTeX } from '@vscode/markdown-it-katex';
import { default as MarkdownItTexmath } from 'markdown-it-texmath';
import katext from 'katex';
import 'katex/contrib/mhchem';

import { DiagramsPlugin } from '@akashacms/diagrams-maker';

const config = new akasha.Configuration();

const __dirname = import.meta.dirname;
config.configDir = __dirname;

const uKTX = new URL(import.meta.resolve('katex'));
// file:///home/david/Projects/akasharender/pdf-document-construction-set/guide/node_modules/katex/dist/katex.mjs
const pKTX = uKTX.pathname;
const toMountKTX = path.dirname(path.dirname(pKTX));

const uTXM = new URL(import.meta.resolve('markdown-it-texmath'));
const pTXM = uTXM.pathname;
const toMountTXM = path.dirname(pTXM);

const uHL = new URL(import.meta.resolve('highlight.js'));
const pHL = uHL.pathname;

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
    .addAssetsDir({
        src: toMountKTX,
        dest: 'vendor/katex'
    })
    .addAssetsDir({
        src: toMountTXM,
        dest: 'vendor/markdown-it-texmath'
    }).addAssetsDir({ 
        src: path.dirname(path.dirname(pHL)),
        dest: 'vendor/highlight.js' 
    })
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addPartialsDir('partials')
    .setRenderDestination('out');

config.rootURL("https://akashacms.github.io/pdf-document-construction-set");

config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin, {
        generateSitemapFlag: true
    })
    .use(BreadcrumbsPlugin)
    .use(BooknavPlugin)
    // .use(EmbeddablesPlugin)
    .use(BlogPodcastPlugin)
    .use(DiagramsPlugin);
    
config.findRendererName('.html.md')
    .use(MarkdownITBracketedSpans)
    .use(MarkdownItAttrs, {
        allowedAttributes: [ 'id', 'class', 'caption', 'data' ]
    })
    .use(MarkdownItDiv)
    .use(MarkdownItSections)
    .use(MarkdownItImageFigures, {
        dataType: true,
        figcaption: true,
        tabindex: true
    })
    .use(MarkdownItMultiMDTable, {
        multiline:  true,
        rowspan:    true,
        headerless: true,
        multibody:  true,
        aotolabel:  true,
    })
    .use(MarkdownItTableCaptions)
    .use(MarkdownITHighlightJS, { 
        auto: true, 
        code: true 
    })
    .use(MarkdownItFootnote)
    .use(MarkdownItTexmath);

config.findRendererName('.html.md')
    .rendererRules.footnote_block_open = () => (
        '<h1 class="mt-3">Footnotes</h1>\n' +
        '<section class="footnotes">\n' +
        '<ol class="footnotes-list">\n'
    );

config
    .addFooterJavaScript({
        href: "/vendor/jquery/jquery.min.js"
    })
    .addFooterJavaScript({
        href: "/vendor/bootstrap/js/bootstrap.min.js"
    })
    .addStylesheet({
        href: "/vendor/katex/dist/katex.min.css"
    })
    .addStylesheet({
        href: "/vendor/markdown-it-texmath/css/texmath.css"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap.min.css"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap-theme.min.css"
    })
    .addStylesheet({ href: "/vendor/highlight.js/styles/stackoverflow-dark.css" })
    .addStylesheet({
        href: "/style.css"
    });

config.setMahabhutaConfig({
        recognizeSelfClosing: true,
        recognizeCDATA: true
    });
    
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

config.prepare();

export default config;
    
