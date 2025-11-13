<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Services\Product\CategoryService;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected CategoryService $categoryService
    ) {
    }

    /**
     * Display store index page with products
     */
    public function index(Request $request): Response
    {
        $filters = [
            'category_id' => $request->get('category_id'),
            'min_price' => $request->get('min_price'),
            'max_price' => $request->get('max_price'),
            'on_sale' => $request->get('filter') === 'on_sale',
            'search' => $request->get('search'),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_direction' => $request->get('sort_direction', 'desc'),
        ];

        $products = $this->productService->getPaginated(
            perPage: 12,
            filters: array_filter($filters)
        );

        $categories = $this->categoryService->getForSidebar(limit: 10);
        $featuredProducts = $this->productService->getFeatured(limit: 8);

        return Inertia::render('store/index', [
            'products' => $products,
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'filters' => $filters,
        ]);
    }
}

