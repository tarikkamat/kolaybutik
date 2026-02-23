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
import { useState } from 'react';

interface DeleteLinkFormProps {
    loading: boolean;
    onSubmit: (token: string) => Promise<void>;
}

export default function DeleteLinkForm({
    loading,
    onSubmit,
}: DeleteLinkFormProps) {
    const [token, setToken] = useState('');

    const handleSubmit = async () => {
        if (!confirm('Bu linki silmek istediğinizden emin misiniz?')) {
            return;
        }
        await onSubmit(token);
        setToken('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Link Sil</CardTitle>
                <CardDescription>Bir linki silin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="delete-token">Token *</Label>
                    <Input
                        id="delete-token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Link token'ı"
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
                    Link Sil
                </Button>
            </CardContent>
        </Card>
    );
}

