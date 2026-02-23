import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PaymentForm } from './payment-form';

interface CreditCardPaymentProps {
    formData: {
        card_number: string;
        card_name: string;
        card_expiry: string;
        card_cvv: string;
        use_3d?: boolean;
    };
    onInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
    onCardNumberChange: (value: string) => void;
    onCardExpiryChange: (value: string) => void;
    onCardCvvChange: (value: string) => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    isValid?: boolean;
    installmentOptions?: any[];
    selectedInstallment?: number;
    onInstallmentChange?: (
        installmentNumber: number,
        installmentPrice: number,
        totalPrice: number,
    ) => void;
    isLoadingInstallments?: boolean;
}

export function CreditCardPayment({
    formData,
    onInputChange,
    onCardNumberChange,
    onCardExpiryChange,
    onCardCvvChange,
    onSubmit,
    isSubmitting = false,
    isValid = false,
    installmentOptions = [],
    selectedInstallment = 1,
    onInstallmentChange,
    isLoadingInstallments = false,
}: CreditCardPaymentProps) {
    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <PaymentForm
                formData={formData}
                onInputChange={onInputChange}
                onCardNumberChange={onCardNumberChange}
                onCardExpiryChange={onCardExpiryChange}
                onCardCvvChange={onCardCvvChange}
            />
            <div className="mt-4 space-y-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="use_3d"
                        checked={formData.use_3d || false}
                        onChange={onInputChange}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        3D ile Ödeme
                    </span>
                </label>

                {/* Taksit Seçenekleri */}
                {isLoadingInstallments && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Taksit seçenekleri yükleniyor...
                    </div>
                )}
                {!isLoadingInstallments && installmentOptions.length > 0 && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Taksit Seçenekleri
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {installmentOptions.map((option) => (
                                <label
                                    key={option.installmentNumber}
                                    className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
                                        selectedInstallment === option.installmentNumber
                                            ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="installment"
                                        value={option.installmentNumber}
                                        checked={selectedInstallment === option.installmentNumber}
                                        onChange={() =>
                                            onInstallmentChange?.(
                                                option.installmentNumber,
                                                option.installmentPrice,
                                                option.totalPrice,
                                            )
                                        }
                                        className="sr-only"
                                    />
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                        {option.installmentNumber}x
                                    </div>
                                    <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                        ₺{parseFloat(option.installmentPrice).toFixed(2)}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-6">
                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting || !isValid}
                    className="w-full"
                >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'İşleniyor...' : 'Ödeme Yap'}
                </Button>
            </div>
        </div>
    );
}
