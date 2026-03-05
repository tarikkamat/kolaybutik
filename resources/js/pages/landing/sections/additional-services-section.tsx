import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import { Link } from '@inertiajs/react';
import {
    CreditCard,
    FileText,
    Hash,
    Lock,
    RotateCcw,
    TrendingUp,
    Webhook,
} from 'lucide-react';

export default function AdditionalServicesSection() {
    const { t } = useI18n();

    const services = [
        {
            icon: CreditCard,
            title: t('landing.services.cardStorage.title'),
            description: t('landing.services.cardStorage.description'),
            color: 'denim',
        },
        {
            icon: FileText,
            title: t('landing.services.reporting.title'),
            description: t('landing.services.reporting.description'),
            color: 'bittersweet',
        },
        {
            icon: Webhook,
            title: t('landing.services.webhook.title'),
            description: t('landing.services.webhook.description'),
            color: 'kaamaru',
        },
        {
            icon: RotateCcw,
            title: t('landing.services.refund.title'),
            description: t('landing.services.refund.description'),
            color: 'denim',
        },
        {
            icon: TrendingUp,
            title: t('landing.services.installment.title'),
            description: t('landing.services.installment.description'),
            color: 'bittersweet',
        },
        {
            icon: Hash,
            title: t('landing.services.bin.title'),
            description: t('landing.services.bin.description'),
            color: 'kaamaru',
        },
        {
            icon: Lock,
            title: t('landing.services.signature.title'),
            description: t('landing.services.signature.description'),
            color: 'denim',
        },
    ];

    const colorClasses = {
        denim: {
            bg: 'bg-[color:var(--iyzico-denim)]/10 dark:bg-[color:var(--iyzico-denim)]/20',
            icon: '!text-[color:var(--iyzico-denim)]',
        },
        bittersweet: {
            bg: 'bg-[color:var(--iyzico-bittersweet)]/10 dark:bg-[color:var(--iyzico-bittersweet)]/20',
            icon: '!text-[color:var(--iyzico-bittersweet)]',
        },
        kaamaru: {
            bg: 'bg-[color:var(--kaamaru)]/10 dark:bg-[color:var(--kaamaru)]/20',
            icon: '!text-[color:var(--kaamaru)]',
        },
    };

    return (
        <section
            id="services"
            className="bg-white px-4 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        {t('landing.services.title')}
                    </h2>
                    <p className="mb-4 text-lg text-slate-600 dark:text-slate-400">
                        {t('landing.services.subtitle')}{' '}
                        <Link
                            href="/services"
                            className="font-medium text-[color:var(--iyzico-denim)] underline underline-offset-2 hover:opacity-90 dark:text-[color:var(--iyzico-denim)]"
                        >
                            {t('landing.services.testServices')}
                        </Link>
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const colors =
                            colorClasses[
                                service.color as keyof typeof colorClasses
                            ];
                        return (
                            <Card
                                key={service.title}
                                className="group border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800"
                            >
                                <CardHeader>
                                    <div
                                        className={`inline-flex items-center rounded-lg p-3 ${colors.bg}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${colors.icon}`}
                                        />
                                        <div
                                            className={`ms-2 leading-none font-semibold ${colors.icon}`}
                                        >
                                            {service.title}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {service.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
