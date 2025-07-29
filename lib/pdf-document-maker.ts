#!/usr/bin/env node

const __dirname = import.meta.dirname;

import { promises as fsp, constants } from 'node:fs';
import path, { parse } from 'node:path';
import util from 'node:util';

// This is the preferred way to import JSON.  But, with TypeScript@5.8.3 two
// errors get in the way.  First, it complains about ../package.json not
// being within rootDir, and therefore I made a symbolic link so that
// the `./` reference works.  Secondly, it said 'with` is not allowed
// in strict mode, but turning off strict mode with tsconfig.json settings
// did not work.

// import packageConfig from './package.json' with { type: 'json' }; // with { type: 'json' }; 

// This workaround comes from
// https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6
const packageConfig = JSON.parse(
    await fsp.readFile(
        path.join(__dirname, '..', 'package.json'), 'utf8'
    //   new URL('../package.json', import.meta.url), 'utf8'
    )
  );

import { Mime } from 'mime/lite';
import standardTypes from 'mime/types/standard.js';
import otherTypes from 'mime/types/other.js';
export const mime = new Mime(standardTypes, otherTypes);

import akasha from 'akasharender';
const mahabhuta = akasha.mahabhuta;
import { parseFrontmatter } from '@akashacms/renderers';

import { default as MarkdownITHighlightJS } from 'markdown-it-highlightjs';
import { default as MarkdownITBracketedSpans } from 'markdown-it-bracketed-spans';
import { default as MarkdownItAttrs } from 'markdown-it-attrs';
import { default as MarkdownItDiv } from 'markdown-it-div';
import { default as MarkdownItAnchor } from 'markdown-it-anchor';
import { default as MarkdownITTOC } from 'markdown-it-table-of-contents';
import { default as MarkdownItFootnote } from 'markdown-it-footnote';
import { default as MarkdownItSections } from 'markdown-it-header-sections';
import { default as MarkdownItImageFigures } from 'markdown-it-image-figures';
import { default as MarkdownItMultiMDTable } from 'markdown-it-multimd-table';
import { default as MarkdownItTableCaptions } from 'markdown-it-table-captions';
// import { default as MarkdownItKaTeX } from '@vscode/markdown-it-katex';

import { default as MarkdownItTexmath } from 'markdown-it-texmath';
import katex from 'katex';
import 'katex/contrib/mhchem';

import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';

import { PDFDocument, PageSizes, degrees, mergeIntoTypedArray } from 'pdf-lib';

import {
    DiagramsPlugin,
    MarkdownITMermaidPlugin
} from '@akashacms/diagrams-maker';

import { isPaperFormat } from './utils.js';

// import { default as config } from './config.mjs';
import puppeteer from 'puppeteer';
import { Command } from 'commander';
import {
    copyPDFMetadata,
    exportPagesFromPDF,
    // getFromURL,
    mergePDFsAndImages,
    reformatPDF,
    setPDFMetadata,
    showPDFinfo,
    showPageInformation,
    showPageSizes
} from './manipulate.js';
import { formatConfig, parseFormat, parseRotate, rotateConfig } from './options.js';
const program = new Command();

program
    .name('pdf-document-maker')
    .description('CLI to build PDF files from Markdown/AsciiDoc documents')
    .version(packageConfig.version,
        '-v, --version', 'output the current version');

