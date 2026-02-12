'use server';

import prisma from '@/lib/db';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { AppStatus } from '@prisma/client';

export type UpdateStatusResult = {
    success: boolean;
    error?: string;
};

export async function updateApplicationStatus(
    applicationId: number,
    newStatus: AppStatus,
    note?: string
): Promise<UpdateStatusResult> {
    try {
        const session = await auth();

        if (!session?.user) {
            return { success: false, error: 'Unauthorized' };
        }

        // Update the application status
        await prisma.citizenApp.update({
            where: { id: applicationId },
            data: { status: newStatus },
        });

        // Create activity log
        await prisma.activityLog.create({
            data: {
                citizenAppId: applicationId,
                action: `STATUS_CHANGED_TO_${newStatus}`,
                note: note || `Status updated to ${newStatus}`,
                performedBy: session.user.email || 'Admin',
            },
        });

        // Revalidate paths
        revalidatePath('/admin/applications');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Error updating status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function deleteApplication(applicationId: number): Promise<UpdateStatusResult> {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        // Delete activity logs first
        await prisma.activityLog.deleteMany({
            where: { citizenAppId: applicationId },
        });

        // Delete the application
        await prisma.citizenApp.delete({
            where: { id: applicationId },
        });

        revalidatePath('/admin/applications');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Error deleting application:', error);
        return { success: false, error: 'Failed to delete application' };
    }
}

/**
 * Toggle a feature setting
 */
export async function toggleFeatureSetting(
    key: string,
    enabled: boolean
): Promise<UpdateStatusResult> {
    try {
        const session = await auth();

        if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.siteSetting.upsert({
            where: { key },
            update: { value: enabled.toString() },
            create: {
                key,
                value: enabled.toString(),
                type: 'BOOLEAN',
                group: 'FEATURES',
            },
        });

        revalidatePath('/admin/settings');
        revalidatePath('/track');

        return { success: true };
    } catch (error) {
        console.error('Error toggling feature:', error);
        return { success: false, error: 'Failed to update feature setting' };
    }
}

/**
 * Get feature setting value
 */
export async function getFeatureSetting(key: string): Promise<boolean> {
    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key },
        });
        return setting?.value === 'true';
    } catch {
        return false;
    }
}
