import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import ChatbotSidebar from '@/components/chatbot/chatbot-sidebar';

interface LegalPageLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function LandingLayout({
    title,
    children,
}: LegalPageLayoutProps) {
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Sayfa en üstteyse veya 100px'den fazla scroll yapıldıysa navbar'ı göster
            const scrollY = window.scrollY;
            setShowNavbar(scrollY === 0 || scrollY > 100);
        };

        // İlk yüklemede scroll pozisyonunu kontrol et
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title={title} />
            {/* NAV ve FOOTER ile birebir uyumlu arka plan */}
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
                            <div className="hidden items-center gap-6 md:flex">
                                <Link
                                    href="#payment-methods"
                                    className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    Ödeme Yöntemleri
                                </Link>
                                <Link
                                    href="#products"
                                    className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    Çözümler
                                </Link>
                                <Link
                                    href="#services"
                                    className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    Faydalı Servisler
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1 rounded-md bg-[color:var(--button-bg)] px-4 py-2 text-sm font-medium text-[color:var(--button-text)] hover:bg-[color:var(--button-bg-hover)]">
                                        Canlı Demo
                                        <ChevronDown className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href="/store">Test Mağaza</Link>
                                        </DropdownMenuItem>
                                        {/** TODO:
                                        <DropdownMenuItem asChild>
                                            <Link href="/subscription">Test Abonelik</Link>
                                        </DropdownMenuItem>*/}
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/iyzico-link">Test iyziLink</Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1">{children}</main>

                {/* Chatbot Sidebar
                <ChatbotSidebar /> */}

                {/* Footer */}
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
                                    iyzico entegrasyon çözümleri ile ödeme
                                    altyapınızı güçlendirin. API to API,
                                    Checkout Form ve Pay with iyzico
                                    seçenekleri.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    Dokümantasyon
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <a
                                            href="https://docs.iyzico.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            API Dokümantasyonu
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://docs.iyzico.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            Entegrasyon Rehberi
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:entegrasyon@iyzico.com"
                                            className="hover:text-indigo-600"
                                        >
                                            Destek
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    Kaynaklar
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <a
                                            href="https://www.iyzico.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            iyzico Ana Sayfa
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://dev.iyzipay.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            Geliştirici Portalı
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://github.com/iyzico"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-indigo-600"
                                        >
                                            GitHub Kütüphaneleri
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                    Çözümler
                                </h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <Link
                                            href="#payment-methods"
                                            className="hover:text-indigo-600"
                                        >
                                            Ödeme Yöntemleri
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#products"
                                            className="hover:text-indigo-600"
                                        >
                                            Kullanabileceğiniz Ürünler
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="#services"
                                            className="hover:text-indigo-600"
                                        >
                                            İşinizi Kolaylaştıracak Çözümler
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                            <p>
                                &copy; 2025 Kolay Butik. Tüm hakları saklıdır.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
