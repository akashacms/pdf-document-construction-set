
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
        --pdf-output PDF-002 \
        --html-output out-002 \
        --title 'Markdown test document 002' \
        --layout page.njk \
        --format A4 \
        markdown.md`;

await fileContains('out-002/markdown.html', [
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document 002'
]);
