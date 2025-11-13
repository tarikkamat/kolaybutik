import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AppWindow,
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Wallet,
} from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
                    <div className="h-[600px] w-[600px] rounded-full bg-indigo-100 opacity-20 blur-3xl dark:bg-indigo-900 dark:opacity-10" />
                </div>
            </div>
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="text-center lg:text-left">
                        <Badge
                            variant="secondary"
                            className="mb-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                        >
                            iyzico Entegrasyon Çözümleri
                        </Badge>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                            iyzico ile{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Ödeme Entegrasyonu
                            </span>
                        </h1>
                        <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                            API to API, Checkout Form, Pay with iyzico ve daha
                            fazlası. Online ödeme, pazaryeri, abonelik ve
                            korumalı havale EFT çözümleriyle işinizi büyütün.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <a
                                href="https://docs.iyzico.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Dokümantasyonu İncele
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    document
                                        .getElementById('how-it-works')
                                        ?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                }}
                            >
                                Canlı Demo
                            </Button>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 lg:justify-start dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span>Hızlı Entegrasyon</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span>Kolay Kurulum</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span>7/24 Destek</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl" />
                        <div className="relative rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-950">
                                    <div className="rounded-lg bg-indigo-600 p-3">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                                            API to API Entegrasyon
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            Doğrudan API entegrasyonu ile tam
                                            kontrol ve Non-3DS/3DS desteği.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
                                    <div className="rounded-lg bg-emerald-600 p-3">
                                        <AppWindow className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                                            Checkout Form
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            iFrame tabanlı ödeme formu ile PCI
                                            DSS yükümlülüğünden muaf kalın.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg bg-amber-50 p-4 dark:bg-amber-950">
                                    <div className="rounded-lg bg-amber-600 p-3">
                                        <Wallet className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                                            Pay with iyzico
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            Kayıtlı kartlar ve bakiye ile tek
                                            tıkla hızlı ödeme çözümü.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
