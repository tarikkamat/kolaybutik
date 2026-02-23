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
import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface CreateLinkFormProps {
    loading: boolean;
    onSubmit: (formData: CreateFormData) => Promise<void>;
    onError: (error: string) => void;
}

export interface CreateFormData {
    name: string;
    description: string;
    price: string;
    currency: string;
    addressIgnorable: boolean;
    soldLimit: string;
    installmentRequested: boolean;
    sourceType: string;
    stockEnabled: boolean;
    stockCount: string;
    encodedImageFile: string;
}

export default function CreateLinkForm({
    loading,
    onSubmit,
    onError,
}: CreateLinkFormProps) {
    const [form, setForm] = useState<CreateFormData>({
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
        encodedImageFile: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            onError('Lütfen geçerli bir resim dosyası seçin');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            onError('Resim boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.includes(',')
                ? base64String.split(',')[1]
                : base64String;

            setForm({
                ...form,
                encodedImageFile: base64Data,
            });
            setImagePreview(base64String);
        };
        reader.onerror = () => {
            onError('Resim yüklenirken bir hata oluştu');
        };
        reader.readAsDataURL(file);
    };

    const handleAutoFill = async () => {
        try {
            const imageUrl = 'https://placehold.co/800x600/6366f1/ffffff/png?text=Product+Image';
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Resim yüklenemedi');
            }

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.includes(',')
                    ? base64String.split(',')[1]
                    : base64String;

                setForm({
                    name: 'Örnek Ürün Linki',
                    description: 'Bu bir örnek ürün açıklamasıdır. Test amaçlı oluşturulmuştur.',
                    price: '99.99',
                    currency: 'TRY',
                    addressIgnorable: true,
                    soldLimit: '100',
                    installmentRequested: true,
                    sourceType: 'API',
                    stockEnabled: true,
                    stockCount: '50',
                    encodedImageFile: base64Data,
                });
                setImagePreview(base64String);
            };

            reader.onerror = () => {
                onError('Resim yüklenirken bir hata oluştu');
            };

            reader.readAsDataURL(blob);
        } catch (err: any) {
            onError(err.message || 'Otomatik doldurma sırasında bir hata oluştu');
        }
    };

    const handleSubmit = async () => {
        await onSubmit(form);
        setForm({
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
            encodedImageFile: '',
        });
        setImagePreview(null);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>iyzico Link Oluştur</CardTitle>
                        <CardDescription>
                            Yeni bir ödeme linki oluşturun
                        </CardDescription>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAutoFill}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        Otomatik Doldur
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="name">Link Adı *</Label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        placeholder="Ödeme Linki"
                    />
                </div>
                <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
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
                        value={form.price}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                price: e.target.value,
                            })
                        }
                        placeholder="100.00"
                    />
                </div>
                <div>
                    <Label htmlFor="currency">Para Birimi</Label>
                    <Select
                        value={form.currency}
                        onValueChange={(value) =>
                            setForm({
                                ...form,
                                currency: value,
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
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="addressIgnorable"
                        checked={form.addressIgnorable}
                        onChange={(e) =>
                            setForm({
                                ...form,
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
                        value={form.soldLimit}
                        onChange={(e) =>
                            setForm({
                                ...form,
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
                        checked={form.installmentRequested}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                installmentRequested: e.target.checked,
                            })
                        }
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    <Label htmlFor="installmentRequested" className="cursor-pointer">
                        Taksit Seçeneği
                    </Label>
                </div>
                <div>
                    <Label htmlFor="sourceType">Kaynak Tipi</Label>
                    <Select
                        value={form.sourceType}
                        onValueChange={(value) =>
                            setForm({
                                ...form,
                                sourceType: value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="API">API</SelectItem>
                            <SelectItem value="WEB">WEB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="stockEnabled"
                        checked={form.stockEnabled}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                stockEnabled: e.target.checked,
                            })
                        }
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    <Label htmlFor="stockEnabled" className="cursor-pointer">
                        Stok Takibi
                    </Label>
                </div>
                {form.stockEnabled && (
                    <div>
                        <Label htmlFor="stockCount">Stok Miktarı</Label>
                        <Input
                            id="stockCount"
                            type="number"
                            value={form.stockCount}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    stockCount: e.target.value,
                                })
                            }
                            placeholder="Stok miktarı"
                        />
                    </div>
                )}
                <div>
                    <Label htmlFor="image">Ürün Resmi *</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img
                                src={imagePreview}
                                alt="Önizleme"
                                className="h-32 w-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Maksimum 5MB, JPG, PNG veya GIF formatında
                    </p>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !form.name ||
                        !form.price ||
                        !form.encodedImageFile
                    }
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
    );
}

