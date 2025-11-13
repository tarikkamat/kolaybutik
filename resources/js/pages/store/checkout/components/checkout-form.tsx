import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface CheckoutFormProps {
    formData: {
        full_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        country?: string;
    };
}

export function CheckoutForm({ formData }: CheckoutFormProps) {
    const [checkoutFormLoading, setCheckoutFormLoading] = useState(false);
    const [checkoutFormContent, setCheckoutFormContent] = useState<string | null>(null);
    const [checkoutFormError, setCheckoutFormError] = useState<string | null>(null);
    const [checkoutFormToken, setCheckoutFormToken] = useState<string | null>(null);

    // Checkout form initialize - iletişim bilgileri doldurulduğunda
    useEffect(() => {
        // Email formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(formData.email?.trim() || '');

        // İletişim bilgileri doldurulmadan ve email formatı geçerli olmadan istek atma
        const isContactInfoFilled =
            formData.full_name?.trim() &&
            formData.email?.trim() &&
            isValidEmail &&
            formData.phone?.trim();

        if (
            !checkoutFormContent &&
            !checkoutFormLoading &&
            !checkoutFormError &&
            isContactInfoFilled
        ) {
            setCheckoutFormLoading(true);
            setCheckoutFormError(null);

            // CSRF token'ı al
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            fetch('/store/payment/checkout-form/initialize', {
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
            })
                .then(async (response) => {
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.errorMessage || data.message || 'Bir hata oluştu');
                    }

                    if (data.success && data.data?.checkoutFormContent) {
                        // Eski script'leri temizle
                        const scriptsInBody = document.querySelectorAll('script[src*="iyzipay"], script[src*="checkoutform"]');
                        scriptsInBody.forEach((s) => s.remove());

                        // Global değişkenleri temizle
                        if (typeof window !== 'undefined') {
                            (window as any).iyziInit = undefined;
                            (window as any).iyziUcsInit = undefined;
                        }

                        setCheckoutFormContent(data.data.checkoutFormContent);
                        setCheckoutFormToken(data.data.token || null);
                    } else {
                        setCheckoutFormError(data.errorMessage || data.message || 'Ödeme formu yüklenemedi');
                    }
                })
                .catch((error) => {
                    setCheckoutFormError(error.message || 'Bir hata oluştu');
                })
                .finally(() => {
                    setCheckoutFormLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutFormContent, checkoutFormLoading, checkoutFormError, formData.full_name, formData.email, formData.phone]);

    // Checkout form content yüklendiğinde script'i dinamik olarak ekle
    useEffect(() => {
        if (checkoutFormContent) {
            // DOM'un güncellenmesini bekle (div'in render edilmesi için)
            const frameId = requestAnimationFrame(() => {
                // Bir sonraki frame'de div'in DOM'da olduğundan emin ol
                requestAnimationFrame(() => {
                    const checkoutFormDiv = document.getElementById('iyzipay-checkout-form');

                    if (checkoutFormDiv) {
                        // Önce div'i temizle
                        checkoutFormDiv.innerHTML = '';

                        // Script içeriğini parse et
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(checkoutFormContent, 'text/html');
                        const scripts = doc.querySelectorAll('script');

                        // Tüm script'leri dinamik olarak ekle
                        scripts.forEach((script, index) => {
                            // Her seferinde yeni script oluştur (token değiştiği için)
                            const newScript = document.createElement('script');

                            if (script.src) {
                                // URL'ye timestamp ekle ki cache'lenmesin
                                const url = new URL(script.src);
                                url.searchParams.set('_t', Date.now().toString());
                                newScript.src = url.toString();
                            } else {
                                newScript.textContent = script.textContent;
                            }

                            // Script'in yüklenmesini bekle
                            newScript.onload = () => {
                                console.log(`Iyzipay script ${index} yüklendi`);
                            };

                            newScript.onerror = () => {
                                console.error(`Iyzipay script ${index} yüklenirken hata oluştu`);
                            };

                            document.head.appendChild(newScript);
                        });
                    }
                });
            });

            // Cleanup function
            return () => {
                cancelAnimationFrame(frameId);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkoutFormContent, checkoutFormToken]);

    // Cleanup function - component unmount olduğunda
    useEffect(() => {
        return () => {
            // iyzipay script'lerini temizle
            const scriptsInBody = document.querySelectorAll('script[src*="iyzipay"], script[src*="checkoutform"]');
            scriptsInBody.forEach((s) => s.remove());

            // iyzipay-checkout-form div'ini temizle
            const checkoutFormDiv = document.getElementById('iyzipay-checkout-form');
            if (checkoutFormDiv) {
                checkoutFormDiv.innerHTML = '';
            }

            // Global iyzipay değişkenlerini temizle
            if (typeof window !== 'undefined') {
                (window as any).iyziInit = undefined;
                (window as any).iyziUcsInit = undefined;
            }
        };
    }, []);

    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            {checkoutFormLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Spinner className="h-8 w-8 text-indigo-600" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Ödeme formu yükleniyor...
                    </p>
                </div>
            )}

            {checkoutFormError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{checkoutFormError}</p>
                </div>
            )}

            {checkoutFormContent && !checkoutFormLoading && (
                <div className="w-full">
                    <div id="iyzipay-checkout-form" className="responsive"></div>
                </div>
            )}

            {!checkoutFormContent && !checkoutFormLoading && !checkoutFormError && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pt-2">
                    <Lock className="h-4 w-4" />
                    <span>İletişim bilgilerinizi doldurun, ödeme formu otomatik olarak yüklenecektir</span>
                </div>
            )}
        </div>
    );
}

