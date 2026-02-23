import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check, Copy, Edit, ExternalLink } from 'lucide-react';
import { IyzicoLink } from '../types';

interface LinkListProps {
    links: IyzicoLink[];
    copiedToken: string | null;
    onCopyToken: (token: string) => void;
    onEdit: (link: IyzicoLink) => void;
}

export default function LinkList({
    links,
    copiedToken,
    onCopyToken,
    onEdit,
}: LinkListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Link Listesi</CardTitle>
                <CardDescription>Oluşturulan linkler</CardDescription>
            </CardHeader>
            <CardContent>
                {links.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400">
                        Henüz link oluşturulmamış
                    </p>
                ) : (
                    <div className="space-y-4">
                        {links.map((link) => (
                            <div
                                key={link.token}
                                className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {link.name}
                                    </h3>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            link.status === 'ACTIVE'
                                                ? 'chip-success'
                                                : 'chip-error'
                                        }`}
                                    >
                                        {link.status}
                                    </span>
                                </div>
                                {link.description && (
                                    <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                                        {link.description}
                                    </p>
                                )}
                                <div className="mb-2 flex items-center gap-2 text-sm">
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {link.price} {link.currency}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onCopyToken(link.token)}
                                    >
                                        {copiedToken === link.token ? (
                                            <Check className="mr-1 h-3 w-3" />
                                        ) : (
                                            <Copy className="mr-1 h-3 w-3" />
                                        )}
                                        Token
                                    </Button>
                                    {link.url && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                window.open(link.url, '_blank')
                                            }
                                        >
                                            <ExternalLink className="mr-1 h-3 w-3" />
                                            Linki Aç
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(link)}
                                    >
                                        <Edit className="mr-1 h-3 w-3" />
                                        Düzenle
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
