import { Button } from '@/components/ui/button';
import { Filter, Webhook } from 'lucide-react';
import { WebhookData } from '../types';
import { WebhookCard } from './webhook-card';

interface WebhookListProps {
    webhooks: WebhookData[];
    filteredWebhooks: WebhookData[];
    expandedWebhooks: Set<number>;
    onToggleWebhook: (index: number) => void;
    onClearFilters: () => void;
}

export function WebhookList({
    webhooks,
    filteredWebhooks,
    expandedWebhooks,
    onToggleWebhook,
    onClearFilters,
}: WebhookListProps) {
    if (filteredWebhooks.length === 0 && webhooks.length === 0) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                <Webhook className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
                    Henüz webhook alınmadı
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                    Webhook URL'ine POST isteği gönderildiğinde burada
                    görünecektir.
                </p>
            </div>
        );
    }

    if (filteredWebhooks.length === 0) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                <Filter className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">
                    Filtreye uygun webhook bulunamadı
                </h3>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                    Filtreleri değiştirerek tekrar deneyin.
                </p>
                <Button variant="outline" onClick={onClearFilters}>
                    Filtreleri Temizle
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredWebhooks.map((webhook, index) => (
                <WebhookCard
                    key={index}
                    webhook={webhook}
                    index={index}
                    isExpanded={expandedWebhooks.has(index)}
                    onToggle={onToggleWebhook}
                />
            ))}
        </div>
    );
}
