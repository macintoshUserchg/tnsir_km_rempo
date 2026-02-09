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
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {t('common.quickLinks')}
                        </h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/" className="hover:text-orange-400 transition-colors">
                                {t('common.home')}
                            </Link>
                            <Link href="/biography" className="hover:text-orange-400 transition-colors">
                                {t('common.biography')}
                            </Link>
                            <Link href="/photo-gallery" className="hover:text-orange-400 transition-colors">
                                {t('common.photoGallery')}
                            </Link>
                            <Link href="/press-release" className="hover:text-orange-400 transition-colors">
                                {t('common.pressRelease')}
                            </Link>
                            <Link href="/events" className="hover:text-orange-400 transition-colors">
                                {t('common.events')}
                            </Link>
                            <Link href="/blog" className="hover:text-orange-400 transition-colors">
                                {t('common.blog')}
                            </Link>
                            <Link href="/contact" className="hover:text-orange-400 transition-colors">
                                {t('common.contact')}
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
                                <Mail className="h-4 w-4 text-orange-400" />
                                <a href="mailto:info@kirodilalmeena.in" className="text-sm hover:text-orange-400">info@kirodilalmeena.in</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-orange-400" />
                                <a href="tel:+911234567890" className="text-sm hover:text-orange-400">+91 123 456 7890</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-400" />
                                <span className="text-sm">New Delhi, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {t('common.subscribe')}
                        </h4>
                        <p className="text-sm opacity-80 mb-4">
                            Stay updated with the latest news and announcements.
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
                            >
                                {t('common.subscribe')}
                            </button>
                        </form>
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
