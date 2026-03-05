import { useI18n } from '@/i18n';
import { CheckoutSummaryProps } from '@/types/cart';

export function CheckoutSummary({
    items,
    subtotal,
    tax = 0,
    shipping = 0,
    total,
    selectedInstallment = 1,
    installmentOptions = [],
}: CheckoutSummaryProps & {
    selectedInstallment?: number;
    installmentOptions?: any[];
}) {
    const { text } = useI18n();

    // Seçili taksit bilgisini bul
    const selectedOption = installmentOptions.find(
        (opt) => opt.installmentNumber === selectedInstallment,
    );

    // Taksit varsa aylık ödeme tutarını göster
    const monthlyPayment = selectedOption
        ? parseFloat(selectedOption.installmentPrice)
        : null;
    const totalWithInstallment = selectedOption
        ? parseFloat(selectedOption.totalPrice)
        : total;
    return (
        <div className="sticky top-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                {text('Sipariş Özeti', 'Order Summary')}
            </h2>
            <div className="mb-4 space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 text-sm"
                    >
                        {item.product.image && (
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-12 w-12 rounded object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                                {item.product.name}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400">
                                {item.quantity} {text('adet', 'pcs')}
                            </p>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₺{item.price.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
            <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                        {text('Ara Toplam', 'Subtotal')}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                        ₺{subtotal.toFixed(2)}
                    </span>
                </div>
                {tax > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                            {text('KDV', 'VAT')}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₺{tax.toFixed(2)}
                        </span>
                    </div>
                )}
                {shipping > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                            {text('Kargo', 'Shipping')}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₺{shipping.toFixed(2)}
                        </span>
                    </div>
                )}
                {selectedInstallment > 1 && monthlyPayment && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                            {text('Aylık Ödeme', 'Monthly Payment')} (
                            {selectedInstallment}x)
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₺{monthlyPayment.toFixed(2)}
                        </span>
                    </div>
                )}
                <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                    <div className="flex justify-between">
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">
                            {selectedInstallment > 1
                                ? text('Toplam Tutar', 'Total Amount')
                                : text('Toplam', 'Total')}
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                            ₺{totalWithInstallment.toFixed(2)}
                        </span>
                    </div>
                    {selectedInstallment > 1 && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {selectedInstallment}{' '}
                            {text('taksit ile ödeme', 'installments payment')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
