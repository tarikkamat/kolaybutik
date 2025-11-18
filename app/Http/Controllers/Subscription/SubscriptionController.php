<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\CreateProductRequest;
use App\Http\Requests\Subscription\UpdateProductRequest;
use App\Http\Requests\Subscription\DeleteProductRequest;
use App\Http\Requests\Subscription\RetrieveProductRequest;
use App\Http\Requests\Subscription\CreatePaymentPlanRequest;
use App\Http\Requests\Subscription\UpdatePaymentPlanRequest;
use App\Http\Requests\Subscription\CreateSubscriptionRequest;
use App\Http\Requests\Subscription\UpdateSubscriptionCardRequest;
use App\Http\Requests\Subscription\UpdateCustomerRequest;
use App\Services\Payment\SubscriptionProductService;
use App\Services\Payment\SubscriptionPaymentPlanService;
use App\Services\Payment\SubscriptionActionService;
use App\Services\Payment\SubscriptionSubscriberActionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function __construct(
        protected SubscriptionProductService $productService,
        protected SubscriptionPaymentPlanService $planService,
        protected SubscriptionActionService $actionService,
        protected SubscriptionSubscriberActionService $subscriberService,
    ) {
    }

    // ==================== ÜRÜN İŞLEMLERİ ====================

    /**
     * Ürün oluşturma
     */
    public function createProduct(CreateProductRequest $request): JsonResponse
    {
        $result = $this->productService->createProduct($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ürün güncelleme
     */
    public function updateProduct(UpdateProductRequest $request): JsonResponse
    {
        $result = $this->productService->updateProduct($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ürün silme
     */
    public function deleteProduct(DeleteProductRequest $request): JsonResponse
    {
        $result = $this->productService->deleteProduct($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ürün detayı
     */
    public function retrieveProduct(RetrieveProductRequest $request): JsonResponse
    {
        $result = $this->productService->retrieveProduct($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ürün listeleme
     */
    public function listProducts(Request $request): JsonResponse
    {
        $result = $this->productService->retrieveProductList([
            'page' => $request->input('page', 1),
            'count' => $request->input('count', 10),
            'conversationId' => $request->input('conversationId'),
        ]);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    // ==================== PLAN İŞLEMLERİ ====================

    /**
     * Ödeme planı oluşturma
     */
    public function createPaymentPlan(CreatePaymentPlanRequest $request): JsonResponse
    {
        $result = $this->planService->createPaymentPlan($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ödeme planı güncelleme
     */
    public function updatePaymentPlan(UpdatePaymentPlanRequest $request): JsonResponse
    {
        $result = $this->planService->updatePaymentPlan($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ödeme planı silme
     */
    public function deletePaymentPlan(Request $request): JsonResponse
    {
        $request->validate([
            'pricingPlanReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->planService->deletePaymentPlan($request->only([
            'pricingPlanReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ödeme planı detayı
     */
    public function retrievePaymentPlan(Request $request): JsonResponse
    {
        $request->validate([
            'pricingPlanReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->planService->retrievePaymentPlan($request->only([
            'pricingPlanReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Ödeme planı listeleme
     */
    public function listPaymentPlans(Request $request): JsonResponse
    {
        $result = $this->planService->retrievePaymentPlanList([
            'productReferenceCode' => $request->input('productReferenceCode'),
            'page' => $request->input('page', 1),
            'count' => $request->input('count', 10),
            'conversationId' => $request->input('conversationId'),
        ]);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    // ==================== ABONELİK İŞLEMLERİ ====================

    /**
     * Abonelik başlatma
     */
    public function createSubscription(CreateSubscriptionRequest $request): JsonResponse
    {
        $result = $this->actionService->createSubscription($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik aktifleştirme
     */
    public function activateSubscription(Request $request): JsonResponse
    {
        $request->validate([
            'subscriptionReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->actionService->activateSubscription($request->only([
            'subscriptionReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik ödeme tekrarlama
     */
    public function retrySubscription(Request $request): JsonResponse
    {
        $request->validate([
            'subscriptionReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->actionService->retrySubscription($request->only([
            'subscriptionReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik yükseltme/fiyat güncelleme
     */
    public function upgradeSubscription(Request $request): JsonResponse
    {
        $request->validate([
            'subscriptionReferenceCode' => 'required|string|max:255',
            'newPricingPlanReferenceCode' => 'required|string|max:255',
            'upgradePeriod' => 'nullable|string|in:NOW,NEXT_PERIOD',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->actionService->upgradeSubscription($request->only([
            'subscriptionReferenceCode',
            'newPricingPlanReferenceCode',
            'upgradePeriod',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik iptali
     */
    public function cancelSubscription(Request $request): JsonResponse
    {
        $request->validate([
            'subscriptionReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->actionService->cancelSubscription($request->only([
            'subscriptionReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik detayı
     */
    public function retrieveSubscription(Request $request): JsonResponse
    {
        $request->validate([
            'subscriptionReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->actionService->retrieveSubscription($request->only([
            'subscriptionReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik arama
     */
    public function searchSubscription(Request $request): JsonResponse
    {
        $result = $this->actionService->searchSubscription([
            'subscriptionReferenceCode' => $request->input('subscriptionReferenceCode'),
            'parentReferenceCode' => $request->input('parentReferenceCode'),
            'customerReferenceCode' => $request->input('customerReferenceCode'),
            'pricingPlanReferenceCode' => $request->input('pricingPlanReferenceCode'),
            'subscriptionStatus' => $request->input('subscriptionStatus'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'page' => $request->input('page', 1),
            'count' => $request->input('count', 10),
            'conversationId' => $request->input('conversationId'),
        ]);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abonelik kart güncelleme
     */
    public function updateSubscriptionCard(UpdateSubscriptionCardRequest $request): JsonResponse
    {
        $result = $this->actionService->updateSubscriptionCard($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    // ==================== ABONE İŞLEMLERİ ====================

    /**
     * Abone güncelleme
     */
    public function updateCustomer(UpdateCustomerRequest $request): JsonResponse
    {
        $result = $this->subscriberService->updateCustomer($request->validated());

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abone detayı
     */
    public function retrieveCustomer(Request $request): JsonResponse
    {
        $request->validate([
            'customerReferenceCode' => 'required|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $result = $this->subscriberService->retrieveCustomer($request->only([
            'customerReferenceCode',
            'conversationId',
        ]));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Abone listeleme
     */
    public function listCustomers(Request $request): JsonResponse
    {
        $result = $this->subscriberService->retrieveCustomerList([
            'page' => $request->input('page', 1),
            'count' => $request->input('count', 10),
            'conversationId' => $request->input('conversationId'),
        ]);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}

