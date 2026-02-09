export interface Biography {
    fullName: string;
    fullNameHi?: string;
    currentPosition: string;
    currentPositionHi?: string;
    dateOfBirth: string;
    placeOfBirth: string;
    placeOfBirthHi?: string;
    education: string[];
    educationHi?: string[];
    family?: string;
    familyHi?: string;
    earlyLife: string;
    earlyLifeHi?: string;
    politicalCareer: string;
    politicalCareerHi?: string;
    achievements: string[];
    achievementsHi?: string[];
    profileImage: string;
    imageAttribution?: {
        author?: string;
        source: string;
        sourceUrl: string;
        license: string;
        licenseUrl: string;
    };
}

export interface TimelineEvent {
    id: string;
    year: string;
    title: string;
    titleHi?: string;
    description: string;
    descriptionHi?: string;
    category: 'education' | 'political' | 'achievement' | 'other';
    icon?: string;
}

export interface Speech {
    id: string;
    title: string;
    titleHi?: string;
    date: string;
    location: string;
    locationHi?: string;
    excerpt: string;
    excerptHi?: string;
    fullText?: string;
    fullTextHi?: string;
    videoUrl?: string;
    category: string;
}

export interface PressRelease {
    id: string;
    title: string;
    titleHi?: string;
    date: string;
    content: string;
    contentHi?: string;
    excerpt: string;
    excerptHi?: string;
    pdfUrl?: string;
}

export interface Event {
    id: string;
    title: string;
    titleHi?: string;
    date: string;
    location: string;
    locationHi?: string;
    description: string;
    descriptionHi?: string;
    images: string[];
    category: 'political' | 'social' | 'cultural' | 'other';
    isUpcoming: boolean;
    source?: string;
    sourceUrl?: string;
    imageAttribution?: {
        author?: string;
        source: string;
        sourceUrl: string;
        license?: string;
        licenseUrl?: string;
    };
}

export interface BlogPost {
    id: string;
    title: string;
    titleHi?: string;
    slug: string;
    date: string;
    author: string;
    authorHi?: string;
    excerpt: string;
    excerptHi?: string;
    content: string;
    contentHi?: string;
    featuredImage: string;
    category: string;
    categoryHi?: string;
    tags: string[];
    tagsHi?: string[];
    readingTime: number;
}

export interface GalleryImage {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    titleHi?: string;
    description?: string;
    descriptionHi?: string;
    category: 'with-leaders' | 'political-events' | 'spiritual' | 'other' | 'timeline';
    date: string;
    attribution?: {
        author?: string;
        source: string;
        sourceUrl: string;
        license?: string;
        licenseUrl?: string;
    };
}

export interface Video {
    id: string;
    title: string;
    titleHi?: string;
    youtubeId: string;
    thumbnail: string;
    description: string;
    descriptionHi?: string;
    date: string;
    category: string;
    source?: string;
    sourceUrl?: string;
}

export interface MediaCoverage {
    id: string;
    title: string;
    titleHi?: string;
    source: string;
    sourceHi?: string;
    date: string;
    url: string;
    excerpt: string;
    excerptHi?: string;
    image?: string;
}

export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    addressHi?: string;
    officeHours?: string;
    officeHoursHi?: string;
    socialMedia: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
    };
}
