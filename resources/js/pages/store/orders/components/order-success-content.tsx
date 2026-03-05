import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { OrderSuccessProps } from '@/types/order';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Home, Package } from 'lucide-react';

export function OrderSuccessContent({
    orderNumber,
    orderId,
    paymentId,
    paymentMethod,
    paymentData,
}: OrderSuccessProps) {
    const { text } = useI18n();

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                {text('Siparişiniz Alındı!', 'Your Order Has Been Received!')}
            </h1>
            <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
                {text(
                    'Siparişiniz başarıyla oluşturuldu.',
                    'Your order has been created successfully.',
                )}
            </p>
            {orderNumber && (
                <p className="mb-8 text-sm text-slate-500 dark:text-slate-500">
                    {text('Sipariş No:', 'Order No:')}{' '}
                    <span className="font-semibold">{orderNumber}</span>
                </p>
            )}

            <div className="mb-8 rounded-lg bg-slate-50 p-6 dark:bg-slate-900/50">
                <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                    <Package className="h-5 w-5" />
                    <p className="text-sm">
                        {text(
                            'Siparişiniz hazırlandığında size e-posta ile bilgi verilecektir.',
                            'You will be notified by email when your order is prepared.',
                        )}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                {orderId && (
                    <Link
                        href={
                            `/store/orders/${orderId}` +
                            (paymentId || paymentMethod
                                ? '?' +
                                  [
                                      paymentId && `paymentId=${paymentId}`,
                                      paymentMethod &&
                                          `paymentMethod=${paymentMethod}`,
                                  ]
                                      .filter(Boolean)
                                      .join('&')
                                : '')
                        }
                    >
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Package className="mr-2 h-4 w-4" />
                            {text('Sipariş Detayları', 'Order Details')}
                        </Button>
                    </Link>
                )}
                <Link href="/store">
                    <Button className="w-full sm:w-auto">
                        <Home className="mr-2 h-4 w-4" />
                        {text('Mağazaya Dön', 'Back to Store')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
