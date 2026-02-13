import { setRequestLocale } from 'next-intl/server';
import BlogForm from '@/components/admin/BlogForm';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function NewBlogPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="py-6">
            <BlogForm locale={locale} />
        </div>
    );
}
