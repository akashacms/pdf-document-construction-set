
const __dirname = import.meta.dirname;

import { promises as fsp, constants } from 'node:fs';
import path, { parse } from 'node:path';
import util from 'node:util';

import { mime } from './pdf-document-maker.js';

import { PDFDocument, PageSizes, degrees } from 'pdf-lib';

const loadPDFfromFile = async (inputFN) => {

    // console.log(`loadPDFfromFile ${inputFN}`);
    const inpBytes = await fsp.readFile(inputFN);
    const donor = await PDFDocument.load(inpBytes);
    return donor;
};

const copyPageToPDF = async (pdfDoc, donor, pagenm, size, rotation) => {
    const copied = await pdfDoc.copyPages(donor, [pagenm]);
    // console.log(`copyPage ${pagenm} ${size}`);
    // const pg = await pdfDoc.addPage(copied[0]);

    // Handle resizing the page.  The `size` value is a string
    // to be used for indexing PageSizes which then returns
    // an array useful with page.setSize()
    //
    // Turns out that setSize only resizes the canvas, and to resize
    // the content we must use scaleContent.

    const toadd = copied[0];
    if (typeof size === 'string') {
        const origsz = toadd.getSize();
        if (!(size in PageSizes)) {
            throw new Error(`Incorrect page size name ${util.inspect(size)}`);
        }    
        const sz = PageSizes[size];
        // console.log(`orig ${util.inspect(origsz)} setSize ${size} ${util.inspect(sz)}`);
        toadd.setSize(sz[0], sz[1]);
        toadd.scaleContent(sz[0] / origsz.width, sz[1] / origsz.height);
        // pg.setSize(sz[0], sz[1]);
        // await pdfDoc.addPage(copied[0]).setSize(sz[0], sz[1]);
    }
    if (typeof rotation === 'string') {
        if (rotation === '0') {
            // no rotation
        } else if (rotation === '90') {
            await toadd.setRotation(degrees(90));
        } else if (rotation === '180') {
            await toadd.setRotation(degrees(180));
        } else if (rotation === '270') {
            await toadd.setRotation(degrees(270));
        } else {
            throw new Error(`Incorrect rotation ${util.inspect(rotation)}`);
        }
    }
    // console.log(`Adding page ${util.inspect(toadd.getSize())} ${util.inspect(toadd.getRotation())}`);
    const pg = await pdfDoc.addPage(toadd);
};

const savePDFtoFile = async (pdfDoc, outputFN) => {

    // console.log(`savePDFtoFile ${outputFN}`);
    const pdfBytes = await pdfDoc.save();
    await fsp.writeFile(outputFN, pdfBytes);
};

export async function showPDFinfo(inputFN: string) {

        // console.log(`page-count ${util.inspect(inputFN)}`);

        console.log(`PDF Information for ${inputFN}`);
        console.log(`MIME: ${mime.getType(inputFN)}`);
        const donor = await loadPDFfromFile(inputFN);
        console.log(`Title: ${donor.getTitle()}`);
        console.log(`Subject: ${donor.getSubject()}`);
        console.log(`Author: ${donor.getAuthor()}`);
        console.log(`Keywords: ${donor.getKeywords()}`);
        console.log(`Producer: ${donor.getProducer()}`);
        console.log(`Creator: ${donor.getCreator()}`);
        console.log(`Producer: ${donor.getProducer()}`);
        console.log(`CreationDate: ${donor.getCreationDate()}`);
        console.log(`ModDate: ${donor.getModificationDate()}`);
        console.log(`PageCount: ${donor.getPageCount()}`);
}

export async function showPageInformation(inputFN: string) {

    console.log(`PDF page information for ${inputFN}`);
    const pdfDoc = await loadPDFfromFile(inputFN);

    const totalPages = pdfDoc.getPageCount();

    for (let pn = 0; pn < totalPages; pn++) {
        // console.log(`... COPY ${pn}`);
        const copied = await pdfDoc.copyPages(pdfDoc, [pn]);
        console.log({
            pageNum: pn,
            artBox: copied[0].getArtBox(),
            bleedBox: copied[0].getBleedBox(),
            cropBox: copied[0].getCropBox(),
            mediaBox: copied[0].getMediaBox(),
            trimBox: copied[0].getTrimBox(),
            position: copied[0].getPosition(),
            size: copied[0].getSize(),
            rotation: copied[0].getRotation()
        });
    }
}

export function showPageSizes() {
    for (const key in PageSizes) {
        console.log(`${key}: ${util.inspect(PageSizes[key])}`);
    }
}

export async function copyPDFMetadata(inputFN: string, donorFN: string, outputFN: string) {

    const input = await loadPDFfromFile(inputFN);
    const donor = await loadPDFfromFile(donorFN);

    // For each metadata value
    // Test donor metadata - if set, then set in input

    const dotitle = donor.getTitle();
    if (typeof dotitle === 'string') {
        input.setTitle(dotitle);
    }

    const dosubject = donor.getSubject();
    if (typeof dosubject === 'string') {
        input.setSubject(dosubject);
    }

    const doauthor = donor.getAuthor();
    if (typeof doauthor === 'string') {
        input.setAuthor(doauthor);
    }

    const dokeywords = donor.getKeywords();
    if (Array.isArray(dokeywords)) {
        input.setKeywords(dokeywords);
    }

    const docreator = donor.getCreator();
    if (typeof docreator === 'string') {
        input.setCreator(docreator);
    }

    const docdate = donor.getCreationDate();
    if (typeof docdate === 'object') {
        input.setCreationDate(docdate);
    }

    const domdate = donor.getModificationDate();
    if (typeof domdate === 'object') {
        input.setModificationDate(domdate);
    }

    await savePDFtoFile(input,
        typeof outputFN === 'string' ? outputFN : inputFN);
}

