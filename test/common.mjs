
import { promises as fsp } from 'node:fs';

export async function fileContains(fn, containsList) {
    const txt = await fsp.readFile(fn, 'utf8');

    for (const contains of containsList) {
        if (txt.indexOf(contains) >= 0) {
            // return true;
        } else {
            throw new Error(`file ${fn} did not contain ${contains}`);
        }
    }
    return true;
}

export async function fileNoContains(fn, containsList) {
    const txt = await fsp.readFile(fn, 'utf8');

    for (const contains of containsList) {
        if (txt.indexOf(contains) >= 0) {
            throw new Error(`file ${fn} contained unwanted content ${contains}`);
        }
    }
    return true;
}
