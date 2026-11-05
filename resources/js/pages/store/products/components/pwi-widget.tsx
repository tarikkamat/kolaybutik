import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import {
    BadgePercent,
    CalendarClock,
    ChevronDown,
    ChevronRight,
    CreditCard,
    Info,
    Landmark,
    Loader2,
    Sparkles,
    UserPlus,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreditHeroIllustration } from './credit-hero-illustration';

interface WidgetInit {
    status: 'success';
    widgetToken: string;
    price: number;
    currency: string;
    creditEnabled: boolean;
    payWithIyzicoEnabled: boolean;
    maxInstallment: number | null;
    installmentPrice: number | null;
}

interface CreditTerm {
    term: number;
    interestRate: number;
    amount: number;
    totalPaymentAmount: number;
    annualEffectiveInterestRate: number | null;
}

interface CreditProduct {
    productType: string;
    terms: CreditTerm[];
    campaigns: unknown[];
}

interface CreditBank {
    bankId: number;
    bankName: string;
    bankLogoUrl: string;
    existingCustomer: boolean;
    lowestAmount: number | null;
    maxTerm: number;
    products: CreditProduct[];
}

type PlanState =
    | { token: string; status: 'loading' }
    | { token: string; status: 'error' }
    | { token: string; status: 'success'; banks: CreditBank[] };

type Step = 'intro' | 'offers';

interface PwiWidgetProps {
    productSlug: string;
}

/** Tabloda önizleme olarak gösterilecek satır sayısı (en kısa, orta ve en uzun vade). */
const PREVIEW_ROW_COUNT = 3;

function previewTerms(terms: CreditTerm[]): CreditTerm[] {
    if (terms.length <= PREVIEW_ROW_COUNT) {
        return terms;
    }

    return [
        terms[0],
        terms[Math.floor((terms.length - 1) / 2)],
        terms[terms.length - 1],
    ];
}

