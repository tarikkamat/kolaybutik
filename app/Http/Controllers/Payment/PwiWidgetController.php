<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Services\Payment\PwiWidgetService;
use App\Services\Product\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PwiWidgetController extends Controller
{
    public function __construct(
        protected PwiWidgetService $pwiWidgetService,
        protected ProductService $productService,
    ) {}

    /**
     * Ürün için widget init (widgetToken + alışveriş kredisi özeti).
     * Fiyat client'tan değil, veritabanındaki üründen alınır.
     */
    public function initialize(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate([
            'locale' => 'nullable|string|in:tr,en',
        ]);

        $product = $this->productService->findBySlugOrFail($slug);

        return $this->respond(
            $this->pwiWidgetService->initialize($product, $validated['locale'] ?? null)
        );
    }

    /**
     * "Alışveriş Kredisi" açıldığında banka bazlı planlar.
     */
    public function paymentPlan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'widgetToken' => 'required|uuid',
            'locale' => 'nullable|string|in:tr,en',
        ]);

        return $this->respond(
            $this->pwiWidgetService->paymentPlans($validated['widgetToken'], $validated['locale'] ?? null)
        );
    }

    private function respond(array $result): JsonResponse
    {
        if (($result['status'] ?? null) !== 'success') {
            return response()->json([
                'status' => 'error',
                'errorMessage' => $result['errorMessage'] ?? 'Widget bilgisi alınamadı',
            ], 502);
        }

        return response()->json($result);
    }
}
