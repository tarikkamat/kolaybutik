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
import { useI18n } from '@/i18n';
import { useState } from 'react';

interface RetrieveLinkFormProps {
    loading: boolean;
    onSubmit: (token: string) => Promise<void>;
}

export default function RetrieveLinkForm({
    loading,
    onSubmit,
}: RetrieveLinkFormProps) {
    const { text } = useI18n();
    const [token, setToken] = useState('');

    const handleSubmit = async () => {
        await onSubmit(token);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{text('Link Detayı', 'Link Details')}</CardTitle>
                <CardDescription>
                    {text(
                        'Token ile link detaylarını görüntüleyin',
                        'View link details by token',
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="retrieve-token">
                        {text('Token *', 'Token *')}
                    </Label>
                    <Input
                        id="retrieve-token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder={text("Link token'ı", 'Link token')}
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
                    {text('Detayları Getir', 'Fetch Details')}
                </Button>
            </CardContent>
        </Card>
    );
}