export function PwiWidget({ productSlug }: PwiWidgetProps) {
    const { text, language } = useI18n();
    const initUrl = `/store/products/${encodeURIComponent(productSlug)}/pwi-widget?locale=${language}`;
    const [initResult, setInitResult] = useState<{
        url: string;
        data: WidgetInit | null;
    } | null>(null);
    const [plan, setPlan] = useState<PlanState | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [step, setStep] = useState<Step>('intro');
    const [expandedTables, setExpandedTables] = useState<Set<string>>(
        new Set(),
    );

    // Ürün ya da dil değiştiğinde eski sonuç bu URL'e ait olmadığı için yükleniyor sayılır.
    const loading = initResult?.url !== initUrl;
    const data = loading ? null : initResult.data;
    const currentPlan = data && plan?.token === data.widgetToken ? plan : null;

    useEffect(() => {
        const controller = new AbortController();

        fetch(initUrl, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then((response) => (response.ok ? response.json() : null))
            .then((json: WidgetInit | null) =>
                setInitResult({
                    url: initUrl,
                    data: json?.status === 'success' ? json : null,
                }),
            )
            .catch((error: unknown) => {
                if ((error as Error)?.name === 'AbortError') return;
                setInitResult({ url: initUrl, data: null });
            });

        return () => controller.abort();
    }, [initUrl]);

    const loadPaymentPlan = (widgetToken: string) => {
        setPlan({ token: widgetToken, status: 'loading' });

        const params = new URLSearchParams({ widgetToken, locale: language });
        fetch(`/store/pwi-widget/payment-plan?${params}`, {
            headers: { Accept: 'application/json' },
        })
            .then((response) => (response.ok ? response.json() : null))
            .then((json: { status: string; banks?: CreditBank[] } | null) =>
                setPlan(
                    json?.status === 'success'
                        ? {
                              token: widgetToken,
                              status: 'success',
                              banks: json.banks ?? [],
                          }
                        : { token: widgetToken, status: 'error' },
                ),
            )
            .catch(() => setPlan({ token: widgetToken, status: 'error' }));
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        // Her açılışta tanıtım ekranından başla.
        if (open) {
            setStep('intro');
        }
    };

    const showOffers = () => {
        setStep('offers');
        // Teklifler "Oranları gör" ile istenir; daha önce başarıyla alındıysa tekrar istenmez.
        if (data && currentPlan?.status !== 'success') {
            loadPaymentPlan(data.widgetToken);
        }
    };

    const toggleTable = (key: string) =>
        setExpandedTables((previous) => {
            const next = new Set(previous);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });

    if (loading) {
        return <Skeleton className="mb-6 h-[104px] w-full rounded-lg" />;
    }

    // Alışveriş kredisi kapalıysa ya da tutar uygun değilse (ör. 500 TL altı) gösterme.
    if (
        !data ||
        !data.creditEnabled ||
        data.maxInstallment === null ||
        data.installmentPrice === null
    ) {
        return null;
    }

    const locale = language === 'tr' ? 'tr-TR' : 'en-US';
    const formatMoney = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: data.currency || 'TRY',
            currencyDisplay: 'narrowSymbol',
            minimumFractionDigits: 2,
        }).format(value);
    const formatRate = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value / 100);
    const productTypeTitle = (productType: string) =>
        productType === 'OVERDRAFT'
            ? text(
                  'Kredili Mevduat Hesabı Teklifleri',
                  'Overdraft Account Offers',
              )
            : text('Alışveriş Kredisi Teklifleri', 'Shopping Loan Offers');

    const advantages = [
        {
            icon: CalendarClock,
            label: text('36 aya varan vade imkânı', 'Terms up to 36 months'),
        },
        {
            icon: CreditCard,
            label: text(
                'Kart limitine takılmadan alışveriş',
                'Shop without card limits',
            ),
        },
        {
            icon: UserPlus,
            label: text(
                'Banka müşterisi olmasanız da başvuru',
                'Apply even if you are not a bank customer',
            ),
        },
        {
            icon: BadgePercent,
            label: text(
                'Bankaların tekliflerini tek ekranda karşılaştırma',
                'Compare bank offers on one screen',
            ),
        },
    ];

    const offersLoading =
        step === 'offers' && (!currentPlan || currentPlan.status === 'loading');

    return (
        <div className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <p className="px-4 pt-3 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {text('Ödeme Seçenekleri', 'Payment Options')}
            </p>

            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Landmark className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-slate-900 dark:text-white">
                            {text('Alışveriş Kredisi', 'Shopping Loan')}
                        </span>
                        <span className="block text-sm text-slate-600 dark:text-slate-400">
                            {text(
                                `${data.maxInstallment} aya varan vade · aylık en düşük`,
                                `Up to ${data.maxInstallment} months · from`,
                            )}{' '}
                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                                {formatMoney(data.installmentPrice)}
                            </span>
                            {language === 'en' && ' / month'}
                        </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        <span className="hidden sm:inline">
                            {text('Seçenekleri gör', 'See options')}
                        </span>
                        <ChevronRight className="h-5 w-5" />
                    </span>
                </DialogTrigger>

                <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
                    <DialogHeader className="border-b border-slate-200 px-5 py-4 text-left dark:border-slate-800">
                        <DialogTitle>
                            {text('Alışveriş Kredisi', 'Shopping Loan')}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {text(
                                `${formatMoney(data.price)} tutarındaki alışverişiniz için alışveriş kredisi seçenekleri`,
                                `Shopping loan options for your ${formatMoney(data.price)} purchase`,
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {/* 1) Tanıtım */}
                    {step === 'intro' && (
                        <>
                            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-4 pt-4 pb-1 text-center text-white">
                                    <p className="text-base font-bold sm:text-xl">
                                        {text(
                                            "Alışveriş Kredisi ile Kolay Butik'te Ödeme Fırsatları",
                                            'Payment Opportunities at Kolay Butik with Shopping Loans',
                                        )}
                                    </p>
                                    <p className="mt-0.5 text-xs text-indigo-100 sm:text-sm">
                                        {text(
                                            `${formatMoney(data.price)} tutarındaki alışverişinizi aylık taksitlere bölün`,
                                            `Split your ${formatMoney(data.price)} purchase into monthly installments`,
                                        )}
                                    </p>
                                    <CreditHeroIllustration
                                        months={data.maxInstallment}
                                        monthLabel={text('AY', 'MONTHS')}
                                        className="mx-auto mt-2 block h-auto w-full max-w-[400px] [@media(max-height:700px)]:max-w-[260px]"
                                    />
                                </div>

                                <h3 className="mt-4 text-center text-lg font-bold text-indigo-700 sm:text-xl dark:text-indigo-400">
                                    {text(
                                        'Alışveriş Kredisinin Avantajları',
                                        'Advantages of Shopping Loans',
                                    )}
                                </h3>
                                <p className="mt-0.5 text-center text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                                    {text(
                                        'Kart limitinize bağlı kalmadan, size uygun vadeyle ödeyin.',
                                        'Pay with the term that suits you, regardless of your card limit.',
                                    )}
                                </p>

                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {advantages.map(({ icon: Icon, label }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-2.5 py-2 text-left sm:flex-col sm:gap-1.5 sm:px-2 sm:py-3 sm:text-center dark:border-slate-800"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span className="text-xs leading-snug font-medium text-slate-800 sm:text-sm dark:text-slate-200">
                                                {label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 p-3 sm:p-4 dark:border-slate-800">
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={showOffers}
                                >
                                    {text(
                                        'Oranları Görmek İçin Tıkla',
                                        'Click to See Rates',
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                    {/* 2) Teklifler alınıyor */}
                    {offersLoading && (
                        <div className="flex min-h-[360px] flex-1 flex-col items-center justify-center gap-4 bg-slate-50 px-6 py-12 text-center dark:bg-slate-950">
                            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900">
                                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                            </span>
                            <div>
                                <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                                    {text(
                                        'Finansal kurumlardan size özel teklifler alınıyor…',
                                        'Getting personalized offers from financial institutions…',
                                    )}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {text('Lütfen bekleyiniz.', 'Please wait.')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3) Teklifler */}
                    {step === 'offers' && currentPlan?.status === 'error' && (
                        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center text-sm text-slate-600 dark:text-slate-400">
                            {text(
                                'Kredi teklifleri şu an alınamadı.',
                                'Loan offers are unavailable right now.',
                            )}
                            <Button
                                variant="outline"
                                onClick={() =>
                                    loadPaymentPlan(data.widgetToken)
                                }
                            >
                                {text('Tekrar dene', 'Retry')}
                            </Button>
                        </div>
                    )}

                    {step === 'offers' && currentPlan?.status === 'success' && (
                        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                            <p className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                                {text(
                                    'Oranlar bilgilendirme amaçlıdır; kesin taksit tutarları kredi onayından sonra gösterilir. Daha önce kampanyalı oranlardan yararlandıysanız başvuru sırasında farklı oranlar görebilirsiniz.',
                                    'Rates are for information only; final installment amounts are shown after loan approval. If you have used campaign rates before, you may see different rates when applying.',
                                )}
                            </p>

                            {currentPlan.banks.length === 0 && (
                                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                                    {text(
                                        'Bu tutar için kredi teklifi bulunamadı.',
                                        'No loan offers found for this amount.',
                                    )}
                                </p>
                            )}

                            <div className="mt-4 space-y-4">
                                {currentPlan.banks.map((bank) => (
                                    <Collapsible key={bank.bankId} defaultOpen>
                                        <CollapsibleTrigger className="group flex w-full items-center gap-3 py-2 text-left">
                                            <span className="min-w-0 flex-1">
                                                <img
                                                    src={bank.bankLogoUrl}
                                                    alt={bank.bankName}
                                                    className="h-12 w-auto max-w-[200px] object-contain object-left sm:h-14 sm:max-w-[240px]"
                                                />
                                            </span>
                                            <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                                        </CollapsibleTrigger>

                                        <CollapsibleContent className="space-y-4 pt-2">
                                            {bank.products.map((product) => {
                                                const tableKey = `${bank.bankId}-${product.productType}`;
                                                const expanded =
                                                    expandedTables.has(
                                                        tableKey,
                                                    );
                                                const rows = expanded
                                                    ? product.terms
                                                    : previewTerms(
                                                          product.terms,
                                                      );
                                                const hasCampaign =
                                                    product.campaigns.length >
                                                    0;

                                                return (
                                                    <div
                                                        key={tableKey}
                                                        className={cn(
                                                            'relative rounded-xl border',
                                                            hasCampaign
                                                                ? 'mt-3 border-indigo-400 dark:border-indigo-600'
                                                                : 'border-slate-200 dark:border-slate-800',
                                                        )}
                                                    >
                                                        {hasCampaign && (
                                                            <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-indigo-400 bg-white px-3 py-0.5 text-xs font-semibold whitespace-nowrap text-indigo-700 dark:bg-slate-900 dark:text-indigo-400">
                                                                <Sparkles className="h-3.5 w-3.5" />
                                                                {text(
                                                                    'Avantajlı Teklif',
                                                                    'Special Offer',
                                                                )}
                                                            </span>
                                                        )}
                                                        <div
                                                            className={cn(
                                                                'flex flex-wrap items-center justify-between gap-2 rounded-t-xl px-4 py-3',
                                                                hasCampaign &&
                                                                    'bg-indigo-50 dark:bg-indigo-950/40',
                                                            )}
                                                        >
                                                            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400">
                                                                {productTypeTitle(
                                                                    product.productType,
                                                                )}
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    'rounded-md px-2 py-0.5 text-xs font-semibold',
                                                                    bank.existingCustomer
                                                                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                                                                        : 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
                                                                )}
                                                            >
                                                                {bank.existingCustomer
                                                                    ? text(
                                                                          'Banka Müşterisine Özel',
                                                                          'For Bank Customers',
                                                                      )
                                                                    : text(
                                                                          'Yeni Müşteriye Özel',
                                                                          'For New Customers',
                                                                      )}
                                                            </span>
                                                        </div>

                                                        <div className="overflow-x-auto">
                                                            <table className="w-full border-t border-slate-200 text-center text-xs sm:text-sm dark:border-slate-800">
                                                                <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                                                    <tr>
                                                                        <th className="px-1 py-2 font-semibold whitespace-nowrap sm:px-2">
                                                                            {text(
                                                                                'Vade',
                                                                                'Term',
                                                                            )}
                                                                        </th>
                                                                        <th className="px-1 py-2 font-semibold whitespace-nowrap sm:px-2">
                                                                            {text(
                                                                                'Taksit',
                                                                                'Installment',
                                                                            )}
                                                                        </th>
                                                                        <th className="px-1 py-2 font-semibold whitespace-nowrap sm:px-2">
                                                                            {text(
                                                                                'Faiz',
                                                                                'Rate',
                                                                            )}
                                                                        </th>
                                                                        <th className="px-1 py-2 font-semibold whitespace-nowrap sm:px-2">
                                                                            {text(
                                                                                'Toplam Tutar',
                                                                                'Total',
                                                                            )}
                                                                        </th>
                                                                        <th className="px-1 py-2 font-semibold whitespace-nowrap sm:px-2">
                                                                            <abbr
                                                                                title={text(
                                                                                    'Yıllık Maliyet Oranı',
                                                                                    'Annual Cost Rate',
                                                                                )}
                                                                                className="inline-flex items-center gap-1 no-underline"
                                                                            >
                                                                                {text(
                                                                                    'YMO',
                                                                                    'APR',
                                                                                )}
                                                                                <Info className="h-3.5 w-3.5 text-slate-400" />
                                                                            </abbr>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {rows.map(
                                                                        (
                                                                            term,
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    term.term
                                                                                }
                                                                                className="border-t border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                                                                            >
                                                                                <td className="px-1 py-2 whitespace-nowrap sm:px-2">
                                                                                    {
                                                                                        term.term
                                                                                    }
                                                                                </td>
                                                                                <td className="px-1 py-2 font-medium whitespace-nowrap text-slate-900 sm:px-2 dark:text-white">
                                                                                    {formatMoney(
                                                                                        term.amount,
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-1 py-2 whitespace-nowrap sm:px-2">
                                                                                    {formatRate(
                                                                                        term.interestRate,
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-1 py-2 whitespace-nowrap sm:px-2">
                                                                                    {formatMoney(
                                                                                        term.totalPaymentAmount,
                                                                                    )}
                                                                                </td>
                                                                                <td className="px-1 py-2 whitespace-nowrap sm:px-2">
                                                                                    {term.annualEffectiveInterestRate !==
                                                                                    null
                                                                                        ? formatRate(
                                                                                              term.annualEffectiveInterestRate,
                                                                                          )
                                                                                        : '-'}
                                                                                </td>
                                                                            </tr>
                                                                        ),
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        {product.terms.length >
                                                            PREVIEW_ROW_COUNT && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleTable(
                                                                        tableKey,
                                                                    )
                                                                }
                                                                className="flex w-full items-center justify-center gap-1 border-t border-slate-200 py-2.5 text-sm font-medium text-indigo-600 hover:bg-slate-50 dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-slate-800/60"
                                                            >
                                                                {expanded
                                                                    ? text(
                                                                          'Daha Az Göster',
                                                                          'Show Less',
                                                                      )
                                                                    : text(
                                                                          'Tümünü Gör',
                                                                          'See All',
                                                                      )}
                                                                <ChevronDown
                                                                    className={cn(
                                                                        'h-4 w-4 transition-transform',
                                                                        expanded &&
                                                                            'rotate-180',
                                                                    )}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                            </div>

                            <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                                {text(
                                    'Kredi başvurusu ödeme adımında iyzico ile Öde üzerinden yapılır.',
                                    'Apply for the loan at checkout with Pay with iyzico.',
                                )}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