program
    .command('render')
    .option('--config <configFN>', 'AkashaCMS configuration file. If specified it disables auto-generated config file.')
    .option('--base-dir <configDir>', 'Base directory of the project')
    .argument('<docPaths>', 'VPath for document to render')
    .option('--title <title>', 'Document title, overwriting any title in the document metadata.')
    .option('--layout <layoutTemplate>', 'File name, in a layouts directory, for the layout template. Overwrites any layout in the document metadata.')
    .option('--publication-date <publDate>', 'String containing a Date to be used in the publicationDate metdata field.')
    .option('--format <format>', 'Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"')
    // .option('--paper-orientation [orientation]', '"portrait" or "landscape"')
    .option('--pdf-output <pdfDir>', 'Output directory for PDF generation. Default process.cwd()/PDF')
    .option('--html-output <htmlDir>', 'Output directory for HTML generation')
    .option('--template-header <tmplHeader>', 'HTML template for page header')
    .option('--height-header <height>', 'Height of header block. Valid units are mm, cm, in and px.')
    .option('--template-footer <tmplFooter>', 'HTML template for page footer')
    .option('--height-footer <height>', 'Height of footer block. Valid units are mm, cm, in and px.')
    .option('--style <cssFile...>', 'File name of CSS style sheet')
    .option('--lesscss <lesscssFile...>', 'File name of LESS file to render to CSS')
    .option('--layout-dir <layoutDir...>', 'One or more directories for layout templates')
    .option('--partial-dir <partialDir...>', 'One or more directories for partial templates')
    .option('--asset-dir <assetsDir...>', 'One or more directories for assets')
    .option('--document-dir <documentsDir...>', 'One or more directories for documents')
    // TODO NODO
    // .option('--plantuml-url <url>', 'URL for a PlantUML server')
    .option('--no-headless', 'Turn off headless mode')
    // .option('--no-exit', 'Do not exit when rendering finished')
    .option('--no-pdf', 'Do not generate PDFs')
    .option('--no-printcss', 'Disable the print.css stylesheet')
    .option('--no-md-anchor', 'Disable the markdown-it-anchor extension')
    .option('--no-md-table-of-contents', 'Disable the markdown-it-table-of-contents extension')
    .option('--md-toc-list-type <type>', 'Define \'ul\' or \'ol\' list type')
    .option('--no-md-footnote', 'Disable the markdown-it-footnote extension')
    .option('--no-md-attrs', 'Disable the markdown-it-attrs extension')
    .option('--no-md-bracketed-spans', 'Disable the markdown-it-bracketed-spans extension')
    .option('--no-md-div', 'Disable the markdown-it-div extension')
    .option('--no-md-header-sections', 'Disable the markdown-it-header-sections extension')
    .option('--no-md-highlightjs', 'Disable the markdown-it-highlightjs extension')
    .option('--no-md-image-figures', 'Disable the markdown-it-image-figures extension')
    .option('--no-md-multimd-table', 'Disable the markdown-it-multimd-table extension')
    .option('--no-md-table-captions', 'Disable the markdown-it-table-captions extension')
    .option('--no-md-katex', 'Disable the @vscode/markdown-it-katex extension')
    .option('--no-md-plantuml', 'Disable the @akashacms/plugins-plantuml extension')
    .option('--no-md-mermaid', 'Enable markdown-it-mermaid')
    .option('--no-bootstrap', 'Disable Bootstrap v4 and related modules')
    // This turned out to not work.
    // .option('--use-mermaid', 'Enable MermaidJS rendering')
    // .option('--no-md-table-of-contents', 'Disable the markdown-it-table-of-contents extension')
    .option('--funcs <funcsFN>', 'Name a JS file containing Mahafuncs for custom processing')
    .option('--verbose', 'Print extra information during execution')
    .action(async (docPath, options, command) => {

        // TODO --watch  -- or nodemon
        // TODO NODO -- URL for PlantUML server
        // TODO -- highlight.js theme link

        let config;

        // console.log(options);

        if (typeof options.baseDir !== 'string') {
            throw new Error(`--base-dir option is required.`)
        }
        
        if (!isPaperFormat(options.format)) {
            throw new Error(`Paper format ${util.inspect(options.format)} incorrect`);
        }
        // if (options.paperOrientation !== 'landscape'
        //  && options.paperOrientation !== 'portrait'
        // ) {
        //     throw new Error(`Incorrect paper orientation ${util.inspect(options.paperOrientation)}`);
        // }

        if (typeof options.pdfOutput !== 'string') {
            options.pdfOutput = path.join(
                process.cwd(), 'PDF'
            );
        }
        await PDFOutputDir(options.pdfOutput);
        if (typeof options.htmlOutput !== 'string') {
            options.htmlOutput = path.join(
                process.cwd(), 'HTML'
            );
        }
        await HTMLOutputDir(options.htmlOutput);

        if (options.templateHeader
         || options.templateFooter
        ) {
            await checkTemplates(
                options.templateHeader,
                options.templateFooter
            );
        }
        if (options.heightHeader) {
            if (!isHdrFooterSize(options.heightHeader)) {
                throw new Error(`--height-header value incorrect ${util.inspect(options.heightHeader)}`);
            }
        }
        if (options.heightFooter) {
            if (!isHdrFooterSize(options.heightFooter)) {
                throw new Error(`--height-footer value incorrect ${util.inspect(options.heightFooter)}`);
            }
        }

        if (options.publicationDate) {
            if (!(typeof options.publicationDate === 'string')) {
                throw new Error(`--publication-date must be a Date string`);
            }
            const d = new Date(options.publicationDate);
            if (d.toString() === 'Invalid Date'
             || isNaN(d.valueOf())
            ) {
                throw new Error(`--publication-date must be a Date string`);
            }
        }

        if (options.layoutDir) {
            if (typeof options.layoutDir === 'string') {
                options.layoutDir = [ options.layoutDir ];
            }
            if (!Array.isArray(options.layoutDir)) {
                throw new Error(`--layout-dir must be an array ${util.inspect(options.layoutDir)}`);
            }
            for (const lDir of options.layoutDir) {
                await isReadableDirectory(lDir);
            }
        }

        if (options.assetDir) {
            if (typeof options.assetDir === 'string') {
                options.assetDir = [ options.assetDir ];
            }
            if (!Array.isArray(options.assetDir)) {
                throw new Error(`--asset-dir must be an array ${util.inspect(options.assetDir)}`);
            }
            for (const aDir of options.assetDir) {
                await isReadableDirectory(aDir);
            }
        }

        if (options.partialDir) {
            if (typeof options.partialDir === 'string') {
                options.partialDir = [ options.partialDir ];
            }
            if (!Array.isArray(options.partialDir)) {
                throw new Error(`--partial-dir must be an array ${util.inspect(options.partialDir)}`);
            }
            for (const pDir of options.partialDir) {
                await isReadableDirectory(pDir);
            }
        }

        if (options.documentDir) {
            if (typeof options.documentDir === 'string') {
                options.documentDir = [ options.documentDir ];
            }
            if (!Array.isArray(options.documentDir)) {
                throw new Error(`--document-dir must be an array ${util.inspect(options.documentDir)}`);
            }
            for (const dDir of options.documentDir) {
                await isReadableDirectory(dDir);
            }
        }

        // if (options.plantumlUrl) {
        //     if (!(typeof options.plantumlUrl === 'string')) {
        //         throw new Error(`Invalid argument for PlantUML server URL ${util.inspect(options.plantumlUrl)}`);
        //     }
        //     try {
        //         options.plantumlURL = new URL(options.plantumlUrl);
        //     } catch (err) {
        //         throw new Error(`Plantuml URL ${util.inspect(options.plantumlUrl)} incorrect because ${err.message}`);
        //     }
        // }

        if (options.funcs) {
            if (!(typeof options.funcs === 'string')) {
                throw new Error(`Incorrect funcs ${util.inspect(options.funcs)}`);
            }
            if (!isFileReadable(options.funcs)) {
                throw new Error(`Unreadable funcs ${util.inspect(options.funcs)}`);
            }
        }

        // ALL PROCESSING/VALIDATING OF OPTIONS ENDED

        if (options.verbose) {
            console.log({
                docPath,
                options
            });
        }


        if (typeof options.config === 'string') {
            config = (await import(
                path.join(process.cwd(), options.config)
            )).default;
        } else {
            config = await generateConfiguration(options);
        }

        if (!Array.isArray(config.documentDirs)
         || config.documentDirs.length <= 0
        ) {
            throw new Error(`Configuration must include document directories ${util.inspect(config.documentDirs)}`);
        }

        await akasha.setup(config);
        await config.copyAssets();

        if (options.lesscss) {
            await renderLESSCSS(config, options);
        }

        // await config.copyAssets();

        const renderedPaths = await renderDocuments(
            config, options, [ docPath ]
        );
        // console.log(renderedPaths);

        const browser = await launchBrowser(
             options.headless
        );
        if (options.pdf) {
            for (const renderedPath of renderedPaths) {
                await renderDocToPDF(
                    browser,
                    options,
                    config,
                    renderedPath,
                    options.pdfOutput,
                    options.format,
                    options.templateHeader,
                    options.templateFooter,
                    // options.paperOrientation
                );
            }
        }
        await akasha.closeCaches();
        await browser.close();
    });

