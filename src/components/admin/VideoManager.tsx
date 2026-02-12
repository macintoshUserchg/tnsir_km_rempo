'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, Edit, Trash2, Video as VideoIcon, Tv, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import { Switch } from '@/components/ui/switch';
import 'new-react-transliterate/styles.css';

interface Video {
    id: number;
    titleHi: string;
    titleEn: string | null;
    videoUrl: string;
    isFeatured: boolean;
}

interface VideoManagerProps {
    locale: string;
}

export default function VideoManager({ locale }: VideoManagerProps) {
    const isHindi = locale === 'hi';
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<Partial<Video>>({});
    const [saving, setSaving] = useState(false);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/media/videos');
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

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = currentVideo.id
                ? `/api/admin/media/videos/${currentVideo.id}`
                : '/api/admin/media/videos';

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
            const res = await fetch(`/api/admin/media/videos/${id}`, {
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
        setCurrentVideo({});
        setIsDialogOpen(true);
    };

    const openEditDialog = (video: Video) => {
        setCurrentVideo(video);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={isHindi ? 'वीडियो खोजें...' : 'Search videos...'}
                        className="pl-10"
                    />
                </div>
                <Button onClick={openNewDialog} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    {isHindi ? 'नया वीडियो' : 'Add New Video'}
                </Button>
            </div>

            <div className="dashboard-card border border-border/40">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead>{isHindi ? 'शीर्षक' : 'Title'}</TableHead>
                            <TableHead>{isHindi ? 'URL' : 'URL'}</TableHead>
                            <TableHead>{isHindi ? 'फ़ीचर्ड' : 'Featured'}</TableHead>
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
                        ) : videos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {isHindi ? 'कोई वीडियो नहीं मिला' : 'No videos found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            videos.map((video, index) => (
                                <TableRow key={video.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        <div className="line-clamp-1">{video.titleHi}</div>
                                        {video.titleEn && <div className="text-xs text-muted-foreground line-clamp-1">{video.titleEn}</div>}
                                    </TableCell>
                                    <TableCell>
                                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                                            Link <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {video.isFeatured && (
                                            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                                Featured
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}>
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
                        <DialogTitle>{isHindi ? (currentVideo.id ? 'वीडियो संपादित करें' : 'नया वीडियो जोड़ें') : (currentVideo.id ? 'Edit Video' : 'Add New Video')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{isHindi ? 'शीर्षक (हिंदी)' : 'Title (Hindi)'} <span className="text-red-500">*</span></Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input {...props} placeholder="वीडियो शीर्षक..." />
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
                                placeholder="Video Title..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Video URL (YouTube/Vimeo) <span className="text-red-500">*</span></Label>
                            <Input
                                value={currentVideo.videoUrl || ''}
                                onChange={(e) => setCurrentVideo(prev => ({ ...prev, videoUrl: e.target.value }))}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <Label>{isHindi ? 'होमपेज पर दिखाएं' : 'Feature on Homepage'}</Label>
                            <Switch
                                checked={currentVideo.isFeatured || false}
                                onCheckedChange={(checked) => setCurrentVideo(prev => ({ ...prev, isFeatured: checked }))}
                            />
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
