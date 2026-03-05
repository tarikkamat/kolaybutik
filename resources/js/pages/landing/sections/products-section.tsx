import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useI18n } from '@/i18n';
import {
    CreditCard,
    Link as LinkIcon,
    Repeat,
    ShoppingCart,
    Store,
    Wallet,
} from 'lucide-react';

export default function ProductsSection() {
    const { t } = useI18n();

    const products = [
        {
            icon: CreditCard,
            title: t('landing.products.onlinePayment.title'),
            description: t('landing.products.onlinePayment.description'),
            color: 'denim',
        },
        {
            icon: Store,
            title: t('landing.products.marketplace.title'),
            description: t('landing.products.marketplace.description'),
            color: 'bittersweet',
        },
        {
            icon: Repeat,
            title: t('landing.products.subscription.title'),
            description: t('landing.products.subscription.description'),
            color: 'kaamaru',
        },
        {
            icon: Wallet,
            title: t('landing.products.protectedTransfer.title'),
            description: t('landing.products.protectedTransfer.description'),
            color: 'denim',
        },
        {
            icon: LinkIcon,
            title: t('landing.products.link.title'),
            description: t('landing.products.link.description'),
            color: 'bittersweet',
        },
        {
            icon: ShoppingCart,
            title: t('landing.products.shoppingLoan.title'),
            description: t('landing.products.shoppingLoan.description'),
            color: 'kaamaru',
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
            id="products"
            className="bg-slate-50 px-4 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        {t('landing.products.title')}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        {t('landing.products.subtitle')}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => {
                        const Icon = product.icon;
                        const colors =
                            colorClasses[
                                product.color as keyof typeof colorClasses
                            ];
                        return (
                            <Card
                                key={product.title}
                                className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800"
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
                                            {product.title}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {product.description}
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
