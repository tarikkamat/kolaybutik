<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CheckoutFormPaymentRequest;
use App\Http\Requests\Payment\CheckoutFormRequest;
use App\Http\Controllers\Payment\Concerns\HandlesPaymentResponses;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AlternativePaymentController extends Controller
{
    use HandlesPaymentResponses;

    public function __construct(
        protected PaymentService $paymentService
    ) {
    }

    /**
     * Initialize checkout form with iyzico
     */
    public function initializeCheckoutForm(CheckoutFormRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->initializeCheckoutForm($data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Process checkout form payment with iyzico
     */
    public function processCheckoutFormPayment(CheckoutFormPaymentRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->processCheckoutFormPayment($data);

        return $this->handlePaymentResult($request, $result);
    }

    /**
     * Initialize Pay with iyzico payment
     */
    public function initializePayWithIyzico(CheckoutFormRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->initializePayWithIyzico($data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Process iyzico payment (callback için)
     */
    public function processIyzicoPayment(CheckoutFormRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->processIyzicoPayment($data);

        return $this->handlePaymentResult($request, $result);
    }

    /**
     * Initialize Quick PWI checkout form
     */
    public function initializeQuickPwi(CheckoutFormRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->initializeQuickPwi($data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Process quick pay with iyzico (Quick PWI) - callback için
     */
    public function processIyzicoQuickPayment(CheckoutFormRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->processIyzicoQuickPayment($data);

        return $this->handlePaymentResult($request, $result);
    }

    /**
     * Handle Quick PWI callback from iyzico
     */
    public function quickPwiCallback(Request $request): JsonResponse|RedirectResponse
    {
        $token = $request->input('token');

        if (!$token) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'errorMessage' => 'Token bulunamadı',
                    'errorCode' => 'MISSING_TOKEN'
                ], 400);
            }

            return redirect()->route('store.orders.failed', [
                'errorMessage' => 'Token bulunamadı'
            ]);
        }

        $data = [
            'token' => $token,
            'conversationId' => $request->input('conversationId') ?? session()->get('quick_pwi_conversation_id'),
        ];

        $result = $this->paymentService->processPayment('quick_pwi', $data);

        return $this->handlePaymentResult($request, $result);
    }

    /**
     * Handle checkout form callback from iyzico
     */
    public function checkoutFormCallback(Request $request): JsonResponse|RedirectResponse
    {
        $token = $request->input('token');

        if (!$token) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'errorMessage' => 'Token bulunamadı',
                    'errorCode' => 'MISSING_TOKEN'
                ], 400);
            }

            return redirect()->route('store.orders.failed', [
                'errorMessage' => 'Token bulunamadı'
            ]);
        }

        $data = [
            'token' => $token,
            'conversationId' => $request->input('conversationId') ?? session()->get('checkout_form_conversation_id'),
        ];

        $result = $this->paymentService->processCheckoutFormPayment($data);

        return $this->handlePaymentResult($request, $result);
    }

    /**
     * Handle wallet (Pay with iyzico) callback from iyzico
     */
    public function walletCallback(Request $request): JsonResponse|RedirectResponse
    {
        $token = $request->input('token');

        if (!$token) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'errorMessage' => 'Token bulunamadı',
                    'errorCode' => 'MISSING_TOKEN'
                ], 400);
            }

            return redirect()->route('store.orders.failed', [
                'errorMessage' => 'Token bulunamadı'
            ]);
        }

        $data = [
            'token' => $token,
            'conversationId' => $request->input('conversationId') ?? session()->get('pay_with_iyzico_conversation_id'),
        ];

        $result = $this->paymentService->processPayment('wallet', $data);

        return $this->handlePaymentResult($request, $result);
    }
}

