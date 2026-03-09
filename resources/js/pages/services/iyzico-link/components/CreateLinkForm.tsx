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
import { useI18n } from '@/i18n';
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
    const { text } = useI18n();

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
            onError(
                text(
                    'Lütfen geçerli bir resim dosyası seçin',
                    'Please select a valid image file',
                ),
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            onError(
                text(
                    "Resim boyutu 5MB'dan küçük olmalıdır",
                    'Image size must be under 5MB',
                ),
            );
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
            onError(
                text(
                    'Resim yüklenirken bir hata oluştu',
                    'An error occurred while uploading the image',
                ),
            );
        };
        reader.readAsDataURL(file);
    };

    const handleAutoFill = async () => {
        try {
            const imageUrl = 'https://placehold.co/800x600/6366f1/ffffff/png?text=Product+Image';
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(
                    text('Resim yüklenemedi', 'Image could not be loaded'),
                );
            }

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.includes(',')
                    ? base64String.split(',')[1]
                    : base64String;

                setForm({
                    name: text('Örnek Ürün Linki', 'Sample Product Link'),
                    description: text(
                        'Bu bir örnek ürün açıklamasıdır. Test amaçlı oluşturulmuştur.',
                        'This is a sample product description for testing.',
                    ),
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
                onError(
                    text(
                        'Resim yüklenirken bir hata oluştu',
                        'An error occurred while uploading the image',
                    ),
                );
            };

            reader.readAsDataURL(blob);
        } catch (err: any) {
            onError(
                err.message ||
                    text(
                        'Otomatik doldurma sırasında bir hata oluştu',
                        'An error occurred during autofill',
                    ),
            );
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
                        <CardTitle>
                            {text('iyzico Link Oluştur', 'Create iyzico Link')}
                        </CardTitle>
                        <CardDescription>
                            {text(
                                'Yeni bir ödeme linki oluşturun',
                                'Create a new payment link',
                            )}
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
                        {text('Otomatik Doldur', 'Autofill')}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="name">
                        {text('Link Adı *', 'Link Name *')}
                    </Label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        placeholder={text('Ödeme Linki', 'Payment Link')}
                    />
                </div>
                <div>
                    <Label htmlFor="description">
                        {text('Açıklama', 'Description')}
                    </Label>
                    <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        placeholder={text('Link açıklaması', 'Link description')}
                    />
                </div>
                <div>
                    <Label htmlFor="price">{text('Fiyat *', 'Price *')}</Label>
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
                    <Label htmlFor="currency">
                        {text('Para Birimi', 'Currency')}
                    </Label>
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
                        {text('Adres Gerekli Değil', 'Address Not Required')}
                    </Label>
                </div>
                <div>
                    <Label htmlFor="soldLimit">
                        {text('Satış Limiti', 'Sales Limit')}
                    </Label>
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
                        placeholder={text('Boş bırakılabilir', 'Optional')}
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
                        {text('Taksit Seçeneği', 'Installment Option')}
                    </Label>
                </div>
                <div>
                    <Label htmlFor="sourceType">
                        {text('Kaynak Tipi', 'Source Type')}
                    </Label>
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
                        {text('Stok Takibi', 'Stock Tracking')}
                    </Label>
                </div>
                {form.stockEnabled && (
                    <div>
                        <Label htmlFor="stockCount">
                            {text('Stok Miktarı', 'Stock Quantity')}
                        </Label>
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
                            placeholder={text('Stok miktarı', 'Stock quantity')}
                        />
                    </div>
                )}
                <div>
                    <Label htmlFor="image">
                        {text('Ürün Resmi *', 'Product Image *')}
                    </Label>
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
                                alt={text('Önizleme', 'Preview')}
                                className="h-32 w-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    )}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {text(
                            'Maksimum 5MB, JPG, PNG veya GIF formatında',
                            'Maximum 5MB, JPG, PNG or GIF format',
                        )}
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
                    {text('Link Oluştur', 'Create Link')}
                </Button>
            </CardContent>
        </Card>
    );
}
