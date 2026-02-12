import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image as ImageIcon, Video, FolderOpen, PlaySquare } from 'lucide-react';
import GalleryManager from '@/components/admin/GalleryManager';
import VideoManager from '@/components/admin/VideoManager';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function MediaPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'मीडिया सेंटर' : 'Media Center'}
                </h1>
                <p className="dashboard-body mt-1">
                    {isHindi ? 'फोटो गैलरी और वीडियो लाइब्रेरी को प्रबंधित करें' : 'Manage photo galleries and video library'}
                </p>
            </div>

            <Tabs defaultValue="gallery" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="gallery">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        {isHindi ? 'फोटो गैलरी' : 'Photo Gallery'}
                    </TabsTrigger>
                    <TabsTrigger value="videos">
                        <Video className="mr-2 h-4 w-4" />
                        {isHindi ? 'वीडियो' : 'Videos'}
                    </TabsTrigger>
                </TabsList>

                {/* GALLERY TAB */}
                <TabsContent value="gallery" className="space-y-4">
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                    <FolderOpen className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'फोटो एल्बम' : 'Photo Albums'}</CardTitle>
                                    <CardDescription className="dashboard-label">{isHindi ? 'अपने ईवेंट फ़ोटो व्यवस्थित करें' : 'Organize your event photos'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <GalleryManager locale={locale} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* VIDEOS TAB */}
                <TabsContent value="videos" className="space-y-4">
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <PlaySquare className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'वीडियो लाइब्रेरी' : 'Video Library'}</CardTitle>
                                    <CardDescription className="dashboard-label">{isHindi ? 'यूट्यूब और अन्य वीडियो लिंक' : 'YouTube and other video links'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <VideoManager locale={locale} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
