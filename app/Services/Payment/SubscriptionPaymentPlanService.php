<?php

namespace App\Services\Payment;

use Iyzipay\Model\Locale;
use Iyzipay\Model\Subscription\SubscriptionPricingPlan;
use Iyzipay\Options;
use Iyzipay\Request\Subscription\SubscriptionCreatePricingPlanRequest;
use Iyzipay\Request\Subscription\SubscriptionUpdatePricingPlanRequest;
use Iyzipay\Request\Subscription\SubscriptionDeletePricingPlanRequest;
use Iyzipay\Request\Subscription\SubscriptionRetrievePricingPlanRequest;
use Iyzipay\Request\Subscription\SubscriptionListPricingPlanRequest;
use Iyzipay\Model\Subscription\RetrieveList;
use Illuminate\Support\Facades\Log;

class SubscriptionPaymentPlanService
{
    private Options $options;

    public function __construct()
    {
        $this->options = new Options();
        $this->options->setApiKey(config('iyzipay.subscription.api_key'));
        $this->options->setSecretKey(config('iyzipay.subscription.secret_key'));
        $this->options->setBaseUrl(config('iyzipay.subscription.base_url'));
    }

    /**
     * Ödeme planı oluşturma
     *
     * @param  array  $data
     * @return array|null
     */
    public function createPaymentPlan(array $data): ?array
    {
        try {
            $request = new SubscriptionCreatePricingPlanRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setProductReferenceCode($data['productReferenceCode']);
            $request->setName($data['name']);
            $request->setPrice($data['price']);
            $request->setCurrencyCode($data['currencyCode'] ?? 'TRY');
            $request->setPaymentInterval($data['paymentInterval']); // WEEKLY, MONTHLY, YEARLY
            $request->setPaymentIntervalCount($data['paymentIntervalCount'] ?? 1);
            $request->setTrialPeriodDays($data['trialPeriodDays'] ?? 0);
            $request->setPlanPaymentType($data['planPaymentType'] ?? 'RECURRING'); // RECURRING, ONE_TIME
            $request->setRecurrenceCount($data['recurrenceCount'] ?? null);

            $paymentPlan = SubscriptionPricingPlan::create($request, $this->options);

            if ($paymentPlan->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $paymentPlan->getReferenceCode(),
                    'productReferenceCode' => $paymentPlan->getProductReferenceCode(),
                    'name' => $paymentPlan->getName(),
                    'price' => $paymentPlan->getPrice(),
                    'currencyCode' => $paymentPlan->getCurrencyCode(),
                    'paymentInterval' => $paymentPlan->getPaymentInterval(),
                    'paymentIntervalCount' => $paymentPlan->getPaymentIntervalCount(),
                    'trialPeriodDays' => $paymentPlan->getTrialPeriodDays(),
                    'planPaymentType' => $paymentPlan->getPlanPaymentType(),
                    'recurrenceCount' => $paymentPlan->getRecurrenceCount(),
                    'status' => $paymentPlan->getStatus(),
                    'createdDate' => $paymentPlan->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $paymentPlan->getErrorMessage(),
                    'errorCode' => $paymentPlan->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionPaymentPlanService: Create payment plan failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Ödeme planı güncelleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function updatePaymentPlan(array $data): ?array
    {
        try {
            $request = new SubscriptionUpdatePricingPlanRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPricingPlanReferenceCode($data['pricingPlanReferenceCode']);
            $request->setName($data['name'] ?? null);
            $request->setTrialPeriodDays($data['trialPeriodDays'] ?? null);

            $paymentPlan = SubscriptionPricingPlan::update($request, $this->options);

            if ($paymentPlan->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $paymentPlan->getReferenceCode(),
                    'productReferenceCode' => $paymentPlan->getProductReferenceCode(),
                    'name' => $paymentPlan->getName(),
                    'price' => $paymentPlan->getPrice(),
                    'currencyCode' => $paymentPlan->getCurrencyCode(),
                    'paymentInterval' => $paymentPlan->getPaymentInterval(),
                    'paymentIntervalCount' => $paymentPlan->getPaymentIntervalCount(),
                    'trialPeriodDays' => $paymentPlan->getTrialPeriodDays(),
                    'planPaymentType' => $paymentPlan->getPlanPaymentType(),
                    'recurrenceCount' => $paymentPlan->getRecurrenceCount(),
                    'status' => $paymentPlan->getStatus(),
                    'createdDate' => $paymentPlan->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $paymentPlan->getErrorMessage(),
                    'errorCode' => $paymentPlan->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionPaymentPlanService: Update payment plan failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Ödeme planı silme
     *
     * @param  array  $data
     * @return array|null
     */
    public function deletePaymentPlan(array $data): ?array
    {
        try {
            $request = new SubscriptionDeletePricingPlanRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPricingPlanReferenceCode($data['pricingPlanReferenceCode']);

            $paymentPlan = SubscriptionPricingPlan::delete($request, $this->options);

            if ($paymentPlan->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $paymentPlan->getReferenceCode(),
                    'status' => $paymentPlan->getStatus(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $paymentPlan->getErrorMessage(),
                    'errorCode' => $paymentPlan->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionPaymentPlanService: Delete payment plan failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Ödeme planı detayı
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrievePaymentPlan(array $data): ?array
    {
        try {
            $request = new SubscriptionRetrievePricingPlanRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPricingPlanReferenceCode($data['pricingPlanReferenceCode']);

            $paymentPlan = SubscriptionPricingPlan::retrieve($request, $this->options);

            if ($paymentPlan->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $paymentPlan->getReferenceCode(),
                    'productReferenceCode' => $paymentPlan->getProductReferenceCode(),
                    'name' => $paymentPlan->getName(),
                    'price' => $paymentPlan->getPrice(),
                    'currencyCode' => $paymentPlan->getCurrencyCode(),
                    'paymentInterval' => $paymentPlan->getPaymentInterval(),
                    'paymentIntervalCount' => $paymentPlan->getPaymentIntervalCount(),
                    'trialPeriodDays' => $paymentPlan->getTrialPeriodDays(),
                    'planPaymentType' => $paymentPlan->getPlanPaymentType(),
                    'recurrenceCount' => $paymentPlan->getRecurrenceCount(),
                    'status' => $paymentPlan->getStatus(),
                    'createdDate' => $paymentPlan->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $paymentPlan->getErrorMessage(),
                    'errorCode' => $paymentPlan->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionPaymentPlanService: Retrieve payment plan failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Ödeme planı listeleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrievePaymentPlanList(array $data = []): ?array
    {
        try {
            $request = new SubscriptionListPricingPlanRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setProductReferenceCode($data['productReferenceCode'] ?? null);
            $request->setPage($data['page'] ?? 1);
            $request->setCount($data['count'] ?? 10);

            $paymentPlanList = RetrieveList::pricingPlan($request, $this->options);

            if ($paymentPlanList->getStatus() === 'success') {
                $plans = [];
                foreach ($paymentPlanList->getItems() as $plan) {
                    $plans[] = [
                        'referenceCode' => $plan->getReferenceCode(),
                        'productReferenceCode' => $plan->getProductReferenceCode(),
                        'name' => $plan->getName(),
                        'price' => $plan->getPrice(),
                        'currencyCode' => $plan->getCurrencyCode(),
                        'paymentInterval' => $plan->getPaymentInterval(),
                        'paymentIntervalCount' => $plan->getPaymentIntervalCount(),
                        'trialPeriodDays' => $plan->getTrialPeriodDays(),
                        'planPaymentType' => $plan->getPlanPaymentType(),
                        'recurrenceCount' => $plan->getRecurrenceCount(),
                        'status' => $plan->getStatus(),
                        'createdDate' => $plan->getCreatedDate(),
                    ];
                }

                return [
                    'status' => 'success',
                    'plans' => $plans,
                    'currentPage' => $paymentPlanList->getCurrentPage(),
                    'totalCount' => $paymentPlanList->getTotalCount(),
                    'pageCount' => $paymentPlanList->getPageCount(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $paymentPlanList->getErrorMessage(),
                    'errorCode' => $paymentPlanList->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionPaymentPlanService: Retrieve payment plan list failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }
}

