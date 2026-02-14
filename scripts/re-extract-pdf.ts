import fs from 'fs';
import { PDFParse } from 'pdf-parse';

async function extract() {
    try {
        const dataBuffer = fs.readFileSync('dr. K.L Meena Andolan updated.pdf');
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();

        fs.writeFileSync('movements_raw.txt', result.text);
        console.log('SUCCESS: Text extracted to movements_raw.txt');
        await parser.destroy();
    } catch (error) {
        console.error('FAILED:', error);
        process.exit(1);
    }
}

extract();
