import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import {
    CreditCard,
    Link as LinkIcon,
    Repeat,
    ShoppingCart,
    Store,
    TrendingUp,
    Wallet,
} from 'lucide-react';

export default function ProductsSection() {
    const products = [
        {
            icon: CreditCard,
            title: 'Online Ödeme',
            description:
                'Kredi kartı, banka kartı ve dijital cüzdan ile güvenli online ödeme alın.',
            color: 'indigo',
            href: '/demo/credit-card',
        },
        {
            icon: Store,
            title: 'Pazaryeri',
            description:
                'Çoklu satıcı yapısı ile pazaryeri modelinizi oluşturun ve komisyon yönetimi yapın.',
            color: 'emerald',
            href: '/store',
        },
        {
            icon: Repeat,
            title: 'Abonelik',
            description:
                'Tekrarlayan ödemeler için abonelik yönetimi. Otomatik yenileme ve iptal işlemleri.',
            color: 'purple',
            href: '/subscription',
        },
        {
            icon: Wallet,
            title: 'Korumalı Havale EFT',
            description:
                'Havale ve EFT ile ödeme alın. Ödeme onaylandıktan sonra ürün/hizmet teslim edilir.',
            color: 'amber',
            href: '/demo/checkout-form',
        },
        {
            icon: LinkIcon,
            title: 'iyzico Link',
            description:
                'Hızlı ödeme linkleri oluşturun. Müşterileriniz link üzerinden kolayca ödeme yapsın.',
            color: 'blue',
            href: '/services/iyzico-link',
        },
        {
            icon: ShoppingCart,
            title: 'Alışveriş Kredisi',
            description:
                'Müşterilerinize taksitli alışveriş kredisi seçeneği sunun.',
            color: 'rose',
            href: '/services/installment-bin',
        },
        {
            icon: TrendingUp,
            title: 'Mass Payout',
            description:
                'Toplu ödeme çözümü. Satıcılara, iş ortaklarına veya müşterilere toplu ödeme yapın.',
            color: 'teal',
            href: '/services/reports',
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
            id="products"
            className="bg-slate-50 px-4 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        iyzico Çözümleri
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        İşinize uygun ödeme çözümlerini keşfedin
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, index) => {
                        const Icon = product.icon;
                        const colors =
                            colorClasses[
                                product.color as keyof typeof colorClasses
                            ];
                        return (
                            <Link key={index} href={product.href}>
                                <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                                <CardHeader>
                                    <div
                                        className={`mb-4 inline-flex rounded-lg p-3 ${colors.bg}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${colors.icon}`}
                                        />
                                    </div>
                                    <CardTitle className="text-slate-900 dark:text-white">
                                        {product.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {product.description}
                                    </p>
                                </CardContent>
                            </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
