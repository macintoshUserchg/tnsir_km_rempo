'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const locale = useLocale();
    const router = useRouter();
    const isHindi = locale === 'hi';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(isHindi ? 'गलत ईमेल या पासवर्ड' : 'Invalid email or password');
            } else {
                router.push(`/${locale}/admin/dashboard`);
                router.refresh();
            }
        } catch (err) {
            setError(isHindi ? 'लॉगिन में त्रुटि हुई' : 'Login error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-500/10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-orange-500/5 to-transparent dark:from-orange-500/10 pointer-events-none" />

            <Card className="w-full max-w-md relative z-10 shadow-xl border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-1">
                    <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-950/50 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                        <Lock className="h-8 w-8 text-orange-600 dark:text-orange-500" />
                    </div>
                    <CardTitle className="dashboard-title text-2xl">
                        {isHindi ? 'एडमिन लॉगिन' : 'Admin Login'}
                    </CardTitle>
                    <CardDescription className="dashboard-body">
                        {isHindi
                            ? 'अपने क्रेडेंशियल्स के साथ लॉगिन करें'
                            : 'Sign in with your credentials'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="dashboard-label">{isHindi ? 'ईमेल' : 'Email'}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@drkiodilal.in"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="dashboard-label">{isHindi ? 'पासवर्ड' : 'Password'}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isHindi ? 'लॉगिन करें' : 'Sign In'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
