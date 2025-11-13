import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const services = [
        {
            icon: CreditCard,
            title: 'Kart Saklama',
            description:
                'Müşterilerinizin kart bilgilerini güvenli bir şekilde saklayın. Tek tıkla hızlı ödeme.',
            color: 'indigo',
        },
        {
            icon: FileText,
            title: 'Raporlama',
            description:
                'Detaylı ödeme raporları ve finansal analizler. İşinizi veri ile yönetin.',
            color: 'emerald',
        },
        {
            icon: Webhook,
            title: 'Webhook',
            description:
                'Gerçek zamanlı bildirimler. Ödeme durumlarını anında takip edin.',
            color: 'purple',
        },
        {
            icon: RotateCcw,
            title: 'İptal İade',
            description:
                'Kolay iptal ve iade işlemleri. Müşteri memnuniyeti için esnek çözümler.',
            color: 'amber',
        },
        {
            icon: TrendingUp,
            title: 'Taksit Servisi',
            description:
                'Taksitli ödeme seçenekleri. Müşterilerinize esnek ödeme imkanı sunun.',
            color: 'blue',
        },
        {
            icon: Hash,
            title: 'Bin Servisi',
            description:
                'Kart numarasına göre banka ve kart tipi bilgilerini alın.',
            color: 'rose',
        },
        {
            icon: Lock,
            title: 'Signature',
            description:
                'API çağrılarınızın güvenliğini sağlamak için imza mekanizması.',
            color: 'teal',
        },
    ];

    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-100 dark:bg-indigo-950',
            icon: 'text-indigo-600 dark:text-indigo-400',
        },
        emerald: {
            bg: 'bg-emerald-100 dark:bg-emerald-950',
            icon: 'text-emerald-600 dark:text-emerald-400',
        },
        purple: {
            bg: 'bg-purple-100 dark:bg-purple-950',
            icon: 'text-purple-600 dark:text-purple-400',
        },
        amber: {
            bg: 'bg-amber-100 dark:bg-amber-950',
            icon: 'text-amber-600 dark:text-amber-400',
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-950',
            icon: 'text-blue-600 dark:text-blue-400',
        },
        rose: {
            bg: 'bg-rose-100 dark:bg-rose-950',
            icon: 'text-rose-600 dark:text-rose-400',
        },
        teal: {
            bg: 'bg-teal-100 dark:bg-teal-950',
            icon: 'text-teal-600 dark:text-teal-400',
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
                        Faydalı Çözümler
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Ödeme deneyimini geliştiren ek özelliklerimiz
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        const colors =
                            colorClasses[
                                service.color as keyof typeof colorClasses
                            ];
                        return (
                            <Card
                                key={index}
                                className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800"
                            >
                                <CardHeader>
                                    <div
                                        className={`mb-4 inline-flex rounded-lg p-3 ${colors.bg}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${colors.icon}`}
                                        />
                                    </div>
                                    <CardTitle className="text-slate-900 dark:text-white">
                                        {service.title}
                                    </CardTitle>
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
