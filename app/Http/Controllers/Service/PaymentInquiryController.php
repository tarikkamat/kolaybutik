<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Services\Service\PaymentInquiryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentInquiryController extends Controller
{
    private PaymentInquiryService $paymentInquiryService;

    public function __construct(PaymentInquiryService $paymentInquiryService)
    {
        $this->paymentInquiryService = $paymentInquiryService;
    }

    /**
     * Display Payment Inquiry page
     */
    public function index(): Response
    {
        return Inertia::render('payment-inquiry/index');
    }

    /**
     * Retrieve Payment
     */
    public function retrievePayment(Request $request): JsonResponse
    {
        $request->validate([
            'paymentId' => 'required|string',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->paymentInquiryService->retrievePayment(
            $request->input('paymentId'),
            $request->input('conversationId')
        );

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['errorMessage'] ?? 'Ödeme sorgulanamadı',
            'errorCode' => $result['errorCode'] ?? null,
        ], 400);
    }

    /**
     * Retrieve Payment with Payment Conversation ID
     */
    public function retrievePaymentWithConversationId(Request $request): JsonResponse
    {
        $request->validate([
            'paymentConversationId' => 'required|string',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->paymentInquiryService->retrievePaymentWithConversationId(
            $request->input('paymentConversationId'),
            $request->input('conversationId')
        );

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['errorMessage'] ?? 'Ödeme sorgulanamadı',
            'errorCode' => $result['errorCode'] ?? null,
        ], 400);
    }
}

