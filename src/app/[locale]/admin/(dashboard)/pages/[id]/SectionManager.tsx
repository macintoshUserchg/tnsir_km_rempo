'use client';

import { useState } from 'react';
import { Page, PageSection, SectionType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Edit, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';

interface SectionManagerProps {
    pageId: number;
    sections: PageSection[];
}

export default function SectionManager({ pageId, sections }: SectionManagerProps) {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);

    // Form states
    const [newType, setNewType] = useState<SectionType>('RICHTEXT');
    const [editContent, setEditContent] = useState<any>({});
    const [previewMode, setPreviewMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');

    const handleAddSection = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/pages/${pageId}/sections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: newType }),
            });

            if (!res.ok) throw new Error('Failed to add section');

            toast.success('Section added');
            router.refresh();
            setIsAddOpen(false);
        } catch (error) {
            toast.error('Error adding section');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSection = async (id: number) => {
        if (!confirm('Are you sure you want to delete this section?')) return;

        try {
            const res = await fetch(`/api/admin/sections/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete section');

            toast.success('Section deleted');
            router.refresh();
        } catch (error) {
            toast.error('Error deleting section');
        }
    };

    const openEdit = (section: PageSection) => {
        setSelectedSection(section);
        setEditContent(section.content as any || {});
        setIsEditOpen(true);
    };

    const handleUpdateSection = async () => {
        if (!selectedSection) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/sections/${selectedSection.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });

            if (!res.ok) throw new Error('Failed to update section');

            toast.success('Section updated');
            router.refresh();
            setIsEditOpen(false);
        } catch (error) {
            toast.error('Error updating section');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMove = async (id: number, direction: 'UP' | 'DOWN') => {
        // Optimistic update or just simpler reload for now
        try {
            const res = await fetch(`/api/admin/sections/${id}/move`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction }),
            });
            if (!res.ok) throw new Error('Failed to move section');
            router.refresh();
        } catch (error) {
            toast.error('Error moving section');
        }
    };

    const renderEditorFields = () => {
        if (!selectedSection) return null;

        switch (selectedSection.type) {
            case 'HERO':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Title (Hi)</Label>
                            <Input
                                value={editContent.titleHi || ''}
                                onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Title (En)</Label>
                            <Input
                                value={editContent.titleEn || ''}
                                onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Description (Hi)</Label>
                            <Textarea
                                value={editContent.descriptionHi || ''}
                                onChange={e => setEditContent({ ...editContent, descriptionHi: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Description (En)</Label>
                            <Textarea
                                value={editContent.descriptionEn || ''}
                                onChange={e => setEditContent({ ...editContent, descriptionEn: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Image URL</Label>
                            <Input
                                value={editContent.imageUrl || ''}
                                onChange={e => setEditContent({ ...editContent, imageUrl: e.target.value })}
                            />
                        </div>
                    </div>
                );
            case 'RICHTEXT':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <Label>Content {previewMode === 'PREVIEW' ? '(Preview)' : ''}</Label>
                            <div className="flex bg-muted p-0.5 rounded-lg border border-border/50">
                                <Button
                                    variant={previewMode === 'EDIT' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-3 text-xs"
                                    onClick={() => setPreviewMode('EDIT')}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant={previewMode === 'PREVIEW' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-3 text-xs"
                                    onClick={() => setPreviewMode('PREVIEW')}
                                >
                                    Preview
                                </Button>
                            </div>
                        </div>

                        {previewMode === 'EDIT' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider opacity-60">Hindi Content (HTML)</Label>
                                    <Textarea
                                        className="font-mono text-sm bg-muted/20 border-border/40 focus:border-orange-500/50 min-h-[300px]"
                                        value={editContent.htmlHi || ''}
                                        onChange={e => setEditContent({ ...editContent, htmlHi: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider opacity-60">English Content (HTML)</Label>
                                    <Textarea
                                        className="font-mono text-sm bg-muted/20 border-border/40 focus:border-orange-500/50 min-h-[300px]"
                                        value={editContent.htmlEn || ''}
                                        onChange={e => setEditContent({ ...editContent, htmlEn: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider opacity-60">Hindi Preview</Label>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-full p-4 border border-border/40 rounded-lg bg-white dark:bg-zinc-950 overflow-auto max-h-[400px]"
                                        dangerouslySetInnerHTML={{ __html: editContent.htmlHi || '<p class="text-muted-foreground italic">No content</p>' }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider opacity-60">English Preview</Label>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-full p-4 border border-border/40 rounded-lg bg-white dark:bg-zinc-950 overflow-auto max-h-[400px]"
                                        dangerouslySetInnerHTML={{ __html: editContent.htmlEn || '<p class="text-muted-foreground italic">No content</p>' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'TIMELINE':
            case 'GALLERY':
            case 'VIDEOS':
            case 'TESTIMONIALS':
                // Generic editor for lists: Title + Count
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Title (Hi)</Label>
                            <Input
                                value={editContent.titleHi || ''}
                                onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Title (En)</Label>
                            <Input
                                value={editContent.titleEn || ''}
                                onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Number of items to show</Label>
                            <Input
                                type="number"
                                value={editContent.count || 6}
                                onChange={e => setEditContent({ ...editContent, count: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border/40">
                <h3 className="dashboard-section">Page Sections</h3>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20">
                            <Plus className="mr-2 h-4 w-4" /> Add Section
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Section</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Label>Section Type</Label>
                            <Select
                                value={newType}
                                onValueChange={(v) => setNewType(v as SectionType)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HERO">Hero Banner</SelectItem>
                                    <SelectItem value="RICHTEXT">Rich Text</SelectItem>
                                    <SelectItem value="TIMELINE">Timeline</SelectItem>
                                    <SelectItem value="GALLERY">Gallery</SelectItem>
                                    <SelectItem value="VIDEOS">Videos</SelectItem>
                                    <SelectItem value="TESTIMONIALS">Testimonials</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddSection} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {sections.map((section, index) => (
                    <div key={section.id} className="dashboard-card group flex items-center gap-4 p-4 hover:border-orange-500/30">
                        <div className="flex flex-col gap-1 p-1 bg-muted/40 rounded-lg">
                            <Button
                                variant="ghost" size="icon" className="h-6 w-6 hover:text-orange-600"
                                disabled={index === 0}
                                onClick={() => handleMove(section.id, 'UP')}
                            >
                                <MoveUp className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost" size="icon" className="h-6 w-6 hover:text-orange-600"
                                disabled={index === sections.length - 1}
                                onClick={() => handleMove(section.id, 'DOWN')}
                            >
                                <MoveDown className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold dashboard-body text-foreground">{section.type}</span>
                                {!section.isVisible && (
                                    <span className="dashboard-badge bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800">
                                        Hidden
                                    </span>
                                )}
                            </div>
                            <div className="dashboard-body text-sm text-muted-foreground truncate border-l-2 border-orange-500/20 pl-3 py-1">
                                {section.type === 'HERO' && (
                                    <span className="italic">
                                        {(section.content as any).titleEn || (section.content as any).titleHi || 'Untitled Hero'}
                                    </span>
                                )}
                                {section.type === 'RICHTEXT' && (
                                    <span className="italic">
                                        {((section.content as any).htmlEn || (section.content as any).htmlHi || '').replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </span>
                                )}
                                {['TIMELINE', 'GALLERY', 'VIDEOS', 'TESTIMONIALS'].includes(section.type) && (
                                    <span className="italic">
                                        {(section.content as any).titleEn || (section.content as any).titleHi || 'Untitled Group'}
                                        {(section.content as any).count && ` (${(section.content as any).count} items)`}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="hover:border-blue-500 hover:text-blue-600" onClick={() => openEdit(section)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSection(section.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {sections.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-xl bg-muted/10 group">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="dashboard-body">No sections yet. Add one to get started.</p>
                    </div>
                )}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit {selectedSection?.type} Section</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {renderEditorFields()}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdateSection} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
