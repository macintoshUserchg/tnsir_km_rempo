'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Globe, Phone, Share2, Type } from 'lucide-react';
import { toast } from 'sonner';
import { NewReactTransliterate } from 'new-react-transliterate';
import 'new-react-transliterate/styles.css';

interface SettingsFormProps {
    locale: string;
    initialSettings: Record<string, string>;
}

export default function SettingsForm({ locale, initialSettings }: SettingsFormProps) {
    const isHindi = locale === 'hi';
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!res.ok) throw new Error('Failed to update settings');

            toast.success(isHindi ? 'सेटिंग्स अपडेट की गईं' : 'Settings updated successfully');
        } catch (error) {
            console.error(error);
            toast.error(isHindi ? 'सेटिंग्स अपडेट करने में विफल' : 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="general">{isHindi ? 'सामान्य' : 'General'}</TabsTrigger>
                    <TabsTrigger value="contact">{isHindi ? 'संपर्क' : 'Contact'}</TabsTrigger>
                    <TabsTrigger value="social">{isHindi ? 'सोशल मीडिया' : 'Social'}</TabsTrigger>
                    <TabsTrigger value="typography">{isHindi ? 'टाइपोग्राफी' : 'Typography'}</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4 mt-6">
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'वेबसाइट मूल विवरण' : 'Website Basic Details'}</CardTitle>
                                    <CardDescription className="dashboard-label">{isHindi ? 'साइट का शीर्षक और विवरण' : 'Site title and description'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="dashboard-label">{isHindi ? 'साइट का शीर्षक (हिंदी)' : 'Site Title (Hindi)'}</Label>
                                <NewReactTransliterate
                                    renderComponent={(props) => (
                                        <Input
                                            {...props}
                                            className="h-10 bg-background border-border"
                                            placeholder="डॉ. किरोड़ी लाल मीणा"
                                        />
                                    )}
                                    value={settings['site_title_hi'] || ''}
                                    onChangeText={(text) => handleChange('site_title_hi', text)}
                                    lang="hi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="dashboard-label">{isHindi ? 'साइट का शीर्षक (अंग्रेजी)' : 'Site Title (English)'}</Label>
                                <Input
                                    value={settings['site_title_en'] || ''}
                                    onChange={(e) => handleChange('site_title_en', e.target.value)}
                                    placeholder="Dr. Kirodi Lal Meena"
                                    className="h-10 bg-background border-border"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Settings */}
                <TabsContent value="contact" className="space-y-4 mt-6">
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'संपर्क जानकारी' : 'Contact Information'}</CardTitle>
                                    <CardDescription className="dashboard-label">{isHindi ? 'पता, ईमेल और फोन नंबर' : 'Address, Email and Phone Number'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'ईमेल' : 'Email'}</Label>
                                    <Input
                                        type="email"
                                        value={settings['contact_email'] || ''}
                                        onChange={(e) => handleChange('contact_email', e.target.value)}
                                        placeholder="contact@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'फोन नंबर' : 'Phone Number'}</Label>
                                    <Input
                                        type="tel"
                                        value={settings['contact_phone'] || ''}
                                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                                        placeholder="+91 1234567890"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="dashboard-label">{isHindi ? 'पता (हिंदी)' : 'Address (Hindi)'}</Label>
                                <NewReactTransliterate
                                    renderComponent={(props) => (
                                        <Input
                                            {...props}
                                            className="h-10 bg-background border-border"
                                            placeholder="कार्यालय का पता"
                                        />
                                    )}
                                    value={settings['contact_address_hi'] || ''}
                                    onChangeText={(text) => handleChange('contact_address_hi', text)}
                                    lang="hi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="dashboard-label">{isHindi ? 'पता (अंग्रेजी)' : 'Address (English)'}</Label>
                                <Input
                                    value={settings['contact_address_en'] || ''}
                                    onChange={(e) => handleChange('contact_address_en', e.target.value)}
                                    placeholder="Office Address"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Settings */}
                <TabsContent value="social" className="space-y-4 mt-6">
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                                    <Share2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'सोशल मीडिया फीड' : 'Social Media Feed'}</CardTitle>
                                    <CardDescription className="dashboard-label">{isHindi ? 'होमपेज पर फेसबुक और ट्विटर फीड लिंक करें' : 'Link Facebook and Twitter feeds on homepage'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="dashboard-label">{isHindi ? 'फेसबुक प्लगइन URL' : 'Facebook Plugin URL'}</Label>
                                <Input
                                    value={settings['social_facebook_embed'] || ''}
                                    onChange={(e) => handleChange('social_facebook_embed', e.target.value)}
                                    placeholder="https://www.facebook.com/plugins/page.php?href=..."
                                    className="h-10 bg-background border-border"
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    {isHindi ? 'फेसबुक पेज प्लगइन का पूरा iframe src URL यहां डालें।' : 'Paste the full iframe src URL from Facebook Page Plugin here.'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label className="dashboard-label">{isHindi ? 'ट्विटर/X प्रोफाइल URL' : 'Twitter/X Profile URL'}</Label>
                                <Input
                                    value={settings['social_twitter_embed'] || ''}
                                    onChange={(e) => handleChange('social_twitter_embed', e.target.value)}
                                    placeholder="https://twitter.com/YourUsername"
                                    className="h-10 bg-background border-border"
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    {isHindi ? 'वह ट्विटर प्रोफाइल लिंक डालें जिसे आप अपनी टाइमलाइन पर दिखाना चाहते हैं।' : 'Enter the Twitter profile link you want to display on your timeline.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Typography Settings */}
                <TabsContent value="typography" className="space-y-4 mt-6">
                    <Card className="dashboard-card border-0">
                        <CardHeader className="border-b border-border bg-muted/30 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <Type className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <CardTitle className="dashboard-section">{isHindi ? 'टाइपोग्राफी सेटिंग्स' : 'Typography Settings'}</CardTitle>
                                    <CardDescription className="dashboard-label">{isHindi ? 'वेबसाइट के लिए वैश्विक फ़ॉन्ट आकार' : 'Global font sizes and weights for the website'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Global Base */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'आधार फ़ॉन्ट आकार (px)' : 'Base Font Size (px)'}</Label>
                                    <Input
                                        type="number"
                                        value={settings['typo_site_base_size'] || '16'}
                                        onChange={(e) => handleChange('typo_site_base_size', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'बॉडी फ़ॉन्ट वेट' : 'Body Font Weight'}</Label>
                                    <Input
                                        type="number"
                                        step="100"
                                        min="100"
                                        max="900"
                                        value={settings['typo_site_body_weight'] || '400'}
                                        onChange={(e) => handleChange('typo_site_body_weight', e.target.value)}
                                    />
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Header / Nav */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'हेडर नेविगेशन आकार (px)' : 'Header Nav Size (px)'}</Label>
                                    <Input
                                        type="number"
                                        value={settings['typo_header_nav_size'] || '14'}
                                        onChange={(e) => handleChange('typo_header_nav_size', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'हेडर नेविगेशन वेट' : 'Header Nav Weight'}</Label>
                                    <Input
                                        type="number"
                                        step="100"
                                        value={settings['typo_header_nav_weight'] || '500'}
                                        onChange={(e) => handleChange('typo_header_nav_weight', e.target.value)}
                                    />
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Footer */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'फुटर शीर्षक आकार (px)' : 'Footer Title Size (px)'}</Label>
                                    <Input
                                        type="number"
                                        value={settings['typo_footer_title_size'] || '18'}
                                        onChange={(e) => handleChange('typo_footer_title_size', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dashboard-label">{isHindi ? 'फुटर बॉडी आकार (px)' : 'Footer Body Size (px)'}</Label>
                                    <Input
                                        type="number"
                                        value={settings['typo_footer_body_size'] || '14'}
                                        onChange={(e) => handleChange('typo_footer_body_size', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isHindi ? 'सहेज रहा है...' : 'Saving...'}
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            {isHindi ? 'परिवर्तन सहेजें' : 'Save Changes'}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
