import { useI18n } from '@/i18n';
import LandingLayout from '@/layouts/landing-layout';
import AdditionalServicesSection from '@/pages/landing/sections/additional-services-section';
import ClientLibrariesSection from '@/pages/landing/sections/client-libraries-section';
import { FaqSection } from '@/pages/landing/sections/faq-section';
import HeroSection from '@/pages/landing/sections/hero-section';
import PaymentMethodsSection from '@/pages/landing/sections/payment-methods-section';
import ProductsSection from '@/pages/landing/sections/products-section';
import { Head } from '@inertiajs/react';

export default function Home() {
    const { t } = useI18n();

    return (
        <LandingLayout title={t('landing.home.metaTitle')}>
            <Head title={t('landing.home.pageTitle')} />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <HeroSection />

                <PaymentMethodsSection />

                <ProductsSection />

                <AdditionalServicesSection />

                <ClientLibrariesSection />

                <FaqSection />

                {/* <CtaSection /> */}
            </div>
        </LandingLayout>
    );
}