program.command('info')
    .description('Show information about the PDF')
    .argument('<inputFN>')
    .action(async function(inputFN, options, command) {
        await showPDFinfo(inputFN);
    });

program.command('pages-info')
    .description('Show info for the pages of a PDF')
    .argument('<inputFN>')
    .action(async function(inputFN, options, command) {
        await showPageInformation(inputFN);
    });

program.command('page-sizes')
    .description('Show available page sizes')
    .action(async function(options, command) {
        showPageSizes();
    });


program.command('copy-metadata')
    .description('Copy metadata values from one PDF to another')
    .argument('<inputFN>', 'File name for PDF file which is to recieve metadata')
    .argument('<donorFN>', 'File name for PDF file from which to copy metadata')
    .argument('[outputFN]', 'File name for PDF file to save with modified metadata')
    .action(async function(inputFN, donorFN, outputFN, options, command) {
        await copyPDFMetadata(inputFN, donorFN, outputFN);
    });

program.command('set-metadata')
    .description('Set metadata values in a PDF')
    .argument('<pdfFN>', 'File name for PDF file')
    .argument('[saveToFN]', 'File name to which to save modified PDF file')
    .option('--title <title>', 'Document title')
    .option('--subject <subject>', 'Subject')
    .option('--author <author>', 'Author string')
    .option('--keyword <keyword...>', 'One keyword, may be used multiple times for multiple keywords')
    .option('--producer <producer>', 'Producor')
    .option('--creator <creator>', 'Creator')
    .option('--creation-date <date>', 'Date the document was created')
    .option('--modification-date <date>', 'Date the document was modified')
    .action(async function(pdfFN, saveToFN, options, command) {
        // console.log(`set-metadata `, {
        //     title: options.title,
        //     subject: options.subject,
        //     author: options.author,
        //     keyword: options.keyword,
        //     producer: options.producer,
        //     creator: options.creator,
        //     creationDate: options.creationDate,
        //     modificationDate: options.modificationDate,
        // });

        await setPDFMetadata(pdfFN, saveToFN, {
            title: options.title,
            subject: options.subject,
            author: options.author,
            keyword: options.keyword,
            producer: options.producer,
            creator: options.creator,
            creationDate: options.creationDate,
            modificationDate: options.modificationDate
        });
    });

