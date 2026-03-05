import { useI18n } from '@/i18n';
import StoreLayout from '@/layouts/store-layout';
import { getCsrfToken } from '@/lib/csrf';
import { CartIndexProps } from '@/types/cart';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CartEmptyState } from './components/cart-empty-state';
import { CartItemsList } from './components/cart-items-list';
import { CartSummary } from './components/cart-summary';

export default function CartIndex({
    items,
    subtotal,
    tax = 0,
    shipping = 0,
    total,
}: CartIndexProps) {
    const { text } = useI18n();
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());

    const handleUpdateQuantity = async (
        productId: number,
        quantity: number,
    ) => {
        if (quantity < 1) return;

        setUpdatingItems((prev) => new Set(prev).add(productId));

        try {
            const response = await fetch(`/store/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ quantity }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        text(
                            'Miktar güncelleme başarısız',
                            'Failed to update quantity',
                        ),
                );
            }

            // Sayfayı yeniden yükle
            router.reload();
        } catch (error) {
            console.error(
                text('Miktar güncelleme hatası:', 'Quantity update error:'),
                error,
            );
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (productId: number) => {
        setRemovingItems((prev) => new Set(prev).add(productId));

        try {
            const response = await fetch(`/store/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        text('Ürün silme başarısız', 'Failed to remove item'),
                );
            }

            // Sayfayı yeniden yükle
            router.reload();
        } catch (error) {
            console.error(
                text('Ürün silme hatası:', 'Remove item error:'),
                error,
            );
        } finally {
            setRemovingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    if (items.length === 0) {
        return (
            <StoreLayout title={text('Sepetim', 'My Cart')}>
                <Head title={text('Sepetim', 'My Cart')} />
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <CartEmptyState />
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout title={text('Sepetim', 'My Cart')}>
            <Head title={text('Sepetim', 'My Cart')} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        {text('Sepetim', 'My Cart')}
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {items.length} {text('ürün', 'products')}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <CartItemsList
                            items={items}
                            updatingItems={updatingItems}
                            removingItems={removingItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <CartSummary
                            subtotal={subtotal}
                            tax={tax}
                            shipping={shipping}
                            total={total}
                        />
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
