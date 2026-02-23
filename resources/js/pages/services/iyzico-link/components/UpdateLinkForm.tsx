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
import { Edit } from 'lucide-react';
import { useState } from 'react';

interface UpdateLinkFormProps {
    loading: boolean;
    onSubmit: (formData: UpdateFormData) => Promise<void>;
    initialData?: { token: string; name: string; description: string };
}

export interface UpdateFormData {
    token: string;
    name: string;
    description: string;
}

export default function UpdateLinkForm({
    loading,
    onSubmit,
    initialData,
}: UpdateLinkFormProps) {
    const [form, setForm] = useState<UpdateFormData>({
        token: initialData?.token || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
    });

    const handleSubmit = async () => {
        await onSubmit(form);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Link Güncelle</CardTitle>
                <CardDescription>Mevcut bir linki güncelleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="update-token">Token *</Label>
                    <Input
                        id="update-token"
                        value={form.token}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                token: e.target.value,
                            })
                        }
                        placeholder="Link token'ı"
                    />
                </div>
                <div>
                    <Label htmlFor="update-name">Yeni Link Adı</Label>
                    <Input
                        id="update-name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        placeholder="Yeni link adı"
                    />
                </div>
                <div>
                    <Label htmlFor="update-description">Yeni Açıklama</Label>
                    <Textarea
                        id="update-description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        placeholder="Yeni açıklama"
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !form.token.trim()}
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
    );
}

