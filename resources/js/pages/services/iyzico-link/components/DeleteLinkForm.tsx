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
import { Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useState } from 'react';

interface DeleteLinkFormProps {
    loading: boolean;
    onSubmit: (token: string) => Promise<void>;
}

export default function DeleteLinkForm({
    loading,
    onSubmit,
}: DeleteLinkFormProps) {
    const { text } = useI18n();
    const [token, setToken] = useState('');

    const handleSubmit = async () => {
        if (
            !confirm(
                text(
                    'Bu linki silmek istediğinizden emin misiniz?',
                    'Are you sure you want to delete this link?',
                ),
            )
        ) {
            return;
        }
        await onSubmit(token);
        setToken('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{text('Link Sil', 'Delete Link')}</CardTitle>
                <CardDescription>
                    {text('Bir linki silin', 'Delete a link')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="delete-token">
                        {text('Token *', 'Token *')}
                    </Label>
                    <Input
                        id="delete-token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder={text("Link token'ı", 'Link token')}
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !token.trim()}
                    variant="destructive"
                    className="w-full"
                >
                    {loading ? (
                        <Spinner className="mr-2 h-4 w-4" />
                    ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    {text('Link Sil', 'Delete Link')}
                </Button>
            </CardContent>
        </Card>
    );
}
