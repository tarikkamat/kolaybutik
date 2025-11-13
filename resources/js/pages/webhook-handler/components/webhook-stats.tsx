import { Clock, Webhook } from 'lucide-react';
import { WebhookData } from '../types';
import { formatTimestamp } from '../utils';

interface WebhookStatsProps {
    filteredCount: number;
    totalCount: number;
    hasActiveFilters: boolean;
    webhooks: WebhookData[];
    filteredWebhooks: WebhookData[];
    webhookUrl: string;
}

export function WebhookStats({
    filteredCount,
    totalCount,
    hasActiveFilters,
    webhooks,
    filteredWebhooks,
    webhookUrl,
}: WebhookStatsProps) {
    return (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/30">
                        <Webhook className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Toplam Webhook
                        </p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {filteredCount}
                            {hasActiveFilters && (
                                <span className="ml-1 text-sm font-normal text-slate-500 dark:text-slate-400">
                                    / {totalCount}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Son Güncelleme
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {filteredWebhooks.length > 0
                                ? formatTimestamp(filteredWebhooks[0].timestamp)
                                : webhooks.length > 0
                                  ? formatTimestamp(webhooks[0].timestamp)
                                  : 'Henüz yok'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
