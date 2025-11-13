<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Product;
use App\Repositories\Product\CategoryRepository;
use App\Repositories\Product\ProductRepository;
use App\Services\Product\CategoryService;
use App\Services\Product\ProductService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repositories
        $this->app->singleton(CategoryRepository::class, function ($app) {
            return new CategoryRepository(new Category());
        });

        $this->app->singleton(ProductRepository::class, function ($app) {
            return new ProductRepository(new Product());
        });

        // Services
        $this->app->singleton(CategoryService::class, function ($app) {
            return new CategoryService($app->make(CategoryRepository::class));
        });

        $this->app->singleton(ProductService::class, function ($app) {
            return new ProductService($app->make(ProductRepository::class));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
