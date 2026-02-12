import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Shield, Bell, Database, Key, LogOut, RefreshCw, Mail } from 'lucide-react';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import SettingsForm from '@/components/admin/SettingsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    const session = await auth();
    const user = session?.user;

    // Fetch stats
    const [userCount, appCount, vidhansabhaCount, workTypeCount] = await Promise.all([
        prisma.user.count(),
        prisma.citizenApp.count(),
        prisma.vidhansabha.count(),
        prisma.workType.count(),
    ]);

    // Fetch site settings
    const settings = await prisma.siteSetting.findMany();
    const formattedSettings = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="dashboard-title">
                    {isHindi ? 'सेटिंग्स' : 'Settings'}
                </h1>
                <p className="dashboard-body mt-1">
                    {isHindi ? 'सिस्टम और वेबसाइट सेटिंग्स प्रबंधित करें' : 'Manage system and website settings'}
                </p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="account">{isHindi ? 'खाता और सिस्टम' : 'Account & System'}</TabsTrigger>
                    <TabsTrigger value="site">{isHindi ? 'वेबसाइट कॉन्फ़िगरेशन' : 'Site Configuration'}</TabsTrigger>
                </TabsList>

                {/* ACCOUNT & SYSTEM TAB */}
                <TabsContent value="account">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Section */}
                            <Card className="dashboard-card border-0">
                                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="dashboard-section">{isHindi ? 'प्रोफ़ाइल' : 'Profile'}</CardTitle>
                                            <CardDescription className="dashboard-label">{isHindi ? 'आपकी खाता जानकारी' : 'Your account information'}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-6 mb-8 p-4 bg-muted/20 rounded-2xl border border-border/50">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-1">{user?.name || 'Admin'}</h3>
                                            <p className="dashboard-body text-sm">{user?.email || 'admin@example.com'}</p>
                                            <Badge className="mt-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 border-none px-3 py-1">
                                                {isHindi ? 'व्यवस्थापक' : 'Administrator'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border/50 transition-all hover:bg-muted/80">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Mail className="h-4 w-4 text-orange-600/70" />
                                                <span className="dashboard-label">{isHindi ? 'ईमेल' : 'Email'}</span>
                                            </div>
                                            <p className="dashboard-body font-bold text-sm truncate">{user?.email || 'admin@example.com'}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-xl border border-border/50 transition-all hover:bg-muted/80">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Shield className="h-4 w-4 text-orange-600/70" />
                                                <span className="dashboard-label">{isHindi ? 'भूमिका' : 'Role'}</span>
                                            </div>
                                            <p className="dashboard-body font-bold">{isHindi ? 'एडमिन' : 'ADMIN'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Info */}
                            <Card className="dashboard-card border-0">
                                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shadow-sm">
                                            <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="dashboard-section">{isHindi ? 'सिस्टम जानकारी' : 'System Information'}</CardTitle>
                                            <CardDescription className="dashboard-label">{isHindi ? 'डेटाबेस और एप्लिकेशन स्थिति' : 'Database and application status'}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-center border border-blue-100 dark:border-blue-900/30">
                                            <p className="dashboard-stat text-2xl text-blue-600">{appCount}</p>
                                            <p className="dashboard-label mt-1">{isHindi ? 'आवेदन' : 'Applications'}</p>
                                        </div>
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-center border border-emerald-100 dark:border-emerald-900/30">
                                            <p className="dashboard-stat text-2xl text-emerald-600">{userCount}</p>
                                            <p className="dashboard-label mt-1">{isHindi ? 'उपयोगकर्ता' : 'Users'}</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl text-center border border-orange-100 dark:border-orange-900/30">
                                            <p className="dashboard-stat text-2xl text-orange-600">{vidhansabhaCount}</p>
                                            <p className="dashboard-label mt-1">{isHindi ? 'विधानसभाएं' : 'Vidhansabhas'}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl text-center border border-purple-100 dark:border-purple-900/30">
                                            <p className="dashboard-stat text-2xl text-purple-600">{workTypeCount}</p>
                                            <p className="dashboard-label mt-1">{isHindi ? 'कार्य प्रकार' : 'Work Types'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="dashboard-card border-0">
                                <CardHeader className="border-b border-border bg-muted/30 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shadow-sm">
                                            <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="dashboard-section">{isHindi ? 'त्वरित क्रियाएं' : 'Quick Actions'}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <Button variant="ghost" className="w-full justify-start gap-3 h-12 dashboard-body hover:bg-muted/50 transition-all font-bold">
                                        <Key className="h-4 w-4 text-orange-600" />
                                        {isHindi ? 'पासवर्ड बदलें' : 'Change Password'}
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start gap-3 h-12 dashboard-body hover:bg-muted/50 transition-all font-bold">
                                        <Bell className="h-4 w-4 text-orange-600" />
                                        {isHindi ? 'सूचनाएं' : 'Notifications'}
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start gap-3 h-12 dashboard-body hover:bg-muted/50 transition-all font-bold">
                                        <RefreshCw className="h-4 w-4 text-orange-600" />
                                        {isHindi ? 'कैश साफ़ करें' : 'Clear Cache'}
                                    </Button>
                                    <hr className="my-2 border-border" />
                                    <a href="/api/auth/signout">
                                        <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-all">
                                            <LogOut className="h-4 w-4" />
                                            {isHindi ? 'लॉग आउट' : 'Sign Out'}
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>

                            {/* App Version */}
                            <Card className="dashboard-card border-0 bg-gradient-to-br from-muted to-muted/50 p-[1px]">
                                <div className="bg-muted/50 rounded-[inherit] p-6 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-card shadow-sm flex items-center justify-center mx-auto mb-4 border border-border transform -rotate-6 transition-transform hover:rotate-0">
                                        <span className="text-2xl font-bold text-orange-600">KL</span>
                                    </div>
                                    <h3 className="dashboard-section mb-1">
                                        {isHindi ? 'डॉ. किरोड़ी लाल' : 'Dr. Kirodi Lal'}
                                    </h3>
                                    <p className="dashboard-label mb-4">
                                        {isHindi ? 'प्रशासनिक पैनल' : 'Admin Panel'}
                                    </p>
                                    <Badge variant="outline" className="text-xs border-orange-500/20 text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 px-4 py-1">
                                        v1.0.0
                                    </Badge>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* SITE CONFIGURATION TAB */}
                <TabsContent value="site">
                    <SettingsForm locale={locale} initialSettings={formattedSettings} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
