<?php

namespace App\Services\Payment\Support;

use Iyzipay\Model\Locale;

class LocaleResolver
{
    public static function resolve(?string $locale): string
    {
        $normalized = strtolower(trim((string) $locale));

        return str_starts_with($normalized, 'en')
            ? Locale::EN
            : Locale::TR;
    }
}
