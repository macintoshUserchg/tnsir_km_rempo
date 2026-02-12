'use client';

import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Photo {
    id: number;
    url: string;
    caption: string;
}

interface Album {
    title: string;
    description: string;
}

interface GalleryPhotosContentProps {
    album: Album;
    photos: Photo[];
    isHindi: boolean;
}

export default function GalleryPhotosContent({ album, photos, isHindi }: GalleryPhotosContentProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedPhotoIndex(index);
    const closeLightbox = () => setSelectedPhotoIndex(null);

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPhotoIndex !== null) {
            setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
        }
    };

    return (
        <>
            <PageHero
                title={album.title}
                subtitle={album.description}
            />

            <section className="py-12 md:py-16">
                <Container>
                    {photos.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {isHindi ? 'इस एल्बम में कोई फोटो नहीं है।' : 'No photos in this album.'}
                        </div>
                    ) : (
                        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {photos.map((photo, index) => (
                                <StaggerItem key={photo.id}>
                                    <motion.div
                                        className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group"
                                        whileHover={{ scale: 1.02 }}
                                        layoutId={`photo-${photo.id}`}
                                        onClick={() => openLightbox(index)}
                                    >
                                        <img
                                            src={photo.url}
                                            alt={photo.caption || album.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}
                </Container>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhotoIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                            onClick={closeLightbox}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full hidden sm:flex"
                            onClick={prevPhoto}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
                            <motion.img
                                layoutId={`photo-${photos[selectedPhotoIndex].id}`}
                                src={photos[selectedPhotoIndex].url}
                                alt={photos[selectedPhotoIndex].caption}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {photos[selectedPhotoIndex].caption && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-gray-200 mt-4 text-center text-lg font-medium"
                                >
                                    {photos[selectedPhotoIndex].caption}
                                </motion.p>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full hidden sm:flex"
                            onClick={nextPhoto}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
