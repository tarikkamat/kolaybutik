import { LanguageSwitcher } from '@/components/language-switcher';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/i18n';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LegalPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function LandingLayout({
    title,
    children,
}: LegalPageLayoutProps) {
    const [showNavbar, setShowNavbar] = useState(true);
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
                            <div className="flex items-center gap-3">
                                <div className="hidden items-center gap-6 md:flex">
                                    <Link
                                        href="#payment-methods"
                                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                    >
                                        {t('landing.nav.paymentMethods')}
                                    </Link>
                                    <Link
                                        href="#products"
                                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                    >
                                        {t('landing.nav.solutions')}
                                    </Link>
                                    <Link
                                        href="#services"
                                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                    >
                                        {t('landing.nav.helpfulServices')}
                                    </Link>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-1 rounded-md bg-[color:var(--button-bg)] px-4 py-2 text-sm font-medium text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)]">
                                            {t('common.liveDemo')}
                                            <ChevronDown className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href="/store">
                                                    {t('common.testStore')}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/services/iyzico-link">
                                                    {t('common.testIyziLink')}
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1">{children}</main>

                <footer className="border-t border-slate-200 bg-white px-4 py-12 dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <Link href="/">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                            iyzico
                                        </span>
                                    </Link>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('landing.footer.description')}
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    {t('landing.footer.documentation')}
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <a
                                            href="https://docs.iyzico.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('landing.footer.apiDocs')}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://docs.iyzico.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            {t(
                                                'landing.footer.integrationGuide',
                                            )}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:entegrasyon@iyzico.com"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('landing.footer.support')}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    {t('landing.footer.resources')}
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <a
                                            href="https://www.iyzico.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('landing.footer.homepage')}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://dev.iyzipay.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            {t(
                                                'landing.footer.developerPortal',
                                            )}
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://github.com/iyzico"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            {t(
                                                'landing.footer.githubLibraries',
                                            )}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    {t('landing.footer.solutions')}
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link
                                            href="#payment-methods"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('landing.nav.paymentMethods')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#products"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('landing.footer.products')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#services"
                                            className="hover:text-indigo-600"
                                        >
                                            {t('landing.footer.workSolutions')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                            <p>{t('landing.footer.copyright')}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
