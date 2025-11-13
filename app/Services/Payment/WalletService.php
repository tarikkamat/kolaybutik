<?php

namespace App\Services\Payment;

use App\Services\Checkout\CartService;
use App\Services\Payment\Helpers\SignatureVerification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\BasketItemType;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\Currency;
use Iyzipay\Model\Locale;
use Iyzipay\Model\PayWithIyzico;
use Iyzipay\Model\PayWithIyzicoInitialize;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Options;
use Iyzipay\Request\CreatePayWithIyzicoInitializeRequest;
use Iyzipay\Request\RetrievePayWithIyzicoRequest;

class WalletService
{
    private Options $options;
    private CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->options = new Options();
        $this->options->setApiKey(config('iyzipay.api_key'));
        $this->options->setSecretKey(config('iyzipay.secret_key'));
        $this->options->setBaseUrl(config('iyzipay.base_url'));
        $this->cartService = $cartService;
    }

    /**
     * Initialize Pay with iyzico payment
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializePayWithIyzico(array $data): ?array
    {
        try {
            $sessionId = Session::getId();

            // Sepet kontrolü
            $cartSummary = $this->cartService->getCartSummary();

            if (empty($cartSummary['items'])) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Sepetiniz boş.',
                    'errorCode' => 'EMPTY_CART'
                ];
            }

            // Request oluştur
            $request = new CreatePayWithIyzicoInitializeRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setPrice(number_format($cartSummary['subtotal'], 2, '.', ''));
            $request->setPaidPrice(number_format($cartSummary['total'], 2, '.', ''));
            $request->setCurrency(Currency::TL);
            $request->setBasketId('BASKET_'.time());
            $request->setPaymentGroup(PaymentGroup::PRODUCT);
            $request->setCallbackUrl(route('store.payment.wallet.callback'));
            $request->setEnabledInstallments([2, 3, 6, 9, 12]);

            // Buyer bilgileri
            $buyer = new Buyer();
            $buyerId = 'GUEST_'.$sessionId;
            $buyer->setId($buyerId);

            // İsim ve soyisim ayır
            $nameParts = explode(' ', $data['full_name'], 2);
            $buyer->setName($nameParts[0] ?? 'Ad');
            $buyer->setSurname($nameParts[1] ?? 'Soyad');
            $buyer->setGsmNumber($data['phone'] ?? '+905554443322');
            $buyer->setEmail($data['email'] ?? 'customer@example.com');
            $buyer->setIdentityNumber('11111111111');
            $buyer->setLastLoginDate(date('Y-m-d H:i:s'));
            $buyer->setRegistrationDate(date('Y-m-d H:i:s'));
            $buyer->setRegistrationAddress($data['address'] ?? 'Adres');
            $buyer->setIp(request()->ip());
            $buyer->setCity($data['city'] ?? 'Istanbul');
            $buyer->setCountry($data['country'] ?? 'Turkey');
            $buyer->setZipCode($data['postal_code'] ?? '34000');
            $request->setBuyer($buyer);

            // Shipping Address
            $shippingAddress = new Address();
            $shippingAddress->setContactName($data['full_name'] ?? 'Ad Soyad');
            $shippingAddress->setCity($data['city'] ?? 'Istanbul');
            $shippingAddress->setCountry($data['country'] ?? 'Turkey');
            $shippingAddress->setAddress($data['address'] ?? 'Adres');
            $shippingAddress->setZipCode($data['postal_code'] ?? '34000');
            $request->setShippingAddress($shippingAddress);

            // Billing Address
            $billingAddress = new Address();
            $billingAddress->setContactName($data['full_name'] ?? 'Ad Soyad');
            $billingAddress->setCity($data['city'] ?? 'Istanbul');
            $billingAddress->setCountry($data['country'] ?? 'Turkey');
            $billingAddress->setAddress($data['address'] ?? 'Adres');
            $billingAddress->setZipCode($data['postal_code'] ?? '34000');
            $request->setBillingAddress($billingAddress);

            // Basket Items
            $basketItems = [];
            foreach ($cartSummary['items'] as $index => $item) {
                $basketItem = new BasketItem();
                $basketItem->setId('BI'.$item['product_id']);
                $basketItem->setName($item['product']['name'] ?? 'Ürün');
                $basketItem->setCategory1($item['product']['category']['name'] ?? 'Genel');
                $basketItem->setCategory2('Ürün');
                $basketItem->setItemType(BasketItemType::PHYSICAL);
                $basketItem->setPrice(number_format($item['price'], 2, '.', ''));
                $basketItems[] = $basketItem;
            }
            $request->setBasketItems($basketItems);

            // Pay with iyzico initialize
            $payWithIyzicoInitialize = PayWithIyzicoInitialize::create($request, $this->options);

            if ($payWithIyzicoInitialize->getStatus() === 'success') {
                // Session'a bilgileri kaydet
                Session::put('pay_with_iyzico_token', $payWithIyzicoInitialize->getToken());
                Session::put('pay_with_iyzico_conversation_id', $payWithIyzicoInitialize->getConversationId());

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $payWithIyzicoInitialize->getToken(),
                        'payWithIyzicoPageUrl' => $payWithIyzicoInitialize->getPayWithIyzicoPageUrl(),
                    ],
                    'message' => 'Pay with iyzico başarıyla oluşturuldu'
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $payWithIyzicoInitialize->getErrorMessage(),
                    'errorCode' => $payWithIyzicoInitialize->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('WalletService: Initialize Pay with iyzico failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Pay with iyzico oluşturulurken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION'
            ];
        }
    }

    /**
     * Process wallet payment with iyzico (Pay with iyzico)
     *
     * @param  array  $data
     * @return array|null
     */
    public function processWalletPayment(array $data): ?array
    {
        try {
            $token = $data['token'] ?? Session::get('pay_with_iyzico_token');

            if (!$token) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Token bulunamadı',
                    'errorCode' => 'MISSING_TOKEN'
                ];
            }

            $conversationId = $data['conversationId'] ?? Session::get('pay_with_iyzico_conversation_id') ?? uniqid('conv_', true);

            // Retrieve Pay with iyzico result
            $request = new RetrievePayWithIyzicoRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId);
            $request->setToken($token);

            $payWithIyzico = PayWithIyzico::retrieve($request, $this->options);

            if ($payWithIyzico->getStatus() === 'success') {
                // Signature verification
                $signature = $payWithIyzico->getSignature();
                $paymentStatus = $payWithIyzico->getPaymentStatus();
                $paymentId = $payWithIyzico->getPaymentId();
                $currency = $payWithIyzico->getCurrency();
                $basketId = $payWithIyzico->getBasketId();
                $conversationId = $payWithIyzico->getConversationId();
                $paidPrice = $payWithIyzico->getPaidPrice();
                $price = $payWithIyzico->getPrice();
                $token = $payWithIyzico->getToken();

                $secretKey = config('iyzipay.secret_key');
                $isSignatureValid = SignatureVerification::verifyPayWithIyzicoSignature(
                    $signature,
                    $paymentStatus,
                    $paymentId,
                    $currency,
                    $basketId,
                    $conversationId,
                    $paidPrice,
                    $price,
                    $token,
                    $secretKey
                );

                if (!$isSignatureValid) {
                    Log::error('WalletService: Signature verification failed', [
                        'token' => $token,
                        'conversationId' => $conversationId,
                    ]);

                    return [
                        'status' => 'error',
                        'errorMessage' => 'Signature doğrulaması başarısız',
                        'errorCode' => 'SIGNATURE_VERIFICATION_FAILED',
                    ];
                }

                if ($paymentStatus === 'SUCCESS') {
                    // Session'dan bilgileri temizle
                    Session::forget(['pay_with_iyzico_token', 'pay_with_iyzico_conversation_id']);

                    return [
                        'status' => 'success',
                        'paymentId' => $paymentId,
                        'fraudStatus' => $payWithIyzico->getFraudStatus(),
                        'price' => $price,
                        'paidPrice' => $paidPrice,
                        'currency' => $currency,
                        'basketId' => $basketId,
                        'conversationId' => $conversationId,
                        'paymentStatus' => $paymentStatus,
                    ];
                } else {
                    return [
                        'status' => 'error',
                        'errorMessage' => 'Ödeme başarısız: '.$paymentStatus,
                        'errorCode' => 'PAYMENT_FAILED',
                        'paymentStatus' => $paymentStatus,
                    ];
                }
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $payWithIyzico->getErrorMessage(),
                    'errorCode' => $payWithIyzico->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('WalletService: Process payment failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'status' => 'error',
                'errorMessage' => 'Ödeme işlenirken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION'
            ];
        }
    }
}
