
import { fileContains, fileNoContains } from './common.mjs';

// Use the no frontmatter file TEST.md
// Do not override layout - should default to page.njk

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-005 \
        --html-output out-005 \
        --title 'Markdown test document no FM no Layout' \
        --format A4 \
        TEST.md`;

await fileContains('out-005/TEST.html', [
    'test page.njk',
    '<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">',
    '<h1 tabindex="-1">Markdown: Syntax</h1>',
    '<pre><code class="hljs">tell application',
    'Markdown test document no FM no Layout'
]);


