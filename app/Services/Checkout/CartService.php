<?php

namespace App\Services\Checkout;

use App\Repositories\Checkout\CartRepository;
use App\Repositories\Product\ProductRepository;
use Illuminate\Support\Collection;

class CartService
{
    const float TAX_RATE = 0.20;
    const int SHIPPING_PRICE = 50;
    const int FREE_SHIPPING_THRESHOLD = 500;
    const int DEFAULT_QUANTITY = 1;

    public function __construct(
        protected CartRepository $cartRepository,
        protected ProductRepository $productRepository
    ) {
    }

    /**
     * Get session ID from request
     *
     * @return string
     */
    protected function getSessionId(): string
    {
        return session()->getId();
    }

    /**
     * Get all cart items with product details
     *
     * @return Collection
     */
    public function getCartItems(): Collection
    {
        $sessionId = $this->getSessionId();
        $cartItems = $this->cartRepository->getAll($sessionId);

        if (empty($cartItems)) {
            return collect([]);
        }

        $productIds = array_keys($cartItems);
        $products = $this->productRepository->model
            ->whereIn('id', $productIds)
            ->with('category')
            ->get()
            ->keyBy('id');

        $items = [];
        foreach ($cartItems as $productId => $cartItem) {
            $product = $products->get($productId);

            if (!$product) {
                // Product not found, remove from cart
                $this->cartRepository->remove($sessionId, $productId);
                continue;
            }

            $price = $product->sale_price ?? $product->price;
            $quantity = $cartItem['quantity'] ?? self::DEFAULT_QUANTITY;

            $items[] = [
                'id' => (int) $productId,
                'product_id' => $product->id,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'image' => $product->image,
                ],
                'quantity' => $quantity,
                'price' => $price * $quantity,
                'added_at' => $cartItem['added_at'] ?? null,
                'updated_at' => $cartItem['updated_at'] ?? null,
            ];
        }

        return collect($items);
    }

    /**
     * Add product to cart
     *
     * @param  int  $productId
     * @param  int  $quantity
     * @return array
     */
    public function addToCart(int $productId, int $quantity = self::DEFAULT_QUANTITY): array
    {
        $product = $this->productRepository->find($productId);

        if (!$product) {
            throw new \Exception("Product not found with ID: {$productId}");
        }

        $sessionId = $this->getSessionId();
        $itemData = [
            'quantity' => $quantity,
            'price' => $product->sale_price ?? $product->price,
        ];

        $this->cartRepository->addOrUpdate($sessionId, $productId, $itemData);

        return [
            'success' => true,
            'message' => 'Product added to cart',
            'item_count' => $this->cartRepository->getTotalQuantity($sessionId),
        ];
    }

    /**
     * Update cart item quantity
     *
     * @param  int  $productId
     * @param  int  $quantity
     * @return array
     */
    public function updateQuantity(int $productId, int $quantity): array
    {
        $sessionId = $this->getSessionId();
        $item = $this->cartRepository->getItem($sessionId, $productId);

        if (!$item) {
            throw new \Exception("Cart item not found for product ID: {$productId}");
        }

        $this->cartRepository->updateQuantity($sessionId, $productId, $quantity);

        return [
            'success' => true,
            'message' => 'Cart updated',
            'item_count' => $this->cartRepository->getTotalQuantity($sessionId),
        ];
    }

    /**
     * Remove item from cart
     *
     * @param  int  $productId
     * @return array
     */
    public function removeFromCart(int $productId): array
    {
        $sessionId = $this->getSessionId();
        $item = $this->cartRepository->getItem($sessionId, $productId);

        if (!$item) {
            throw new \Exception("Cart item not found for product ID: {$productId}");
        }

        $this->cartRepository->remove($sessionId, $productId);

        return [
            'success' => true,
            'message' => 'Item removed from cart',
            'item_count' => $this->cartRepository->getTotalQuantity($sessionId),
        ];
    }

    /**
     * Clear entire cart
     *
     * @return array
     */
    public function clearCart(): array
    {
        $sessionId = $this->getSessionId();
        $this->cartRepository->clear($sessionId);

        return [
            'success' => true,
            'message' => 'Cart cleared',
        ];
    }

    /**
     * Get cart summary (totals, item count, etc.)
     *
     * @return array
     */
    public function getCartSummary(): array
    {
        $items = $this->getCartItems();
        $subtotal = $items->sum('price');
        $tax = $subtotal * self::TAX_RATE;
        $shipping = $subtotal > self::FREE_SHIPPING_THRESHOLD ? 0 : self::SHIPPING_PRICE;
        $total = $subtotal + $tax + $shipping;

        return [
            'items' => $items->toArray(),
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'shipping' => round($shipping, 2),
            'total' => round($total, 2),
            'item_count' => $this->cartRepository->getTotalQuantity($this->getSessionId()),
        ];
    }

    /**
     * Get cart item count
     *
     * @return int
     */
    public function getItemCount(): int
    {
        $sessionId = $this->getSessionId();
        return $this->cartRepository->getTotalQuantity($sessionId);
    }
}

