
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