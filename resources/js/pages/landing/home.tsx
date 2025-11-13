import LandingLayout from '@/layouts/landing-layout';
import AdditionalServicesSection from '@/pages/landing/sections/additional-services-section';
import ClientLibrariesSection from '@/pages/landing/sections/client-libraries-section';
import { FaqSection } from '@/pages/landing/sections/faq-section';
import HeroSection from '@/pages/landing/sections/hero-section';
import PaymentMethodsSection from '@/pages/landing/sections/payment-methods-section';
import ProductsSection from '@/pages/landing/sections/products-section';
import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <LandingLayout title="Kolay Butik">
            <Head title="Anasayfa" />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Hero Section */}
                <HeroSection />

                {/* Payment Methods Section */}
                <PaymentMethodsSection />

                {/* Products Section */}
                <ProductsSection />

                {/* Additional Services Section */}
                <AdditionalServicesSection />

                {/* How It Works Section */}
                {/* <HowItWorksSection /> */}

                {/* Client Libraries Section */}
                <ClientLibrariesSection />

                {/* FAQ Section */}
                <FaqSection />

                {/* Final CTA Section */}
                {/* <CtaSection /> */}
            </div>
        </LandingLayout>
    );
}
