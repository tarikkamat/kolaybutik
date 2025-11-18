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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Edit, Eye } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Customer {
    referenceCode: string;
    name: string;
    surname: string;
    email: string;
    gsmNumber: string;
    identityNumber: string;
    city: string;
    country: string;
    zipCode: string;
    address: string;
    createdDate: string;
}

export function CustomerManagement() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        gsmNumber: '',
        identityNumber: '',
        city: '',
        country: '',
        zipCode: '',
        address: '',
    });

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/subscription/customers');
            const data = await response.json();
            if (data.success) {
                setCustomers(data.data.customers || []);
            } else {
                setError(data.errorMessage || 'Aboneler yüklenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleUpdate = async () => {
        if (!selectedCustomer) return;

        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch('/subscription/customers', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    customerReferenceCode: selectedCustomer.referenceCode,
                    ...formData,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIsEditDialogOpen(false);
                setSelectedCustomer(null);
                fetchCustomers();
            } else {
                setError(data.errorMessage || 'Abone güncellenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (customer: Customer) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/subscription/customers/${customer.referenceCode}`);
            const data = await response.json();
            if (data.success) {
                alert(
                    `Abone Detayı:\n\nReferans: ${data.data.referenceCode}\nİsim: ${data.data.name} ${data.data.surname}\nEmail: ${data.data.email}\nTelefon: ${data.data.gsmNumber}`
                );
            } else {
                setError(data.errorMessage || 'Abone detayı alınamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const openEditDialog = (customer: Customer) => {
        setSelectedCustomer(customer);
        setFormData({
            name: customer.name || '',
            surname: customer.surname || '',
            email: customer.email || '',
            gsmNumber: customer.gsmNumber || '',
            identityNumber: customer.identityNumber || '',
            city: customer.city || '',
            country: customer.country || '',
            zipCode: customer.zipCode || '',
            address: customer.address || '',
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Abone Yönetimi
                    </CardTitle>
                    <CardDescription>
                        Aboneleri görüntüleyin ve güncelleyin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading && !customers.length ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner className="h-8 w-8" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            Henüz abone bulunmamaktadır.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {customers.map((customer) => (
                                <div
                                    key={customer.referenceCode}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                                >
                                    <div>
                                        <h3 className="font-semibold">
                                            {customer.name} {customer.surname}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {customer.email}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Referans: {customer.referenceCode}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(customer)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(customer)}
                                        >
                                            <Edit className="h-4 w-4" />
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Abone Güncelle</DialogTitle>
                        <DialogDescription>
                            Abone bilgilerini güncelleyin
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">İsim</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="surname">Soyisim</Label>
                                <Input
                                    id="surname"
                                    value={formData.surname}
                                    onChange={(e) =>
                                        setFormData({ ...formData, surname: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="gsmNumber">Telefon</Label>
                            <Input
                                id="gsmNumber"
                                value={formData.gsmNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, gsmNumber: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="identityNumber">TC Kimlik No</Label>
                            <Input
                                id="identityNumber"
                                value={formData.identityNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, identityNumber: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="city">Şehir</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="country">Ülke</Label>
                                <Input
                                    id="country"
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData({ ...formData, country: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="zipCode">Posta Kodu</Label>
                                <Input
                                    id="zipCode"
                                    value={formData.zipCode}
                                    onChange={(e) =>
                                        setFormData({ ...formData, zipCode: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="address">Adres</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
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

