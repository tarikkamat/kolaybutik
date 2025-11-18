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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Product {
    referenceCode: string;
    name: string;
    description: string;
    status: string;
    createdDate: string;
}

export function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/subscription/products');
            const data = await response.json();
            if (data.success) {
                setProducts(data.data.products || []);
            } else {
                setError(data.errorMessage || 'Ürünler yüklenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch('/subscription/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                setIsCreateDialogOpen(false);
                setFormData({ name: '', description: '' });
                fetchProducts();
            } else {
                setError(data.errorMessage || 'Ürün oluşturulamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedProduct) return;

        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch('/subscription/products', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    productReferenceCode: selectedProduct.referenceCode,
                    ...formData,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIsEditDialogOpen(false);
                setSelectedProduct(null);
                setFormData({ name: '', description: '' });
                fetchProducts();
            } else {
                setError(data.errorMessage || 'Ürün güncellenemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (product: Product) => {
        if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

        setLoading(true);
        setError(null);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '';

            const response = await fetch('/subscription/products', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    productReferenceCode: product.referenceCode,
                }),
            });

            const data = await response.json();
            if (data.success) {
                fetchProducts();
            } else {
                setError(data.errorMessage || 'Ürün silinemedi');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (product: Product) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/subscription/products/${product.referenceCode}`);
            const data = await response.json();
            if (data.success) {
                alert(`Ürün Detayı:\n\nReferans: ${data.data.referenceCode}\nİsim: ${data.data.name}\nAçıklama: ${data.data.description}\nDurum: ${data.data.status}`);
            } else {
                setError(data.errorMessage || 'Ürün detayı alınamadı');
            }
        } catch (err) {
            setError('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const openEditDialog = (product: Product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
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
                                <Package className="h-5 w-5" />
                                Ürün Yönetimi
                            </CardTitle>
                            <CardDescription>
                                Ürün oluşturun, güncelleyin, silin ve listeleyin
                            </CardDescription>
                        </div>
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Yeni Ürün
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
                                    <DialogDescription>
                                        Yeni bir abonelik ürünü oluşturun
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Ürün Adı *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            placeholder="Örn: Premium Abonelik"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Açıklama</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Ürün açıklaması"
                                            rows={4}
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

                    {loading && !products.length ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner className="h-8 w-8" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            Henüz ürün bulunmamaktadır.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {products.map((product) => (
                                <div
                                    key={product.referenceCode}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                                >
                                    <div>
                                        <h3 className="font-semibold">{product.name}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {product.description || 'Açıklama yok'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Referans: {product.referenceCode}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(product)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(product)}
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
                        <DialogTitle>Ürünü Güncelle</DialogTitle>
                        <DialogDescription>
                            Ürün bilgilerini güncelleyin
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Ürün Adı *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Açıklama</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                rows={4}
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

