<?php

namespace App\Repositories\Checkout;

use Illuminate\Support\Facades\Redis;

class CartRepository
{
    /**
     * Get cart key for session
     *
     * @param  string  $sessionId
     * @return string
     */
    protected function getCartKey(string $sessionId): string
    {
        return "cart:{$sessionId}";
    }

    /**
     * Get all cart items
     *
     * @param  string  $sessionId
     * @return array
     */
    public function getAll(string $sessionId): array
    {
        $key = $this->getCartKey($sessionId);
        $items = Redis::hgetall($key);

        if (empty($items)) {
            return [];
        }

        $cartItems = [];
        foreach ($items as $productId => $data) {
            $cartItems[$productId] = json_decode($data, true);
        }

        return $cartItems;
    }

    /**
     * Get cart item by product ID
     *
     * @param  string  $sessionId
     * @param  int  $productId
     * @return array|null
     */
    public function getItem(string $sessionId, int $productId): ?array
    {
        $key = $this->getCartKey($sessionId);
        $data = Redis::hget($key, (string) $productId);

        if (!$data) {
            return null;
        }

        return json_decode($data, true);
    }

    /**
     * Add or update cart item
     *
     * @param  string  $sessionId
     * @param  int  $productId
     * @param  array  $itemData
     * @return bool
     */
    public function addOrUpdate(string $sessionId, int $productId, array $itemData): bool
    {
        $key = $this->getCartKey($sessionId);
        $existingItem = $this->getItem($sessionId, $productId);

        if ($existingItem) {
            // Update quantity if item exists
            $itemData['quantity'] = ($existingItem['quantity'] ?? 0) + ($itemData['quantity'] ?? 1);
        } else {
            // Set default quantity if not provided
            $itemData['quantity'] = $itemData['quantity'] ?? 1;
        }

        // Set timestamp
        $itemData['added_at'] = now()->toIso8601String();
        $itemData['updated_at'] = now()->toIso8601String();

        return Redis::hset($key, (string) $productId, json_encode($itemData)) !== false;
    }

    /**
     * Update cart item quantity
     *
     * @param  string  $sessionId
     * @param  int  $productId
     * @param  int  $quantity
     * @return bool
     */
    public function updateQuantity(string $sessionId, int $productId, int $quantity): bool
    {
        $item = $this->getItem($sessionId, $productId);

        if (!$item) {
            return false;
        }

        if ($quantity <= 0) {
            return $this->remove($sessionId, $productId);
        }

        $item['quantity'] = $quantity;
        $item['updated_at'] = now()->toIso8601String();

        $key = $this->getCartKey($sessionId);
        return Redis::hset($key, (string) $productId, json_encode($item)) !== false;
    }

    /**
     * Remove item from cart
     *
     * @param  string  $sessionId
     * @param  int  $productId
     * @return bool
     */
    public function remove(string $sessionId, int $productId): bool
    {
        $key = $this->getCartKey($sessionId);
        return Redis::hdel($key, (string) $productId) > 0;
    }

    /**
     * Clear entire cart
     *
     * @param  string  $sessionId
     * @return bool
     */
    public function clear(string $sessionId): bool
    {
        $key = $this->getCartKey($sessionId);
        return Redis::del($key) > 0;
    }

    /**
     * Get cart item count
     *
     * @param  string  $sessionId
     * @return int
     */
    public function getItemCount(string $sessionId): int
    {
        $key = $this->getCartKey($sessionId);
        return (int) Redis::hlen($key);
    }

    /**
     * Get total quantity of items in cart
     *
     * @param  string  $sessionId
     * @return int
     */
    public function getTotalQuantity(string $sessionId): int
    {
        $items = $this->getAll($sessionId);
        $total = 0;

        foreach ($items as $item) {
            $total += $item['quantity'] ?? 0;
        }

        return $total;
    }

    /**
     * Check if cart has items
     *
     * @param  string  $sessionId
     * @return bool
     */
    public function hasItems(string $sessionId): bool
    {
        return $this->getItemCount($sessionId) > 0;
    }
}

