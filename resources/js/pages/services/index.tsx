import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { useI18n } from '@/i18n';
import {
    ArrowLeft,
    CreditCard,
    FileText,
    Link as LinkIcon,
    MessageCircle,
    Repeat,
    Search,
    Server,
    Wallet,
    Webhook,
} from 'lucide-react';

export default function ServicesIndex() {
    const { text } = useI18n();

    const services = [
        {
            id: 'webhook-catcher',
            title: text('Webhook Yakalama', 'Webhook Catcher'),
            description: text(
                "Gelen webhook isteklerini gerçek zamanlı olarak görüntüleyin ve filtreleyin. Son 1 saat içindeki son 100 webhook'u görüntüleyebilirsiniz.",
                'View and filter incoming webhook requests in real time. See the last 100 webhooks from the past hour.',
            ),
            icon: Webhook,
            href: '/services/webhook-catcher',
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            borderColor: 'border-indigo-200 dark:border-indigo-800',
            comingSoon: true,
        },
        {
            id: 'sftp',
            title: text('SFTP İstemcisi', 'SFTP Client'),
            description: text(
                'SFTP sunucusuna bağlanın ve dosyalarınızı görüntüleyin, okuyun ve indirin. Sadece okuma yetkisi ile güvenli dosya erişimi.',
                'Connect to an SFTP server to view, read, and download files with read-only, safe access.',
            ),
            icon: Server,
            href: '/services/sftp',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            comingSoon: true,
        },
        {
            id: 'reports',
            title: text('Raporlar', 'Reports'),
            description: text(
                'İşlem raporlarını görüntüleyin. Scroll Transactions, Transaction Daily, Transaction Based, Marketplace Payout ve Bounced Payments raporları.',
                'View transaction reports: Scroll Transactions, Transaction Daily, Transaction Based, Marketplace Payout, and Bounced Payments.',
            ),
            icon: FileText,
            href: '/services/reports',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            comingSoon: true,
        },
        {
            id: 'installment-bin',
            title: text('Taksit ve BIN Sorgulama', 'Installment & BIN Lookup'),
            description: text(
                'Kart BIN numarasına göre taksit bilgilerini ve BIN numarası detaylarını sorgulayın.',
                'Query installment options and BIN details by card BIN number.',
            ),
            icon: CreditCard,
            href: '/services/installment-bin',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
            comingSoon: true,
        },
        {
            id: 'payment-inquiry',
            title: text('Ödeme Sorgulama', 'Payment Inquiry'),
            description: text(
                'Payment ID veya Payment Conversation ID ile ödeme bilgilerini sorgulayın.',
                'Query payment details by Payment ID or Payment Conversation ID.',
            ),
            icon: Search,
            href: '/services/payment-inquiry',
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            borderColor: 'border-orange-200 dark:border-orange-800',
        },
        {
            id: 'card-storage',
            title: text('Kart Saklama', 'Card Storage'),
            description: text(
                'Müşteri kartlarını saklayın, listeleyin ve yönetin. Kart oluşturma, silme ve listeleme işlemleri.',
                'Store, list, and manage customer cards. Create, delete, and view saved cards.',
            ),
            icon: Wallet,
            href: '/services/card-storage',
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-50 dark:bg-pink-900/20',
            borderColor: 'border-pink-200 dark:border-pink-800',
            comingSoon: true,
        },
        {
            id: 'iyzico-link',
            title: text('iyzico Link', 'iyzico Link'),
            description: text(
                'iyzico Link oluşturun, güncelleyin, listeleyin ve yönetin. Link oluşturma, Fastlink, detay görüntüleme, güncelleme, durum değiştirme ve silme işlemleri.',
                'Create, update, list, and manage iyzico Links. Create links and fastlinks, view details, update, change status, and delete.',
            ),
            icon: LinkIcon,
            href: '/services/iyzico-link',
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
            borderColor: 'border-cyan-200 dark:border-cyan-800',
        },
        {
            id: 'subscription',
            title: text('Abonelik Yönetimi', 'Subscription Management'),
            description: text(
                'iyzico abonelik sistemi ile ürün, plan, abonelik ve abone yönetimi. Ürün ve plan oluşturma, abonelik başlatma, iptal etme ve yönetme işlemleri.',
                'Manage products, plans, subscriptions, and subscribers with iyzico subscriptions. Create products and plans, start, cancel, and manage subscriptions.',
            ),
            icon: Repeat,
            href: '/subscription',
            color: 'text-teal-600 dark:text-teal-400',
            bgColor: 'bg-teal-50 dark:bg-teal-900/20',
            borderColor: 'border-teal-200 dark:border-teal-800',
            comingSoon: true,
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title={text('Servisler', 'Services')} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {text('Ana sayfaya geri dön', 'Back to homepage')}
                    </Link>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {text('Servisler', 'Services')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        {text(
                            'Kullanılabilir servisleri görüntüleyin ve yönetin',
                            'View and manage available services',
                        )}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const isComingSoon = !!(service as { comingSoon?: boolean }).comingSoon;
                        const cardContent = (
                            <CardHeader className="pb-4">
                                {isComingSoon && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute right-4 top-4"
                                    >
                                        {text('Çok Yakında', 'Coming Soon')}
                                    </Badge>
                                )}
                                <div
                                    className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.bgColor} mb-4 transition-transform duration-200 ${!isComingSoon && 'group-hover:scale-110'}`}
                                >
                                    <Icon
                                        className={`h-7 w-7 ${service.color}`}
                                    />
                                </div>
                                <CardTitle className={`mb-2 text-xl font-semibold text-slate-900 dark:text-white ${!isComingSoon && 'transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                        );
                        return (
                            <Card
                                key={service.id}
                                className={`group relative overflow-hidden border-2 bg-white dark:bg-slate-800 ${service.borderColor} ${isComingSoon ? 'cursor-default opacity-90' : 'transition-all duration-200 hover:scale-[1.02] hover:shadow-xl'}`}
                            >
                                {isComingSoon ? (
                                    <div className="block h-full">{cardContent}</div>
                                ) : (
                                    <Link href={service.href} className="block h-full">
                                        {cardContent}
                                    </Link>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {services.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Server className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            {text(
                                'Henüz servis bulunmamaktadır.',
                                'No services are available yet.',
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
