'use strict';

import util   from 'node:util';
import akasha from 'akasharender';

import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';
import { BreadcrumbsPlugin } from '@akashacms/plugins-breadcrumbs';
import { BooknavPlugin } from '@akashacms/plugins-booknav';
// import { EmbeddablesPlugin } from '@akashacms/plugins-embeddables';
import { BlogPodcastPlugin } from '@akashacms/plugins-blog-podcast';

import { default as MarkdownItAttrs } from 'markdown-it-attrs';
import { default as MarkdownItDiv } from 'markdown-it-div';
import { default as MarkdownItSections } from 'markdown-it-header-sections';
import { default as MarkdownItImageFigures } from 'markdown-it-image-figures';
import { default as MarkdownItMultiMDTable } from 'markdown-it-multimd-table';
import { default as MarkdownItTableCaptions } from 'markdown-it-table-captions';

const config = new akasha.Configuration();

const __dirname = import.meta.dirname;
config.configDir = __dirname;

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

config.rootURL("https://akashacms.github.io/pdf-document-construction-set");

config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin, {
        generateSitemapFlag: true
    })
    .use(BreadcrumbsPlugin)
    .use(BooknavPlugin)
    // .use(EmbeddablesPlugin)
    .use(BlogPodcastPlugin);
    
config.findRendererName('.html.md')
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
    .use(MarkdownItTableCaptions);

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
    
