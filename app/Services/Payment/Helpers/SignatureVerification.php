<?php

namespace App\Services\Payment\Helpers;

class SignatureVerification
{
    /**
     * Calculate HMAC SHA256 signature
     *
     * @param  array  $params
     * @param  string  $secretKey
     * @return string
     */
    public static function calculateHmacSHA256Signature(array $params, string $secretKey): string
    {
        $dataToSign = implode(':', $params);
        $mac = hash_hmac('sha256', $dataToSign, $secretKey, true);
        return bin2hex($mac);
    }

    /**
     * Verify checkout form signature
     *
     * @param  string  $signature
     * @param  string  $paymentStatus
     * @param  string  $paymentId
     * @param  string  $currency
     * @param  string  $basketId
     * @param  string  $conversationId
     * @param  string  $paidPrice
     * @param  string  $price
     * @param  string  $token
     * @param  string  $secretKey
     * @return bool
     */
    public static function verifyCheckoutFormSignature(
        string $signature,
        string $paymentStatus,
        string $paymentId,
        string $currency,
        string $basketId,
        string $conversationId,
        string $paidPrice,
        string $price,
        string $token,
        string $secretKey
    ): bool {
        $calculatedSignature = self::calculateHmacSHA256Signature([
            $paymentStatus,
            $paymentId,
            $currency,
            $basketId,
            $conversationId,
            $paidPrice,
            $price,
            $token,
        ], $secretKey);

        return $signature === $calculatedSignature;
    }

    /**
     * Verify Pay with iyzico signature
     *
     * @param  string  $signature
     * @param  string  $paymentStatus
     * @param  string  $paymentId
     * @param  string  $currency
     * @param  string  $basketId
     * @param  string  $conversationId
     * @param  string  $paidPrice
     * @param  string  $price
     * @param  string  $token
     * @param  string  $secretKey
     * @return bool
     */
    public static function verifyPayWithIyzicoSignature(
        string $signature,
        string $paymentStatus,
        string $paymentId,
        string $currency,
        string $basketId,
        string $conversationId,
        string $paidPrice,
        string $price,
        string $token,
        string $secretKey
    ): bool {
        // Pay with iyzico için aynı signature verification kullanılır
        return self::verifyCheckoutFormSignature(
            $signature,
            $paymentStatus,
            $paymentId,
            $currency,
            $basketId,
            $conversationId,
            $paidPrice,
            $price,
            $token,
            $secretKey
        );
    }
}

