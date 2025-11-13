<?php

namespace App\Services\Product;

use App\Models\Category;
use App\Repositories\Product\CategoryRepository;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryService extends BaseService
{
    public function __construct(CategoryRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Find category by slug or fail
     *
     * @param  string  $slug
     * @return Category
     * @throws ModelNotFoundException
     */
    public function findBySlugOrFail(string $slug): Category
    {
        $category = $this->findBySlug($slug);

        if (!$category) {
            throw new ModelNotFoundException(
                "Category not found with slug: {$slug}"
            );
        }

        return $category;
    }

    /**
     * Find category by slug
     *
     * @param  string  $slug
     * @return Category|null
     */
    public function findBySlug(string $slug): ?Category
    {
        return $this->remember("slug:{$slug}", function () use ($slug) {
            return $this->repository->findBySlug($slug);
        });
    }

    /**
     * Find category by slug with products
     *
     * @param  string  $slug
     * @return Category|null
     */
    public function findBySlugWithProducts(string $slug): ?Category
    {
        return $this->remember("slug:{$slug}:with-products", function () use ($slug) {
            return $this->repository->findBySlugWithProducts($slug);
        });
    }

    /**
     * Get category with its products (paginated)
     *
     * @param  int  $categoryId
     * @param  int  $perPage
     * @return Category|null
     */
    public function getWithPaginatedProducts(int $categoryId, int $perPage = 15): ?Category
    {
        return $this->repository->getWithPaginatedProducts($categoryId, $perPage);
    }

    /**
     * Search categories by name
     *
     * @param  string  $query
     * @return Collection
     */
    public function search(string $query): Collection
    {
        return $this->repository->search($query);
    }

    /**
     * Get popular categories (most products)
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getPopular(int $limit = 5): Collection
    {
        return $this->remember("popular:{$limit}", function () use ($limit) {
            return $this->repository->getPopular($limit);
        });
    }

    /**
     * Get categories with minimum product count
     *
     * @param  int  $minCount
     * @return Collection
     */
    public function getWithMinimumProducts(int $minCount = 1): Collection
    {
        return $this->repository->getWithMinimumProducts($minCount);
    }

    /**
     * Get all categories ordered by name
     *
     * @return Collection
     */
    public function getAllOrdered(): Collection
    {
        return $this->remember('all:ordered', function () {
            return $this->repository->getAllOrdered();
        });
    }

    /**
     * Get categories for navigation menu
     * Only categories with products
     *
     * @return Collection
     */
    public function getForNavigation(): Collection
    {
        return $this->getWithProducts();
    }

    /**
     * Get categories that have products
     *
     * @return Collection
     */
    public function getWithProducts(): Collection
    {
        return $this->remember('with-products', function () {
            return $this->repository->getWithProducts();
        });
    }

    /**
     * Get categories for sidebar
     * With products count, ordered by popularity
     *
     * @param  int  $limit
     * @return Collection
     */
    public function getForSidebar(int $limit = 10): Collection
    {
        return $this->remember("sidebar:{$limit}", function () use ($limit) {
            return $this->repository->getOrderedByProductsCount('desc', $limit);
        });
    }

    /**
     * Get category statistics
     *
     * @param  Category  $category
     * @return array
     */
    public function getStatistics(Category $category): array
    {
        $category->loadCount('products');

        return [
            'total_products' => $category->products_count,
            'category_name' => $category->name,
            'category_slug' => $category->slug,
        ];
    }

    /**
     * Check if category has products
     *
     * @param  Category  $category
     * @return bool
     */
    public function hasProducts(Category $category): bool
    {
        return $category->products()->count() > 0;
    }

    /**
     * Get products count for category
     *
     * @param  Category  $category
     * @return int
     */
    public function getProductsCount(Category $category): int
    {
        return $category->products()->count();
    }

    /**
     * Get categories grouped by first letter
     *
     * @return array
     */
    public function getGroupedByLetter(): array
    {
        $categories = $this->getAllWithProductsCount();

        return $categories->groupBy(function ($category) {
            return strtoupper(substr($category->name, 0, 1));
        })->toArray();
    }

    /**
     * Get all categories with products count
     *
     * @return Collection
     */
    public function getAllWithProductsCount(): Collection
    {
        return $this->remember('all:with-count', function () {
            return $this->repository->getAllWithProductsCount();
        });
    }

    /**
     * Get breadcrumb data for category
     *
     * @param  Category  $category
     * @return array
     */
    public function getBreadcrumb(Category $category): array
    {
        return [
            ['name' => 'Ana Sayfa', 'url' => route('home')],
            ['name' => 'Kategoriler', 'url' => route('categories.index')],
            ['name' => $category->name, 'url' => route('categories.show', $category->slug)],
        ];
    }
}
