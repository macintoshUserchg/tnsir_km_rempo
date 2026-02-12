'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { EventFormFields } from './EventFormFields';
import { toast } from 'sonner';

// Define Cloudinary helper type
interface UploadedFile {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    type: 'PDF' | 'IMAGE';
}

interface AdminEventFormProps {
    locale: string;
    initialData?: any; // Event object
}

export default function AdminEventForm({ locale, initialData }: AdminEventFormProps) {
    const router = useRouter();
    const isHindi = locale === 'hi';
    const isEditMode = !!initialData;

    const [formData, setFormData] = useState({
        titleHi: initialData?.titleHi || '',
        titleEn: initialData?.titleEn || '',
        descriptionHi: initialData?.descriptionHi || '',
        descriptionEn: initialData?.descriptionEn || '',
        locationHi: initialData?.locationHi || '',
        locationEn: initialData?.locationEn || '',
        date: initialData?.date ? new Date(initialData.date) : new Date(),
        category: initialData?.category || '',
        images: initialData?.images || [], // Array of strings (URLs)
        isUpcoming: initialData?.isUpcoming ?? true,
    });

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    // TODO: Extract this to a shared utility
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'tnsir_km/events';
        const upload_preset = 'km_app'; // Assuming same preset works, or use a new one

        const signRes = await fetch('/api/sign-cloudinary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paramsToSign: {
                    timestamp,
                    folder,
                    upload_preset,
                }
            })
        });

        if (!signRes.ok) throw new Error('Failed to get upload signature');
        const { signature, cloudName, apiKey } = await signRes.json();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);
        formData.append('upload_preset', upload_preset);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
        const data = await uploadRes.json();
        return data.secure_url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const url = isEditMode
                ? `/api/admin/events/${initialData.id}`
                : '/api/admin/events';

            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Submission failed');
            }

            toast.success(isHindi
                ? (isEditMode ? 'कार्यक्रम अपडेट किया गया!' : 'कार्यक्रम बनाया गया!')
                : (isEditMode ? 'Event updated successfully!' : 'Event created successfully!')
            );

            router.push(`/${locale}/admin/events`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed');
            toast.error(err instanceof Error ? err.message : 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-5 py-4 rounded-r-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="dashboard-label text-sm">{error}</span>
                </div>
            )}

            <EventFormFields
                locale={locale}
                formData={formData}
                onChange={handleInputChange}
                onUpload={uploadToCloudinary}
            />

            {/* Submit Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                    className="h-12 px-8"
                >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                    type="submit"
                    size="lg"
                    disabled={submitting || uploading}
                    className="h-12 px-8 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            {isHindi ? 'सहेज रहा है...' : 'Saving...'}
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5 mr-2" />
                            {isHindi ? 'सहेजें' : 'Save Event'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
