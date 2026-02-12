import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, LayoutGrid, MapPin } from 'lucide-react';
import { prisma } from '@/lib/db';

async function getSettings() {
    const settings = await prisma.siteSetting.findMany({
        where: {
            OR: [
                { group: 'CONTACT' },
                { group: 'SOCIAL' },
                { group: 'GENERAL' },
                { key: 'enablePublicTracking' }
            ]
        },
        select: { key: true, value: true }
    });

    return settings.reduce((acc: Record<string, string>, curr: { key: string; value: string }) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);
}

export default async function Footer() {
    const t = await getTranslations('common');
    const locale = await getLocale();
    const settings = await getSettings();
    const isHindi = locale === 'hi';
    const addressKey = isHindi ? 'contact_address_hi' : 'contact_address_en';

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container-custom py-6 md:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Quick Links - 2 columns */}
                    <div>
                        <h3
                            className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-3 md:mb-4"
                            style={{ fontSize: 'var(--site-footer-title-size)' }}
                        >
                            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                            {t('quickLinks')}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1.5 md:gap-y-2">
                            <Link href="/" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('home')}
                            </Link>
                            <Link href="/biography" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('biography')}
                            </Link>
                            <Link href="/photo-gallery" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('photoGallery')}
                            </Link>
                            <Link href="/press-release" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('pressRelease')}
                            </Link>
                            <Link href="/blog" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('blog')}
                            </Link>
                            <Link href="/events" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('events')}
                            </Link>
                            <Link href="/video-gallery" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> Video Gallery
                            </Link>
                            <Link href="/contact" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('contact')}
                            </Link>
                            {settings['enablePublicTracking'] === 'true' && (
                                <Link href="/track" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                    <span className="text-orange-400">›</span> {t('trackStatus')}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Subscribe Newsletter */}
                    <div>
                        <h3
                            className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-3 md:mb-4"
                            style={{ fontSize: 'var(--site-footer-title-size)' }}
                        >
                            <Mail className="w-4 h-4 md:w-5 md:h-5" />
                            {t('subscribe')} Newsletter
                        </h3>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                className="flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs md:text-sm"
                            />
                            <button
                                type="submit"
                                className="px-4 md:px-5 py-2 md:py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors text-xs md:text-sm"
                            >
                                {t('subscribe')}
                            </button>
                        </form>
                    </div>

                    {/* Contact */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3
                            className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-3 md:mb-4"
                            style={{ fontSize: 'var(--site-footer-title-size)' }}
                        >
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                            {t('contact')}
                        </h3>
                        <div className="space-y-4 text-xs md:text-sm">
                            {settings[addressKey] && (
                                <div className="flex gap-3">
                                    <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">Office:</p>
                                        <p className="text-gray-400">{settings[addressKey]}</p>
                                    </div>
                                </div>
                            )}

                            {settings['contact_email'] && (
                                <div className="flex gap-3">
                                    <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">Email:</p>
                                        <a href={`mailto:${settings['contact_email']}`} className="text-gray-400 hover:text-orange-400">
                                            {settings['contact_email']}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {settings['contact_phone'] && (
                                <div className="flex gap-3">
                                    <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                    <div>
                                        <p className="text-white font-medium">Mobile:</p>
                                        <a href={`tel:${settings['contact_phone']}`} className="text-gray-400 hover:text-orange-400">
                                            {settings['contact_phone']}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center md:flex-row md:justify-between border-t border-gray-700 mt-5 md:mt-6 pt-4 md:pt-5 gap-3 md:gap-4">
                    {/* Social Icons */}
                    <div className="flex gap-2 md:gap-3">
                        {settings['social_facebook'] && (
                            <a href={settings['social_facebook']} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </a>
                        )}
                        {settings['social_twitter'] && (
                            <a href={settings['social_twitter']} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </a>
                        )}
                        {settings['social_youtube'] && (
                            <a href={settings['social_youtube']} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </a>
                        )}
                        {settings['social_instagram'] && (
                            <a href={settings['social_instagram']} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </a>
                        )}
                    </div>

                    {/* Copyright */}
                    <div
                        className="text-xs md:text-sm text-gray-400 text-center"
                        style={{ fontSize: 'var(--site-footer-body-size)' }}
                    >
                        {settings['site_copyright']}
                    </div>
                </div>
            </div>
        </footer>
    );
}
