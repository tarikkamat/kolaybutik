import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Product } from '@/types/models';
import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    isAddingToCart: boolean;
    onAddToCart: (productId: number) => void;
}

export function ProductCard({
    product,
    isAddingToCart,
    onAddToCart,
}: ProductCardProps) {
    return (
        <div className="group relative rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-800">
            <Link href={`/store/products/${product.slug}`} className="block">
                {product.image && (
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Sepete Ekle Butonu - Hover'da görünür */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Button
                                variant="default"
                                size="sm"
                                disabled={isAddingToCart}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onAddToCart(product.id);
                                }}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <Spinner />
                                        <span className="ml-2">
                                            Sepete Ekleniyor
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Sepete Ekle
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
                <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white">
                    {product.name}
                </h3>
                {product.category && (
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                        {product.category.name}
                    </p>
                )}
                <div className="flex items-center gap-2">
                    {product.sale_price ? (
                        <>
                            <span className="text-lg font-bold text-indigo-600">
                                ₺{product.sale_price.toFixed(2)}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                                ₺{product.price.toFixed(2)}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            ₺{product.price.toFixed(2)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}
