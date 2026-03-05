export type Language = 'tr' | 'en';

export type TranslationDictionary = Record<string, string>;

export const translations: Record<Language, TranslationDictionary> = {
    tr: {
        'common.language': 'Dil',
        'common.turkish': 'Türkçe',
        'common.english': 'İngilizce',
        'common.liveDemo': 'Canlı Demo',
        'common.testStore': 'Test Mağaza',
        'common.testIyziLink': 'Test iyziLink',
        'common.tryNow': 'Hemen Dene',
        'common.viewDocs': 'Dokümantasyonu İncele',
        'common.signIn': 'Giriş Yap',
        'common.createAccount': 'Hesap Oluştur',

        'landing.home.metaTitle': 'Kolay Butik',
        'landing.home.pageTitle': 'Anasayfa',

        'landing.nav.paymentMethods': 'Ödeme Yöntemleri',
        'landing.nav.solutions': 'Çözümler',
        'landing.nav.helpfulServices': 'Faydalı Servisler',

        'landing.footer.description':
            'iyzico entegrasyon çözümleri ile ödeme altyapınızı güçlendirin. API to API, Checkout Form ve Pay with iyzico seçenekleri.',
        'landing.footer.documentation': 'Dokümantasyon',
        'landing.footer.apiDocs': 'API Dokümantasyonu',
        'landing.footer.integrationGuide': 'Entegrasyon Rehberi',
        'landing.footer.support': 'Destek',
        'landing.footer.resources': 'Kaynaklar',
        'landing.footer.homepage': 'iyzico Ana Sayfa',
        'landing.footer.developerPortal': 'Geliştirici Portalı',
        'landing.footer.githubLibraries': 'GitHub Kütüphaneleri',
        'landing.footer.solutions': 'Çözümler',
        'landing.footer.products': 'Kullanabileceğiniz Ürünler',
        'landing.footer.workSolutions': 'İşinizi Kolaylaştıracak Çözümler',
        'landing.footer.copyright':
            '© 2025 Kolay Butik. Tüm hakları saklıdır.',

        'landing.hero.badge': 'iyzico Entegrasyon Çözümleri',
        'landing.hero.title': 'iyzico ile Ödeme Almanın En Kolay Yolu',
        'landing.hero.description':
            'iyzico Sanal POS, iyzico checkout form veya iyzico ile Öde arasından işletmenize en uygun entegrasyon yöntemini seçin. Kredi kartı, banka kartı ve dijital cüzdan ile ödemelerinizi kolay ve güvenli alın.',
        'landing.hero.fastIntegration': 'Hızlı Entegrasyon',
        'landing.hero.easySetup': 'Kolay Kurulum',
        'landing.hero.support247': '7/24 Destek',
        'landing.hero.cards.pos.title': 'iyzico Sanal POS',
        'landing.hero.cards.pos.description':
            'Sanal POS’a doğrudan API üzerinden entegre olun. Kartlı ödemelerde Non-3DS ve 3DS işlemler için tam kontrol sağlayın.',
        'landing.hero.cards.checkout.title': 'iyzico Checkout Form',
        'landing.hero.cards.checkout.description':
            'Kart ve iyzico ile Öde seçeneklerini tek ekranda sunun. PCI DSS yükümlülüklerinden muaf olun, tek bir servis entegrasyonu ile hızlı bir şekilde ödeme almaya başlayın.',
        'landing.hero.cards.pwi.title': 'iyzico ile Öde',
        'landing.hero.cards.pwi.description':
            'Hazır ödeme formumuzu sitenize kolayca ekleyin. Minimum geliştirme ile daha hızlı ödeme sağlayın. Kullanıcının bakiyesi ile, kayıtlı kartı ile, havale eft çözümünü tek ekranda sunun.',

        'landing.paymentMethods.title': 'Ödeme Yöntemleri',
        'landing.paymentMethods.subtitle':
            "iyzico'nun esnek entegrasyon seçenekleri ile ihtiyacınıza en uygun ödeme çözümünü seçin",
        'landing.paymentMethods.pos.description':
            'Sanal POS ile kredi kartı, banka kartı ödemelerini kendi ekranlarınızdan yönetin. Non-3DS ve 3DS işlemlerde tam kontrol sizde olsun.',
        'landing.paymentMethods.pos.feature.api': 'Doğrudan API yönetimi',
        'landing.paymentMethods.pos.feature.non3ds': 'Non-3DS & 3DS desteği',
        'landing.paymentMethods.pos.feature.cardStorage': 'Kart saklama',
        'landing.paymentMethods.checkout.description':
            'Kart ile ödeme ve iyzico ile Öde seçeneklerini tek ekran üzerinden sunun, PCI DSS yükümlülüklerinden muaf olun. Kullanıcı ister kart bilgilerini form üzerinden girsin, ister iyzico ile Öde akışına yönlendirilsin.',
        'landing.paymentMethods.checkout.feature.fastSetup': 'Hızlı kurulum',
        'landing.paymentMethods.checkout.feature.multiOption':
            'Tek ekranda birden fazla ödeme seçeneği',
        'landing.paymentMethods.checkout.feature.pci': 'PCI DSS uyumlu',
        'landing.paymentMethods.pwi.description':
            'Hazır ödeme formumuzu sitenize kolayca entegre edin. Kullanıcı kart bilgilerini girebilir veya kayıtlı kartları ve mevcut bakiyeleri ile hızlı ödeme yapabilir.',
        'landing.paymentMethods.pwi.feature.quickIntegration':
            'Minimum geliştirme ile hızlı entegrasyon',
        'landing.paymentMethods.pwi.feature.readyFlow':
            'Hazır iyzico ile Öde akışı',
        'landing.paymentMethods.pwi.feature.alternativeMethods':
            'Alternatif ödeme yöntemleri',

        'landing.products.title': 'Kullanabileceğiniz Ürünler',
        'landing.products.subtitle':
            'İş modelinize en uygun ürünleri keşfedin.',
        'landing.products.onlinePayment.title': 'Online Ödeme',
        'landing.products.onlinePayment.description':
            'Kredi kartı, banka kartı ve dijital cüzdan ile internet satışlarınızda güvenli ödeme alın.',
        'landing.products.marketplace.title': 'Pazaryeri',
        'landing.products.marketplace.description':
            'Çoklu satıcı yapısı ile pazaryeri modelinizi oluşturun; komisyon ve ödemelerinizi otomatik yönetin.',
        'landing.products.subscription.title': 'Abonelik Yöntemi',
        'landing.products.subscription.description':
            'Tekrarlayan ödemeler için abonelik yöntemiyle ödeme alın. Otomatik yenileme, plan değişikliği ve iptal işlemlerini tek panelden yönetin.',
        'landing.products.protectedTransfer.title': 'Korumalı Havale/EFT',
        'landing.products.protectedTransfer.description':
            'Havale/EFT ile ödeme alın, ödeme onaylandıktan sonra ürün/hizmet teslim edilsin.',
        'landing.products.link.title': 'iyzico Link Yöntemi',
        'landing.products.link.description':
            'Ürün veya tutar linki oluşturarak müşterilerinizle paylaşın, dilediğiniz anda güvenle ödeme alın.',
        'landing.products.shoppingLoan.title': 'Alışveriş Kredisi',
        'landing.products.shoppingLoan.description':
            'Müşterilerinize banka kredisi ile taksitli alışveriş imkanı sunun, satışlarınızı artırın.',

        'landing.services.title': 'İşinizi Kolaylaştıracak Çözümler',
        'landing.services.subtitle':
            'Ödeme deneyiminizi iyileştiren teknik servisleri inceleyin.',
        'landing.services.testServices': 'Servisleri test et',
        'landing.services.cardStorage.title': 'Kart Saklama',
        'landing.services.cardStorage.description':
            'Müşterilerinizin kart bilgilerini güvenli bir şekilde saklayın. Tek tıkla hızlı ödeme.',
        'landing.services.reporting.title': 'Raporlama',
        'landing.services.reporting.description':
            'Detaylı ödeme raporları ve finansal analizler. İşinizi veri ile yönetin.',
        'landing.services.webhook.title': 'Webhook',
        'landing.services.webhook.description':
            'Gerçek zamanlı bildirimler. Ödeme durumlarını anında takip edin.',
        'landing.services.refund.title': 'İptal İade',
        'landing.services.refund.description':
            'Kolay iptal ve iade işlemleri. Müşteri memnuniyeti için esnek çözümler.',
        'landing.services.installment.title': 'Taksit Servisi',
        'landing.services.installment.description':
            'Taksitli ödeme seçenekleri. Müşterilerinize esnek ödeme imkanı sunun.',
        'landing.services.bin.title': 'Bin Servisi',
        'landing.services.bin.description':
            'Kart numarasına göre banka ve kart tipi bilgilerini alın.',
        'landing.services.signature.title': 'Signature',
        'landing.services.signature.description':
            'API çağrılarınızın güvenliğini sağlamak için imza mekanizması.',

        'landing.clientLibraries.title': 'Client Kütüphaneleri',
        'landing.clientLibraries.subtitle':
            "Açık kaynak SDK'lar ile hızlı entegrasyon",
        'landing.clientLibraries.viewAll':
            "Tüm kütüphaneleri GitHub'da görüntüle",
        'landing.clientLibraries.library.php': 'iyzipay API PHP istemcisi',
        'landing.clientLibraries.library.dotnet': 'iyzipay API .NET istemcisi',
        'landing.clientLibraries.library.java': 'iyzipay API Java istemcisi',
        'landing.clientLibraries.library.node': 'iyzipay API Node.js istemcisi',
        'landing.clientLibraries.library.python':
            'iyzipay API Python istemcisi',
        'landing.clientLibraries.library.go': 'iyzipay API Go istemcisi',

        'landing.howItWorks.title': 'Entegrasyon Adımları',
        'landing.howItWorks.subtitle':
            'iyzico entegrasyonu sadece birkaç adımda tamamlanır',
        'landing.howItWorks.step1.title': 'iyzico Hesabı Oluştur',
        'landing.howItWorks.step1.description':
            'iyzico panelinden hesabınızı oluşturun ve API anahtarlarınızı alın.',
        'landing.howItWorks.step2.title': 'Entegrasyon Yöntemini Seç',
        'landing.howItWorks.step2.description':
            'API to API, Checkout Form veya Pay with iyzico yöntemlerinden birini seçin.',
        'landing.howItWorks.step3.title': 'Entegrasyonu Yap',
        'landing.howItWorks.step3.description':
            'Dokümantasyonu takip ederek entegrasyonu tamamlayın. Test ortamında deneyin.',
        'landing.howItWorks.step4.title': 'Canlıya Al',
        'landing.howItWorks.step4.description':
            'Testler başarılı olduktan sonra canlı ortama geçin ve ödeme almaya başlayın.',

        'landing.faq.title': 'Sık Sorulan Sorular',
        'landing.faq.subtitle':
            'iyzico entegrasyonu hakkında merak ettikleriniz',
        'landing.faq.q1': 'iyzico entegrasyonu ne kadar sürer?',
        'landing.faq.a1':
            'Entegrasyon süresi seçtiğiniz yönteme göre değişir. Pay with iyzico en hızlı yöntemdir (1-2 saat), API to API entegrasyonu ise daha detaylıdır (1-3 gün). Checkout Form iFrame entegrasyonu orta seviye bir süre gerektirir (yarım gün).',
        'landing.faq.q2': 'Hangi ödeme yöntemini seçmeliyim?',
        'landing.faq.a2':
            'API to API: Tam kontrol istiyorsanız ve kendi ödeme formunuzu oluşturmak istiyorsanız. Checkout Form: Hızlı entegrasyon ve PCI DSS yükümlülüğünden muaf kalmak istiyorsanız. Pay with iyzico: En hızlı çözüm ve minimum kod ile entegrasyon istiyorsanız.',
        'landing.faq.q3': '3DS ve Non-3DS nedir?',
        'landing.faq.a3':
            '3DS (3D Secure), ödeme güvenliği için ek doğrulama adımıdır. Non-3DS ise bu adım olmadan yapılan ödemelerdir. iyzico her iki yöntemi de destekler. Güvenlik için 3DS önerilir.',
        'landing.faq.q4': 'Test ortamı var mı?',
        'landing.faq.a4':
            'Evet, iyzico test ortamı (sandbox) sağlar. Test kartları ile entegrasyonunuzu test edebilirsiniz. Canlıya almadan önce mutlaka test ortamında denemeler yapın.',
        'landing.faq.q5': 'Webhook nedir ve nasıl kullanılır?',
        'landing.faq.a5':
            'Webhook, ödeme durumu değişikliklerinde sisteminize otomatik bildirim gönderen bir servistir. Ödeme onaylandığında, iptal edildiğinde veya iade yapıldığında anında bilgilendirilirsiniz. Bu sayede manuel kontrol yapmanıza gerek kalmaz.',
        'landing.faq.q6': 'Komisyon oranları nedir?',
        'landing.faq.a6':
            'Komisyon oranları iş modelinize, işlem hacminize ve seçtiğiniz ürünlere göre değişir. Detaylı bilgi için iyzico satış ekibi ile iletişime geçebilirsiniz. Pazaryeri modelinde komisyon yönetimi yapabilirsiniz.',
        'landing.faq.q7': 'Kart saklama güvenli mi?',
        'landing.faq.a7':
            'Evet, iyzico PCI DSS Level 1 sertifikalıdır. Kart bilgileri şifrelenmiş olarak saklanır ve hiçbir zaman tam kart numarası saklanmaz. Müşterileriniz tek tıkla hızlı ödeme yapabilir.',
        'landing.faq.q8': 'Dokümantasyon nerede?',
        'landing.faq.a8a': 'Tüm entegrasyon dokümantasyonu',
        'landing.faq.a8b':
            'adresinde bulunmaktadır. API referansları, örnek kodlar ve entegrasyon rehberleri mevcuttur.',

        'landing.cta.title': 'iyzico Entegrasyonuna Başlamaya Hazır Mısınız?',
        'landing.cta.subtitle':
            'iyzico ile ödeme entegrasyonunu bugün başlatın. Dokümantasyonu inceleyin ve test ortamında deneyin.',
        'landing.cta.secure': 'Güvenli',
        'landing.cta.secureHint': 'SSL şifreli',
        'landing.cta.fast': 'Hızlı',
        'landing.cta.fastHint': 'Anlık işlem',
        'landing.cta.easy': 'Kolay',
        'landing.cta.easyHint': 'Basit arayüz',

        'store.warning.label': 'Uyarı:',
        'store.warning.text':
            'Bu mağaza iyzico entegrasyonu için hazırlanmış bir demo/test mağazasıdır. Gerçek bir e-ticaret sitesi değildir.',
        'store.footer.description':
            'Kolay Butik ile en iyi ürünleri keşfedin. Geniş ürün yelpazesi ve uygun fiyatlar ile alışveriş deneyiminizi zenginleştirin.',
        'store.footer.store': 'Mağaza',
        'store.footer.allProducts': 'Tüm Ürünler',
        'store.footer.categories': 'Kategoriler',
        'store.footer.discountedProducts': 'İndirimli Ürünler',
        'store.footer.info': 'Bilgi',
        'store.footer.about': 'Hakkımızda',
        'store.footer.contact': 'İletişim',
        'store.footer.shipping': 'Kargo ve Teslimat',
        'store.footer.support': 'Destek',
        'store.footer.faq': 'Sık Sorulan Sorular',
        'store.footer.return': 'İade ve Değişim',
        'store.footer.privacy': 'Gizlilik Politikası',
        'store.footer.copyright': '© 2025 Kolay Butik. Tüm hakları saklıdır.',
    },
    en: {
        'common.language': 'Language',
        'common.turkish': 'Turkish',
        'common.english': 'English',
        'common.liveDemo': 'Live Demo',
        'common.testStore': 'Test Store',
        'common.testIyziLink': 'Test iyziLink',
        'common.tryNow': 'Try Now',
        'common.viewDocs': 'View Documentation',
        'common.signIn': 'Sign In',
        'common.createAccount': 'Create Account',

        'landing.home.metaTitle': 'Kolay Boutique',
        'landing.home.pageTitle': 'Home',

        'landing.nav.paymentMethods': 'Payment Methods',
        'landing.nav.solutions': 'Solutions',
        'landing.nav.helpfulServices': 'Useful Services',

        'landing.footer.description':
            'Strengthen your payment infrastructure with iyzico integration solutions. API to API, Checkout Form, and Pay with iyzico options.',
        'landing.footer.documentation': 'Documentation',
        'landing.footer.apiDocs': 'API Documentation',
        'landing.footer.integrationGuide': 'Integration Guide',
        'landing.footer.support': 'Support',
        'landing.footer.resources': 'Resources',
        'landing.footer.homepage': 'iyzico Homepage',
        'landing.footer.developerPortal': 'Developer Portal',
        'landing.footer.githubLibraries': 'GitHub Libraries',
        'landing.footer.solutions': 'Solutions',
        'landing.footer.products': 'Products You Can Use',
        'landing.footer.workSolutions': 'Solutions That Simplify Your Work',
        'landing.footer.copyright':
            '© 2025 Kolay Boutique. All rights reserved.',

        'landing.hero.badge': 'iyzico Integration Solutions',
        'landing.hero.title': 'The Easiest Way to Accept Payments with iyzico',
        'landing.hero.description':
            'Choose the most suitable integration method for your business among iyzico Virtual POS, iyzico checkout form, and Pay with iyzico. Accept payments easily and securely with credit cards, debit cards, and digital wallets.',
        'landing.hero.fastIntegration': 'Fast Integration',
        'landing.hero.easySetup': 'Easy Setup',
        'landing.hero.support247': '24/7 Support',
        'landing.hero.cards.pos.title': 'iyzico Virtual POS',
        'landing.hero.cards.pos.description':
            'Integrate directly with Virtual POS via API. Get full control over Non-3DS and 3DS card payment flows.',
        'landing.hero.cards.checkout.title': 'iyzico Checkout Form',
        'landing.hero.cards.checkout.description':
            'Offer card payments and Pay with iyzico options on a single screen. Stay exempt from PCI DSS obligations and start accepting payments quickly with a single service integration.',
        'landing.hero.cards.pwi.title': 'Pay with iyzico',
        'landing.hero.cards.pwi.description':
            'Add our ready-made payment form to your website easily. Deliver faster payments with minimal development effort. Offer balance payments, saved cards, and bank transfer options on a single screen.',

        'landing.paymentMethods.title': 'Payment Methods',
        'landing.paymentMethods.subtitle':
            'Choose the payment solution that best fits your needs with iyzico’s flexible integration options',
        'landing.paymentMethods.pos.description':
            'Manage credit card and debit card payments from your own screens with Virtual POS. Keep full control in both Non-3DS and 3DS flows.',
        'landing.paymentMethods.pos.feature.api': 'Direct API management',
        'landing.paymentMethods.pos.feature.non3ds': 'Non-3DS & 3DS support',
        'landing.paymentMethods.pos.feature.cardStorage': 'Card storage',
        'landing.paymentMethods.checkout.description':
            'Offer card payments and Pay with iyzico options in one screen while staying exempt from PCI DSS obligations. Users can either enter card details on the form or be redirected to the Pay with iyzico flow.',
        'landing.paymentMethods.checkout.feature.fastSetup': 'Fast setup',
        'landing.paymentMethods.checkout.feature.multiOption':
            'Multiple payment options on one screen',
        'landing.paymentMethods.checkout.feature.pci': 'PCI DSS compliant',
        'landing.paymentMethods.pwi.description':
            'Integrate our ready-made payment form into your site quickly. Users can pay by entering card information or using saved cards and available balances.',
        'landing.paymentMethods.pwi.feature.quickIntegration':
            'Fast integration with minimal development',
        'landing.paymentMethods.pwi.feature.readyFlow':
            'Ready-to-use Pay with iyzico flow',
        'landing.paymentMethods.pwi.feature.alternativeMethods':
            'Alternative payment methods',

        'landing.products.title': 'Products You Can Use',
        'landing.products.subtitle':
            'Discover the products best suited to your business model.',
        'landing.products.onlinePayment.title': 'Online Payments',
        'landing.products.onlinePayment.description':
            'Accept secure online payments with credit cards, debit cards, and digital wallets.',
        'landing.products.marketplace.title': 'Marketplace',
        'landing.products.marketplace.description':
            'Build your marketplace model with a multi-seller structure; manage commissions and payouts automatically.',
        'landing.products.subscription.title': 'Subscription Method',
        'landing.products.subscription.description':
            'Accept recurring payments with subscriptions. Manage auto-renewals, plan changes, and cancellations from a single panel.',
        'landing.products.protectedTransfer.title':
            'Protected Bank Transfer/EFT',
        'landing.products.protectedTransfer.description':
            'Accept payments via transfer/EFT and deliver goods or services after payment approval.',
        'landing.products.link.title': 'iyzico Link Method',
        'landing.products.link.description':
            'Create product or amount links and share them with customers to receive payments securely anytime.',
        'landing.products.shoppingLoan.title': 'Shopping Loan',
        'landing.products.shoppingLoan.description':
            'Offer installment shopping with bank loans to your customers and increase your sales.',

        'landing.services.title': 'Solutions That Simplify Your Work',
        'landing.services.subtitle':
            'Explore technical services that improve your payment experience.',
        'landing.services.testServices': 'Test services',
        'landing.services.cardStorage.title': 'Card Storage',
        'landing.services.cardStorage.description':
            'Store your customers’ card details securely. Enable one-click fast payments.',
        'landing.services.reporting.title': 'Reporting',
        'landing.services.reporting.description':
            'Detailed payment reports and financial analytics. Manage your business with data.',
        'landing.services.webhook.title': 'Webhook',
        'landing.services.webhook.description':
            'Real-time notifications. Track payment statuses instantly.',
        'landing.services.refund.title': 'Cancel & Refund',
        'landing.services.refund.description':
            'Easy cancellation and refund operations. Flexible solutions for customer satisfaction.',
        'landing.services.installment.title': 'Installment Service',
        'landing.services.installment.description':
            'Installment payment options. Offer flexible payment capabilities to your customers.',
        'landing.services.bin.title': 'BIN Service',
        'landing.services.bin.description':
            'Get issuer bank and card type details by card number.',
        'landing.services.signature.title': 'Signature',
        'landing.services.signature.description':
            'Signature mechanism to ensure security for your API calls.',

        'landing.clientLibraries.title': 'Client Libraries',
        'landing.clientLibraries.subtitle':
            'Fast integration with open-source SDKs',
        'landing.clientLibraries.viewAll': 'View all libraries on GitHub',
        'landing.clientLibraries.library.php': 'iyzipay API PHP client',
        'landing.clientLibraries.library.dotnet': 'iyzipay API .NET client',
        'landing.clientLibraries.library.java': 'iyzipay API Java client',
        'landing.clientLibraries.library.node': 'iyzipay API Node.js client',
        'landing.clientLibraries.library.python': 'iyzipay API Python client',
        'landing.clientLibraries.library.go': 'iyzipay API Go client',

        'landing.howItWorks.title': 'Integration Steps',
        'landing.howItWorks.subtitle':
            'iyzico integration is completed in just a few steps',
        'landing.howItWorks.step1.title': 'Create an iyzico Account',
        'landing.howItWorks.step1.description':
            'Create your account in the iyzico panel and get your API keys.',
        'landing.howItWorks.step2.title': 'Choose an Integration Method',
        'landing.howItWorks.step2.description':
            'Pick one of API to API, Checkout Form, or Pay with iyzico.',
        'landing.howItWorks.step3.title': 'Complete the Integration',
        'landing.howItWorks.step3.description':
            'Follow the documentation to complete integration. Test it in the sandbox environment.',
        'landing.howItWorks.step4.title': 'Go Live',
        'landing.howItWorks.step4.description':
            'After successful testing, move to production and start accepting payments.',

        'landing.faq.title': 'Frequently Asked Questions',
        'landing.faq.subtitle':
            'What you need to know about iyzico integration',
        'landing.faq.q1': 'How long does iyzico integration take?',
        'landing.faq.a1':
            'Integration time depends on your chosen method. Pay with iyzico is the fastest option (1-2 hours), while API to API integration is more detailed (1-3 days). Checkout Form iFrame integration requires a medium level effort (half day).',
        'landing.faq.q2': 'Which payment method should I choose?',
        'landing.faq.a2':
            'API to API: if you want full control and your own payment form. Checkout Form: if you want fast integration and exemption from PCI DSS obligations. Pay with iyzico: if you want the fastest solution with minimal code.',
        'landing.faq.q3': 'What are 3DS and Non-3DS?',
        'landing.faq.a3':
            '3DS (3D Secure) is an additional verification step for payment security. Non-3DS payments are made without this step. iyzico supports both methods. 3DS is recommended for better security.',
        'landing.faq.q4': 'Is there a test environment?',
        'landing.faq.a4':
            'Yes, iyzico provides a sandbox environment. You can test your integration with test cards. Always test thoroughly before going live.',
        'landing.faq.q5': 'What is a webhook and how is it used?',
        'landing.faq.a5':
            'A webhook is a service that sends automatic notifications to your system when payment status changes. You are notified instantly when a payment is approved, canceled, or refunded, so manual checks are not required.',
        'landing.faq.q6': 'What are commission rates?',
        'landing.faq.a6':
            'Commission rates vary based on your business model, transaction volume, and selected products. For details, contact the iyzico sales team. You can also manage commissions in marketplace scenarios.',
        'landing.faq.q7': 'Is card storage secure?',
        'landing.faq.a7':
            'Yes, iyzico is PCI DSS Level 1 certified. Card data is stored in encrypted form and full card numbers are never stored. Your customers can pay quickly with one click.',
        'landing.faq.q8': 'Where is the documentation?',
        'landing.faq.a8a': 'All integration documentation is available at',
        'landing.faq.a8b':
            'There you can find API references, sample code, and integration guides.',

        'landing.cta.title': 'Ready to Start Your iyzico Integration?',
        'landing.cta.subtitle':
            'Start your iyzico payment integration today. Review the documentation and test in the sandbox environment.',
        'landing.cta.secure': 'Secure',
        'landing.cta.secureHint': 'SSL encrypted',
        'landing.cta.fast': 'Fast',
        'landing.cta.fastHint': 'Instant processing',
        'landing.cta.easy': 'Easy',
        'landing.cta.easyHint': 'Simple interface',

        'store.warning.label': 'Warning:',
        'store.warning.text':
            'This store is a demo/test store built for iyzico integration. It is not a real e-commerce website.',
        'store.footer.description':
            'Discover top products with Kolay Boutique. Enrich your shopping experience with a wide product range and competitive prices.',
        'store.footer.store': 'Store',
        'store.footer.allProducts': 'All Products',
        'store.footer.categories': 'Categories',
        'store.footer.discountedProducts': 'Discounted Products',
        'store.footer.info': 'Information',
        'store.footer.about': 'About Us',
        'store.footer.contact': 'Contact',
        'store.footer.shipping': 'Shipping & Delivery',
        'store.footer.support': 'Support',
        'store.footer.faq': 'Frequently Asked Questions',
        'store.footer.return': 'Returns & Exchanges',
        'store.footer.privacy': 'Privacy Policy',
        'store.footer.copyright':
            '© 2025 Kolay Boutique. All rights reserved.',
    },
};
