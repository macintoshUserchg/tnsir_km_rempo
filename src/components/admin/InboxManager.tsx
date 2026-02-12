'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHead as TableHeaderHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trash2, Search, Mail, Phone, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface ContactQuery {
    id: number;
    name: string;
    email: string | null;
    mobile: string | null;
    subject: string | null;
    message: string;
    status: 'NEW' | 'READ' | 'RESPONDED' | 'SPAM';
    createdAt: string;
}

interface InboxManagerProps {
    locale: string;
}

export default function InboxManager({ locale }: InboxManagerProps) {
    const isHindi = locale === 'hi';
    const [queries, setQueries] = useState<ContactQuery[]>([]);
    const [filteredQueries, setFilteredQueries] = useState<ContactQuery[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // View Dialog
    const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/inbox');
            if (!res.ok) throw new Error('Failed to fetch queries');
            const data = await res.json();
            setQueries(data);
            setFilteredQueries(data);
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'लोड करने में विफल' : 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    useEffect(() => {
        let result = queries;

        if (statusFilter !== 'ALL') {
            result = result.filter(q => q.status === statusFilter);
        }

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(q =>
                q.name.toLowerCase().includes(lowerSearch) ||
                (q.email && q.email.toLowerCase().includes(lowerSearch)) ||
                (q.subject && q.subject.toLowerCase().includes(lowerSearch))
            );
        }

        setFilteredQueries(result);
    }, [search, statusFilter, queries]);

    const handleStatusUpdate = async (id: number, status: string) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/admin/inbox/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error('Failed to update status');

            setQueries(prev => prev.map(q => q.id === id ? { ...q, status: status as any } : q));
            if (selectedQuery && selectedQuery.id === id) {
                setSelectedQuery(prev => prev ? { ...prev, status: status as any } : null);
            }
            toast.success(isHindi ? 'स्थिति अपडेट की गई' : 'Status updated');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(isHindi ? 'क्या आप सुनिश्चित हैं?' : 'Are you sure?')) return;
        try {
            const res = await fetch(`/api/admin/inbox/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete');

            setQueries(prev => prev.filter(q => q.id !== id));
            if (selectedQuery?.id === id) setIsDialogOpen(false);
            toast.success(isHindi ? 'हटाया गया' : 'Deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete');
        }
    };

    const openQuery = (query: ContactQuery) => {
        setSelectedQuery(query);
        setIsDialogOpen(true);

        // Mark as read if NEW
        if (query.status === 'NEW') {
            handleStatusUpdate(query.id, 'READ');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NEW': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>;
            case 'READ': return <Badge variant="outline" className="text-muted-foreground">Read</Badge>;
            case 'RESPONDED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Responded</Badge>;
            case 'SPAM': return <Badge variant="destructive">Spam</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={isHindi ? 'खोजें...' : 'Search...'}
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">{isHindi ? 'सभी' : 'All'}</SelectItem>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="READ">Read</SelectItem>
                        <SelectItem value="RESPONDED">Responded</SelectItem>
                        <SelectItem value="SPAM">Spam</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="dashboard-card border border-border/40">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[100px]">{isHindi ? 'दिनांक' : 'Date'}</TableHead>
                            <TableHead>{isHindi ? 'नाम' : 'Name'}</TableHead>
                            <TableHead>{isHindi ? 'विषय' : 'Subject'}</TableHead>
                            <TableHead>{isHindi ? 'स्थिति' : 'Status'}</TableHead>
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
                        ) : filteredQueries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {isHindi ? 'कोई संदेश नहीं' : 'No messages found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQueries.map((query) => (
                                <TableRow key={query.id} className={query.status === 'NEW' ? 'bg-blue-50/50 dark:bg-blue-900/10 font-medium' : ''}>
                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {format(new Date(query.createdAt), 'dd MMM yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{query.name}</span>
                                            <span className="text-xs text-muted-foreground">{query.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="line-clamp-1">{query.subject || (isHindi ? '(कोई विषय नहीं)' : '(No Subject)')}</div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(query.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => openQuery(query)}>
                                                <Eye className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(query.id)}>
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
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{isHindi ? 'संदेश विवरण' : 'Message Details'}</DialogTitle>
                        <DialogDescription>
                            {selectedQuery && format(new Date(selectedQuery.createdAt), 'PPP p')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedQuery && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">{isHindi ? 'प्रेषक' : 'From'}</Label>
                                    <div className="font-medium text-lg">{selectedQuery.name}</div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">{isHindi ? 'संपर्क' : 'Contact'}</Label>
                                    <div className="flex flex-col text-sm">
                                        <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {selectedQuery.email || '-'}</div>
                                        <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {selectedQuery.mobile || '-'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">{isHindi ? 'विषय' : 'Subject'}</Label>
                                <div className="font-medium">{selectedQuery.subject || (isHindi ? '(कोई विषय नहीं)' : '(No Subject)')}</div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">{isHindi ? 'संदेश' : 'Message'}</Label>
                                <div className="text-sm leading-relaxed border-l-2 border-orange-500 pl-4 py-1">
                                    {selectedQuery.message}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Label>{isHindi ? 'स्थिति बदलें:' : 'Change Status:'}</Label>
                                    <Select
                                        value={selectedQuery.status}
                                        onValueChange={(val) => handleStatusUpdate(selectedQuery.id, val)}
                                        disabled={updatingStatus}
                                    >
                                        <SelectTrigger className="w-[140px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEW">New</SelectItem>
                                            <SelectItem value="READ">Read</SelectItem>
                                            <SelectItem value="RESPONDED">Responded</SelectItem>
                                            <SelectItem value="SPAM">Spam</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedQuery.id)}>
                                    <Trash2 className="mr-2 h-3 w-3" /> {isHindi ? 'हटाएं' : 'Delete'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
