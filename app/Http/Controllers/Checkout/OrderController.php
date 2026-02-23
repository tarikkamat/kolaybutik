<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Services\Checkout\CartService;
use App\Services\Service\PaymentInquiryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected CartService $cartService,
        protected PaymentInquiryService $paymentInquiryService
    ) {
    }

    /**
     * Display order success page
     */
    public function success(Request $request): Response
    {
        $orderId = $request->get('orderId', 'N/A');
        $paymentId = $request->get('paymentId');
        $paymentMethod = $request->get('paymentMethod');

        // Sepeti temizle
        $this->cartService->clearCart();

        // Payment retrieve: Quick PWI ödemeleri için IYZIPAY_QUICK_PWI_* key'leri kullan
        $paymentData = null;
        if ($paymentId) {
            $paymentData = $this->retrievePaymentWithCorrectConnection($paymentId, $paymentMethod);
        }

        return Inertia::render('store/orders/success', [
            'orderId' => $orderId,
            'paymentId' => $paymentId,
            'paymentMethod' => $paymentMethod,
            'paymentData' => $paymentData,
        ]);
    }

    /**
     * Display order details page
     */
    public function show(Request $request, string $orderId): Response
    {
        $paymentId = $request->get('paymentId');
        $paymentMethod = $request->get('paymentMethod');

        // Payment retrieve: Quick PWI ödemeleri için IYZIPAY_QUICK_PWI_* key'leri kullan
        $paymentData = null;
        if ($paymentId) {
            $paymentData = $this->retrievePaymentWithCorrectConnection($paymentId, $paymentMethod);
        }

        return Inertia::render('store/orders/show', [
            'orderId' => $orderId,
            'paymentId' => $paymentId,
            'paymentMethod' => $paymentMethod,
            'paymentData' => $paymentData,
        ]);
    }

    /**
     * Display order failed page
     */
    public function failed(Request $request): Response
    {
        $orderId = $request->get('orderId');
        $errorMessage = $request->get('errorMessage', 'Sipariş işlemi sırasında bir hata oluştu.');

        return Inertia::render('store/orders/failed', [
            'orderId' => $orderId,
            'errorMessage' => $errorMessage,
        ]);
    }

    /**
     * Ödeme sorgulamasını doğru API key'leri ile yapar.
     * paymentMethod yoksa önce quick_pwi dener (store checkout'ta Quick PWI yaygın), bulunamazsa default.
     */
    private function retrievePaymentWithCorrectConnection(string $paymentId, ?string $paymentMethod): ?array
    {
        if ($paymentMethod === 'quick_pwi') {
            return $this->paymentInquiryService->retrievePayment($paymentId, null, 'quick_pwi');
        }

        $result = $this->paymentInquiryService->retrievePayment($paymentId, null, 'quick_pwi');
        if ($result && ($result['status'] ?? '') === 'success') {
            return $result;
        }

        return $this->paymentInquiryService->retrievePayment($paymentId, null, 'default');
    }
}

