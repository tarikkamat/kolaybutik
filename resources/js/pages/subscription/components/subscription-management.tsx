import { useState, useEffect } from 'react';
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
import { Repeat, Search, Eye, X, ArrowUp, RefreshCw, CreditCard } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [plans, setPlans] = useState<Array<{ referenceCode: string; name: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState({
        subscriptionReferenceCode: '',
        customerReferenceCode: '',
        pricingPlanReferenceCode: '',
        subscriptionStatus: '',
    });
    const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
    const [isCardUpdateDialogOpen, setIsCardUpdateDialogOpen] = useState(false);
    const [cardData, setCardData] = useState({
        cardHolderName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
    });
    const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
    const [upgradeData, setUpgradeData] = useState({
        newPricingPlanReferenceCode: '',
        upgradePeriod: 'NOW',
    });

    const fetchPlans = async () => {
        try {
            const response = await fetch('/subscription/plans');
            const data = await response.json();
            if (data.success) {
                setPlans(data.data.plans || []);
            }
        } catch (err) {
            // Ignore
        }
    };

    const searchSubscriptions = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await fetch(`/subscription/subscriptions?${params.toString()}`);
            const data = await response.json();
            if (data.success) {
                setSubscriptions(data.data.subscriptions || []);
            } else {
                setError(data.errorMessage || 'Abonelikler bulunamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
        searchSubscriptions();
    }, []);

    const handleAction = async (action: string, subscriptionReferenceCode: string, data?: any) => {
        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            let url = '';
            let method = 'POST';
            let body: any = { subscriptionReferenceCode };

            switch (action) {
                case 'activate':
                    url = '/subscription/subscriptions/activate';
                    break;
                case 'retry':
                    url = '/subscription/subscriptions/retry';
                    break;
                case 'cancel':
                    url = '/subscription/subscriptions/cancel';
                    break;
                case 'upgrade':
                    url = '/subscription/subscriptions/upgrade';
                    body = { ...body, ...data };
                    break;
                case 'updateCard':
                    url = '/subscription/subscriptions/card';
                    method = 'PUT';
                    body = { ...body, ...data };
                    break;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            if (result.success) {
                if (action === 'updateCard') setIsCardUpdateDialogOpen(false);
                if (action === 'upgrade') setIsUpgradeDialogOpen(false);
                searchSubscriptions();
            } else {
                setError(result.errorMessage || 'İşlem başarısız');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (subscription: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `/subscription/subscriptions/${subscription.referenceCode}`
            );
            const data = await response.json();
            if (data.success) {
                alert(
                    `Abonelik Detayı:\n\nReferans: ${data.data.referenceCode}\nDurum: ${data.data.subscriptionStatus}\nBaşlangıç: ${data.data.startDate}\nBitiş: ${data.data.endDate}`
                );
            } else {
                setError(data.errorMessage || 'Abonelik detayı alınamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Repeat className="h-5 w-5" />
                        Abonelik Yönetimi
                    </CardTitle>
                    <CardDescription>
                        Abonelikleri arayın, yönetin ve işlem yapın
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Abonelik Referansı</Label>
                                <Input
                                    value={searchParams.subscriptionReferenceCode}
                                    onChange={(e) =>
                                        setSearchParams({
                                            ...searchParams,
                                            subscriptionReferenceCode: e.target.value,
                                        })
                                    }
                                    placeholder="Abonelik referans kodu"
                                />
                            </div>
                            <div>
                                <Label>Müşteri Referansı</Label>
                                <Input
                                    value={searchParams.customerReferenceCode}
                                    onChange={(e) =>
                                        setSearchParams({
                                            ...searchParams,
                                            customerReferenceCode: e.target.value,
                                        })
                                    }
                                    placeholder="Müşteri referans kodu"
                                />
                            </div>
                            <div>
                                <Label>Plan Referansı</Label>
                                <Input
                                    value={searchParams.pricingPlanReferenceCode}
                                    onChange={(e) =>
                                        setSearchParams({
                                            ...searchParams,
                                            pricingPlanReferenceCode: e.target.value,
                                        })
                                    }
                                    placeholder="Plan referans kodu"
                                />
                            </div>
                            <div>
                                <Label>Durum</Label>
                                <Select
                                    value={searchParams.subscriptionStatus}
                                    onValueChange={(value) =>
                                        setSearchParams({
                                            ...searchParams,
                                            subscriptionStatus: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tümü" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Tümü</SelectItem>
                                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                                        <SelectItem value="PENDING">Beklemede</SelectItem>
                                        <SelectItem value="CANCELED">İptal Edildi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={searchSubscriptions} disabled={loading}>
                            <Search className="h-4 w-4 mr-2" />
                            Ara
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading && !subscriptions.length ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner className="h-8 w-8" />
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            Abonelik bulunamadı.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {subscriptions.map((subscription) => (
                                <div
                                    key={subscription.referenceCode}
                                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                {subscription.referenceCode}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Durum: {subscription.subscriptionStatus}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Başlangıç: {subscription.startDate}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleView(subscription)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {subscription.subscriptionStatus === 'PENDING' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleAction(
                                                            'activate',
                                                            subscription.referenceCode
                                                        )
                                                    }
                                                >
                                                    Aktifleştir
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSubscription(subscription);
                                                    setIsUpgradeDialogOpen(true);
                                                }}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleAction(
                                                        'retry',
                                                        subscription.referenceCode
                                                    )
                                                }
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSubscription(subscription);
                                                    setIsCardUpdateDialogOpen(true);
                                                }}
                                            >
                                                <CreditCard className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleAction(
                                                        'cancel',
                                                        subscription.referenceCode
                                                    )
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Card Update Dialog */}
            <Dialog open={isCardUpdateDialogOpen} onOpenChange={setIsCardUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kart Güncelle</DialogTitle>
                        <DialogDescription>
                            Abonelik kart bilgilerini güncelleyin
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Kart Sahibi</Label>
                            <Input
                                value={cardData.cardHolderName}
                                onChange={(e) =>
                                    setCardData({ ...cardData, cardHolderName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>Kart Numarası</Label>
                            <Input
                                value={cardData.cardNumber}
                                onChange={(e) =>
                                    setCardData({ ...cardData, cardNumber: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Son Kullanma (MM/YY)</Label>
                                <Input
                                    value={cardData.cardExpiry}
                                    onChange={(e) =>
                                        setCardData({ ...cardData, cardExpiry: e.target.value })
                                    }
                                    placeholder="12/25"
                                />
                            </div>
                            <div>
                                <Label>CVV</Label>
                                <Input
                                    value={cardData.cardCvc}
                                    onChange={(e) =>
                                        setCardData({ ...cardData, cardCvc: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCardUpdateDialogOpen(false)}
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={() =>
                                handleAction('updateCard', selectedSubscription?.referenceCode, {
                                    ...cardData,
                                })
                            }
                            disabled={loading}
                        >
                            {loading ? <Spinner className="h-4 w-4" /> : 'Güncelle'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upgrade Dialog */}
            <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Aboneliği Yükselt</DialogTitle>
                        <DialogDescription>
                            Aboneliği yeni bir plana yükseltin
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Yeni Plan</Label>
                            <Select
                                value={upgradeData.newPricingPlanReferenceCode}
                                onValueChange={(value) =>
                                    setUpgradeData({
                                        ...upgradeData,
                                        newPricingPlanReferenceCode: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Plan seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {plans.map((plan) => (
                                        <SelectItem key={plan.referenceCode} value={plan.referenceCode}>
                                            {plan.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Yükseltme Zamanı</Label>
                            <Select
                                value={upgradeData.upgradePeriod}
                                onValueChange={(value) =>
                                    setUpgradeData({ ...upgradeData, upgradePeriod: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NOW">Hemen</SelectItem>
                                    <SelectItem value="NEXT_PERIOD">Sonraki Dönem</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsUpgradeDialogOpen(false)}
                        >
                            İptal
                        </Button>
                        <Button
                            onClick={() =>
                                handleAction('upgrade', selectedSubscription?.referenceCode, {
                                    ...upgradeData,
                                })
                            }
                            disabled={loading}
                        >
                            {loading ? <Spinner className="h-4 w-4" /> : 'Yükselt'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

