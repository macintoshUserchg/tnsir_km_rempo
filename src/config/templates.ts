import { SectionType } from '@prisma/client';

export interface TemplateSection {
    type: SectionType;
    content: any;
}

export interface PageTemplate {
    id: string;
    name: string;
    description: string;
    sections: TemplateSection[];
}

export const TEMPLATES: PageTemplate[] = [
    {
        id: 'blank',
        name: 'Blank Page',
        description: 'Start with a completely empty page.',
        sections: []
    },
    {
        id: 'article',
        name: 'Simple Article',
        description: 'Standard layout for policy pages, terms, or simple text articles.',
        sections: [
            {
                type: 'HERO',
                content: {
                    titleHi: 'शीर्षक यहाँ',
                    titleEn: 'Title Here',
                    descriptionHi: 'विवरण यहाँ लिखें',
                    descriptionEn: 'Write description here'
                }
            },
            {
                type: 'RICHTEXT',
                content: {
                    htmlHi: '<p>अपनी सामग्री यहाँ लिखना शुरू करें...</p>',
                    htmlEn: '<p>Start writing your content here...</p>'
                }
            }
        ]
    },
    {
        id: 'biography',
        name: 'Biography / Profile',
        description: 'Premium profile layout with biography, stats, and achievements.',
        sections: [
            {
                type: 'BIOGRAPHY',
                content: {
                    titleHi: 'मेरे बारे में',
                    titleEn: 'About Me',
                    imageUrl: '/images/hero-bg.jpg',
                    contentHi: 'यहाँ अपनी जीवनी लिखें...',
                    contentEn: 'Write your biography here...'
                }
            },
            {
                type: 'STATS',
                content: {
                    titleHi: 'प्रमुख आंकड़े',
                    titleEn: 'Key Statistics',
                    stats: [
                        { value: '25+', labelHi: 'वर्षों का अनुभव', labelEn: 'Years Experience' },
                        { value: '1M+', labelHi: 'सेवा प्राप्त लोग', labelEn: 'People Served' }
                    ]
                }
            }
        ]
    },
    {
        id: 'media',
        name: 'Media & Events',
        description: 'Showcase videos and news alerts.',
        sections: [
            {
                type: 'HERO',
                content: {
                    titleHi: 'मीडिया और समाचार',
                    titleEn: 'Media & News'
                }
            },
            {
                type: 'VIDEOS',
                content: {
                    titleHi: 'नवीनतम वीडियो',
                    titleEn: 'Latest Videos',
                    count: 6
                }
            },
            {
                type: 'RICHTEXT',
                content: {
                    htmlHi: '<h3>प्रेस विज्ञप्ति</h3>',
                    htmlEn: '<h3>Press Releases</h3>'
                }
            }
        ]
    }
];
