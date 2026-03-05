<?php

return [
    /*
    |--------------------------------------------------------------------------
    | iyzico API Configuration
    |--------------------------------------------------------------------------
    | iyzico API ayarları (statik).
    | Dikkat: Güvenlik için normalde .env kullanılması önerilir.
    |
    */

    'api_key' => 'sandbox-nfjLNP7oZEcqwa4eUgaxm2UOrbLE5hoA',
    'secret_key' => 'sandbox-704DwzYCbvbuBQPvbJCfUVw0A75X1NBL',
    'base_url' => 'https://sandbox-api.iyzipay.com',
    'currency' => 'TRY',

    /*
    |--------------------------------------------------------------------------
    | Quick PWI API Configuration
    |--------------------------------------------------------------------------
    | Quick PWI için statik API credentials.
    |
    */
    'quick_pwi' => [
        'api_key' => 'sandbox-Qjze6UXaEP6YJhp6RDzOVJzK5FcH99Ex',
        'secret_key' => 'vglD1HuU4Y3XK4xOKCDJYrq8u5rdZMv2',
        'base_url' => 'https://sandbox-api.iyzipay.com',
    ],

    /*
    |--------------------------------------------------------------------------
    | Subscription API Configuration
    |--------------------------------------------------------------------------
    | Abonelik işlemleri için statik API credentials.
    |
    */
    'subscription' => [
        'api_key' => 'sandbox-gSqHJaZ5buD0cPSGr1TAX82CiOwhEERl',
        'secret_key' => 'sandbox-cRTC3hCnS12HiZL7bSY4q1GJM1KQ4B49',
        'base_url' => 'https://sandbox-api.iyzipay.com',
    ],

    /*
    |--------------------------------------------------------------------------
    | Card Storage API Configuration
    |--------------------------------------------------------------------------
    | Kart saklama işlemleri için statik API credentials.
    |
    */
    'card_storage' => [
        'api_key' => 'sandbox-Jc8tzIayb0nI3p67JfGekyMPDB56ewUD',
        'secret_key' => 'sandbox-zMMHV5pDVDiQcz4FvzPA3cjxfEk7VD2A',
        'base_url' => 'https://sandbox-api.iyzipay.com',
        'default_card_user_key' => "af8ac38b-93a8-74b8-fde3-26b2a75740b8",
    ],
];
