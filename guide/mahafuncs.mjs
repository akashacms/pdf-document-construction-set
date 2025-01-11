
// import util from 'node:util';
// import { promises as fsp } from "node:fs";
// import YAML from 'js-yaml';

// THIS IS NOT HOW THE IMPORT STATEMENT SHOULD BE WRITTEN
import akasha from '../node_modules/akasharender/dist/index.js';
const mahabhuta = akasha.mahabhuta;

// Normally that would be written as so:
// import akasha from 'akasharender';
// const mahabhuta = akasha.mahabhuta;

// This particular MahafuncArray is in a place where this
// directory has an AkashaRender instance, as does
// its parent directory.
//
// In order for a type like `mahabhuta.MahafuncArray` to
// work correctly, it must be the same class instance that
// in use within the PDF Document Maker application.
//
// A typical PDF Document Maker project directory will have
// installed the pdf-document-maker package and everything
// will be fine.  But, in this case, PDF Document Maker is
// our parent directory, and it will use the AkashaRender
// instance in ../node_modules/akasharender rather than
// the instance in ./node_modules/akasharender.

const pluginName = 'PDF-Document-Maker-Guide';

export function mahabhutaArray(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new HnNumbering());
    return ret;
};

/**
 * Generate numbering for Hn tags, along with generating
 * a table of contents.
 * 
 * The technique for numbering Hn tags is similar to
 * the CSS in this Gist: https://gist.github.com/rodolfoap/6cd714a65a891c6fe699ab91f0d22384
 * In that case, a CSS counter is kept for H1/H2/H3/etc tags,
 * which is reset at certain cases.
 * 
 * What we're doing is looking for H1, H2, H3 tags.
 * The corresponding counter is kept tracking the numbering
 * for each.  For H2 and H3 tags the counter will be reset
 * to zero when needed.
 * 
 * The text of the Hn tag is the original text prepended
 * with the counters.
 * 
 * Next, the headers array stores data about the Hn tags.
 * It stores the level of each Hn tag as a child of the
 * previous Hn parent.  This way the ToC becomes a nested
 * list of items.
 * 
 * Next, a Partial traverses that list producing
 * a <nav><ul>...</ul></nav> structure
 * The <nav> tag is important because it is the
 * semantically correct HTML element.
 * 
 * Finally, the text generated with the Partial
 * replaces the <toc-text-here> tag.
 */
class HnNumbering extends mahabhuta.PageProcessor {
	async process($, metadata, dirty) /* : Promise<string> */ {

        let counter_h1 = 0;
        let counter_h2 = 0;
        let counter_h3 = 0;

        const headers = [];
        let prevH1;
        let prevH2;
        let prevH3;
        $('article').find('h1:not(.header-title), h2, h3').each(function() {
            if ($(this).is('h1')) {
                counter_h1++;
                counter_h2 = counter_h3 = 0;

                const title = `${counter_h1}. ${$(this).text()}`;
                $(this).text(title);
            }
            if ($(this).is('h2')) {
                counter_h2++;
                counter_h3 = 0;

                const title = `${counter_h1}.${counter_h2}. ${$(this).text()}`;
                $(this).text(title);
            }
            if ($(this).is('h3')) {
                counter_h3++;

                const title = `${counter_h1}.${counter_h2}.${counter_h3}. ${$(this).text()}`;
                $(this).text(title);
            }
            if ($(this).is('h1')) {
                prevH1 = {
                    id: $(this).parent('section').attr('id'),
                    title: $(this).text()
                };
                headers.push(prevH1);
                prevH2 = prevH3 = undefined;
            } else if ($(this).is('h2')) {
                if (!prevH1) {
                    throw new Error(`H2 found before any H1`);
                }
                if (!('children' in prevH1)) {
                    prevH1.children = [];
                }
                prevH2 = {
                    id: $(this).parent('section').attr('id'),
                    title: $(this).text()
                };
                prevH1.children.push(prevH2);
            } else if ($(this).is('h3')) {
                if (!prevH2) {
                    throw new Error(`H2 found before any H1`);
                }
                if (!('children' in prevH2)) {
                    prevH2.children = [];
                }
                prevH3 = {
                    id: $(this).parent('section').attr('id'),
                    title: $(this).text()
                };
                prevH2.children.push(prevH3);
            }
        });

        // console.log(headers);
        
        const toctext = await this.array.options.akasha.partial(
            this.array.options.config,
            'toc.html.njk', {
            headers
        });

        // console.log(toctext);

        $('toc-text-here').replaceWith(toctext);
	}
}

