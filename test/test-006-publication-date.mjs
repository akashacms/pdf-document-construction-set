
import { fileContains, fileNoContains } from './common.mjs';

const now = new Date().toISOString();
console.log(now);

await $({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-006 \
        --html-output out-006 \
        --title 'Markdown test document specify publicationDate' \
        --publication-date ${now} \
        --format A4 \
        TEST.md`;


await fileContains('out-006/TEST.html', [
    'test page.njk',
    '<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">',
    '<h1 tabindex="-1">Markdown: Syntax</h1>',
    '<pre><code class="hljs">tell application',
    'Markdown test document specify publicationDate',
    `publicationDate ${now}`
]);

        
        