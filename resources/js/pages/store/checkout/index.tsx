import { Button } from '@/components/ui/button';
import StoreLayout from '@/layouts/store-layout';
import { CheckoutIndexProps } from '@/types/cart';
import { fakerTR as faker } from '@faker-js/faker';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    CreditCard,
    MapPin,
} from 'lucide-react';
import { useState } from 'react';
import { CheckoutSummary } from './components/checkout-summary';
import { PaymentOptions } from './components/payment-options';
import { ShippingAddressForm } from './components/shipping-address-form';

const STEPS = [
    { id: 1, name: 'Adres Bilgileri', icon: MapPin },
    { id: 2, name: 'Ödeme Seçenekleri', icon: CreditCard },
    { id: 3, name: 'Ödeme Sonucu', icon: CheckCircle2 },
] as const;

export default function CheckoutIndex({
    items,
    subtotal,
    tax = 0,
    shipping = 0,
    total,
}: CheckoutIndexProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
    const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
    const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);
    const [formData, setFormData] = useState({
        // Shipping Address
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Türkiye',

        // Payment
        card_number: '',
        card_name: '',
        card_expiry: '',
        card_cvv: '',
        payment_method: '',
        use_3d: false,
        installment: 1,
    });

    const validateStep = (step: number): boolean => {
        if (step === 1) {
            // Validate shipping address
            return !!(
                formData.full_name &&
                formData.email &&
                formData.phone &&
                formData.address &&
                formData.city &&
                formData.postal_code &&
                formData.country
            );
        }
        if (step === 2) {
            // Validate payment method is selected
            if (!formData.payment_method) {
                return false;
            }
            // If credit card is selected, validate card details
            if (formData.payment_method === 'credit_card') {
                return !!(
                    formData.card_number &&
                    formData.card_name &&
                    formData.card_expiry &&
                    formData.card_cvv
                );
            }
            // For other payment methods, just having a method selected is enough
            return true;
        }
        return false;
    };

    const handleNext = () => {
        if (validateStep(currentStep) && currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        if (!validateStep(2)) {
            return;
        }

        // Kredi kartı ödemesi için payment endpoint'ine istek at
        if (formData.payment_method === 'credit_card') {
            setIsSubmitting(true);

            try {
                const response = await fetch('/store/payment/credit-card', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                // Response JSON olmalı (Accept: application/json header'ı gönderdik)
                const result = await response.json();

                if (result.status === 'success') {
                    if (result.requires3ds && result.redirectUrl) {
                        // 3DS sayfasına yönlendir
                        window.location.href = result.redirectUrl;
                    } else {
                        // Non-3DS ödeme başarılı, success sayfasına yönlendir
                        const orderId = result.paymentId || 'ORD-' + Date.now();
                        router.visit(
                            `/store/orders/success?orderId=${orderId}&paymentId=${result.paymentId}`,
                        );
                    }
                } else {
                    alert(result.message || 'Ödeme işlemi başarısız');
                    setIsSubmitting(false);
                }
            } catch (error) {
                // Ödeme hatası
                alert('Ödeme işlemi sırasında bir hata oluştu');
                setIsSubmitting(false);
            }
        } else {
            // Diğer ödeme yöntemleri için eski akış
            setIsSubmitting(true);
            try {
                await router.post('/store/checkout', formData);
            } catch (error) {
                // Sipariş hatası
                setIsSubmitting(false);
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCardNumberChange = async (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        setFormData((prev) => ({ ...prev, card_number: formatted }));

        // 6 haneye ulaştığında taksit seçeneklerini getir
        if (cleaned.length >= 6) {
            const binNumber = cleaned.substring(0, 6);
            setIsLoadingInstallments(true);
            try {
                const response = await fetch(
                    '/store/payment/installment-options',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN':
                                document
                                    .querySelector('meta[name="csrf-token"]')
                                    ?.getAttribute('content') || '',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({ binNumber }),
                    },
                );

                const result = await response.json();
                if (
                    result.status === 'success' &&
                    result.installmentDetails &&
                    result.installmentDetails.length > 0
                ) {
                    // İlk installment detail'i al (genellikle tek bir detail döner)
                    const detail = result.installmentDetails[0];
                    setInstallmentOptions(detail.installmentPrices || []);
                } else {
                    // Taksit seçeneği yoksa tek çekim
                    setInstallmentOptions([]);
                    setSelectedInstallment(1);
                    setFormData((prev) => ({ ...prev, installment: 1 }));
                }
            } catch (error) {
                // Taksit bilgileri alınamadı
                setInstallmentOptions([]);
                setSelectedInstallment(1);
                setFormData((prev) => ({ ...prev, installment: 1 }));
            } finally {
                setIsLoadingInstallments(false);
            }
        } else {
            // 6 karakterden az ise tek çekim'e geri dön
            setInstallmentOptions([]);
            setSelectedInstallment(1);
            setFormData((prev) => ({ ...prev, installment: 1 }));
        }
    };

    const handleInstallmentChange = (
        installmentNumber: number,
        installmentPrice: number,
        totalPrice: number,
    ) => {
        setSelectedInstallment(installmentNumber);
        setFormData((prev) => ({ ...prev, installment: installmentNumber }));
    };

    const handleCardExpiryChange = (value: string) => {
        let cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        setFormData((prev) => ({ ...prev, card_expiry: cleaned }));
    };

    const handleCardCvvChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 3);
        setFormData((prev) => ({ ...prev, card_cvv: cleaned }));
    };

    const handleAutoFillAddress = () => {
        setFormData((prev) => ({
            ...prev,
            full_name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            email: faker.internet.email().toLowerCase(),
            phone: `0${faker.number.int({ min: 5000000000, max: 5999999999 })}`,
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            postal_code: faker.location.zipCode('#####'),
            country: 'Türkiye',
        }));
    };

    return (
        <StoreLayout title="Ödeme">
            <Head title="Ödeme" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/store/cart"
                    className="mb-6 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Sepete Dön
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Ödeme
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Siparişinizi tamamlamak için bilgilerinizi girin
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                    <nav aria-label="Progress">
                        <ol className="flex items-center">
                            {STEPS.map((step, stepIdx) => {
                                const Icon = step.icon;
                                const isCompleted = currentStep > step.id;
                                const isCurrent = currentStep === step.id;

                                return (
                                    <li
                                        key={step.id}
                                        className="relative flex-1"
                                    >
                                        {/* Connector Line */}
                                        {stepIdx !== STEPS.length - 1 && (
                                            <div
                                                className="absolute top-5 left-[calc(50%+1.25rem)] h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2"
                                                aria-hidden="true"
                                            >
                                                <div
                                                    className={`h-full ${
                                                        isCompleted
                                                            ? 'bg-indigo-600'
                                                            : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center">
                                            <div
                                                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                                                    isCompleted
                                                        ? 'border-indigo-600 bg-indigo-600'
                                                        : isCurrent
                                                          ? 'border-indigo-600 bg-white dark:bg-slate-900'
                                                          : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <Check className="h-6 w-6 text-white" />
                                                ) : (
                                                    <Icon
                                                        className={`h-6 w-6 ${
                                                            isCurrent
                                                                ? 'text-indigo-600'
                                                                : 'text-slate-500'
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                            <div className="mt-2 text-center">
                                                <p
                                                    className={`text-xs font-medium whitespace-nowrap sm:text-sm ${
                                                        isCurrent
                                                            ? 'text-indigo-600'
                                                            : isCompleted
                                                              ? 'text-indigo-600'
                                                              : 'text-slate-500'
                                                    }`}
                                                >
                                                    {step.name}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
                                {/* Step 1: Shipping Address */}
                                {currentStep === 1 && (
                                    <ShippingAddressForm
                                        formData={formData}
                                        onInputChange={handleInputChange}
                                        onAutoFill={handleAutoFillAddress}
                                    />
                                )}

                                {/* Step 2: Payment */}
                                {currentStep === 2 && (
                                    <PaymentOptions
                                        formData={formData}
                                        onInputChange={handleInputChange}
                                        onCardNumberChange={
                                            handleCardNumberChange
                                        }
                                        onCardExpiryChange={
                                            handleCardExpiryChange
                                        }
                                        onCardCvvChange={handleCardCvvChange}
                                        onSubmit={handleSubmit}
                                        isSubmitting={isSubmitting}
                                        isValid={validateStep(2)}
                                        installmentOptions={installmentOptions}
                                        selectedInstallment={
                                            selectedInstallment
                                        }
                                        onInstallmentChange={
                                            handleInstallmentChange
                                        }
                                        isLoadingInstallments={
                                            isLoadingInstallments
                                        }
                                    />
                                )}

                                {/* Navigation Buttons */}
                                <div className="mt-8 flex justify-between">
                                    <div>
                                        {currentStep > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handlePrevious}
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Geri
                                            </Button>
                                        )}
                                    </div>
                                    <div>
                                        {currentStep === 1 && (
                                            <Button
                                                type="button"
                                                onClick={handleNext}
                                                disabled={
                                                    !validateStep(currentStep)
                                                }
                                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                İleri
                                            </Button>
                                        )}
                                        {currentStep === 3 && (
                                            <Button
                                                type="submit"
                                                disabled={
                                                    isSubmitting ||
                                                    !validateStep(2)
                                                }
                                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                {isSubmitting
                                                    ? 'İşleniyor...'
                                                    : 'Siparişi Tamamla'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <CheckoutSummary
                                items={items}
                                subtotal={subtotal}
                                tax={tax}
                                shipping={shipping}
                                total={total}
                                selectedInstallment={selectedInstallment}
                                installmentOptions={installmentOptions}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </StoreLayout>
    );
}
