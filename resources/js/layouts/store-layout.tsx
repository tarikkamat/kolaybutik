import { LanguageSwitcher } from '@/components/language-switcher';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/i18n';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface StoreLayoutProps {
    title: string;
    children: React.ReactNode;
}

interface PageProps {
    [key: string]: unknown;
    cartCount?: number;
}

export default function StoreLayout({ title, children }: StoreLayoutProps) {
    const [showNavbar, setShowNavbar] = useState(true);
    const { props } = usePage<PageProps>();
    const cartCount = props.cartCount ?? 0;
    const { t } = useI18n();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowNavbar(scrollY === 0 || scrollY > 100);
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gradient-to-b from-white to-white dark:from-slate-900 dark:to-slate-900">
                {/* Navigation */}
                <nav
                    className={`fixed top-0 right-0 left-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900/80 ${
                        showNavbar ? 'translate-y-0' : '-translate-y-full'
                    }`}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link href="/">
                                    <img
                                        src="/logo.png"
                                        alt="Kolay Butik"
                                        className="h-8 w-auto"
                                    />
                                </Link>
                            </div>
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/store/cart"
                                    className="relative flex items-center justify-center rounded-md p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    {cartCount > 0 && (
                                        <Badge
                                            className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                                            variant="destructive"
                                        >
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </Badge>
                                    )}
                                </Link>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="fixed top-16 right-0 left-0 z-40 border-b border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-900/20">
                    <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <p className="text-center">
                            <strong>{t('store.warning.label')}</strong>{' '}
                            {t('store.warning.text')}
                        </p>
                    </div>
                </div>

                <main className="flex-1 pt-24">{children}</main>
                <footer className="border-t border-slate-200 bg-white px-4 py-12 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <Link href="/">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            Kolay Butik
                                        </span>
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('store.footer.description')}
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    {t('store.footer.store')}
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link
                                            href="/store"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.allProducts')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/store/categories"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.categories')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/store?filter=on_sale"
                                            className="hover:text-indigo-600"
                                        >
                                            {t(
                                                'store.footer.discountedProducts',
                                            )}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    {t('store.footer.info')}
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.about')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.contact')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.shipping')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    {t('store.footer.support')}
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.faq')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.return')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('store.footer.privacy')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                            <p>{t('store.footer.copyright')}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
