'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, User, Briefcase, FileStack, Plus } from 'lucide-react';
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

            {/* Section 1: Applicant Details */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'आवेदक विवरण' : 'Applicant Details'}</CardTitle>
                            <CardDescription>{isHindi ? 'आवेदक की व्यक्तिगत जानकारी' : 'Personal information of the applicant'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'नाम' : 'Name'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                placeholder={isHindi ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'पिता का नाम' : "Father's Name"} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.fatherName}
                                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                required
                                placeholder={isHindi ? 'पिता का नाम दर्ज करें' : "Enter father's name"}
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                required
                                pattern="[0-9]{10}"
                                placeholder="9876543210"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'विधानसभा' : 'Vidhansabha'} <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.vidhansabhaId} onValueChange={(v) => handleInputChange('vidhansabhaId', v)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder={isHindi ? 'विधानसभा चुनें' : 'Select Vidhansabha'} />
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

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isHindi ? 'पता' : 'Address'} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            required
                            rows={3}
                            placeholder={isHindi ? 'पूरा पता दर्ज करें' : 'Enter complete address'}
                            className="resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Applicant Type */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'आवेदक प्रकार' : 'Applicant Type'}</CardTitle>
                            <CardDescription>{isHindi ? 'आवेदक की श्रेणी चुनें' : 'Select the category of applicant'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'CITIZEN'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                value="CITIZEN"
                                checked={formData.type === 'CITIZEN'}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className="w-5 h-5 text-orange-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{isHindi ? 'नागरिक' : 'Citizen'}</div>
                                <div className="text-sm text-gray-500">{isHindi ? 'सामान्य नागरिक' : 'General citizen'}</div>
                            </div>
                        </label>
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'PUBLIC_REP'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                value="PUBLIC_REP"
                                checked={formData.type === 'PUBLIC_REP'}
                                onChange={(e) => handleInputChange('type', e.target.value)}
                                className="w-5 h-5 text-orange-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{isHindi ? 'जनप्रतिनिधि' : 'Public Representative'}</div>
                                <div className="text-sm text-gray-500">{isHindi ? 'निर्वाचित प्रतिनिधि' : 'Elected representative'}</div>
                            </div>
                        </label>
                    </div>

                    {formData.type === 'PUBLIC_REP' && (
                        <div className="space-y-2 pt-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'पद / पदनाम' : 'Post / Designation'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.post}
                                onChange={(e) => handleInputChange('post', e.target.value)}
                                required
                                placeholder={isHindi ? 'जैसे: सरपंच, पार्षद, विधायक' : 'e.g., Sarpanch, Councilor, MLA'}
                                className="h-11"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section 3: Work Details */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'कार्य विवरण' : 'Work Details'}</CardTitle>
                            <CardDescription>{isHindi ? 'आवेदन का कार्य प्रकार और विवरण' : 'Type of work and description'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isHindi ? 'कार्य का प्रकार' : 'Type of Work'} <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.workTypeId} onValueChange={(v) => handleInputChange('workTypeId', v)}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder={isHindi ? 'कार्य प्रकार चुनें' : 'Select work type'} />
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

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isHindi ? 'विस्तृत विवरण' : 'Detailed Description'}
                        </Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={5}
                            placeholder={isHindi ? 'आवेदन का विस्तृत विवरण लिखें...' : 'Write a detailed description of the application...'}
                            className="resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Document Upload */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <FileStack className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'दस्तावेज़ अपलोड' : 'Document Upload'}</CardTitle>
                            <CardDescription>{isHindi ? 'संबंधित दस्तावेज़ और फोटो अपलोड करें' : 'Upload related documents and photos'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    {/* PDF Upload */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'PDF दस्तावेज़' : 'PDF Document'}
                            </Label>
                            <span className="text-xs text-gray-400">{isHindi ? 'अधिकतम 5MB' : 'Max 5MB'}</span>
                        </div>
                        {pdfFile ? (
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                                            {pdfFile.originalName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={removePdf} className="text-red-600 hover:text-red-700 hover:bg-red-100">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                onClick={() => pdfInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
                                    <Upload className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                    {isHindi ? 'PDF फ़ाइल अपलोड करें' : 'Upload PDF file'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {isHindi ? 'क्लिक करें या खींचकर छोड़ें' : 'Click or drag and drop'}
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'फोटो / चित्र' : 'Photos / Images'}
                            </Label>
                            <span className="text-xs text-gray-400">{isHindi ? 'प्रत्येक अधिकतम 2MB' : 'Max 2MB each'}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img
                                        src={img.url}
                                        alt={img.originalName}
                                        className="w-full h-full object-cover rounded-xl border border-gray-200"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-full"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-xl truncate text-center">
                                        {img.originalName}
                                    </p>
                                </div>
                            ))}

                            {/* Add Image Button */}
                            <div
                                onClick={() => imageInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
                            >
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-100 transition-colors">
                                    <Plus className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <span className="text-xs text-gray-500 group-hover:text-orange-600 transition-colors">
                                    {isHindi ? 'फोटो जोड़ें' : 'Add Photo'}
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

                    {/* Upload Status */}
                    {uploading && (
                        <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-xl">
                            <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                            <span className="text-sm font-medium text-orange-700">
                                {isHindi ? 'अपलोड हो रहा है...' : 'Uploading...'}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

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
