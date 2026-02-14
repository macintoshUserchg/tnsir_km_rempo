
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Robust Kruti Dev 010 to Unicode Conversion Logic
 * Based on standardized mappings used in Hindityping and other reliable converters.
 */
function convertKrutiToUnicode(text: string): string {
    if (!text) return "";

    let modified_substring = text;

    const array_one = [
        "ñ", "Q+Z", "sas", "aa", ")Z", "ZZ", "‘", "’", "“", "”",
        "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹",
        "¶+", "d+", "[+k", "[+", "x+", "T+", "t+", "M+", "<+", "Q+", ";+", "j+", "u+",
        "Ùk", "Ù", "ä", "–", "—", "é", "™", "=kk", "f=k",
        "à", "á", "â", "ã", "ºz", "º", "í", "{k", "{", "=", "«",
        "Nî", "Vî", "Bî", "Mî", "<î", "|", "K", "}",
        "J", "Vª", "Mª", "<ªª", "Nª", "Ø", "Ý", "nzZ", "æ", "ç", "Á", "xz", "#", ":",
        "v‚", "vks", "vkS", "vk", "v", "b±", "Ã", "bZ", "b", "m", "Å", ",s", ",", "_",
        "ô", "d", "Dk", "D", "[k", "[", "x", "Xk", "X", "Ä", "?k", "?", "³",
        "pkS", "p", "Pk", "P", "N", "t", "Tk", "T", ">", "÷", "¥",
        "ê", "ë", "V", "B", "ì", "ï", "M+", "<+", "M", "<", ".k", ".",
        "r", "Rk", "R", "Fk", "F", ")", "n", "/k", "èk", "/", "Ë", "è", "u", "Uk", "U",
        "i", "Ik", "I", "Q", "¶", "c", "Ck", "C", "Hk", "H", "e", "Ek", "E",
        ";", "¸", "j", "y", "Yk", "Y", "G", "o", "Ok", "O",
        "'k", "'", '"k', '"', "l", "Lk", "L", "g",
        "È", "z",
        "Ì", "Í", "Î", "Ï", "Ñ", "Ò", "Ó", "Ô", "Ö", "Ø", "Ù", "Ük", "Ü",
        "‚", "ks", "kS", "k", "h", "q", "w", "`", "s", "S",
        "a", "¡", "%", "W", "•", "·", "∙", "·", "~j", "~", "\\", "+", " ः",
        "^", "*", "Þ", "ß", "(", "¼", "½", "¿", "À", "¾", "A", "-", "&", "&", "Œ", "]", "~ ", "@"
    ];

    const array_two = [
        "॰", "QZ+", "sa", "a", "र्द्ध", "Z", "\"", "\"", "'", "'",
        "०", "१", "२", "३", "४", "५", "६", "७", "८", "९",
        "फ़्", "क़", "ख़", "ख़्", "ग़", "ज़्", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
        "त्त", "त्त्", "क्त", "दृ", "कृ", "न्न", "न्न्", "=k", "f=",
        "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष", "क्ष्", "त्र", "त्र्",
        "छ्य", "ट्य", "ठ्य", "ड्य", "ढ्य", "द्य", "ज्ञ", "द्व",
        "श्र", "ट्र", "ड्र", "ढ्र", "छ्र", "क्र", "फ्र", "र्द्र", "द्र", "प्र", "प्र", "ग्र", "रु", "रू",
        "ऑ", "ओ", "औ", "आ", "अ", "ईं", "ई", "ई", "इ", "उ", "ऊ", "ऐ", "ए", "ऋ",
        "क्क", "क", "क", "क्", "ख", "ख्", "ग", "ग", "ग्", "घ", "घ", "घ्", "ङ",
        "चै", "च", "च", "च्", "छ", "ज", "ज", "ज्", "झ", "झ्", "ञ",
        "ट्ट", "ट्ठ", "ट", "ठ", "ड्ड", "ड्ढ", "ड़", "ढ़", "ड", "ढ", "ण", "ण्",
        "त", "त", "त्", "थ", "थ्", "द्ध", "द", "ध", "ध", "ध्", "ध्", "ध्", "न", "न", "न्",
        "प", "प", "प्", "फ", "फ्", "ब", "ब", "ब्", "भ", "भ्", "म", "म", "म्",
        "य", "य्", "र", "ल", "ल", "ल्", "ळ", "व", "व", "व्",
        "श", "श्", "ष", "ष्", "स", "स", "स्", "ह",
        "ीं", "्र",
        "द्द", "ट्ट", "ट्ठ", "ड्ड", "कृ", "भ", "्य", "ड्ढ", "झ्", "क्र", "त्त्", "श", "श्",
        "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै",
        "ं", "ँ", "ः", "ॅ", "ऽ", "ऽ", "ऽ", "ऽ", "्र", "्", "?", "़", ":",
        "‘", "’", "“", "”", ";", "(", ")", "{", "}", "=", "।", ".", "-", "µ", "॰", ",", "् ", "/"
    ];

    // Special Glyph Replacements
    modified_substring = modified_substring.replace(/±/g, "Zं");
    modified_substring = modified_substring.replace(/Æ/g, "र्f");
    modified_substring = modified_substring.replace(/Ç/g, "fa");
    modified_substring = modified_substring.replace(/É/g, "र्fa");
    modified_substring = modified_substring.replace(/Ê/g, "ीZ");

    // Reordering logic for 'f' (Short I matra)
    let position_of_i = modified_substring.indexOf("f");
    while (position_of_i !== -1) {
        let character_next_to_i = modified_substring.charAt(position_of_i + 1);
        let character_to_be_replaced = "f" + character_next_to_i;
        modified_substring = modified_substring.replace(character_to_be_replaced, character_next_to_i + "ि");
        position_of_i = modified_substring.indexOf("f", position_of_i + 1);
    }

    // Reordering logic for 'fa' (Short I + Anusvar)
    let position_of_ia = modified_substring.indexOf("fa");
    while (position_of_ia !== -1) {
        let character_next_to_ia = modified_substring.charAt(position_of_ia + 2);
        let character_to_be_replaced = "fa" + character_next_to_ia;
        modified_substring = modified_substring.replace(character_to_be_replaced, character_next_to_ia + "िं");
        position_of_ia = modified_substring.indexOf("fa", position_of_ia + 2);
    }

    // Handle misplaced short i matra on half-letters
    let position_of_wrong_ee = modified_substring.indexOf("ि्");
    while (position_of_wrong_ee !== -1) {
        let consonant_next_to_wrong_ee = modified_substring.charAt(position_of_wrong_ee + 2);
        let character_to_be_replaced = "ि्" + consonant_next_to_wrong_ee;
        modified_substring = modified_substring.replace(character_to_be_replaced, "्" + consonant_next_to_wrong_ee + "ि");
        position_of_wrong_ee = modified_substring.indexOf("ि्", position_of_wrong_ee + 2);
    }

    // Replace based on arrays
    for (let input_symbol_idx = 0; input_symbol_idx < array_one.length; input_symbol_idx++) {
        let find = array_one[input_symbol_idx];
        let replace = array_two[input_symbol_idx];
        // Use a global regex for replacement to ensure all instances are covered
        let regex = new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        modified_substring = modified_substring.replace(regex, replace);
    }

    // Reordering logic for 'Z' (Reph/Half-r)
    const set_of_matras = "अ आ इ ई उ ऊ ए ऐ ओ औ ा ि ी ु ू ृ े ै ो ौ ं : ँ ॅ";
    let position_of_R = modified_substring.indexOf("Z");
    while (position_of_R > 0) {
        let probable_position_of_half_r = position_of_R - 1;
        let character_at_probable_position_of_half_r = modified_substring.charAt(probable_position_of_half_r);

        while (set_of_matras.indexOf(character_at_probable_position_of_half_r) !== -1 && probable_position_of_half_r > 0) {
            probable_position_of_half_r = probable_position_of_half_r - 1;
            character_at_probable_position_of_half_r = modified_substring.charAt(probable_position_of_half_r);
        }

        let character_to_be_replaced = modified_substring.substring(probable_position_of_half_r, position_of_R);
        let new_replacement_string = "र्" + character_to_be_replaced;
        modified_substring = modified_substring.replace(character_to_be_replaced + "Z", new_replacement_string);
        position_of_R = modified_substring.indexOf("Z");
    }

    // Final cleanup of double matras
    modified_substring = modified_substring.replace(/ाे/g, "ो").replace(/ाै/g, "ौ");

    return modified_substring;
}

