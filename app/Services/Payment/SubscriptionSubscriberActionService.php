<?php

namespace App\Services\Payment;

use Iyzipay\Model\Locale;
use Iyzipay\Model\Subscription\SubscriptionCustomer;
use Iyzipay\Options;
use Iyzipay\Request\Subscription\SubscriptionUpdateCustomerRequest;
use Iyzipay\Request\Subscription\SubscriptionRetrieveCustomerRequest;
use Iyzipay\Request\Subscription\SubscriptionListCustomersRequest;
use Illuminate\Support\Facades\Log;

class SubscriptionSubscriberActionService
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
     * Abone güncelleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function updateCustomer(array $data): ?array
    {
        try {
            $request = new SubscriptionUpdateCustomerRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setCustomerReferenceCode($data['customerReferenceCode']);
            $request->setName($data['name'] ?? null);
            $request->setSurname($data['surname'] ?? null);
            $request->setEmail($data['email'] ?? null);
            $request->setGsmNumber("+905546041451"); // TODO:
            $request->setIdentityNumber($data['identityNumber'] ?? null);
            $request->setCity($data['city'] ?? null);
            $request->setCountry($data['country'] ?? null);
            $request->setZipCode($data['zipCode'] ?? null);
            $request->setAddress($data['address'] ?? null);

            $customer = SubscriptionCustomer::update($request, $this->options);

            if ($customer->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $customer->getReferenceCode(),
                    'name' => $customer->getName(),
                    'surname' => $customer->getSurname(),
                    'email' => $customer->getEmail(),
                    'gsmNumber' => $customer->getGsmNumber(),
                    'identityNumber' => $customer->getIdentityNumber(),
                    'city' => $customer->getCity(),
                    'country' => $customer->getCountry(),
                    'zipCode' => $customer->getZipCode(),
                    'address' => $customer->getAddress(),
                    'createdDate' => $customer->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $customer->getErrorMessage(),
                    'errorCode' => $customer->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionSubscriberActionService: Update customer failed', [
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
     * Abone detayı
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrieveCustomer(array $data): ?array
    {
        try {
            $request = new SubscriptionRetrieveCustomerRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setCustomerReferenceCode($data['customerReferenceCode']);

            $customer = SubscriptionCustomer::retrieve($request, $this->options);

            if ($customer->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $customer->getReferenceCode(),
                    'name' => $customer->getName(),
                    'surname' => $customer->getSurname(),
                    'email' => $customer->getEmail(),
                    'gsmNumber' => $customer->getGsmNumber(),
                    'identityNumber' => $customer->getIdentityNumber(),
                    'city' => $customer->getCity(),
                    'country' => $customer->getCountry(),
                    'zipCode' => $customer->getZipCode(),
                    'address' => $customer->getAddress(),
                    'createdDate' => $customer->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $customer->getErrorMessage(),
                    'errorCode' => $customer->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionSubscriberActionService: Retrieve customer failed', [
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
     * Abone listeleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrieveCustomerList(array $data = []): ?array
    {
        try {
            $request = new SubscriptionListCustomersRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPage($data['page'] ?? 1);
            $request->setCount($data['count'] ?? 10);

            $customerList = \Iyzipay\Model\Subscription\RetrieveList::customers($request, $this->options);

            if ($customerList->getStatus() === 'success') {
                $customers = [];
                foreach ($customerList->getItems() as $customer) {
                    $customers[] = [
                        'referenceCode' => $customer->getReferenceCode(),
                        'name' => $customer->getName(),
                        'surname' => $customer->getSurname(),
                        'email' => $customer->getEmail(),
                        'gsmNumber' => $customer->getGsmNumber(),
                        'identityNumber' => $customer->getIdentityNumber(),
                        'city' => $customer->getCity(),
                        'country' => $customer->getCountry(),
                        'zipCode' => $customer->getZipCode(),
                        'address' => $customer->getAddress(),
                        'createdDate' => $customer->getCreatedDate(),
                    ];
                }

                return [
                    'status' => 'success',
                    'customers' => $customers,
                    'currentPage' => $customerList->getCurrentPage(),
                    'totalCount' => $customerList->getTotalCount(),
                    'pageCount' => $customerList->getPageCount(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $customerList->getErrorMessage(),
                    'errorCode' => $customerList->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionSubscriberActionService: Retrieve customer list failed', [
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

