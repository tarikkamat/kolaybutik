import { PaginatedData } from '@/types';
import { Product } from '@/types/models';
import { Link } from '@inertiajs/react';
import { ProductCard } from './product-card';
import { ProductSkeletonCard } from './product-skeleton-card';

interface ProductGridProps {
    products: PaginatedData<Product>;
    isLoading: boolean;
    addingToCart: Set<number>;
    onAddToCart: (productId: number) => void;
}

export function ProductGrid({
    products,
    isLoading,
    addingToCart,
    onAddToCart,
}: ProductGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <ProductSkeletonCard key={index} />
                ))}
            </div>
        );
    }

    if (products.data.length === 0) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
                <p className="text-slate-600 dark:text-slate-400">
                    Ürün bulunamadı.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.data.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isAddingToCart={addingToCart.has(product.id)}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            {/* Pagination */}
            {products.links && products.links.length > 3 && (
                <div className="mt-8 flex justify-center gap-2">
                    {products.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-md px-4 py-2 ${
                                    link.active
                                        ? 'bg-[color:var(--button-bg)] text-[color:var(--button-text)]'
                                        : 'bg-white text-slate-700 hover:bg-[color:var(--button-bg-soft)] hover:text-[color:var(--button-bg)] dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-[color:var(--button-bg-soft)] dark:hover:text-[color:var(--button-bg)]'
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                    ))}
                </div>
            )}
        </>
    );
}