async function main() {
    const rawData = fs.readFileSync('movements_raw.txt', 'utf-8');
    const lines = rawData.split('\n');
    const movements: any[] = [];
    let currentMovement: any = null;
    const serialRegex = /^(\d+)\.\s+/;

    console.log("Parsing movements...");
    for (const line of lines) {
        const trimmedLine = line.trim();
        const match = trimmedLine.match(serialRegex);
        if (match) {
            if (currentMovement) movements.push(currentMovement);
            const serial = match[1];
            const content = trimmedLine.replace(serialRegex, '');
            const parts = content.split(/\s{2,}|\t/);
            const yearRaw = parts[0] ? parts[0].trim() : '';
            const descRaw = parts.slice(1).join(' ').trim();
            currentMovement = {
                serial: parseInt(serial),
                year: convertKrutiToUnicode(yearRaw),
                description: convertKrutiToUnicode(descRaw)
            };
        } else if (currentMovement && trimmedLine && !trimmedLine.includes('File dk uke')) {
            currentMovement.description += ' ' + convertKrutiToUnicode(trimmedLine);
        }
    }
    if (currentMovement) movements.push(currentMovement);
    console.log(`Found ${movements.length} movements.`);

    const batchSize = 25;
    const contentDir = path.join(process.cwd(), 'src/content/movements');
    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

    await prisma.movementBatch.deleteMany();
    for (let i = 0; i < movements.length; i += batchSize) {
        const batch = movements.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        const startSerial = batch[0].serial;
        const endSerial = batch[batch.length - 1].serial;
        const yearRange = `${batch[0].year} - ${batch[batch.length - 1].year}`;
        let mdxContent = `---\ntitle: Movements Batch ${batchNumber}\nyearRange: "${yearRange}"\nstartSerial: ${startSerial}\nendSerial: ${endSerial}\n---\n\n`;
        for (const m of batch) {
            mdxContent += `### ${m.serial}. ${m.year}\n${m.description}\n\n`;
        }
        const fileName = `batch-${batchNumber}.mdx`;
        const filePath = path.join('src/content/movements', fileName);
        fs.writeFileSync(path.join(process.cwd(), filePath), mdxContent);
        await prisma.movementBatch.create({
            data: { batchNumber, yearRange, startSerial, endSerial, filePath }
        });
        console.log(`Created ${fileName}`);
    }
    await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
