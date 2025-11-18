<?php

namespace App\Services\Payment;

class PaymentService
{
    private ApiService $apiService;
    private CheckoutFormService $checkoutFormService;
    private QuickPwiService $quickPwiService;
    private WalletService $walletService;
    private IyzicoLinkService $iyzicoLinkService;

    public function __construct(
        ApiService $apiService,
        CheckoutFormService $checkoutFormService,
        QuickPwiService $quickPwiService,
        WalletService $walletService,
        IyzicoLinkService $iyzicoLinkService,
    ) {
        $this->apiService = $apiService;
        $this->checkoutFormService = $checkoutFormService;
        $this->quickPwiService = $quickPwiService;
        $this->walletService = $walletService;
        $this->iyzicoLinkService = $iyzicoLinkService;
    }

    /**
     * Process credit card payment with iyzico (Non-3DS)
     *
     * @param  array  $data
     * @return array|null
     */
    public function processCreditCardPayment(array $data): ?array
    {
        return $this->apiService->processCreditCardPayment($data);
    }

    /**
     * Initialize 3DS payment with iyzico
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializeThreedsPayment(array $data): ?array
    {
        return $this->apiService->initializeThreedsPayment($data);
    }

    /**
     * Process 3DS post auth payment
     *
     * @param  array  $data
     * @return array|null
     */
    public function processThreedsPostAuth(array $data): ?array
    {
        return $this->apiService->processThreedsPostAuth($data);
    }

    /**
     * Process payment based on payment method type
     *
     * @param  string  $method
     * @param  array  $data
     * @return array|null
     */
    public function processPayment(string $method, array $data): ?array
    {
        return match ($method) {
            'api_credit_card' => $this->apiService->processCreditCardPayment($data),
            'api_threeds' => $this->apiService->initializeThreedsPayment($data),
            'api_threeds_post_auth' => $this->apiService->processThreedsPostAuth($data),
            'checkout_form' => $this->checkoutFormService->processCheckoutFormPayment($data),
            'quick_pwi' => $this->quickPwiService->processQuickPayment($data),
            'wallet' => $this->walletService->processWalletPayment($data),
            default => [
                'status' => 'error',
                'errorMessage' => 'Geçersiz ödeme yöntemi',
                'errorCode' => 'INVALID_PAYMENT_METHOD'
            ]
        };
    }

    /**
     * Process checkout form payment with iyzico
     *
     * @param  array  $data
     * @return array|null
     */
    public function processCheckoutFormPayment(array $data): ?array
    {
        return $this->processPayment('checkout_form', $data);
    }

    /**
     * Initialize Pay with iyzico payment
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializePayWithIyzico(array $data): ?array
    {
        return $this->walletService->initializePayWithIyzico($data);
    }

    /**
     * Process iyzico payment (Pay with iyzico) - callback için
     *
     * @param  array  $data
     * @return array|null
     */
    public function processIyzicoPayment(array $data): ?array
    {
        return $this->processPayment('wallet', $data);
    }

    /**
     * Initialize Quick PWI checkout form
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializeQuickPwi(array $data): ?array
    {
        return $this->quickPwiService->initializeQuickPwi($data);
    }

    /**
     * Process quick pay with iyzico (Quick PWI)
     *
     * @param  array  $data
     * @return array|null
     */
    public function processIyzicoQuickPayment(array $data): ?array
    {
        return $this->processPayment('quick_pwi', $data);
    }

    /**
     * Process saved card payment with iyzico
     *
     * @param  array  $data
     * @return array|null
     */
    public function processSavedCardPayment(array $data): ?array
    {
        // Saved card payments typically use API service
        return $this->apiService->processCreditCardPayment($data);
    }

    /**
     * Initialize iyzico checkout form
     *
     * @param  array  $data
     * @return array|null
     */
    public function initializeCheckoutForm(array $data): ?array
    {
        return $this->checkoutFormService->initializeCheckoutForm($data);
    }

    /**
     * Get saved cards for user
     *
     * @param  int  $userId
     * @return array|null
     */
    public function getSavedCards(int $userId): ?array
    {
        // TODO: Get saved cards from iyzico
        return null;
    }

    /**
     * Create iyzico Link
     *
     * @param  array  $data
     * @return array|null
     */
    public function createIyziLink(array $data): ?array
    {
        return $this->iyzicoLinkService->createIyziLink($data);
    }

    /**
     * Create Fastlink
     *
     * @param  array  $data
     * @return array|null
     */
    public function createFastlink(array $data): ?array
    {
        return $this->iyzicoLinkService->createFastlink($data);
    }

    /**
     * Retrieve iyzico Link details
     *
     * @param  string  $token
     * @return array|null
     */
    public function retrieveIyziLink(string $token): ?array
    {
        return $this->iyzicoLinkService->retrieveIyziLink($token);
    }

    /**
     * List iyzico Links
     *
     * @param  array  $data
     * @return array|null
     */
    public function listIyziLinks(array $data = []): ?array
    {
        return $this->iyzicoLinkService->listIyziLinks($data);
    }

    /**
     * Update iyzico Link
     *
     * @param  string  $token
     * @param  array  $data
     * @return array|null
     */
    public function updateIyziLink(string $token, array $data): ?array
    {
        return $this->iyzicoLinkService->updateIyziLink($token, $data);
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
        return $this->iyzicoLinkService->updateIyziLinkStatus($token, $status);
    }

    /**
     * Delete iyzico Link
     *
     * @param  string  $token
     * @return array|null
     */
    public function deleteIyziLink(string $token): ?array
    {
        return $this->iyzicoLinkService->deleteIyziLink($token);
    }
}

