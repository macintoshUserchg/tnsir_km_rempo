'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogCardProps {
    blog: {
        id: number;
        slug: string;
        titleHi: string;
        titleEn: string | null;
        excerptHi: string | null;
        excerptEn: string | null;
        imageUrl: string | null;
        createdAt: string | Date;
    };
    locale: string;
}

export const BlogCard = ({ blog, locale }: BlogCardProps) => {
    const isHindi = locale === 'hi';
    const title = isHindi ? blog.titleHi : (blog.titleEn || blog.titleHi);
    const excerpt = isHindi ? blog.excerptHi : (blog.excerptEn || blog.excerptHi);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/blog/${blog.slug}`}>
                <Card className="h-full overflow-hidden border border-orange-100 hover:border-orange-500/30 transition-shadow hover:shadow-xl group bg-white dark:bg-zinc-900">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                        {blog.imageUrl ? (
                            <img
                                src={blog.imageUrl}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
                                <BookOpen className="w-12 h-12" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {isHindi ? 'ब्लॉग' : 'Blog'}
                            </span>
                        </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5 shadow-sm px-2 py-1 rounded bg-gray-50 dark:bg-zinc-800">
                                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                {new Date(blog.createdAt).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-1.5 shadow-sm px-2 py-1 rounded bg-gray-50 dark:bg-zinc-800 font-medium">
                                <User className="w-3.5 h-3.5 text-orange-600" />
                                Admin
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors line-clamp-2">
                            {title}
                        </h3>

                        {excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                {excerpt}
                            </p>
                        )}

                        <div className="pt-2 flex items-center text-orange-600 font-bold text-sm gap-2 uppercase tracking-wide">
                            {isHindi ? 'और पढ़ें' : 'Read More'}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
};
