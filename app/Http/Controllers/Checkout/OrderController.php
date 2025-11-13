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

        // Sepeti temizle
        $this->cartService->clearCart();

        // Payment retrieve yap (eğer paymentId varsa)
        $paymentData = null;
        if ($paymentId) {
            $paymentData = $this->paymentInquiryService->retrievePayment($paymentId);
        }

        return Inertia::render('store/orders/success', [
            'orderId' => $orderId,
            'paymentId' => $paymentId,
            'paymentData' => $paymentData,
        ]);
    }

    /**
     * Display order details page
     */
    public function show(Request $request, string $orderId): Response
    {
        $paymentId = $request->get('paymentId');

        // Payment retrieve yap
        $paymentData = null;
        if ($paymentId) {
            $paymentData = $this->paymentInquiryService->retrievePayment($paymentId);
        }

        return Inertia::render('store/orders/show', [
            'orderId' => $orderId,
            'paymentId' => $paymentId,
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
}

