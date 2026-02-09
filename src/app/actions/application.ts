'use server';

import prisma from '@/lib/db';
import { applicationSchema, ApplicationFormData } from '@/lib/validations/application';
import { revalidatePath } from 'next/cache';

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

export async function submitApplication(
    data: ApplicationFormData,
    fileUrl?: string
): Promise<SubmitApplicationResult> {
    try {
        // Validate the data
        const validatedData = applicationSchema.parse(data);

        // Generate unique application number
        const cNumber = generateCNumber();

        // Create the application in database
        const citizenApp = await prisma.citizenApp.create({
            data: {
                name: validatedData.name,
                fatherName: validatedData.fatherName,
                address: validatedData.address,
                mobile: validatedData.mobile,
                vidhansabhaId: validatedData.vidhansabhaId,
                workTypeId: validatedData.workTypeId,
                type: validatedData.applicantType,
                post: validatedData.post,
                description: validatedData.description,
                cNumber,
                fileUrl: fileUrl || null,
                status: 'PENDING',
            },
        });

        // Create activity log
        await prisma.activityLog.create({
            data: {
                citizenAppId: citizenApp.id,
                action: 'APPLICATION_SUBMITTED',
                note: 'आवेदन प्राप्त हुआ / Application received',
            },
        });

        // Revalidate admin pages
        revalidatePath('/admin/applications');
        revalidatePath('/admin/dashboard');

        return { success: true, cNumber };
    } catch (error) {
        console.error('Error submitting application:', error);

        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: 'आवेदन जमा करने में त्रुटि हुई' };
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
    const application = await prisma.citizenApp.findUnique({
        where: { cNumber },
        include: {
            vidhansabha: true,
            workType: true,
            activityLogs: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!application) {
        return null;
    }

    return application;
}

// Admin-only: Submit application on behalf of visitor
import { auth } from '@/lib/auth';

interface AdminApplicationData {
    name: string;
    fatherName: string;
    mobile: string;
    address: string;
    vidhansabhaId: number;
    type: string;
    post?: string;
    workTypeId: number;
    description?: string;
    documents: {
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        type: 'PDF' | 'IMAGE';
    }[];
}

export async function submitApplicationByAdmin(
    data: AdminApplicationData
): Promise<SubmitApplicationResult> {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized' };
        }

        // Generate unique application number
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
                type: data.type as 'CITIZEN' | 'PUBLIC_REP',
                post: data.post,
                description: data.description,
                cNumber,
                submittedById: session.user.id,
                status: 'PENDING',
            },
        });

        // Save documents
        if (data.documents.length > 0) {
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
        await prisma.activityLog.create({
            data: {
                citizenAppId: citizenApp.id,
                action: 'APPLICATION_SUBMITTED',
                note: `आवेदन ${session.user.name || 'Admin'} द्वारा जमा किया गया`,
                performedBy: session.user.name || session.user.email || undefined,
            },
        });

        // Revalidate admin pages
        revalidatePath('/admin/applications');
        revalidatePath('/admin/dashboard');

        return { success: true, cNumber };
    } catch (error) {
        console.error('Error submitting application:', error);
        return { success: false, error: 'आवेदन जमा करने में त्रुटि हुई' };
    }
}
