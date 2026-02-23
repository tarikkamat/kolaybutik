import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Settings, Webhook } from 'lucide-react';

interface WebhookHeaderProps {
    hasActiveFilters: boolean;
    onRefresh: () => void;
    onOpenFilter: () => void;
    onOpenSettings: () => void;
}

export function WebhookHeader({
    hasActiveFilters,
    onRefresh,
    onOpenFilter,
    onOpenSettings,
}: WebhookHeaderProps) {
    return (
        <div className="mb-8">
            <div className="mb-4 flex items-center gap-4">
                <Link
                    href="/services"
                    className="inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Servislere Geri Dön
                </Link>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
                        <Webhook className="h-8 w-8 text-indigo-600" />
                        Webhook Catcher
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Gelen webhook isteklerini görüntüleyin. İlk webhook 60
                        saniye içinde gelir.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onRefresh}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        Yenile
                    </button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={onOpenSettings}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Ayarlar
                    </Button>
                </div>
            </div>
        </div>
    );
}
