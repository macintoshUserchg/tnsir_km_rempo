import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SplashScreen } from '@/components/SplashScreen';
import { ThemeProvider } from "@/components/theme-provider";
import TypographySync from "@/components/layout/TypographySync";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    weight: ["400", "500"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
    variable: "--font-hindi",
    subsets: ["devanagari"],
    weight: ["400", "500", "600", "700"],
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
        <html lang={locale} dir={locale === 'hi' ? 'ltr' : 'ltr'} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansDevanagari.variable} antialiased ${locale === 'hi' ? 'lang-hi' : ''}`}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SplashScreen />
                        <TypographySync />
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
