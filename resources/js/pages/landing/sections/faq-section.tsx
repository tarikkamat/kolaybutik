import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export function FaqSection() {
    return (
        <section className="px-4 py-20">
            <div className="mx-auto max-w-3xl">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                        Sık Sorulan Sorular
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        iyzico entegrasyonu hakkında merak ettikleriniz
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            iyzico entegrasyonu ne kadar sürer?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Entegrasyon süresi seçtiğiniz yönteme göre değişir.
                            Pay with iyzico en hızlı yöntemdir (1-2 saat), API
                            to API entegrasyonu ise daha detaylıdır (1-3 gün).
                            Checkout Form iFrame entegrasyonu orta seviye bir
                            süre gerektirir (yarım gün).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            Hangi ödeme yöntemini seçmeliyim?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            API to API: Tam kontrol istiyorsanız ve kendi ödeme
                            formunuzu oluşturmak istiyorsanız. Checkout Form:
                            Hızlı entegrasyon ve PCI DSS yükümlülüğünden muaf
                            kalmak istiyorsanız. Pay with iyzico: En hızlı çözüm
                            ve minimum kod ile entegrasyon istiyorsanız.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            3DS ve Non-3DS nedir?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            3DS (3D Secure), ödeme güvenliği için ek doğrulama
                            adımıdır. Non-3DS ise bu adım olmadan yapılan
                            ödemelerdir. iyzico her iki yöntemi de destekler.
                            Güvenlik için 3DS önerilir.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            Test ortamı var mı?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Evet, iyzico test ortamı (sandbox) sağlar. Test
                            kartları ile entegrasyonunuzu test edebilirsiniz.
                            Canlıya almadan önce mutlaka test ortamında
                            denemeler yapın.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            Webhook nedir ve nasıl kullanılır?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Webhook, ödeme durumu değişikliklerinde sisteminize
                            otomatik bildirim gönderen bir servistir. Ödeme
                            onaylandığında, iptal edildiğinde veya iade
                            yapıldığında anında bilgilendirilirsiniz. Bu sayede
                            manuel kontrol yapmanıza gerek kalmaz.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            Komisyon oranları nedir?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Komisyon oranları iş modelinize, işlem hacminize ve
                            seçtiğiniz ürünlere göre değişir. Detaylı bilgi için
                            iyzico satış ekibi ile iletişime geçebilirsiniz.
                            Pazaryeri modelinde komisyon yönetimi
                            yapabilirsiniz.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            Kart saklama güvenli mi?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Evet, iyzico PCI DSS Level 1 sertifikalıdır. Kart
                            bilgileri şifrelenmiş olarak saklanır ve hiçbir
                            zaman tam kart numarası saklanmaz. Müşterileriniz
                            tek tıkla hızlı ödeme yapabilir.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                        <AccordionTrigger className="text-left text-slate-900 dark:text-white">
                            Dokümantasyon nerede?
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-slate-400">
                            Tüm entegrasyon dokümantasyonu{' '}
                            <a
                                href="https://docs.iyzico.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                                docs.iyzico.com
                            </a>{' '}
                            adresinde bulunmaktadır. API referansları, örnek
                            kodlar ve entegrasyon rehberleri mevcuttur.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
