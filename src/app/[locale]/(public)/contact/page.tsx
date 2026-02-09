'use client';

import React from 'react';
import { PageHero } from '@/components/common/PageHero';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export default function ContactPage() {
    const locale = useLocale();
    const t = useTranslations('contact');
    const isHindi = locale === 'hi';

    return (
        <>
            <PageHero
                title={isHindi ? 'संपर्क करें' : 'Contact Us'}
                subtitle={isHindi ? 'हमसे जुड़ें और अपनी समस्याएं साझा करें' : 'Connect with us and share your concerns'}
            />

            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <AnimatedSection delay={0.1} direction="left">
                            <h2 className="text-2xl font-bold text-orange-600 mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-orange-600" />
                                </span>
                                {isHindi ? 'संपर्क जानकारी' : 'Contact Information'}
                            </h2>

                            <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                                <StaggerItem>
                                    <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 flex gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <MapPin className="h-6 w-6 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1 text-gray-900">
                                                    {isHindi ? 'कार्यालय का पता' : 'Office Address'}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {isHindi
                                                        ? 'विधायक निवास, सवाई माधोपुर, राजस्थान - 322001'
                                                        : 'MLA Residence, Sawai Madhopur, Rajasthan - 322001'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>

                                <StaggerItem>
                                    <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 flex gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Phone className="h-6 w-6 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1 text-gray-900">
                                                    {isHindi ? 'फोन नंबर' : 'Phone Number'}
                                                </h3>
                                                <p className="text-gray-600">+91 XXXXX XXXXX</p>
                                                <p className="text-gray-600">+91 XXXXX XXXXX</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>

                                <StaggerItem>
                                    <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 flex gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Mail className="h-6 w-6 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1 text-gray-900">
                                                    {isHindi ? 'ईमेल' : 'Email'}
                                                </h3>
                                                <p className="text-gray-600">contact@drkirodilal.in</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>

                                <StaggerItem>
                                    <Card className="border-orange-100 hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6 flex gap-4">
                                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Clock className="h-6 w-6 text-orange-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1 text-gray-900">
                                                    {isHindi ? 'कार्यालय समय' : 'Office Hours'}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {isHindi
                                                        ? 'सोमवार - शनिवार: सुबह 10:00 - शाम 5:00'
                                                        : 'Monday - Saturday: 10:00 AM - 5:00 PM'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </StaggerItem>
                            </StaggerContainer>
                        </AnimatedSection>

                        {/* Contact Form */}
                        <AnimatedSection delay={0.3} direction="right">
                            <Card className="shadow-xl border-orange-100">
                                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                                    <CardTitle className="text-orange-600 flex items-center gap-3">
                                        <Send className="w-5 h-5" />
                                        {isHindi ? 'संदेश भेजें' : 'Send Message'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{isHindi ? 'नाम' : 'Name'}</Label>
                                            <Input
                                                id="name"
                                                placeholder={isHindi ? 'आपका नाम' : 'Your name'}
                                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="mobile">{isHindi ? 'मोबाइल' : 'Mobile'}</Label>
                                            <Input
                                                id="mobile"
                                                placeholder="+91 XXXXX XXXXX"
                                                className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{isHindi ? 'ईमेल' : 'Email'}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={isHindi ? 'आपका ईमेल' : 'Your email'}
                                            className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">{isHindi ? 'विषय' : 'Subject'}</Label>
                                        <Input
                                            id="subject"
                                            placeholder={isHindi ? 'संदेश का विषय' : 'Message subject'}
                                            className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">{isHindi ? 'संदेश' : 'Message'}</Label>
                                        <Textarea
                                            id="message"
                                            placeholder={isHindi ? 'अपना संदेश लिखें...' : 'Write your message...'}
                                            rows={5}
                                            className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                        />
                                    </div>
                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3">
                                        <Send className="w-4 h-4 mr-2" />
                                        {isHindi ? 'संदेश भेजें' : 'Send Message'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <AnimatedSection delay={0.5}>
                <section className="py-8 px-4 bg-gray-100">
                    <div className="container mx-auto max-w-6xl">
                        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 h-64 rounded-2xl flex items-center justify-center border border-orange-200">
                            <span className="text-gray-600 font-medium">
                                {isHindi ? 'मानचित्र यहाँ आएगा' : 'Map will be displayed here'}
                            </span>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </>
    );
}
