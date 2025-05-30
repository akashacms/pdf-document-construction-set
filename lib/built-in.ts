/**
 * Mahafuncs specifically for PDF Document Maker
 */


import { promises as fsp, constants } from 'node:fs';
import path, { parse } from 'node:path';
import util from 'node:util';

import akasha from 'akasharender';
const mahabhuta = akasha.mahabhuta;


const pluginName = 'PDF-Document-Maker-Built-IN';

export function mahabhutaArray(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new StaticThingCopier());
    return ret;
}

// 1. Detect images and other static files in documents directory
//    Copy said files to output directory
//
// 2. Detect when a stylesheet is referenced and there is a
//    matching style.css.less or style.less in the documents directory.
//    Render that file to the output directory
//
//    Actually - this should be a CLI parameter
//        --lesscss style.css.less or style.less
//    When used, automatically render and add to stylesheets
//
//    Another option, in metadata lesscss option that
//    does the same thing


class StaticThingCopier extends mahabhuta.Munger {

    get selector() { return "html body"; }
    get elementName() { return "html body"; }

    async process($, $link, metadata, dirty) {
        const config = this.array.options.config;
        const documents = config.akasha.filecache.documentsCache;
        const assets = config.akasha.filecache.assetsCache;

        // console.log(`StaticThingCopier ${metadata.document.path}`);

        // First, look at all img tags to find which
        // refer to local files
        const imgz = [];
        $('img').each(function(i, elem) {
            let src = $(elem).attr('src');
            if (typeof src !== 'string') {
                // Skip anything where src= does
                // not contain a string
                return;
            }
            let uSRC;
            try {
                uSRC = new URL(src); 
            } catch (err) {
                // Any error means src is not a regular URL
                // We're looking for local references
                // such as ./img/foo.png which would not be
                // a regular URL.  For any regular URLs we
                // need to skip those images
            }
            if (uSRC) {
                // As just said, a src that is a regular
                // URL is not of interest, so we skip
                return;
            }
            // This is some kind of non-URL so we put it
            // into the array

            let vpath;
            if (src.match(/^\//)) {
                // Absolute pathname
                vpath = src;
            } else /* if (href.match(/^\.\//)
                || href.match(/^\.\.\//)
            ) */ {
                // relative to current or parent directory
                //    ./ or ../ or foo/bar/baz
                vpath = path.normalize(
                    path.join(
                        path.dirname(metadata.document.path),
                        src
                    )
                );
            }

            imgz.push(vpath);
        });

        // console.log(`StaticThingCopier ${metadata.document.path}`, imgz);

        // For any image files that are in the documents
        // file cache, copy those to the rendering output
        // directory.
        //
        // Other files are presumably in the assets cache.

        for (const vpath of imgz) {
            const docInfo = await documents.find(vpath);
            if (docInfo) {
                // console.log(`StaticThingCopier found ${vpath} in docs - renderingDest ${config.renderDestination} fspath ${docInfo.fspath}`);
                const dest = path.join(
                    config.renderDestination,
                    vpath
                );
                await fsp.mkdir(path.dirname(dest), { recursive: true });
                await fsp.copyFile(docInfo.fspath, dest);
            }
        }
    }
}