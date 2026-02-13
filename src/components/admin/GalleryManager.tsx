'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, Search, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import { Link } from '@/i18n/navigation';
import 'new-react-transliterate/styles.css';

interface Album {
    id: number;
    titleHi: string;
    titleEn: string | null;
    description: string | null;
    coverImage: string | null;
    _count: { photos: number };
}

interface GalleryManagerProps {
    locale: string;
}

export default function GalleryManager({ locale }: GalleryManagerProps) {
    const isHindi = locale === 'hi';
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAlbum, setCurrentAlbum] = useState<Partial<Album>>({});
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    // -- Cloudinary Upload Logic --
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'tnsir_km/gallery';
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

    const handleCoverUpload = async (file: File) => {
        setUploadingCover(true);
        try {
            const url = await uploadToCloudinary(file);
            setCurrentAlbum(prev => ({ ...prev, coverImage: url }));
            toast.success(isHindi ? 'कवर इमेज अपलोड की गई' : 'Cover image uploaded');
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'कवर अपलोड विफल' : 'Cover upload failed');
        } finally {
            setUploadingCover(false);
        }
    };

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/media/albums');
            if (!res.ok) throw new Error('Failed to fetch albums');
            const data = await res.json();
            setAlbums(data);
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'एल्बम लोड करने में विफल' : 'Failed to load albums');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = currentAlbum.id
                ? `/api/admin/media/albums/${currentAlbum.id}`
                : '/api/admin/media/albums';

            const method = currentAlbum.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentAlbum)
            });

            if (!res.ok) throw new Error('Failed to save album');

            toast.success(isHindi ? 'एल्बम सहेजा गया' : 'Album saved successfully');
            setIsDialogOpen(false);
            fetchAlbums();
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'सहेजने में विफल' : 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(isHindi ? 'क्या आप सुनिश्चित हैं? सभी तस्वीरें भी हटा दी जाएंगी।' : 'Are you sure? All photos within will be deleted.')) return;

        try {
            const res = await fetch(`/api/admin/media/albums/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete album');

            toast.success(isHindi ? 'एल्बम हटाया गया' : 'Album deleted successfully');
            fetchAlbums();
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'हटाने में विफल' : 'Failed to delete');
        }
    };

    const openNewDialog = () => {
        setCurrentAlbum({});
        setIsDialogOpen(true);
    };

    const openEditDialog = (e: React.MouseEvent, album: Album) => {
        e.preventDefault(); // Prevent navigation
        setCurrentAlbum(album);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={isHindi ? 'एल्बम खोजें...' : 'Search albums...'}
                        className="pl-10"
                    />
                </div>
                <Button onClick={openNewDialog} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    {isHindi ? 'नया एल्बम' : 'Create New Album'}
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </div>
            ) : albums.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-muted/20">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">{isHindi ? 'कोई एल्बम नहीं मिला' : 'No albums found'}</p>
                    <Button variant="link" onClick={openNewDialog} className="mt-2 text-orange-600">
                        {isHindi ? 'पहला एल्बम बनाएं' : 'Create your first album'}
                    </Button>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => (
                        <Link href={`/admin/media/albums/${album.id}`} key={album.id}>
                            <Card className="group hover:border-orange-500/50 transition-all cursor-pointer h-full border-border/40 overflow-hidden">
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {album.coverImage ? (
                                        <img src={album.coverImage} alt={album.titleHi} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-muted/50 text-muted-foreground">
                                            <ImageIcon className="h-10 w-10 opacity-30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30">
                                            {album._count.photos} Photos
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="line-clamp-1 text-lg">{album.titleHi}</CardTitle>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {album.description || (isHindi ? 'कोई विवरण नहीं' : 'No description')}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-2 flex justify-end gap-2 border-t border-border/30 bg-muted/10 p-3">
                                    <Button variant="ghost" size="sm" onClick={(e) => openEditDialog(e, album)} className="hover:text-blue-600">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); handleDelete(album.id); }} className="hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isHindi ? (currentAlbum.id ? 'एल्बम संपादित करें' : 'नया एल्बम जोड़ें') : (currentAlbum.id ? 'Edit Album' : 'Create New Album')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (हिंदी)' : 'Title (Hindi)'} <span className="text-red-500">*</span></Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input {...props} placeholder="एल्बम का नाम..." />
                                )}
                                value={currentAlbum.titleHi || ''}
                                onChangeText={(text) => setCurrentAlbum(prev => ({ ...prev, titleHi: text }))}
                                lang="hi"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (अंग्रेजी)' : 'Title (English)'}</Label>
                            <Input
                                value={currentAlbum.titleEn || ''}
                                onChange={(e) => setCurrentAlbum(prev => ({ ...prev, titleEn: e.target.value }))}
                                placeholder="Album Title..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'विवरण' : 'Description'}</Label>
                            <Input
                                value={currentAlbum.description || ''}
                                onChange={(e) => setCurrentAlbum(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Details about this album..."
                            />
                        </div>
                        {/* Cover Image Upload */}
                        <div className="space-y-3">
                            <Label>{isHindi ? 'कवर छवि' : 'Cover Image'}</Label>

                            {currentAlbum.coverImage && (
                                <div className="relative aspect-video w-full max-h-40 bg-muted rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={currentAlbum.coverImage}
                                        alt="Cover Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-7 w-7"
                                        onClick={() => setCurrentAlbum(prev => ({ ...prev, coverImage: null }))}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="cover-upload"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleCoverUpload(file);
                                    }}
                                    disabled={uploadingCover}
                                />
                                <Label
                                    htmlFor="cover-upload"
                                    className="flex-1 border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    {uploadingCover ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    ) : (
                                        <>
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                                {isHindi ? 'अपलोड करने के लिए क्लिक करें' : 'Click to upload cover'}
                                            </span>
                                        </>
                                    )}
                                </Label>
                                <div className="flex-1 space-y-2">
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold px-1">
                                        {isHindi ? 'या URL डालें' : 'OR PASTE URL'}
                                    </p>
                                    <Input
                                        value={currentAlbum.coverImage || ''}
                                        onChange={(e) => setCurrentAlbum(prev => ({ ...prev, coverImage: e.target.value }))}
                                        placeholder="https://..."
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (isHindi ? 'सहेजें' : 'Save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
