import { useAddToCart } from '@/hooks/use-add-to-cart';
import StoreLayout from '@/layouts/store-layout';
import { PaginatedData } from '@/types';
import { Category, Product } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CategorySidebar } from './components/category-sidebar';
import { ProductGrid } from './components/product-grid';

interface StoreIndexProps {
    products: PaginatedData<Product>;
    categories: Category[];
    featuredProducts: Product[];
    filters: {
        category_id?: number;
        min_price?: number;
        max_price?: number;
        on_sale?: boolean;
        search?: string;
        sort_by?: string;
        sort_direction?: string;
    };
}

export default function StoreIndex({
    products,
    categories,
    featuredProducts,
    filters,
}: StoreIndexProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { addingToCart, handleAddToCart } = useAddToCart();
    const priceChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // URL'den gelen category_id'yi number'a çevir
    const selectedCategoryId = filters.category_id
        ? Number(filters.category_id)
        : null;

    // Ürünlerden min ve max fiyatları hesapla
    const { minPrice, maxPrice } = useMemo(() => {
        const allProducts = [...products.data, ...featuredProducts];
        if (allProducts.length === 0) {
            return { minPrice: 0, maxPrice: 10000 };
        }

        const prices = allProducts
            .map((p) => p.sale_price || p.price)
            .filter((p) => p !== null && p !== undefined);

        if (prices.length === 0) {
            return { minPrice: 0, maxPrice: 10000 };
        }

        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));

        return {
            minPrice: min || 0,
            maxPrice: max || 10000,
        };
    }, [products.data, featuredProducts]);

    // Price range state'i - dinamik olarak minPrice ve maxPrice'a göre ayarla
    const [priceRange, setPriceRange] = useState<[number, number]>([
        filters.min_price ?? minPrice,
        filters.max_price ?? maxPrice,
    ]);

    // Filtreler veya minPrice/maxPrice değiştiğinde price range'i güncelle
    useEffect(() => {
        setPriceRange([
            filters.min_price ?? minPrice,
            filters.max_price ?? maxPrice,
        ]);
    }, [filters.min_price, filters.max_price, minPrice, maxPrice]);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);

        router.on('start', handleStart);
        router.on('finish', handleFinish);

        // Inertia router event'leri için cleanup gerekli değil
        // Router singleton instance olduğu için event listener'lar otomatik temizlenir
    }, []);

    const handleFilterChange = (key: string, value: any) => {
        router.get(
            '/store',
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePriceChange = (values: number[]) => {
        setPriceRange([values[0], values[1]]);

        // Debounce: Kullanıcı slider'ı bıraktıktan 300ms sonra filtrelemeyi uygula
        if (priceChangeTimeoutRef.current) {
            clearTimeout(priceChangeTimeoutRef.current);
        }

        priceChangeTimeoutRef.current = setTimeout(() => {
            const [min, max] = values;
            handleFilterChange('min_price', min === minPrice ? undefined : min);
            handleFilterChange('max_price', max === maxPrice ? undefined : max);
        }, 300);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (priceChangeTimeoutRef.current) {
                clearTimeout(priceChangeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <StoreLayout title="Mağaza">
            <Head title="Mağaza" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Mağaza
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <CategorySidebar
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        filters={filters}
                        priceRange={priceRange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onCategoryChange={(categoryId) =>
                            handleFilterChange('category_id', categoryId)
                        }
                        onPriceChange={handlePriceChange}
                        onFilterChange={handleFilterChange}
                    />

                    <div className="lg:col-span-3">
                        <ProductGrid
                            products={products}
                            isLoading={isLoading}
                            addingToCart={addingToCart}
                            onAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
