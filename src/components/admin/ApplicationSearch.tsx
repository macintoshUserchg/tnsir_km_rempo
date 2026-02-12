'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { NewReactTransliterate } from 'new-react-transliterate';
import 'new-react-transliterate/styles.css';

interface ApplicationSearchProps {
    locale: string;
    statusCounts: Record<string, number>;
}

const ApplicationSearchContent = ({ locale, statusCounts }: ApplicationSearchProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isHindi = locale === 'hi';

    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
    const debouncedQuery = useDebounce(searchQuery, 750);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        if (debouncedQuery) {
            params.set('query', debouncedQuery);
        } else {
            params.delete('query');
        }

        if (status && status !== 'ALL') {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        if (debouncedQuery || status) {
            params.delete('page');
        }

        const newQueryString = params.toString();
        const currentQueryString = searchParams.toString();

        if (newQueryString !== currentQueryString) {
            setIsSearching(true);
            router.push(`/${locale}/admin/applications?${newQueryString}`);
            setIsSearching(false);
        }
    }, [debouncedQuery, status, router, locale, searchParams]);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    const statusOptions = [
        { value: 'ALL', label: isHindi ? 'सभी' : 'All' },
        { value: 'PENDING', label: isHindi ? 'लंबित' : 'Pending' },
        { value: 'IN_PROGRESS', label: isHindi ? 'प्रगति में' : 'In Progress' },
        { value: 'RESOLVED', label: isHindi ? 'समाधान' : 'Resolved' },
        { value: 'REJECTED', label: isHindi ? 'अस्वीकृत' : 'Rejected' },
    ];

    return (
        <div className="dashboard-card border-border p-4 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-4">
            <div className="flex-1 space-y-2">
                <Label className="dashboard-label">
                    {isHindi ? 'खोजें (नाम, पिता का नाम, मोबाइल)' : 'Search (Name, Father Name, Mobile)'}
                </Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    {isHindi ? (
                        <NewReactTransliterate
                            renderComponent={(props) => (
                                <Input
                                    {...props}
                                    className="pl-9 h-10 w-full bg-background border-border"
                                />
                            )}
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                            lang="hi"
                            placeholder="नाम, पिता का नाम या मोबाइल नंबर से खोजें..."
                            containerClassName="relative w-full"
                        />
                    ) : (
                        <Input
                            className="pl-9 h-10 bg-background border-border"
                            placeholder="Search by Name, Father's Name or Mobile..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    )}
                </div>
            </div>

            <div className="w-full sm:w-[200px] space-y-2">
                <Label className="dashboard-label">
                    {isHindi ? 'स्थिति चुनें' : 'Filter by Status'}
                </Label>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-10 w-full bg-background border-border">
                        <SelectValue placeholder={isHindi ? 'स्थिति चुनें' : 'Select Status'} />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <span className="flex items-center gap-2 justify-between w-full min-w-[120px]">
                                    {option.label}
                                    <span className="ml-auto text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                                        {statusCounts[option.value] || 0}
                                    </span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isSearching && (
                <div className="flex items-center justify-center p-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default function ApplicationSearch(props: ApplicationSearchProps) {
    return (
        <Suspense>
            <ApplicationSearchContent {...props} />
        </Suspense>
    );
}
