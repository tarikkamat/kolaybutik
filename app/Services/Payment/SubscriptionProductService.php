<?php

namespace App\Services\Payment;

use Iyzipay\Model\Locale;
use Iyzipay\Model\Subscription\SubscriptionProduct;
use Iyzipay\Options;
use Iyzipay\Request\Subscription\SubscriptionCreateProductRequest;
use Iyzipay\Request\Subscription\SubscriptionUpdateProductRequest;
use Iyzipay\Request\Subscription\SubscriptionDeleteProductRequest;
use Iyzipay\Request\Subscription\SubscriptionRetrieveProductRequest;
use Iyzipay\Request\Subscription\SubscriptionListProductsRequest;
use Iyzipay\Model\Subscription\RetrieveList;
use Illuminate\Support\Facades\Log;

class SubscriptionProductService
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
     * Ürün oluşturma
     *
     * @param  array  $data
     * @return array|null
     */
    public function createProduct(array $data): ?array
    {
        try {
            $request = new SubscriptionCreateProductRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setName($data['name']);
            $request->setDescription($data['description'] ?? '');

            $product = SubscriptionProduct::create($request, $this->options);

            if ($product->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $product->getReferenceCode(),
                    'name' => $product->getName(),
                    'description' => $product->getDescription(),
                    'status' => $product->getStatus(),
                    'createdDate' => $product->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $product->getErrorMessage(),
                    'errorCode' => $product->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionProductService: Create product failed', [
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
     * Ürün güncelleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function updateProduct(array $data): ?array
    {
        try {
            $request = new SubscriptionUpdateProductRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setProductReferenceCode($data['productReferenceCode']);
            $request->setName($data['name']);
            $request->setDescription($data['description'] ?? '');

            $product = SubscriptionProduct::update($request, $this->options);

            if ($product->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $product->getReferenceCode(),
                    'name' => $product->getName(),
                    'description' => $product->getDescription(),
                    'status' => $product->getStatus(),
                    'createdDate' => $product->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $product->getErrorMessage(),
                    'errorCode' => $product->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionProductService: Update product failed', [
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
     * Ürün silme
     *
     * @param  array  $data
     * @return array|null
     */
    public function deleteProduct(array $data): ?array
    {
        try {
            $request = new SubscriptionDeleteProductRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setProductReferenceCode($data['productReferenceCode']);

            $product = SubscriptionProduct::delete($request, $this->options);

            if ($product->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $product->getReferenceCode(),
                    'status' => $product->getStatus(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $product->getErrorMessage(),
                    'errorCode' => $product->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionProductService: Delete product failed', [
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
     * Ürün detayı
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrieveProduct(array $data): ?array
    {
        try {
            $request = new SubscriptionRetrieveProductRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setProductReferenceCode($data['productReferenceCode']);

            $product = SubscriptionProduct::retrieve($request, $this->options);

            if ($product->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'referenceCode' => $product->getReferenceCode(),
                    'name' => $product->getName(),
                    'description' => $product->getDescription(),
                    'status' => $product->getStatus(),
                    'createdDate' => $product->getCreatedDate(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $product->getErrorMessage(),
                    'errorCode' => $product->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionProductService: Retrieve product failed', [
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
     * Ürün listeleme
     *
     * @param  array  $data
     * @return array|null
     */
    public function retrieveProductList(array $data = []): ?array
    {
        try {
            $request = new SubscriptionListProductsRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPage($data['page'] ?? 1);
            $request->setCount($data['count'] ?? 10);

            $productList = RetrieveList::products($request, $this->options);

            if ($productList->getStatus() === 'success') {
                $products = [];
                foreach ($productList->getItems() as $product) {
                    $products[] = [
                        'referenceCode' => $product->getReferenceCode(),
                        'name' => $product->getName(),
                        'description' => $product->getDescription(),
                        'status' => $product->getStatus(),
                        'createdDate' => $product->getCreatedDate(),
                    ];
                }

                return [
                    'status' => 'success',
                    'products' => $products,
                    'currentPage' => $productList->getCurrentPage(),
                    'totalCount' => $productList->getTotalCount(),
                    'pageCount' => $productList->getPageCount(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $productList->getErrorMessage(),
                    'errorCode' => $productList->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('SubscriptionProductService: Retrieve product list failed', [
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

