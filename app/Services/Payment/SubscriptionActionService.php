<?php

namespace App\Services\Payment;

use Iyzipay\Model\Locale;
use Iyzipay\Model\Subscription\SubscriptionCreate;
use Iyzipay\Model\Subscription\SubscriptionActivate;
use Iyzipay\Model\Subscription\SubscriptionCancel;
use Iyzipay\Model\Subscription\SubscriptionRetry;
use Iyzipay\Model\Subscription\SubscriptionUpgrade;
use Iyzipay\Model\Subscription\SubscriptionCardUpdate;
use Iyzipay\Model\Subscription\SubscriptionDetails;
use Iyzipay\Model\Subscription\SubscriptionList;
use Iyzipay\Options;
use Iyzipay\Request\Subscription\SubscriptionCreateRequest;
use Iyzipay\Request\Subscription\SubscriptionActivateRequest;
use Iyzipay\Request\Subscription\SubscriptionRetryRequest;
use Iyzipay\Request\Subscription\SubscriptionUpgradeRequest;
use Iyzipay\Request\Subscription\SubscriptionCancelRequest;
use Iyzipay\Request\Subscription\SubscriptionDetailsRequest;
use Iyzipay\Request\Subscription\SubscriptionSearchRequest;
use Iyzipay\Request\Subscription\SubscriptionCardUpdateRequest;
use Iyzipay\Model\PaymentCard;
use Illuminate\Support\Facades\Log;

