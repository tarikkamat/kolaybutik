import { Button } from '@/components/ui/button';
import { CartSummaryProps } from '@/types/cart';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export function CartSummary({
    subtotal,
    tax = 0,
    shipping = 0,
    total,
}: CartSummaryProps) {
    return (
        <div className="sticky top-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
                Sipariş Özeti
            </h2>
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                        Ara Toplam
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                        ₺{subtotal.toFixed(2)}
                    </span>
                </div>
                {tax > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                            KDV
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₺{tax.toFixed(2)}
                        </span>
                    </div>
                )}
                {shipping > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                            Kargo
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            ₺{shipping.toFixed(2)}
                        </span>
                    </div>
                )}
                <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                    <div className="flex justify-between">
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">
                            Toplam
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                            ₺{total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <Link href="/store/checkout" className="mt-6 block">
                <Button
                    size="lg"
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    Ödemeye Geç
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>

            <Link
                href="/store"
                className="mt-3 block text-center text-sm text-indigo-600 hover:text-indigo-700"
            >
                Alışverişe Devam Et
            </Link>
        </div>
    );
}
