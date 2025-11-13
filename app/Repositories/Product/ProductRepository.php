<?php

namespace App\Repositories\Product;

use App\Models\Product;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all products with category relation
     *
     * @return Collection
     */
    public function getAllWithCategory(): Collection
    {
        return $this->model->newQuery()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->get();
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
        $query = $this->model->newQuery()->with('category');

        // Apply filters
        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['on_sale']) && $filters['on_sale']) {
            $query->whereNotNull('sale_price');
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', '%'.$filters['search'].'%');
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);

        return $query->paginate($perPage);
    }

    /**
     * Find product by slug with category
     *
     * @param  string  $slug
     * @return Product|null
     */
    public function findBySlug(string $slug): ?Product
    {
        return $this->model->newQuery()
            ->with('category')
            ->where('slug', $slug)
            ->first();
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
        return $this->model->newQuery()
            ->with('category')
            ->where('category_id', $categoryId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
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
        return $this->model->newQuery()
            ->with('category')
            ->whereHas('category', function ($query) use ($categorySlug) {
                $query->where('slug', $categorySlug);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get products on sale
     *
     * @param  int  $perPage
     * @return LengthAwarePaginator
     */
    public function getOnSale(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('category')
            ->whereNotNull('sale_price')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get featured products (randomly for demo purposes)
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getFeatured(int $limit = 8): Collection
    {
        return $this->model->newQuery()
            ->with('category')
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    /**
     * Get latest products
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getLatest(int $limit = 12): Collection
    {
        return $this->model->newQuery()
            ->with('category')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
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
        return $this->model->newQuery()
            ->with('category')
            ->where('name', 'like', '%'.$query.'%')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
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
        return $this->model->newQuery()
            ->with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
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
        return $this->model->newQuery()
            ->with('category')
            ->whereBetween('price', [$minPrice, $maxPrice])
            ->orderBy('price', 'asc')
            ->paginate($perPage);
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
        return $this->model->newQuery()
            ->with('category')
            ->orderBy('price', $direction)
            ->paginate($perPage);
    }
}
