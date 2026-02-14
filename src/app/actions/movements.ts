
'use server';

import prisma from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

export async function getMovementBatches() {
    return prisma.movementBatch.findMany({
        orderBy: {
            batchNumber: 'asc'
        }
    });
}

export async function getMovementBatchContent(batchNumber: number) {
    console.log(`Loading movement batch ${batchNumber}...`);
    const batch = await prisma.movementBatch.findUnique({
        where: { batchNumber }
    });

    if (!batch) {
        console.error(`Batch ${batchNumber} not found in database.`);
        throw new Error(`Batch ${batchNumber} not found`);
    }

    const fullPath = path.join(process.cwd(), batch.filePath);
    console.log(`Reading MDX file: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
        console.error(`MDX file does not exist: ${fullPath}`);
        throw new Error(`File not found: ${batch.filePath}`);
    }

    const source = fs.readFileSync(fullPath, 'utf8');
    console.log(`Source length: ${source.length}`);

    try {
        const { content, frontmatter } = await compileMDX<{
            title: string;
            yearRange: string;
            startSerial: number;
            endSerial: number;
        }>({
            source,
            options: { parseFrontmatter: true }
        });

        console.log(`Successfully compiled MDX for batch ${batchNumber}`);
        return {
            content,
            frontmatter,
            id: batch.id,
            batchNumber: batch.batchNumber
        };
    } catch (error) {
        console.error(`Error compiling MDX for batch ${batchNumber}:`, error);
        throw error;
    }
}
