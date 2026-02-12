import React from 'react';

interface RichTextBlockProps {
    content: {
        htmlHi?: string;
        htmlEn?: string;
    };
    locale: string;
}

export const RichTextBlock: React.FC<RichTextBlockProps> = ({ content, locale }) => {
    const html = locale === 'hi' ? content.htmlHi : content.htmlEn;

    if (!html) return null;

    return (
        <section className="py-12 md:py-16 px-4">
            <div
                className="prose prose-lg mx-auto max-w-4xl dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </section>
    );
};
