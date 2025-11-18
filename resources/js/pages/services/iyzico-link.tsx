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
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
    Copy,
    Check,
    X,
    Zap,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface IyzicoLink {
    token: string;
    url: string;
    imageUrl?: string;
    iyziLinkId?: string;
    name: string;
    description?: string;
    price: string;
    currency: string;
    status: string;
    createdDate?: string;
    updatedDate?: string;
}

export default function IyzicoLinkPage() {
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<IyzicoLink[]>([]);
    const [selectedLink, setSelectedLink] = useState<IyzicoLink | null>(null);
    const [activeTab, setActiveTab] = useState<
        'create' | 'fastlink' | 'list' | 'retrieve' | 'update' | 'delete'
    >('create');
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    // Create form state
    const [createForm, setCreateForm] = useState({
        name: '',
        description: '',
        price: '',
        currency: 'TRY',
        addressIgnorable: false,
        soldLimit: '',
        installmentRequested: false,
        sourceType: 'API',
        stockEnabled: false,
        stockCount: '',
    });

    // Fastlink form state
    const [fastlinkForm, setFastlinkForm] = useState({
        description: '',
        price: '',
        currencyCode: 'TRY',
        sourceType: 'WEB',
    });

    // Retrieve form state
    const [retrieveToken, setRetrieveToken] = useState('');

    // Update form state
    const [updateForm, setUpdateForm] = useState({
        token: '',
        name: '',
        description: '',
    });

    // Delete form state
    const [deleteToken, setDeleteToken] = useState('');

    // Status update state
    const [statusUpdate, setStatusUpdate] = useState({
        token: '',
        status: 'ACTIVE' as 'ACTIVE' | 'PASSIVE',
    });

    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    // Success mesajını 5 saniye sonra otomatik olarak temizle
    useEffect(() => {
        if (result && result.status === 'success') {
            const timer = setTimeout(() => {
                setResult(null);
            }, 5000); // 5 saniye

            return () => clearTimeout(timer);
        }
    }, [result]);

    // Error mesajını 7 saniye sonra otomatik olarak temizle
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 7000); // 7 saniye

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify(createForm),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            setSelectedLink(data.data);
            // Reset form
            setCreateForm({
                name: '',
                description: '',
                price: '',
                currency: 'TRY',
                addressIgnorable: false,
                soldLimit: '',
                installmentRequested: false,
                sourceType: 'API',
                stockEnabled: false,
                stockCount: '',
            });
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFastlink = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/fastlink', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify(fastlinkForm),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            setSelectedLink(data.data);
            // Reset form
            setFastlinkForm({
                description: '',
                price: '',
                currencyCode: 'TRY',
                sourceType: 'WEB',
            });
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleRetrieve = async () => {
        if (!retrieveToken.trim()) {
            setError('Token gerekli');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/retrieve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ token: retrieveToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            setSelectedLink(data.data);
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleList = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ page: 1, count: 10 }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            setLinks(data.data?.links || []);
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!updateForm.token.trim()) {
            setError('Token gerekli');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify(updateForm),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            setSelectedLink(data.data);
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!statusUpdate.token.trim()) {
            setError('Token gerekli');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify(statusUpdate),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            // Refresh list if on list tab
            if (activeTab === 'list') {
                handleList();
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteToken.trim()) {
            setError('Token gerekli');
            return;
        }

        if (!confirm('Bu linki silmek istediğinizden emin misiniz?')) {
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/services/iyzico-link/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ token: deleteToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            setDeleteToken('');
            // Refresh list if on list tab
            if (activeTab === 'list') {
                handleList();
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(type);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="iyzico Link Yönetimi" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/services"
                        className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Servislere Geri Dön
                    </Link>
                    <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
                        iyzico Link Yönetimi
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        iyzico Link oluşturun, güncelleyin, listeleyin ve yönetin
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'create'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Plus className="mr-2 inline h-4 w-4" />
                        Link Oluştur
                    </button>
                    <button
                        onClick={() => setActiveTab('fastlink')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'fastlink'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Zap className="mr-2 inline h-4 w-4" />
                        Fastlink Oluştur
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('list');
                            handleList();
                        }}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'list'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Search className="mr-2 inline h-4 w-4" />
                        Link Listele
                    </button>
                    <button
                        onClick={() => setActiveTab('retrieve')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'retrieve'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Search className="mr-2 inline h-4 w-4" />
                        Link Detayı
                    </button>
                    <button
                        onClick={() => setActiveTab('update')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'update'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Edit className="mr-2 inline h-4 w-4" />
                        Link Güncelle
                    </button>
                    <button
                        onClick={() => setActiveTab('delete')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'delete'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Trash2 className="mr-2 inline h-4 w-4" />
                        Link Sil
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <X className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Success Result */}
                {result && result.status === 'success' && (
                    <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            {result.message || 'İşlem başarılı'}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Section */}
                    <div>
                        {activeTab === 'create' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>iyzico Link Oluştur</CardTitle>
                                    <CardDescription>
                                        Yeni bir ödeme linki oluşturun
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Link Adı *</Label>
                                        <Input
                                            id="name"
                                            value={createForm.name}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Ödeme Linki"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">
                                            Açıklama
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={createForm.description}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Link açıklaması"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Fiyat *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={createForm.price}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    price: e.target.value,
                                                })
                                            }
                                            placeholder="100.00"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Para Birimi</Label>
                                        <Select
                                            value={createForm.currency}
                                            onValueChange={(value) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    currency: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TRY">
                                                    TRY
                                                </SelectItem>
                                                <SelectItem value="USD">
                                                    USD
                                                </SelectItem>
                                                <SelectItem value="EUR">
                                                    EUR
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="addressIgnorable"
                                            checked={createForm.addressIgnorable}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    addressIgnorable: e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                        <Label htmlFor="addressIgnorable" className="cursor-pointer">
                                            Adres Gerekli Değil
                                        </Label>
                                    </div>
                                    <div>
                                        <Label htmlFor="soldLimit">Satış Limiti</Label>
                                        <Input
                                            id="soldLimit"
                                            type="number"
                                            value={createForm.soldLimit}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    soldLimit: e.target.value,
                                                })
                                            }
                                            placeholder="Boş bırakılabilir"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="installmentRequested"
                                            checked={createForm.installmentRequested}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    installmentRequested: e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                        <Label htmlFor="installmentRequested" className="cursor-pointer">
                                            Taksit İstendi
                                        </Label>
                                    </div>
                                    <div>
                                        <Label htmlFor="sourceType">Kaynak Tipi</Label>
                                        <Select
                                            value={createForm.sourceType}
                                            onValueChange={(value) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    sourceType: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="API">
                                                    API
                                                </SelectItem>
                                                <SelectItem value="WEB">
                                                    WEB
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="stockEnabled"
                                            checked={createForm.stockEnabled}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    stockEnabled: e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                        <Label htmlFor="stockEnabled" className="cursor-pointer">
                                            Stok Takibi Aktif
                                        </Label>
                                    </div>
                                    {createForm.stockEnabled && (
                                        <div>
                                            <Label htmlFor="stockCount">Stok Miktarı</Label>
                                            <Input
                                                id="stockCount"
                                                type="number"
                                                value={createForm.stockCount}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        stockCount: e.target.value,
                                                    })
                                                }
                                                placeholder="Stok miktarı"
                                            />
                                        </div>
                                    )}
                                    <Button
                                        onClick={handleCreate}
                                        disabled={loading || !createForm.name || !createForm.price}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Plus className="mr-2 h-4 w-4" />
                                        )}
                                        Link Oluştur
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'fastlink' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fastlink Oluştur</CardTitle>
                                    <CardDescription>
                                        Hızlı ödeme linki oluşturun
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="fastlink-description">
                                            Açıklama *
                                        </Label>
                                        <Textarea
                                            id="fastlink-description"
                                            value={fastlinkForm.description}
                                            onChange={(e) =>
                                                setFastlinkForm({
                                                    ...fastlinkForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Link açıklaması"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fastlink-price">
                                            Fiyat *
                                        </Label>
                                        <Input
                                            id="fastlink-price"
                                            type="number"
                                            step="0.01"
                                            value={fastlinkForm.price}
                                            onChange={(e) =>
                                                setFastlinkForm({
                                                    ...fastlinkForm,
                                                    price: e.target.value,
                                                })
                                            }
                                            placeholder="100.00"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fastlink-currencyCode">
                                            Para Birimi
                                        </Label>
                                        <Select
                                            value={fastlinkForm.currencyCode}
                                            onValueChange={(value) =>
                                                setFastlinkForm({
                                                    ...fastlinkForm,
                                                    currencyCode: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TRY">
                                                    TRY
                                                </SelectItem>
                                                <SelectItem value="USD">
                                                    USD
                                                </SelectItem>
                                                <SelectItem value="EUR">
                                                    EUR
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="fastlink-sourceType">
                                            Kaynak Tipi
                                        </Label>
                                        <Select
                                            value={fastlinkForm.sourceType}
                                            onValueChange={(value) =>
                                                setFastlinkForm({
                                                    ...fastlinkForm,
                                                    sourceType: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="WEB">
                                                    WEB
                                                </SelectItem>
                                                <SelectItem value="API">
                                                    API
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        onClick={handleCreateFastlink}
                                        disabled={
                                            loading ||
                                            !fastlinkForm.description ||
                                            !fastlinkForm.price
                                        }
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Zap className="mr-2 h-4 w-4" />
                                        )}
                                        Fastlink Oluştur
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'retrieve' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Detayı</CardTitle>
                                    <CardDescription>
                                        Token ile link detaylarını görüntüleyin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="retrieve-token">
                                            Token *
                                        </Label>
                                        <Input
                                            id="retrieve-token"
                                            value={retrieveToken}
                                            onChange={(e) =>
                                                setRetrieveToken(e.target.value)
                                            }
                                            placeholder="Link token'ı"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleRetrieve}
                                        disabled={loading || !retrieveToken.trim()}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Search className="mr-2 h-4 w-4" />
                                        )}
                                        Detayları Getir
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'update' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Güncelle</CardTitle>
                                    <CardDescription>
                                        Mevcut bir linki güncelleyin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="update-token">
                                            Token *
                                        </Label>
                                        <Input
                                            id="update-token"
                                            value={updateForm.token}
                                            onChange={(e) =>
                                                setUpdateForm({
                                                    ...updateForm,
                                                    token: e.target.value,
                                                })
                                            }
                                            placeholder="Link token'ı"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="update-name">
                                            Yeni Link Adı
                                        </Label>
                                        <Input
                                            id="update-name"
                                            value={updateForm.name}
                                            onChange={(e) =>
                                                setUpdateForm({
                                                    ...updateForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Yeni link adı"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="update-description">
                                            Yeni Açıklama
                                        </Label>
                                        <Textarea
                                            id="update-description"
                                            value={updateForm.description}
                                            onChange={(e) =>
                                                setUpdateForm({
                                                    ...updateForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Yeni açıklama"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleUpdate}
                                        disabled={loading || !updateForm.token.trim()}
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Edit className="mr-2 h-4 w-4" />
                                        )}
                                        Link Güncelle
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'delete' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Sil</CardTitle>
                                    <CardDescription>
                                        Bir linki silin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="delete-token">
                                            Token *
                                        </Label>
                                        <Input
                                            id="delete-token"
                                            value={deleteToken}
                                            onChange={(e) =>
                                                setDeleteToken(e.target.value)
                                            }
                                            placeholder="Link token'ı"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleDelete}
                                        disabled={loading || !deleteToken.trim()}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Trash2 className="mr-2 h-4 w-4" />
                                        )}
                                        Link Sil
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status Update Card */}
                        {activeTab === 'list' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Durum Güncelle</CardTitle>
                                    <CardDescription>
                                        Link durumunu aktif/pasif yapın
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="status-token">
                                            Token *
                                        </Label>
                                        <Input
                                            id="status-token"
                                            value={statusUpdate.token}
                                            onChange={(e) =>
                                                setStatusUpdate({
                                                    ...statusUpdate,
                                                    token: e.target.value,
                                                })
                                            }
                                            placeholder="Link token'ı"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Durum *</Label>
                                        <Select
                                            value={statusUpdate.status}
                                            onValueChange={(value: 'ACTIVE' | 'PASSIVE') =>
                                                setStatusUpdate({
                                                    ...statusUpdate,
                                                    status: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">
                                                    Aktif
                                                </SelectItem>
                                                <SelectItem value="PASSIVE">
                                                    Pasif
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        onClick={handleUpdateStatus}
                                        disabled={
                                            loading || !statusUpdate.token.trim()
                                        }
                                        className="w-full"
                                    >
                                        {loading ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Edit className="mr-2 h-4 w-4" />
                                        )}
                                        Durum Güncelle
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Result Section */}
                    <div>
                        {activeTab === 'list' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Listesi</CardTitle>
                                    <CardDescription>
                                        Oluşturulan linkler
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {links.length === 0 ? (
                                        <p className="text-center text-slate-500 dark:text-slate-400">
                                            Henüz link oluşturulmamış
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {links.map((link) => (
                                                <div
                                                    key={link.token}
                                                    className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                                            {link.name}
                                                        </h3>
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs ${
                                                                link.status === 'ACTIVE'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                            }`}
                                                        >
                                                            {link.status}
                                                        </span>
                                                    </div>
                                                    {link.description && (
                                                        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                                                            {link.description}
                                                        </p>
                                                    )}
                                                    <div className="mb-2 flex items-center gap-2 text-sm">
                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                            {link.price} {link.currency}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    link.token,
                                                                    link.token
                                                                )
                                                            }
                                                        >
                                                            {copiedToken ===
                                                            link.token ? (
                                                                <Check className="mr-1 h-3 w-3" />
                                                            ) : (
                                                                <Copy className="mr-1 h-3 w-3" />
                                                            )}
                                                            Token
                                                        </Button>
                                                        {link.url && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    window.open(
                                                                        link.url,
                                                                        '_blank'
                                                                    )
                                                                }
                                                            >
                                                                <ExternalLink className="mr-1 h-3 w-3" />
                                                                Linki Aç
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setUpdateForm({
                                                                    token: link.token,
                                                                    name: link.name,
                                                                    description:
                                                                        link.description ||
                                                                        '',
                                                                });
                                                                setActiveTab('update');
                                                            }}
                                                        >
                                                            <Edit className="mr-1 h-3 w-3" />
                                                            Düzenle
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {selectedLink && activeTab !== 'list' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Link Detayları</CardTitle>
                                    <CardDescription>
                                        Oluşturulan link bilgileri
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Link Adı</Label>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {selectedLink.name}
                                        </p>
                                    </div>
                                    {selectedLink.description && (
                                        <div>
                                            <Label>Açıklama</Label>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {selectedLink.description}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <Label>Fiyat</Label>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {selectedLink.price}{' '}
                                            {selectedLink.currency}
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Token</Label>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                                                {selectedLink.token}
                                            </code>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedLink.token,
                                                        'token'
                                                    )
                                                }
                                            >
                                                {copiedToken === 'token' ? (
                                                    <Check className="h-3 w-3" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    {selectedLink.url && (
                                        <div>
                                            <Label>Link URL</Label>
                                            <div className="flex items-center gap-2">
                                                <code className="flex-1 truncate rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                                                    {selectedLink.url}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        window.open(
                                                            selectedLink.url,
                                                            '_blank'
                                                        )
                                                    }
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedLink.status && (
                                        <div>
                                            <Label>Durum</Label>
                                            <span
                                                className={`inline-block rounded-full px-2 py-1 text-xs ${
                                                    selectedLink.status ===
                                                    'ACTIVE'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}
                                            >
                                                {selectedLink.status}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