program.command('reformat')
    .description('Change the document format (e.g. A4) to a new one (e.g. Letter')
    .argument('<inputFN>', 'PDF file name, or URL, of source document')
    .argument('[outputFN]', 'PDF file name of resized document. If not given, inputFN will be replaced')
    .option('--format <format>', 'Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"')
    .option('--rotate [rotation]', 'Rotate by 90, 180, or 270 degrees')
    .action(async function(inputFN, outputFN, options, command) {

        let config: formatConfig & rotateConfig = parseFormat(options, <any>{});
        config = parseRotate(options, config);
        await reformatPDF(inputFN, outputFN, config);
    });

program.command('extract')
    .description('Extract pages from input PDF to output. The pages are numbered from 0.')
    .argument('<inputFN>', 'PDF file name, or URL, to extract from')
    .argument('<outputFN>', 'PDF file name that receives the extracted images')
    .argument('[pages...]', 'Page numbers to extract, in the order of extraction')
    .option('--format <format>', 'Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"')
    .option('--rotate [rotation]', 'Rotate by 90, 180, or 270 degrees')
    .action(async function(inputFN, outputFN, pages, options, command) {
        // console.log(`extract ${util.inspect(inputFN)} ${util.inspect(outputFN)} ${util.inspect(pages)} `);
        let config: formatConfig & rotateConfig = parseFormat(options, <any>{});
        config = parseRotate(options, config);
        await exportPagesFromPDF(inputFN, outputFN, pages, config);
    });

// For exercising the get command
// program.command('get')
//     .description('Fetch a file via URL')
//     .argument('<url>', 'URL of file to fetch')
//     .argument('<outputFN>', "File name to save file to")
//     .action(async function(url, outputFN, options, command) {
//         await getFromURL(url, outputFN);
//     });

program.command('merge')
    .description('Merge multiple PDF, PNG, JPG, into one document')
    // TODO page layout
    // TODO metadata
    .argument('<files...>', 'File names, or URLs, to merge into the output file')
    .option('--output <outputFN>', 'File name for merged document')
    .option('--format <format>', 'Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"')
    .option('--rotate [rotation]', 'Rotate by 90, 180, or 270 degrees')
    .action(async function(files, options, command) {
        // console.log(`merge ${util.inspect(files)} ${util.inspect(options.output)} `);
        // console.log(options);
        // console.log(options.format);
        // console.log(options.pageFormat);

        let config: formatConfig & rotateConfig & {
            output?: string
        } = parseFormat(options, <any>{});
        config = parseRotate(options, config);
        config.output = options.output;
        await mergePDFsAndImages(files, config);
    });

program.parseAsync();

async function PDFOutputDir(pdfDir) {
    if (!(typeof pdfDir === 'string')) {
        throw new Error(`Unknown PDF output directory ${util.inspect(pdfDir)}`);
    }
    // console.log(`${__dirname} ${pdfDir}`);
    const dirnm = pdfDir.startsWith('/')
        ? pdfDir
        : path.join(process.cwd(), pdfDir);
    // console.log(dirnm);
    await fsp.mkdir(dirnm, {
            recursive: true
        }
    );
}

async function HTMLOutputDir(htmlDir) {
    if (!(typeof htmlDir === 'string')) {
        throw new Error(`Unknown HTML output directory ${util.inspect(htmlDir)}`);
    }
    // console.log(`${__dirname} ${htmlDir}`);
    const dirnm = htmlDir.startsWith('/')
        ? htmlDir
        : path.join(process.cwd(), htmlDir);
    // console.log(dirnm);
    await fsp.mkdir(dirnm, {
            recursive: true
        }
    );
}

async function isFileReadable(fname) {
    const access_ok = await fsp.access(
        fname, constants.R_OK
    );
    if (typeof access_ok !== 'undefined') {
        return false;
    } else {
        return true;
    }
}

async function checkTemplates(tmplHdr, tmplFtr) {
    if (typeof tmplHdr !== 'undefined') {
        if (typeof tmplHdr !== 'string') {
            throw new Error(`--template-header must be a string ${util.inspect(tmplHdr)}`);
        }
        if (!isFileReadable(tmplHdr)) {
            throw new Error(`Unreadable header template ${util.inspect(tmplHdr)}`);
        }
    }
    if (typeof tmplFtr !== 'undefined') {
        if (typeof tmplFtr !== 'string') {
            throw new Error(`--template-footer must be a string ${util.inspect(tmplFtr)}`);
        }
        if (!isFileReadable(tmplFtr)) {
            throw new Error(`Unreadable footer template ${util.inspect(tmplFtr)}`);
        }
    }
}

