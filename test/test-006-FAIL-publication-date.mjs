
import { fileContains, fileNoContains } from './common.mjs';

// First check that it catches a bad publication date

const pwd = $.sync`pwd`;

try {
    await $({
        verbose: true,
        sync: true
    })`node ../dist/pdf-document-maker.js render \
            --base-dir ${pwd} \
            --layout-dir layouts \
            --document-dir documents \
            --pdf-output PDF-005 \
            --html-output out-005 \
            --title 'Markdown test document no FM no Layout' \
            --publication-date zzzz \
            --format A4 \
            TEST.md`;
} catch (err) {
    console.log(`Correctly caught error: ${err.message} ${err.exitCode} ${err.stderr}`);
}

// It had been intended to continue the test case here, but
// I don't see a way to properly catch the error.
