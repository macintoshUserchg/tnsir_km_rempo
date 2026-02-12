'use client';

import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface Album {
    id: number;
    title: string;
    description: string;
    coverImage: string | null;
    photoCount: number;
}

interface GalleryAlbumsContentProps {
    albums: Album[];
    isHindi: boolean;
    title?: string;
    subtitle?: string;
    showHero?: boolean;
}

export default function GalleryAlbumsContent({
    albums,
    isHindi,
    title,
    subtitle,
    showHero = true
}: GalleryAlbumsContentProps) {
    const t = useTranslations('photoGalleryPage');
    const displayTitle = title || t('title');
    const displaySubtitle = subtitle || t('subtitle');

    return (
        <>
            {showHero && (
                <PageHero
                    title={displayTitle}
                    subtitle={displaySubtitle}
                />
            )}

            <section className="py-12 md:py-16">
                <Container>
                    {!showHero && title && (
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
                                {displayTitle}
                            </h2>
                            {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{displaySubtitle}</p>}
                        </div>
                    )}

                    {albums.length === 0 ? (
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 text-center border border-orange-100">
                            <p className="text-gray-600 text-lg">
                                {isHindi ? 'कोई फोटो एल्बम उपलब्ध नहीं है।' : 'No photo albums are currently available.'}
                            </p>
                        </div>
                    ) : (
                        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {albums.map((album) => (
                                <StaggerItem key={album.id}>
                                    <Link href={`/photo-gallery/${album.id}`}>
                                        <motion.div
                                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col"
                                            whileHover={{ y: -5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                                {album.coverImage ? (
                                                    <img
                                                        src={album.coverImage}
                                                        alt={album.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                        <ImageIcon className="w-12 h-12" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <ImageIcon className="w-3 h-3" />
                                                    {album.photoCount}
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                    {album.title}
                                                </h3>
                                                {album.description && (
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {album.description}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    </Link>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}
                </Container>
            </section>
        </>
    );
}