// nnn in units of mm, px, cm, in
function isHdrFooterSize(size) {
    const matches = size.match(/^([0-9]+)(mm|px|cm|in)$/);
    if (!Array.isArray(matches)) {
        return undefined;
    } else {
        return matches;
    }
}

async function isReadableDirectory(dirnm) {
    if (!(typeof dirnm === 'string')) {
        throw new Error(`Invalid directory name ${util.inspect(dirnm)}`);
    }
    let stats;
    try {
        stats = await fsp.stat(dirnm);
    } catch (err) { }
    if (stats) {
        if (!stats.isDirectory()) {
            throw new Error(`Directory ${util.inspect(dirnm)} is not a directory`);
        }
    }
    const access_ok = await fsp.access(dirnm, constants.R_OK);
    if (typeof access_ok !== 'undefined') {
        throw new Error(`Directory ${util.inspect(dirnm)} not readable`);
    }
}

async function generateConfiguration(options) {
    const config = new akasha.Configuration();

    config.rootURL("https://example.akashacms.com");

    config.configDir = options.baseDir;

    // Configure MarkdownIT
    // Add MarkdownIT plugins

    if (typeof options.htmlOutput === 'string') {
        config.setRenderDestination(options.htmlOutput);
    }

    // Add directories for assets, plugins,
    //     layout templates, and documents

    if (options.assetDir) {
        for (const aDir of options.assetDir) {
            config.addAssetsDir(path.isAbsolute(aDir)
                    ? aDir
                    : path.join(process.cwd(), aDir));
        }
    }
    // Make sure to include the built-in directory
    config.addAssetsDir(path.join(__dirname, '..', 'assets'));
    if (options.layoutDir) {
        console.log(options.layoutDir);
        for (const lDir of options.layoutDir) {
            config.addLayoutsDir(path.isAbsolute(lDir)
                    ? lDir
                    : path.join(process.cwd(), lDir));
        }
    }
    // Make sure to include the built-in directory
    config.addLayoutsDir(path.join(__dirname, '..', 'layouts'));
    if (options.partialDir) {
        for (const pDir of options.partialDir) {
            config.addPartialsDir(path.isAbsolute(pDir)
                    ? pDir
                    : path.join(process.cwd(), pDir));
        }
    }
    if (options.documentDir) {
        for (const dDir of options.documentDir) {
            config.addDocumentsDir(path.isAbsolute(dDir)
                    ? dDir
                    : path.join(process.cwd(), dDir));
        }
    }

    config.findRendererName('.html.md')
    .configuration({
        html:         true,
        xhtmlOut:     false,
        breaks:       false,
        linkify:      true,
        typographer:  false,
    });


    if (options.mdMermaid) {

        // The Markdown plugin takes the code within
        // the mermaid document, and puts that into a file.
        // Hence, it needs a directory into which to put
        // the file.
        // Hence, we make a directory
        //   - we add that as a Document directory
        //   - files made as /_mermaid/_mermaid/NNNNN.mermaid
        // The plugin then generates a custom tag which
        // will be handled by MermaidLocal and which does
        // the Mermaid rendering.

        const scratchDir = path.join(process.cwd(), '_mermaid');
        await fsp.mkdir(scratchDir, { recursive: true });
        config.addDocumentsDir(scratchDir);
        config.findRendererName('.html.md')
        .use(MarkdownITMermaidPlugin, {
            fspath: scratchDir,
            prefix: '/_mermaid'
        });
    }

    // if (options.mdPlantuml) {
    //     const PLoptions = {
    //         imageFormat: 'svg'
    //     };
    //     if (options.plantumlURL instanceof URL) {
    //         PLoptions.server = options.plantumlURL.href;
    //     }
    //     console.log({ PLoptions });
    //     config.findRendererName('.html.md')
    //     .use(MarkdownITPlantUML, PLoptions);
    // }
    if (options.mdHighlightjs) {
        config.findRendererName('.html.md')
        .use(MarkdownITHighlightJS, { 
            auto: true, 
            code: true 
        });

        const uHL = new URL(import.meta.resolve('highlight.js'));
        const pHL = uHL.pathname;
        // That gives: .../node_modules/highlight.js/es/index.js
        // We want the directory two levels above
        // console.log({
        //     uHL,
        //     path: uHL.pathname
        // });

        config.addAssetsDir({ 
            src: path.dirname(path.dirname(pHL)),
            dest: 'vendor/highlight.js' 
        });
    }
    if (options.mdBracketedSpans) {
        config.findRendererName('.html.md')
        .use(MarkdownITBracketedSpans);
    }
    if (options.mdAttrs) {
        config.findRendererName('.html.md')
        .use(MarkdownItAttrs, {
            allowedAttributes: [ 'id', 'class', 'caption', 'data' ]
        });
    }
    if (options.mdDiv) {
        config.findRendererName('.html.md')
        .use(MarkdownItDiv);
    }
    if (options.mdAnchor) {
        config.findRendererName('.html.md')
        .use(MarkdownItAnchor);
    }
    if (options.mdTableOfContents) {
        const opts = <any>{
            includeLevel: [ 1, 2, 3 ],
            omitTag: '<!-- omit from toc -->'
        };
        if (options.mdTocListType === 'ul') {
            opts.listType = 'ul';
        } else if (options.mdTocListType === 'ol') {
            opts.listType = 'ol';
        }
        config.findRendererName('.html.md')
        .use(MarkdownITTOC, opts);
    }
    if (options.mdFootnote) {
        config.findRendererName('.html.md')
        .use(MarkdownItFootnote);

        config.findRendererName('.html.md')
        .rendererRules.footnote_block_open = () => (
            '<h1 class="mt-3">Footnotes</h1>\n' +
            '<section class="footnotes">\n' +
            '<ol class="footnotes-list">\n'
        );

    }
    if (options.mdHeaderSections) {
        config.findRendererName('.html.md')
        .use(MarkdownItSections);
    }
    if (options.mdImageFigures) {
        config.findRendererName('.html.md')
        .use(MarkdownItImageFigures, {
            dataType: true,
            figcaption: true,
            tabindex: true
        });
    }
    if (options.mdMultimdTable) {
        config.findRendererName('.html.md')
        .use(MarkdownItMultiMDTable, {
            multiline:  true,
            rowspan:    true,
            headerless: true,
            multibody:  true,
            aotolabel:  true,
        });
    }

    if (options.mdTableCaptions) {
        config.findRendererName('.html.md')
        .use(MarkdownItTableCaptions);
    }

    if (options.mdKatex) {
        config.findRendererName('.html.md')
        .use(MarkdownItTexmath, {
            engine: katex,
            delimiters: 'dollars'
        });
        // .use(MarkdownItKaTeX.default, { "throwOnError": true });

        const uKTX = new URL(import.meta.resolve('katex'));
        // file:///home/david/Projects/akasharender/pdf-document-construction-set/guide/node_modules/katex/dist/katex.mjs
        const pKTX = uKTX.pathname;
        const toMountKTX = path.dirname(path.dirname(pKTX));

        const uTXM = new URL(import.meta.resolve('markdown-it-texmath'));
        const pTXM = uTXM.pathname;
        const toMountTXM = path.dirname(pTXM);

        config.addAssetsDir({
            src: toMountKTX,
            dest: 'vendor/katex'
        })
        .addAssetsDir({
            src: toMountTXM,
            dest: 'vendor/markdown-it-texmath'
        });

    }

    if (options.bootstrap) {
        const uBT = new URL(import.meta.resolve('bootstrap'));
        const pBT = uBT.pathname;
        const toMountBT = path.dirname(path.dirname(pBT));
        // console.log({ uBT, pBT, toMountBT });
        config.addAssetsDir({
            src: toMountBT,
            dest: 'vendor/bootstrap/'
        });
        const uJQ = new URL(import.meta.resolve('jquery'));
        const pJQ = uJQ.pathname;
        const toMountJQ = path.dirname(pJQ);
        // console.log({ uJQ, pJQ, toMountJQ });
        config.addAssetsDir({
            src: toMountJQ,
            dest: 'vendor/jquery'
        });
        const uPP = new URL(import.meta.resolve('popper.js'));
        const pPP = uPP.pathname;
        const toMountPP = path.dirname(path.dirname(pPP));
        // console.log({ uPP, pPP, toMountPP });
        config.addAssetsDir({
            src: toMountPP,
            dest: 'vendor/popper.js'
        });
    }

    // This turned out not to work
    //
    // if (options.useMermaid) {
    //     const uHL = new URL(import.meta.resolve('mermaid'));
    //     const pHL = uHL.pathname;
    //     // console.log(`Mermaid pHL `, pHL)
    //     config.addAssetsDir({
    //         src: path.dirname(pHL),
    //         dest: 'vendor/mermaid'
    //     });
    // }

    // Add AkashaCMS plugins

    config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin, {
        generateSitemapFlag: false
    });


    if (options.mdPlantuml) {
        config.use(DiagramsPlugin);
    }

    // Add JavaScript, CSS

    if (options.mdKatex) {
        config
        .addStylesheet({ href: "/vendor/katex/dist/katex.min.css" })
        .addStylesheet({
            href: "/vendor/markdown-it-texmath/css/texmath.css"
        });
    }

    if (options.bootstrap) {
        config
        .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
        .addFooterJavaScript({ href: "/vendor/popper.js/umd/popper.min.js" })
        .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
        .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
        .addStylesheet({ href: "/vendor/highlight.js/styles/stackoverflow-dark.css" })
        // .addStylesheet({ href: "/vendor/highlight.js/styles/shades-of-purple.css" })
        // .addStylesheet({ href: "/vendor/highlight.js/styles/github-dark-dimmed.css" });
        // .addStylesheet({ href: "/vendor/highlight.js/styles/tomorrow-night-blue.css" });
        // .addStylesheet({ href: "/vendor/highlight.js/styles/atelier-cave-light.css" });
        ;
    }

    // This should have worked.  The API is to load the Mermaid distribution
    // into the page, then it will render any code in `class=mermaid` elements.
    // But, this did not work out.
    //
    // if (options.useMermaid) {
    //     config.addFooterJavaScript({
    //         lang: 'module',
    //         script: `
    //         import mermaid from '/vendor/mermaid/dist/mermaid.esm.mjs';
    //         mermaid.initialize({ startOnLoad: true });
    //         `
    //     })
    // }

    if (options.style) {
        if (Array.isArray(options.style)) {
            for (const css of options.style) {
                config.addStylesheet({
                    href: css
                });
            }
        } else if (typeof options.style === 'string') {
            config.addStylesheet({
                href: options.style
            });
        }
    }

    if (options.printcss) {
        config.addStylesheet({
            href: "/vendor/printcss/print.css"
        });
    }

    // Mahabhuta configuration

    config.setMahabhutaConfig({
        recognizeSelfClosing: true,
        recognizeCDATA: true,
        decodeEntities: true
    });

    const builtInFuncs = await import (path.join(__dirname, 'built-in.js'));
    if (builtInFuncs) {
        if (!builtInFuncs.mahabhutaArray) {
            throw new Error(`Built-in Mahabhuta funcs must have mahabhutaArray`);
        }

        config.addMahabhuta(builtInFuncs.mahabhutaArray({ 
            config, akasha
        }));
    }

    if (options.funcs) {
        let funcsFN;
        if (path.isAbsolute(options.funcs)) {
            funcsFN = options.funcs;
        } else {
            funcsFN = path.normalize(
                path.join(
                    process.cwd(),
                    options.funcs
                )
            );
        }
        // console.log(`funcs ${options.funcs} ==> ${funcsFN}`);
        const mFuncs = await import(funcsFN);

        if (!mFuncs.mahabhutaArray) {
            throw new Error(`Mahabhuta funcs module must have mahabhutaArray - ${util.inspect(options.funcs)}`);
        }

        // Pull in the Mahafuncs for this project
        // Make sure to pass the config object in the
        // options object.
        //
        // Consider - how can the user pass
        // in additional metadata?
        //
        // One way is for the Mahafuncs module
        // to use top-level Await to read in
        // data as a global variable in
        // the module.
    
        config.addMahabhuta(mFuncs.mahabhutaArray({ 
            config, akasha
        }));

    }

    // Prepare the configuration
    config.prepare();

    if (options.verbose) {
        console.log({
            assets: config.assetDirs,
            layouts: config.layoutDirs,
            partials: config.partialDirs,
            documents: config.documentDirs
        });
    }
    return config;
}

