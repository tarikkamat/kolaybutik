import { Category } from '@/types/models';
import { ProductFilters } from './product-filters';

interface CategorySidebarProps {
    categories: Category[];
    selectedCategoryId: number | null;
    filters: {
        sort_by?: string;
        sort_direction?: string;
        min_price?: number;
        max_price?: number;
    };
    priceRange: [number, number];
    minPrice: number;
    maxPrice: number;
    onCategoryChange: (categoryId: number | null) => void;
    onPriceChange: (values: number[]) => void;
    onFilterChange: (key: string, value: any) => void;
}

export function CategorySidebar({
    categories,
    selectedCategoryId,
    filters,
    priceRange,
    minPrice,
    maxPrice,
    onCategoryChange,
    onPriceChange,
    onFilterChange,
}: CategorySidebarProps) {
    return (
        <aside className="lg:col-span-1">
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
                <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                    Kategoriler
                </h3>
                <ul className="space-y-1">
                    <li>
                        <button
                            onClick={() => onCategoryChange(null)}
                            className={`relative w-full rounded-md px-3 py-2.5 text-left text-sm transition-all ${
                                !selectedCategoryId
                                    ? 'border-l-4 border-indigo-700 bg-indigo-600 font-semibold text-white shadow-sm dark:border-indigo-800 dark:bg-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700'
                            }`}
                        >
                            {!selectedCategoryId && (
                                <span className="absolute top-1/2 left-2 -translate-y-1/2">
                                    ✓
                                </span>
                            )}
                            <span className={!selectedCategoryId ? 'ml-5' : ''}>
                                Tüm Kategoriler
                            </span>
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button
                                onClick={() => onCategoryChange(category.id)}
                                className={`relative w-full rounded-md px-3 py-2.5 text-left text-sm transition-all ${
                                    selectedCategoryId === category.id
                                        ? 'border-l-4 border-indigo-700 bg-indigo-600 font-semibold text-white shadow-sm dark:border-indigo-800 dark:bg-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700'
                                }`}
                            >
                                {selectedCategoryId === category.id && (
                                    <span className="absolute top-1/2 left-2 -translate-y-1/2">
                                        ✓
                                    </span>
                                )}
                                <span
                                    className={
                                        selectedCategoryId === category.id
                                            ? 'ml-5'
                                            : ''
                                    }
                                >
                                    {category.name}
                                    {category.products_count && (
                                        <span
                                            className={`ml-2 text-xs ${
                                                selectedCategoryId ===
                                                category.id
                                                    ? 'text-indigo-200'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            ({category.products_count})
                                        </span>
                                    )}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <ProductFilters
                    filters={filters}
                    priceRange={priceRange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={onPriceChange}
                    onFilterChange={onFilterChange}
                />
            </div>
        </aside>
    );
}
