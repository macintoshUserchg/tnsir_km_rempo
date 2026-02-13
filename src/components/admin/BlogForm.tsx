'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, X, Plus, Image as ImageIcon, Video, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import 'new-react-transliterate/styles.css';
import RichTextEditor from './RichTextEditor';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface Attachment {
    id?: number;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'PDF';
    titleHi?: string;
    titleEn?: string;
}

interface BlogData {
    id?: number;
    titleHi: string;
    titleEn: string;
    slug: string;
    excerptHi: string;
    excerptEn: string;
    contentHi: string;
    contentEn: string;
    imageUrl: string;
    published: boolean;
    attachments: Attachment[];
}

interface BlogFormProps {
    initialData?: BlogData;
    locale: string;
}

export default function BlogForm({ initialData, locale }: BlogFormProps) {
    const isHindi = locale === 'hi';
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [data, setData] = useState<BlogData>(initialData || {
        titleHi: '',
        titleEn: '',
        slug: '',
        excerptHi: '',
        excerptEn: '',
        contentHi: '',
        contentEn: '',
        imageUrl: '',
        published: false,
        attachments: [],
    });

    // Auto-generate slug from English title
    useEffect(() => {
        if (!initialData && data.titleEn) {
            const slug = data.titleEn
                .toLowerCase()
                .replace(/[^a-z0-0\s]/g, '')
                .replace(/\s+/g, '-');
            setData(prev => ({ ...prev, slug }));
        }
    }, [data.titleEn, initialData]);

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'tnsir_km/blogs';
        const upload_preset = 'km_app';

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

        // Determine resource type
        let resourceType = 'auto';
        if (file.type.startsWith('image/')) resourceType = 'image';
        else if (file.type.startsWith('video/')) resourceType = 'video';
        else if (file.type === 'application/pdf') resourceType = 'raw';

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType === 'video' ? 'video' : resourceType === 'image' ? 'image' : 'raw'}/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.error?.message || 'Cloudinary upload failed');
        }
        const resData = await uploadRes.json();
        return resData.secure_url;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'attachment') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(target);
        try {
            const url = await uploadToCloudinary(file);
            if (target === 'main') {
                setData(prev => ({ ...prev, imageUrl: url }));
            } else {
                let type: 'IMAGE' | 'VIDEO' | 'PDF' = 'IMAGE';
                if (file.type.startsWith('video/')) type = 'VIDEO';
                else if (file.type === 'application/pdf') type = 'PDF';

                setData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, { url, type }]
                }));
            }
            toast.success(isHindi ? 'अपलोड सफल' : 'Upload successful');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Upload failed');
        } finally {
            setUploading(null);
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!data.titleHi || !data.slug || !data.contentHi) {
            toast.error(isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const url = data.id ? `/api/admin/blogs/${data.id}` : '/api/admin/blogs';
            const method = data.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to save blog');
            }

            toast.success(isHindi ? 'ब्लॉग सहेजा गया' : 'Blog saved successfully');
            router.push('/admin/blogs');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to save blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="dashboard-title">
                        {isHindi ? (data.id ? 'ब्लॉग संपादित करें' : 'नया ब्लॉग') : (data.id ? 'Edit Blog Post' : 'New Blog Post')}
                    </h1>
                    <p className="dashboard-label">
                        {isHindi ? 'लिखें, विज़ुअल्स जोड़ें और प्रकाशित करें' : 'Write, add visuals, and publish your thoughts.'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => router.push('/admin/blogs')} disabled={loading}>
                        {isHindi ? 'रद्द करें' : 'Cancel'}
                    </Button>
                    <Button onClick={handleSave} disabled={loading || !!uploading} className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isHindi ? 'सहेजें' : 'Save Post'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Areas */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="dashboard-card border border-border/40">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>{isHindi ? 'शीर्षक (हिंदी)' : 'Title (Hindi)'} <span className="text-red-500">*</span></Label>
                                    <NewReactTransliterate
                                        renderComponent={(props) => <Input {...props} className="h-12 text-lg font-bold" placeholder="शीर्षक यहाँ लिखें..." />}
                                        value={data.titleHi}
                                        onChangeText={(text) => setData(prev => ({ ...prev, titleHi: text }))}
                                        lang="hi"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{isHindi ? 'शीर्षक (अंग्रेजी)' : 'Title (English)'}</Label>
                                    <Input
                                        value={data.titleEn}
                                        onChange={(e) => setData(prev => ({ ...prev, titleEn: e.target.value }))}
                                        placeholder="Enter English title..."
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>{isHindi ? 'स्लग (URL)' : 'Slug (URL ID)'} <span className="text-red-500">*</span></Label>
                                <Input
                                    value={data.slug}
                                    onChange={(e) => setData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                    placeholder="post-slug-style"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-bold">{isHindi ? 'ब्लॉग सामग्री (हिंदी)' : 'Blog Content (Hindi)'} <span className="text-red-500">*</span></Label>
                                <RichTextEditor
                                    value={data.contentHi}
                                    onChange={(val) => setData(prev => ({ ...prev, contentHi: val }))}
                                    placeholder="अपनी कहानी यहाँ लिखें..."
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-bold">{isHindi ? 'ब्लॉग सामग्री (अंग्रेजी)' : 'Blog Content (English)'}</Label>
                                <RichTextEditor
                                    value={data.contentEn}
                                    onChange={(val) => setData(prev => ({ ...prev, contentEn: val }))}
                                    placeholder="Write your story in English here..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dashboard-card border border-border/40">
                        <CardContent className="p-6 space-y-4">
                            <Label className="text-lg font-bold">{isHindi ? 'संक्षिप्त विवरण (Excerpts)' : 'Short Excerpts'}</Label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>{isHindi ? 'विवरण (हिंदी)' : 'Excerpt (Hindi)'}</Label>
                                    <NewReactTransliterate
                                        renderComponent={(props) => <Input {...props} placeholder="कार्ड के लिए छोटा विवरण..." />}
                                        value={data.excerptHi}
                                        onChangeText={(text) => setData(prev => ({ ...prev, excerptHi: text }))}
                                        lang="hi"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{isHindi ? 'विवरण (अंग्रेजी)' : 'Excerpt (English)'}</Label>
                                    <Input
                                        value={data.excerptEn}
                                        onChange={(e) => setData(prev => ({ ...prev, excerptEn: e.target.value }))}
                                        placeholder="Short description for card..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Areas */}
                <div className="space-y-6">
                    <Card className="dashboard-card border border-border/40">
                        <CardContent className="p-6 space-y-4">
                            <Label className="font-bold">{isHindi ? 'मुख्य चित्र (Featured Image)' : 'Featured Image'}</Label>
                            <div className="relative aspect-video rounded-xl bg-muted overflow-hidden border border-dashed border-border flex items-center justify-center group">
                                {data.imageUrl ? (
                                    <>
                                        <img src={data.imageUrl} alt="Featured" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => (document.getElementById('main-image-input') as HTMLInputElement).click()}>
                                                Change
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => setData(prev => ({ ...prev, imageUrl: '' }))}>
                                                Remove
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-xs text-muted-foreground">Click to upload main image</p>
                                        <Button variant="ghost" size="sm" onClick={() => (document.getElementById('main-image-input') as HTMLInputElement).click()} className="mt-2 text-orange-600">
                                            {uploading === 'main' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Image'}
                                        </Button>
                                    </div>
                                )}
                                <input
                                    id="main-image-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, 'main')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dashboard-card border border-border/40">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold">{isHindi ? 'प्रकाशित करें' : 'Status'}</Label>
                                <Switch
                                    checked={data.published}
                                    onCheckedChange={(checked) => setData(prev => ({ ...prev, published: checked }))}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {data.published
                                    ? (isHindi ? 'यह सार्वजनिक रूप से दिखाई देगा' : 'This post will be visible to everyone')
                                    : (isHindi ? 'इसे ड्राफ्ट के रूप में सहेजें' : 'Save this post as a draft')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="dashboard-card border border-border/40">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold">{isHindi ? 'संलग्नक (Attachments)' : 'Attachments'}</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1"
                                    onClick={() => (document.getElementById('attachment-input') as HTMLInputElement).click()}
                                    disabled={!!uploading}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add
                                </Button>
                            </div>
                            <input
                                id="attachment-input"
                                type="file"
                                accept="image/*,video/*,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'attachment')}
                            />

                            <div className="space-y-3">
                                {data.attachments.length === 0 ? (
                                    <p className="text-xs text-center text-muted-foreground py-4 border border-dashed rounded-lg">
                                        {isHindi ? 'कोई संलग्नक नहीं' : 'No attachments yet'}
                                    </p>
                                ) : (
                                    data.attachments.map((at, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-border/40 group">
                                            <div className="w-8 h-8 rounded bg-white dark:bg-zinc-800 flex items-center justify-center border border-border/40">
                                                {at.type === 'IMAGE' && <ImageIcon className="w-4 h-4 text-emerald-600" />}
                                                {at.type === 'VIDEO' && <Video className="w-4 h-4 text-blue-600" />}
                                                {at.type === 'PDF' && <FileText className="w-4 h-4 text-red-600" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-muted-foreground truncate">{at.url.split('/').pop()}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-600" onClick={() => removeAttachment(idx)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
