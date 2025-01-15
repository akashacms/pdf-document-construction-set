
import { fileContains, fileNoContains } from './common.mjs';

////////////// Gutenberg CSS
// Disable printcss
// Add several other CSS -- from assets - from documents - LESSCSS

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF-004 \
        --html-output out-004 \
        --title 'Markdown test document with Gutenberg no printcss multi custom css' \
        --style vendor/gutenberg/dist/gutenberg.css \
        --style css1.css \
        --style css2.css \
        --lesscss css3.css.less \
        --lesscss css4.less \
        --no-printcss \
        --layout page.njk \
        --format A4 \
        markdown.md`;

await fileContains('out-004/markdown.html', [
    '<link rel="stylesheet" type="text/css" href="vendor/gutenberg/dist/gutenberg.css">',
    '<link rel="stylesheet" type="text/css" href="css1.css">',
    '<link rel="stylesheet" type="text/css" href="css2.css">',
    '<link rel="stylesheet" type="text/css" href="css3.css">',
    '<link rel="stylesheet" type="text/css" href="css4.css">',
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document with Gutenberg no printcss multi custom css'
]);


await fileNoContains('out-004/markdown.html', [
    '<link rel="stylesheet" type="text/css" href="vendor/printcss/print.css">'
]);
