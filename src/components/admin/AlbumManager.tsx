'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Plus, Edit, Trash2, Image as ImageIcon, Save, ArrowLeft, Upload, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import 'new-react-transliterate/styles.css';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Photo {
    id: number;
    imageUrl: string;
    captionHi: string | null;
    captionEn: string | null;
}

interface Album {
    id: number;
    titleHi: string;
    titleEn: string | null;
    description: string | null;
    coverImage: string | null;
    photos: Photo[];
}

interface AlbumManagerProps {
    album: Album;
    locale: string;
}

export default function AlbumManager({ album, locale }: AlbumManagerProps) {
    const router = useRouter();
    const isHindi = locale === 'hi';
    const [currentAlbum, setCurrentAlbum] = useState(album);
    const [photos, setPhotos] = useState<Photo[]>(album.photos);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isEditPhotoDialogOpen, setIsEditPhotoDialogOpen] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState<Partial<Photo>>({});

    // Upload State
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

    // Edit Album State
    const [isEditAlbumDialogOpen, setIsEditAlbumDialogOpen] = useState(false);
    const [albumFormData, setAlbumFormData] = useState<Partial<Album>>({
        titleHi: album.titleHi,
        titleEn: album.titleEn,
        description: album.description,
        coverImage: album.coverImage
    });
    const [savingAlbum, setSavingAlbum] = useState(false);

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

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        setUploadProgress({ current: 0, total: selectedFiles.length });

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            setUploadProgress(prev => ({ ...prev, current: i + 1 }));

            try {
                const imageUrl = await uploadToCloudinary(file);

                // Save to DB
                const res = await fetch('/api/admin/media/photos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        albumId: currentAlbum.id,
                        imageUrl,
                        captionHi: i === 0 ? currentPhoto.captionHi : '', // Only apply caption to first if multiple
                        captionEn: i === 0 ? currentPhoto.captionEn : ''
                    })
                });

                if (!res.ok) throw new Error('Failed to save photo');
                const newPhoto = await res.json();

                setPhotos(prev => [newPhoto, ...prev]);
                successCount++;
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                failCount++;
            }
        }

        if (successCount > 0) {
            toast.success(isHindi
                ? `${successCount} फोटो सफलतापूर्वक अपलोड की गईं`
                : `${successCount} photos uploaded successfully`
            );
        }

        if (failCount > 0) {
            toast.error(isHindi
                ? `${failCount} फोटो अपलोड करने में विफल`
                : `${failCount} photos failed to upload`
            );
        }

        setIsUploadDialogOpen(false);
        setSelectedFiles([]);
        setCurrentPhoto({});
        setUploading(false);
    };

    const handleSavePhoto = async () => {
        if (!currentPhoto.id) return;
        setUploading(true);
        try {
            const res = await fetch(`/api/admin/media/photos/${currentPhoto.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    captionHi: currentPhoto.captionHi,
                    captionEn: currentPhoto.captionEn
                })
            });

            if (!res.ok) throw new Error('Failed to update photo');
            const updatedPhoto = await res.json();

            setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
            toast.success(isHindi ? 'कैप्शन अपडेट किया गया' : 'Caption updated');
            setIsEditPhotoDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'अपडेट विफल' : 'Update failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (id: number) => {
        if (!confirm(isHindi ? 'क्या आप सुनिश्चित हैं?' : 'Are you sure?')) return;
        try {
            const res = await fetch(`/api/admin/media/photos/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete photo');

            setPhotos(prev => prev.filter(p => p.id !== id));
            toast.success(isHindi ? 'फोटो हटाई गई' : 'Photo deleted');
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'हटाने में विफल' : 'Failed to delete');
        }
    };

    const handleUpdateAlbum = async () => {
        setSavingAlbum(true);
        try {
            const res = await fetch(`/api/admin/media/albums/${currentAlbum.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(albumFormData)
            });

            if (!res.ok) throw new Error('Failed to update album');
            const updatedAlbum = await res.json();

            setCurrentAlbum(prev => ({ ...prev, ...updatedAlbum }));
            toast.success(isHindi ? 'एल्बम अपडेट किया गया' : 'Album updated');
            setIsEditAlbumDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'अपडेट विफल' : 'Update failed');
        } finally {
            setSavingAlbum(false);
        }
    };

    const setCoverImage = async (url: string) => {
        setSavingAlbum(true);
        try {
            const res = await fetch(`/api/admin/media/albums/${currentAlbum.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ coverImage: url })
            });
            if (!res.ok) throw new Error('Failed to set cover');

            setCurrentAlbum(prev => ({ ...prev, coverImage: url }));
            setAlbumFormData(prev => ({ ...prev, coverImage: url }));
            toast.success(isHindi ? 'कवर छवि सेट की गई' : 'Cover image set');
        } catch (error) {
            console.error(error);
            toast.error('Failed');
        } finally {
            setSavingAlbum(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold font-hindi">{currentAlbum.titleHi}</h1>
                        {currentAlbum.titleEn && <p className="text-muted-foreground">{currentAlbum.titleEn}</p>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditAlbumDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {isHindi ? 'संपादित करें' : 'Edit Details'}
                    </Button>
                    <Button onClick={() => { setCurrentPhoto({}); setSelectedFiles([]); setIsUploadDialogOpen(true); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Upload className="mr-2 h-4 w-4" />
                        {isHindi ? 'फोटो जोड़ें' : 'Add Photos'}
                    </Button>
                </div>
            </div>

            {/* Description & Stats */}
            <div className="grid sm:grid-cols-3 gap-6">
                <Card className="sm:col-span-2 bg-muted/20 border-border/50 shadow-none">
                    <CardContent className="p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            {isHindi ? 'विवरण' : 'Description'}
                        </h3>
                        {currentAlbum.description ? (
                            <p className="text-foreground">{currentAlbum.description}</p>
                        ) : (
                            <p className="text-muted-foreground italic">{isHindi ? 'कोई विवरण नहीं' : 'No description'}</p>
                        )}
                    </CardContent>
                </Card>
                <Card className="bg-muted/20 border-border/50 shadow-none">
                    <CardContent className="p-4 flex items-center gap-4">
                        {currentAlbum.coverImage ? (
                            <img src={currentAlbum.coverImage} alt="Cover" className="h-16 w-16 rounded object-cover border border-border" />
                        ) : (
                            <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">
                                {isHindi ? 'कुल तस्वीरें' : 'Total Photos'}
                            </h3>
                            <p className="text-2xl font-bold">{photos.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                        <img
                            src={photo.imageUrl}
                            alt={photo.captionHi || 'Gallery Photo'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-white text-xs truncate">{photo.captionHi || (isHindi ? 'कोई कैप्शन नहीं' : 'No caption')}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/20">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => { setCurrentPhoto(photo); setIsEditPhotoDialogOpen(true); }}>
                                        <Edit className="mr-2 h-4 w-4" /> {isHindi ? 'संपादित करें' : 'Edit Caption'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCoverImage(photo.imageUrl)}>
                                        <ImageIcon className="mr-2 h-4 w-4" /> {isHindi ? 'कवर बनाएं' : 'Make Cover'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeletePhoto(photo.id)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> {isHindi ? 'हटाएं' : 'Delete'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isHindi ? 'फोटो अपलोड करें' : 'Upload Photo'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{isHindi ? 'फाइलें चुनें' : 'Select Files'} <span className="text-red-500">*</span></Label>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                            />
                            {selectedFiles.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {selectedFiles.length} {isHindi ? 'फाइलें चुनी गईं' : 'files selected'}
                                </p>
                            )}
                        </div>
                        {uploading && selectedFiles.length > 1 && (
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-600 transition-all duration-300"
                                        style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                    {isHindi ? 'अपलोड हो रहा है' : 'Uploading'} {uploadProgress.current} / {uploadProgress.total}
                                </p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>{isHindi ? 'कैप्शन (हिंदी)' : 'Caption (Hindi)'}</Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input {...props} placeholder="फोटो का विवरण..." />
                                )}
                                value={currentPhoto.captionHi || ''}
                                onChangeText={(text) => setCurrentPhoto(prev => ({ ...prev, captionHi: text }))}
                                lang="hi"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'कैप्शन (अंग्रेजी)' : 'Caption (English)'}</Label>
                            <Input
                                value={currentPhoto.captionEn || ''}
                                onChange={(e) => setCurrentPhoto(prev => ({ ...prev, captionEn: e.target.value }))}
                                placeholder="Photo caption..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={uploading}>{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
                        <Button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {uploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    {selectedFiles.length > 1 ? `${uploadProgress.current}/${uploadProgress.total}` : (isHindi ? 'अपलोड हो रहा है...' : 'Uploading...')}
                                </>
                            ) : (isHindi ? 'अपलोड करें' : 'Upload')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Photo Dialog */}
            <Dialog open={isEditPhotoDialogOpen} onOpenChange={setIsEditPhotoDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isHindi ? 'कैप्शन संपादित करें' : 'Edit Caption'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center mb-4">
                            <img src={currentPhoto.imageUrl} alt="Preview" className="h-32 object-contain rounded" />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'कैप्शन (हिंदी)' : 'Caption (Hindi)'}</Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input {...props} placeholder="फोटो का विवरण..." />
                                )}
                                value={currentPhoto.captionHi || ''}
                                onChangeText={(text) => setCurrentPhoto(prev => ({ ...prev, captionHi: text }))}
                                lang="hi"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'कैप्शन (अंग्रेजी)' : 'Caption (English)'}</Label>
                            <Input
                                value={currentPhoto.captionEn || ''}
                                onChange={(e) => setCurrentPhoto(prev => ({ ...prev, captionEn: e.target.value }))}
                                placeholder="Photo caption..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditPhotoDialogOpen(false)}>{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
                        <Button onClick={handleSavePhoto} disabled={uploading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isHindi ? 'सहेजें' : 'Save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Album Dialog */}
            <Dialog open={isEditAlbumDialogOpen} onOpenChange={setIsEditAlbumDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isHindi ? 'एल्बम विवरण संपादित करें' : 'Edit Album Details'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (हिंदी)' : 'Title (Hindi)'} <span className="text-red-500">*</span></Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input {...props} placeholder="एल्बम का नाम..." />
                                )}
                                value={albumFormData.titleHi || ''}
                                onChangeText={(text) => setAlbumFormData(prev => ({ ...prev, titleHi: text }))}
                                lang="hi"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (अंग्रेजी)' : 'Title (English)'}</Label>
                            <Input
                                value={albumFormData.titleEn || ''}
                                onChange={(e) => setAlbumFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{isHindi ? 'विवरण' : 'Description'}</Label>
                            <Input
                                value={albumFormData.description || ''}
                                onChange={(e) => setAlbumFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditAlbumDialogOpen(false)}>{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
                        <Button onClick={handleUpdateAlbum} disabled={savingAlbum} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {savingAlbum ? <Loader2 className="h-4 w-4 animate-spin" /> : (isHindi ? 'सहेजें' : 'Save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
