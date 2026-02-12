import { prisma } from '@/lib/db';

interface TypographySyncProps {
    slug?: string;
    locale?: string;
}

export default async function TypographySync({ slug, locale }: TypographySyncProps) {
    // 1. Fetch Global Settings
    const globalSettings = await prisma.siteSetting.findMany({
        where: { key: { startsWith: 'typo_' } }
    });

    const settingsMap = globalSettings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    // 2. Fetch Page Overrides
    let pageOverrides: any = {};
    if (slug) {
        const page = await prisma.page.findFirst({
            where: {
                slug: slug,
            },
            select: { typography: true }
        });
        if (page?.typography) {
            pageOverrides = page.typography as any;
        }
    }

    // 3. Merge Logic & Generate CSS Variables
    // Priority: Page Overrides > Global Settings > Defaults
    const cssVars = {
        '--site-base-size': `${pageOverrides.baseSize || settingsMap['typo_site_base_size'] || '16'}px`,
        '--site-body-weight': pageOverrides.bodyWeight || settingsMap['typo_site_body_weight'] || '400',
        '--site-nav-size': `${pageOverrides.navSize || settingsMap['typo_header_nav_size'] || '14'}px`,
        '--site-nav-weight': pageOverrides.navWeight || settingsMap['typo_header_nav_weight'] || '500',
        '--site-footer-title-size': `${pageOverrides.footerTitleSize || settingsMap['typo_footer_title_size'] || '18'}px`,
        '--site-footer-body-size': `${pageOverrides.footerBodySize || settingsMap['typo_footer_body_size'] || '14'}px`,
        '--site-hero-title-size': `${pageOverrides.heroTitleSize || settingsMap['typo_hero_title_size'] || '48'}px`,
        '--site-hero-desc-size': `${pageOverrides.heroDescSize || settingsMap['typo_hero_desc_size'] || '18'}px`,
    };

    const cssString = Object.entries(cssVars)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ');

    return (
        <style dangerouslySetInnerHTML={{
            __html: `
                :root {
                    ${cssString}
                }
                
                body {
                    font-size: var(--site-base-size);
                    font-weight: var(--site-body-weight);
                }
            `
        }} />
    );
}
