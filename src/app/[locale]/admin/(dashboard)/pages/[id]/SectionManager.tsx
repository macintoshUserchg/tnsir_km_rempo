'use client';

import { useState } from 'react';
import { PageSection, SectionType } from '@prisma/client';
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
import { Loader2, Plus, Trash2, Edit, MoveUp, MoveDown, Layout, Type, Calendar, Image as ImageIcon, Video, Star, HelpCircle, User, BarChart3, Mail, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import ClientSectionRenderer from '@/components/cms/ClientSectionRenderer';

const BLOCK_METADATA: Record<SectionType, { title: string, description: string, icon: any }> = {
    HERO: { title: 'Hero Banner', description: 'Large headline with image background.', icon: Layout },
    RICHTEXT: { title: 'Rich Text', description: 'Standard text, links, and formatting.', icon: Type },
    TIMELINE: { title: 'Timeline', description: 'Chronological list of events.', icon: Calendar },
    GALLERY: { title: 'Photo Gallery', description: 'Grid of images from albums.', icon: ImageIcon },
    VIDEOS: { title: 'Video Gallery', description: 'YouTube/Video list display.', icon: Video },
    TESTIMONIALS: { title: 'Testimonials', description: 'Quotes from citizens or partners.', icon: Star },
    FAQ: { title: 'FAQ', description: 'Frequently asked questions accordion.', icon: HelpCircle },
    BIOGRAPHY: { title: 'Biography', description: 'Profile section with stats and image.', icon: User },
    STATS: { title: 'Stats Counter', description: 'Impact metrics and key numbers.', icon: BarChart3 },
    NEWSLETTER: { title: 'Newsletter', description: 'Subscription form for updates.', icon: Mail },
    CONTACT_FORM: { title: 'Contact Form', description: 'Get in touch message form.', icon: Mail },
    FEATURES: { title: 'Features Grid', description: 'Row of icon-based highlights.', icon: Layout },
};

interface SectionManagerProps {
    pageId: number;
    sections: PageSection[];
    locale: string;
}

export default function SectionManager({ pageId, sections, locale }: SectionManagerProps) {
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);

    // Form states
    const [newType, setNewType] = useState<SectionType>('RICHTEXT');
    const [editContent, setEditContent] = useState<any>({});
    const [editMode, setEditMode] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');

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
        setEditMode('EDITOR');
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

        if (editMode === 'PREVIEW') {
            return (
                <div className="border rounded-2xl overflow-hidden bg-white dark:bg-black p-4">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4 font-bold border-b pb-2">Client Side Preview</div>
                    <ClientSectionRenderer type={selectedSection.type} content={editContent} locale={locale} />
                </div>
            );
        }

        switch (selectedSection.type) {
            case 'HERO':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Title (Hi)</Label><Input value={editContent.titleHi || ''} onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })} /></div>
                            <div><Label>Title (En)</Label><Input value={editContent.titleEn || ''} onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Description (Hi)</Label><Textarea value={editContent.descriptionHi || ''} onChange={e => setEditContent({ ...editContent, descriptionHi: e.target.value })} /></div>
                            <div><Label>Description (En)</Label><Textarea value={editContent.descriptionEn || ''} onChange={e => setEditContent({ ...editContent, descriptionEn: e.target.value })} /></div>
                        </div>
                        <div><Label>Image URL</Label><Input value={editContent.imageUrl || ''} onChange={e => setEditContent({ ...editContent, imageUrl: e.target.value })} /></div>
                    </div>
                );
            case 'RICHTEXT':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-xs uppercase opacity-60">Hindi (HTML)</Label><Textarea className="font-mono min-h-[300px]" value={editContent.htmlHi || ''} onChange={e => setEditContent({ ...editContent, htmlHi: e.target.value })} /></div>
                            <div className="space-y-2"><Label className="text-xs uppercase opacity-60">English (HTML)</Label><Textarea className="font-mono min-h-[300px]" value={editContent.htmlEn || ''} onChange={e => setEditContent({ ...editContent, htmlEn: e.target.value })} /></div>
                        </div>
                    </div>
                );
            case 'BIOGRAPHY':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Title (Hi)</Label><Input value={editContent.titleHi || ''} onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })} /></div>
                            <div><Label>Title (En)</Label><Input value={editContent.titleEn || ''} onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Content (Hi)</Label><Textarea value={editContent.contentHi || ''} onChange={e => setEditContent({ ...editContent, contentHi: e.target.value })} /></div>
                            <div><Label>Content (En)</Label><Textarea value={editContent.contentEn || ''} onChange={e => setEditContent({ ...editContent, contentEn: e.target.value })} /></div>
                        </div>
                        <div><Label>Image URL</Label><Input value={editContent.imageUrl || ''} onChange={e => setEditContent({ ...editContent, imageUrl: e.target.value })} /></div>
                    </div>
                );
            case 'FAQ':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Title (Hi)</Label><Input value={editContent.titleHi || ''} onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })} /></div>
                            <div><Label>Title (En)</Label><Input value={editContent.titleEn || ''} onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })} /></div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs uppercase opacity-60">FAQ Items</Label>
                                <Button variant="outline" size="sm" onClick={() => setEditContent({ ...editContent, items: [...(editContent.items || []), { questionHi: '', questionEn: '', answerHi: '', answerEn: '' }] })}>
                                    <Plus className="h-3 w-3 mr-2" /> Add FAQ
                                </Button>
                            </div>
                            <div className="space-y-6 max-h-[400px] overflow-auto pr-2">
                                {(editContent.items || []).map((item: any, idx: number) => (
                                    <div key={idx} className="p-4 border rounded-xl bg-muted/20 relative group/faq">
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover/faq:opacity-100 transition-opacity" onClick={() => setEditContent({ ...editContent, items: editContent.items.filter((_: any, i: number) => i !== idx) })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label className="text-[10px]">Question (Hi)</Label><Input value={item.questionHi} onChange={e => { const newItems = [...editContent.items]; newItems[idx].questionHi = e.target.value; setEditContent({ ...editContent, items: newItems }); }} /></div>
                                                <div className="space-y-1"><Label className="text-[10px]">Question (En)</Label><Input value={item.questionEn} onChange={e => { const newItems = [...editContent.items]; newItems[idx].questionEn = e.target.value; setEditContent({ ...editContent, items: newItems }); }} /></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1"><Label className="text-[10px]">Answer (Hi)</Label><Textarea rows={2} value={item.answerHi} onChange={e => { const newItems = [...editContent.items]; newItems[idx].answerHi = e.target.value; setEditContent({ ...editContent, items: newItems }); }} /></div>
                                                <div className="space-y-1"><Label className="text-[10px]">Answer (En)</Label><Textarea rows={2} value={item.answerEn} onChange={e => { const newItems = [...editContent.items]; newItems[idx].answerEn = e.target.value; setEditContent({ ...editContent, items: newItems }); }} /></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'STATS':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Title (Hi)</Label><Input value={editContent.titleHi || ''} onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })} /></div>
                            <div><Label>Title (En)</Label><Input value={editContent.titleEn || ''} onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })} /></div>
                        </div>
                        <div>
                            <Label>Stats JSON</Label>
                            <Textarea className="font-mono text-xs" rows={8} value={JSON.stringify(editContent.stats || [], null, 2)} onChange={e => { try { setEditContent({ ...editContent, stats: JSON.parse(e.target.value) }); } catch (err) { } }} />
                        </div>
                    </div>
                );
            case 'TIMELINE':
            case 'GALLERY':
            case 'VIDEOS':
            case 'TESTIMONIALS':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Title (Hi)</Label><Input value={editContent.titleHi || ''} onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })} /></div>
                            <div><Label>Title (En)</Label><Input value={editContent.titleEn || ''} onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })} /></div>
                        </div>
                        <div><Label>Item Count</Label><Input type="number" value={editContent.count || 6} onChange={e => setEditContent({ ...editContent, count: parseInt(e.target.value) })} /></div>
                    </div>
                );
            default:
                return (
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Title (Hi)</Label><Input value={editContent.titleHi || ''} onChange={e => setEditContent({ ...editContent, titleHi: e.target.value })} /></div>
                        <div><Label>Title (En)</Label><Input value={editContent.titleEn || ''} onChange={e => setEditContent({ ...editContent, titleEn: e.target.value })} /></div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-border/40">
                <h3 className="dashboard-section">Page Sections</h3>
                <div className="flex gap-2">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20">
                                <Plus className="mr-2 h-4 w-4" /> Add Section
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader><DialogTitle>Add New Section</DialogTitle></DialogHeader>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6 max-h-[60vh] overflow-auto px-1">
                                {(Object.entries(BLOCK_METADATA) as [SectionType, any][]).map(([type, meta]) => {
                                    const Icon = meta.icon;
                                    return (
                                        <div key={type} className={cn("relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md active:scale-95", newType === type ? "border-orange-600 bg-orange-50/30 dark:bg-orange-950/20" : "border-border/40 bg-card hover:border-orange-200")} onClick={() => setNewType(type)}>
                                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", newType === type ? "bg-orange-600 text-white" : "bg-muted text-muted-foreground")}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm">{meta.title}</div>
                                                <div className="text-[10px] text-muted-foreground truncate">{meta.description}</div>
                                            </div>
                                            {newType === type && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-600 animate-pulse" />}
                                        </div>
                                    );
                                })}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddSection} disabled={isLoading} className="w-full sm:w-auto">
                                    {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Add {BLOCK_METADATA[newType]?.title}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="space-y-4">
                {sections.map((section, index) => (
                    <div key={section.id} className="dashboard-card group flex items-center gap-4 p-4 hover:border-orange-500/30">
                        <div className="flex flex-col gap-1 p-1 bg-muted/40 rounded-lg">
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-orange-600" disabled={index === 0} onClick={() => handleMove(section.id, 'UP')}><MoveUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-orange-600" disabled={index === sections.length - 1} onClick={() => handleMove(section.id, 'DOWN')}><MoveDown className="h-3 w-3" /></Button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold dashboard-body text-foreground">{section.type}</span>
                                {!section.isVisible && <span className="dashboard-badge bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800">Hidden</span>}
                            </div>
                            <div className="dashboard-body text-sm text-muted-foreground truncate border-l-2 border-orange-500/20 pl-3 py-1 italic">
                                {(section.content as any).titleEn || (section.content as any).titleHi || BLOCK_METADATA[section.type]?.title}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="hover:border-blue-500 hover:text-blue-600" onClick={() => openEdit(section)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </div>
                ))}
                {sections.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-border/40 rounded-xl bg-muted/10">
                        <p className="dashboard-body">No sections yet. Add one to get started.</p>
                    </div>
                )}
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className={cn("transition-all duration-500", editMode === 'PREVIEW' ? "max-w-6xl h-[90vh]" : "max-w-2xl")}>
                    <DialogHeader className="flex flex-row items-center justify-between space-x-4 border-b pb-4">
                        <div>
                            <DialogTitle>Edit {selectedSection?.type} Section</DialogTitle>
                        </div>
                        <div className="flex bg-muted p-1 rounded-lg mr-8">
                            <Button variant={editMode === 'EDITOR' ? 'secondary' : 'ghost'} size="sm" onClick={() => setEditMode('EDITOR')} className="flex items-center gap-2">
                                <Edit className="h-3.5 w-3.5" /> Editor
                            </Button>
                            <Button variant={editMode === 'PREVIEW' ? 'secondary' : 'ghost'} size="sm" onClick={() => setEditMode('PREVIEW')} className="flex items-center gap-2">
                                <Eye className="h-3.5 w-3.5" /> Preview
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className={cn("py-4 overflow-auto", editMode === 'PREVIEW' ? "h-full" : "max-h-[70vh]")}>
                        {renderEditorFields()}
                    </div>
                    <DialogFooter className="border-t pt-4">
                        <Button onClick={handleUpdateSection} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Section Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
