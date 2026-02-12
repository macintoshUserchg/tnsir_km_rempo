'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Type, Image as ImageIcon, Upload, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewReactTransliterate } from 'new-react-transliterate';
import { useState } from 'react';
import 'new-react-transliterate/styles.css';

interface EventFormFieldsProps {
    locale: string;
    formData: any;
    onChange: (field: string, value: any) => void;
    onUpload: (file: File) => Promise<string>;
}

export const EventFormFields: React.FC<EventFormFieldsProps> = ({
    locale,
    formData,
    onChange,
    onUpload
}) => {
    const isHindi = locale === 'hi';

    return (
        <>
            {/* Section 1: Basic Details */}
            <Card className="dashboard-card border-0">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                            <Type className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'कार्यक्रम विवरण' : 'Event Details'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'मूल जानकारी' : 'Basic Information'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="dashboard-label">
                                {isHindi ? 'शीर्षक (हिंदी)' : 'Title (Hindi)'} <span className="text-red-500">*</span>
                            </Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input
                                        {...props}
                                        className="h-12 bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all font-hindi"
                                    />
                                )}
                                value={formData.titleHi || ''}
                                onChangeText={(text) => onChange('titleHi', text)}
                                lang="hi"
                                placeholder="कार्यक्रम का शीर्षक (हिंदी)"
                                containerClassName="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="dashboard-label">
                                {isHindi ? 'शीर्षक (अंग्रेजी)' : 'Title (English)'}
                            </Label>
                            <Input
                                value={formData.titleEn || ''}
                                onChange={(e) => onChange('titleEn', e.target.value)}
                                placeholder="Event Title (English)"
                                className="h-12 bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="dashboard-label">
                                {isHindi ? 'श्रेणी' : 'Category'} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={formData.category || ''}
                                onChange={(e) => onChange('category', e.target.value)}
                                placeholder="e.g. public-meeting, inauguration"
                                className="h-12 bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium dashboard-section">
                                    {isHindi ? 'आगामी कार्यक्रम' : 'Upcoming Event'}
                                </Label>
                                <div className="text-sm text-muted-foreground dashboard-label">
                                    {isHindi ? 'क्या यह कार्यक्रम भविष्य में है?' : 'Is this event in the future?'}
                                </div>
                            </div>
                            <Switch
                                checked={formData.isUpcoming}
                                onCheckedChange={(checked) => onChange('isUpcoming', checked)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 2: Date & Location */}
            <Card className="dashboard-card border-0">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'तिथि और स्थान' : 'Date & Location'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'समय और जगह' : 'Time and Place'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="dashboard-label">
                            {isHindi ? 'तारीख' : 'Date'} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="datetime-local"
                            value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                            onChange={(e) => onChange('date', new Date(e.target.value))}
                            className="h-12 bg-background border-border text-foreground focus-visible:ring-orange-500 transition-all w-full sm:w-auto"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="dashboard-label">
                                {isHindi ? 'स्थान (हिंदी)' : 'Location (Hindi)'}
                            </Label>
                            <NewReactTransliterate
                                renderComponent={(props) => (
                                    <Input
                                        {...props}
                                        className="h-12 bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all font-hindi"
                                    />
                                )}
                                value={formData.locationHi || ''}
                                onChangeText={(text) => onChange('locationHi', text)}
                                lang="hi"
                                placeholder="कार्यक्रम का स्थान"
                                containerClassName="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="dashboard-label">
                                {isHindi ? 'स्थान (अंग्रेजी)' : 'Location (English)'}
                            </Label>
                            <Input
                                value={formData.locationEn || ''}
                                onChange={(e) => onChange('locationEn', e.target.value)}
                                placeholder="Event Location"
                                className="h-12 bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 3: Description */}
            <Card className="dashboard-card border-0">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                            <Type className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'विवरण' : 'Description'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'कार्यक्रम के बारे में' : 'About the event'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label className="dashboard-label">
                            {isHindi ? 'विवरण (हिंदी)' : 'Description (Hindi)'}
                        </Label>
                        <NewReactTransliterate
                            renderComponent={(props) => (
                                <Textarea
                                    {...props}
                                    className="resize-none bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all font-hindi min-h-[120px]"
                                />
                            )}
                            value={formData.descriptionHi || ''}
                            onChangeText={(text) => onChange('descriptionHi', text)}
                            lang="hi"
                            placeholder="विस्तृत विवरण..."
                            containerClassName="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="dashboard-label">
                            {isHindi ? 'विवरण (अंग्रेजी)' : 'Description (English)'}
                        </Label>
                        <Textarea
                            value={formData.descriptionEn || ''}
                            onChange={(e) => onChange('descriptionEn', e.target.value)}
                            placeholder="Detailed description..."
                            className="resize-none bg-background border-border text-foreground focus-visible:ring-orange-500 placeholder:text-muted-foreground/50 transition-all min-h-[120px]"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Section 4: Images */}
            <Card className="dashboard-card border-0">
                <CardHeader className="pb-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <CardTitle className="dashboard-section">{isHindi ? 'तस्वीरें' : 'Images'}</CardTitle>
                            <CardDescription className="dashboard-label">{isHindi ? 'इवेंट की तस्वीरें अपलोड करें' : 'Upload event images'}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Image upload logic will go here - standard upload component usage */}
                    {/* Image Upload Logic */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Label htmlFor="event-image" className="sr-only">Upload Image</Label>
                                <Input
                                    id="event-image"
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer file:cursor-pointer file:text-orange-600 file:font-semibold"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                const url = await onUpload(file);
                                                onChange('images', [url]); // Replacing existing image for now, can be array push for multiple
                                            } catch (error) {
                                                console.error("Upload failed", error);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {formData.images && formData.images.length > 0 && formData.images[0] && (
                            <div className="relative group w-full sm:w-64 aspect-video rounded-lg overflow-hidden border border-border">
                                <img
                                    src={formData.images[0]}
                                    alt="Event Preview"
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onChange('images', [])}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {!formData.images?.[0] && (
                            <div className="text-sm text-muted-foreground text-center p-8 border border-dashed border-border rounded-lg bg-muted/30">
                                {isHindi ? 'कोई छवि अपलोड नहीं की गई' : 'No image uploaded yet'}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
