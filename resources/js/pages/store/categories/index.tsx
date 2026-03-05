import { useI18n } from '@/i18n';
import StoreLayout from '@/layouts/store-layout';
import { Category } from '@/types/models';
import { Head, Link } from '@inertiajs/react';

interface CategoriesIndexProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const { text } = useI18n();

    return (
        <StoreLayout title={text('Kategoriler', 'Categories')}>
            <Head title={text('Kategoriler', 'Categories')} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        {text('Kategoriler', 'Categories')}
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        {text(
                            'Tüm kategorileri keşfedin',
                            'Discover all categories',
                        )}
                    </p>
                </div>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/store/categories/${category.slug}`}
                                className="group rounded-lg border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
                            >
                                <h3 className="mb-2 text-xl font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white">
                                    {category.name}
                                </h3>
                                {category.products_count !== undefined && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {category.products_count}{' '}
                                        {text('ürün', 'products')}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
                        <p className="text-slate-600 dark:text-slate-400">
                            {text(
                                'Kategori bulunamadı.',
                                'No categories found.',
                            )}
                        </p>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
