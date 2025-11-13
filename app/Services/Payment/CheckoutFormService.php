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
use Iyzipay\Model\CheckoutForm;
use Iyzipay\Model\CheckoutFormInitialize;
use Iyzipay\Model\Currency;
use Iyzipay\Model\Locale;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Options;
use Iyzipay\Request\CreateCheckoutFormInitializeRequest;
use Iyzipay\Request\RetrieveCheckoutFormRequest;

class CheckoutFormService
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
     * Initialize iyzico checkout form
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializeCheckoutForm(array $data): ?array
    {
        try {
            $sessionId = Session::getId();

            $cartSummary = $this->cartService->getCartSummary();

            if (empty($cartSummary['items'])) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Sepetiniz boş.',
                    'errorCode' => 'EMPTY_CART'
                ];
            }

            $request = new CreateCheckoutFormInitializeRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setPrice(number_format($cartSummary['subtotal'], 2, '.', ''));
            $request->setPaidPrice(number_format($cartSummary['total'], 2, '.', ''));
            $request->setCurrency(Currency::TL);
            $request->setBasketId('BASKET_'.time());
            $request->setPaymentGroup(PaymentGroup::PRODUCT);
            $request->setCallbackUrl(route('store.payment.checkout-form.callback'));
            $request->setEnabledInstallments([2, 3, 6, 9, 12]);

            $buyer = new Buyer();
            // Kullanıcı giriş yapmışsa user ID, yoksa session ID kullan
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
            $billingAddress->setAddress($data['address'] ?? '');
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

            // Checkout form initialize
            $checkoutFormInitialize = CheckoutFormInitialize::create($request, $this->options);

            if ($checkoutFormInitialize->getStatus() === 'success') {
                // Session'a bilgileri kaydet
                Session::put('checkout_form_token', $checkoutFormInitialize->getToken());
                Session::put('checkout_form_conversation_id', $checkoutFormInitialize->getConversationId());
                Session::put('checkout_form_initial_price', $cartSummary['total']);

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'token' => $checkoutFormInitialize->getToken(),
                        'checkoutFormContent' => $checkoutFormInitialize->getCheckoutFormContent(),
                    ],
                    'message' => 'Checkout form başarıyla oluşturuldu'
                ];
            } else {
                return [
                    'status' => 'error',
                    'success' => false,
                    'errorMessage' => $checkoutFormInitialize->getErrorMessage(),
                    'errorCode' => $checkoutFormInitialize->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('CheckoutFormService: Initialize failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Checkout form oluşturulurken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION'
            ];
        }
    }

    /**
     * Process checkout form payment with iyzico
     *
     * @param  array  $data
     * @return array|null
     */
    public function processCheckoutFormPayment(array $data): ?array
    {
        try {
            $token = $data['token'] ?? Session::get('checkout_form_token');

            if (!$token) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Token bulunamadı',
                    'errorCode' => 'MISSING_TOKEN'
                ];
            }

            $conversationId = $data['conversationId'] ?? Session::get('checkout_form_conversation_id') ?? uniqid('conv_', true);

            // Retrieve checkout form result
            $request = new RetrieveCheckoutFormRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId);
            $request->setToken($token);

            $checkoutForm = CheckoutForm::retrieve($request, $this->options);

            if ($checkoutForm->getStatus() === 'success') {
                // Signature verification
                $signature = $checkoutForm->getSignature();
                $paymentStatus = $checkoutForm->getPaymentStatus();
                $paymentId = $checkoutForm->getPaymentId();
                $currency = $checkoutForm->getCurrency();
                $basketId = $checkoutForm->getBasketId();
                $conversationId = $checkoutForm->getConversationId();
                $paidPrice = $checkoutForm->getPaidPrice();
                $price = $checkoutForm->getPrice();
                $token = $checkoutForm->getToken();

                $secretKey = config('iyzipay.secret_key');
                $isSignatureValid = SignatureVerification::verifyCheckoutFormSignature(
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
                    Log::error('CheckoutFormService: Signature verification failed', [
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
                    Session::forget(['checkout_form_token', 'checkout_form_conversation_id', 'checkout_form_initial_price']);

                    return [
                        'status' => 'success',
                        'paymentId' => $paymentId,
                        'fraudStatus' => $checkoutForm->getFraudStatus(),
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
                    'errorMessage' => $checkoutForm->getErrorMessage(),
                    'errorCode' => $checkoutForm->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            Log::error('CheckoutFormService: Process payment failed', [
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
