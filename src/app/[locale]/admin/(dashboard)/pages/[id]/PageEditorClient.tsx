'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { Page, PageSection, SectionType } from '@prisma/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import SectionManager from './SectionManager';
import { TEMPLATES } from '@/config/templates';
import { Layout, CheckCircle2 } from 'lucide-react';

interface PageEditorClientProps {
    locale: string;
    page?: Page & { sections: PageSection[] };
    isNew?: boolean;
}

export default function PageEditorClient({ locale, page, isNew = false }: PageEditorClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        titleHi: page?.titleHi || '',
        titleEn: page?.titleEn || '',
        slug: page?.slug || '',
        seoTitle: page?.seoTitle || '',
        seoDesc: page?.seoDesc || '',
        isPublished: page?.isPublished || false,
        typography: (page?.typography as any) || {},
        template: (page as any)?.template || 'blank',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPublished: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${page?.id}`;
            const method = isNew ? 'POST' : 'PATCH';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to save page');
            }

            const data = await res.json();
            toast.success(isNew ? 'Page created successfully' : 'Page updated successfully');

            if (isNew) {
                router.push(`/admin/pages/${data.id}`);
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" type="button" onClick={() => router.back()} className="rounded-full h-10 w-10 hover:border-orange-500 hover:text-orange-600 transition-all">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="dashboard-title">
                            {isNew ? 'Create New Page' : `Edit Page: ${formData.titleEn || formData.titleHi}`}
                        </h1>
                        <p className="dashboard-body mt-1">
                            {isNew ? 'Setup a new dynamic page on your site.' : 'Customize page layout, sections and SEO settings.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 px-6">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isNew ? 'Create Page' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="settings" className="w-full">
                <TabsList className="dashboard-tabs w-full lg:w-fit">
                    <TabsTrigger value="settings" className="px-8 whitespace-nowrap">Page Settings</TabsTrigger>
                    <TabsTrigger value="typography" className="px-8 whitespace-nowrap">Typography</TabsTrigger>
                    <TabsTrigger value="content" disabled={isNew} className="px-8 whitespace-nowrap">Content Helper</TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="space-y-6 mt-8">
                    <Card className="dashboard-card border border-border/40 overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <CardTitle className="dashboard-section">Basic Information</CardTitle>
                            <CardDescription className="dashboard-label">Set the title and URL for your page.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="titleHi" className="dashboard-label">Title (Hindi)</Label>
                                    <Input
                                        id="titleHi"
                                        name="titleHi"
                                        value={formData.titleHi}
                                        onChange={handleChange}
                                        required
                                        placeholder="Hindi Title"
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titleEn" className="dashboard-label">Title (English)</Label>
                                    <Input
                                        id="titleEn"
                                        name="titleEn"
                                        value={formData.titleEn}
                                        onChange={handleChange}
                                        placeholder="English Title"
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="dashboard-label">Slug (URL)</Label>
                                <div className="flex gap-2">
                                    <div className="bg-muted/50 px-3 flex items-center rounded-md border border-border/50 text-muted-foreground whitespace-nowrap dashboard-mono text-xs">
                                        /{locale}/
                                    </div>
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        required
                                        placeholder="page-slug"
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>

                            {isNew && (
                                <div className="space-y-4 pt-4 border-t border-border/40">
                                    <Label className="dashboard-section text-sm uppercase tracking-wider opacity-60">Select Page Template</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                        {TEMPLATES.map((t) => (
                                            <div
                                                key={t.id}
                                                className={cn(
                                                    "relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md",
                                                    formData.template === t.id
                                                        ? "border-orange-600 bg-orange-50/30 dark:bg-orange-950/20"
                                                        : "border-border/40 bg-card hover:border-orange-200"
                                                )}
                                                onClick={() => setFormData(prev => ({ ...prev, template: t.id }))}
                                            >
                                                {formData.template === t.id && (
                                                    <div className="absolute top-2 right-2 text-orange-600">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                                                    formData.template === t.id ? "bg-orange-600 text-white" : "bg-muted text-muted-foreground"
                                                )}>
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <h4 className="font-bold text-sm mb-1">{t.name}</h4>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground italic">
                                        Note: Selected section layout will be automatically created once you save the page.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="dashboard-card border border-border/40 overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <CardTitle className="dashboard-section">SEO & Status</CardTitle>
                            <CardDescription className="dashboard-label">Configure search engine settings and publication status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seoTitle" className="dashboard-label">SEO Title</Label>
                                    <Input
                                        id="seoTitle"
                                        name="seoTitle"
                                        value={formData.seoTitle}
                                        onChange={handleChange}
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seoDesc" className="dashboard-label">SEO Description</Label>
                                    <Textarea
                                        id="seoDesc"
                                        name="seoDesc"
                                        value={formData.seoDesc}
                                        onChange={handleChange}
                                        rows={3}
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20 min-h-[100px]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/10 border border-border/30">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isPublished" className="text-base font-semibold">Publish Page</Label>
                                    <p className="text-sm text-muted-foreground">Make this page visible to the public.</p>
                                </div>
                                <Switch
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6 mt-8">
                    <Card className="dashboard-card border border-border/40 overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <CardTitle className="dashboard-section">Typography Overrides</CardTitle>
                            <CardDescription className="dashboard-label">
                                Override global typography settings for this specific page. Leave empty to use defaults.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="dashboard-label">Base Font Size (px)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Default: 16"
                                        value={formData.typography.baseSize || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            typography: { ...prev.typography, baseSize: e.target.value }
                                        }))}
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dashboard-label">Body Font Weight</Label>
                                    <Input
                                        type="number"
                                        step="100"
                                        placeholder="Default: 400"
                                        value={formData.typography.bodyWeight || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            typography: { ...prev.typography, bodyWeight: e.target.value }
                                        }))}
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>

                            <hr className="border-border/40" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="dashboard-label">Hero Title Size (px)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Default: 48"
                                        value={formData.typography.heroTitleSize || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            typography: { ...prev.typography, heroTitleSize: e.target.value }
                                        }))}
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dashboard-label">Hero Description Size (px)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Default: 18"
                                        value={formData.typography.heroDescSize || ''}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            typography: { ...prev.typography, heroDescSize: e.target.value }
                                        }))}
                                        className="bg-background border-border/50 focus:border-orange-500/50 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="content" className="mt-8">
                    <Card className="dashboard-card border border-border/40 overflow-hidden">
                        <CardHeader className="border-b border-border/40 bg-muted/20">
                            <CardTitle className="dashboard-section">Content Sections</CardTitle>
                            <CardDescription className="dashboard-label">Build and organize page content sections.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {page && <SectionManager pageId={page.id} sections={page.sections} locale={locale} />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form >
    );
}
