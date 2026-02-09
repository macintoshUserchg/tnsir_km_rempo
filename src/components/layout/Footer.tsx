import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, LayoutGrid } from 'lucide-react';

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Quick Links - 2 columns */}
                    <div>
                        <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-3 md:mb-4">
                            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" />
                            {t('common.quickLinks')}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-1.5 md:gap-y-2">
                            <Link href="/" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.home')}
                            </Link>
                            <Link href="/biography" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.biography')}
                            </Link>
                            <Link href="/photo-gallery" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.photoGallery')}
                            </Link>
                            <Link href="/press-release" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.pressRelease')}
                            </Link>
                            <Link href="/blog" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.blog')}
                            </Link>
                            <Link href="/events" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.events')}
                            </Link>
                            <Link href="/video-gallery" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> Video Gallery
                            </Link>
                            <Link href="/contact" className="flex items-center gap-1 hover:text-orange-400 transition-colors text-xs md:text-sm">
                                <span className="text-orange-400">›</span> {t('common.contact')}
                            </Link>
                        </div>
                    </div>

                    {/* Subscribe Newsletter */}
                    <div>
                        <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-3 md:mb-4">
                            <Mail className="w-4 h-4 md:w-5 md:h-5" />
                            {t('common.subscribe')} Newsletter
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
                                {t('common.subscribe')}
                            </button>
                        </form>
                    </div>

                    {/* Contact */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-white mb-3 md:mb-4">
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                            {t('common.contact')}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 text-xs md:text-sm">
                            <div>
                                <p className="text-white font-medium">Office:</p>
                                <p className="text-gray-400">3/80 SFS Mansarovar, Jaipur</p>
                                <a href="mailto:info@kirodilalmeena.in" className="text-gray-400 hover:text-orange-400 text-xs md:text-sm">
                                    info@kirodilalmeena.in
                                </a>
                            </div>
                            <div className="sm:border-t sm:border-dashed sm:border-gray-700 sm:pt-3">
                                <p className="text-white font-medium">Mobile:</p>
                                <a href="tel:+919414077707" className="text-gray-400 hover:text-orange-400">
                                    +91 9414077707
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center md:flex-row md:justify-between border-t border-gray-700 mt-5 md:mt-6 pt-4 md:pt-5 gap-3 md:gap-4">
                    {/* Social Icons */}
                    <div className="flex gap-2 md:gap-3">
                        <a href="#" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                            <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </a>
                        <a href="#" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                            <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </a>
                        <a href="#" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                            <Youtube className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </a>
                        <a href="#" className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-white text-gray-900 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                            <Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs md:text-sm text-gray-400 text-center">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <span className="mx-1.5 md:mx-2">|</span>
                        <a href="#" className="hover:text-white">Disclaimer</a>
                        <span className="mx-1.5 md:mx-2">|</span>
                        <span>{t('footer.copyright')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
