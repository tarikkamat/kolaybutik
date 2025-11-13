<?php

return [
    /*
    |--------------------------------------------------------------------------
    | iyzico API Configuration
    |--------------------------------------------------------------------------
    |
    | iyzico API ayarları. Bu değerler .env dosyasından alınır.
    |
    */

    'api_key' => env('IYZIPAY_API_KEY'),
    'secret_key' => env('IYZIPAY_SECRET_KEY'),
    'base_url' => env('IYZIPAY_BASE_URL', 'https://api.iyzipay.com'),
    'currency' => env('IYZIPAY_CURRENCY', 'TRY'),

    /*
    |--------------------------------------------------------------------------
    | Quick PWI API Configuration
    |--------------------------------------------------------------------------
    |
    | Quick PWI için farklı API credentials kullanılabilir.
    | Eğer belirtilmezse, yukarıdaki ana credentials kullanılır.
    |
    */
    'quick_pwi' => [
        'api_key' => env('IYZIPAY_QUICK_PWI_API_KEY') ?: env('IYZIPAY_API_KEY'),
        'secret_key' => env('IYZIPAY_QUICK_PWI_SECRET_KEY') ?: env('IYZIPAY_SECRET_KEY'),
        'base_url' => env('IYZIPAY_QUICK_PWI_BASE_URL') ?: env('IYZIPAY_BASE_URL', 'https://api.iyzipay.com'),
    ],
];
