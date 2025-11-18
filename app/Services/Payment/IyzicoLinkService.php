<?php

namespace App\Services\Payment;

use Illuminate\Support\Facades\Log;
use Iyzipay\FileBase64Encoder;
use Iyzipay\Model\Currency;
use Iyzipay\Model\Iyzilink\IyziLinkDeleteProduct;
use Iyzipay\Model\Iyzilink\IyziLinkFastLink;
use Iyzipay\Model\Iyzilink\IyziLinkRetrieveAllProduct;
use Iyzipay\Model\Iyzilink\IyziLinkRetrieveProduct;
use Iyzipay\Model\Iyzilink\IyziLinkSaveProduct;
use Iyzipay\Model\Iyzilink\IyziLinkUpdateProduct;
use Iyzipay\Model\Iyzilink\IyziLinkUpdateProductStatus;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Status;
use Iyzipay\Options;
use Iyzipay\Request;
use Iyzipay\Request\Iyzilink\IyziLinkCreateFastLinkRequest;
use Iyzipay\Request\Iyzilink\IyziLinkSaveProductRequest;
use Iyzipay\Request\Iyzilink\IyziLinkUpdateProductStatusRequest;
use Iyzipay\Request\PagininRequest;

class IyzicoLinkService
{
    private Options $options;

    public function __construct()
    {
        $this->options = new Options();
        $this->options->setApiKey(config('iyzipay.api_key'));
        $this->options->setSecretKey(config('iyzipay.secret_key'));
        $this->options->setBaseUrl(config('iyzipay.base_url'));
    }

