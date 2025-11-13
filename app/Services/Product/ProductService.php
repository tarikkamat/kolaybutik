<?php

namespace App\Services\Product;

use App\Models\Product;
use App\Repositories\Product\ProductRepository;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService extends BaseService
{
    public function __construct(ProductRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Get all products with category relation
     *
     * @return Collection
     */
    public function getAllWithCategory(): Collection
    {
        return $this->remember('all:with-category', function () {
            return $this->repository->getAllWithCategory();
        });
    }

    /**
     * Get paginated products with optional filters
     *
     * @param  int  $perPage
     * @param  array  $filters
     * @return LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->repository->getPaginated($perPage, $filters);
    }

    /**
     * Find product by slug or fail
     *
     * @param  string  $slug
     * @return Product
     * @throws ModelNotFoundException
     */
    public function findBySlugOrFail(string $slug): Product
    {
        $product = $this->findBySlug($slug);

        if (!$product) {
            throw new ModelNotFoundException(
                "Product not found with slug: {$slug}"
            );
        }

        return $product;
    }

    /**
     * Find product by slug with category
     *
     * @param  string  $slug
     * @return Product|null
     */
    public function findBySlug(string $slug): ?Product
    {
        return $this->remember("slug:{$slug}", function () use ($slug) {
            return $this->repository->findBySlug($slug);
        });
    }

    /**
     * Get products by category
     *
     * @param  int  $categoryId
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function getByCategory(int $categoryId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getByCategory($categoryId, $perPage);
    }

    /**
     * Get products by category slug
     *
     * @param  string  $categorySlug
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function getByCategorySlug(string $categorySlug, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getByCategorySlug($categorySlug, $perPage);
    }

    /**
     * Get products on sale
     *
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function getOnSale(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getOnSale($perPage);
    }

    /**
     * Get featured products
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getFeatured(int $limit = 8): Collection
    {
        return $this->remember("featured:{$limit}", function () use ($limit) {
            return $this->repository->getFeatured($limit);
        });
    }

    /**
     * Get latest products
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getLatest(int $limit = 12): Collection
    {
        return $this->remember("latest:{$limit}", function () use ($limit) {
            return $this->repository->getLatest($limit);
        });
    }

    /**
     * Search products by name
     *
     * @param  string  $query
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->search($query, $perPage);
    }

    /**
     * Get related products (same category, exclude current)
     *
     * @param  Product  $product
     * @param  int  $limit
     * @return Collection
     */
    public function getRelated(Product $product, int $limit = 4): Collection
    {
        return $this->repository->getRelated($product, $limit);
    }

    /**
     * Get products with price range
     *
     * @param  float  $minPrice
     * @param  float  $maxPrice
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function getByPriceRange(float $minPrice, float $maxPrice, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getByPriceRange($minPrice, $maxPrice, $perPage);
    }

    /**
     * Get products sorted by price
     *
     * @param  string  $direction  ('asc' or 'desc')
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function sortByPrice(string $direction = 'asc', int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->sortByPrice($direction, $perPage);
    }

    /**
     * Calculate discount percentage
     *
     * @param  Product  $product
     * @return int
     */
    public function getDiscountPercentage(Product $product): int
    {
        if (!$this->isOnSale($product)) {
            return 0;
        }

        return (int) round((($product->price - $product->sale_price) / $product->price) * 100);
    }

    /**
     * Check if product has sale price
     *
     * @param  Product  $product
     * @return bool
     */
    public function isOnSale(Product $product): bool
    {
        return !is_null($product->sale_price) && $product->sale_price < $product->price;
    }

    /**
     * Get final price (sale price if available, otherwise regular price)
     *
     * @param  Product  $product
     * @return float
     */
    public function getFinalPrice(Product $product): float
    {
        return $this->isOnSale($product) ? $product->sale_price : $product->price;
    }

    /**
     * Format price for display
     *
     * @param  float  $price
     * @param  string  $currency
     * @return string
     */
    public function formatPrice(float $price, string $currency = '₺'): string
    {
        return number_format($price, 2, ',', '.').' '.$currency;
    }
}
