import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CartItemProps } from '@/types/cart';
import { Link } from '@inertiajs/react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartItem({
    item,
    isUpdating,
    isRemoving,
    onUpdateQuantity,
    onRemoveItem,
}: CartItemProps) {
    const itemPrice = item.product.sale_price || item.product.price;

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
            <div className="flex gap-4">
                {item.product.image && (
                    <Link
                        href={`/store/products/${item.product.slug}`}
                        className="flex-shrink-0"
                    >
                        <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-24 w-24 rounded-lg object-cover"
                        />
                    </Link>
                )}
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <Link
                            href={`/store/products/${item.product.slug}`}
                            className="text-lg font-semibold text-slate-900 hover:text-indigo-600 dark:text-white"
                        >
                            {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            ₺{itemPrice.toFixed(2)} / adet
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isUpdating || item.quantity <= 1}
                                onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity - 1)
                                }
                                className="h-8 w-8 p-0"
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                                {isUpdating ? (
                                    <Spinner className="mx-auto h-4 w-4" />
                                ) : (
                                    item.quantity
                                )}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isUpdating}
                                onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity + 1)
                                }
                                className="h-8 w-8 p-0"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                ₺{(itemPrice * item.quantity).toFixed(2)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isRemoving}
                                onClick={() => onRemoveItem(item.id)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                            >
                                {isRemoving ? (
                                    <Spinner className="h-4 w-4" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
