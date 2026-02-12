'use client';

import { useState } from 'react';
import { Menu, MenuPosition } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, MoveUp, MoveDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface MenuManagerProps {
    initialItems: Menu[];
}

export default function MenuManager({ initialItems }: MenuManagerProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Menu | null>(null);
    const [formData, setFormData] = useState<Partial<Menu>>({
        labelHi: '',
        labelEn: '',
        url: '',
        position: 'HEADER',
        parentId: null,
        isVisible: true,
    });

    // State for expanded parent items in the list
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const toggleExpand = (id: number) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenDialog = (item?: Menu) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                labelHi: '',
                labelEn: '',
                url: '',
                position: 'HEADER',
                parentId: null,
                isVisible: true,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const url = editingItem ? `/api/admin/menus/${editingItem.id}` : '/api/admin/menus';
            const method = editingItem ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save menu item');

            toast.success(editingItem ? 'Menu updated' : 'Menu item created');
            router.refresh();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error('Error saving menu item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This will delete all sub-items as well.')) return;

        try {
            await fetch(`/api/admin/menus/${id}`, { method: 'DELETE' });
            toast.success('Deleted successfully');
            router.refresh();
        } catch (error) {
            toast.error('Error deleting item');
        }
    };

    // Helper to build tree
    const rootItems = initialItems.filter(item => !item.parentId);
    const getChildren = (parentId: number) => initialItems.filter(item => item.parentId === parentId);

    const MenuNode = ({ item, depth = 0 }: { item: Menu, depth?: number }) => {
        const children = getChildren(item.id);
        const hasChildren = children.length > 0;
        const isExpanded = expanded[item.id];

        return (
            <div className="relative border-b border-border/40 last:border-0 hover:bg-muted/30 transition-all duration-300">
                {depth > 0 && <div className="dashboard-tree-line" style={{ left: `${depth * 24}px` }} />}

                <div className={cn(
                    "flex items-center p-3 transition-colors group",
                    depth > 0 && "pl-12"
                )}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(item.id)}
                                className="p-1 hover:bg-muted rounded-md transition-colors"
                            >
                                {isExpanded ?
                                    <ChevronDown className="h-4 w-4 text-orange-600" /> :
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                }
                            </button>
                        ) : (
                            <div className="w-6" />
                        )}

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="dashboard-body font-bold truncate">{item.labelHi}</div>
                            <div className="dashboard-label truncate">{item.labelEn}</div>
                            <div className="dashboard-mono bg-muted px-2 py-0.5 rounded w-fit border border-border/50">{item.url}</div>
                            <div className="flex justify-end gap-2">
                                <span className={cn(
                                    "dashboard-badge",
                                    item.isVisible
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-500 dark:border-emerald-800"
                                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-500 dark:border-amber-800"
                                )}>
                                    {item.isVisible ? 'Visible' : 'Hidden'}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20" onClick={() => handleOpenDialog(item)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {isExpanded && children.map(child => (
                    <MenuNode key={child.id} item={child} depth={depth + 1} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="dashboard-card p-4 flex justify-between items-center mb-6">
                <div className="flex gap-4">
                    {/* Filter by position logic */}
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
            </div>

            <div className="dashboard-card">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b bg-muted/30 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    <div className="pl-12">Label (Hi)</div>
                    <div>Label (En)</div>
                    <div>URL</div>
                    <div className="text-right pr-4">Actions</div>
                </div>
                {rootItems.length === 0 && <div className="p-8 text-center text-muted-foreground">No menu items found.</div>}
                {rootItems.map(item => (
                    <MenuNode key={item.id} item={item} />
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Label (Hindi) <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.labelHi || ''}
                                    onChange={e => setFormData({ ...formData, labelHi: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Label (English)</Label>
                                <Input
                                    value={formData.labelEn || ''}
                                    onChange={e => setFormData({ ...formData, labelEn: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>URL <span className="text-red-500">*</span></Label>
                            <Input
                                value={formData.url || ''}
                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                placeholder="/biography"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Select
                                    value={formData.position}
                                    onValueChange={(v) => setFormData({ ...formData, position: v as MenuPosition })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HEADER">Header</SelectItem>
                                        <SelectItem value="FOOTER">Footer</SelectItem>
                                        <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Parent Item</Label>
                                <Select
                                    value={formData.parentId ? formData.parentId.toString() : "root"}
                                    onValueChange={(v) => setFormData({ ...formData, parentId: v === "root" ? null : parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Root (No Parent)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="root">Root (No Parent)</SelectItem>
                                        {rootItems.filter(i => i.id !== editingItem?.id).map(item => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.labelEn || item.labelHi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                checked={formData.isVisible}
                                onCheckedChange={(c: boolean) => setFormData({ ...formData, isVisible: c })}
                            />
                            <Label>Visible</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Save'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
