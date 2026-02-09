'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import { applicationSchema, ApplicationFormData } from '@/lib/validations/application';
import { submitApplication } from '@/app/actions/application';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, User, Users } from 'lucide-react';

type Vidhansabha = { id: number; nameHi: string; nameEn: string | null };
type WorkType = { id: number; nameHi: string; nameEn: string | null };

interface ApplicationFormProps {
    vidhansabhas: Vidhansabha[];
    workTypes: WorkType[];
}

export default function ApplicationForm({ vidhansabhas, workTypes }: ApplicationFormProps) {
    const t = useTranslations('application');
    const locale = useLocale();
    const isHindi = locale === 'hi';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; cNumber?: string; error?: string } | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            applicantType: 'CITIZEN',
        },
    });

    const applicantType = watch('applicantType');

    const onSubmit = async (data: ApplicationFormData) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await submitApplication(data);
            setSubmitResult(result);

            if (result.success) {
                reset();
            }
        } catch {
            setSubmitResult({ success: false, error: 'आवेदन जमा करने में त्रुटि हुई' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success state
    if (submitResult?.success) {
        return (
            <Card className="max-w-xl mx-auto">
                <CardContent className="py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-700 mb-2">
                        {t('successMessage')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {t('applicationNumber')}:
                    </p>
                    <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-4 inline-block">
                        <span className="text-2xl font-mono font-bold text-orange-600">
                            {submitResult.cNumber}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        {isHindi
                            ? 'कृपया इस नंबर को सुरक्षित रखें। इससे आप अपने आवेदन की स्थिति ट्रैक कर सकते हैं।'
                            : 'Please save this number. You can track your application status with it.'}
                    </p>
                    <Button
                        className="mt-6 bg-orange-600 hover:bg-orange-700"
                        onClick={() => setSubmitResult(null)}
                    >
                        {isHindi ? 'नया आवेदन करें' : 'Submit New Application'}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Error Alert */}
            {submitResult?.error && (
                <Alert variant="destructive">
                    <AlertDescription>{submitResult.error}</AlertDescription>
                </Alert>
            )}

            {/* Applicant Type Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('applicantType')}</CardTitle>
                    <CardDescription>
                        {isHindi ? 'आप किस श्रेणी में आवेदन कर रहे हैं?' : 'Which category are you applying under?'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={applicantType}
                        onValueChange={(value) => setValue('applicantType', value as 'CITIZEN' | 'PUBLIC_REP')}
                        className="grid grid-cols-2 gap-4"
                    >
                        <Label
                            htmlFor="citizen"
                            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${applicantType === 'CITIZEN' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <RadioGroupItem value="CITIZEN" id="citizen" className="sr-only" />
                            <User className={`h-8 w-8 ${applicantType === 'CITIZEN' ? 'text-orange-500' : 'text-gray-400'}`} />
                            <span className={applicantType === 'CITIZEN' ? 'font-medium text-orange-700' : 'text-gray-600'}>
                                {t('citizen')}
                            </span>
                        </Label>
                        <Label
                            htmlFor="public_rep"
                            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${applicantType === 'PUBLIC_REP' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <RadioGroupItem value="PUBLIC_REP" id="public_rep" className="sr-only" />
                            <Users className={`h-8 w-8 ${applicantType === 'PUBLIC_REP' ? 'text-orange-500' : 'text-gray-400'}`} />
                            <span className={applicantType === 'PUBLIC_REP' ? 'font-medium text-orange-700' : 'text-gray-600'}>
                                {t('publicRepresentative')}
                            </span>
                        </Label>
                    </RadioGroup>
                    {errors.applicantType && (
                        <p className="text-sm text-red-500 mt-2">{errors.applicantType.message}</p>
                    )}
                </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'व्यक्तिगत विवरण' : 'Personal Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('name')} *</Label>
                            <Input
                                id="name"
                                {...register('name')}
                                placeholder={isHindi ? 'आपका पूरा नाम' : 'Your full name'}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fatherName">{t('fatherName')} *</Label>
                            <Input
                                id="fatherName"
                                {...register('fatherName')}
                                placeholder={isHindi ? 'पिता का नाम' : "Father's name"}
                            />
                            {errors.fatherName && (
                                <p className="text-sm text-red-500">{errors.fatherName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">{t('address')} *</Label>
                        <Textarea
                            id="address"
                            {...register('address')}
                            placeholder={isHindi ? 'पूरा पता (गाँव/मोहल्ला, तहसील, जिला)' : 'Complete address'}
                            rows={3}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobile">{t('mobile')} *</Label>
                            <Input
                                id="mobile"
                                {...register('mobile')}
                                placeholder="9876543210"
                                maxLength={10}
                            />
                            {errors.mobile && (
                                <p className="text-sm text-red-500">{errors.mobile.message}</p>
                            )}
                        </div>

                        {applicantType === 'PUBLIC_REP' && (
                            <div className="space-y-2">
                                <Label htmlFor="post">{t('post')}</Label>
                                <Input
                                    id="post"
                                    {...register('post')}
                                    placeholder={isHindi ? 'जैसे: सरपंच, पार्षद' : 'e.g., Sarpanch, Councillor'}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Application Details */}
            <Card>
                <CardHeader>
                    <CardTitle>{isHindi ? 'आवेदन विवरण' : 'Application Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('vidhansabha')} *</Label>
                            <Select
                                onValueChange={(value) => setValue('vidhansabhaId', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectVidhansabha')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {vidhansabhas.map((vs) => (
                                        <SelectItem key={vs.id} value={vs.id.toString()}>
                                            {isHindi ? vs.nameHi : (vs.nameEn || vs.nameHi)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.vidhansabhaId && (
                                <p className="text-sm text-red-500">{errors.vidhansabhaId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{t('workType')} *</Label>
                            <Select
                                onValueChange={(value) => setValue('workTypeId', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectWorkType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {workTypes.map((wt) => (
                                        <SelectItem key={wt.id} value={wt.id.toString()}>
                                            {isHindi ? wt.nameHi : (wt.nameEn || wt.nameHi)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.workTypeId && (
                                <p className="text-sm text-red-500">{errors.workTypeId.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t('description')} *</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder={isHindi ? 'अपनी समस्या या आवेदन का विस्तृत विवरण दें...' : 'Describe your issue or request in detail...'}
                            rows={5}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-lg"
                disabled={isSubmitting}
            >
                {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {t('submitApplication')}
            </Button>
        </form>
    );
}
