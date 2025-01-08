
const __dirname = import.meta.dirname;

import { promises as fsp, constants } from 'node:fs';
import path, { parse } from 'node:path';
import util from 'node:util';

import packageConfig from './package.json' with { type: 'json' }; 

import akasha from 'akasharender';
const mahabhuta = akasha.mahabhuta;
import { parseFrontmatter } from '@akashacms/renderers';

import { default as MarkdownITPlantUML } from 'markdown-it-plantuml';
import { default as MarkdownITHighlightJS } from 'markdown-it-highlightjs';
import { default as MarkdownItAttrs } from 'markdown-it-attrs';
import { default as MarkdownItDiv } from 'markdown-it-div';
import { default as MarkdownItAnchor } from 'markdown-it-anchor';
import { default as MarkdownItFootnote } from 'markdown-it-footnote';
// import { default as MarkdownItTOC } from 'markdown-it-table-of-contents';
// import { default as MarkdownItTOCDreapt } from 'markdown-it-toc-done-right';
import { default as MarkdownItSections } from 'markdown-it-header-sections';
import { default as MarkdownItImageFigures } from 'markdown-it-image-figures';
import { default as MarkdownItMultiMDTable } from 'markdown-it-multimd-table';
import { default as MarkdownItTableCaptions } from 'markdown-it-table-captions';

import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';

// import { default as config } from './config.mjs';
import puppeteer from 'puppeteer';
import { Command } from 'commander';
const program = new Command();

