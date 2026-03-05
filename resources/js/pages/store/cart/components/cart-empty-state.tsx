import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export function CartEmptyState() {
    const { text } = useI18n();

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-400" />
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                {text('Sepetiniz boş', 'Your cart is empty')}
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
                {text(
                    'Sepetinize ürün eklemek için mağazaya göz atın.',
                    'Browse the store to add products to your cart.',
                )}
            </p>
            <Link href="/store">
                <Button>{text('Mağazaya Git', 'Go to Store')}</Button>
            </Link>
        </div>
    );
}
