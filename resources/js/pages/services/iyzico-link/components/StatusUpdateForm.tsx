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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Edit } from 'lucide-react';
import { useState } from 'react';

interface StatusUpdateFormProps {
    loading: boolean;
    onSubmit: (token: string, status: 'ACTIVE' | 'PASSIVE') => Promise<void>;
}

export default function StatusUpdateForm({
    loading,
    onSubmit,
}: StatusUpdateFormProps) {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState<'ACTIVE' | 'PASSIVE'>('ACTIVE');

    const handleSubmit = async () => {
        await onSubmit(token, status);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Link Durum Güncelle</CardTitle>
                <CardDescription>
                    Link durumunu aktif/pasif yapın
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="status-token">Token *</Label>
                    <Input
                        id="status-token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Link token'ı"
                    />
                </div>
                <div>
                    <Label htmlFor="status">Durum *</Label>
                    <Select
                        value={status}
                        onValueChange={(value: 'ACTIVE' | 'PASSIVE') =>
                            setStatus(value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Aktif</SelectItem>
                            <SelectItem value="PASSIVE">Pasif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading || !token.trim()}
                    className="w-full"
                >
                    {loading ? (
                        <Spinner className="mr-2 h-4 w-4" />
                    ) : (
                        <Edit className="mr-2 h-4 w-4" />
                    )}
                    Durum Güncelle
                </Button>
            </CardContent>
        </Card>
    );
}

