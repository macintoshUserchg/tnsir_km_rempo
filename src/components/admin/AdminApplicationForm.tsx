'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitApplicationByAdmin } from '@/app/actions/application';

interface UploadedFile {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    type: 'PDF' | 'IMAGE';
}

interface AdminApplicationFormProps {
    locale: string;
    vidhansabhas: { id: number; nameHi: string; nameEn: string | null }[];
    workTypes: { id: number; nameHi: string; nameEn: string | null }[];
}

export default function AdminApplicationForm({ locale, vidhansabhas, workTypes }: AdminApplicationFormProps) {
    const router = useRouter();
    const isHindi = locale === 'hi';
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Upload failed');
        }

        const data = await res.json();
        return data.file;
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const uploaded = await uploadFile(file, 'pdf');
            if (uploaded) setPdfFile(uploaded);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'PDF upload failed');
        } finally {
            setUploading(false);
            if (pdfInputRef.current) pdfInputRef.current.value = '';
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const uploaded = await uploadFile(file, 'image');
            if (uploaded) setImages(prev => [...prev, uploaded]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Image upload failed');
        } finally {
            setUploading(false);
            if (imageInputRef.current) imageInputRef.current.value = '';
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
                vidhansabhaId: parseInt(formData.vidhansabhaId),
                workTypeId: parseInt(formData.workTypeId),
                documents,
            });

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/${locale}/admin/applications`);
                }, 2000);
            } else {
                setError(result.error || 'Submission failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-12 pb-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-700 mb-2">
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Applicant Details */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'आवेदक विवरण' : 'Applicant Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label>{isHindi ? 'नाम *' : 'Name *'}</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                placeholder={isHindi ? 'पूरा नाम' : 'Full name'}
                            />
                        </div>
                        <div>
                            <Label>{isHindi ? 'पिता का नाम *' : 'Father\'s Name *'}</Label>
                            <Input
                                value={formData.fatherName}
                                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                required
                                placeholder={isHindi ? 'पिता का नाम' : 'Father\'s name'}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Label>{isHindi ? 'मोबाइल नंबर *' : 'Mobile Number *'}</Label>
                            <Input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                required
                                pattern="[0-9]{10}"
                                placeholder="9876543210"
                            />
                        </div>
                        <div>
                            <Label>{isHindi ? 'विधानसभा *' : 'Vidhansabha *'}</Label>
                            <Select value={formData.vidhansabhaId} onValueChange={(v) => handleInputChange('vidhansabhaId', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isHindi ? 'चुनें' : 'Select'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {vidhansabhas.map((v) => (
                                        <SelectItem key={v.id} value={v.id.toString()}>
                                            {isHindi ? v.nameHi : (v.nameEn || v.nameHi)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label>{isHindi ? 'पता *' : 'Address *'}</Label>
                        <Textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            required
                            rows={2}
                            placeholder={isHindi ? 'पूरा पता' : 'Full address'}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Application Type */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'आवेदक प्रकार' : 'Applicant Type'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="CITIZEN"
                                checked={formData.type === 'CITIZEN'}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className="w-4 h-4 text-orange-600"
                            />
                            {isHindi ? 'नागरिक' : 'Citizen'}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="PUBLIC_REP"
                                checked={formData.type === 'PUBLIC_REP'}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className="w-4 h-4 text-orange-600"
                            />
                            {isHindi ? 'जनप्रतिनिधि' : 'Public Representative'}
                        </label>
                    </div>

                    {formData.type === 'PUBLIC_REP' && (
                        <div>
                            <Label>{isHindi ? 'पद *' : 'Post/Designation *'}</Label>
                            <Input
                                value={formData.post}
                                onChange={(e) => handleInputChange('post', e.target.value)}
                                required
                                placeholder={isHindi ? 'पद का नाम' : 'Designation'}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Work Details */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'कार्य विवरण' : 'Work Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>{isHindi ? 'कार्य का प्रकार *' : 'Type of Work *'}</Label>
                        <Select value={formData.workTypeId} onValueChange={(v) => handleInputChange('workTypeId', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={isHindi ? 'चुनें' : 'Select'} />
                            </SelectTrigger>
                            <SelectContent>
                                {workTypes.map((w) => (
                                    <SelectItem key={w.id} value={w.id.toString()}>
                                        {isHindi ? w.nameHi : (w.nameEn || w.nameHi)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>{isHindi ? 'विवरण' : 'Description'}</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            placeholder={isHindi ? 'आवेदन का विस्तृत विवरण' : 'Detailed description of the application'}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* File Uploads */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'दस्तावेज़ अपलोड' : 'Document Upload'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* PDF Upload */}
                    <div>
                        <Label className="mb-2 block">
                            {isHindi ? 'PDF दस्तावेज़ (अधिकतम 5MB)' : 'PDF Document (max 5MB)'}
                        </Label>
                        {pdfFile ? (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-red-500" />
                                    <span className="text-sm truncate max-w-xs">{pdfFile.originalName}</span>
                                    <span className="text-xs text-gray-400">({(pdfFile.size / 1024 / 1024).toFixed(2)}MB)</span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={removePdf}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                onClick={() => pdfInputRef.current?.click()}
                                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
                            >
                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">
                                    {isHindi ? 'PDF अपलोड करने के लिए क्लिक करें' : 'Click to upload PDF'}
                                </p>
                            </div>
                        )}
                        <input
                            ref={pdfInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Image Uploads */}
                    <div>
                        <Label className="mb-2 block">
                            {isHindi ? 'फोटो/चित्र (प्रत्येक अधिकतम 2MB)' : 'Images/Photos (max 2MB each)'}
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img.url}
                                        alt={img.originalName}
                                        className="w-full h-24 object-cover rounded-lg border"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}

                            {/* Add Image Button */}
                            <div
                                onClick={() => imageInputRef.current?.click()}
                                className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
                            >
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">
                                    {isHindi ? '+ जोड़ें' : '+ Add'}
                                </span>
                            </div>
                        </div>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {uploading && (
                        <div className="flex items-center gap-2 text-orange-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {isHindi ? 'अपलोड हो रहा है...' : 'Uploading...'}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                    type="submit"
                    disabled={submitting || uploading}
                    className="bg-orange-600 hover:bg-orange-700"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
