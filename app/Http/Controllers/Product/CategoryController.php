<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Services\Product\CategoryService;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
        protected ProductService $productService
    ) {
    }

    /**
     * Display all categories
     */
    public function index(): Response
    {
        $categories = $this->categoryService->getAllWithProductsCount();

        return Inertia::render('store/categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display category page with products
     */
    public function show(Request $request, string $slug): Response
    {
        $category = $this->categoryService->findBySlugOrFail($slug);

        $perPage = $request->get('per_page', 12);
        $products = $this->productService->getByCategorySlug($slug, $perPage);

        $relatedCategories = $this->categoryService->getPopular(limit: 5);

        return Inertia::render('store/categories/show', [
            'category' => $category,
            'products' => $products,
            'relatedCategories' => $relatedCategories,
        ]);
    }
}

