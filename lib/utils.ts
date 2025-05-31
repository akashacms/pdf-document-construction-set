
// Paper formats from https://pptr.dev/api/puppeteer.paperformat
// Letter: 8.5in x 11in
// Legal: 8.5in x 14in
// Tabloid: 11in x 17in
// Ledger: 17in x 11in
// A0: 33.1102in x 46.811in
// A1: 23.3858in x 33.1102in
// A2: 16.5354in x 23.3858in
// A3: 11.6929in x 16.5354in
// A4: 8.2677in x 11.6929in
// A5: 5.8268in x 8.2677in
// A6: 4.1339in x 5.8268in

export function isPaperFormat(format) {
    return typeof format === 'string'
     && ( 
        format === 'Letter'
        || format === 'Legal'
        || format === 'Ledger'
        || format === 'A0'
        || format === 'A1'
        || format === 'A2'
        || format === 'A3'
        || format === 'A4'
        || format === 'A5'
        || format === 'A6'
     );
}
