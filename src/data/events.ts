import type { Event } from '../types';

export const eventsData: Event[] = [
    {
        id: 'meeting-2022',
        title: 'Meeting With Stakeholders',
        date: '2022-11-01',
        location: 'Location not specified (photo source)',
        description:
            'Photo from a meeting featuring Dr. Kirodi Lal Meena (dated Nov 1, 2022).',
        images: ['/images/kirodi-lal-meena.jpg'],
        category: 'political',
        isUpcoming: false,
        source: 'Wikimedia Commons',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kirodi_Lal_Meena.jpg',
        imageAttribution: {
            author: 'Kirodi Lal Meena',
            source: 'Wikimedia Commons',
            sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kirodi_Lal_Meena.jpg',
            license: 'CC BY-SA 4.0',
            licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        },
    },
    {
        id: 'public-appearance-2023',
        title: 'Public Appearance',
        date: '2023-10-12',
        location: 'Location not specified (photo source)',
        description:
            'Public appearance photo of Dr. Kirodi Lal Meena dated Oct 12, 2023.',
        images: ['/images/gallery/dr-kirodi-lal-meena-2023.jpg'],
        category: 'political',
        isUpcoming: false,
        source: 'Wikimedia Commons',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dr_Kirodi_Lal_Meena.jpg',
        imageAttribution: {
            author: 'Storieswithsunil',
            source: 'Wikimedia Commons',
            sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dr_Kirodi_Lal_Meena.jpg',
            license: 'CC0 1.0',
            licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
    },
];
