<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CreditCardPaymentRequest;
use App\Http\Requests\Payment\InstallmentBinRequest;
use App\Http\Requests\Payment\SavedCardPaymentRequest;
use App\Http\Requests\Payment\ThreedsCallbackRequest;
use App\Http\Controllers\Payment\Concerns\HandlesPaymentResponses;
use App\Services\Checkout\CartService;
use App\Services\Payment\PaymentService;
use App\Services\Service\InstallmentBinService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ApiPaymentController extends Controller
{
    use HandlesPaymentResponses;

    public function __construct(
        protected PaymentService $paymentService,
        protected InstallmentBinService $installmentBinService,
        protected CartService $cartService
    ) {
    }

    /**
     * Process credit card payment with iyzico (Non-3DS or 3DS)
     */
    public function processCreditCardPayment(CreditCardPaymentRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $use3d = $request->boolean('use_3d', false);

        if ($use3d) {
            $result = $this->paymentService->initializeThreedsPayment($data);
            return $this->handlePaymentResult($request, $result, true);
        }

        $result = $this->paymentService->processCreditCardPayment($data);
        return $this->handlePaymentResult($request, $result, false);
    }

    /**
     * Process saved card payment with iyzico
     */
    public function processSavedCardPayment(SavedCardPaymentRequest $request): JsonResponse|RedirectResponse
    {
        $data = $request->validated();
        $result = $this->paymentService->processSavedCardPayment($data);

        return $this->handlePaymentResult($request, $result);
    }

    /**
     * Get saved cards for authenticated user
     */
    public function getSavedCards(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['cards' => []], 200);
        }

        $userId = Auth::id();
        $cards = $this->paymentService->getSavedCards($userId);

        return response()->json(['cards' => $cards ?? []]);
    }

    /**
     * Get installment options by BIN number
     */
    public function getInstallmentOptions(InstallmentBinRequest $request): JsonResponse
    {
        $binNumber = $request->validated()['binNumber'];
        $cartSummary = $this->cartService->getCartSummary();
        $total = $cartSummary['total'] ?? 100.0;

        $result = $this->installmentBinService->getInstallmentInfo($binNumber, $total);

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'status' => 'success',
                'installmentDetails' => $result['installmentDetails'] ?? [],
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => $result['errorMessage'] ?? 'Taksit bilgileri alınamadı',
        ], 400);
    }

    /**
     * Show 3DS page
     */
    public function threedsPage(): View
    {
        $htmlContent = session('threeds_html_content');
        $paymentId = session('threeds_payment_id');
        $conversationId = session('threeds_conversationId') ?? session('threeds_conversation_id');

        if (!$htmlContent || !$paymentId || !$conversationId) {
            Log::error('3DS Page: Session data missing', [
                'has_htmlContent' => !empty($htmlContent),
                'has_paymentId' => !empty($paymentId),
                'has_conversationId' => !empty($conversationId),
            ]);
            abort(404, '3DS sayfası bulunamadı');
        }

        return view('payment.threeds-page', [
            'htmlContent' => $htmlContent,
            'paymentId' => $paymentId,
            'conversationId' => $conversationId,
        ]);
    }

    /**
     * Proxy 3DS form submission to iyzico mock page
     */
    public function proxyThreedsForm(Request $request): Response
    {
        $formData = $request->all();
        $mockUrl = 'https://sandbox-api.iyzipay.com/payment/mock/init3ds';

        try {
            $response = \Illuminate\Support\Facades\Http::asForm()->post($mockUrl, $formData);
            return response($response->body(), $response->status())
                ->header('Content-Type', 'text/html');
        } catch (\Exception $e) {
            return response('Proxy hatası: '.$e->getMessage(), 500)
                ->header('Content-Type', 'text/html');
        }
    }

    /**
     * Handle 3DS callback and process post auth
     */
    public function threedsCallback(ThreedsCallbackRequest $request): JsonResponse|RedirectResponse|Response
    {
        // İstek geldiği anda tüm callback verilerini logla
        Log::info('3DS Callback: Request received', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'all_input' => $request->all(),
            'query_params' => $request->query(),
            'post_params' => $request->post(),
            'headers' => $request->headers->all(),
            'session_id' => session()->getId(),
            'session_data' => [
                'threeds_payment_id' => session('threeds_payment_id'),
                'threeds_conversationId' => session('threeds_conversationId'),
                'threeds_conversation_id' => session('threeds_conversation_id'),
                'has_html_content' => !empty(session('threeds_html_content')),
            ],
        ]);

        $paymentId = $request->input('paymentId')
            ?? $request->query('paymentId')
            ?? session('threeds_payment_id');

        $conversationId = session('threeds_conversationId')
            ?? session('threeds_conversation_id')
            ?? $request->input('conversationId')
            ?? $request->query('conversationId');

        Log::info('3DS Callback: Extracted parameters', [
            'paymentId' => $paymentId,
            'conversationId' => $conversationId,
            'status' => $request->input('status'),
            'mdStatus' => $request->input('mdStatus'),
            'conversationData' => $request->input('conversationData'),
        ]);

        if (!$paymentId || !$conversationId) {
            Log::error('3DS Callback: Missing required parameters', [
                'paymentId' => $paymentId ?? null,
                'conversationId' => $conversationId ?? null,
                'received_params' => $request->all(),
            ]);

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'paymentId ve conversationId gerekli',
                ], 400);
            }

            return redirect()->route('store.orders.failed', [
                'errorMessage' => '3DS doğrulama parametreleri eksik',
            ]);
        }

        // 3DS doğrulama kontrolü: status=success VE mdStatus=1
        $status = $request->input('status');
        $mdStatus = $request->input('mdStatus');
        $isSuccess = ($status === 'success') && ($mdStatus === '1' || $mdStatus === 1);

        Log::info('3DS Callback: Verification check', [
            'status' => $status,
            'mdStatus' => $mdStatus,
            'mdStatus_type' => gettype($mdStatus),
            'isSuccess' => $isSuccess,
            'paymentId' => $paymentId,
            'conversationId' => $conversationId,
        ]);

        if (!$isSuccess) {
            Log::error('3DS Callback: Verification failed', [
                'status' => $status,
                'mdStatus' => $mdStatus,
                'mdStatus_type' => gettype($mdStatus),
                'paymentId' => $paymentId,
                'conversationId' => $conversationId,
                'all_request_data' => $request->all(),
            ]);

            $errorMessage = '3DS doğrulama başarısız';
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $errorMessage,
                ], 400);
            }

            return redirect()->route('store.orders.failed', [
                'errorMessage' => $errorMessage,
            ]);
        }

        // Post Auth işlemi
        // conversationData null ise boş string'e çevir (iyzico API gereksinimi)
        $conversationData = $request->input('conversationData');
        if ($conversationData === null) {
            $conversationData = '';
        }

        $data = [
            'paymentId' => $paymentId,
            'conversationId' => $conversationId,
            'conversationData' => $conversationData,
        ];

        Log::info('3DS Callback: Starting Post Auth', [
            'post_auth_data' => $data,
            'conversationData_original' => $request->input('conversationData'),
            'conversationData_processed' => $conversationData,
        ]);

        $result = $this->paymentService->processThreedsPostAuth($data);

        Log::info('3DS Callback: Post Auth result', [
            'result' => $result,
            'result_status' => $result['status'] ?? 'unknown',
        ]);

        return $this->handleThreedsCallbackResult($request, $result);
    }
}

