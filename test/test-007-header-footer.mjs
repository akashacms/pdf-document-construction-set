

import { fileContains } from './common.mjs';

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --template-header test-007-header-template.html \
        --height-header 20mm \
        --template-footer test-007-footer-template.html \
        --height-footer 20mm \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-007 \
        --html-output out-007 \
        --title 'TEST for header-footer 007' \
        --layout page.njk \
        --format A4 \
        TEST.md`;

await fileContains('out-007/TEST.html', [
    'test page.njk',
    '<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">',
    '<h1 tabindex="-1">Markdown: Syntax</h1>',
    '<pre><code class="hljs">tell application',
    'TEST for header-footer 007'
]);
