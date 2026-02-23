import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import {
    CreditCard,
    Link as LinkIcon,
    Repeat,
    ShoppingCart,
    Store,
    Wallet,
} from 'lucide-react';

export default function ProductsSection() {
    const products = [
        {
            icon: CreditCard,
            title: 'Online Ödeme',
            description:
                'Kredi kartı, banka kartı ve dijital cüzdan ile internet satışlarınızda güvenli ödeme alın.',
            color: 'denim',
        },
        {
            icon: Store,
            title: 'Pazaryeri',
            description:
                'Çoklu satıcı yapısı ile pazaryeri modelinizi oluşturun; komisyon ve ödemelerinizi otomatik yönetin.',
            color: 'bittersweet',
        },
        {
            icon: Repeat,
            title: 'Abonelik Yöntemi',
            description:
                'Tekrarlayan ödemeler için abonelik yöntemiyle ödeme alın. Otomatik yenileme, plan değişikliği ve iptal işlemlerini tek panelden yönetin.',
            color: 'kaamaru',
        },
        {
            icon: Wallet,
            title: 'Korumalı Havale/EFT',
            description:
                'Havale/EFT ile ödeme alın, ödeme onaylandıktan sonra ürün/hizmet teslim edilsin.',
            color: 'denim',
        },
        {
            icon: LinkIcon,
            title: 'iyzico Link Yöntemi',
            description:
                'Ürün veya tutar linki oluşturarak müşterilerinizle paylaşın, dilediğiniz anda güvenle ödeme alın.',
            color: 'bittersweet',
        },
        {
            icon: ShoppingCart,
            title: 'Alışveriş Kredisi',
            description:
                'Müşterilerinize banka kredisi ile taksitli alışveriş imkânı sunun, satışlarınızı artırın.',
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
                        Kullanabileceğiniz Ürünler
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        İş modelinize en uygun ürünleri keşfedin.
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
                                <Card className="border-slate-200 transition-shadow hover:shadow-lg dark:border-slate-800">
                                <CardHeader>
                                    <div
                                        className={`inline-flex items-center rounded-lg p-3 ${colors.bg}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${colors.icon}`}
                                        />
                                        <div className={`ms-2 font-semibold leading-none ${colors.icon}`}>
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