export async function setPDFMetadata(
    pdfFN: string,
    saveToFN: string,
    options: {
        title?: string,
        subject?: string,
        author?: string,
        keyword?: string | Array<string>,
        producer?: string,
        creator?: string,
        creationDate?: string,
        modificationDate?: string
    }
) {

    const donor = await loadPDFfromFile(pdfFN);

    if (typeof options.title === 'string') {
        donor.setTitle(options.title);
    }
    if (typeof options.subject === 'string') {
        donor.setSubject(options.subject);
    }
    if (typeof options.author === 'string') {
        donor.setAuthor(options.author);
    }
    if (typeof options.keyword === 'string') {
        donor.setKeywords([ options.keyword ]);
    }
    if (Array.isArray(options.keyword)) {
        donor.setKeywords(options.keyword);
    }
    if (typeof options.producer === 'string') {
        donor.setProducer(options.producer);
    }
    if (typeof options.creator === 'string') {
        donor.setCreator(options.creator);
    }
    if (typeof options.creationDate === 'string') {
        donor.setCreationDate(new Date(options.creationDate));
    }
    if (typeof options.modificationDate === 'string') {
        donor.setModificationDate(new Date(options.modificationDate));
    }
    await savePDFtoFile(donor,
        typeof saveToFN === 'string' ? saveToFN : pdfFN);
}

export async function reformatPDF(
        inputFN: string,
        outputFN: string,
        options: {
            pageFormat?: string,
            rotate?: string
        }
) {
    const pdfDoc = await PDFDocument.create();
    const donor = await loadPDFfromFile(inputFN);

    const totalPages = donor.getPageCount();

    for (let pn = 0; pn < totalPages; pn++) {
        // console.log(`... COPY ${pn}`);
        await copyPageToPDF(pdfDoc, donor, pn, options.pageFormat, options.rotate);
    }
    await savePDFtoFile(pdfDoc,
        typeof outputFN === 'string' ? outputFN : inputFN);
}

export async function exportPagesFromPDF(
    inputFN: string,
    outputFN: string,
    pages?: Array<string>,
    options?: {
        pageFormat?: string,
        rotate?: string
    },

) {

    const pdfDoc = await PDFDocument.create();
    const donor = await loadPDFfromFile(inputFN);

    // console.log(inputFN);
    // console.log(outputFN);
    // console.log(pages);
    // console.log(options);
    // console.log(options.pageFormat);

    for (const pnum of pages) {
        await copyPageToPDF(
                pdfDoc,
                donor,
                Number.parseInt(pnum),
                options.pageFormat,
                options.rotate);
    }

    await savePDFtoFile(pdfDoc, outputFN);
}

export async function mergePDFsAndImages(
    files: Array<string>,
    options: {
        pageFormat?: string,
        rotate?: string,
        output?: string
    }
) {


    const pdfDoc = await PDFDocument.create();

    for (const filenm of files) {

        const inpMime = mime.getType(filenm);
        
        if (inpMime === 'application/pdf') {
            console.log(`Reading input PDF ${filenm} ${inpMime}`);
            const donor = await loadPDFfromFile(filenm);
            const totalPages = donor.getPageCount();

            for (let pn = 0; pn < totalPages; pn++) {
                // console.log(`... COPY ${pn}`);
                await copyPageToPDF(pdfDoc, donor, pn, options.pageFormat, options.rotate);
            }
        }
        else if (inpMime === 'image/jpeg'
         || inpMime === 'image/png'
        ) {
            console.log(`Reading input IMAGE ${filenm} ${inpMime}`);
            const bytes = await fsp.readFile(filenm);
            let img;
            if (inpMime === 'image/jpeg') {
                img = await pdfDoc.embedJpg(bytes);
            }
            if (inpMime === 'image/png') {
                img = await pdfDoc.embedPng(bytes);
            }
            if (img) {
                const page = pdfDoc.addPage();
                if (typeof options.pageFormat === 'string') {
                    const sz = PageSizes[options.pageFormat];
                    page.setSize(sz[0], sz[1]);
                }
                // TBD: Handle rotation

                const scaled = img.scaleToFit(
                    page.getWidth(),
                    page.getHeight()
                );
                page.drawImage(img, {
                    x: page.getWidth() / 2 - scaled.width / 2,
                    y: page.getHeight() / 2 - scaled.height / 2,
                    width: scaled.width,
                    height: scaled.height,
                });
                // pdfDoc.addPage(page);
            }
        }
        else {
            console.log(`UNKNOWN FILE TYPE ${filenm}`);
        }

    }

    await savePDFtoFile(pdfDoc, options.output);
}
