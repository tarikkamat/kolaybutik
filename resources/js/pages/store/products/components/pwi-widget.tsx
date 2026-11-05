import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/i18n';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CreditTerm {
    productType: string;
    term: number;
    interestRate: number;
    amount: number;
    totalPaymentAmount: number;
    annualEffectiveInterestRate: number | null;
}

interface CreditPlan {
    bankId: number;
    bankName: string;
    bankLogoUrl: string;
    existingCustomer: boolean;
    terms: CreditTerm[];
}

interface PwiWidgetData {
    status: 'success';
    widgetToken: string;
    widgetContent: string | null;
    price: number;
    currency: string;
    payWithIyzicoEnabled: boolean;
    creditEnabled: boolean;
    maxInstallment: number | null;
    installmentPrice: number | null;
    creditPlans: CreditPlan[];
}

interface PwiWidgetProps {
    productSlug: string;
}

declare global {
    interface Window {
        widgetInit?: unknown;
    }
}

/**
 * iyzico'nun döndüğü widgetContent'i #iyzico-widget içine çalıştırır.
 * innerHTML ile eklenen <script> çalışmadığı için script elementleri yeniden oluşturulur.
 * Script `typeof widgetInit === 'undefined'` kontrolü yaptığından Inertia ile ürünler
 * arasında gezerken yeni ürünün init'i çalışsın diye global değer sıfırlanır.
 */
function mountOfficialWidget(container: HTMLElement, widgetContent: string) {
    window.widgetInit = undefined;
    container.innerHTML = '';

    const template = document.createElement('template');
    template.innerHTML = widgetContent;

    template.content.querySelectorAll('script').forEach((original) => {
        const script = document.createElement('script');
        Array.from(original.attributes).forEach((attr) =>
            script.setAttribute(attr.name, attr.value),
        );
        script.text = original.text;
        container.appendChild(script);
    });
}

