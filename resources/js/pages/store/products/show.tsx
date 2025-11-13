import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import StoreLayout from '@/layouts/store-layout';
import { Product } from '@/types/models';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { ProductCard } from '../components/product-card';

interface ProductShowProps {
    product: Product;
    relatedProducts: Product[];
    latestProducts: Product[];
}

export default function ProductShow({
    product,
    relatedProducts,
    latestProducts,
}: ProductShowProps) {
    const { addingToCart, handleAddToCart } = useAddToCart();

    const discountPercentage =
        product.sale_price && product.sale_price < product.price
            ? Math.round(
                  ((product.price - product.sale_price) / product.price) * 100,
              )
            : 0;

    return (
        <StoreLayout title={product.name}>
            <Head title={product.name} />
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
                        {product.category && (
                            <>
                                <li>
                                    <Link
                                        href={`/store/categories/${product.category.slug}`}
                                        className="text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                                    >
                                        {product.category.name}
                                    </Link>
                                </li>
                                <li className="text-slate-400">/</li>
                            </>
                        )}
                        <li className="text-slate-900 dark:text-white">
                            {product.name}
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Product Image */}
                    <div>
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800"
                            />
                        ) : (
                            <div className="flex h-96 w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                                <span className="text-slate-400">
                                    Resim Yok
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
                            {product.name}
                        </h1>

                        {product.category && (
                            <Link
                                href={`/store/categories/${product.category.slug}`}
                                className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        <div className="mb-6">
                            {product.sale_price &&
                            product.sale_price < product.price ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-indigo-600">
                                        ₺{product.sale_price.toFixed(2)}
                                    </span>
                                    <span className="text-xl text-slate-500 line-through">
                                        ₺{product.price.toFixed(2)}
                                    </span>
                                    {discountPercentage > 0 && (
                                        <span className="rounded-md bg-red-100 px-2 py-1 text-sm font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                            %{discountPercentage} İndirim
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                    ₺{product.price.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800">
                            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                                Ürün Bilgileri
                            </h3>
                            <dl className="space-y-2">
                                <div className="flex justify-between">
                                    <dt className="text-slate-600 dark:text-slate-400">
                                        Fiyat:
                                    </dt>
                                    <dd className="font-semibold text-slate-900 dark:text-white">
                                        {product.sale_price &&
                                        product.sale_price < product.price
                                            ? `₺${product.sale_price.toFixed(2)}`
                                            : `₺${product.price.toFixed(2)}`}
                                    </dd>
                                </div>
                                {product.category && (
                                    <div className="flex justify-between">
                                        <dt className="text-slate-600 dark:text-slate-400">
                                            Kategori:
                                        </dt>
                                        <dd className="font-semibold text-slate-900 dark:text-white">
                                            {product.category.name}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Sepete Ekle Butonu */}
                        <Button
                            size="lg"
                            disabled={addingToCart.has(product.id)}
                            onClick={() => handleAddToCart(product.id)}
                            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {addingToCart.has(product.id) ? (
                                <>
                                    <Spinner />
                                    <span className="ml-2">
                                        Sepete Ekleniyor
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Sepete Ekle
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                            Benzer Ürünler
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    product={relatedProduct}
                                    isAddingToCart={addingToCart.has(
                                        relatedProduct.id,
                                    )}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
