
import path from 'node:path';
import { PDFToImage /*, PDFToIMGOptions */ } from 'pdf-to-image-generator';
const __dirname = import.meta.dirname;

const filePath = path.join(__dirname, '..', '..', 'guide', 'PDF', 'guide.pdf');

const options /*: PDFToIMGOptions */ = {
    // the name of the folder where files will be rendered
    outputFolderName: 'upload',
    // controls scaling
    viewportScale: 2,
};

const pdf = await new PDFToImage().load(filePath);
const numPages = pdf.document.numPages;
const textContent = await pdf.getTextContent();

// Listen to a progression event
pdf.on('progress', (data) => {
    console.log(
      `Page: ${data.currentPage}. Total: ${data.totalPages}. Progression: ${data.progress}%`
    );
});

// Notification of end of conversion
pdf.on('end', (data) => {
    console.log('End of conversion.', data);
});

// Convert your PDF to image
const pdfConversion = await pdf.convert(options);
