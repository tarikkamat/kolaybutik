import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCsrfToken } from '@/lib/csrf';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CheckCircle2,
    Copy,
    Info,
    List,
    Loader2,
    Plus,
    Trash2,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface TestCard {
    cardNumber: string;
    bank: string;
    cardAssociation: string;
    cardType: string;
}

const TEST_CARDS: TestCard[] = [
    {
        cardNumber: '5890040000000016',
        bank: 'Akbank',
        cardAssociation: 'Master Card',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '5526080000000006',
        bank: 'Akbank',
        cardAssociation: 'Master Card',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '9792072000017956',
        bank: 'Akbank',
        cardAssociation: 'Troy',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '4766620000000001',
        bank: 'Denizbank',
        cardAssociation: 'Visa',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '4603450000000000',
        bank: 'Denizbank',
        cardAssociation: 'Visa',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '9792023757123604',
        bank: 'QNB',
        cardAssociation: 'Troy',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '4987490000000002',
        bank: 'QNB',
        cardAssociation: 'Visa',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '5311570000000005',
        bank: 'QNB',
        cardAssociation: 'Master Card',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '9792020000000001',
        bank: 'QNB',
        cardAssociation: 'Troy',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '9792030000000000',
        bank: 'QNB',
        cardAssociation: 'Troy',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '5170410000000004',
        bank: 'Garanti Bankası',
        cardAssociation: 'Master Card',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '5400360000000003',
        bank: 'Garanti Bankası',
        cardAssociation: 'Master Card',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '374427000000003',
        bank: 'Garanti Bankası',
        cardAssociation: 'American Express',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '4475050000000003',
        bank: 'Halkbank',
        cardAssociation: 'Visa',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '5528790000000008',
        bank: 'Halkbank',
        cardAssociation: 'Master Card',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '4059030000000009',
        bank: 'HSBC Bank',
        cardAssociation: 'Visa',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '5504720000000003',
        bank: 'HSBC Bank',
        cardAssociation: 'Master Card',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '5892830000000000',
        bank: 'Türkiye İş Bankası',
        cardAssociation: 'Master Card',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '4543590000000006',
        bank: 'Türkiye İş Bankası',
        cardAssociation: 'Visa',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '4910050000000006',
        bank: 'Vakıfbank',
        cardAssociation: 'Visa',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '4157920000000002',
        bank: 'Vakıfbank',
        cardAssociation: 'Visa',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '6500528865390837',
        bank: 'Vakıfbank',
        cardAssociation: 'Troy',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '6501700194147183',
        bank: 'Vakıfbank',
        cardAssociation: 'Troy',
        cardType: 'Kredi Kartı (Credit)',
    },
    {
        cardNumber: '5168880000000002',
        bank: 'Yapı ve Kredi Bankası',
        cardAssociation: 'Master Card',
        cardType: 'Banka Kartı (Debit)',
    },
    {
        cardNumber: '5451030000000000',
        bank: 'Yapı ve Kredi Bankası',
        cardAssociation: 'Master Card',
        cardType: 'Kredi Kartı (Credit)',
    },
];

interface CardData {
    cardToken: string;
    cardAlias: string;
    binNumber: string;
    lastFourDigits: string;
    cardType: string;
    cardAssociation: string;
    cardFamily: string;
    cardBankCode: string;
    cardBankName: string;
}

interface CreateCardResponse {
    success: boolean;
    data?: {
        status: string;
        cardUserKey: string;
        cardToken: string;
        cardAlias: string;
        binNumber: string;
        lastFourDigits: string;
        cardType: string;
        cardAssociation: string;
        cardFamily: string;
        cardBankCode: string;
        cardBankName: string;
    };
    message?: string;
}

interface RetrieveCardsResponse {
    success: boolean;
    data?: {
        status: string;
        cardUserKey: string;
        cards: CardData[];
    };
    message?: string;
}

