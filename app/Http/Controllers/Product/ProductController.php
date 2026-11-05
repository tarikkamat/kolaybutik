<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Services\Product\ProductService;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {
    }

    /**
     * Display product detail page
     */
    public function show(string $slug): Response
    {
        $product = $this->productService->findBySlugOrFail($slug);

        $relatedProducts = $this->productService->getRelated($product, limit: 4);
        $latestProducts = $this->productService->getLatest(limit: 6);

        return Inertia::render('store/products/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'latestProducts' => $latestProducts,
        ]);
    }
}

