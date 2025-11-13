import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
                            <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 dark:bg-indigo-950">
                                <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <CardTitle className="text-slate-900 dark:text-white">
                                API to API Entegrasyon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Doğrudan API entegrasyonu ile tam kontrol.
                                Non-3DS ve 3DS ödeme işlemlerini kendi
                                sisteminizden yönetin.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Non-3DS desteği</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>3DS desteği</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Tam kontrol</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Checkout Form */}
                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex rounded-lg bg-emerald-100 p-3 dark:bg-emerald-950">
                                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <CardTitle className="text-slate-900 dark:text-white">
                                Checkout Form iFrame
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                iFrame tabanlı ödeme formu ile hızlı
                                entegrasyon. PCI DSS yükümlülüklerinden muaf
                                kalın.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Hızlı kurulum</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>PCI DSS uyumlu</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Özelleştirilebilir</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Pay with iyzico */}
                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex rounded-lg bg-amber-100 p-3 dark:bg-amber-950">
                                <ExternalLink className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <CardTitle className="text-slate-900 dark:text-white">
                                Pay with iyzico
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                iyzico'nun hazır ödeme sayfasına yönlendirme ile
                                en hızlı entegrasyon. Minimum kod ile maksimum
                                sonuç.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Minimum kod</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Hazır çözüm</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-emerald-600" />
                                    <span>Hızlı entegrasyon</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
