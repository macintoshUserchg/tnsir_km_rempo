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
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, ListTree, GripVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface MenuManagerProps {
    initialItems: Menu[];
    locale: string;
}

export default function MenuManager({ initialItems, locale }: MenuManagerProps) {
    const router = useRouter();
    const isHindi = locale === 'hi';
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

            toast.success(editingItem
                ? (isHindi ? 'मेन्यू अपडेट किया गया' : 'Menu updated')
                : (isHindi ? 'मेन्यू आइटम बनाया गया' : 'Menu item created')
            );
            router.refresh();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(isHindi ? 'मेन्यू आइटम सहेजने में त्रुटि' : 'Error saving menu item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(isHindi ? 'क्या आप सुनिश्चित हैं? यह सभी उप-आइटमों को भी हटा देगा।' : 'Are you sure? This will delete all sub-items as well.')) return;

        try {
            await fetch(`/api/admin/menus/${id}`, { method: 'DELETE' });
            toast.success(isHindi ? 'सफलतापूर्वक हटाया गया' : 'Deleted successfully');
            router.refresh();
        } catch (error) {
            toast.error(isHindi ? 'आइटम हटाने में त्रुटि' : 'Error deleting item');
        }
    };

    // Helper to build tree
    const rootItems = initialItems.filter(item => !item.parentId);
    const getChildren = (parentId: number) => initialItems.filter(item => item.parentId === parentId);

    // Recursive Table Row Component
    const MenuRow = ({ item, depth = 0 }: { item: Menu, depth?: number }) => {
        const children = getChildren(item.id);
        const hasChildren = children.length > 0;
        const isExpanded = expanded[item.id];

        // Indentation calculation
        const paddingLeft = `${depth * 28 + 24}px`;

        return (
            <>
                <TableRow className="group hover:bg-muted/30 transition-colors border-border/40">
                    <TableCell className="py-4 font-bold text-base text-foreground relative">
                        <div className="flex items-center gap-3" style={{ paddingLeft }}>
                            {depth > 0 && (
                                <div className="absolute left-0 w-[1px] bg-border/40 h-full top-0 ml-6" />
                            )}
                            {depth > 0 && (
                                <div className="absolute left-6 w-4 h-[1px] bg-border/40 ml-0 top-1/2 -translate-y-1/2" />
                            )}

                            {hasChildren ? (
                                <button
                                    onClick={() => toggleExpand(item.id)}
                                    className="p-1 -ml-1 hover:bg-muted rounded-md transition-colors z-10"
                                >
                                    {isExpanded ?
                                        <ChevronDown className="h-4 w-4 text-orange-600" /> :
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    }
                                </button>
                            ) : (
                                <span className="w-4 inline-block" />
                            )}
                            <span className="truncate">{item.labelHi}</span>
                        </div>
                    </TableCell>
                    <TableCell className="dashboard-body text-muted-foreground">{item.labelEn}</TableCell>
                    <TableCell>
                        <code className="dashboard-mono bg-muted/50 px-2.5 py-1 rounded-md text-xs border border-border/30 text-muted-foreground group-hover:text-foreground group-hover:border-orange-200 transition-colors">
                            {item.url}
                        </code>
                    </TableCell>
                    <TableCell>
                        <span className={cn(
                            "dashboard-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]",
                            item.isVisible
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                                : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                        )}>
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                item.isVisible ? "bg-emerald-500" : "bg-amber-500"
                            )} />
                            {item.isVisible
                                ? (isHindi ? 'दृश्यमान' : 'Visible')
                                : (isHindi ? 'छिपा हुआ' : 'Hidden')
                            }
                        </span>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-colors"
                                onClick={() => handleOpenDialog(item)}
                                title={isHindi ? 'संपादित करें' : 'Edit'}
                            >
                                <Edit className="h-4.5 w-4.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                                onClick={() => handleDelete(item.id)}
                                title={isHindi ? 'हटाएं' : 'Delete'}
                            >
                                <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
                {/* Render children if expanded */}
                {isExpanded && children.map(child => (
                    <MenuRow key={child.id} item={child} depth={depth + 1} />
                ))}
            </>
        );
    };

    return (
        <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex justify-between items-center">
                <div className="hidden md:block text-sm text-muted-foreground">
                    {isHindi
                        ? `कुल आइटम: ${initialItems.length}`
                        : `Total Items: ${initialItems.length}`
                    }
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20">
                    <Plus className="mr-2 h-4 w-4" />
                    {isHindi ? 'नया मेन्यू आइटम जोड़ें' : 'Add Menu Item'}
                </Button>
            </div>

            {/* Content Card */}
            <Card className="dashboard-card border-0">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                        <ListTree className="h-5 w-5 text-orange-600" />
                        <CardTitle className="dashboard-section">
                            {isHindi ? 'मेन्यू संरचना' : 'Menu Structure'}
                        </CardTitle>
                    </div>
                    <CardDescription className="dashboard-label mt-1">
                        {isHindi ? 'अपनी वेबसाइट नेविगेशन पदानुक्रम व्यवस्थित करें।' : 'Organize your website navigation hierarchy.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/40">
                                    <TableHead className="py-4 pl-6 w-[35%] min-w-[250px] font-bold">
                                        {isHindi ? 'लेबल (हिंदी)' : 'Label (Hi)'}
                                    </TableHead>
                                    <TableHead className="font-bold w-[20%]">
                                        {isHindi ? 'लेबल (अंग्रेज़ी)' : 'Label (En)'}
                                    </TableHead>
                                    <TableHead className="font-bold w-[25%]">URL</TableHead>
                                    <TableHead className="font-bold w-[10%]">
                                        {isHindi ? 'दृश्यता' : 'Visibility'}
                                    </TableHead>
                                    <TableHead className="text-right font-bold py-4 pr-6 w-[10%]">
                                        {isHindi ? 'कार्रवाई' : 'Actions'}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rootItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-16 text-center">
                                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4 border border-border/50">
                                                <ListTree className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <p className="dashboard-body font-bold text-lg mb-1">
                                                {isHindi ? 'कोई मेन्यू आइटम नहीं मिला' : 'No menu items found'}
                                            </p>
                                            <p className="dashboard-label">
                                                {isHindi ? 'शुरू करने के लिए एक नया मेन्यू आइटम जोड़ें' : 'Get started by adding a new menu item'}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {rootItems.map(item => (
                                    <MenuRow key={item.id} item={item} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem
                                ? (isHindi ? 'मेन्यू आइटम संपादित करें' : 'Edit Menu Item')
                                : (isHindi ? 'नया मेन्यू आइटम जोड़ें' : 'Add Menu Item')
                            }
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>
                                    {isHindi ? 'लेबल (हिंदी)' : 'Label (Hindi)'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={formData.labelHi || ''}
                                    onChange={e => setFormData({ ...formData, labelHi: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {isHindi ? 'लेबल (अंग्रेज़ी)' : 'Label (English)'}
                                </Label>
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
                                <Label>
                                    {isHindi ? 'स्थान' : 'Position'}
                                </Label>
                                <Select
                                    value={formData.position}
                                    onValueChange={(v) => setFormData({ ...formData, position: v as MenuPosition })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HEADER">{isHindi ? 'हेडर (Header)' : 'Header'}</SelectItem>
                                        <SelectItem value="FOOTER">{isHindi ? 'फुटर (Footer)' : 'Footer'}</SelectItem>
                                        <SelectItem value="SIDEBAR">{isHindi ? 'साइडबार (Sidebar)' : 'Sidebar'}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    {isHindi ? 'पैरेंट आइटम' : 'Parent Item'}
                                </Label>
                                <Select
                                    value={formData.parentId ? formData.parentId.toString() : "root"}
                                    onValueChange={(v) => setFormData({ ...formData, parentId: v === "root" ? null : parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={isHindi ? 'रूट (कोई पैरेंट नहीं)' : 'Root (No Parent)'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="root">{isHindi ? 'रूट (कोई पैरेंट नहीं)' : 'Root (No Parent)'}</SelectItem>
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
                            <Label>
                                {isHindi ? 'दृश्यमान' : 'Visible'}
                            </Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white">
                            {isLoading
                                ? <Loader2 className="animate-spin h-4 w-4" />
                                : (isHindi ? 'सहेजें' : 'Save')
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
