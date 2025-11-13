import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WebhookHeader } from './components/webhook-header';
import { WebhookList } from './components/webhook-list';
import { WebhookSettingsDialog } from './components/webhook-settings-dialog';
import { WebhookStats } from './components/webhook-stats';
import { useWebhookFilters } from './hooks/use-webhook-filters';
import { FilterState, WebhookData, WebhookSettings } from './types';
import { getWebhookUrl } from './utils';

interface WebhookHandlerPageProps {
    webhooks?: WebhookData[] | null;
    webhooksCount?: number | null;
    webhooksTotalCount?: number | null;
    webhookSettings?: WebhookSettings | null;
}

const initialFilters: FilterState = {
    headerKey: '',
    headerValue: '',
    status: '',
    paymentId: '',
    paymentConversationId: '',
    merchantId: '',
    token: '',
    iyziPaymentId: '',
    iyziReferenceCode: '',
    iyziEventType: '',
    orderReferenceCode: '',
    customerReferenceCode: '',
    subscriptionReferenceCode: '',
};

export default function WebhookHandlerIndex({
    webhooks: propWebhooks = null,
    webhooksCount: propWebhooksCount = null,
    webhooksTotalCount: propWebhooksTotalCount = null,
    webhookSettings: propWebhookSettings = null,
}: WebhookHandlerPageProps) {
    const [webhooks, setWebhooks] = useState<WebhookData[]>(propWebhooks || []);
    const [error, setError] = useState<string | null>(null);
    const [expandedWebhooks, setExpandedWebhooks] = useState<Set<number>>(
        new Set(),
    );
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [settings, setSettings] = useState<WebhookSettings>(
        propWebhookSettings || {
            hiddenFields: [],
            eventTypeFilter: [],
            statusFilter: [],
        },
    );

    const settingsForm = useForm({
        hiddenFields: settings.hiddenFields || [],
        eventTypeFilter: settings.eventTypeFilter || [],
        statusFilter: settings.statusFilter || [],
    });

    // Sync form data when settings change
    useEffect(() => {
        settingsForm.setData({
            hiddenFields: settings.hiddenFields || [],
            eventTypeFilter: settings.eventTypeFilter || [],
            statusFilter: settings.statusFilter || [],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    const filteredWebhooks = useWebhookFilters(webhooks, filters);

    const fetchWebhooks = () => {
        router.get(
            '/services/webhooks',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['webhooks', 'webhooksCount', 'webhooksTotalCount'],
            },
        );
    };

    useEffect(() => {
        // Update state when props change
        if (propWebhooks) {
            setWebhooks(propWebhooks);
        }
        if (propWebhookSettings) {
            setSettings(propWebhookSettings);
            settingsForm.setData({
                hiddenFields: propWebhookSettings.hiddenFields || [],
                eventTypeFilter: propWebhookSettings.eventTypeFilter || [],
                statusFilter: propWebhookSettings.statusFilter || [],
            });
        }
    }, [propWebhooks, propWebhookSettings]);

    useEffect(() => {
        // İlk yükleme
        if (!propWebhooks) {
            fetchWebhooks();
        }

        // Polling: Her 5 saniyede bir webhook'ları yenile
        const interval = setInterval(() => {
            fetchWebhooks();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const toggleWebhook = (index: number) => {
        setExpandedWebhooks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    const hasActiveFilters = Object.values(filters).some(
        (value) => value !== '',
    );

    const saveSettings = () => {
        // Update form data from current settings state
        settingsForm.setData({
            hiddenFields: settings.hiddenFields || [],
            eventTypeFilter: settings.eventTypeFilter || [],
            statusFilter: settings.statusFilter || [],
        });

        settingsForm.post('/services/webhook-settings', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSettingsDialogOpen(false);
                // Refresh webhooks to apply new settings
                fetchWebhooks();
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Head title="Webhook Catcher" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <WebhookHeader
                    hasActiveFilters={hasActiveFilters}
                    onRefresh={fetchWebhooks}
                    onOpenFilter={() => setIsDialogOpen(true)}
                    onOpenSettings={() => setIsSettingsDialogOpen(true)}
                />

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-800 dark:text-red-200">
                            {error}
                        </span>
                    </div>
                )}

                <WebhookStats
                    filteredCount={filteredWebhooks.length}
                    totalCount={webhooks.length}
                    hasActiveFilters={hasActiveFilters}
                    webhooks={webhooks}
                    filteredWebhooks={filteredWebhooks}
                    webhookUrl={getWebhookUrl()}
                />

                <WebhookList
                    webhooks={webhooks}
                    filteredWebhooks={filteredWebhooks}
                    expandedWebhooks={expandedWebhooks}
                    onToggleWebhook={toggleWebhook}
                    onClearFilters={clearFilters}
                />

                <WebhookSettingsDialog
                    isOpen={isSettingsDialogOpen}
                    onOpenChange={setIsSettingsDialogOpen}
                    settings={settings}
                    onSettingsChange={setSettings}
                    onSave={saveSettings}
                />
            </div>
        </div>
    );
}