export default function CardStorageIndex() {
    const [createCardResponse, setCreateCardResponse] =
        useState<CreateCardResponse | null>(null);
    const [retrieveCardsResponse, setRetrieveCardsResponse] =
        useState<RetrieveCardsResponse | null>(null);
    const [deleteCardResponse, setDeleteCardResponse] = useState<{
        success: boolean;
        message?: string;
    } | null>(null);
    const [copiedCard, setCopiedCard] = useState<string | null>(null);
    const [testCardsDialogOpen, setTestCardsDialogOpen] = useState(false);

    const createCardForm = useForm({
        email: '',
        externalId: '',
        cardUserKey: '',
        cardHolderName: '',
        cardNumber: '',
        expireMonth: '',
        expireYear: '',
        cardAlias: '',
        conversationId: '',
    });

    const retrieveCardsForm = useForm({
        cardUserKey: '',
    });

    const deleteCardForm = useForm({
        cardToken: '',
        cardUserKey: '',
    });

    const handleCreateCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateCardResponse(null);

        try {
            const response = await fetch('/services/card-storage/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(createCardForm.data),
            });

            const data = await response.json();
            setCreateCardResponse(data);

            if (data.success && data.data) {
                createCardForm.reset();
                // cardUserKey'i retrieve form'una otomatik doldur
                retrieveCardsForm.setData('cardUserKey', data.data.cardUserKey);
            }
        } catch (error) {
            setCreateCardResponse({
                success: false,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };

    const handleRetrieveCards = async (e: React.FormEvent) => {
        e.preventDefault();
        setRetrieveCardsResponse(null);

        try {
            const response = await fetch('/services/card-storage/retrieve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(retrieveCardsForm.data),
            });

            const data = await response.json();
            setRetrieveCardsResponse(data);
        } catch (error) {
            setRetrieveCardsResponse({
                success: false,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };

    const handleDeleteCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteCardResponse(null);

        try {
            const response = await fetch('/services/card-storage/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(deleteCardForm.data),
            });

            const data = await response.json();
            setDeleteCardResponse(data);

            if (data.success) {
                deleteCardForm.reset();
            }
        } catch (error) {
            setDeleteCardResponse({
                success: false,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };

    const copyToClipboard = (text: string, cardNumber: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCard(cardNumber);
        setTimeout(() => setCopiedCard(null), 2000);
    };

    const fillTestCard = (card: TestCard) => {
        createCardForm.setData('cardNumber', card.cardNumber);
        createCardForm.setData('cardHolderName', 'Test Kullanıcı');
        createCardForm.setData('expireMonth', '12');
        createCardForm.setData('expireYear', '2030');
        createCardForm.setData(
            'cardAlias',
            `${card.bank} ${card.cardAssociation}`,
        );
        setTestCardsDialogOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Kart Saklama" />

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
                        <Wallet className="h-8 w-8 text-pink-600" />
                        Kart Saklama
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Müşteri kartlarını saklayın, listeleyin ve yönetin
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="create" className="w-full">
                    <TabsList className="mb-0 grid h-auto w-full grid-cols-3 p-1">
                        <TabsTrigger
                            value="create"
                            className="h-auto min-h-[44px] py-3"
                        >
                            Kart Oluştur
                        </TabsTrigger>
                        <TabsTrigger
                            value="list"
                            className="h-auto min-h-[44px] py-3"
                        >
                            Kartları Listele
                        </TabsTrigger>
                        <TabsTrigger
                            value="delete"
                            className="h-auto min-h-[44px] py-3"
                        >
                            Kart Sil
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-900/20">
                                            <Plus className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div>
                                            <CardTitle>Kart Oluştur</CardTitle>
                                            <CardDescription>
                                                Yeni bir kart kaydedin
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Dialog
                                        open={testCardsDialogOpen}
                                        onOpenChange={setTestCardsDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Info className="mr-2 h-4 w-4" />
                                                Test Kartları
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Test Kartları
                                                </DialogTitle>
                                                <DialogDescription>
                                                    iyzico test ortamında
                                                    kullanabileceğiniz test
                                                    kartları. Kart numarasına
                                                    tıklayarak kopyalayabilir
                                                    veya "Kullan" butonuna
                                                    tıklayarak formu
                                                    doldurabilirsiniz.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="mt-4">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="p-2 text-left font-semibold">
                                                                    Kart
                                                                    Numarası
                                                                </th>
                                                                <th className="p-2 text-left font-semibold">
                                                                    Banka
                                                                </th>
                                                                <th className="p-2 text-left font-semibold">
                                                                    Kart Ağı
                                                                </th>
                                                                <th className="p-2 text-left font-semibold">
                                                                    Kart Tipi
                                                                </th>
                                                                <th className="p-2 text-left font-semibold">
                                                                    İşlem
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {TEST_CARDS.map(
                                                                (
                                                                    card,
                                                                    index,
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                                                                    >
                                                                        <td className="p-2">
                                                                            <div className="flex items-center gap-2">
                                                                                <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-800">
                                                                                    {
                                                                                        card.cardNumber
                                                                                    }
                                                                                </code>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        copyToClipboard(
                                                                                            card.cardNumber,
                                                                                            card.cardNumber,
                                                                                        )
                                                                                    }
                                                                                    className="rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                                                >
                                                                                    {copiedCard ===
                                                                                    card.cardNumber ? (
                                                                                        <Check className="h-4 w-4 text-green-600" />
                                                                                    ) : (
                                                                                        <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {
                                                                                card.bank
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {
                                                                                card.cardAssociation
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {
                                                                                card.cardType
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() =>
                                                                                    fillTestCard(
                                                                                        card,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Kullan
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <form onSubmit={handleCreateCard}>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    E-posta (Yeni kullanıcı
                                                    için)
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="user@example.com"
                                                    value={
                                                        createCardForm.data
                                                            .email
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="externalId">
                                                    External ID (Opsiyonel)
                                                </Label>
                                                <Input
                                                    id="externalId"
                                                    type="text"
                                                    placeholder="user_123"
                                                    value={
                                                        createCardForm.data
                                                            .externalId
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'externalId',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardUserKey">
                                                    Card User Key (Mevcut
                                                    kullanıcı için)
                                                </Label>
                                                <Input
                                                    id="cardUserKey"
                                                    type="text"
                                                    placeholder="Mevcut kullanıcının cardUserKey'i"
                                                    value={
                                                        createCardForm.data
                                                            .cardUserKey
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'cardUserKey',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardAlias">
                                                    Kart Adı (Opsiyonel)
                                                </Label>
                                                <Input
                                                    id="cardAlias"
                                                    type="text"
                                                    placeholder="Ana Kartım"
                                                    value={
                                                        createCardForm.data
                                                            .cardAlias
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'cardAlias',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardHolderName">
                                                    Kart Sahibi Adı *
                                                </Label>
                                                <Input
                                                    id="cardHolderName"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    required
                                                    value={
                                                        createCardForm.data
                                                            .cardHolderName
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'cardHolderName',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cardNumber">
                                                    Kart Numarası *
                                                </Label>
                                                <Input
                                                    id="cardNumber"
                                                    type="text"
                                                    placeholder="5528790000000008"
                                                    maxLength={19}
                                                    required
                                                    value={
                                                        createCardForm.data
                                                            .cardNumber
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'cardNumber',
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                '',
                                                            ),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="expireMonth">
                                                    Son Kullanma Ayı *
                                                </Label>
                                                <Input
                                                    id="expireMonth"
                                                    type="text"
                                                    placeholder="12"
                                                    maxLength={2}
                                                    required
                                                    value={
                                                        createCardForm.data
                                                            .expireMonth
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'expireMonth',
                                                            e.target.value
                                                                .replace(
                                                                    /\D/g,
                                                                    '',
                                                                )
                                                                .slice(0, 2),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="expireYear">
                                                    Son Kullanma Yılı *
                                                </Label>
                                                <Input
                                                    id="expireYear"
                                                    type="text"
                                                    placeholder="2030"
                                                    maxLength={4}
                                                    required
                                                    value={
                                                        createCardForm.data
                                                            .expireYear
                                                    }
                                                    onChange={(e) =>
                                                        createCardForm.setData(
                                                            'expireYear',
                                                            e.target.value
                                                                .replace(
                                                                    /\D/g,
                                                                    '',
                                                                )
                                                                .slice(0, 4),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    !createCardForm.data
                                                        .cardHolderName ||
                                                    !createCardForm.data
                                                        .cardNumber ||
                                                    !createCardForm.data
                                                        .expireMonth ||
                                                    !createCardForm.data
                                                        .expireYear
                                                }
                                                className="w-full"
                                            >
                                                {createCardForm.processing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Kaydediliyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Kart Oluştur
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>

                                    {createCardResponse && (
                                        <Alert
                                            variant={
                                                createCardResponse.success
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                        >
                                            {createCardResponse.success ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <AlertDescription>
                                                        <div className="space-y-2">
                                                            <p className="font-semibold">
                                                                Kart başarıyla
                                                                oluşturuldu!
                                                            </p>
                                                            {createCardResponse.data && (
                                                                <div className="mt-2 space-y-1 text-sm">
                                                                    <p>
                                                                        <strong>
                                                                            Card
                                                                            User
                                                                            Key:
                                                                        </strong>{' '}
                                                                        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                                                                            {
                                                                                createCardResponse
                                                                                    .data
                                                                                    .cardUserKey
                                                                            }
                                                                        </code>
                                                                    </p>
                                                                    <p>
                                                                        <strong>
                                                                            Card
                                                                            Token:
                                                                        </strong>{' '}
                                                                        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                                                                            {
                                                                                createCardResponse
                                                                                    .data
                                                                                    .cardToken
                                                                            }
                                                                        </code>
                                                                    </p>
                                                                    <p>
                                                                        <strong>
                                                                            Kart
                                                                            Adı:
                                                                        </strong>{' '}
                                                                        {
                                                                            createCardResponse
                                                                                .data
                                                                                .cardAlias
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <strong>
                                                                            Son
                                                                            4
                                                                            Hane:
                                                                        </strong>{' '}
                                                                        {
                                                                            createCardResponse
                                                                                .data
                                                                                .lastFourDigits
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <strong>
                                                                            Banka:
                                                                        </strong>{' '}
                                                                        {
                                                                            createCardResponse
                                                                                .data
                                                                                .cardBankName
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <strong>
                                                                            Kart
                                                                            Tipi:
                                                                        </strong>{' '}
                                                                        {
                                                                            createCardResponse
                                                                                .data
                                                                                .cardType
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </AlertDescription>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {createCardResponse.message ||
                                                            'Kart oluşturulamadı'}
                                                    </AlertDescription>
                                                </>
                                            )}
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="list">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-900/20">
                                        <List className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <CardTitle>Kartları Listele</CardTitle>
                                        <CardDescription>
                                            Müşteri kartlarını listeleyin
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <form onSubmit={handleRetrieveCards}>
                                        <div className="grid items-end gap-4 md:grid-cols-4">
                                            <div className="space-y-2 md:col-span-3">
                                                <Label htmlFor="retrieve-cardUserKey">
                                                    Card User Key *
                                                </Label>
                                                <Input
                                                    id="retrieve-cardUserKey"
                                                    type="text"
                                                    placeholder="Kullanıcının cardUserKey'i"
                                                    required
                                                    value={
                                                        retrieveCardsForm.data
                                                            .cardUserKey
                                                    }
                                                    onChange={(e) =>
                                                        retrieveCardsForm.setData(
                                                            'cardUserKey',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    !retrieveCardsForm.data
                                                        .cardUserKey
                                                }
                                                className="h-10 w-full"
                                            >
                                                {retrieveCardsForm.processing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Yükleniyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <List className="mr-2 h-4 w-4" />
                                                        Listele
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>

                                    {retrieveCardsResponse && (
                                        <Alert
                                            variant={
                                                retrieveCardsResponse.success
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                        >
                                            {retrieveCardsResponse.success ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {retrieveCardsResponse.data &&
                                                        retrieveCardsResponse
                                                            .data.cards.length >
                                                            0 ? (
                                                            <div className="mt-2 space-y-4">
                                                                <p className="font-semibold">
                                                                    {
                                                                        retrieveCardsResponse
                                                                            .data
                                                                            .cards
                                                                            .length
                                                                    }{' '}
                                                                    kart bulundu
                                                                </p>
                                                                <div className="grid gap-4">
                                                                    {retrieveCardsResponse.data.cards.map(
                                                                        (
                                                                            card,
                                                                            index,
                                                                        ) => (
                                                                            <Card
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="border-pink-200 dark:border-pink-800"
                                                                            >
                                                                                <CardHeader className="pb-3">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div>
                                                                                            <CardTitle className="text-lg">
                                                                                                {
                                                                                                    card.cardAlias
                                                                                                }
                                                                                            </CardTitle>
                                                                                            <CardDescription className="mt-1">
                                                                                                {
                                                                                                    card.cardBankName
                                                                                                }{' '}
                                                                                                -{' '}
                                                                                                {
                                                                                                    card.cardAssociation
                                                                                                }
                                                                                            </CardDescription>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                            <div className="font-mono text-sm text-slate-600 dark:text-slate-400">
                                                                                                ****{' '}
                                                                                                {
                                                                                                    card.lastFourDigits
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </CardHeader>
                                                                                <CardContent>
                                                                                    <div className="grid gap-2 text-sm md:grid-cols-2">
                                                                                        <div>
                                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                Card
                                                                                                Token
                                                                                            </Label>
                                                                                            <div className="mt-1 rounded bg-slate-100 px-2 py-1 font-mono text-xs break-all dark:bg-slate-800">
                                                                                                {
                                                                                                    card.cardToken
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                BIN
                                                                                            </Label>
                                                                                            <div className="mt-1 font-mono">
                                                                                                {
                                                                                                    card.binNumber
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                Kart
                                                                                                Tipi
                                                                                            </Label>
                                                                                            <div className="mt-1">
                                                                                                {
                                                                                                    card.cardType
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="text-xs text-slate-500 dark:text-slate-400">
                                                                                                Kart
                                                                                                Ailesi
                                                                                            </Label>
                                                                                            <div className="mt-1">
                                                                                                {
                                                                                                    card.cardFamily
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p>
                                                                Bu kullanıcıya
                                                                ait kayıtlı kart
                                                                bulunamadı.
                                                            </p>
                                                        )}
                                                    </AlertDescription>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {retrieveCardsResponse.message ||
                                                            'Kartlar getirilemedi'}
                                                    </AlertDescription>
                                                </>
                                            )}
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="delete">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-900/20">
                                        <Trash2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                                    </div>
                                    <div>
                                        <CardTitle>Kart Sil</CardTitle>
                                        <CardDescription>
                                            Kayıtlı bir kartı silin
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <form onSubmit={handleDeleteCard}>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="delete-cardUserKey">
                                                    Card User Key *
                                                </Label>
                                                <Input
                                                    id="delete-cardUserKey"
                                                    type="text"
                                                    placeholder="Kullanıcının cardUserKey'i"
                                                    required
                                                    value={
                                                        deleteCardForm.data
                                                            .cardUserKey
                                                    }
                                                    onChange={(e) =>
                                                        deleteCardForm.setData(
                                                            'cardUserKey',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="delete-cardToken">
                                                    Card Token *
                                                </Label>
                                                <Input
                                                    id="delete-cardToken"
                                                    type="text"
                                                    placeholder="Silinecek kartın token'ı"
                                                    required
                                                    value={
                                                        deleteCardForm.data
                                                            .cardToken
                                                    }
                                                    onChange={(e) =>
                                                        deleteCardForm.setData(
                                                            'cardToken',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                disabled={
                                                    !deleteCardForm.data
                                                        .cardUserKey ||
                                                    !deleteCardForm.data
                                                        .cardToken
                                                }
                                                className="w-full"
                                            >
                                                {deleteCardForm.processing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Siliniyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Kartı Sil
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>

                                    {deleteCardResponse && (
                                        <Alert
                                            variant={
                                                deleteCardResponse.success
                                                    ? 'default'
                                                    : 'destructive'
                                            }
                                        >
                                            {deleteCardResponse.success ? (
                                                <>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <AlertDescription>
                                                        Kart başarıyla silindi!
                                                    </AlertDescription>
                                                </>
                                            ) : (
                                                <>
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {deleteCardResponse.message ||
                                                            'Kart silinemedi'}
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
