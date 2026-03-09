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
import { useI18n } from '@/i18n';
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
    const { text } = useI18n();
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
                <CardTitle>{text('Link Güncelle', 'Update Link')}</CardTitle>
                <CardDescription>
                    {text('Mevcut bir linki güncelleyin', 'Update an existing link')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="update-token">
                        {text('Token *', 'Token *')}
                    </Label>
                    <Input
                        id="update-token"
                        value={form.token}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                token: e.target.value,
                            })
                        }
                        placeholder={text("Link token'ı", 'Link token')}
                    />
                </div>
                <div>
                    <Label htmlFor="update-name">
                        {text('Yeni Link Adı', 'New Link Name')}
                    </Label>
                    <Input
                        id="update-name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        placeholder={text('Yeni link adı', 'New link name')}
                    />
                </div>
                <div>
                    <Label htmlFor="update-description">
                        {text('Yeni Açıklama', 'New Description')}
                    </Label>
                    <Textarea
                        id="update-description"
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        placeholder={text('Yeni açıklama', 'New description')}
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
                    {text('Link Güncelle', 'Update Link')}
                </Button>
            </CardContent>
        </Card>
    );
}
