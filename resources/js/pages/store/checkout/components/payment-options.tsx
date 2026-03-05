import { useI18n } from '@/i18n';
import { PaymentMethod, PaymentOptionsProps } from '@/types/cart';
import { AppWindow, CreditCard, Save, Wallet2, Zap } from 'lucide-react';
import { CheckoutForm } from './checkout-form';
import { CreditCardPayment } from './credit-card-payment';
import { OtherPaymentMethod } from './other-payment-method';
import { PayWithIyzico } from './pay-with-iyzico';
import { QuickPwi } from './quick-pwi';
import { SavedCardPayment } from './saved-card-payment';

interface InstallmentOption {
    installmentNumber: number;
    installmentPrice: number;
    totalPrice: number;
}

export function PaymentOptions({
    formData,
    onInputChange,
    onCardNumberChange,
    onCardExpiryChange,
    onCardCvvChange,
    onPaymentMethodChange,
    onSubmit,
    isSubmitting = false,
    isValid = false,
    installmentOptions = [],
    selectedInstallment = 1,
    onInstallmentChange,
    isLoadingInstallments = false,
    savedCards = [],
    isLoadingSavedCards = false,
    savedCardsError = null,
    onFetchSavedCards,
    onSavedCardSelect,
    onCardUserKeyChange,
}: PaymentOptionsProps & {
    installmentOptions?: InstallmentOption[];
    selectedInstallment?: number;
    onInstallmentChange?: (
        installmentNumber: number,
        installmentPrice: number,
        totalPrice: number,
    ) => void;
    isLoadingInstallments?: boolean;
}) {
    const { text } = useI18n();
    const selectedMethod = (formData.payment_method as PaymentMethod) || null;

    const handleMethodSelect = (method: PaymentMethod) => {
        onPaymentMethodChange?.(method);
        onInputChange({
            target: { name: 'payment_method', value: method },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const paymentMethods = [
        {
            id: 'credit_card' as PaymentMethod,
            title: text('Kredi Kartı ile Ödeme', 'Pay with Credit Card'),
            icon: CreditCard,
            description: text(
                'Kredi kartı bilgilerinizi girin',
                'Enter your credit card details',
            ),
            showPayButton: true,
        },
        {
            id: 'checkout_form' as PaymentMethod,
            title: text('Checkout Form ile Ödeme', 'Pay with Checkout Form'),
            icon: AppWindow,
            description: text(
                'iyzico Checkout Form kullanarak ödeme yapın',
                'Pay using iyzico Checkout Form',
            ),
            showPayButton: false,
        },
        {
            id: 'iyzico' as PaymentMethod,
            title: 'Pay with iyzico',
            icon: Wallet2,
            description: text(
                'iyzico ile güvenli ödeme',
                'Secure payment with iyzico',
            ),
            showPayButton: true,
        },
        {
            id: 'saved_card' as PaymentMethod,
            title: text('Saklı Kart ile Ödeme', 'Pay with Saved Card'),
            icon: Save,
            description: text(
                'Mevcut saklı kartlarınızdan birini kullanın',
                'Use one of your saved cards',
            ),
            showPayButton: true,
        },
        {
            id: 'iyzico_quick' as PaymentMethod,
            title: 'Quick Pay with iyzico',
            icon: Zap,
            description: text(
                'Hızlı ödeme ile devam edin',
                'Continue with quick payment',
            ),
            showPayButton: false,
        },
    ];

    return (
        <div>
            <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                {text('Ödeme Yöntemi Seçin', 'Select a Payment Method')}
            </h2>

            <div className="space-y-4">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <div key={method.id}>
                            <label
                                className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                                    isSelected
                                        ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value={method.id}
                                    checked={isSelected}
                                    onChange={() =>
                                        handleMethodSelect(method.id)
                                    }
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`h-5 w-5 ${
                                                isSelected
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                        />
                                        <span
                                            className={`font-medium ${
                                                isSelected
                                                    ? 'text-indigo-900 dark:text-indigo-100'
                                                    : 'text-slate-900 dark:text-white'
                                            }`}
                                        >
                                            {method.title}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {method.description}
                                    </p>
                                </div>
                            </label>

                            {/* Kredi Kartı ile Ödeme seçildiğinde form göster */}
                            {isSelected && method.id === 'credit_card' && (
                                <CreditCardPayment
                                    formData={formData}
                                    onInputChange={onInputChange}
                                    onCardNumberChange={onCardNumberChange}
                                    onCardExpiryChange={onCardExpiryChange}
                                    onCardCvvChange={onCardCvvChange}
                                    onSubmit={onSubmit}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                    installmentOptions={installmentOptions}
                                    selectedInstallment={selectedInstallment}
                                    onInstallmentChange={onInstallmentChange}
                                    isLoadingInstallments={
                                        isLoadingInstallments
                                    }
                                />
                            )}

                            {/* Checkout Form ile Ödeme */}
                            {isSelected && method.id === 'checkout_form' && (
                                <CheckoutForm formData={formData} />
                            )}

                            {/* Pay with iyzico */}
                            {isSelected && method.id === 'iyzico' && (
                                <PayWithIyzico
                                    formData={formData}
                                    onSubmit={onSubmit}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                />
                            )}

                            {/* Quick PWI */}
                            {isSelected && method.id === 'iyzico_quick' && (
                                <QuickPwi formData={formData} />
                            )}

                            {/* Saved Card */}
                            {isSelected && method.id === 'saved_card' && (
                                <SavedCardPayment
                                    formData={formData}
                                    savedCards={savedCards}
                                    isLoadingSavedCards={isLoadingSavedCards}
                                    savedCardsError={savedCardsError}
                                    onFetchSavedCards={onFetchSavedCards}
                                    onSavedCardSelect={onSavedCardSelect}
                                    onCardUserKeyChange={onCardUserKeyChange}
                                    onCardCvvChange={onCardCvvChange}
                                    onSubmit={onSubmit}
                                    isSubmitting={isSubmitting}
                                    isValid={isValid}
                                />
                            )}

                            {/* Diğer ödeme yöntemleri için placeholder */}
                            {isSelected &&
                                method.id !== 'credit_card' &&
                                method.id !== 'checkout_form' &&
                                method.id !== 'iyzico' &&
                                method.id !== 'iyzico_quick' &&
                                method.id !== 'saved_card' && (
                                    <OtherPaymentMethod
                                        title={method.title}
                                        icon={Icon}
                                        showPayButton={method.showPayButton}
                                        onSubmit={onSubmit}
                                        isSubmitting={isSubmitting}
                                        isValid={isValid}
                                    />
                                )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
