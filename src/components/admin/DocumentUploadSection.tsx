'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, X, FileText, Image as ImageIcon, FileStack, Plus, Loader2 } from 'lucide-react';

export interface UploadedFile {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    type: 'PDF' | 'IMAGE';
}

interface DocumentUploadSectionProps {
    locale: string;
    pdfFile: UploadedFile | null;
    images: UploadedFile[];
    uploading: boolean;
    onPdfUpload: (file: File) => Promise<void>;
    onImageUpload: (file: File) => Promise<void>;
    onRemovePdf: () => void;
    onRemoveImage: (index: number) => void;
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
    locale,
    pdfFile,
    images,
    uploading,
    onPdfUpload,
    onImageUpload,
    onRemovePdf,
    onRemoveImage,
}) => {
    const isHindi = locale === 'hi';
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'pdf') {
            await onPdfUpload(file);
        } else {
            await onImageUpload(file);
        }

        if (e.target) e.target.value = '';
    };

    return (
        <Card className="dashboard-card border-0">
            <CardHeader className="pb-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FileStack className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <CardTitle className="dashboard-section">{isHindi ? 'दस्तावेज़ अपलोड' : 'Document Upload'}</CardTitle>
                        <CardDescription className="dashboard-label">{isHindi ? 'संबंधित दस्तावेज़ और फोटो अपलोड करें' : 'Upload related documents and photos'}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* PDF Upload */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="dashboard-label">
                            {isHindi ? 'PDF दस्तावेज़' : 'PDF Document'}
                        </Label>
                        <span className="dashboard-label text-[10px]">{isHindi ? 'अधिकतम 5MB' : 'Max 5MB'}</span>
                    </div>
                    {pdfFile ? (
                        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="dashboard-section text-sm truncate max-w-[200px] sm:max-w-xs">
                                        {pdfFile.originalName}
                                    </p>
                                    <p className="dashboard-label">
                                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={onRemovePdf} className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/40">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            onClick={() => pdfInputRef.current?.click()}
                            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/10 transition-all group"
                        >
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                            </div>
                            <p className="dashboard-section text-sm">
                                {isHindi ? 'PDF फ़ाइल अपलोड करें' : 'Upload PDF file'}
                            </p>
                            <p className="dashboard-label mt-1">
                                {isHindi ? 'क्लिक करें या खींचकर छोड़ें' : 'Click or drag and drop'}
                            </p>
                        </div>
                    )}
                    <input
                        ref={pdfInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'pdf')}
                        className="hidden"
                    />
                </div>

                {/* Image Uploads */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="dashboard-label">
                            {isHindi ? 'फोटो / चित्र' : 'Photos / Images'}
                        </Label>
                        <span className="dashboard-label text-[10px]">{isHindi ? 'प्रत्येक अधिकतम 2MB' : 'Max 2MB each'}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img
                                    src={img.url}
                                    alt={img.originalName}
                                    className="w-full h-full object-cover rounded-xl border border-border"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full"
                                        onClick={() => onRemoveImage(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1.5 rounded-b-xl truncate text-center">
                                    {img.originalName}
                                </p>
                            </div>
                        ))}

                        {/* Add Image Button */}
                        <div
                            onClick={() => imageInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/10 transition-all group"
                        >
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                            </div>
                            <span className="text-xs text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                {isHindi ? 'फोटो जोड़ें' : 'Add Photo'}
                            </span>
                        </div>
                    </div>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="hidden"
                    />
                </div>

                {/* Upload Status */}
                {uploading && (
                    <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                        <Loader2 className="h-5 w-5 animate-spin text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                            {isHindi ? 'अपलोड हो रहा है...' : 'Uploading...'}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
