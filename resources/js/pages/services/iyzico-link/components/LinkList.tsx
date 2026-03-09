import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check, Copy, Edit, ExternalLink } from 'lucide-react';
import { useI18n } from '@/i18n';
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
    const { text } = useI18n();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{text('Link Listesi', 'Link List')}</CardTitle>
                <CardDescription>
                    {text('Oluşturulan linkler', 'Created links')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {links.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400">
                        {text('Henüz link oluşturulmamış', 'No links created yet')}
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
                                        {text('Token', 'Token')}
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
                                            {text('Linki Aç', 'Open Link')}
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(link)}
                                    >
                                        <Edit className="mr-1 h-3 w-3" />
                                        {text('Düzenle', 'Edit')}
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
