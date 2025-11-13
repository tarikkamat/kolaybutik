import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

export function CartEmptyState() {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-slate-400" />
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Sepetiniz boş
            </h2>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
                Sepetinize ürün eklemek için mağazaya göz atın.
            </p>
            <Link href="/store">
                <Button>Mağazaya Git</Button>
            </Link>
        </div>
    );
}
