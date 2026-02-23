import { useAddToCart } from '@/hooks/use-add-to-cart';
import StoreLayout from '@/layouts/store-layout';
import { PaginatedData } from '@/types';
import { Category, Product } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { ProductCard } from '../components/product-card';

interface CategoryShowProps {
    category: Category;
    products: PaginatedData<Product>;
    relatedCategories: Category[];
}

export default function CategoryShow({
    category,
    products,
    relatedCategories,
}: CategoryShowProps) {
    const { addingToCart, handleAddToCart } = useAddToCart();

    return (
        <StoreLayout title={category.name}>
            <Head title={category.name} />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link
                                href="/store"
                                className="text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                            >
                                Mağaza
                            </Link>
                        </li>
                        <li className="text-slate-400">/</li>
                        <li>
                            <Link
                                href="/store/categories"
                                className="text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                            >
                                Kategoriler
                            </Link>
                        </li>
                        <li className="text-slate-400">/</li>
                        <li className="text-slate-900 dark:text-white">
                            {category.name}
                        </li>
                    </ol>
                </nav>

                {/* Category Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        {category.name}
                    </h1>
                    {products.total !== undefined && (
                        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                            {products.total} ürün bulundu
                        </p>
                    )}
                </div>

                {/* Products Grid */}
                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isAddingToCart={addingToCart.has(
                                        product.id,
                                    )}
                                    onAddToCart={handleAddToCart}
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
                ) : (
                    <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-800">
                        <p className="text-slate-600 dark:text-slate-400">
                            Bu kategoride ürün bulunamadı.
                        </p>
                    </div>
                )}

                {/* Related Categories */}
                {relatedCategories.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                            Diğer Kategoriler
                        </h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {relatedCategories.map((relatedCategory) => (
                                <Link
                                    key={relatedCategory.id}
                                    href={`/store/categories/${relatedCategory.slug}`}
                                    className="rounded-lg border border-slate-200 bg-white p-4 text-center transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-800"
                                >
                                    <h3 className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white">
                                        {relatedCategory.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
