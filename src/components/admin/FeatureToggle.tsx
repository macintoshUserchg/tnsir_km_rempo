'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { toggleFeatureSetting } from '@/app/actions/admin';

interface FeatureToggleProps {
    featureKey: string;
    label: string;
    labelHi: string;
    description: string;
    descriptionHi: string;
    initialValue: boolean;
    locale: string;
}

export default function FeatureToggle({
    featureKey,
    label,
    labelHi,
    description,
    descriptionHi,
    initialValue,
    locale,
}: FeatureToggleProps) {
    const isHindi = locale === 'hi';
    const [enabled, setEnabled] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (checked: boolean) => {
        setEnabled(checked);
        startTransition(async () => {
            const result = await toggleFeatureSetting(featureKey, checked);
            if (result.success) {
                toast.success(
                    isHindi
                        ? `सुविधा ${checked ? 'सक्षम' : 'अक्षम'} की गई`
                        : `Feature ${checked ? 'enabled' : 'disabled'}`
                );
            } else {
                setEnabled(!checked); // Revert on error
                toast.error(result.error || (isHindi ? 'त्रुटि हुई' : 'Error occurred'));
            }
        });
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div className="space-y-0.5">
                <Label className="text-base font-medium">
                    {isHindi ? labelHi : label}
                </Label>
                <p className="text-sm text-muted-foreground">
                    {isHindi ? descriptionHi : description}
                </p>
            </div>
            <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={isPending}
                className="data-[state=checked]:bg-orange-600"
            />
        </div>
    );
}
