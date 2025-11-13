import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface OtherPaymentMethodProps {
    title: string;
    icon: LucideIcon;
    showPayButton?: boolean;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    isValid?: boolean;
}

export function OtherPaymentMethod({
    title,
    icon: Icon,
    showPayButton = false,
    onSubmit,
    isSubmitting = false,
    isValid = false,
}: OtherPaymentMethodProps) {
    return (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {title} özelliği yakında eklenecek.
            </p>
            {showPayButton && (
                <div className="mt-4">
                    <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting || !isValid}
                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        <Icon className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'İşleniyor...' : 'Ödeme Yap'}
                    </Button>
                </div>
            )}
        </div>
    );
}