async function renderLESSCSS(config, options) {
    let akasha = config.akasha;
    const documents = akasha.filecache.documentsCache;
    if (Array.isArray(options.lesscss)) {
        for (const lessfn of options.lesscss) {
            const lessInfo = await documents.find(lessfn);
            if (!lessInfo) {
                throw new Error(`Did not find document for ${lessfn}`);
            }
            const renderer = config.findRendererPath(lessfn);
            const renderTo = renderer.filePath(lessfn);
            // console.log(`renderLESSCSS ${lessfn} renderer ${renderer.name} renders to ${renderTo}`);
            let result = await akasha.renderDocument(
                config, lessInfo
            );
            config.addStylesheet({
                href: path.join('/', renderTo)
            });
            // if (options.verbose) {
                console.log(result);
            // }
        }
    }
}

async function renderDocuments(config, options, docPaths) {

    let akasha = config.akasha;
    // await akasha.setup(config);
    const documents = akasha.filecache.documentsCache;
    // await config.copyAssets();

    const renderedPaths = [];
    for (const docPath of docPaths) {
        const docInfo = await docInfoForPath(
            config, options, docPath
        );
        let result = await akasha.renderDocument(
            config, docInfo
        );
        // if (options.verbose) {
            console.log(result);
        // }
        renderedPaths.push(docInfo.renderPath);
    }

    return renderedPaths;
}

