'use client';

import React, { useEffect } from 'react';
import { Share2, Facebook, Twitter } from 'lucide-react';
import { Container } from '@/components/common/Container';

export const Newsletter: React.FC = () => {
    useEffect(() => {
        // Load Twitter widgets script after component mounts (client-side only)
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <section className="py-6 md:py-10 bg-white">
            <Container>
                {/* Section Title */}
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <Share2 className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                    <h2 className="text-xl md:text-2xl font-bold text-orange-500">Stay Connected</h2>
                </div>

                {/* Social Embeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Facebook Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Facebook className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-blue-600">Facebook</h3>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <iframe
                                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fkirlodiofficial&tabs=timeline&width=500&height=300&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true"
                                width="100%"
                                height="300"
                                style={{ border: 'none', overflow: 'hidden' }}
                                scrolling="no"
                                frameBorder="0"
                                allowFullScreen={true}
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                    </div>

                    {/* Twitter Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-sky-500 rounded-full flex items-center justify-center">
                                <Twitter className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-sky-500">Twitter</h3>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm h-[300px]">
                            <a
                                className="twitter-timeline"
                                data-height="300"
                                data-theme="light"
                                href="https://twitter.com/KirodiLalMeena"
                            >
                                Tweets by @KirodiLalMeena
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
