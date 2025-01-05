
// Testing for PDF Document Construction Set is different
// from most applications.  The final result are PDF files
// which are difficult to validate.
//
// Instead - the structure of the tests are to:
//
//    1) Run a command with certain options
//    2) Inspect the HTML file
//    3) Validation of the PDF is done manually by a
//       human opening each PDF file.

import { promises as fsp } from 'node:fs';

try {
    await fsp.mkdir('out');
    await fsp.mkdir('PDF');
} catch (err) {
    // ignore
}

////////////// Markdown test - no override page.njk

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF \
        --html-output out --title 'Markdown test document' \
        --format A4 \
        markdown.md`;

await fileContains('out/markdown.html', [
    'test default.html.ejs',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document'
]);


////////////// Markdown test - override page.njk

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF \
        --html-output out --title 'Markdown test document' \
        --layout page.njk \
        --format A4 \
        markdown.md`;

await fileContains('out/markdown.html', [
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document'
]);


////////////// Markdown test - no frontmatter - override page.njk

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF \
        --html-output out --title 'Markdown test document' \
        --layout page.njk \
        --format A4 \
        markdown-no-fm.md`;

await fileContains('out/markdown-no-fm.html', [
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document'
]);

////////////// Markdown test - no frontmatter - no-override page.njk

$({
    verbose: true,
    sync: true
})`node ../pdf-document-maker.mjs  \
        --layout-dir layouts \
        --document-dir documents \
        --pdf-output PDF \
        --html-output out --title 'Markdown test document' \
        --format A4 \
        markdown-no-fm.md`;

await fileContains('out/markdown-no-fm.html', [
    'test page.njk',
    '<p>AkashaCMS supports markdown.',
    '<code class="hljs language-bash">',
    'Markdown test document'
]);


async function fileContains(fn, containsList) {
    const txt = await fsp.readFile(fn, 'utf8');

    for (const contains of containsList) {
        if (txt.indexOf(contains) >= 0) {
            return true;
        } else {
            throw new Error(`file ${fn} did not contain ${contains}`);
        }
    }
}