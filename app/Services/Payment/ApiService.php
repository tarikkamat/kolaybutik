<?php

namespace App\Services\Payment;

use App\Services\Checkout\CartService;
use Illuminate\Support\Facades\Auth;
use Iyzipay\Model\Address;
use Iyzipay\Model\BasketItem;
use Iyzipay\Model\BasketItemType;
use Iyzipay\Model\Buyer;
use Iyzipay\Model\Currency;
use Iyzipay\Model\Locale;
use Iyzipay\Model\Payment;
use Iyzipay\Model\PaymentCard;
use Iyzipay\Model\PaymentChannel;
use Iyzipay\Model\PaymentGroup;
use Iyzipay\Model\ThreedsPayment;
use Iyzipay\Model\ThreedsInitialize;
use Iyzipay\Options;
use Iyzipay\Request\CreateThreedsPaymentRequest;
use Iyzipay\Request\CreatePaymentRequest;
use Iyzipay\Request\RetrievePaymentRequest;
use Illuminate\Support\Facades\Log;

class ApiService
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
     * Process credit card payment with iyzico (Non-3DS)
     *
     * @param  array  $data
     * @return array|null
     */
    public function processCreditCardPayment(array $data): ?array
    {
        try {
            // Demo mod için cart summary kontrolü
            $cartSummary = $data['demo_cart_summary'] ?? $this->cartService->getCartSummary();

            if (empty($cartSummary['items'])) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Sepet boş',
                    'errorCode' => 'EMPTY_CART'
                ];
            }

            $subtotal = $cartSummary['subtotal'];
            $total = $cartSummary['total'];

            $request = new CreatePaymentRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setPrice(number_format($subtotal, 2, '.', ''));
            $request->setPaidPrice(number_format($total, 2, '.', ''));
            $request->setCurrency(Currency::TL);
            $request->setInstallment(1);
            $request->setBasketId('BASKET_'.time());
            $request->setPaymentChannel(PaymentChannel::WEB);
            $request->setPaymentGroup(PaymentGroup::PRODUCT);

            // Payment Card
            $paymentCard = new PaymentCard();
            $paymentCard->setCardHolderName($data['card_name']);

            // Kart numarasından boşlukları temizle
            $cardNumber = preg_replace('/\s+/', '', $data['card_number']);
            $paymentCard->setCardNumber($cardNumber);

            // Expiry date'i ayır (MM/YY formatından)
            $expiry = explode('/', $data['card_expiry']);
            $paymentCard->setExpireMonth(trim($expiry[0]));
            $paymentCard->setExpireYear('20'.trim($expiry[1]));
            $paymentCard->setCvc($data['card_cvv']);
            $paymentCard->setRegisterCard(0);
            $request->setPaymentCard($paymentCard);

            // Buyer
            $buyer = new Buyer();
            $buyer->setId(Auth::check() ? (string) Auth::id() : 'GUEST_'.session()->getId());
            $buyer->setName(explode(' ', $data['full_name'])[0] ?? $data['full_name']);
            $buyer->setSurname(explode(' ', $data['full_name'], 2)[1] ?? '');
            $buyer->setGsmNumber("+905546041451"); // TODO:
            $buyer->setEmail($data['email']);
            $buyer->setIdentityNumber('11111111111'); // Test için
            $buyer->setLastLoginDate(date('Y-m-d H:i:s'));
            $buyer->setRegistrationDate(date('Y-m-d H:i:s'));
            $buyer->setRegistrationAddress($data['address']);
            $buyer->setIp(request()->ip());
            $buyer->setCity($data['city']);
            $buyer->setCountry($data['country']);
            $buyer->setZipCode($data['postal_code']);
            $request->setBuyer($buyer);

            // Shipping Address
            $shippingAddress = new Address();
            $shippingAddress->setContactName($data['full_name']);
            $shippingAddress->setCity($data['city']);
            $shippingAddress->setCountry($data['country']);
            $shippingAddress->setAddress($data['address']);
            $shippingAddress->setZipCode($data['postal_code']);
            $request->setShippingAddress($shippingAddress);

            // Billing Address
            $billingAddress = new Address();
            $billingAddress->setContactName($data['full_name']);
            $billingAddress->setCity($data['city']);
            $billingAddress->setCountry($data['country']);
            $billingAddress->setAddress($data['address']);
            $billingAddress->setZipCode($data['postal_code']);
            $request->setBillingAddress($billingAddress);

            // Basket Items
            $basketItems = [];
            foreach ($cartSummary['items'] as $index => $item) {
                $basketItem = new BasketItem();
                $basketItem->setId('BI'.$item['product_id']);
                $basketItem->setName($item['product']['name']);
                $basketItem->setCategory1($item['product']['category']['name'] ?? 'Genel');
                $basketItem->setCategory2('Ürün');
                $basketItem->setItemType(BasketItemType::PHYSICAL);
                $basketItem->setPrice(number_format($item['price'], 2, '.', ''));
                $basketItems[] = $basketItem;
            }
            $request->setBasketItems($basketItems);

            // Make payment request
            $payment = Payment::create($request, $this->options);

            if ($payment->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'paymentId' => $payment->getPaymentId(),
                    'fraudStatus' => $payment->getFraudStatus(),
                    'price' => $payment->getPrice(),
                    'paidPrice' => $payment->getPaidPrice(),
                    'currency' => $payment->getCurrency(),
                    'basketId' => $payment->getBasketId(),
                    'conversationId' => $payment->getConversationId(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $payment->getErrorMessage(),
                    'errorCode' => $payment->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION'
            ];
        }
    }

    /**
     * Initialize 3DS payment with iyzico
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializeThreedsPayment(array $data): ?array
    {
        try {
            // Demo mod için cart summary kontrolü
            $cartSummary = $data['demo_cart_summary'] ?? $this->cartService->getCartSummary();

            if (empty($cartSummary['items'])) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Sepet boş',
                    'errorCode' => 'EMPTY_CART'
                ];
            }

            $subtotal = $cartSummary['subtotal'];
            $total = $cartSummary['total'];

            $request = new CreatePaymentRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setPrice(number_format($subtotal, 2, '.', ''));
            $request->setPaidPrice(number_format($total, 2, '.', ''));
            $request->setCurrency(Currency::TL);
            $request->setInstallment(1);
            $request->setBasketId('BASKET_'.time());
            $request->setPaymentChannel(PaymentChannel::WEB);
            $request->setPaymentGroup(PaymentGroup::PRODUCT);
            $request->setCallbackUrl(route('store.payment.threeds-callback'));

            // Payment Card
            $paymentCard = new PaymentCard();
            $paymentCard->setCardHolderName($data['card_name']);

            // Kart numarasından boşlukları temizle
            $cardNumber = preg_replace('/\s+/', '', $data['card_number']);
            $paymentCard->setCardNumber($cardNumber);

            // Expiry date'i ayır (MM/YY formatından)
            $expiry = explode('/', $data['card_expiry']);
            $paymentCard->setExpireMonth(trim($expiry[0]));
            $paymentCard->setExpireYear('20'.trim($expiry[1]));
            $paymentCard->setCvc($data['card_cvv']);
            $paymentCard->setRegisterCard(0);
            $request->setPaymentCard($paymentCard);

            // Buyer
            $buyer = new Buyer();
            $buyer->setId(Auth::check() ? (string) Auth::id() : 'GUEST_'.session()->getId());
            $buyer->setName(explode(' ', $data['full_name'])[0] ?? $data['full_name']);
            $buyer->setSurname(explode(' ', $data['full_name'], 2)[1] ?? '');
            $buyer->setGsmNumber("+905546041451"); // TODO:
            $buyer->setEmail($data['email']);
            $buyer->setIdentityNumber('11111111111'); // Test için
            $buyer->setLastLoginDate(date('Y-m-d H:i:s'));
            $buyer->setRegistrationDate(date('Y-m-d H:i:s'));
            $buyer->setRegistrationAddress($data['address']);
            $buyer->setIp(request()->ip());
            $buyer->setCity($data['city']);
            $buyer->setCountry($data['country']);
            $buyer->setZipCode($data['postal_code']);
            $request->setBuyer($buyer);

            // Shipping Address
            $shippingAddress = new Address();
            $shippingAddress->setContactName($data['full_name']);
            $shippingAddress->setCity($data['city']);
            $shippingAddress->setCountry($data['country']);
            $shippingAddress->setAddress($data['address']);
            $shippingAddress->setZipCode($data['postal_code']);
            $request->setShippingAddress($shippingAddress);

            // Billing Address
            $billingAddress = new Address();
            $billingAddress->setContactName($data['full_name']);
            $billingAddress->setCity($data['city']);
            $billingAddress->setCountry($data['country']);
            $billingAddress->setAddress($data['address']);
            $billingAddress->setZipCode($data['postal_code']);
            $request->setBillingAddress($billingAddress);

            // Basket Items
            $basketItems = [];
            foreach ($cartSummary['items'] as $index => $item) {
                $basketItem = new BasketItem();
                $basketItem->setId('BI'.$item['product_id']);
                $basketItem->setName($item['product']['name']);
                $basketItem->setCategory1($item['product']['category']['name'] ?? 'Genel');
                $basketItem->setCategory2('Ürün');
                $basketItem->setItemType(BasketItemType::PHYSICAL);
                $basketItem->setPrice(number_format($item['price'], 2, '.', ''));
                $basketItems[] = $basketItem;
            }
            $request->setBasketItems($basketItems);

            // Initialize 3DS
            $threedsInitialize = ThreedsInitialize::create($request, $this->options);

            if ($threedsInitialize->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'paymentId' => $threedsInitialize->getPaymentId(),
                    'conversationId' => $threedsInitialize->getConversationId(),
                    'htmlContent' => $threedsInitialize->getHtmlContent(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $threedsInitialize->getErrorMessage(),
                    'errorCode' => $threedsInitialize->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION'
            ];
        }
    }

    /**
     * Check payment status before Post Auth
     *
     * @param  string  $paymentId
     * @param  string  $conversationId
     * @return array|null
     */
    protected function checkPaymentStatus(string $paymentId, string $conversationId): ?array
    {
        try {
            $request = new RetrievePaymentRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId);
            $request->setPaymentId($paymentId);

            $payment = Payment::retrieve($request, $this->options);

            if ($payment->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'paymentStatus' => $payment->getPaymentStatus(),
                    'phase' => $payment->getPhase(),
                    'fraudStatus' => $payment->getFraudStatus(),
                    'paidPrice' => $payment->getPaidPrice(),
                    'price' => $payment->getPrice(),
                    'currency' => $payment->getCurrency(),
                ];
            }

            return [
                'status' => 'error',
                'errorMessage' => $payment->getErrorMessage(),
                'errorCode' => $payment->getErrorCode(),
            ];
        } catch (\Exception $e) {
            Log::error('ApiService: Payment status check failed', [
                'error' => $e->getMessage(),
                'paymentId' => $paymentId,
            ]);
            return null;
        }
    }

    /**
     * Process 3DS post auth payment
     *
     * @param  array  $data
     * @return array|null
     */
    public function processThreedsPostAuth(array $data): ?array
    {
        try {
            $cartSummary = $this->cartService->getCartSummary();
            $paymentStatus = $this->checkPaymentStatus($data['paymentId'], $data['conversationId']);

            if ($paymentStatus && $paymentStatus['status'] === 'success') {
                $paymentStatusValue = $paymentStatus['paymentStatus'] ?? null;
                $phase = $paymentStatus['phase'] ?? null;

                if ($paymentStatusValue === 'SUCCESS') {
                    return [
                        'status' => 'success',
                        'paymentId' => $data['paymentId'],
                        'conversationId' => $data['conversationId'],
                        'message' => 'Ödeme zaten tamamlanmış',
                        'alreadyCompleted' => true,
                    ];
                }
            }

            $request = new CreateThreedsPaymentRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($data['conversationId'] ?? uniqid('conv_', true));
            $request->setPaymentId($data['paymentId']);

            if ($paymentStatus && $paymentStatus['status'] === 'success' && isset($paymentStatus['paidPrice'])) {
                $paidPrice = $paymentStatus['paidPrice'];
                Log::info('ApiService: Using paidPrice from Payment Inquiry', [
                    'paidPrice_from_inquiry' => $paidPrice,
                    'paidPrice_from_cart' => $cartSummary['total'] ?? null,
                ]);
            } else {
                Log::warning('ApiService: Using paidPrice from cart (Payment Inquiry failed or missing)', [
                    'payment_status_check' => $paymentStatus,
                ]);
            }

            $postAuth = ThreedsPayment::create($request, $this->options);

            if ($postAuth->getStatus() === 'success') {
                return [
                    'status' => 'success',
                    'paymentId' => $postAuth->getPaymentId(),
                    'fraudStatus' => $postAuth->getFraudStatus(),
                    'price' => $postAuth->getPrice(),
                    'paidPrice' => $postAuth->getPaidPrice(),
                    'currency' => $postAuth->getCurrency(),
                    'basketId' => $postAuth->getBasketId(),
                    'conversationId' => $postAuth->getConversationId(),
                ];
            } else {
                return [
                    'status' => 'error',
                    'errorMessage' => $postAuth->getErrorMessage(),
                    'errorCode' => $postAuth->getErrorCode(),
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
                'errorCode' => 'EXCEPTION'
            ];
        }
    }
}