async function docInfoForPath(config, options, docPath) {

    const documents = akasha.filecache.documentsCache;
    const doc = await documents.find(docPath);
    if (doc) {
        if (!doc.metadata) {
            doc.metadata = {};
        }
        // These options overwrite an existing layout
        // or title, or supply a missing layout
        if (options.layout) {
            doc.metadata.layout = options.layout;
        }
        if (!doc.metadata.layout) {
            doc.metadata.layout = 'page.njk';
        }
        if (options.title) {
            doc.metadata.title = options.title;
        }
        if (options.publicationDate) {
            doc.metadata.publicationDate = options.publicationDate;
        }
        return doc;
    }
    // else

    if (!isFileReadable(docPath)) {
        throw new Error(`Unreadable funcs ${util.inspect(docPath)}`);
    }

    const renderer = config.findRendererPath(
        docPath
    );
    const content = await fsp.readFile(
        docPath, 'utf-8'
    );

    console.log(renderer);
    console.log(renderer.name);
    let context = renderer.parseMetadata({
        vpath: docPath,
        content: content
    });

    if (!context.metadata) {
        context.metadata = {};
    }
    // These options overwrite an existing layout
    // or title, or supply a missing layout
    if (options.layout) {
        context.metadata.layout = options.layout;
    } else if (!context.metadata.layout) {
        // Default to page.njk
        context.metadata.layout = 'page.njk';
    }

    if (options.title) {
        context.metadata.title = options.title;
    } else if (!context.metadata.title) {
        console.warn(`No title in metadata for ${docPath} and no --title option provided`);
    }

    if (options.publicationDate) {
        context.metadata.publicationDate = options.publicationDate;
    }

    // console.log(`docInfoForPath ${docPath} metadata=`, context.metadata);

    const docInfo = {
        vpath: docPath,
        fspath: docPath,
        renderPath: renderer.filePath(docPath),
        mountPoint: '/',
        pathInMounted: docPath,
        docContent: content,
        docBody: context?.body,
        metadata: context?.metadata
            ? context.metadata
            : {}
    };
    docInfo.metadata.document = {
        basedir: docInfo.mountPoint,
        relpath: docInfo.pathInMounted,
        relrender: renderer.filePath(docInfo.pathInMounted),
        path: docInfo.vpath,
        renderTo: docInfo.renderPath
    };

    if (config.root_url) {
        let pRootUrl = new URL(config.root_url);
        pRootUrl.pathname = path.normalize(
                path.join(pRootUrl.pathname, docInfo.metadata.document.renderTo)
        );
        docInfo.metadata.rendered_url = pRootUrl.toString();
    } else {
        docInfo.metadata.rendered_url = docInfo.metadata.document.renderTo;
    }

    return docInfo;
}

