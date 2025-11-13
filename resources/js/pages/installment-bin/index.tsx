import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Info,
    Loader2,
    Search,
    XCircle,
} from 'lucide-react';

interface InstallmentPrice {
    installmentNumber: number;
    installmentPrice: number;
    totalPrice: number;
}

interface InstallmentDetail {
    binNumber?: string;
    price: number;
    cardType?: string;
    cardAssociation?: string;
    cardFamilyName?: string;
    force3ds?: number;
    bankCode?: number;
    bankName?: string;
    forceCvc?: number;
    commercial?: number;
    installmentPrices: InstallmentPrice[];
}

interface InstallmentResponse {
    status: string;
    locale: string;
    systemTime: number;
    conversationId: string;
    installmentDetails: InstallmentDetail[];
}

interface BinResponse {
    status: string;
    binNumber: string;
    cardType: string;
    cardAssociation: string;
    cardFamily: string;
    bankName: string;
    bankCode: number;
    commercial: number;
    locale: string;
    systemTime: number;
    conversationId: string;
}

interface InstallmentBinIndexProps {
    installmentData?: InstallmentResponse | null;
    installmentError?: string | null;
    binData?: BinResponse | null;
    binError?: string | null;
}

export default function InstallmentBinIndex({
    installmentData: propInstallmentData = null,
    installmentError: propInstallmentError = null,
    binData: propBinData = null,
    binError: propBinError = null,
}: InstallmentBinIndexProps) {
    const installmentForm = useForm({
        binNumber: '',
        price: '100.00',
        conversationId: '',
    });

    const binForm = useForm({
        binNumber: '',
        conversationId: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(amount);
    };

    const handleInstallmentSearch = (e: React.FormEvent) => {
        e.preventDefault();
        installmentForm.post('/services/installment-bin/installment', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleBinSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (binForm.data.binNumber.length !== 6) {
            binForm.setError('binNumber', 'BIN numarası 6 haneli olmalıdır');
            return;
        }
        binForm.post('/services/installment-bin/bin', {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Taksit ve BIN Sorgulama" />
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
                        <CreditCard className="h-8 w-8 text-purple-600" />
                        Taksit ve BIN Sorgulama
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Kart BIN numarasına göre taksit bilgilerini ve BIN
                        numarası detaylarını sorgulayın
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="installment" className="w-full">
                    <TabsList className="mb-0 grid h-auto w-full grid-cols-2 p-1">
                        <TabsTrigger
                            value="installment"
                            className="h-auto min-h-[44px] py-3"
                        >
                            Taksit Sorgulama
                        </TabsTrigger>
                        <TabsTrigger
                            value="bin"
                            className="h-auto min-h-[44px] py-3"
                        >
                            BIN Sorgulama
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="installment">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                        <Info className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle>Taksit Sorgulama</CardTitle>
                                        <CardDescription>
                                            BIN numarasına göre veya tüm kartlar
                                            için taksit bilgilerini sorgulayın
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Form */}
                                    <form onSubmit={handleInstallmentSearch}>
                                        <div className="grid items-end gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="installment-bin">
                                                    BIN Numarası (Opsiyonel)
                                                </Label>
                                                <Input
                                                    id="installment-bin"
                                                    type="text"
                                                    placeholder="542119"
                                                    maxLength={6}
                                                    value={
                                                        installmentForm.data
                                                            .binNumber
                                                    }
                                                    onChange={(e) =>
                                                        installmentForm.setData(
                                                            'binNumber',
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                    disabled={
                                                        installmentForm.processing
                                                    }
                                                />
                                                {installmentForm.errors
                                                    .binNumber && (
                                                    <p className="text-xs text-red-500">
                                                        {
                                                            installmentForm
                                                                .errors
                                                                .binNumber
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="installment-price">
                                                    Fiyat (TRY)
                                                </Label>
                                                <Input
                                                    id="installment-price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    placeholder="100.00"
                                                    value={
                                                        installmentForm.data
                                                            .price
                                                    }
                                                    onChange={(e) =>
                                                        installmentForm.setData(
                                                            'price',
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={
                                                        installmentForm.processing
                                                    }
                                                />
                                                {installmentForm.errors
                                                    .price && (
                                                    <p className="text-xs text-red-500">
                                                        {
                                                            installmentForm
                                                                .errors.price
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    installmentForm.processing ||
                                                    !installmentForm.data.price
                                                }
                                                className="h-10 w-full"
                                            >
                                                {installmentForm.processing ? (
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
                                    </form>

                                    {/* Error */}
                                    {propInstallmentError && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                {propInstallmentError}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Results */}
                                    {propInstallmentData && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                <span>
                                                    {
                                                        propInstallmentData
                                                            .installmentDetails
                                                            .length
                                                    }{' '}
                                                    kart ailesi bulundu
                                                </span>
                                            </div>

                                            <div className="grid gap-4">
                                                {propInstallmentData.installmentDetails.map(
                                                    (detail, index) => (
                                                        <Card
                                                            key={index}
                                                            className="border-purple-200 dark:border-purple-800"
                                                        >
                                                            <CardHeader className="pb-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <CardTitle className="text-lg">
                                                                            {detail.cardFamilyName ||
                                                                                'Bilinmeyen Kart'}
                                                                        </CardTitle>
                                                                        <CardDescription className="mt-1">
                                                                            {detail.bankName && (
                                                                                <span className="block">
                                                                                    {
                                                                                        detail.bankName
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                            {detail.cardAssociation && (
                                                                                <span className="mt-1 block text-xs">
                                                                                    {
                                                                                        detail.cardAssociation
                                                                                    }
                                                                                    {detail.cardType &&
                                                                                        ` - ${detail.cardType}`}
                                                                                </span>
                                                                            )}
                                                                        </CardDescription>
                                                                    </div>
                                                                    {detail.binNumber && (
                                                                        <div className="text-right">
                                                                            <div className="font-mono text-sm text-slate-600 dark:text-slate-400">
                                                                                BIN:{' '}
                                                                                {
                                                                                    detail.binNumber
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                                                    {detail.installmentPrices.map(
                                                                        (
                                                                            price,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    price.installmentNumber
                                                                                }
                                                                                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                                                                            >
                                                                                <div className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                                                                                    {
                                                                                        price.installmentNumber
                                                                                    }
                                                                                    x
                                                                                    Taksit
                                                                                </div>
                                                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                                                    {formatCurrency(
                                                                                        price.installmentPrice,
                                                                                    )}
                                                                                </div>
                                                                                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                                                                    Toplam:{' '}
                                                                                    {formatCurrency(
                                                                                        price.totalPrice,
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bin">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                        <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle>BIN Sorgulama</CardTitle>
                                        <CardDescription>
                                            BIN numarası detaylarını sorgulayın
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Form */}
                                    <form onSubmit={handleBinSearch}>
                                        <div className="grid items-end gap-4 md:grid-cols-4">
                                            <div className="space-y-2 md:col-span-3">
                                                <Label htmlFor="bin-number">
                                                    BIN Numarası
                                                </Label>
                                                <Input
                                                    id="bin-number"
                                                    type="text"
                                                    placeholder="542119"
                                                    maxLength={6}
                                                    value={
                                                        binForm.data.binNumber
                                                    }
                                                    onChange={(e) =>
                                                        binForm.setData(
                                                            'binNumber',
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                    disabled={
                                                        binForm.processing
                                                    }
                                                />
                                                {binForm.errors.binNumber && (
                                                    <p className="text-xs text-red-500">
                                                        {
                                                            binForm.errors
                                                                .binNumber
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    binForm.processing ||
                                                    binForm.data.binNumber
                                                        .length !== 6
                                                }
                                                className="h-10 w-full"
                                            >
                                                {binForm.processing ? (
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
                                    </form>

                                    {/* Error */}
                                    {propBinError && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                {propBinError}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Results */}
                                    {propBinData && (
                                        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10">
                                            <CardHeader>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    <CardTitle>
                                                        BIN Numarası Bilgileri
                                                    </CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                BIN Numarası
                                                            </Label>
                                                            <div className="mt-1 font-mono text-lg font-semibold text-slate-900 dark:text-white">
                                                                {
                                                                    propBinData.binNumber
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                Banka
                                                            </Label>
                                                            <div className="mt-1 font-medium text-slate-900 dark:text-white">
                                                                {
                                                                    propBinData.bankName
                                                                }
                                                            </div>
                                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                                Kod:{' '}
                                                                {
                                                                    propBinData.bankCode
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                Kart Tipi
                                                            </Label>
                                                            <div className="mt-1 text-slate-900 dark:text-white">
                                                                {
                                                                    propBinData.cardType
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                Kart Ailesi
                                                            </Label>
                                                            <div className="mt-1 font-medium text-slate-900 dark:text-white">
                                                                {
                                                                    propBinData.cardFamily
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                Kart Ağı
                                                            </Label>
                                                            <div className="mt-1 text-slate-900 dark:text-white">
                                                                {
                                                                    propBinData.cardAssociation
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                Ticari Kart
                                                            </Label>
                                                            <div className="mt-1">
                                                                {propBinData.commercial ===
                                                                1 ? (
                                                                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                                                        <CheckCircle2 className="h-4 w-4" />
                                                                        Evet
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                                        <XCircle className="h-4 w-4" />
                                                                        Hayır
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
