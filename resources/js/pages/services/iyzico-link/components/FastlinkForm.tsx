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
import { Zap, Sparkles } from 'lucide-react';

interface FastlinkFormProps {
    loading: boolean;
    onSubmit: (formData: FastlinkFormData) => Promise<void>;
}

export interface FastlinkFormData {
    description: string;
    price: string;
    currencyCode: string;
    sourceType: string;
}

export default function FastlinkForm({
    loading,
    onSubmit,
}: FastlinkFormProps) {
    const [form, setForm] = useState<FastlinkFormData>({
        description: '',
        price: '',
        currencyCode: 'TRY',
        sourceType: 'WEB',
    });

    const handleAutoFill = () => {
        setForm({
            description: 'Hızlı Ödeme Linki - Test Amaçlı',
            price: '149.99',
            currencyCode: 'TRY',
            sourceType: 'WEB',
        });
    };

    const handleSubmit = async () => {
        await onSubmit(form);
        setForm({
            description: '',
            price: '',
            currencyCode: 'TRY',
            sourceType: 'WEB',
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Fastlink Oluştur</CardTitle>
                        <CardDescription>
                            Hızlı ödeme linki oluşturun
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
                    <Label htmlFor="fastlink-description">Açıklama *</Label>
                    <Textarea
                        id="fastlink-description"
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
                    <Label htmlFor="fastlink-price">Fiyat *</Label>
                    <Input
                        id="fastlink-price"
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
                    <Label htmlFor="fastlink-currencyCode">Para Birimi</Label>
                    <Select
                        value={form.currencyCode}
                        onValueChange={(value) =>
                            setForm({
                                ...form,
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
                <div>
                    <Label htmlFor="fastlink-sourceType">Kaynak Tipi</Label>
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
                            <SelectItem value="WEB">WEB</SelectItem>
                            <SelectItem value="API">API</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !form.description ||
                        !form.price
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
    );
}

