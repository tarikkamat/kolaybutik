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
import { Search } from 'lucide-react';
import { useState } from 'react';

interface RetrieveLinkFormProps {
    loading: boolean;
    onSubmit: (token: string) => Promise<void>;
}

export default function RetrieveLinkForm({
    loading,
    onSubmit,
}: RetrieveLinkFormProps) {
    const [token, setToken] = useState('');

    const handleSubmit = async () => {
        await onSubmit(token);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Link Detayı</CardTitle>
                <CardDescription>
                    Token ile link detaylarını görüntüleyin
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="retrieve-token">Token *</Label>
                    <Input
                        id="retrieve-token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Link token'ı"
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !token.trim()}
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
    );
}

