import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const services = [
        {
            icon: CreditCard,
            title: 'Kart Saklama',
            description:
                'Müşterilerinizin kart bilgilerini güvenli bir şekilde saklayın. Tek tıkla hızlı ödeme.',
            color: 'denim',
        },
        {
            icon: FileText,
            title: 'Raporlama',
            description:
                'Detaylı ödeme raporları ve finansal analizler. İşinizi veri ile yönetin.',
            color: 'bittersweet',
        },
        {
            icon: Webhook,
            title: 'Webhook',
            description:
                'Gerçek zamanlı bildirimler. Ödeme durumlarını anında takip edin.',
            color: 'kaamaru',
        },
        {
            icon: RotateCcw,
            title: 'İptal İade',
            description:
                'Kolay iptal ve iade işlemleri. Müşteri memnuniyeti için esnek çözümler.',
            color: 'denim',
        },
        {
            icon: TrendingUp,
            title: 'Taksit Servisi',
            description:
                'Taksitli ödeme seçenekleri. Müşterilerinize esnek ödeme imkanı sunun.',
            color: 'bittersweet',
        },
        {
            icon: Hash,
            title: 'Bin Servisi',
            description:
                'Kart numarasına göre banka ve kart tipi bilgilerini alın.',
            color: 'kaamaru',
        },
        {
            icon: Lock,
            title: 'Signature',
            description:
                'API çağrılarınızın güvenliğini sağlamak için imza mekanizması.',
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
                        İşinizi Kolaylaştıracak Çözümler
                    </h2>
                    <p className="mb-4 text-lg text-slate-600 dark:text-slate-400">
                        Ödeme deneyiminizi iyileştiren teknik servisleri inceleyin.{' '}
                        <Link
                            href="/services"
                            className="font-medium text-[color:var(--iyzico-denim)] underline underline-offset-2 hover:opacity-90 dark:text-[color:var(--iyzico-denim)]"
                        >
                            Servisleri test et
                        </Link>
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
                                className="group border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800"
                            >
                                <CardHeader>
                                    <div
                                        className={`inline-flex items-center rounded-lg p-3 ${colors.bg}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${colors.icon}`}
                                        />
                                        <div className={`ms-2 font-semibold leading-none ${colors.icon}`}>
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
