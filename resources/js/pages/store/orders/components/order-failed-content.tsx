import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { OrderFailedProps } from '@/types/order';
import { Link } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

export function OrderFailedContent({ error, orderId }: OrderFailedProps) {
    const { text } = useI18n();

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                {text('Sipariş Başarısız', 'Order Failed')}
            </h1>
            <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
                {text(
                    'Siparişiniz işlenirken bir hata oluştu.',
                    'An error occurred while processing your order.',
                )}
            </p>
            {error && (
                <p className="mb-8 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </p>
            )}

            <div className="mb-8 rounded-lg bg-slate-50 p-6 dark:bg-slate-900/50">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    {text(
                        'Lütfen bilgilerinizi kontrol edip tekrar deneyin. Sorun devam ederse bizimle iletişime geçin.',
                        'Please check your information and try again. If the issue continues, contact us.',
                    )}
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/store/checkout">
                    <Button className="w-full sm:w-auto">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {text('Tekrar Dene', 'Try Again')}
                    </Button>
                </Link>
                <Link href="/store/cart">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {text('Sepete Dön', 'Back to Cart')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
