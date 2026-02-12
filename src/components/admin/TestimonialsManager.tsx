'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, Search, User, Eye, EyeOff, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import { Switch } from '@/components/ui/switch';
import 'new-react-transliterate/styles.css';

interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    messageHi: string;
    messageEn: string | null;
    imageUrl: string | null;
    isVisible: boolean;
}

interface TestimonialsManagerProps {
    locale: string;
}

export default function TestimonialsManager({ locale }: TestimonialsManagerProps) {
    const isHindi = locale === 'hi';
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({ isVisible: true });
    const [saving, setSaving] = useState(false);

    // Upload state
    const [uploading, setUploading] = useState(false);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/testimonials');
            if (!res.ok) throw new Error('Failed to fetch testimonials');
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'टेस्टिमोनियल्स लोड करने में विफल' : 'Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'tnsir_km/testimonials';
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

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
        const data = await uploadRes.json();
        return data.secure_url;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = currentTestimonial.id
                ? `/api/admin/testimonials/${currentTestimonial.id}`
                : '/api/admin/testimonials';

            const method = currentTestimonial.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTestimonial)
            });

            if (!res.ok) throw new Error('Failed to save testimonial');

            toast.success(isHindi ? 'टेस्टिमोनियल सहेजा गया' : 'Testimonial saved successfully');
            setIsDialogOpen(false);
            fetchTestimonials();
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'सहेजने में विफल' : 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(isHindi ? 'क्या आप सुनिश्चित हैं?' : 'Are you sure?')) return;

        try {
            const res = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete testimonial');

            toast.success(isHindi ? 'टेस्टिमोनियल हटाया गया' : 'Testimonial deleted successfully');
            fetchTestimonials();
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'हटाने में विफल' : 'Failed to delete');
        }
    };

    const openNewDialog = () => {
        setCurrentTestimonial({ isVisible: true });
        setIsDialogOpen(true);
    };

    const openEditDialog = (testimonial: Testimonial) => {
        setCurrentTestimonial(testimonial);
        setIsDialogOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setCurrentTestimonial(prev => ({ ...prev, imageUrl: url }));
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={isHindi ? 'टेस्टिमोनियल्स खोजें...' : 'Search testimonials...'}
                        className="pl-10"
                    />
                </div>
                <Button onClick={openNewDialog} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    {isHindi ? 'नया टेस्टिमोनियल' : 'Add Testimonial'}
                </Button>
            </div>

            <div className="dashboard-card border border-border/40">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>{isHindi ? 'फोटो' : 'Photo'}</TableHead>
                            <TableHead>{isHindi ? 'नाम' : 'Name'}</TableHead>
                            <TableHead className="max-w-[300px]">{isHindi ? 'संदेश' : 'Message'}</TableHead>
                            <TableHead>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
                            <TableHead className="text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : testimonials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    {isHindi ? 'कोई टेस्टिमोनियल नहीं मिला' : 'No testimonials found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            testimonials.map((t, index) => (
                                <TableRow key={t.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        {t.imageUrl ? (
                                            <img src={t.imageUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>{t.name}</div>
                                        {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
                                    </TableCell>
                                    <TableCell className="truncate max-w-[300px]">
                                        <div className="line-clamp-2 text-sm text-muted-foreground">
                                            {t.messageHi}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {t.isVisible ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium dark:bg-green-900/30 dark:text-green-400">
                                                <Eye className="w-3 h-3 mr-1" /> Visible
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium dark:bg-gray-800 dark:text-gray-400">
                                                <EyeOff className="w-3 h-3 mr-1" /> Hidden
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(t)}>
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isHindi ? (currentTestimonial.id ? 'टेस्टिमोनियल संपादित करें' : 'नया टेस्टिमोनियल') : (currentTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="flex gap-4 items-start">
                            <div className="space-y-2 flex-1">
                                <Label>{isHindi ? 'नाम' : 'Name'} <span className="text-red-500">*</span></Label>
                                <Input
                                    value={currentTestimonial.name || ''}
                                    onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Name..."
                                />
                            </div>
                            <div className="space-y-2 flex-1">
                                <Label>{isHindi ? 'भूमिका' : 'Role'}</Label>
                                <Input
                                    value={currentTestimonial.role || ''}
                                    onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, role: e.target.value }))}
                                    placeholder="e.g. Social Worker"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>{isHindi ? 'फोटो' : 'Photo'}</Label>
                            <div className="flex items-center gap-4">
                                {currentTestimonial.imageUrl ? (
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border group">
                                        <img src={currentTestimonial.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                                        <button
                                            onClick={() => setCurrentTestimonial(prev => ({ ...prev, imageUrl: null }))}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-dashed border-muted-foreground/30">
                                        <User className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="cursor-pointer"
                                    />
                                    {uploading && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Uploading...</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{isHindi ? 'संदेश (हिंदी)' : 'Message (Hindi)'} <span className="text-red-500">*</span></Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Textarea {...props} placeholder="संदेश..." className="min-h-[100px]" />
                                )}
                                value={currentTestimonial.messageHi || ''}
                                onChangeText={(text) => setCurrentTestimonial(prev => ({ ...prev, messageHi: text }))}
                                lang="hi"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{isHindi ? 'संदेश (अंग्रेजी)' : 'Message (English)'}</Label>
                            <Textarea
                                value={currentTestimonial.messageEn || ''}
                                onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, messageEn: e.target.value }))}
                                placeholder="Message..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label>{isHindi ? 'वेबसाइट पर दिखाएं' : 'Show on Website'}</Label>
                            <Switch
                                checked={currentTestimonial.isVisible || false}
                                onCheckedChange={(checked) => setCurrentTestimonial(prev => ({ ...prev, isVisible: checked }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
                        <Button onClick={handleSave} disabled={saving || uploading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isHindi ? 'सहेजें' : 'Save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
