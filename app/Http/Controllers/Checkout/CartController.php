<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Services\Checkout\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {
    }

    /**
     * Display cart page
     */
    public function index(): Response
    {
        $summary = $this->cartService->getCartSummary();

        return Inertia::render('store/cart/index', [
            'items' => $summary['items'],
            'subtotal' => $summary['subtotal'],
            'tax' => $summary['tax'],
            'shipping' => $summary['shipping'],
            'total' => $summary['total'],
        ]);
    }

    /**
     * Add product to cart
     */
    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'sometimes|integer|min:1|max:100',
        ]);

        try {
            $result = $this->cartService->addToCart(
                $request->product_id,
                $request->quantity ?? 1
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, int $productId): JsonResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        try {
            $result = $this->cartService->updateQuantity(
                $productId,
                $request->quantity
            );

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove item from cart
     */
    public function remove(int $productId): JsonResponse
    {
        try {
            $result = $this->cartService->removeFromCart($productId);

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Clear entire cart
     */
    public function clear(): JsonResponse
    {
        try {
            $result = $this->cartService->clearCart();

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get cart count (for navbar badge)
     */
    public function count(): JsonResponse
    {
        $count = $this->cartService->getItemCount();

        return response()->json([
            'count' => $count,
        ]);
    }
}

