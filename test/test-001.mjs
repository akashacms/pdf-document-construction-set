
// Basic functioning
// No overrides
// Output to a specific directory

import { fileContains } from './common.mjs';

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-001 \
        --html-output out-001 \
        --title 'Markdown test document 001' \
        --format A4 \
        markdown.md`;

await fileContains('out-001/markdown.html', [
    'test default.html.ejs',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document 001'
]);

// This also adds validation of missing metadata

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-001 \
        --html-output out-001 \
        --title 'TEST.md 001' \
        --format A4 \
        TEST.md`;

await fileContains('out-001/TEST.html', [
    '<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">',
    '<h1 tabindex="-1">Markdown: Syntax</h1>',
    '<pre><code class="hljs">tell application',
    'TEST.md 001'
]);

        