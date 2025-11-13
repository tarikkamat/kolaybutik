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
import { getCsrfToken } from '@/lib/csrf';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Hash,
    Loader2,
    MessageSquare,
    Search,
} from 'lucide-react';
import { useState } from 'react';

interface PaymentItem {
    itemId: string;
    paymentTransactionId: string;
    transactionStatus: string;
    price: number;
    paidPrice: number;
    merchantCommissionRate: string;
    merchantCommissionRateAmount: number;
    iyziCommissionRateAmount: number;
    iyziCommissionFee: number;
    blockageRate: string;
    blockageRateAmountMerchant: number;
    blockageRateAmountSubMerchant: number;
    blockageResolvedDate: string;
    subMerchantKey: string;
    subMerchantPrice: number;
    subMerchantPayoutRate: string;
    subMerchantPayoutAmount: number;
    merchantPayoutAmount: number;
    convertedPayout?: {
        paidPrice: number;
        iyziCommissionRateAmount: number;
        iyziCommissionFee: number;
        blockageRateAmountMerchant: number;
        blockageRateAmountSubMerchant: number;
        subMerchantPayoutAmount: number;
        merchantPayoutAmount: number;
        iyziConversionRate: string;
        iyziConversionRateAmount: number;
        currency: string;
    };
}

interface PaymentData {
    status: string;
    locale: string;
    systemTime: number;
    conversationId: string;
    price: number;
    paidPrice: number;
    installment: number;
    currency: string;
    paymentId: string;
    paymentStatus: string;
    fraudStatus: number;
    merchantCommissionRate: string;
    merchantCommissionRateAmount: number;
    iyziCommissionRateAmount: number;
    iyziCommissionFee: number;
    cardType: string;
    cardAssociation: string;
    cardFamily: string;
    cardToken: string;
    cardUserKey: string;
    binNumber: string;
    basketId: string;
    connectorName: string;
    authCode: string;
    phase: string;
    lastFourDigits: string;
    posOrderId: string;
    paymentItems: PaymentItem[];
}

interface PaymentResponse {
    success: boolean;
    data?: PaymentData;
    message?: string;
    errorCode?: string;
}

