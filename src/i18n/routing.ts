import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['hi', 'en'],

    // Used when no locale matches
    defaultLocale: 'hi',

    // The prefix strategy for URLs
    localePrefix: 'always'
});
