import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { OrderShowProps } from '@/types/order';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Home,
    XCircle,
} from 'lucide-react';

export function OrderDetailsContent({
    orderId,
    paymentId,
    paymentData,
}: OrderShowProps) {
    const { text, language } = useI18n();
    const locale = language === 'tr' ? 'tr-TR' : 'en-US';

    const getStatusIcon = (status?: string) => {
        if (status === 'SUCCESS') {
            return <CheckCircle2 className="h-5 w-5 text-green-600" />;
        } else if (status === 'FAILURE') {
            return <XCircle className="h-5 w-5 text-red-600" />;
        }
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    };

    const getStatusText = (status?: string) => {
        if (status === 'SUCCESS') {
            return text('Başarılı', 'Successful');
        } else if (status === 'FAILURE') {
            return text('Başarısız', 'Failed');
        }
        return text('Beklemede', 'Pending');
    };

    const getStatusColor = (status?: string) => {
        if (status === 'SUCCESS') {
            return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        } else if (status === 'FAILURE') {
            return 'text-red-600 bg-red-50 dark:bg-red-900/20';
        }
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {text('Sipariş Detayları', 'Order Details')}
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {text('Sipariş No:', 'Order No:')}{' '}
                            <span className="font-semibold">{orderId}</span>
                        </p>
                    </div>
                    <Link href="/store">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Home className="mr-2 h-4 w-4" />
                            {text('Mağazaya Dön', 'Back to Store')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Payment Information */}
            {paymentData && paymentData.status === 'success' && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
                    <div className="mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {text('Ödeme Bilgileri', 'Payment Information')}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Payment Status */}
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {text('Ödeme Durumu:', 'Payment Status:')}
                            </span>
                            <div
                                className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    paymentData.paymentStatus,
                                )}`}
                            >
                                {getStatusIcon(paymentData.paymentStatus)}
                                {getStatusText(paymentData.paymentStatus)}
                            </div>
                        </div>

                        {/* Payment ID */}
                        {paymentId && (
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {text('Ödeme ID:', 'Payment ID:')}
                                </span>
                                <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                                    {paymentId}
                                </span>
                            </div>
                        )}

                        {/* Amount */}
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {text('Tutar:', 'Amount:')}
                            </span>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {paymentData.paidPrice} {paymentData.currency}
                            </span>
                        </div>

                        {/* Card Information */}
                        {paymentData.cardAssociation && (
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {text('Kart:', 'Card:')}
                                </span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {paymentData.cardAssociation}{' '}
                                    {paymentData.cardType}
                                    {paymentData.lastFourDigits &&
                                        ` •••• ${paymentData.lastFourDigits}`}
                                </span>
                            </div>
                        )}

                        {/* Installment */}
                        {paymentData.installment &&
                            paymentData.installment > 1 && (
                                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {text('Taksit:', 'Installment:')}
                                    </span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {paymentData.installment}{' '}
                                        {text('Taksit', 'Installments')}
                                    </span>
                                </div>
                            )}

                        {/* Auth Code */}
                        {paymentData.authCode && (
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {text('Onay Kodu:', 'Auth Code:')}
                                </span>
                                <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                                    {paymentData.authCode}
                                </span>
                            </div>
                        )}

                        {/* System Time */}
                        {paymentData.systemTime && (
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {text('İşlem Tarihi:', 'Transaction Date:')}
                                </span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(
                                        paymentData.systemTime,
                                    ).toLocaleString(locale)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error State */}
            {paymentData && paymentData.status !== 'success' && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                    <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">
                            {text(
                                'Ödeme Bilgileri Alınamadı',
                                'Payment Information Unavailable',
                            )}
                        </h2>
                    </div>
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {paymentData.errorMessage ||
                            text(
                                'Ödeme bilgileri alınırken bir hata oluştu.',
                                'An error occurred while retrieving payment information.',
                            )}
                    </p>
                </div>
            )}

            {/* No Payment Data */}
            {!paymentData && (
                <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
                    <p className="text-center text-slate-600 dark:text-slate-400">
                        {text(
                            'Ödeme bilgisi bulunamadı.',
                            'No payment information found.',
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
