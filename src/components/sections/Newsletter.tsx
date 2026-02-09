'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <section
            className="section-padding"
            style={{
                background: 'linear-gradient(135deg, #f5d547 0%, #f4a91f 50%, #e88b1a 100%)',
            }}
        >
            <Container>
                <div className="max-w-3xl mx-auto text-center text-white">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Stay Connected
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Subscribe to our newsletter for the latest updates, news, and announcements
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 px-6 py-3 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <Button
                            type="submit"
                            className="bg-white text-orange-600 hover:bg-gray-100"
                            size="lg"
                        >
                            Subscribe
                        </Button>
                    </form>
                    {subscribed && (
                        <p className="mt-4 text-white font-medium">
                            Thank you for subscribing!
                        </p>
                    )}
                    <p className="mt-6 text-sm text-white/70">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </Container>
        </section>
    );
};
