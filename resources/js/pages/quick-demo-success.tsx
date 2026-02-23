import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Home, RefreshCw } from 'lucide-react';

interface QuickDemoSuccessProps {
    orderId?: string;
    paymentId?: string;
}

export default function QuickDemoSuccess({
    orderId,
    paymentId,
}: QuickDemoSuccessProps) {
    return (
        <>
            <Head title="Demo Ödeme Başarılı" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                            Demo Ödeme Başarılı!
                        </h1>
                        <p className="mb-2 text-lg text-slate-600 dark:text-slate-400">
                            Ödeme işlemi başarıyla tamamlandı.
                        </p>
                        {orderId && (
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-500">
                                Sipariş No:{' '}
                                <span className="font-semibold">{orderId}</span>
                            </p>
                        )}
                        {paymentId && (
                            <p className="mb-8 text-sm text-slate-500 dark:text-slate-500">
                                Ödeme ID:{' '}
                                <span className="font-semibold">{paymentId}</span>
                            </p>
                        )}

                        <div className="mb-8 rounded-lg bg-slate-50 p-6 dark:bg-slate-900/50">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Bu bir demo ödeme işlemidir. Gerçek bir ödeme
                                yapılmamıştır.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link href="/demo/credit-card">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Tekrar Dene
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button className="w-full sm:w-auto">
                                    <Home className="mr-2 h-4 w-4" />
                                    Ana Sayfaya Dön
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
