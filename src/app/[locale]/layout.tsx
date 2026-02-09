import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from '@/components/SplashScreen';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "डॉ. किरोड़ी लाल मीणा | Dr. Kirodi Lal Meena",
    description: "डॉ. किरोड़ी लाल मीणा की आधिकारिक वेबसाइट - Official website of Dr. Kirodi Lal Meena",
};

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as 'hi' | 'en')) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'hi' ? 'ltr' : 'ltr'}>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <SplashScreen />
                    {children}
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