class SubscriptionActionService
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
     * Abonelik başlatma
     *
     * @param  array  $data
     * @return array|null
     */
    public function createSubscription(array $data): ?array
    {
        try {
            $request = new SubscriptionCreateRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPricingPlanReferenceCode($data['pricingPlanReferenceCode']);

            // Customer bilgileri
            $request->setCustomerReferenceCode($data['customerReferenceCode'] ?? uniqid('customer_', true));
            $request->setCustomerEmail($data['customerEmail']);
            $request->setCustomerName($data['customerName']);
            $request->setCustomerSurname($data['customerSurname'] ?? '');
            $request->setCustomerGsmNumber($data['customerGsmNumber'] ?? '');
            $request->setCustomerIdentityNumber($data['customerIdentityNumber'] ?? '11111111111');
            $request->setCustomerCity($data['customerCity'] ?? 'Istanbul');
            $request->setCustomerCountry($data['customerCountry'] ?? 'Turkey');
            $request->setCustomerZipCode($data['customerZipCode'] ?? '34000');
            $request->setCustomerAddress($data['customerAddress'] ?? '');

            // Payment Card (NON3D)
            $paymentCard = new PaymentCard();
            $paymentCard->setCardHolderName($data['cardHolderName']);
            $cardNumber = preg_replace('/\s+/', '', $data['cardNumber']);
            $paymentCard->setCardNumber($cardNumber);
            $expiry = explode('/', $data['cardExpiry']);
            $paymentCard->setExpireMonth(trim($expiry[0]));
            $paymentCard->setExpireYear('20'.trim($expiry[1]));
            $paymentCard->setCvc($data['cardCvc']);
            $request->setPaymentCard($paymentCard);

            $subscription = SubscriptionCreate::create($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'parentReferenceCode' => $subscription->getParentReferenceCode(),
                    'pricingPlanReferenceCode' => $subscription->getPricingPlanReferenceCode(),
                    'customerReferenceCode' => $subscription->getCustomerReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                    'trialDays' => $subscription->getTrialDays(),
                    'trialStartDate' => $subscription->getTrialStartDate(),
                    'trialEndDate' => $subscription->getTrialEndDate(),
                    'startDate' => $subscription->getStartDate(),
                    'endDate' => $subscription->getEndDate(),
                    'createdDate' => $subscription->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Create subscription failed', [
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
     * Abonelik aktifleştirme
     *
     * @param  array  $data
     * @return array|null
     */
    public function activateSubscription(array $data): ?array
    {
        try {
            $request = new SubscriptionActivateRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode']);

            $subscription = SubscriptionActivate::update($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                    'startDate' => $subscription->getStartDate(),
                    'endDate' => $subscription->getEndDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Activate subscription failed', [
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
     * Abonelik ödeme tekrarlama
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrySubscription(array $data): ?array
    {
        try {
            $request = new SubscriptionRetryRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode']);

            $subscription = SubscriptionRetry::update($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Retry subscription failed', [
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
     * Abonelik yükseltme/fiyat güncelleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function upgradeSubscription(array $data): ?array
    {
        try {
            $request = new SubscriptionUpgradeRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode']);
            $request->setNewPricingPlanReferenceCode($data['newPricingPlanReferenceCode']);
            $request->setUpgradePeriod($data['upgradePeriod'] ?? 'NOW'); // NOW, NEXT_PERIOD

            $subscription = SubscriptionUpgrade::update($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'parentReferenceCode' => $subscription->getParentReferenceCode(),
                    'pricingPlanReferenceCode' => $subscription->getPricingPlanReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                    'startDate' => $subscription->getStartDate(),
                    'endDate' => $subscription->getEndDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Upgrade subscription failed', [
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
     * Abonelik iptali
     *
     * @param  array  $data
     * @return array|null
     */
    public function cancelSubscription(array $data): ?array
    {
        try {
            $request = new SubscriptionCancelRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode']);

            $subscription = SubscriptionCancel::cancel($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                    'endDate' => $subscription->getEndDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Cancel subscription failed', [
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
     * Abonelik detayı
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrieveSubscription(array $data): ?array
    {
        try {
            $request = new SubscriptionDetailsRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode']);

            $subscription = SubscriptionDetails::retrieve($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'parentReferenceCode' => $subscription->getParentReferenceCode(),
                    'pricingPlanReferenceCode' => $subscription->getPricingPlanReferenceCode(),
                    'customerReferenceCode' => $subscription->getCustomerReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                    'trialDays' => $subscription->getTrialDays(),
                    'trialStartDate' => $subscription->getTrialStartDate(),
                    'trialEndDate' => $subscription->getTrialEndDate(),
                    'startDate' => $subscription->getStartDate(),
                    'endDate' => $subscription->getEndDate(),
                    'createdDate' => $subscription->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Retrieve subscription failed', [
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
     * Abonelik arama
     *
     * @param  array  $data
     * @return array|null
     */
    public function searchSubscription(array $data = []): ?array
    {
        try {
            $request = new SubscriptionSearchRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPage($data['page'] ?? 1);
            $request->setCount($data['count'] ?? 10);
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode'] ?? null);
            $request->setParentReferenceCode($data['parentReferenceCode'] ?? null);
            $request->setCustomerReferenceCode($data['customerReferenceCode'] ?? null);
            $request->setPricingPlanReferenceCode($data['pricingPlanReferenceCode'] ?? null);
            $request->setSubscriptionStatus($data['subscriptionStatus'] ?? null);
            $request->setStartDate($data['startDate'] ?? null);
            $request->setEndDate($data['endDate'] ?? null);

            $subscriptionList = \Iyzipay\Model\Subscription\RetrieveList::subscriptions($request, $this->options);

            if ($subscriptionList->getStatus() === 'success') {
                $subscriptions = [];
                foreach ($subscriptionList->getItems() as $subscription) {
                    $subscriptions[] = [
                        'referenceCode' => $subscription->getReferenceCode(),
                        'parentReferenceCode' => $subscription->getParentReferenceCode(),
                        'pricingPlanReferenceCode' => $subscription->getPricingPlanReferenceCode(),
                        'customerReferenceCode' => $subscription->getCustomerReferenceCode(),
                        'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                        'trialDays' => $subscription->getTrialDays(),
                        'trialStartDate' => $subscription->getTrialStartDate(),
                        'trialEndDate' => $subscription->getTrialEndDate(),
                        'startDate' => $subscription->getStartDate(),
                        'endDate' => $subscription->getEndDate(),
                        'createdDate' => $subscription->getCreatedDate(),
                    ];
                }

                return [
                    'status' => 'success',
                    'subscriptions' => $subscriptions,
                    'currentPage' => $subscriptionList->getCurrentPage(),
                    'totalCount' => $subscriptionList->getTotalCount(),
                    'pageCount' => $subscriptionList->getPageCount(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscriptionList->getErrorMessage(),
                    'errorCode' => $subscriptionList->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Search subscription failed', [
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Abonelik kart güncelleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function updateSubscriptionCard(array $data): ?array
    {
        try {
            $request = new SubscriptionCardUpdateRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setSubscriptionReferenceCode($data['subscriptionReferenceCode']);

            // Payment Card (NON3D)
            $paymentCard = new PaymentCard();
            $paymentCard->setCardHolderName($data['cardHolderName']);
            $cardNumber = preg_replace('/\s+/', '', $data['cardNumber']);
            $paymentCard->setCardNumber($cardNumber);
            $expiry = explode('/', $data['cardExpiry']);
            $paymentCard->setExpireMonth(trim($expiry[0]));
            $paymentCard->setExpireYear('20'.trim($expiry[1]));
            $paymentCard->setCvc($data['cardCvc']);
            $request->setPaymentCard($paymentCard);

            $subscription = SubscriptionCardUpdate::update($request, $this->options);

            if ($subscription->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $subscription->getReferenceCode(),
                    'subscriptionStatus' => $subscription->getSubscriptionStatus(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $subscription->getErrorMessage(),
                    'errorCode' => $subscription->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionActionService: Update subscription card failed', [
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
}

