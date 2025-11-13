import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronDownIcon,
    Database,
    FileText,
    Loader2,
    Scroll,
    Search,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReportFormData {
    conversationId?: string;
    transactionDate?: string;
    lastId?: string;
    documentScrollVoSortingOrder?: string;
    paymentId?: string;
    paymentConversationId?: string;
}

interface ReportsIndexProps {
    scrollTransactionsData?: any;
    scrollTransactionsError?: string | null;
    transactionDailyData?: any;
    transactionDailyError?: string | null;
    transactionBasedData?: any;
    transactionBasedError?: string | null;
    marketplacePayoutData?: any;
    marketplacePayoutError?: string | null;
    marketplaceBouncedData?: any;
    marketplaceBouncedError?: string | null;
}

export default function ReportsIndex({
    scrollTransactionsData,
    scrollTransactionsError,
    transactionDailyData,
    transactionDailyError,
    transactionBasedData,
    transactionBasedError,
    marketplacePayoutData,
    marketplacePayoutError,
    marketplaceBouncedData,
    marketplaceBouncedError,
}: ReportsIndexProps) {
    const [activeTab, setActiveTab] = useState('scroll-transactions');
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string | null>>({
        'scroll-transactions': scrollTransactionsError || null,
        'transaction-daily': transactionDailyError || null,
        'transaction-based': transactionBasedError || null,
        'marketplace-payout': marketplacePayoutError || null,
        'marketplace-bounced': marketplaceBouncedError || null,
    });
    const [results, setResults] = useState<Record<string, any>>({
        'scroll-transactions': scrollTransactionsData || null,
        'transaction-daily': transactionDailyData || null,
        'transaction-based': transactionBasedData || null,
        'marketplace-payout': marketplacePayoutData || null,
        'marketplace-bounced': marketplaceBouncedData || null,
    });

    const [formData, setFormData] = useState<ReportFormData>({
        conversationId: '',
        transactionDate: new Date().toISOString().split('T')[0],
        lastId: '',
        documentScrollVoSortingOrder: '',
        paymentId: '',
        paymentConversationId: '',
    });

    const [datePickerOpen, setDatePickerOpen] = useState<
        Record<string, boolean>
    >({});

    // Update state when props change
    useEffect(() => {
        setErrors({
            'scroll-transactions': scrollTransactionsError || null,
            'transaction-daily': transactionDailyError || null,
            'transaction-based': transactionBasedError || null,
            'marketplace-payout': marketplacePayoutError || null,
            'marketplace-bounced': marketplaceBouncedError || null,
        });
        setResults({
            'scroll-transactions': scrollTransactionsData || null,
            'transaction-daily': transactionDailyData || null,
            'transaction-based': transactionBasedData || null,
            'marketplace-payout': marketplacePayoutData || null,
            'marketplace-bounced': marketplaceBouncedData || null,
        });
    }, [
        scrollTransactionsData,
        scrollTransactionsError,
        transactionDailyData,
        transactionDailyError,
        transactionBasedData,
        transactionBasedError,
        marketplacePayoutData,
        marketplacePayoutError,
        marketplaceBouncedData,
        marketplaceBouncedError,
    ]);

    const reports: Array<{
        id: string;
        title: string;
        description: string;
        icon: any;
        endpoint: string;
        fields: string[];
        requiredFields?: string[];
        customValidation?: (formData: ReportFormData) => boolean;
    }> = [
        {
            id: 'scroll-transactions',
            title: 'Reporting API Scroll-Transactions',
            description: 'Scroll ile işlem raporlarını görüntüleyin',
            icon: Scroll,
            endpoint: '/services/reports/scroll-transactions',
            fields: [
                'conversationId',
                'transactionDate',
                'lastId',
                'documentScrollVoSortingOrder',
            ],
        },
        {
            id: 'transaction-daily',
            title: 'Reporting API Transaction Daily',
            description: 'Günlük işlem raporlarını görüntüleyin',
            icon: CalendarIcon,
            endpoint: '/services/reports/transaction-daily',
            fields: ['conversationId', 'transactionDate'],
            requiredFields: ['transactionDate'],
        },
        {
            id: 'transaction-based',
            title: 'Reporting API Transaction Based',
            description: 'İşlem bazlı raporları görüntüleyin',
            icon: Database,
            endpoint: '/services/reports/transaction-based',
            fields: ['conversationId', 'paymentId', 'paymentConversationId'],
            requiredFields: [],
            customValidation: (formData: ReportFormData) => {
                return !!(formData.paymentId || formData.paymentConversationId);
            },
        },
        {
            id: 'marketplace-payout',
            title: 'MarketPlace PayoutCompleted',
            description:
                'Marketplace ödeme tamamlanma raporlarını görüntüleyin',
            icon: TrendingUp,
            endpoint: '/services/reports/marketplace-payout-completed',
            fields: ['conversationId', 'transactionDate'],
            requiredFields: ['transactionDate'],
        },
        {
            id: 'marketplace-bounced',
            title: 'MarketPlace Retrieve Bounced Payments',
            description: 'Marketplace geri dönen ödemeleri görüntüleyin',
            icon: AlertCircle,
            endpoint: '/services/reports/marketplace-bounced-payments',
            fields: ['conversationId', 'transactionDate'],
            requiredFields: ['transactionDate'],
        },
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[activeTab]) {
            setErrors((prev) => ({
                ...prev,
                [activeTab]: null,
            }));
        }
    };

    const handleSearch = (reportId: string) => {
        const report = reports.find((r) => r.id === reportId);
        if (!report) return;

        // Validate required fields
        if (report.requiredFields && report.requiredFields.length > 0) {
            for (const field of report.requiredFields) {
                if (
                    !formData[field as keyof ReportFormData] ||
                    formData[field as keyof ReportFormData] === ''
                ) {
                    setErrors((prev) => ({
                        ...prev,
                        [reportId]: `${field} alanı zorunludur`,
                    }));
                    return;
                }
            }
        }

        // Custom validation
        if (report.customValidation && !report.customValidation(formData)) {
            setErrors((prev) => ({
                ...prev,
                [reportId]:
                    'paymentId veya paymentConversationId alanlarından biri gereklidir',
            }));
            return;
        }

        setLoading((prev) => ({ ...prev, [reportId]: true }));
        setErrors((prev) => ({ ...prev, [reportId]: null }));

        // Build query params
        const params: Record<string, string> = {};
        report.fields.forEach((field) => {
            const value = formData[field as keyof ReportFormData];
            if (value && value !== '') {
                params[field] = value;
            }
        });

        router.get(report.endpoint, params, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setLoading((prev) => ({ ...prev, [reportId]: false }));
            },
            onError: (errors) => {
                setErrors((prev) => ({
                    ...prev,
                    [reportId]:
                        Object.values(errors).join(', ') || 'Bir hata oluştu',
                }));
                setLoading((prev) => ({ ...prev, [reportId]: false }));
            },
            onFinish: () => {
                setLoading((prev) => ({ ...prev, [reportId]: false }));
            },
        });
    };

    const renderFormField = (field: string, report: (typeof reports)[0]) => {
        const isRequired = report.requiredFields?.includes(field);
        const value = formData[field as keyof ReportFormData] || '';

        switch (field) {
            case 'transactionDate':
                // Parse date string (YYYY-MM-DD) to Date object in local timezone
                const dateValue = value
                    ? (() => {
                          const [year, month, day] = value
                              .split('-')
                              .map(Number);
                          return new Date(year, month - 1, day);
                      })()
                    : undefined;
                const fieldKey = `${report.id}-${field}`;
                return (
                    <div className="flex flex-col gap-3" key={field}>
                        <Label htmlFor={field}>
                            İşlem Tarihi{' '}
                            {isRequired && (
                                <span className="text-red-500">*</span>
                            )}
                        </Label>
                        <Popover
                            open={datePickerOpen[fieldKey] || false}
                            onOpenChange={(open) =>
                                setDatePickerOpen((prev) => ({
                                    ...prev,
                                    [fieldKey]: open,
                                }))
                            }
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id={field}
                                    className="w-full justify-between font-normal"
                                    disabled={loading[report.id]}
                                >
                                    {dateValue
                                        ? dateValue.toLocaleDateString()
                                        : 'Tarih seçin'}
                                    <ChevronDownIcon className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={dateValue}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        if (date) {
                                            // Format date as YYYY-MM-DD in local timezone
                                            const year = date.getFullYear();
                                            const month = String(
                                                date.getMonth() + 1,
                                            ).padStart(2, '0');
                                            const day = String(
                                                date.getDate(),
                                            ).padStart(2, '0');
                                            handleInputChange(
                                                field,
                                                `${year}-${month}-${day}`,
                                            );
                                            setDatePickerOpen((prev) => ({
                                                ...prev,
                                                [fieldKey]: false,
                                            }));
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                );

            case 'documentScrollVoSortingOrder':
                return (
                    <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>Sıralama</Label>
                        <Select
                            value={value}
                            onValueChange={(val) =>
                                handleInputChange(field, val)
                            }
                            disabled={loading[report.id]}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sıralama seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ASC">Artan (ASC)</SelectItem>
                                <SelectItem value="DESC">
                                    Azalan (DESC)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                );

            case 'paymentId':
                return (
                    <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>Payment ID</Label>
                        <Input
                            id={field}
                            type="text"
                            placeholder="Opsiyonel"
                            value={value}
                            onChange={(e) =>
                                handleInputChange(field, e.target.value)
                            }
                            disabled={loading[report.id]}
                        />
                    </div>
                );

            case 'paymentConversationId':
                return (
                    <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>Payment Conversation ID</Label>
                        <Input
                            id={field}
                            type="text"
                            placeholder="Opsiyonel"
                            value={value}
                            onChange={(e) =>
                                handleInputChange(field, e.target.value)
                            }
                            disabled={loading[report.id]}
                        />
                    </div>
                );

            default:
                return (
                    <div className="space-y-2" key={field}>
                        <Label htmlFor={field}>
                            {field === 'conversationId'
                                ? 'Conversation ID'
                                : field === 'lastId'
                                  ? 'Last ID'
                                  : field}
                            {isRequired && (
                                <span className="text-red-500">*</span>
                            )}
                        </Label>
                        <Input
                            id={field}
                            type="text"
                            placeholder={
                                field === 'conversationId'
                                    ? 'Opsiyonel'
                                    : field === 'lastId'
                                      ? 'Opsiyonel'
                                      : ''
                            }
                            value={value}
                            onChange={(e) =>
                                handleInputChange(field, e.target.value)
                            }
                            disabled={loading[report.id]}
                            required={isRequired}
                        />
                    </div>
                );
        }
    };

    const renderResult = (reportId: string, data: any) => {
        if (!data) return null;

        return (
            <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Rapor başarıyla alındı</span>
                </div>

                <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Rapor Sonuçları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100 dark:bg-slate-800">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Raporlar" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-4">
                        <Link href="/services">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Geri Dön
                            </Button>
                        </Link>
                    </div>
                    <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
                        <FileText className="h-8 w-8 text-blue-600" />
                        Raporlar
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        İşlem raporlarını görüntüleyin ve yönetin
                    </p>
                </div>

                {/* Reports Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="mb-0 grid h-auto w-full grid-cols-5 p-1">
                        {reports.map((report) => {
                            const Icon = report.icon;
                            return (
                                <TabsTrigger
                                    key={report.id}
                                    value={report.id}
                                    className="flex h-auto min-h-[60px] flex-col items-center justify-center gap-2 px-2 py-3 text-xs"
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-center leading-tight">
                                        {report.title.split(' ')[0]}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {reports.map((report) => {
                        const Icon = report.icon;
                        const isLoading = loading[report.id] || false;
                        const error = errors[report.id];
                        const result = results[report.id];

                        return (
                            <TabsContent
                                key={report.id}
                                value={report.id}
                                className="mt-0"
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="mb-2 flex items-center gap-3">
                                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">
                                                    {report.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {report.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {/* Form */}
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                                {report.fields.map((field) =>
                                                    renderFormField(
                                                        field,
                                                        report,
                                                    ),
                                                )}
                                            </div>

                                            {/* Search Button */}
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() =>
                                                        handleSearch(report.id)
                                                    }
                                                    disabled={isLoading}
                                                    className="min-w-[120px]"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Sorgulanıyor...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Search className="mr-2 h-4 w-4" />
                                                            Sorgula
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            {/* Error */}
                                            {error && (
                                                <Alert variant="destructive">
                                                    <XCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {error}
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {/* Results */}
                                            {result &&
                                                renderResult(report.id, result)}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
}
