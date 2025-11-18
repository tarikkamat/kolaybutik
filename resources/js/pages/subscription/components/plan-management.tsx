import { useState, useEffect } from 'react';
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, CreditCard } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Plan {
    referenceCode: string;
    productReferenceCode: string;
    name: string;
    price: string;
    currencyCode: string;
    paymentInterval: string;
    paymentIntervalCount: number;
    trialPeriodDays: number;
    planPaymentType: string;
    recurrenceCount: number | null;
    status: string;
    createdDate: string;
}

export function PlanManagement() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [products, setProducts] = useState<Array<{ referenceCode: string; name: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        productReferenceCode: '',
        name: '',
        price: '',
        currencyCode: 'TRY',
        paymentInterval: 'MONTHLY',
        paymentIntervalCount: '1',
        trialPeriodDays: '0',
        planPaymentType: 'RECURRING',
        recurrenceCount: '',
    });

    const fetchProducts = async () => {
        try {
            const response = await fetch('/subscription/products');
            const data = await response.json();
            if (data.success) {
                setProducts(data.data.products || []);
            }
        } catch (err) {
            // Ignore
        }
    };

    const fetchPlans = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/subscription/plans');
            const data = await response.json();
            if (data.success) {
                setPlans(data.data.plans || []);
            } else {
                setError(data.errorMessage || 'Planlar yüklenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchPlans();
    }, []);

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const payload: any = {
                ...formData,
                price: parseFloat(formData.price),
                paymentIntervalCount: parseInt(formData.paymentIntervalCount),
                trialPeriodDays: parseInt(formData.trialPeriodDays),
            };

            if (formData.recurrenceCount) {
                payload.recurrenceCount = parseInt(formData.recurrenceCount);
            }

            const response = await fetch('/subscription/plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                setIsCreateDialogOpen(false);
                setFormData({
                    productReferenceCode: '',
                    name: '',
                    price: '',
                    currencyCode: 'TRY',
                    paymentInterval: 'MONTHLY',
                    paymentIntervalCount: '1',
                    trialPeriodDays: '0',
                    planPaymentType: 'RECURRING',
                    recurrenceCount: '',
                });
                fetchPlans();
            } else {
                setError(data.errorMessage || 'Plan oluşturulamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedPlan) return;

        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch('/subscription/plans', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    pricingPlanReferenceCode: selectedPlan.referenceCode,
                    name: formData.name,
                    trialPeriodDays: parseInt(formData.trialPeriodDays),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIsEditDialogOpen(false);
                setSelectedPlan(null);
                fetchPlans();
            } else {
                setError(data.errorMessage || 'Plan güncellenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (plan: Plan) => {
        if (!confirm('Bu planı silmek istediğinizden emin misiniz?')) return;

        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch('/subscription/plans', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    pricingPlanReferenceCode: plan.referenceCode,
                }),
            });

            const data = await response.json();
            if (data.success) {
                fetchPlans();
            } else {
                setError(data.errorMessage || 'Plan silinemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (plan: Plan) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/subscription/plans/${plan.referenceCode}`);
            const data = await response.json();
            if (data.success) {
                alert(
                    `Plan Detayı:\n\nReferans: ${data.data.referenceCode}\nİsim: ${data.data.name}\nFiyat: ${data.data.price} ${data.data.currencyCode}\nÖdeme Aralığı: ${data.data.paymentInterval}\nDurum: ${data.data.status}`
                );
            } else {
                setError(data.errorMessage || 'Plan detayı alınamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const openEditDialog = (plan: Plan) => {
        setSelectedPlan(plan);
        setFormData({
            ...formData,
            name: plan.name,
            trialPeriodDays: plan.trialPeriodDays.toString(),
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Plan Yönetimi
                            </CardTitle>
                            <CardDescription>
                                Ödeme planı oluşturun, güncelleyin, silin ve listeleyin
                            </CardDescription>
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Yeni Plan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Yeni Ödeme Planı Oluştur</DialogTitle>
                                    <DialogDescription>
                                        Yeni bir ödeme planı oluşturun
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="product">Ürün *</Label>
                                        <Select
                                            value={formData.productReferenceCode}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    productReferenceCode: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Ürün seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem
                                                        key={product.referenceCode}
                                                        value={product.referenceCode}
                                                    >
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="name">Plan Adı *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            placeholder="Örn: Aylık Plan"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Fiyat *</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        price: e.target.value,
                                                    })
                                                }
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="currency">Para Birimi</Label>
                                            <Select
                                                value={formData.currencyCode}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        currencyCode: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="TRY">TRY</SelectItem>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="interval">Ödeme Aralığı *</Label>
                                            <Select
                                                value={formData.paymentInterval}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        paymentInterval: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="DAILY">Günlük</SelectItem>
                                                    <SelectItem value="WEEKLY">Haftalık</SelectItem>
                                                    <SelectItem value="MONTHLY">Aylık</SelectItem>
                                                    <SelectItem value="YEARLY">Yıllık</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="intervalCount">Aralık Sayısı</Label>
                                            <Input
                                                id="intervalCount"
                                                type="number"
                                                min="1"
                                                value={formData.paymentIntervalCount}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        paymentIntervalCount: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="trialDays">Deneme Süresi (Gün)</Label>
                                            <Input
                                                id="trialDays"
                                                type="number"
                                                min="0"
                                                value={formData.trialPeriodDays}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        trialPeriodDays: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="paymentType">Ödeme Tipi</Label>
                                            <Select
                                                value={formData.planPaymentType}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        planPaymentType: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="RECURRING">
                                                        Tekrarlayan
                                                    </SelectItem>
                                                    <SelectItem value="ONE_TIME">Tek Seferlik</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="recurrenceCount">
                                            Tekrar Sayısı (Opsiyonel)
                                        </Label>
                                        <Input
                                            id="recurrenceCount"
                                            type="number"
                                            min="1"
                                            value={formData.recurrenceCount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    recurrenceCount: e.target.value,
                                                })
                                            }
                                            placeholder="Boş bırakılırsa sınırsız"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCreateDialogOpen(false)}
                                    >
                                        İptal
                                    </Button>
                                    <Button onClick={handleCreate} disabled={loading}>
                                        {loading ? <Spinner className="h-4 w-4" /> : 'Oluştur'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading && !plans.length ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner className="h-8 w-8" />
                        </div>
                    ) : plans.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            Henüz plan bulunmamaktadır.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {plans.map((plan) => (
                                <div
                                    key={plan.referenceCode}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                                >
                                    <div>
                                        <h3 className="font-semibold">{plan.name}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {plan.price} {plan.currencyCode} - {plan.paymentInterval}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Referans: {plan.referenceCode}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(plan)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(plan)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(plan)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Planı Güncelle</DialogTitle>
                        <DialogDescription>Plan bilgilerini güncelleyin</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Plan Adı *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-trialDays">Deneme Süresi (Gün)</Label>
                            <Input
                                id="edit-trialDays"
                                type="number"
                                min="0"
                                value={formData.trialPeriodDays}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        trialPeriodDays: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            İptal
                        </Button>
                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? <Spinner className="h-4 w-4" /> : 'Güncelle'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

