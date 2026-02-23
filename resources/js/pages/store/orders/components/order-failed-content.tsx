import { Button } from '@/components/ui/button';
import { OrderFailedProps } from '@/types/order';
import { Link } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

export function OrderFailedContent({ error, orderId }: OrderFailedProps) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                Sipariş Başarısız
            </h1>
            <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
                Siparişiniz işlenirken bir hata oluştu.
            </p>
            {error && (
                <p className="mb-8 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </p>
            )}

            <div className="mb-8 rounded-lg bg-slate-50 p-6 dark:bg-slate-900/50">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Lütfen bilgilerinizi kontrol edip tekrar deneyin. Sorun
                    devam ederse bizimle iletişime geçin.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/store/checkout">
                    <Button className="w-full sm:w-auto">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tekrar Dene
                    </Button>
                </Link>
                <Link href="/store/cart">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Sepete Dön
                    </Button>
                </Link>
            </div>
        </div>
    );
}
