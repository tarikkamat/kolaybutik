import { CheckCircle2, Code, CreditCard, Settings, Shield } from 'lucide-react';

export default function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            icon: Settings,
            title: 'iyzico Hesabı Oluştur',
            description:
                'iyzico panelinden hesabınızı oluşturun ve API anahtarlarınızı alın.',
            numberBg: 'bg-indigo-600',
            iconBg: 'bg-indigo-100 dark:bg-indigo-950',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
        },
        {
            number: 2,
            icon: Code,
            title: 'Entegrasyon Yöntemini Seç',
            description:
                'API to API, Checkout Form veya Pay with iyzico yöntemlerinden birini seçin.',
            numberBg: 'bg-emerald-600',
            iconBg: 'bg-emerald-100 dark:bg-emerald-950',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            number: 3,
            icon: CreditCard,
            title: 'Entegrasyonu Yap',
            description:
                'Dokümantasyonu takip ederek entegrasyonu tamamlayın. Test ortamında deneyin.',
            numberBg: 'bg-amber-600',
            iconBg: 'bg-amber-100 dark:bg-amber-950',
            iconColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            number: 4,
            icon: Shield,
            title: 'Canlıya Al',
            description:
                'Testler başarılı olduktan sonra canlı ortama geçin ve ödeme almaya başlayın.',
            numberBg: 'bg-purple-600',
            iconBg: 'bg-purple-100 dark:bg-purple-950',
            iconColor: 'text-purple-600 dark:text-purple-400',
        },
    ];

    return (
        <section
            id="how-it-works"
            className="bg-white px-4 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        Entegrasyon Adımları
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        iyzico entegrasyonu sadece birkaç adımda tamamlanır
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute top-0 left-8 hidden h-full w-0.5 bg-gradient-to-b from-indigo-200 via-amber-200 via-emerald-200 to-purple-200 md:block dark:from-indigo-800 dark:via-amber-800 dark:via-emerald-800 dark:to-purple-800" />

                    <div className="space-y-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === steps.length - 1;

                            return (
                                <div
                                    key={step.number}
                                    className="group relative flex gap-6 md:gap-8"
                                >
                                    {/* Number Circle */}
                                    <div className="relative z-10 flex shrink-0 flex-col items-center">
                                        <div
                                            className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-white ${step.numberBg} text-xl font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl dark:border-slate-900`}
                                        >
                                            {step.number}
                                        </div>
                                        {!isLast && (
                                            <div className="mt-2 hidden h-8 w-0.5 bg-gradient-to-b from-indigo-200 via-amber-200 via-emerald-200 to-purple-200 md:block dark:from-indigo-800 dark:via-amber-800 dark:via-emerald-800 dark:to-purple-800" />
                                        )}
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-6 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-lg dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-700 dark:hover:bg-slate-800">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`rounded-lg p-3 ${step.iconBg}`}
                                                >
                                                    <Icon
                                                        className={`h-6 w-6 ${step.iconColor}`}
                                                    />
                                                </div>
                                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