async function launchBrowser(
    headless
) {
    // Initialization comes from 
    // https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/
    const browser = await puppeteer.launch({
        headless,
        userDataDir: './tmp',
        args: [   '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials',
                '--autoplay-policy=user-gesture-required',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-default-apps',
                '--disable-dev-shm-usage',
                '--disable-domain-reliability',
                '--disable-extensions',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-hang-monitor',
                '--disable-ipc-flooding-protection',
                '--disable-notifications',
                '--disable-offer-store-unmasked-wallet-cards',
                '--disable-popup-blocking',
                '--disable-print-preview',
                '--disable-prompt-on-repost',
                '--disable-renderer-backgrounding',
                '--disable-setuid-sandbox',
                '--disable-speech-api',
                '--disable-sync',
                '--hide-scrollbars',
                '--ignore-gpu-blacklist',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-default-browser-check',
                '--no-first-run',
                '--no-pings',
                '--no-sandbox',
                '--no-zygote',
                '--password-store=basic',
                '--use-gl=swiftshader',
                '--use-mock-keychain']
    });

    return browser;
}

async function renderDocToPDF(
    browser,
    options,
    config,
    renderedPath,
    PDFdir,
    format,
    tmplHeader,
    tmplFooter,
    // paperOrientation
) {
    let landscape = false;
    // This did not make any difference,
    // so let's leave it out.
    //
    // if (paperOrientation === 'landscape') {
    //     landscape = true;
    // }
    const page = await browser.newPage();
    const outFN = path.join(
        // process.cwd(),
        config.renderDestination,
        renderedPath
    );
    // console.log(`CWD: ${process.cwd()} DEST: ${config.renderDestination} PATH: ${renderedPath} ==> ${outFN}`);
    await page.goto(
        `file://${outFN}`, {
            waitUntil: 'networkidle0'
        });

    // per Puppeteer documentation
    page.emulateMediaType('screen');

    // Generate PDF at default resolution
    const opts = {
        format,
        landscape,
        margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
        },
        displayHeaderFooter: true,
        headerTemplate: tmplHeader ? await fsp.readFile(tmplHeader, 'utf-8') : '',
        footerTemplate: tmplFooter ? await fsp.readFile(tmplFooter, 'utf-8') : '',
        printBackground: true
    };
    if (options.verbose) {
        console.log(opts);
    }
    const pdf = await page.pdf(opts);

    // Write PDF to file
    const pdfFN = path.basename(renderedPath, path.extname(renderedPath))+'.pdf';
    // console.log(pdfFN);
    await fsp.writeFile(
        path.join(PDFdir, pdfFN), pdf);

}
