import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { IyzicoLink } from '../types';

interface LinkDetailsProps {
    link: IyzicoLink;
    copiedToken: string | null;
    onCopyToken: (token: string) => void;
}

export default function LinkDetails({
    link,
    copiedToken,
    onCopyToken,
}: LinkDetailsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Link Detayları</CardTitle>
                <CardDescription>Oluşturulan link bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Link Adı</Label>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {link.name}
                    </p>
                </div>
                {link.description && (
                    <div>
                        <Label>Açıklama</Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {link.description}
                        </p>
                    </div>
                )}
                <div>
                    <Label>Fiyat</Label>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {link.price} {link.currency}
                    </p>
                </div>
                <div>
                    <Label>Token</Label>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                            {link.token}
                        </code>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCopyToken(link.token)}
                        >
                            {copiedToken === 'token' ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </Button>
                    </div>
                </div>
                {link.url && (
                    <div>
                        <Label>Link URL</Label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 truncate rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                                {link.url}
                            </code>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(link.url, '_blank')}
                            >
                                <ExternalLink className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                )}
                {link.status && (
                    <div>
                        <Label>Durum</Label>
                        <span
                            className={`ms-2 inline-block rounded-full px-2 py-1 text-xs ${
                                link.status === 'success'
                                    ? 'chip-success'
                                    : 'chip-error'
                            }`}
                        >
                            {link.status === 'success' ? 'Aktif' : 'Pasif'}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
