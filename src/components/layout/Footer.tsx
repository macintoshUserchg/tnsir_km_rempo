import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            {t('common.siteName')}
                        </h3>
                        <p className="text-sm opacity-80">
                            {t('home.heroSubtitle')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {t('home.quickLinks')}
                        </h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="hover:text-orange-400 transition-colors">
                                {t('common.home')}
                            </Link>
                            <Link href="/biography" className="hover:text-orange-400 transition-colors">
                                {t('common.biography')}
                            </Link>
                            <Link href="/press-release" className="hover:text-orange-400 transition-colors">
                                {t('common.pressRelease')}
                            </Link>
                            <Link href="/apply" className="hover:text-orange-400 transition-colors">
                                {t('common.apply')}
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {t('common.contact')}
                        </h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-400" />
                                <span className="text-sm">{t('footer.address')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-orange-400" />
                                <span className="text-sm">{t('footer.phone')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-orange-400" />
                                <span className="text-sm">{t('footer.email')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {t('footer.followUs')}
                        </h4>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-orange-400 transition-colors">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-orange-400 transition-colors">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-orange-400 transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-orange-400 transition-colors">
                                <Youtube className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
                    <p>{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
}
