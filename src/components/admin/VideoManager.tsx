'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, Search, Video, ExternalLink, Star } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import { Switch } from '@/components/ui/switch';
import 'new-react-transliterate/styles.css';

interface VideoData {
    id: number;
    titleHi: string;
    titleEn: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    isFeatured: boolean;
    order: number;
}

interface VideoManagerProps {
    locale: string;
}

export default function VideoManager({ locale }: VideoManagerProps) {
    const isHindi = locale === 'hi';
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<Partial<VideoData>>({ isFeatured: false, order: 0 });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/videos');
            if (!res.ok) throw new Error('Failed to fetch videos');
            const data = await res.json();
            setVideos(data);
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'वीडियो लोड करने में विफल' : 'Failed to load videos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const uploadVideoToCloudinary = async (file: File): Promise<string> => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'tnsir_km/videos';
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

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.error?.message || 'Cloudinary upload failed');
        }
        const data = await uploadRes.json();
        return data.secure_url;
    };

    const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 50MB Limit
        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error(isHindi ? 'फाइल 50MB से ज्यादा नहीं होनी चाहिए' : 'File size must be less than 50MB');
            e.target.value = '';
            return;
        }

        setUploading(true);
        try {
            const url = await uploadVideoToCloudinary(file);
            setCurrentVideo(prev => ({ ...prev, videoUrl: url }));
            toast.success(isHindi ? 'वीडियो अपलोड सफल' : 'Video upload successful');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Video upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!currentVideo.titleHi) {
            toast.error(isHindi ? 'शीर्षक आवश्यक है' : 'Title is required');
            return;
        }

        if (!currentVideo.videoUrl && !uploading) {
            toast.error(isHindi ? 'वीडियो अपलोड करें या URL डालें' : 'Please upload a video or provide a URL');
            return;
        }

        if (uploading) {
            toast.error(isHindi ? 'कृपया वीडियो अपलोड होने तक प्रतीक्षा करें' : 'Please wait for the video to finish uploading');
            return;
        }

        setSaving(true);
        try {
            const url = currentVideo.id
                ? `/api/admin/videos/${currentVideo.id}`
                : '/api/admin/videos';

            const method = currentVideo.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentVideo)
            });

            if (!res.ok) throw new Error('Failed to save video');

            toast.success(isHindi ? 'वीडियो सहेजा गया' : 'Video saved successfully');
            setIsDialogOpen(false);
            fetchVideos();
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
            const res = await fetch(`/api/admin/videos/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete video');

            toast.success(isHindi ? 'वीडियो हटाया गया' : 'Video deleted successfully');
            fetchVideos();
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'हटाने में विफल' : 'Failed to delete');
        }
    };

    const openNewDialog = () => {
        setCurrentVideo({ isFeatured: false, order: 0 });
        setIsDialogOpen(true);
    };

    const openEditDialog = (video: VideoData) => {
        setCurrentVideo(video);
        setIsDialogOpen(true);
    };

    const filteredVideos = videos.filter(v =>
        v.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.titleEn && v.titleEn.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={isHindi ? 'वीडियो खोजें...' : 'Search videos...'}
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={openNewDialog} className="bg-orange-600 hover:bg-orange-700 text-white shrink-0">
                    <Plus className="mr-2 h-4 w-4" />
                    {isHindi ? 'नया वीडियो जोड़ें' : 'Add New Video'}
                </Button>
            </div>

            <div className="dashboard-card border border-border/40 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>{isHindi ? 'शीर्षक' : 'Title'}</TableHead>
                            <TableHead>{isHindi ? 'लिंक' : 'URL'}</TableHead>
                            <TableHead>{isHindi ? 'विशेष' : 'Featured'}</TableHead>
                            <TableHead className="text-right">{isHindi ? 'कार्रवाई' : 'Actions'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filteredVideos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {isHindi ? 'कोई वीडियो नहीं मिला' : 'No videos found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredVideos.map((v, index) => (
                                <TableRow key={v.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{v.titleHi}</span>
                                            {v.titleEn && <span className="text-xs text-muted-foreground">{v.titleEn}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={v.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 hover:underline flex items-center gap-1 text-sm overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            {v.videoUrl}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {v.isFeatured ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium dark:bg-yellow-900/30 dark:text-yellow-400">
                                                <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Standard</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(v)}>
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isHindi
                                ? (currentVideo.id ? 'वीडियो संपादित करें' : 'नया वीडियो')
                                : (currentVideo.id ? 'Edit Video' : 'Add New Video')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4 max-h-[70vh] overflow-y-auto px-1">
                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (हिंदी)' : 'Title (Hindi)'} <span className="text-red-500">*</span></Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input {...props} placeholder="शीर्षक डालें..." />
                                )}
                                value={currentVideo.titleHi || ''}
                                onChangeText={(text) => setCurrentVideo(prev => ({ ...prev, titleHi: text }))}
                                lang="hi"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (अंग्रेजी)' : 'Title (English)'}</Label>
                            <Input
                                value={currentVideo.titleEn || ''}
                                onChange={(e) => setCurrentVideo(prev => ({ ...prev, titleEn: e.target.value }))}
                                placeholder="Enter title in English..."
                            />
                        </div>

                        <div className="space-y-4 p-4 border rounded-xl bg-muted/30">
                            <div className="space-y-2">
                                <Label className="text-orange-600 font-semibold">{isHindi ? 'वीडियो अपलोड करें (अधिकतम 50MB)' : 'Upload Video (Max 50MB)'}</Label>
                                <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoFileChange}
                                    disabled={uploading}
                                    className="cursor-pointer file:bg-orange-50 file:text-orange-700 file:border-0"
                                />
                                {uploading && (
                                    <div className="flex items-center gap-2 text-xs text-orange-600 animate-pulse mt-1">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>{isHindi ? 'अपलोड हो रहा है...' : 'Uploading video...'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex items-center gap-2">
                                <div className="flex-grow border-t border-border"></div>
                                <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase">{isHindi ? 'या' : 'OR'}</span>
                                <div className="flex-grow border-t border-border"></div>
                            </div>

                            <div className="space-y-2">
                                <Label>{isHindi ? 'वीडियो URL (यूट्यूब/विमियो/डायरेक्ट)' : 'Video URL (YouTube/Vimeo/Direct)'}</Label>
                                <Input
                                    value={currentVideo.videoUrl || ''}
                                    onChange={(e) => setCurrentVideo(prev => ({ ...prev, videoUrl: e.target.value }))}
                                    placeholder="https://..."
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    {isHindi ? '* यदि आपने ऊपर फाइल अपलोड की है, तो URL अपने आप भर जाएगा।' : '* If you uploaded a file above, the URL will be filled automatically.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{isHindi ? 'क्रम' : 'Order'}</Label>
                                <Input
                                    type="number"
                                    value={currentVideo.order || 0}
                                    onChange={(e) => setCurrentVideo(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg mt-auto h-10">
                                <Label className="text-sm cursor-pointer" htmlFor="featured-switch">
                                    {isHindi ? 'विशेष वीडियो' : 'Featured Video'}
                                </Label>
                                <Switch
                                    id="featured-switch"
                                    checked={currentVideo.isFeatured || false}
                                    onCheckedChange={(checked) => setCurrentVideo(prev => ({ ...prev, isFeatured: checked }))}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
                        <Button onClick={handleSave} disabled={saving || uploading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {isHindi ? 'सहेजें' : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
