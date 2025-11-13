import { getCsrfToken } from '@/lib/csrf';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useAddToCart() {
    const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());

    const handleAddToCart = async (productId: number) => {
        // Loading state'ini ekle
        setAddingToCart((prev) => new Set(prev).add(productId));

        try {
            const response = await fetch('/store/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ product_id: productId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sepete ekleme başarısız');
            }

            // Cart count'u güncellemek için sayfayı yeniden yükle
            router.reload({ only: ['cartCount'] });
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
        } finally {
            // Loading state'ini kaldır
            setAddingToCart((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    return {
        addingToCart,
        handleAddToCart,
    };
}
