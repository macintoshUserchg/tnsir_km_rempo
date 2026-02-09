'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Briefcase, FileText } from 'lucide-react';

interface ApplicationFormFieldsProps {
    locale: string;
    formData: any;
    vidhansabhas: { id: number; nameHi: string; nameEn: string | null }[];
    workTypes: { id: number; nameHi: string; nameEn: string | null }[];
    onChange: (field: string, value: string) => void;
}

export const ApplicationFormFields: React.FC<ApplicationFormFieldsProps> = ({
    locale,
    formData,
    vidhansabhas,
    workTypes,
    onChange
}) => {
    const isHindi = locale === 'hi';

    return (
        <>
            {/* Section 1: Applicant Details */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'आवेदक विवरण' : 'Applicant Details'}</CardTitle>
                            <CardDescription>{isHindi ? 'आवेदक की व्यक्तिगत जानकारी' : 'Personal information of the applicant'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'नाम' : 'Name'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => onChange('name', e.target.value)}
                                required
                                placeholder={isHindi ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'पिता का नाम' : "Father's Name"} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.fatherName}
                                onChange={(e) => onChange('fatherName', e.target.value)}
                                required
                                placeholder={isHindi ? 'पिता का नाम दर्ज करें' : "Enter father's name"}
                                className="h-11"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => onChange('mobile', e.target.value)}
                                required
                                pattern="[0-9]{10}"
                                placeholder="9876543210"
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'विधानसभा' : 'Vidhansabha'} <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.vidhansabhaId} onValueChange={(v) => onChange('vidhansabhaId', v)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue placeholder={isHindi ? 'विधानसभा चुनें' : 'Select Vidhansabha'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {vidhansabhas.map((v) => (
                                        <SelectItem key={v.id} value={v.id.toString()}>
                                            {isHindi ? v.nameHi : (v.nameEn || v.nameHi)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isHindi ? 'पता' : 'Address'} <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            value={formData.address}
                            onChange={(e) => onChange('address', e.target.value)}
                            required
                            rows={3}
                            placeholder={isHindi ? 'पूरा पता दर्ज करें' : 'Enter complete address'}
                            className="resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Applicant Type */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'आवेदक प्रकार' : 'Applicant Type'}</CardTitle>
                            <CardDescription>{isHindi ? 'आवेदक की श्रेणी चुनें' : 'Select the category of applicant'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'CITIZEN'
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                value="CITIZEN"
                                checked={formData.type === 'CITIZEN'}
                                onChange={(e) => onChange('type', e.target.value)}
                                className="w-5 h-5 text-orange-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{isHindi ? 'नागरिक' : 'Citizen'}</div>
                                <div className="text-sm text-gray-500">{isHindi ? 'सामान्य नागरिक' : 'General citizen'}</div>
                            </div>
                        </label>
                        <label
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.type === 'PUBLIC_REP'
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                value="PUBLIC_REP"
                                checked={formData.type === 'PUBLIC_REP'}
                                onChange={(e) => onChange('type', e.target.value)}
                                className="w-5 h-5 text-orange-600"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{isHindi ? 'जनप्रतिनिधि' : 'Public Representative'}</div>
                                <div className="text-sm text-gray-500">{isHindi ? 'निर्वाचित प्रतिनिधि' : 'Elected representative'}</div>
                            </div>
                        </label>
                    </div>

                    {formData.type === 'PUBLIC_REP' && (
                        <div className="space-y-2 pt-2">
                            <Label className="text-sm font-medium text-gray-700">
                                {isHindi ? 'पद / पदनाम' : 'Post / Designation'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.post}
                                onChange={(e) => onChange('post', e.target.value)}
                                required
                                placeholder={isHindi ? 'जैसे: सरपंच, पार्षद, विधायक' : 'e.g., Sarpanch, Councilor, MLA'}
                                className="h-11"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section 3: Work Details */}
            <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                <CardHeader className="pb-4 border-b bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{isHindi ? 'कार्य विवरण' : 'Work Details'}</CardTitle>
                            <CardDescription>{isHindi ? 'आवेदन का कार्य प्रकार और विवरण' : 'Type of work and description'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isHindi ? 'कार्य का प्रकार' : 'Type of Work'} <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.workTypeId} onValueChange={(v) => onChange('workTypeId', v)}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder={isHindi ? 'कार्य प्रकार चुनें' : 'Select work type'} />
                            </SelectTrigger>
                            <SelectContent>
                                {workTypes.map((w) => (
                                    <SelectItem key={w.id} value={w.id.toString()}>
                                        {isHindi ? w.nameHi : (w.nameEn || w.nameHi)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {isHindi ? 'विस्तृत विवरण' : 'Detailed Description'}
                        </Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => onChange('description', e.target.value)}
                            rows={5}
                            placeholder={isHindi ? 'आवेदन का विस्तृत विवरण लिखें...' : 'Write a detailed description of the application...'}
                            className="resize-none"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
