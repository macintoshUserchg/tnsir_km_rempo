'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitApplicationByAdmin } from '@/app/actions/application';
import { ApplicationFormFields } from './ApplicationFormFields';
import { DocumentUploadSection, UploadedFile } from './DocumentUploadSection';
import { toast } from 'sonner';

interface AdminApplicationFormProps {
    locale: string;
    vidhansabhas: { id: number; nameHi: string; nameEn: string | null }[];
    workTypes: { id: number; nameHi: string; nameEn: string | null }[];
}

export default function AdminApplicationForm({ locale, vidhansabhas, workTypes }: AdminApplicationFormProps) {
    const router = useRouter();
    const isHindi = locale === 'hi';

    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        mobile: '',
        address: '',
        vidhansabhaId: '',
        type: 'CITIZEN',
        post: '',
        workTypeId: '',
        description: '',
    });

    const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);
    const [images, setImages] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const uploadFile = async (file: File, type: 'pdf' | 'image'): Promise<UploadedFile | null> => {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('type', type);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: payload,
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Upload failed');
        }

        const data = await res.json();
        return data.file;
    };

    const handlePdfUpload = async (file: File) => {
        setUploading(true);
        setError('');
        try {
            const uploaded = await uploadFile(file, 'pdf');
            if (uploaded) setPdfFile(uploaded);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'PDF upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        setError('');
        try {
            const uploaded = await uploadFile(file, 'image');
            if (uploaded) setImages(prev => [...prev, uploaded]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removePdf = () => setPdfFile(null);
    const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const documents = [
                ...(pdfFile ? [pdfFile] : []),
                ...images,
            ];

            const result = await submitApplicationByAdmin({
                ...formData,
                applicantType: formData.type as 'CITIZEN' | 'PUBLIC_REP',
                vidhansabhaId: parseInt(formData.vidhansabhaId),
                workTypeId: parseInt(formData.workTypeId),
                documents,
            });

            if (result.success) {
                setSuccess(true);
                toast.success(isHindi ? 'आवेदन सफलतापूर्वक जमा हुआ!' : 'Application Submitted Successfully!');
                setTimeout(() => {
                    router.push(`/${locale}/admin/applications`);
                }, 2000);
            } else {
                const errorMessage = result.error || 'Submission failed';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed');
            toast.error(err instanceof Error ? err.message : 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <Card className="max-w-2xl mx-auto shadow-lg border-0">
                <CardContent className="py-16 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {isHindi ? 'आवेदन सफलतापूर्वक जमा हुआ!' : 'Application Submitted Successfully!'}
                    </h2>
                    <p className="text-gray-500">
                        {isHindi ? 'आवेदन सूची पर रीडायरेक्ट कर रहा है...' : 'Redirecting to applications list...'}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-r-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <ApplicationFormFields
                locale={locale}
                formData={formData}
                vidhansabhas={vidhansabhas}
                workTypes={workTypes}
                onChange={handleInputChange}
            />

            <DocumentUploadSection
                locale={locale}
                pdfFile={pdfFile}
                images={images}
                uploading={uploading}
                onPdfUpload={handlePdfUpload}
                onImageUpload={handleImageUpload}
                onRemovePdf={removePdf}
                onRemoveImage={removeImage}
            />

            {/* Submit Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
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
                    className="h-12 px-8 bg-orange-600 hover:bg-orange-700"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            {isHindi ? 'जमा हो रहा है...' : 'Submitting...'}
                        </>
                    ) : (
                        isHindi ? 'आवेदन जमा करें' : 'Submit Application'
                    )}
                </Button>
            </div>
        </form>
    );
}
