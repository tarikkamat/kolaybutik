import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { QuickDemoButton } from '@/components/quick-demo-button';
import { Code, CreditCard, ExternalLink, Lock } from 'lucide-react';

export default function PaymentMethodsSection() {
    return (
        <section
            id="payment-methods"
            className="bg-white px-4 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        Ödeme Yöntemleri
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        iyzico'nun esnek entegrasyon seçenekleri ile
                        ihtiyacınıza en uygun ödeme çözümünü seçin
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* API to API */}
                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex items-center rounded-lg bg-[color:var(--iyzico-denim)]/10 p-3 dark:bg-[color:var(--iyzico-denim)]/20">
                                <Code className="h-6 w-6 !text-[color:var(--iyzico-denim)]" />
                                <div className="ms-2 font-semibold leading-none !text-[color:var(--iyzico-denim)]">
                                    iyzico Sanal POS
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Sanal POS ile kredi kartı, banka kartı
                                ödemelerini kendi ekranlarınızdan yönetin.
                                Non-3DS ve 3DS işlemlerde tam kontrol sizde
                                olsun.
                            </p>
                            <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Doğrudan API yönetimi</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Non-3DS & 3DS desteği</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Kart saklama</span>
                                </li>
                            </ul>
                            <QuickDemoButton href="/demo/credit-card" color="indigo">
                                Hemen Dene
                            </QuickDemoButton>
                        </CardContent>
                    </Card>

                    {/* Checkout Form */}
                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex items-center rounded-lg bg-[color:var(--iyzico-bittersweet)]/10 p-3 dark:bg-[color:var(--iyzico-bittersweet)]/20">
                                <CreditCard className="h-6 w-6 !text-[color:var(--iyzico-bittersweet)]" />
                                <div className="ms-2 font-semibold leading-none !text-[color:var(--iyzico-bittersweet)]">
                                    iyzico Checkout Form
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Kart ile ödeme ve iyzico ile Öde seçeneklerini
                                tek ekran üzerinden sunun, PCI DSS
                                yükümlülüklerinden muaf olun. Kullanıcı ister
                                kart bilgilerini form üzerinden girsin, ister
                                iyzico ile Öde akışına yönlendirilsin.
                            </p>
                            <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Hızlı kurulum</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        Tek ekranda birden fazla ödeme seçeneği
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>PCI DSS uyumlu</span>
                                </li>
                            </ul>
                            <QuickDemoButton href="/demo/checkout-form" color="emerald">
                                Hemen Dene
                            </QuickDemoButton>
                        </CardContent>
                    </Card>

                    {/* Pay with iyzico */}
                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex items-center rounded-lg bg-[color:var(--kaamaru)]/10 p-3 dark:bg-[color:var(--kaamaru)]/20">
                                <ExternalLink className="h-6 w-6 !text-[color:var(--kaamaru)]" />
                                <div className="ms-2 font-semibold leading-none !text-[color:var(--kaamaru)]">
                                    iyzico ile Öde
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Hazır ödeme formumuzu sitenize kolayca entegre
                                edin. Kullanıcı kart bilgilerini girebilir veya
                                kayıtlı kartları ve mevcut bakiyeleri ile hızlı
                                ödeme yapabilir.
                            </p>
                            <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Minimum geliştirme ile hızlı entegrasyon</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Hazır iyzico ile Öde akışı</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>Alternatif ödeme yöntemleri</span>
                                </li>
                            </ul>
                            <QuickDemoButton href="/demo/pay-with-iyzico" color="amber">
                                Hemen Dene
                            </QuickDemoButton>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
