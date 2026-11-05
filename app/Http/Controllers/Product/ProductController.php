<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Services\Payment\PwiWidgetService;
use App\Services\Product\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected PwiWidgetService $pwiWidgetService,
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

    /**
     * Pay with iyzico widget verisi (taksit + alışveriş kredisi planları).
     * Fiyat client'tan değil, veritabanındaki üründen alınır.
     */
    public function pwiWidget(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|in:tr,en',
        ]);

        $product = $this->productService->findBySlugOrFail($slug);
        $result = $this->pwiWidgetService->getProductWidget($product, $validated['locale'] ?? null);

        if (($result['status'] ?? null) !== 'success') {
            return response()->json([
                'status' => 'error',
                'errorMessage' => $result['errorMessage'] ?? 'Widget bilgisi alınamadı',
            ], 502);
        }

        return response()->json($result);
    }
}