program
    // .name('build-documents')
    .description('CLI to build PDF files from Markdown/AkashaCMS documents')
    .version(packageConfig.version,
        '-v, --version', 'output the current version')
    .option('--config <configFN>', 'AkashaCMS configuration file. If specified it disables auto-generated config file.')
    .argument('<docPaths...>', 'VPaths for documents to render')
    .option('--title <title>', 'Document title, overwriting any title in the document metadata.')
    .option('--layout <layoutTemplate>', 'File name, in a layouts directory, for the layout template. Overwrites any layout in the document metadata.')
    .option('--format <format>', 'Page format, "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"')
    // .option('--paper-orientation [orientation]', '"portrait" or "landscape"')
    .option('--pdf-output <pdfDir>', 'Output directory for PDF generation. Default process.cwd()/PDF')
    .option('--html-output <htmlDir>', 'Output directory for HTML generation')
    .option('--template-header <tmplHeader', 'HTML template for page header')
    .option('--height-header <height>', 'Height of header block. Valid units are mm, cm, in and px.')
    .option('--template-footer <tmplFooter', 'HTML template for page footer')
    .option('--height-footer <height>', 'Height of footer block. Valid units are mm, cm, in and px.')
    .option('--style <cssFile>', 'File name of CSS style sheet')
    .option('--layout-dir <layoutDir...>', 'One or more directories for layout templates')
    .option('--partial-dir <partialDir...>', 'One or more directories for partial templates')
    .option('--asset-dir <assetsDir...>', 'One or more directories for assets')
    .option('--document-dir <documentsDir...>', 'One or more directories for documents')
    .option('--plantuml-url', 'URL for a PlantUML server')
    .option('--no-headless', 'Turn off headless mode')
    // .option('--no-exit', 'Do not exit when rendering finished')
    .option('--no-pdf', 'Do not generate PDFs')
    .option('--no-printcss', 'Disable the print.css stylesheet')
    .option('--no-md-anchor', 'Disable the markdown-it-anchor extension')
    .option('--no-md-footnote', 'Disable the markdown-it-footnote extension')
    .option('--no-md-attrs', 'Disable the markdown-it-attrs extension')
    .option('--no-md-div', 'Disable the markdown-it-div extension')
    .option('--no-md-header-sections', 'Disable the markdown-it-header-sections extension')
    .option('--no-md-highlightjs', 'Disable the markdown-it-highlightjs extension')
    .option('--no-md-image-figures', 'Disable the markdown-it-image-figures extension')
    .option('--no-md-multimd-table', 'Disable the markdown-it-multimd-table extension')
    .option('--no-md-table-captions', 'Disable the markdown-it-table-captions extension')
    .option('--no-md-plantuml', 'Disable the markdown-it-plantuml extension')
    .option('--use-mermaid', 'Enable MermaidJS rendering')
    // .option('--no-md-table-of-contents', 'Disable the markdown-it-table-of-contents extension')
    .option('--funcs <funcsFN>', 'Name a JS file containing Mahafuncs for custom processing')
    .action(async (docPaths, options, command) => {

        // TODO --watch  -- or nodemon
        // TODO -- URL for PlantUML server
        // TODO -- highlight.js theme link

        let config;
        
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

        // If the user did not specify a layout directory,
        // use the built-in directory
        if (!options.layoutDir) {
            options.layoutDir = [ path.join(__dirname, 'layouts') ]
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

        if (options.plantumlUrl) {
            if (!(typeof options.plantumlUrl === 'string')) {
                throw new Error(`Invalid argument for PlantUML server URL ${util.inspect(options.plantumlUrl)}`);
            }
            try {
                options.plantumlURL = new URL(options.plantumlUrl);
            } catch (err) {
                throw new Error(`Plantuml URL ${util.inspect(options.plantumlUrl)} incorrect because ${err.message}`);
            }
        }

        if (options.funcs) {
            if (!(typeof options.funcs === 'string')) {
                throw new Error(`Incorrect funcs ${util.inspect(options.funcs)}`);
            }
            if (!isFileReadable(options.funcs)) {
                throw new Error(`Unreadable funcs ${util.inspect(options.funcs)}`);
            }
        }

        // ALL PROCESSING/VALIDATING OF OPTIONS ENDED

        console.log({
            docPaths,
            options
        });


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

        // await config.copyAssets();

        const renderedPaths = await renderDocuments(
            config, options, docPaths
        );
        console.log(renderedPaths);

        const browser = await launchBrowser(
             options.headless
        );
        if (options.pdf) {
            for (const renderedPath of renderedPaths) {
                await renderDocToPDF(
                    browser,
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



program.parse();

// Paper formats from https://pptr.dev/api/puppeteer.paperformat
// Letter: 8.5in x 11in
// Legal: 8.5in x 14in
// Tabloid: 11in x 17in
// Ledger: 17in x 11in
// A0: 33.1102in x 46.811in
// A1: 23.3858in x 33.1102in
// A2: 16.5354in x 23.3858in
// A3: 11.6929in x 16.5354in
// A4: 8.2677in x 11.6929in
// A5: 5.8268in x 8.2677in
// A6: 4.1339in x 5.8268in

function isPaperFormat(format) {
    return typeof format === 'string'
     && ( 
        format === 'Letter'
        || format === 'Legal'
        || format === 'Ledger'
        || format === 'A0'
        || format === 'A1'
        || format === 'A2'
        || format === 'A3'
        || format === 'A4'
        || format === 'A5'
        || format === 'A6'
     );
}

async function PDFOutputDir(pdfDir) {
    if (!typeof pdfDir === 'string') {
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
    if (!typeof htmlDir === 'string') {
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
    const access_ok = !await fsp.access(
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
            throw new Error(`--template-header must be a string ${util.inspect(option.tmplHdr)}`);
        }
        if (!isFileReadable(tmplHdr)) {
            throw new Error(`Unreadable header template ${util.inspect(tmplHdr)}`);
        }
    }
    if (typeof tmplFtr !== 'undefined') {
        if (typeof tmplFtr !== 'string') {
            throw new Error(`--template-footer must be a string ${util.inspect(option.tmplFtr)}`);
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
    if (!typeof dirnm === 'string') {
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

    // Configure MarkdownIT
    // Add MarkdownIT plugins

    config.findRendererName('.html.md')
    .configuration({
        html:         true,
        xhtmlOut:     false,
        breaks:       false,
        linkify:      true,
        typographer:  false,
    });

    if (options.mdPlantuml) {
        config.findRendererName('.html.md')
        .use(MarkdownITPlantUML, {
            imageFormat: 'svg'
        });
    }
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
    // if (options.mdTableOfContents) {
    //     config.findRendererName('.html.md')
    //     .use(MarkdownItTOC, {
    //         placeholder: '[[toc]]',
    //         containerId: 'table-of-contents',
    //     });
    // }
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

    if (options.useMermaid) {
        const uHL = new URL(import.meta.resolve('mermaid'));
        const pHL = uHL.pathname;
        console.log(`Mermaid pHL `, pHL)
        config.addAssetsDir({
            src: path.dirname(pHL),
            dest: 'vendor/mermaid'
        });

    }
    
    // Add directories for assets, plugins,
    //     layout templates, and documents
    

    if (options.assetDir) {
        for (const aDir of options.assetDir) {
            config.addAssetsDir(aDir);
        }
    }
    if (options.layoutDir) {
        for (const lDir of options.layoutDir) {
            config.addLayoutsDir(lDir);
        }
    }
    if (options.partialDir) {
        for (const pDir of options.partialDir) {
            config.addPartialsDir(pDir);
        }
    }
    if (options.documentDir) {
        for (const dDir of options.documentDir) {
            config.addDocumentsDir(dDir);
        }
    }

    // Add AkashaCMS plugins

    config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin, {
        generateSitemapFlag: false
    });

    // Add JavaScript, CSS

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

    if (options.useMermaid) {
        config.addFooterJavaScript({
            lang: 'module',
            script: `
            import mermaid from '/vendor/mermaid/dist/mermaid.esm.mjs';
            `
        })
    }

    if (options.style) {
        config.addStylesheet({
            href: options.style
        });
    }

    // TODO there must be an assets directory
    // where this is stored

    if (options.printcss) {
        config.addStylesheet({
            href: "/print.css"
        });
    }

    // Mahabhuta configuration

    config.setMahabhutaConfig({
        recognizeSelfClosing: true,
        recognizeCDATA: true,
        decodeEntities: true
    });

    const builtInFuncs = await import (path.join(__dirname, 'built-in.mjs'));
    if (builtInFuncs) {
        if (!builtInFuncs.mahabhutaArray) {
            throw new Error(`Built-in Mahabhuta funcs must have mahabhutaArray`);
        }

        config.addMahabhuta(builtInFuncs.mahabhutaArray({ 
            config
        }));
    }

    if (options.funcs) {
        const mFuncs = await import(options.funcs);

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
            config
        }));

    }

    // Prepare the configuration
    config.prepare();

    return config;
}

async function renderDocuments(config, options, docPaths) {

    let akasha = config.akasha;
    await akasha.setup(config);
    const documents = akasha.filecache.documentsCache;
    await config.copyAssets();

    const renderedPaths = [];
    for (const docPath of docPaths) {
        const docInfo = await docInfoForPath(
            config, options, docPath
        );
        console.log(`renderDocuments ${docPath}` /*, docInfo */);
        let result = await akasha.renderDocument(
            config, docInfo
        );
        console.log(result);
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
        process.cwd(),
        config.renderDestination,
        renderedPath
    );
    // console.log(`CWD: ${process.cwd()} DEST: ${config.renderDestination} PATH: ${renderedPath} ==> ${outFN}`);
    await page.goto(
        `file://${outFN}`, {
            waitUntil: 'networkidle0'
        });

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
    console.log(opts);
    const pdf = await page.pdf(opts);

    // Write PDF to file
    const pdfFN = path.basename(renderedPath, path.extname(renderedPath))+'.pdf';
    // console.log(pdfFN);
    await fsp.writeFile(
        path.join(PDFdir, pdfFN), pdf);

}
