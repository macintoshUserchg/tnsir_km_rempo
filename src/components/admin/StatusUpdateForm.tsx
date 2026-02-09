'use client';

import { useState, useTransition } from 'react';
import { AppStatus } from '@prisma/client';
import { updateApplicationStatus } from '@/app/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StatusUpdateFormProps {
    applicationId: number;
    currentStatus: AppStatus;
    locale: string;
}

export default function StatusUpdateForm({ applicationId, currentStatus, locale }: StatusUpdateFormProps) {
    const isHindi = locale === 'hi';
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<AppStatus>(currentStatus);
    const [note, setNote] = useState('');
    const [success, setSuccess] = useState(false);

    const statusOptions = [
        { value: 'PENDING', labelHi: 'लंबित', labelEn: 'Pending' },
        { value: 'IN_PROGRESS', labelHi: 'प्रगति में', labelEn: 'In Progress' },
        { value: 'RESOLVED', labelHi: 'समाधान', labelEn: 'Resolved' },
        { value: 'REJECTED', labelHi: 'अस्वीकृत', labelEn: 'Rejected' },
    ];

    const handleSubmit = () => {
        startTransition(async () => {
            const result = await updateApplicationStatus(applicationId, status, note);

            if (result.success) {
                setSuccess(true);
                setNote('');
                toast.success(isHindi ? 'स्थिति अपडेट हो गई' : 'Status updated successfully');
                setTimeout(() => setSuccess(false), 2000);
            } else {
                toast.error(result.error || (isHindi ? 'त्रुटि हुई' : 'Error occurred'));
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isHindi ? 'स्थिति अपडेट करें' : 'Update Status'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>{isHindi ? 'नई स्थिति' : 'New Status'}</Label>
                    <Select
                        value={status}
                        onValueChange={(value) => setStatus(value as AppStatus)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {isHindi ? option.labelHi : option.labelEn}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>{isHindi ? 'टिप्पणी (वैकल्पिक)' : 'Note (optional)'}</Label>
                    <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={isHindi ? 'अपनी टिप्पणी यहाँ लिखें...' : 'Add your note here...'}
                        rows={3}
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isPending || status === currentStatus}
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : success ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                    ) : null}
                    {isHindi ? 'अपडेट करें' : 'Update'}
                </Button>
            </CardContent>
        </Card>
    );
}
