import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ThreedsModalProps {
    isOpen: boolean;
    htmlContent: string; // base64 encoded
    paymentId: string;
    conversationId: string;
    onCallback: (paymentId: string, conversationId: string) => void;
    onClose: () => void;
}

export function ThreedsModal({
    isOpen,
    htmlContent,
    paymentId,
    conversationId,
    onCallback,
    onClose,
}: ThreedsModalProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [decodedHtml, setDecodedHtml] = useState<string>('');

    // Base64 decode işlemini yap
    useEffect(() => {
        if (htmlContent) {
            try {
                let decoded: string;
                try {
                    decoded = atob(htmlContent);
                } catch (e) {
                    console.error('Base64 decode hatası:', e);
                    const cleaned = htmlContent.replace(/\s/g, '');
                    decoded = atob(cleaned);
                }

                setDecodedHtml(decoded);
                console.log('Decoded HTML:', decoded.substring(0, 200));
            } catch (error) {
                console.error('HTML decode hatası:', error);
                alert('3DS sayfası yüklenirken bir hata oluştu.');
                onClose();
            }
        }
    }, [htmlContent, onClose]);

    useEffect(() => {
        if (isOpen && decodedHtml && iframeRef.current) {
            const iframe = iframeRef.current;

            // iframe içindeki URL değişikliklerini dinle
            const checkCallback = () => {
                try {
                    const iframeWindow = iframe.contentWindow;
                    if (iframeWindow) {
                        const currentUrl = iframeWindow.location.href;

                        // Callback URL'imizi kontrol et
                        if (
                            currentUrl.includes(
                                '/store/payment/threeds-callback',
                            )
                        ) {
                            // URL'den parametreleri çıkar
                            const url = new URL(currentUrl);
                            const callbackPaymentId =
                                url.searchParams.get('paymentId') || paymentId;
                            const callbackConversationId =
                                url.searchParams.get('conversationId') ||
                                conversationId;

                            // Callback'i çağır
                            onCallback(
                                callbackPaymentId,
                                callbackConversationId,
                            );
                        }
                    }
                } catch (e) {
                    // Cross-origin hatası olabilir, bu normal
                    // Form submit edildiğinde callback URL'i iframe içinde açılacak
                    // ve backend'den redirect gelecek
                }
            };

            // iframe load olduğunda kontrol et ve form'u ayarla
            const handleLoad = () => {
                try {
                    const iframeDoc =
                        iframe.contentDocument ||
                        iframe.contentWindow?.document;
                    if (iframeDoc) {
                        const form = iframeDoc.querySelector(
                            'form',
                        ) as HTMLFormElement;
                        if (form) {
                            // Form'un successUrl ve failureUrl'lerini değiştir
                            // Böylece iyzico mock sayfasından direkt callback URL'imize yönlendirilecek
                            const successUrlInput = iframeDoc.querySelector(
                                'input[name="successUrl"]',
                            ) as HTMLInputElement;
                            const failureUrlInput = iframeDoc.querySelector(
                                'input[name="failureUrl"]',
                            ) as HTMLInputElement;

                            if (successUrlInput) {
                                const callbackUrl = `${window.location.origin}/store/payment/threeds-callback?paymentId=${paymentId}&conversationId=${conversationId}`;
                                successUrlInput.value = callbackUrl;
                            }

                            if (failureUrlInput) {
                                const callbackUrl = `${window.location.origin}/store/payment/threeds-callback?paymentId=${paymentId}&conversationId=${conversationId}`;
                                failureUrlInput.value = callbackUrl;
                            }

                            // Form iframe içinde kalacak, target değiştirmiyoruz
                            // Form submit edildiğinde iframe içinde kalacak ve callback URL'ine yönlendirilecek
                        }

                        // Callback sayfasından gelen mesajı dinle
                        const callbackScript =
                            iframeDoc.querySelector('script');
                        if (
                            callbackScript &&
                            callbackScript.textContent?.includes(
                                'threedsCallback',
                            )
                        ) {
                            // Callback sayfası yüklendi, mesaj bekliyoruz
                        }
                    }
                } catch (e) {
                    // Cross-origin hatası olabilir
                }
                checkCallback();
            };

            // Parent window'dan gelen mesajları dinle (callback sayfasından)
            const handleMessage = (event: MessageEvent) => {
                // Güvenlik: sadece kendi origin'inden gelen mesajları kabul et
                if (event.origin !== window.location.origin) {
                    return;
                }

                if (event.data && event.data.type === 'threeds-callback') {
                    if (event.data.status === 'success') {
                        const {
                            paymentId: callbackPaymentId,
                            conversationId: callbackConversationId,
                            successUrl,
                        } = event.data;
                        if (callbackPaymentId && callbackConversationId) {
                            // Modal'ı kapat ve success sayfasına yönlendir
                            onClose();
                            if (successUrl) {
                                window.location.href = successUrl;
                            } else {
                                onCallback(
                                    callbackPaymentId,
                                    callbackConversationId,
                                );
                            }
                        }
                    } else if (event.data.status === 'error') {
                        // Hata durumunda failed sayfasına yönlendir
                        onClose();
                        if (event.data.failedUrl) {
                            window.location.href = event.data.failedUrl;
                        } else {
                            alert(
                                event.data.message || '3DS doğrulama başarısız',
                            );
                        }
                    }
                }
            };

            window.addEventListener('message', handleMessage);

            iframe.addEventListener('load', handleLoad);

            // Periyodik olarak kontrol et (fallback)
            const interval = setInterval(() => {
                try {
                    checkCallback();
                } catch (e) {
                    // Cross-origin hatası
                }
            }, 500);

            return () => {
                iframe.removeEventListener('load', handleLoad);
                window.removeEventListener('message', handleMessage);
                clearInterval(interval);
            };
        }
    }, [isOpen, decodedHtml, paymentId, conversationId, onCallback, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center justify-center gap-2">
                        <Lock className="h-5 w-5 text-indigo-600" />
                        <DialogTitle>3D Secure Doğrulama</DialogTitle>
                    </div>
                    <DialogDescription className="text-center">
                        Lütfen kartınızın 3D Secure doğrulamasını tamamlayın
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full" style={{ minHeight: '500px' }}>
                    {decodedHtml ? (
                        <iframe
                            ref={iframeRef}
                            srcDoc={decodedHtml}
                            className="w-full border-0"
                            style={{ minHeight: '500px', width: '100%' }}
                            title="3D Secure"
                            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
                            // 3DS için same-origin gerekli, güvenlik uyarısı normal
                        />
                    ) : (
                        <div className="flex h-[500px] items-center justify-center">
                            <p className="text-slate-500">Yükleniyor...</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 text-center text-sm text-slate-500">
                    <p>
                        Doğrulama işlemi tamamlandığında otomatik olarak
                        yönlendirileceksiniz.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
