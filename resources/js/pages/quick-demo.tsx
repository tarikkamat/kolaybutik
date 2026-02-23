import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, Link, router } from '@inertiajs/react';
import { AppWindow, ArrowLeft, CreditCard, Wallet2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CheckoutForm } from '@/pages/store/checkout/components/checkout-form';
import { PayWithIyzico } from '@/pages/store/checkout/components/pay-with-iyzico';
import { PaymentForm } from '@/pages/store/checkout/components/payment-form';

interface QuickDemoProps {
    product: {
        id: number;
        name: string;
        image: string;
        price: number;
        quantity: number;
    };
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    paymentMethod: string;
}

export default function QuickDemo({
    product,
    subtotal,
    tax,
    shipping,
    total,
    paymentMethod,
}: QuickDemoProps) {
    // Tab mapping
    const tabMapping: Record<string, string> = {
        'credit-card': 'credit-card',
        'checkout-form': 'checkout-form',
        'pay-with-iyzico': 'pay-with-iyzico',
    };

    const [activeTab, setActiveTab] = useState(
        tabMapping[paymentMethod] || 'credit-card',
    );

    // Kredi kartı form data
    const [formData, setFormData] = useState({
        full_name: 'Test Kullanıcı',
        email: 'test@example.com',
        phone: '05551234567',
        card_number: '',
        card_name: '',
        card_expiry: '',
        card_cvv: '',
        use_3d: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
    const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
    const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);

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
                    '/demo/payment/installment-options',
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
                    const detail = result.installmentDetails[0];
                    setInstallmentOptions(detail.installmentPrices || []);
                } else {
                    setInstallmentOptions([]);
                    setSelectedInstallment(1);
                    setFormData((prev) => ({ ...prev, installment: 1 }));
                }
            } catch (error) {
                setInstallmentOptions([]);
                setSelectedInstallment(1);
                setFormData((prev) => ({ ...prev, installment: 1 }));
            } finally {
                setIsLoadingInstallments(false);
            }
        } else {
            setInstallmentOptions([]);
            setSelectedInstallment(1);
            setFormData((prev) => ({ ...prev, installment: 1 }));
        }
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

    const handleInstallmentChange = (
        installmentNumber: number,
        installmentPrice: number,
        totalPrice: number,
    ) => {
        setSelectedInstallment(installmentNumber);
        setFormData((prev) => ({ ...prev, installment: installmentNumber }));
    };

    const handleCreditCardSubmit = async () => {
        // Validation
        if (
            !formData.card_number ||
            !formData.card_name ||
            !formData.card_expiry ||
            !formData.card_cvv
        ) {
            alert('Lütfen tüm kart bilgilerini doldurun');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/demo/payment/credit-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    payment_method: 'credit_card',
                    installment: selectedInstallment,
                }),
            });

            const result = await response.json();

                    if (result.status === 'success') {
                        if (result.requires3ds && result.redirectUrl) {
                            window.location.href = result.redirectUrl;
                        } else {
                            const orderId = result.paymentId || 'ORD-' + Date.now();
                            router.visit(
                                `/demo/orders/success?orderId=${orderId}&paymentId=${result.paymentId}`,
                            );
                        }
                    } else {
                        router.visit(
                            `/demo/orders/failed?errorMessage=${encodeURIComponent(result.message || 'Ödeme işlemi başarısız')}`,
                        );
                        setIsSubmitting(false);
                    }
                } catch (error) {
                    router.visit(
                        `/demo/orders/failed?errorMessage=${encodeURIComponent('Ödeme işlemi sırasında bir hata oluştu')}`,
                    );
                    setIsSubmitting(false);
                }
    };

    const validateCreditCard = (): boolean => {
        return !!(
            formData.card_number &&
            formData.card_name &&
            formData.card_expiry &&
            formData.card_cvv
        );
    };

    const validateContactInfo = (): boolean => {
        return !!(
            formData.full_name &&
            formData.email &&
            formData.phone
        );
    };

    return (
        <>
            <Head title="Hızlı Deneme" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="mb-4 inline-flex items-center text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Geri Dön
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Hızlı Deneme
                        </h1>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            Ödeme entegrasyonunu test edin
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Sol Taraf - Ödeme Formu */}
                        <div className="lg:col-span-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                                <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                                    Ödeme Yöntemi
                                </h2>

                                <Tabs
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                    className="w-full"
                                >
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="credit-card">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Kredi Kartı
                                        </TabsTrigger>
                                        <TabsTrigger value="checkout-form">
                                            <AppWindow className="mr-2 h-4 w-4" />
                                            Checkout Form
                                        </TabsTrigger>
                                        <TabsTrigger value="pay-with-iyzico">
                                            <Wallet2 className="mr-2 h-4 w-4" />
                                            Pay with iyzico
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Kredi Kartı Tab */}
                                    <TabsContent value="credit-card" className="mt-6">
                                        <div className="space-y-4">
                                            <PaymentForm
                                                formData={formData}
                                                onInputChange={handleInputChange}
                                                onCardNumberChange={handleCardNumberChange}
                                                onCardExpiryChange={handleCardExpiryChange}
                                                onCardCvvChange={handleCardCvvChange}
                                            />
                                            <div className="space-y-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        name="use_3d"
                                                        checked={formData.use_3d}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        3D Secure ile Ödeme
                                                    </span>
                                                </label>

                                                {/* Taksit Seçenekleri */}
                                                {isLoadingInstallments && (
                                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                                        Taksit seçenekleri yükleniyor...
                                                    </div>
                                                )}
                                                {!isLoadingInstallments &&
                                                    installmentOptions.length > 0 && (
                                                        <div>
                                                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                Taksit Seçenekleri
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                                {installmentOptions.map(
                                                                    (option) => (
                                                                        <label
                                                                            key={
                                                                                option.installmentNumber
                                                                            }
                                                                            className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-all ${
                                                                                selectedInstallment ===
                                                                                option.installmentNumber
                                                                                    ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                                                                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600'
                                                                            }`}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name="installment"
                                                                                value={
                                                                                    option.installmentNumber
                                                                                }
                                                                                checked={
                                                                                    selectedInstallment ===
                                                                                    option.installmentNumber
                                                                                }
                                                                                onChange={() =>
                                                                                    handleInstallmentChange(
                                                                                        option.installmentNumber,
                                                                                        option.installmentPrice,
                                                                                        option.totalPrice,
                                                                                    )
                                                                                }
                                                                                className="sr-only"
                                                                            />
                                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                                {
                                                                                    option.installmentNumber
                                                                                }
                                                                                x
                                                                            </div>
                                                                            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                                                                ₺
                                                                                {parseFloat(
                                                                                    option.installmentPrice,
                                                                                ).toFixed(2)}
                                                                            </div>
                                                                        </label>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="mt-6">
                                                <Button
                                                    type="button"
                                                    onClick={handleCreditCardSubmit}
                                                    disabled={
                                                        isSubmitting ||
                                                        !validateCreditCard()
                                                    }
                                                    className="w-full"
                                                >
                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                    {isSubmitting
                                                        ? 'İşleniyor...'
                                                        : 'Ödeme Yap'}
                                                </Button>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* Checkout Form Tab */}
                                    <TabsContent value="checkout-form" className="mt-6">
                                        <CheckoutForm
                                            formData={formData}
                                            initializeEndpoint="/demo/payment/checkout-form/initialize"
                                        />
                                    </TabsContent>

                                    {/* Pay with iyzico Tab */}
                                    <TabsContent
                                        value="pay-with-iyzico"
                                        className="mt-6"
                                    >
                                        <PayWithIyzico
                                            formData={formData}
                                            isValid={validateContactInfo()}
                                            initializeEndpoint="/demo/payment/iyzico/initialize"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>

                        {/* Sağ Taraf - Ürün Özeti */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                                <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                                    Sipariş Özeti
                                </h2>

                                <div className="mb-4 flex items-center gap-3">
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {product.name}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {product.quantity} adet
                                        </p>
                                    </div>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        ₺{product.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Ara Toplam
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                            ₺{subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {tax > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                KDV
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                ₺{tax.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {shipping > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Kargo
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                ₺{shipping.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                                Toplam
                                            </span>
                                            <span className="text-lg font-bold text-indigo-600">
                                                ₺{total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
