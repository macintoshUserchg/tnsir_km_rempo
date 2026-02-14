
import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { getMovementBatches, getMovementBatchContent } from '@/app/actions/movements';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { History, Calendar, ChevronRight, ListOrdered } from 'lucide-react';

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ batch?: string }>;
}

export default async function MovementsPage({ params, searchParams }: PageProps) {
    const { locale } = await params;
    const { batch: batchParam } = await searchParams;
    const t = await getTranslations('movements');
    const ct = await getTranslations('common');

    const batches = await getMovementBatches();
    const currentBatchNumber = batchParam ? parseInt(batchParam) : 1;

    let contentData = null;
    try {
        contentData = await getMovementBatchContent(currentBatchNumber);
    } catch (error) {
        console.error("Error loading batch:", error);
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <PageHero
                title={t('title')}
                subtitle={t('subtitle')}
            />

            <section className="py-12 relative overflow-hidden">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Index */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
                                    <History className="w-5 h-5 text-orange-600" />
                                    <span>{t('yearRange')}</span>
                                </div>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {batches.map((b) => (
                                        <Link
                                            key={b.id}
                                            href={`/${locale}/movements?batch=${b.batchNumber}`}
                                            className={`flex items-center justify-between p-3 rounded-xl transition-all group ${currentBatchNumber === b.batchNumber
                                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold opacity-80 mb-0.5">
                                                    {t('batch')} {b.batchNumber}
                                                </span>
                                                <span className="text-sm font-black">{b.yearRange}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${currentBatchNumber === b.batchNumber ? 'text-white' : 'text-gray-400'
                                                }`} />
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <ListOrdered className="w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold uppercase tracking-wider">{t('totalMovements')}</span>
                                            <span className="text-xl font-black text-gray-900">657+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3">
                            <AnimatedSection delay={0.2}>
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white">
                                        <div className="flex items-center gap-3 text-orange-100 font-bold mb-2">
                                            <Calendar className="w-5 h-5" />
                                            <span>{t('batch')} {currentBatchNumber}</span>
                                        </div>
                                        <h2 className="text-3xl font-black">
                                            {contentData?.frontmatter?.yearRange || t('yearRange')}
                                        </h2>
                                    </div>

                                    <div className="p-8 md:p-12">
                                        {contentData ? (
                                            <div className="prose prose-lg prose-orange max-w-none 
                                                prose-headings:text-gray-900 prose-headings:font-black 
                                                prose-h3:text-2xl prose-h3:mb-4 prose-h3:pt-8 prose-h3:border-t prose-h3:border-gray-100 first:prose-h3:pt-0 first:prose-h3:border-0
                                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8 text-lg">
                                                {contentData.content}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20">
                                                <p className="text-gray-500 font-bold">{ct('loading')}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pagination Buttons */}
                                    <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        {currentBatchNumber > 1 ? (
                                            <Link
                                                href={`/${locale}/movements?batch=${currentBatchNumber - 1}`}
                                                className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <ChevronRight className="w-5 h-5 rotate-180" />
                                                {t('prevBatch')}
                                            </Link>
                                        ) : <div />}

                                        {currentBatchNumber < batches.length ? (
                                            <Link
                                                href={`/${locale}/movements?batch=${currentBatchNumber + 1}`}
                                                className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 flex items-center gap-2"
                                            >
                                                {t('nextBatch')}
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        ) : <div />}
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </Container>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}} />
        </div>
    );
}
