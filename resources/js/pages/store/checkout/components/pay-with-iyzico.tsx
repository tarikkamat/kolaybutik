import { Button } from '@/components/ui/button';
import { Wallet2 } from 'lucide-react';
import { useState } from 'react';
import {
    Hand,
    Shield,
    Wallet,
    Headphones,
    CreditCard,
} from 'lucide-react';

interface PayWithIyzicoProps {
    formData: {
        full_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        country?: string;
    };
    onSubmit?: () => void;
    isSubmitting?: boolean;
    isValid?: boolean;
    initializeEndpoint?: string;
}

export function PayWithIyzico({
    formData,
    onSubmit,
    isSubmitting = false,
    isValid = false,
    initializeEndpoint = '/store/payment/iyzico/initialize',
}: PayWithIyzicoProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!isValid) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // CSRF token'ı al
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch(initializeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postal_code: formData.postal_code,
                    country: formData.country || 'Türkiye',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errorMessage || data.message || 'Bir hata oluştu');
            }

            if (data.success && data.data?.payWithIyzicoPageUrl) {
                // Pay with iyzico URL'sine yönlendir
                window.location.href = data.data.payWithIyzicoPageUrl;
            } else {
                setError(data.errorMessage || data.message || 'Ödeme başlatılamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            {/* Pay with iyzico Açıklama */}
            <div className="mb-6">
                <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        iyzico Güvencesiyle Kolayca Öde!
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        iyzico ile Öde-Şimdi Kolay! Alışverişini ister iyzico bakiyenle, ister saklı kartınla, ister havale/EFT yöntemi ile kolayca öde; aklına takılan herhangi bir konuda 7/24 canlı destek al.
                    </p>
                </div>

                {/* Özellikler */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <div className="flex flex-col items-center rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <div className="mb-2 text-indigo-600 dark:text-indigo-400">
                            <Hand className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            Kart / Bakiyenle Hızlı Ödeme
                        </p>
                    </div>

                    <div className="flex flex-col items-center rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <div className="mb-2 text-indigo-600 dark:text-indigo-400">
                            <Shield className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            Korumalı Alışveriş
                        </p>
                    </div>

                    <div className="flex flex-col items-center rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <div className="mb-2 text-indigo-600 dark:text-indigo-400">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            Bakiye ile Ödemende Anında İade
                        </p>
                    </div>

                    <div className="flex flex-col items-center rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <div className="mb-2 text-indigo-600 dark:text-indigo-400">
                            <Headphones className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            7/24 Canlı Destek
                        </p>
                    </div>

                    <div className="flex flex-col items-center rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <div className="mb-2 text-indigo-600 dark:text-indigo-400">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            Alışveriş Kredisi
                        </p>
                    </div>
                </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Ödeme Butonu */}
            <Button
                type="button"
                onClick={handlePayment}
                disabled={isSubmitting || isLoading || !isValid}
                className="w-full"
            >
                <Wallet2 className="mr-2 h-4 w-4" />
                {isSubmitting || isLoading ? 'Yönlendiriliyor...' : 'Pay with iyzico ile Öde'}
            </Button>
        </div>
    );
}
