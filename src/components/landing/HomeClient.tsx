'use client';

import { useState } from 'react';
import VisitorPage from '@/components/landing/VisitorPage';

export default function HomeClient({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
        return <VisitorPage onEnter={() => setShowSplash(false)} />;
    }

    return (
        <>{children}</>
    );
}
