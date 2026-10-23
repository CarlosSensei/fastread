import { Injectable } from "@angular/core";
import * as pdfjsLib from 'pdfjs-dist';
import ePub from 'epubjs';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();

@Injectable({
    providedIn: 'root'
})
export class FileReaderService {

    async extractText(file: File): Promise<string> {

        const extension = file.name.split('.').pop()?.toLowerCase();

        switch (extension) {

            case 'txt': return this.readTxt(file);

            case 'pdf': return this.readPdf(file);

            case 'epub': return this.readEpub(file);

            default: throw new Error('Formato no soportado');
        }
    }

    private readTxt(file: File): Promise<string> {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result as string);

            reader.onerror = reject;

            reader.readAsText(file);
        });
    }

    private async readPdf(file: File): Promise<string> {

        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            text += content.items.map((item: any) => item.str)
                .join(' ') + ' ';
        }   

        return text;
    }

    private async readEpub(file: File): Promise<string> {

        const buffer = await file.arrayBuffer();

        const book = ePub(buffer);

        await book.ready;

        let text = '';

        const sections = (book.spine as any).spineItems;
        
        for (const section of sections) {

            try {

                await section.load(book.load.bind(book));

                console.log(section.document);

                text +=
                    section.document?.body?.textContent ?? '';

                text += ' ';

                section.unload();

            } catch (error) {

                console.error(error);
            }
        
        }

        text = text
            .replace(/\s+/g, ' ')
            .replace(/\n/g, ' ')
            .trim();

        return text;
    }

}