<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait RedisCache
{
    /**
     * Cache duration in seconds (1 hour)
     */
    protected int $cacheDuration = 3600;

    /**
     * Get cache key prefix for the service
     *
     * @return string
     */
    protected function getCachePrefix(): string
    {
        $className = class_basename(static::class);
        $className = str_replace('Service', '', $className);

        return strtolower($className);
    }

    /**
     * Generate cache key
     *
     * @param  string  $key
     * @return string
     */
    protected function getCacheKey(string $key): string
    {
        return "{$this->getCachePrefix()}:{$key}";
    }

    /**
     * Remember cache with default duration
     *
     * @param  string  $key
     * @param  callable  $callback
     * @param  int|null  $duration
     * @return mixed
     */
    protected function remember(string $key, callable $callback, ?int $duration = null): mixed
    {
        $cacheKey = $this->getCacheKey($key);
        $duration = $duration ?? $this->cacheDuration;

        return Cache::remember($cacheKey, $duration, $callback);
    }

    /**
     * Forget cache by key
     *
     * @param  string  $key
     * @return bool
     */
    protected function forget(string $key): bool
    {
        return Cache::forget($this->getCacheKey($key));
    }

    /**
     * Clear all cache for this service
     *
     * @return void
     */
    protected function clearCache(): void
    {
        $pattern = $this->getCachePrefix().':*';
        Cache::flush(); // For Redis, you might want to use a more specific pattern
    }

    /**
     * Set cache duration
     *
     * @param  int  $seconds
     * @return void
     */
    protected function setCacheDuration(int $seconds): void
    {
        $this->cacheDuration = $seconds;
    }
}

