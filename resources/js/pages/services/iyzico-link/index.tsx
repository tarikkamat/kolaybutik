import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Check,
    Zap,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TabType, IyzicoLink } from './types';
import CreateLinkForm, { CreateFormData } from './components/CreateLinkForm';
import FastlinkForm, { FastlinkFormData } from './components/FastlinkForm';
import RetrieveLinkForm from './components/RetrieveLinkForm';
import UpdateLinkForm, { UpdateFormData } from './components/UpdateLinkForm';
import DeleteLinkForm from './components/DeleteLinkForm';
import StatusUpdateForm from './components/StatusUpdateForm';
import LinkList from './components/LinkList';
import LinkDetails from './components/LinkDetails';

export default function IyzicoLinkPage() {
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState<IyzicoLink[]>([]);
    const [selectedLink, setSelectedLink] = useState<IyzicoLink | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('create');
    const [copiedToken, setCopiedToken] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [updateFormInitialData, setUpdateFormInitialData] = useState<{
        token: string;
        name: string;
        description: string;
    } | null>(null);

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content') || '';

    useEffect(() => {
        if (result && result.status === 'success') {
            const timer = setTimeout(() => {
                setResult(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [result]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleCreate = async (formData: CreateFormData) => {
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
                body: JSON.stringify(formData),
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

    const handleCreateFastlink = async (formData: FastlinkFormData) => {
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
                body: JSON.stringify(formData),
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

    const handleRetrieve = async (token: string) => {
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
                body: JSON.stringify({ token }),
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

    const handleUpdate = async (formData: UpdateFormData) => {
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
                body: JSON.stringify(formData),
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

    const handleUpdateStatus = async (
        token: string,
        status: 'ACTIVE' | 'PASSIVE'
    ) => {
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
                body: JSON.stringify({ token, status }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
            if (activeTab === 'list') {
                handleList();
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (token: string) => {
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
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errorMessage || data.message || 'Bir hata oluştu');
                return;
            }

            setResult(data);
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

    const handleEditLink = (link: IyzicoLink) => {
        setUpdateFormInitialData({
            token: link.token,
            name: link.name,
            description: link.description || '',
        });
        setActiveTab('update');
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
                                ? 'border-b-2 border-[color:var(--button-border)] text-[color:var(--button-bg)]'
                                : 'text-slate-600 hover:text-[color:var(--button-bg)] dark:text-slate-400 dark:hover:text-[color:var(--button-bg)]'
                        }`}
                    >
                        <Plus className="mr-2 inline h-4 w-4" />
                        Link Oluştur
                    </button>
                    <button
                        onClick={() => setActiveTab('fastlink')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'fastlink'
                                ? 'border-b-2 border-[color:var(--button-border)] text-[color:var(--button-bg)]'
                                : 'text-slate-600 hover:text-[color:var(--button-bg)] dark:text-slate-400 dark:hover:text-[color:var(--button-bg)]'
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
                                ? 'border-b-2 border-[color:var(--button-border)] text-[color:var(--button-bg)]'
                                : 'text-slate-600 hover:text-[color:var(--button-bg)] dark:text-slate-400 dark:hover:text-[color:var(--button-bg)]'
                        }`}
                    >
                        <Search className="mr-2 inline h-4 w-4" />
                        Link Listele
                    </button>
                    <button
                        onClick={() => setActiveTab('retrieve')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'retrieve'
                                ? 'border-b-2 border-[color:var(--button-border)] text-[color:var(--button-bg)]'
                                : 'text-slate-600 hover:text-[color:var(--button-bg)] dark:text-slate-400 dark:hover:text-[color:var(--button-bg)]'
                        }`}
                    >
                        <Search className="mr-2 inline h-4 w-4" />
                        Link Detayı
                    </button>
                    <button
                        onClick={() => setActiveTab('update')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'update'
                                ? 'border-b-2 border-[color:var(--button-border)] text-[color:var(--button-bg)]'
                                : 'text-slate-600 hover:text-[color:var(--button-bg)] dark:text-slate-400 dark:hover:text-[color:var(--button-bg)]'
                        }`}
                    >
                        <Edit className="mr-2 inline h-4 w-4" />
                        Link Güncelle
                    </button>
                    <button
                        onClick={() => setActiveTab('delete')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'delete'
                                ? 'border-b-2 border-[color:var(--button-border)] text-[color:var(--button-bg)]'
                                : 'text-slate-600 hover:text-[color:var(--button-bg)] dark:text-slate-400 dark:hover:text-[color:var(--button-bg)]'
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
                            <CreateLinkForm
                                loading={loading}
                                onSubmit={handleCreate}
                                onError={setError}
                            />
                        )}

                        {activeTab === 'fastlink' && (
                            <FastlinkForm
                                loading={loading}
                                onSubmit={handleCreateFastlink}
                            />
                        )}

                        {activeTab === 'retrieve' && (
                            <RetrieveLinkForm
                                loading={loading}
                                onSubmit={handleRetrieve}
                            />
                        )}

                        {activeTab === 'update' && (
                            <UpdateLinkForm
                                loading={loading}
                                onSubmit={handleUpdate}
                                initialData={updateFormInitialData || undefined}
                            />
                        )}

                        {activeTab === 'delete' && (
                            <DeleteLinkForm
                                loading={loading}
                                onSubmit={handleDelete}
                            />
                        )}

                        {activeTab === 'list' && (
                            <StatusUpdateForm
                                loading={loading}
                                onSubmit={handleUpdateStatus}
                            />
                        )}
                    </div>

                    {/* Result Section */}
                    <div>
                        {activeTab === 'list' && (
                            <LinkList
                                links={links}
                                copiedToken={copiedToken}
                                onCopyToken={(token) => copyToClipboard(token, token)}
                                onEdit={handleEditLink}
                            />
                        )}

                        {selectedLink && activeTab !== 'list' && (
                            <LinkDetails
                                link={selectedLink}
                                copiedToken={copiedToken}
                                onCopyToken={(token) => copyToClipboard(token, 'token')}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
