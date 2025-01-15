
import { fileContains, fileNoContains } from './common.mjs';

////////////// Gutenberg CSS

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-003 \
        --html-output out-003 \
        --title 'Markdown test document with Gutenberg' \
        --style vendor/gutenberg/dist/gutenberg.css \
        --layout page.njk \
        --format A4 \
        markdown.md`;

await fileContains('out-003/markdown.html', [
    '<link rel="stylesheet" type="text/css" href="vendor/gutenberg/dist/gutenberg.css"><link rel="stylesheet" type="text/css" href="vendor/printcss/print.css">',
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document with Gutenberg'
]);


$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-003 \
        --html-output out-003 \
        --title 'Markdown test document with Gutenberg NO PRINTCSS' \
        --style vendor/gutenberg/dist/gutenberg.css \
        --no-printcss \\
        --layout page.njk \
        --format A4 \
        markdown.md`;

await fileContains('out-003/markdown.html', [
    '<link rel="stylesheet" type="text/css" href="vendor/gutenberg/dist/gutenberg.css">',
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document with Gutenberg'
]);


await fileNoContains('out-003/markdown.html', [
    '<link rel="stylesheet" type="text/css" href="vendor/printcss/print.css">'
]);