export default function PaymentInquiryIndex() {
    const [paymentIdResponse, setPaymentIdResponse] =
        useState<PaymentResponse | null>(null);
    const [conversationIdResponse, setConversationIdResponse] =
        useState<PaymentResponse | null>(null);
    const [loadingPaymentId, setLoadingPaymentId] = useState(false);
    const [loadingConversationId, setLoadingConversationId] = useState(false);

    const [paymentIdForm, setPaymentIdForm] = useState({
        paymentId: '',
        conversationId: '',
    });

    const [conversationIdForm, setConversationIdForm] = useState({
        paymentConversationId: '',
        conversationId: '',
    });

    const formatCurrency = (amount: number, currency: string = 'TRY') => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('tr-TR');
    };

    const handlePaymentIdSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentIdResponse(null);
        setLoadingPaymentId(true);

        try {
            const response = await fetch('/services/payment-inquiry/retrieve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(paymentIdForm),
            });

            const data = await response.json();
            setPaymentIdResponse(data);
        } catch (error) {
            setPaymentIdResponse({
                success: false,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        } finally {
            setLoadingPaymentId(false);
        }
    };

    const handleConversationIdSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setConversationIdResponse(null);
        setLoadingConversationId(true);

        try {
            const response = await fetch(
                '/services/payment-inquiry/retrieve-conversation',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify(conversationIdForm),
                },
            );

            const data = await response.json();
            setConversationIdResponse(data);
        } catch (error) {
            setConversationIdResponse({
                success: false,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        } finally {
            setLoadingConversationId(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Ödeme Sorgulama" />

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
                        <Search className="h-8 w-8 text-orange-600" />
                        Ödeme Sorgulama
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Payment ID veya Payment Conversation ID ile ödeme
                        bilgilerini sorgulayın
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="payment-id" className="w-full">
                    <TabsList className="mb-0 grid h-auto w-full grid-cols-2 p-1">
                        <TabsTrigger
                            value="payment-id"
                            className="h-auto min-h-[44px] py-3"
                        >
                            Payment ID ile Sorgula
                        </TabsTrigger>
                        <TabsTrigger
                            value="conversation-id"
                            className="h-auto min-h-[44px] py-3"
                        >
                            Payment Conversation ID ile Sorgula
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="payment-id">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                        <Hash className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <CardTitle>
                                            Payment ID ile Sorgula
                                        </CardTitle>
                                        <CardDescription>
                                            Payment ID kullanarak ödeme
                                            bilgilerini sorgulayın
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <form onSubmit={handlePaymentIdSearch}>
                                        <div className="grid items-end gap-4 md:grid-cols-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="payment-id">
                                                    Payment ID *
                                                </Label>
                                                <Input
                                                    id="payment-id"
                                                    type="text"
                                                    placeholder="123456789"
                                                    required
                                                    value={
                                                        paymentIdForm.paymentId
                                                    }
                                                    onChange={(e) =>
                                                        setPaymentIdForm({
                                                            ...paymentIdForm,
                                                            paymentId:
                                                                e.target.value,
                                                        })
                                                    }
                                                    disabled={loadingPaymentId}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="conversation-id-1">
                                                    Conversation ID (Opsiyonel)
                                                </Label>
                                                <Input
                                                    id="conversation-id-1"
                                                    type="text"
                                                    placeholder="conv_123"
                                                    value={
                                                        paymentIdForm.conversationId
                                                    }
                                                    onChange={(e) =>
                                                        setPaymentIdForm({
                                                            ...paymentIdForm,
                                                            conversationId:
                                                                e.target.value,
                                                        })
                                                    }
                                                    disabled={loadingPaymentId}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    loadingPaymentId ||
                                                    !paymentIdForm.paymentId
                                                }
                                                className="h-10 w-full"
                                            >
                                                {loadingPaymentId ? (
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

                                    {paymentIdResponse && (
                                        <Alert
                                            variant={
                                                paymentIdResponse.success
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                        >
                                            {paymentIdResponse.success &&
                                            paymentIdResponse.data ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <div className="mt-2 space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-semibold">
                                                                    Ödeme
                                                                    Bilgileri
                                                                </span>
                                                                <span
                                                                    className={`rounded px-2 py-1 text-xs font-medium ${
                                                                        paymentIdResponse
                                                                            .data
                                                                            .paymentStatus ===
                                                                        'SUCCESS'
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                                    }`}
                                                                >
                                                                    {
                                                                        paymentIdResponse
                                                                            .data
                                                                            .paymentStatus
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Payment
                                                                            ID
                                                                        </Label>
                                                                        <div className="mt-1 font-mono text-sm font-semibold">
                                                                            {
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .paymentId
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Conversation
                                                                            ID
                                                                        </Label>
                                                                        <div className="mt-1 font-mono text-sm">
                                                                            {
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .conversationId
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Basket
                                                                            ID
                                                                        </Label>
                                                                        <div className="mt-1 font-mono text-sm">
                                                                            {
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .basketId
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Fiyat
                                                                        </Label>
                                                                        <div className="mt-1 text-lg font-semibold">
                                                                            {formatCurrency(
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .price,
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .currency,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Ödenen
                                                                            Tutar
                                                                        </Label>
                                                                        <div className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                                                                            {formatCurrency(
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .paidPrice,
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .currency,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {paymentIdResponse
                                                                        .data
                                                                        .installment >
                                                                        1 && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Taksit
                                                                            </Label>
                                                                            <div className="mt-1">
                                                                                {
                                                                                    paymentIdResponse
                                                                                        .data
                                                                                        .installment
                                                                                }
                                                                                x
                                                                                Taksit
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {paymentIdResponse
                                                                        .data
                                                                        .cardType && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Kart
                                                                                Bilgileri
                                                                            </Label>
                                                                            <div className="mt-1 space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                                                                    <span>
                                                                                        {
                                                                                            paymentIdResponse
                                                                                                .data
                                                                                                .cardAssociation
                                                                                        }{' '}
                                                                                        {
                                                                                            paymentIdResponse
                                                                                                .data
                                                                                                .cardType
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                {paymentIdResponse
                                                                                    .data
                                                                                    .lastFourDigits && (
                                                                                    <div className="font-mono text-sm">
                                                                                        ****{' '}
                                                                                        {
                                                                                            paymentIdResponse
                                                                                                .data
                                                                                                .lastFourDigits
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                                {paymentIdResponse
                                                                                    .data
                                                                                    .binNumber && (
                                                                                    <div className="text-xs text-slate-500">
                                                                                        BIN:{' '}
                                                                                        {
                                                                                            paymentIdResponse
                                                                                                .data
                                                                                                .binNumber
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Fraud
                                                                            Status
                                                                        </Label>
                                                                        <div className="mt-1">
                                                                            <span
                                                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                                                    paymentIdResponse
                                                                                        .data
                                                                                        .fraudStatus ===
                                                                                    1
                                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                                                }`}
                                                                            >
                                                                                {paymentIdResponse
                                                                                    .data
                                                                                    .fraudStatus ===
                                                                                1
                                                                                    ? 'Güvenli'
                                                                                    : 'Şüpheli'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {paymentIdResponse
                                                                        .data
                                                                        .authCode && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Auth
                                                                                Code
                                                                            </Label>
                                                                            <div className="mt-1 font-mono text-sm">
                                                                                {
                                                                                    paymentIdResponse
                                                                                        .data
                                                                                        .authCode
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {paymentIdResponse
                                                                        .data
                                                                        .connectorName && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Connector
                                                                            </Label>
                                                                            <div className="mt-1 text-sm">
                                                                                {
                                                                                    paymentIdResponse
                                                                                        .data
                                                                                        .connectorName
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Sistem
                                                                            Zamanı
                                                                        </Label>
                                                                        <div className="mt-1 text-sm">
                                                                            {formatDate(
                                                                                paymentIdResponse
                                                                                    .data
                                                                                    .systemTime,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {paymentIdResponse
                                                                .data
                                                                .paymentItems &&
                                                                paymentIdResponse
                                                                    .data
                                                                    .paymentItems
                                                                    .length >
                                                                    0 && (
                                                                    <div className="mt-4">
                                                                        <Label className="mb-2 block text-sm font-semibold">
                                                                            Ödeme
                                                                            Kalemleri
                                                                        </Label>
                                                                        <div className="space-y-2">
                                                                            {paymentIdResponse.data.paymentItems.map(
                                                                                (
                                                                                    item,
                                                                                    index,
                                                                                ) => (
                                                                                    <Card
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="border-slate-200 dark:border-slate-700"
                                                                                    >
                                                                                        <CardContent className="pt-4">
                                                                                            <div className="grid gap-2 text-sm md:grid-cols-3">
                                                                                                <div>
                                                                                                    <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        Item
                                                                                                        ID
                                                                                                    </Label>
                                                                                                    <div className="mt-1 font-mono">
                                                                                                        {
                                                                                                            item.itemId
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        Transaction
                                                                                                        Status
                                                                                                    </Label>
                                                                                                    <div className="mt-1">
                                                                                                        <span
                                                                                                            className={`rounded px-2 py-1 text-xs font-medium ${
                                                                                                                item.transactionStatus ===
                                                                                                                'SUCCESS'
                                                                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                                                                            }`}
                                                                                                        >
                                                                                                            {
                                                                                                                item.transactionStatus
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        Tutar
                                                                                                    </Label>
                                                                                                    <div className="mt-1 font-semibold">
                                                                                                        {formatCurrency(
                                                                                                            item.paidPrice,
                                                                                                            paymentIdResponse
                                                                                                                .data
                                                                                                                .currency,
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </AlertDescription>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {paymentIdResponse.message ||
                                                            'Ödeme sorgulanamadı'}
                                                    </AlertDescription>
                                                </>
                                            )}
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="conversation-id">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                        <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <CardTitle>
                                            Payment Conversation ID ile Sorgula
                                        </CardTitle>
                                        <CardDescription>
                                            Payment Conversation ID kullanarak
                                            ödeme bilgilerini sorgulayın
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <form onSubmit={handleConversationIdSearch}>
                                        <div className="grid items-end gap-4 md:grid-cols-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="payment-conversation-id">
                                                    Payment Conversation ID *
                                                </Label>
                                                <Input
                                                    id="payment-conversation-id"
                                                    type="text"
                                                    placeholder="payment_conv_123456789"
                                                    required
                                                    value={
                                                        conversationIdForm.paymentConversationId
                                                    }
                                                    onChange={(e) =>
                                                        setConversationIdForm({
                                                            ...conversationIdForm,
                                                            paymentConversationId:
                                                                e.target.value,
                                                        })
                                                    }
                                                    disabled={
                                                        loadingConversationId
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="conversation-id-2">
                                                    Conversation ID (Opsiyonel)
                                                </Label>
                                                <Input
                                                    id="conversation-id-2"
                                                    type="text"
                                                    placeholder="conv_123"
                                                    value={
                                                        conversationIdForm.conversationId
                                                    }
                                                    onChange={(e) =>
                                                        setConversationIdForm({
                                                            ...conversationIdForm,
                                                            conversationId:
                                                                e.target.value,
                                                        })
                                                    }
                                                    disabled={
                                                        loadingConversationId
                                                    }
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    loadingConversationId ||
                                                    !conversationIdForm.paymentConversationId
                                                }
                                                className="h-10 w-full"
                                            >
                                                {loadingConversationId ? (
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

                                    {conversationIdResponse && (
                                        <Alert
                                            variant={
                                                conversationIdResponse.success
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                        >
                                            {conversationIdResponse.success &&
                                            conversationIdResponse.data ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <div className="mt-2 space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-semibold">
                                                                    Ödeme
                                                                    Bilgileri
                                                                </span>
                                                                <span
                                                                    className={`rounded px-2 py-1 text-xs font-medium ${
                                                                        conversationIdResponse
                                                                            .data
                                                                            .paymentStatus ===
                                                                        'SUCCESS'
                                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                                    }`}
                                                                >
                                                                    {
                                                                        conversationIdResponse
                                                                            .data
                                                                            .paymentStatus
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Payment
                                                                            ID
                                                                        </Label>
                                                                        <div className="mt-1 font-mono text-sm font-semibold">
                                                                            {
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .paymentId
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Conversation
                                                                            ID
                                                                        </Label>
                                                                        <div className="mt-1 font-mono text-sm">
                                                                            {
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .conversationId
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Basket
                                                                            ID
                                                                        </Label>
                                                                        <div className="mt-1 font-mono text-sm">
                                                                            {
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .basketId
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Fiyat
                                                                        </Label>
                                                                        <div className="mt-1 text-lg font-semibold">
                                                                            {formatCurrency(
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .price,
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .currency,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Ödenen
                                                                            Tutar
                                                                        </Label>
                                                                        <div className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                                                                            {formatCurrency(
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .paidPrice,
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .currency,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {conversationIdResponse
                                                                        .data
                                                                        .installment >
                                                                        1 && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Taksit
                                                                            </Label>
                                                                            <div className="mt-1">
                                                                                {
                                                                                    conversationIdResponse
                                                                                        .data
                                                                                        .installment
                                                                                }
                                                                                x
                                                                                Taksit
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {conversationIdResponse
                                                                        .data
                                                                        .cardType && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Kart
                                                                                Bilgileri
                                                                            </Label>
                                                                            <div className="mt-1 space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                                                                    <span>
                                                                                        {
                                                                                            conversationIdResponse
                                                                                                .data
                                                                                                .cardAssociation
                                                                                        }{' '}
                                                                                        {
                                                                                            conversationIdResponse
                                                                                                .data
                                                                                                .cardType
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                {conversationIdResponse
                                                                                    .data
                                                                                    .lastFourDigits && (
                                                                                    <div className="font-mono text-sm">
                                                                                        ****{' '}
                                                                                        {
                                                                                            conversationIdResponse
                                                                                                .data
                                                                                                .lastFourDigits
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                                {conversationIdResponse
                                                                                    .data
                                                                                    .binNumber && (
                                                                                    <div className="text-xs text-slate-500">
                                                                                        BIN:{' '}
                                                                                        {
                                                                                            conversationIdResponse
                                                                                                .data
                                                                                                .binNumber
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Fraud
                                                                            Status
                                                                        </Label>
                                                                        <div className="mt-1">
                                                                            <span
                                                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                                                    conversationIdResponse
                                                                                        .data
                                                                                        .fraudStatus ===
                                                                                    1
                                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                                                }`}
                                                                            >
                                                                                {conversationIdResponse
                                                                                    .data
                                                                                    .fraudStatus ===
                                                                                1
                                                                                    ? 'Güvenli'
                                                                                    : 'Şüpheli'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {conversationIdResponse
                                                                        .data
                                                                        .authCode && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Auth
                                                                                Code
                                                                            </Label>
                                                                            <div className="mt-1 font-mono text-sm">
                                                                                {
                                                                                    conversationIdResponse
                                                                                        .data
                                                                                        .authCode
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {conversationIdResponse
                                                                        .data
                                                                        .connectorName && (
                                                                        <div>
                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                Connector
                                                                            </Label>
                                                                            <div className="mt-1 text-sm">
                                                                                {
                                                                                    conversationIdResponse
                                                                                        .data
                                                                                        .connectorName
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                            Sistem
                                                                            Zamanı
                                                                        </Label>
                                                                        <div className="mt-1 text-sm">
                                                                            {formatDate(
                                                                                conversationIdResponse
                                                                                    .data
                                                                                    .systemTime,
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {conversationIdResponse
                                                                .data
                                                                .paymentItems &&
                                                                conversationIdResponse
                                                                    .data
                                                                    .paymentItems
                                                                    .length >
                                                                    0 && (
                                                                    <div className="mt-4">
                                                                        <Label className="mb-2 block text-sm font-semibold">
                                                                            Ödeme
                                                                            Kalemleri
                                                                        </Label>
                                                                        <div className="space-y-2">
                                                                            {conversationIdResponse.data.paymentItems.map(
                                                                                (
                                                                                    item,
                                                                                    index,
                                                                                ) => (
                                                                                    <Card
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="border-slate-200 dark:border-slate-700"
                                                                                    >
                                                                                        <CardContent className="pt-4">
                                                                                            <div className="grid gap-2 text-sm md:grid-cols-3">
                                                                                                <div>
                                                                                                    <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        Item
                                                                                                        ID
                                                                                                    </Label>
                                                                                                    <div className="mt-1 font-mono">
                                                                                                        {
                                                                                                            item.itemId
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        Transaction
                                                                                                        Status
                                                                                                    </Label>
                                                                                                    <div className="mt-1">
                                                                                                        <span
                                                                                                            className={`rounded px-2 py-1 text-xs font-medium ${
                                                                                                                item.transactionStatus ===
                                                                                                                'SUCCESS'
                                                                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                                                                            }`}
                                                                                                        >
                                                                                                            {
                                                                                                                item.transactionStatus
                                                                                                            }
                                                                                                        </span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                        Tutar
                                                                                                    </Label>
                                                                                                    <div className="mt-1 font-semibold">
                                                                                                        {formatCurrency(
                                                                                                            item.paidPrice,
                                                                                                            conversationIdResponse
                                                                                                                .data
                                                                                                                .currency,
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                ),
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </AlertDescription>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {conversationIdResponse.message ||
                                                            'Ödeme sorgulanamadı'}
                                                    </AlertDescription>
                                                </>
                                            )}
                                        </Alert>
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
