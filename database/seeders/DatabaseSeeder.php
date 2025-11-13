<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Kategorileri oluştur
        $elektronik = Category::firstOrCreate(
            ['slug' => 'elektronik'],
            [
                'name' => 'Elektronik',
            ]
        );

        $ayakkabi = Category::firstOrCreate(
            ['slug' => 'ayakkabi'],
            [
                'name' => 'Ayakkabı',
            ]
        );

        $giyim = Category::firstOrCreate(
            ['slug' => 'giyim'],
            [
                'name' => 'Giyim',
            ]
        );

        // Ürünleri oluştur
        $products = [
            // Elektronik
            [
                'name' => 'iPad',
                'slug' => 'ipad',
                'price' => 8999.00,
                'sale_price' => 7999.00,
                'image' => '/product-images/iPad.jpg',
                'category_id' => $elektronik->id,
            ],
            [
                'name' => 'Lenovo Tablet',
                'slug' => 'lenovo-tablet',
                'price' => 3499.00,
                'sale_price' => null,
                'image' => '/product-images/Lenovo-Tablet.jpg',
                'category_id' => $elektronik->id,
            ],
            [
                'name' => 'Samsung Galaxy S25',
                'slug' => 'samsung-galaxy-s25',
                'price' => 24999.00,
                'sale_price' => 21999.00,
                'image' => '/product-images/Samsung-Galaxy-S25.jpg',
                'category_id' => $elektronik->id,
            ],
            [
                'name' => 'MacBook Air',
                'slug' => 'macbook-air',
                'price' => 24999.00,
                'sale_price' => null,
                'image' => '/product-images/Macbook-Air.jpeg',
                'category_id' => $elektronik->id,
            ],
            [
                'name' => 'iPhone 17',
                'slug' => 'iphone-17',
                'price' => 32999.00,
                'sale_price' => 29999.00,
                'image' => '/product-images/iPhone-17.jpeg',
                'category_id' => $elektronik->id,
            ],

            // Ayakkabı
            [
                'name' => 'Nike Air',
                'slug' => 'nike-air',
                'price' => 3499.00,
                'sale_price' => 2999.00,
                'image' => '/product-images/Nike-Air.jpg',
                'category_id' => $ayakkabi->id,
            ],
            [
                'name' => 'Converse',
                'slug' => 'converse',
                'price' => 1999.00,
                'sale_price' => null,
                'image' => '/product-images/Converse.jpeg',
                'category_id' => $ayakkabi->id,
            ],
            [
                'name' => 'Vans',
                'slug' => 'vans',
                'price' => 2499.00,
                'sale_price' => 1999.00,
                'image' => '/product-images/Vans.jpg',
                'category_id' => $ayakkabi->id,
            ],

            // Giyim
            [
                'name' => 'Siyah T-Shirt',
                'slug' => 'siyah-tshirt',
                'price' => 299.00,
                'sale_price' => 199.00,
                'image' => '/product-images/Siyah-Tshirt.jpg',
                'category_id' => $giyim->id,
            ],
        ];

        foreach ($products as $productData) {
            Product::firstOrCreate(
                ['slug' => $productData['slug']],
                $productData
            );
        }
    }
}
