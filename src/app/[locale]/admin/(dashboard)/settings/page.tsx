import { setRequestLocale } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Shield, Bell, Database, Globe, Mail, Phone, Building2, Key, LogOut, RefreshCw } from 'lucide-react';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const isHindi = locale === 'hi';

    const session = await auth();
    const user = session?.user;

    // Fetch some stats
    const [userCount, appCount, vidhansabhaCount, workTypeCount] = await Promise.all([
        prisma.user.count(),
        prisma.citizenApp.count(),
        prisma.vidhansabha.count(),
        prisma.workType.count(),
    ]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isHindi ? 'सेटिंग्स' : 'Settings'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isHindi ? 'सिस्टम और प्रोफ़ाइल सेटिंग्स प्रबंधित करें' : 'Manage system and profile settings'}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Section */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'प्रोफ़ाइल' : 'Profile'}</CardTitle>
                                    <CardDescription>{isHindi ? 'आपकी खाता जानकारी' : 'Your account information'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{user?.name || 'Admin'}</h3>
                                    <p className="text-gray-500">{user?.email || 'admin@example.com'}</p>
                                    <Badge className="mt-2 bg-orange-100 text-orange-700 hover:bg-orange-100">
                                        {isHindi ? 'व्यवस्थापक' : 'Administrator'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">{isHindi ? 'ईमेल' : 'Email'}</span>
                                    </div>
                                    <p className="font-medium text-gray-900">{user?.email || 'admin@example.com'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">{isHindi ? 'भूमिका' : 'Role'}</span>
                                    </div>
                                    <p className="font-medium text-gray-900">{isHindi ? 'एडमिन' : 'ADMIN'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Database className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'सिस्टम जानकारी' : 'System Information'}</CardTitle>
                                    <CardDescription>{isHindi ? 'डेटाबेस और एप्लिकेशन स्थिति' : 'Database and application status'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-blue-600">{appCount}</p>
                                    <p className="text-sm text-gray-600">{isHindi ? 'आवेदन' : 'Applications'}</p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-emerald-600">{userCount}</p>
                                    <p className="text-sm text-gray-600">{isHindi ? 'उपयोगकर्ता' : 'Users'}</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-orange-600">{vidhansabhaCount}</p>
                                    <p className="text-sm text-gray-600">{isHindi ? 'विधानसभाएं' : 'Vidhansabhas'}</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-purple-600">{workTypeCount}</p>
                                    <p className="text-sm text-gray-600">{isHindi ? 'कार्य प्रकार' : 'Work Types'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'कार्यालय संपर्क' : 'Office Contact'}</CardTitle>
                                    <CardDescription>{isHindi ? 'डॉ. किरोड़ी लाल मीणा कार्यालय' : 'Dr. Kirodi Lal Meena Office'}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'पता' : 'Address'}</p>
                                        <p className="font-medium text-gray-900">
                                            {isHindi
                                                ? 'ए-302, राजस्थान भवन, नई दिल्ली'
                                                : 'A-302, Rajasthan Bhawan, New Delhi'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'फोन' : 'Phone'}</p>
                                        <p className="font-medium text-gray-900">+91 141 2222222</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{isHindi ? 'ईमेल' : 'Email'}</p>
                                        <p className="font-medium text-gray-900">contact@drkiodilal.in</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="border-b bg-gray-50/50 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <Settings className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{isHindi ? 'त्वरित क्रियाएं' : 'Quick Actions'}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                                <Key className="h-4 w-4 text-gray-500" />
                                {isHindi ? 'पासवर्ड बदलें' : 'Change Password'}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                                <Bell className="h-4 w-4 text-gray-500" />
                                {isHindi ? 'सूचनाएं' : 'Notifications'}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                                <Globe className="h-4 w-4 text-gray-500" />
                                {isHindi ? 'भाषा सेटिंग्स' : 'Language Settings'}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                                <RefreshCw className="h-4 w-4 text-gray-500" />
                                {isHindi ? 'कैश साफ़ करें' : 'Clear Cache'}
                            </Button>
                            <hr className="my-2" />
                            <a href="/api/auth/signout">
                                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <LogOut className="h-4 w-4" />
                                    {isHindi ? 'लॉग आउट' : 'Sign Out'}
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                    {/* App Version */}
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">KL</span>
                            </div>
                            <h3 className="font-bold text-gray-900">
                                {isHindi ? 'डॉ. किरोड़ी लाल' : 'Dr. Kirodi Lal'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                                {isHindi ? 'प्रशासनिक पैनल' : 'Admin Panel'}
                            </p>
                            <Badge variant="outline" className="text-xs">
                                v1.0.0
                            </Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