    /**
     * Create iyzico Link (Save Product)
     *
     * @param  array  $data
     * @return array|null
     */
    public function createIyziLink(array $data): ?array
    {
        try {
            $request = new IyziLinkSaveProductRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setName($data['name'] ?? 'Ödeme Linki');
            $request->setDescription($data['description'] ?? '');
            $request->setPrice($data['price'] ?? 0);
            $request->setCurrency($data['currency'] ?? Currency::TL);
            $request->setAddressIgnorable($data['addressIgnorable'] ?? false);
            $request->setSoldLimit($data['soldLimit'] ?? null);
            $request->setInstallmentRequest($data['installmentRequested'] ?? false);
            $request->setSourceType($data['sourceType'] ?? 'API');
            $request->setStockEnabled($data['stockEnabled'] ?? false);
            $request->setStockCount($data['stockCount'] ?? null);

            // Base64 encoded image
            if (isset($data['imagePath']) && file_exists($data['imagePath'])) {
                $request->setBase64EncodedImage(FileBase64Encoder::encode($data['imagePath']));
            } elseif (isset($data['base64EncodedImage'])) {
                $request->setBase64EncodedImage($data['base64EncodedImage']);
            }

            $iyziLink = IyziLinkSaveProduct::create($request, $this->options);

            if ($iyziLink->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $iyziLink->getToken(),
                        'url' => $iyziLink->getUrl(),
                        'imageUrl' => $iyziLink->getImageUrl(),
                        'name' => $iyziLink->getName(),
                        'description' => $iyziLink->getDescription(),
                        'price' => $iyziLink->getPrice(),
                        'currency' => $iyziLink->getCurrency(),
                        'status' => $iyziLink->getStatus(),
                    ],
                    'message' => 'iyzico Link başarıyla oluşturuldu',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLink->getErrorMessage(),
                    'errorCode' => $iyziLink->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: Create failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'iyzico Link oluşturulurken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Create Fastlink
     *
     * @param  array  $data
     * @return array|null
     */
    public function createFastlink(array $data): ?array
    {
        try {
            $request = new IyziLinkCreateFastLinkRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('fastlink_', true));
            $request->setDescription($data['description'] ?? 'Hızlı Ödeme Linki');
            $request->setPrice($data['price'] ?? 0);
            $request->setCurrencyCode($data['currencyCode'] ?? 'TRY');
            $request->setSourceType($data['sourceType'] ?? 'WEB');

            $iyziLink = IyziLinkFastLink::create($request, $this->options);

            if ($iyziLink->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $iyziLink->getToken(),
                        'url' => $iyziLink->getUrl(),
                        'imageUrl' => $iyziLink->getImageUrl(),
                        'description' => $iyziLink->getDescription(),
                        'price' => $iyziLink->getPrice(),
                        'currencyCode' => $iyziLink->getCurrencyCode(),
                        'status' => $iyziLink->getStatus(),
                    ],
                    'message' => 'Fastlink başarıyla oluşturuldu',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLink->getErrorMessage(),
                    'errorCode' => $iyziLink->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: Create Fastlink failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Fastlink oluşturulurken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Retrieve iyzico Link details (Get Product)
     *
     * @param  string  $token
     * @return array|null
     */
    public function retrieveIyziLink(string $token): ?array
    {
        try {
            $request = new Request();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));

            $iyziLink = IyziLinkRetrieveProduct::create($request, $this->options, $token);

            if ($iyziLink->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $iyziLink->getToken(),
                        'url' => $iyziLink->getUrl(),
                        'imageUrl' => $iyziLink->getImageUrl(),
                        'name' => $iyziLink->getName(),
                        'description' => $iyziLink->getDescription(),
                        'price' => $iyziLink->getPrice(),
                        'currency' => $iyziLink->getCurrency(),
                        'status' => $iyziLink->getStatus(),
                        'createdDate' => $iyziLink->getCreatedDate(),
                        'updatedDate' => $iyziLink->getUpdatedDate(),
                    ],
                    'message' => 'iyzico Link detayları başarıyla alındı',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLink->getErrorMessage(),
                    'errorCode' => $iyziLink->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: Retrieve failed', [
                'error' => $e->getMessage(),
                'token' => $token,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'iyzico Link detayları alınırken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * List iyzico Links (Retrieve All Products)
     *
     * @param  array  $data
     * @return array|null
     */
    public function listIyziLinks(array $data = []): ?array
    {
        try {
            $request = new PagininRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPage($data['page'] ?? 1);
            $request->setCount($data['count'] ?? 10);

            $iyziLinkList = IyziLinkRetrieveAllProduct::create($request, $this->options);

            if ($iyziLinkList->getStatus() === 'success') {
                $links = [];
                $items = $iyziLinkList->getItems() ?? [];
                foreach ($items as $product) {
                    $links[] = [
                        'token' => $product->getToken(),
                        'url' => $product->getUrl(),
                        'imageUrl' => $product->getImageUrl(),
                        'name' => $product->getName(),
                        'description' => $product->getDescription(),
                        'price' => $product->getPrice(),
                        'currency' => $product->getCurrency(),
                        'status' => $product->getStatus(),
                        'createdDate' => $product->getCreatedDate(),
                        'updatedDate' => $product->getUpdatedDate(),
                    ];
                }

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'links' => $links,
                        'currentPage' => $iyziLinkList->getCurrentPage(),
                        'totalCount' => $iyziLinkList->getTotalCount(),
                    ],
                    'message' => 'iyzico Link listesi başarıyla alındı',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLinkList->getErrorMessage(),
                    'errorCode' => $iyziLinkList->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: List failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'iyzico Link listesi alınırken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Update iyzico Link (Update Product)
     *
     * @param  string  $token
     * @param  array  $data
     * @return array|null
     */
    public function updateIyziLink(string $token, array $data): ?array
    {
        try {
            $request = new IyziLinkSaveProductRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));

            if (isset($data['name'])) {
                $request->setName($data['name']);
            }
            if (isset($data['description'])) {
                $request->setDescription($data['description']);
            }
            if (isset($data['price'])) {
                $request->setPrice($data['price']);
            }
            if (isset($data['currency'])) {
                $request->setCurrency($data['currency']);
            }
            if (isset($data['addressIgnorable'])) {
                $request->setAddressIgnorable($data['addressIgnorable']);
            }
            if (isset($data['soldLimit'])) {
                $request->setSoldLimit($data['soldLimit']);
            }
            if (isset($data['installmentRequested'])) {
                $request->setInstallmentRequest($data['installmentRequested']);
            }
            if (isset($data['sourceType'])) {
                $request->setSourceType($data['sourceType']);
            }
            if (isset($data['stockEnabled'])) {
                $request->setStockEnabled($data['stockEnabled']);
            }
            if (isset($data['stockCount'])) {
                $request->setStockCount($data['stockCount']);
            }

            // Base64 encoded image
            if (isset($data['imagePath']) && file_exists($data['imagePath'])) {
                $request->setBase64EncodedImage(FileBase64Encoder::encode($data['imagePath']));
            } elseif (isset($data['base64EncodedImage'])) {
                $request->setBase64EncodedImage($data['base64EncodedImage']);
            }

            $iyziLink = IyziLinkUpdateProduct::create($request, $this->options, $token);

            if ($iyziLink->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $iyziLink->getToken(),
                        'url' => $iyziLink->getUrl(),
                        'imageUrl' => $iyziLink->getImageUrl(),
                        'name' => $iyziLink->getName(),
                        'description' => $iyziLink->getDescription(),
                        'price' => $iyziLink->getPrice(),
                        'currency' => $iyziLink->getCurrency(),
                        'status' => $iyziLink->getStatus(),
                    ],
                    'message' => 'iyzico Link başarıyla güncellendi',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLink->getErrorMessage(),
                    'errorCode' => $iyziLink->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: Update failed', [
                'error' => $e->getMessage(),
                'token' => $token,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'iyzico Link güncellenirken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Update iyzico Link status
     *
     * @param  string  $token
     * @param  string  $status
     * @return array|null
     */
    public function updateIyziLinkStatus(string $token, string $status): ?array
    {
        try {
            $request = new IyziLinkUpdateProductStatusRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setToken($token);
            $request->setProductStatus($status === 'ACTIVE' ? Status::ACTIVE : Status::PASSIVE);

            $iyziLink = IyziLinkUpdateProductStatus::create($request, $this->options);

            if ($iyziLink->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $iyziLink->getToken(),
                        'status' => $iyziLink->getStatus(),
                    ],
                    'message' => 'iyzico Link durumu başarıyla güncellendi',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLink->getErrorMessage(),
                    'errorCode' => $iyziLink->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: Update status failed', [
                'error' => $e->getMessage(),
                'token' => $token,
                'status' => $status,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'iyzico Link durumu güncellenirken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Delete iyzico Link
     *
     * @param  string  $token
     * @return array|null
     */
    public function deleteIyziLink(string $token): ?array
    {
        try {
            $request = new Request();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));

            $iyziLink = IyziLinkDeleteProduct::create($request, $this->options, $token);

            if ($iyziLink->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'success' => true,
                    'message' => 'iyzico Link başarıyla silindi',
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $iyziLink->getErrorMessage(),
                    'errorCode' => $iyziLink->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('IyzicoLinkService: Delete failed', [
                'error' => $e->getMessage(),
                'token' => $token,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'iyzico Link silinirken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }
}
