<?php

namespace App\Repositories\Product;

use App\Models\Category;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class CategoryRepository extends BaseRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all categories with products count
     */
    public function getAllWithProductsCount(): Collection
    {
        return $this->model->newQuery()
            ->withCount('products')
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get categories that have products
     */
    public function getWithProducts(): Collection
    {
        return $this->model->newQuery()
            ->has('products')
            ->withCount('products')
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Find category by slug
     */
    public function findBySlug(string $slug): ?Category
    {
        return $this->model->newQuery()
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Find category by slug with products
     */
    public function findBySlugWithProducts(string $slug): ?Category
    {
        return $this->model->newQuery()
            ->with('products')
            ->withCount('products')
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Get category with its products (paginated)
     */
    public function getWithPaginatedProducts(int $categoryId, int $perPage = 15): Collection|Model
    {
        $category = $this->model->newQuery()->find($categoryId);

        if ($category) {
            $category->load([
                'products' => function ($query) use ($perPage) {
                    $query->orderBy('created_at', 'desc')->paginate($perPage);
                },
            ]);
        }

        return $category;
    }

    /**
     * Search categories by name
     */
    public function search(string $query): Collection
    {
        return $this->model->newQuery()
            ->where('name', 'like', '%'.$query.'%')
            ->withCount('products')
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get popular categories (most products)
     */
    public function getPopular(int $limit = 5): Collection
    {
        return $this->getOrderedByProductsCount('desc', $limit);
    }

    /**
     * Get categories ordered by products count
     */
    public function getOrderedByProductsCount(string $direction = 'desc', ?int $limit = null): Collection
    {
        $query = $this->model->newQuery()
            ->withCount('products')
            ->orderBy('products_count', $direction);

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }

    /**
     * Get categories with minimum product count
     */
    public function getWithMinimumProducts(int $minCount = 1): Collection
    {
        return $this->model->newQuery()
            ->withCount('products')
            ->having('products_count', '>=', $minCount)
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Get all categories ordered by name
     */
    public function getAllOrdered(): Collection
    {
        return $this->model->newQuery()
            ->orderBy('name', 'asc')
            ->get();
    }
}
