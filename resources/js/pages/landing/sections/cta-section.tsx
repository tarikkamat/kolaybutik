import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function CtaSection() {
    const { t } = useI18n();

    return (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-20">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                    {t('landing.cta.title')}
                </h2>
                <p className="mb-8 text-lg text-indigo-100">
                    {t('landing.cta.subtitle')}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <a
                        href="https://docs.iyzico.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg">
                            {t('common.viewDocs')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                </div>
                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                    <div className="flex flex-col items-center">
                        <div className="mb-2 rounded-full bg-white/20 p-3">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-sm font-medium text-white">
                            {t('landing.cta.secure')}
                        </div>
                        <div className="text-xs text-indigo-100">
                            {t('landing.cta.secureHint')}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-2 rounded-full bg-white/20 p-3">
                            <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-sm font-medium text-white">
                            {t('landing.cta.fast')}
                        </div>
                        <div className="text-xs text-indigo-100">
                            {t('landing.cta.fastHint')}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-2 rounded-full bg-white/20 p-3">
                            <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-sm font-medium text-white">
                            {t('landing.cta.easy')}
                        </div>
                        <div className="text-xs text-indigo-100">
                            {t('landing.cta.easyHint')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
