import { Slider } from '@/components/ui/slider';
import { useI18n } from '@/i18n';

interface ProductFiltersProps {
    filters: {
        sort_by?: string;
        sort_direction?: string;
    };
    priceRange: [number, number];
    minPrice: number;
    maxPrice: number;
    onPriceChange: (values: number[]) => void;
    onFilterChange: (key: string, value: any) => void;
}

export function ProductFilters({
    filters,
    priceRange,
    minPrice,
    maxPrice,
    onPriceChange,
    onFilterChange,
}: ProductFiltersProps) {
    const { text, language } = useI18n();
    const locale = language === 'tr' ? 'tr-TR' : 'en-US';

    return (
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                {text('Filtreler', 'Filters')}
            </h3>
            <div className="space-y-6">
                {/* Fiyat Filtresi */}
                <div>
                    <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('Fiyat Aralığı', 'Price Range')}
                    </label>
                    <Slider
                        value={priceRange}
                        onValueChange={onPriceChange}
                        min={minPrice}
                        max={maxPrice}
                        step={Math.max(
                            1,
                            Math.floor((maxPrice - minPrice) / 100),
                        )}
                        className="w-full"
                    />
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>₺{priceRange[0].toLocaleString(locale)}</span>
                        <span>₺{priceRange[1].toLocaleString(locale)}</span>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('Sıralama', 'Sort By')}
                    </label>
                    <select
                        value={filters.sort_by || 'created_at'}
                        onChange={(e) =>
                            onFilterChange('sort_by', e.target.value)
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                        <option value="created_at">
                            {text('En Yeni', 'Newest')}
                        </option>
                        <option value="price">{text('Fiyat', 'Price')}</option>
                        <option value="name">{text('İsim', 'Name')}</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        {text('Yön', 'Direction')}
                    </label>
                    <select
                        value={filters.sort_direction || 'desc'}
                        onChange={(e) =>
                            onFilterChange('sort_direction', e.target.value)
                        }
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                        <option value="desc">
                            {text('Azalan', 'Descending')}
                        </option>
                        <option value="asc">
                            {text('Artan', 'Ascending')}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
}
