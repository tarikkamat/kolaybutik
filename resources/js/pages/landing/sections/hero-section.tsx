import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/i18n';
import { Link } from '@inertiajs/react';
import {
    AppWindow,
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    CreditCard,
    Wallet,
} from 'lucide-react';

export default function HeroSection() {
    const { t } = useI18n();

    return (
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
                    <div className="h-[600px] w-[600px] rounded-full bg-indigo-100 opacity-20 blur-3xl dark:bg-indigo-900 dark:opacity-10" />
                </div>
            </div>
            <div className="mx-auto max-w-7xl">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div className="text-center lg:text-left">
                        <Badge
                            variant="secondary"
                            className="chip-success mb-4"
                        >
                            {t('landing.hero.badge')}
                        </Badge>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-[color:var(--iyzico-denim)] sm:text-5xl lg:text-6xl">
                            {t('landing.hero.title')}
                        </h1>
                        <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
                            {t('landing.hero.description')}
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="lg" variant="outline">
                                        {t('common.liveDemo')}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/store">
                                            {t('common.testStore')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/services/iyzico-link">
                                            {t('common.testIyziLink')}
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 lg:justify-start dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span>{t('landing.hero.fastIntegration')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span>{t('landing.hero.easySetup')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span>{t('landing.hero.support247')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl" />
                        <div className="relative rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                                    <div className="rounded-lg bg-[color:var(--iyzico-denim)] p-3">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-[color:var(--iyzico-denim)]">
                                            {t('landing.hero.cards.pos.title')}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {t(
                                                'landing.hero.cards.pos.description',
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                                    <div className="rounded-lg bg-[color:var(--iyzico-bittersweet)] p-3">
                                        <AppWindow className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-[color:var(--iyzico-bittersweet)]">
                                            {t(
                                                'landing.hero.cards.checkout.title',
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {t(
                                                'landing.hero.cards.checkout.description',
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50">
                                    <div className="rounded-lg bg-[color:var(--kaamaru)] p-3">
                                        <Wallet className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-[color:var(--kaamaru)]">
                                            {t('landing.hero.cards.pwi.title')}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {t(
                                                'landing.hero.cards.pwi.description',
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
