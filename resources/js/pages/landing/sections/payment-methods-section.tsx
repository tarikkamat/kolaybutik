import { QuickDemoButton } from '@/components/quick-demo-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { Code, CreditCard, ExternalLink, Lock } from 'lucide-react';

export default function PaymentMethodsSection() {
    const { t } = useI18n();

    return (
        <section
            id="payment-methods"
            className="bg-white px-4 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        {t('landing.paymentMethods.title')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        {t('landing.paymentMethods.subtitle')}
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex items-center rounded-lg bg-[color:var(--iyzico-denim)]/10 p-3 dark:bg-[color:var(--iyzico-denim)]/20">
                                <Code className="h-6 w-6 !text-[color:var(--iyzico-denim)]" />
                                <div className="ms-2 leading-none font-semibold !text-[color:var(--iyzico-denim)]">
                                    iyzico Sanal POS
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                {t('landing.paymentMethods.pos.description')}
                            </p>
                            <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.pos.feature.api',
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.pos.feature.non3ds',
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.pos.feature.cardStorage',
                                        )}
                                    </span>
                                </li>
                            </ul>
                            <QuickDemoButton
                                href="/demo/credit-card"
                                color="indigo"
                            >
                                {t('common.tryNow')}
                            </QuickDemoButton>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex items-center rounded-lg bg-[color:var(--iyzico-bittersweet)]/10 p-3 dark:bg-[color:var(--iyzico-bittersweet)]/20">
                                <CreditCard className="h-6 w-6 !text-[color:var(--iyzico-bittersweet)]" />
                                <div className="ms-2 leading-none font-semibold !text-[color:var(--iyzico-bittersweet)]">
                                    iyzico Checkout Form
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                {t(
                                    'landing.paymentMethods.checkout.description',
                                )}
                            </p>
                            <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.checkout.feature.fastSetup',
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.checkout.feature.multiOption',
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.checkout.feature.pci',
                                        )}
                                    </span>
                                </li>
                            </ul>
                            <QuickDemoButton
                                href="/demo/checkout-form"
                                color="emerald"
                            >
                                {t('common.tryNow')}
                            </QuickDemoButton>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                        <CardHeader>
                            <div className="mb-4 inline-flex items-center rounded-lg bg-[color:var(--kaamaru)]/10 p-3 dark:bg-[color:var(--kaamaru)]/20">
                                <ExternalLink className="h-6 w-6 !text-[color:var(--kaamaru)]" />
                                <div className="ms-2 leading-none font-semibold !text-[color:var(--kaamaru)]">
                                    {t('landing.hero.cards.pwi.title')}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                {t('landing.paymentMethods.pwi.description')}
                            </p>
                            <ul className="mb-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.pwi.feature.quickIntegration',
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.pwi.feature.readyFlow',
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-[color:var(--kaamaru)]" />
                                    <span>
                                        {t(
                                            'landing.paymentMethods.pwi.feature.alternativeMethods',
                                        )}
                                    </span>
                                </li>
                            </ul>
                            <QuickDemoButton
                                href="/demo/pay-with-iyzico"
                                color="amber"
                            >
                                {t('common.tryNow')}
                            </QuickDemoButton>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
