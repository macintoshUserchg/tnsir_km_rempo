'use server';

import prisma from '@/lib/db';
import { applicationSchema, ApplicationFormData, adminApplicationSchema, AdminApplicationData } from '@/lib/validations/application';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// Generate unique CNumber: YYYYMMDD-RANDOM
function generateCNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${dateStr}-${random}`;
}

export type SubmitApplicationResult = {
    success: boolean;
    cNumber?: string;
    error?: string;
};

/**
 * Shared internal function for creating applications
 */
async function createApplicationRecord(
    data: ApplicationFormData & { submittedById?: string; documents?: AdminApplicationData['documents'] },
    fileUrl?: string
) {
    const cNumber = generateCNumber();

    // Create the application
    const citizenApp = await prisma.citizenApp.create({
        data: {
            name: data.name,
            fatherName: data.fatherName,
            address: data.address,
            mobile: data.mobile,
            vidhansabhaId: data.vidhansabhaId,
            workTypeId: data.workTypeId,
            type: data.applicantType,
            post: data.post,
            description: data.description,
            cNumber,
            fileUrl: fileUrl || null,
            submittedById: data.submittedById,
            status: 'PENDING',
        },
    });

    // Save documents if any
    if (data.documents && data.documents.length > 0) {
        await prisma.document.createMany({
            data: data.documents.map((doc) => ({
                citizenAppId: citizenApp.id,
                filename: doc.filename,
                originalName: doc.originalName,
                mimeType: doc.mimeType,
                size: doc.size,
                url: doc.url,
                type: doc.type,
            })),
        });
    }

    // Create activity log
    const note = data.submittedById
        ? `आवेदन व्यवस्थापक द्वारा जमा किया गया / Application submitted by admin`
        : 'आवेदन प्राप्त हुआ / Application received';

    await prisma.activityLog.create({
        data: {
            citizenAppId: citizenApp.id,
            action: 'APPLICATION_SUBMITTED',
            note: note,
            performedBy: data.submittedById ? 'Admin' : undefined,
        },
    });

    // Revalidate admin pages
    revalidatePath('/admin/applications');
    revalidatePath('/admin/dashboard');

    return cNumber;
}

export async function submitApplication(
    data: ApplicationFormData,
    fileUrl?: string
): Promise<SubmitApplicationResult> {
    try {
        const validatedData = applicationSchema.parse(data);
        const cNumber = await createApplicationRecord(validatedData, fileUrl);
        return { success: true, cNumber };
    } catch (error) {
        console.error('Error submitting application:', error);
        return { success: false, error: error instanceof Error ? error.message : 'आवेदन जमा करने में त्रुटि हुई' };
    }
}

// Get Vidhansabhas for form dropdown
export async function getVidhansabhas() {
    return prisma.vidhansabha.findMany({
        orderBy: { nameHi: 'asc' },
    });
}

// Get Work Types for form dropdown
export async function getWorkTypes() {
    return prisma.workType.findMany({
        orderBy: { nameHi: 'asc' },
    });
}

// Track application status
export async function getApplicationStatus(cNumber: string) {
    return prisma.citizenApp.findUnique({
        where: { cNumber },
        include: {
            vidhansabha: true,
            workType: true,
            activityLogs: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });
}

// Admin-only: Submit application on behalf of visitor
export async function submitApplicationByAdmin(
    data: AdminApplicationData
): Promise<SubmitApplicationResult> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const validatedData = adminApplicationSchema.parse(data);
        const cNumber = await createApplicationRecord({
            ...validatedData,
            submittedById: session.user.id,
        });

        return { success: true, cNumber };
    } catch (error) {
        console.error('Error submitting application (admin):', error);
        return { success: false, error: 'आवेदन जमा करने में त्रुटि हुई' };
    }
}