export function PwiWidget({ productSlug }: PwiWidgetProps) {
    const { text, language } = useI18n();
    const requestUrl = `/store/products/${encodeURIComponent(productSlug)}/pwi-widget?locale=${language}`;
    const [result, setResult] = useState<{
        url: string;
        data: PwiWidgetData | null;
    } | null>(null);
    const officialContainerRef = useRef<HTMLDivElement>(null);

    // Ürün ya da dil değiştiğinde eski sonuç bu URL'e ait olmadığı için yükleniyor sayılır.
    const loading = result?.url !== requestUrl;
    const data = loading ? null : result.data;

    useEffect(() => {
        const controller = new AbortController();

        fetch(requestUrl, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        })
            .then((response) => (response.ok ? response.json() : null))
            .then((json: PwiWidgetData | null) =>
                setResult({
                    url: requestUrl,
                    data: json?.status === 'success' ? json : null,
                }),
            )
            .catch((error: unknown) => {
                if ((error as Error)?.name === 'AbortError') return;
                setResult({ url: requestUrl, data: null });
            });

        return () => controller.abort();
    }, [requestUrl]);

    useEffect(() => {
        if (data?.widgetContent && officialContainerRef.current) {
            mountOfficialWidget(
                officialContainerRef.current,
                data.widgetContent,
            );
        }
    }, [data]);

    if (loading) {
        return <Skeleton className="mb-6 h-[74px] w-full rounded-lg" />;
    }

    // Widget gösterilemiyorsa ürün sayfasını etkilemeden sessizce gizlenir.
    if (!data || !data.payWithIyzicoEnabled) {
        return null;
    }

    // iyzico widget asset'leri (JS/CSS) geldiğinde resmi widget'ı kullan.
    if (data.widgetContent) {
        return (
            <div
                id="iyzico-widget"
                ref={officialContainerRef}
                className="mb-6"
            />
        );
    }

    const locale = language === 'tr' ? 'tr-TR' : 'en-US';
    const formatRate = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: 'percent',
            maximumFractionDigits: 2,
        }).format(value / 100);
    const formatMoney = (value: number) =>
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: data.currency || 'TRY',
            currencyDisplay: 'narrowSymbol',
            minimumFractionDigits: 2,
        }).format(value);

    const hasInstallment =
        data.maxInstallment !== null &&
        data.maxInstallment > 1 &&
        data.installmentPrice !== null;
    const creditPlans = data.creditEnabled ? data.creditPlans : [];
    const lowestCredit = creditPlans
        .flatMap((plan) => plan.terms)
        .reduce<CreditTerm | null>(
            (lowest, term) =>
                !lowest || term.amount < lowest.amount ? term : lowest,
            null,
        );

    if (!hasInstallment && creditPlans.length === 0) {
        return null;
    }

    return (
        <div
            id="iyzico-widget"
            className="mb-6 overflow-hidden rounded-lg border border-indigo-100 bg-indigo-50/60 dark:border-indigo-900/60 dark:bg-indigo-950/30"
        >
            <div className="flex items-start gap-3 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <div className="min-w-0 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">
                        {text('iyzico ile Öde', 'Pay with iyzico')}
                    </p>
                    {hasInstallment && (
                        <p className="text-slate-700 dark:text-slate-300">
                            {text(
                                `${data.maxInstallment} aya varan taksit:`,
                                `Up to ${data.maxInstallment} installments:`,
                            )}{' '}
                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                                {data.maxInstallment} x{' '}
                                {formatMoney(data.installmentPrice!)}
                            </span>
                        </p>
                    )}
                    {lowestCredit && (
                        <p className="text-slate-700 dark:text-slate-300">
                            {text(
                                'Alışveriş kredisi: aylık en düşük',
                                'Shopping loan: from',
                            )}{' '}
                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                                {formatMoney(lowestCredit.amount)}
                            </span>
                            {language === 'en' && ' / month'}
                        </p>
                    )}
                </div>
            </div>

            {creditPlans.length > 0 && (
                <Collapsible>
                    <CollapsibleTrigger className="group flex w-full items-center justify-between border-t border-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100/60 dark:border-indigo-900/60 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
                        {text(
                            'Alışveriş kredisi seçeneklerini gör',
                            'See shopping loan options',
                        )}
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 border-t border-indigo-100 bg-white p-4 dark:border-indigo-900/60 dark:bg-slate-900">
                        {creditPlans.map((plan) => (
                            <div key={plan.bankId}>
                                <div className="mb-2 flex items-center gap-2">
                                    <img
                                        src={plan.bankLogoUrl}
                                        alt={plan.bankName}
                                        className="h-6 w-auto max-w-[96px] object-contain"
                                        loading="lazy"
                                    />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {plan.bankName}
                                    </span>
                                </div>
                                <table className="w-full table-fixed text-xs">
                                    <thead>
                                        <tr className="text-left text-slate-500 dark:text-slate-400">
                                            <th className="py-1 font-medium">
                                                {text('Vade', 'Term')}
                                            </th>
                                            <th className="py-1 font-medium">
                                                {text('Aylık', 'Monthly')}
                                            </th>
                                            <th className="py-1 font-medium">
                                                {text('Faiz', 'Rate')}
                                            </th>
                                            <th className="py-1 text-right font-medium">
                                                {text('Toplam', 'Total')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plan.terms.map((term) => (
                                            <tr
                                                key={`${term.productType}-${term.term}`}
                                                className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                                            >
                                                <td className="py-1">
                                                    {term.term}{' '}
                                                    {text('ay', 'mo')}
                                                    {term.productType ===
                                                        'OVERDRAFT' && (
                                                        <span className="ml-1 text-slate-400">
                                                            (KMH)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-1 font-medium">
                                                    {formatMoney(term.amount)}
                                                </td>
                                                <td className="py-1">
                                                    {formatRate(
                                                        term.interestRate,
                                                    )}
                                                </td>
                                                <td className="py-1 text-right">
                                                    {formatMoney(
                                                        term.totalPaymentAmount,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
}
