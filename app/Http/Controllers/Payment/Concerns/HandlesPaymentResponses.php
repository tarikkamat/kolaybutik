<?php

namespace App\Http\Controllers\Payment\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

trait HandlesPaymentResponses
{
    /**
     * Store 3DS session data
     */
    protected function storeThreedsSession(array $result): void
    {
        session([
            'threeds_payment_id' => $result['paymentId'],
            'threeds_conversationId' => $result['conversationId'],
            'threeds_conversation_id' => $result['conversationId'],
            'threeds_html_content' => $result['htmlContent'],
        ]);
    }

    /**
     * Get payment success response
     */
    protected function successResponse(array $result, bool $requires3ds = false): JsonResponse
    {
        $response = [
            'status' => 'success',
            'requires3ds' => $requires3ds,
        ];

        if ($requires3ds) {
            $response['redirectUrl'] = route('store.payment.threeds-page');
        } else {
            $response = array_merge($response, [
                'paymentId' => $result['paymentId'],
                'fraudStatus' => $result['fraudStatus'],
                'price' => $result['price'],
                'paidPrice' => $result['paidPrice'],
                'currency' => $result['currency'],
                'basketId' => $result['basketId'],
                'conversationId' => $result['conversationId'],
            ]);
        }

        return response()->json($response, 200);
    }

    /**
     * Get payment error response
     */
    protected function errorResponse(array $result, string $defaultMessage = 'Ödeme işlemi başarısız'): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $result['errorMessage'] ?? $defaultMessage,
            'errorCode' => $result['errorCode'] ?? 'UNKNOWN_ERROR',
        ], 400);
    }

    /**
     * Handle payment result with appropriate response
     *
     * @param  string|null  $paymentMethod  e.g. 'quick_pwi' so order success page can query payment with correct API keys
     */
    protected function handlePaymentResult(Request $request, array $result, bool $requires3ds = false, ?string $paymentMethod = null): JsonResponse|RedirectResponse
    {
        if ($result['status'] === 'success') {
            if ($requires3ds) {
                $this->storeThreedsSession($result);
            }

            if ($request->expectsJson() || $request->wantsJson()) {
                return $this->successResponse($result, $requires3ds);
            }

            if ($requires3ds) {
                return redirect()->route('store.payment.threeds-page');
            }

            // Callback'lerden sonra success sayfasına yönlendir
            $orderId = $result['paymentId'] ?? 'ORD-'.time();
            $params = [
                'orderId' => $orderId,
                'paymentId' => $result['paymentId'] ?? null,
            ];
            if ($paymentMethod !== null) {
                $params['paymentMethod'] = $paymentMethod;
            }
            return redirect()->route('store.orders.success', $params);
        }

        // Callback'lerden sonra error durumunda failed sayfasına yönlendir
        if (!$request->expectsJson() && !$request->wantsJson()) {
            $errorMessage = $result['errorMessage'] ?? 'Ödeme işlemi başarısız';
            return redirect()->route('store.orders.failed', [
                'errorMessage' => $errorMessage,
            ]);
        }

        return $this->errorResponse($result);
    }

    /**
     * Handle 3DS callback result
     */
    protected function handleThreedsCallbackResult(Request $request, array $result): JsonResponse|RedirectResponse
    {
        if ($result['status'] === 'success') {
            if ($request->expectsJson()) {
                return $this->successResponse($result, false);
            }

            // React success sayfasına direkt yönlendir
            $orderId = $result['paymentId'] ?? 'ORD-'.time();
            return redirect()->route('store.orders.success', [
                'orderId' => $orderId,
                'paymentId' => $result['paymentId'],
            ]);
        }

        Log::error('3DS Post Auth Error', [
            'errorMessage' => $result['errorMessage'] ?? 'Bilinmeyen hata',
            'errorCode' => $result['errorCode'] ?? 'UNKNOWN_ERROR',
        ]);

        $errorMessage = $result['errorMessage'] ?? '3DS doğrulama başarısız';

        if ($request->expectsJson()) {
            return $this->errorResponse($result, $errorMessage);
        }

        // React failed sayfasına direkt yönlendir
        return redirect()->route('store.orders.failed', [
            'errorMessage' => $errorMessage,
        ]);
    }
}

