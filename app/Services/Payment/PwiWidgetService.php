<?php

namespace App\Services\Payment;

use App\Models\Product;
use App\Services\Payment\Support\LocaleResolver;
use App\Traits\RedisCache;
use Illuminate\Support\Facades\Log;
use Iyzipay\Model\Currency;
use Iyzipay\Model\PayWithIyzicoWidgetBasketItem;
use Iyzipay\Model\PayWithIyzicoWidgetInitialize;
use Iyzipay\Model\PayWithIyzicoWidgetPaymentPlan;
use Iyzipay\Options;
use Iyzipay\Request\CreatePayWithIyzicoWidgetInitializeRequest;
use Iyzipay\Request\RetrievePayWithIyzicoWidgetPaymentPlanRequest;

/**
 * Pay with iyzico Widget - Alışveriş Kredisi
 *
 * 1) /v1/pay-with-iyzico/widget/init
 *    Ürün sayfası açılırken çağrılır. widgetToken ile "X aya varan, aylık Y TL" özetini döner.
 * 2) /v1/pay-with-iyzico/widget/credit/payment-plan
 *    Kullanıcı "Alışveriş Kredisi"ni açınca widgetToken ile çağrılır; banka logoları ve vade planlarını döner.
 */
class PwiWidgetService
{
    use RedisCache;

    /** Aynı ürün için her görüntülemede iyzico'ya gitmemek için kısa süreli cache. */
    private const CACHE_TTL_SECONDS = 300;

    /** Widget'ta gösterilecek en uzun vade. */
    private const MAX_INSTALLMENT = 12;

    /** iyzico Alışveriş Kredisi alt limiti (TL). */
    private const MIN_CREDIT_AMOUNT = 500;

    private Options $options;

    public function __construct()
    {
        // Alışveriş kredisi ana merchant hesabında açık (creditEnabled: true).
        $this->options = new Options;
        $this->options->setApiKey(config('iyzipay.api_key'));
        $this->options->setSecretKey(config('iyzipay.secret_key'));
        $this->options->setBaseUrl(config('iyzipay.base_url'));
    }

    /**
     * Widget init: token + kredi özeti.
     */
    public function initialize(Product $product, ?string $locale = null): array
    {
        $locale = LocaleResolver::resolve($locale);
        $price = $this->effectivePrice($product);

        return $this->rememberSuccess(
            sprintf('init:%d:%s:%s', $product->id, $price, $locale),
            function () use ($product, $price, $locale) {
                $result = $this->fetchInitialize($product, $price, $locale);

                // iyzico zaman zaman kredi özetini boş (`maxInstallment:{}`) dönüyor; bir kez daha dene.
                if ($this->isMissingCreditSummary($result)) {
                    $result = $this->fetchInitialize($product, $price, $locale);
                }

                return $result;
            },
            fn (array $result) => ! $this->isMissingCreditSummary($result),
        );
    }

    /**
     * Banka bazlı alışveriş kredisi planları.
     */
    public function paymentPlans(string $widgetToken, ?string $locale = null): array
    {
        $locale = LocaleResolver::resolve($locale);

        return $this->rememberSuccess(
            sprintf('plan:%s:%s', $widgetToken, $locale),
            fn () => $this->fetchPaymentPlans($widgetToken, $locale),
            // Boş banka listesini cache'leme, bir sonraki açılışta tekrar denensin.
            fn (array $result) => ! empty($result['banks']),
        );
    }

    private function fetchInitialize(Product $product, string $price, string $locale): array
    {
        try {
            $request = new CreatePayWithIyzicoWidgetInitializeRequest;
            $request->setLocale($locale);
            $request->setConversationId(uniqid('pwi_widget_', true));
            $request->setPrice($price);
            $request->setCurrency(Currency::TL);
            $request->setInstallment(self::MAX_INSTALLMENT);

            $basketItem = new PayWithIyzicoWidgetBasketItem;
            $basketItem->setPrice($price);
            $basketItem->setName($product->name);
            $basketItem->setCategory($product->category?->name ?? 'OTHERS');
            $request->setBasketItems([$basketItem]);

            $initialize = PayWithIyzicoWidgetInitialize::create($request, $this->options);

            if ($initialize->getStatus() !== 'success' || ! $initialize->getWidgetToken()) {
                Log::warning('PwiWidgetService: init failed', [
                    'product_id' => $product->id,
                    'errorCode' => $initialize->getErrorCode(),
                    'errorMessage' => $initialize->getErrorMessage(),
                ]);

                return $this->error($initialize->getErrorCode(), $initialize->getErrorMessage());
            }

            // widgetContent sayfaya basılmıyor (yüklediği JS/CSS adresleri boş geliyor);
            // sadece içindeki kredi özetini okumak için kullanılıyor.
            $widgetInit = $this->parseWidgetInit((string) $initialize->getWidgetContent());

            return [
                'status' => 'success',
                'widgetToken' => $initialize->getWidgetToken(),
                'price' => (float) $price,
                'currency' => Currency::TL,
                'creditEnabled' => $widgetInit['creditEnabled'],
                'payWithIyzicoEnabled' => $widgetInit['payWithIyzicoEnabled'],
                'maxInstallment' => $widgetInit['maxInstallment'],
                'installmentPrice' => $widgetInit['installmentPrice'],
            ];
        } catch (\Throwable $e) {
            Log::error('PwiWidgetService: init exception', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return $this->error('EXCEPTION', $e->getMessage());
        }
    }

    private function fetchPaymentPlans(string $widgetToken, string $locale): array
    {
        try {
            $request = new RetrievePayWithIyzicoWidgetPaymentPlanRequest;
            $request->setLocale($locale);
            $request->setConversationId(uniqid('pwi_widget_plan_', true));
            $request->setWidgetToken($widgetToken);

            $response = PayWithIyzicoWidgetPaymentPlan::retrieve($request, $this->options);

            if ($response->getStatus() !== 'success') {
                Log::warning('PwiWidgetService: payment-plan failed', [
                    'errorCode' => $response->getErrorCode(),
                    'errorMessage' => $response->getErrorMessage(),
                ]);

                return $this->error($response->getErrorCode(), $response->getErrorMessage());
            }

            $banks = [];
            foreach ($response->getFilteredPlans() ?? [] as $bankPlan) {
                $products = [];
                $lowestAmount = null;

                foreach ($bankPlan->getMonthlyPayments() ?? [] as $monthlyPayment) {
                    $terms = [];
                    foreach ($monthlyPayment->getPaymentPlans() ?? [] as $detail) {
                        $amount = (float) $detail->getAmount();
                        $lowestAmount = $lowestAmount === null ? $amount : min($lowestAmount, $amount);

                        $terms[] = [
                            'term' => (int) $detail->getTerm(),
                            'interestRate' => (float) $detail->getInterestRate(),
                            'amount' => $amount,
                            'totalPaymentAmount' => (float) $detail->getTotalPaymentAmount(),
                            'annualEffectiveInterestRate' => $detail->getAnnualEffectiveInterestRate() !== null
                                ? (float) $detail->getAnnualEffectiveInterestRate()
                                : null,
                        ];
                    }

                    usort($terms, fn ($a, $b) => $a['term'] <=> $b['term']);

                    $products[] = [
                        'productType' => $monthlyPayment->getProductType(),
                        'terms' => $terms,
                        'campaigns' => $monthlyPayment->getCampaigns() ?? [],
                    ];
                }

                $banks[] = [
                    'bankId' => $bankPlan->getBankId(),
                    'bankName' => $bankPlan->getBankName(),
                    'bankLogoUrl' => $bankPlan->getBankLogoUrl(),
                    'existingCustomer' => (bool) $bankPlan->getExistingCustomer(),
                    'lowestAmount' => $lowestAmount,
                    'maxTerm' => max(array_merge([0], ...array_map(
                        fn ($p) => array_column($p['terms'], 'term'),
                        $products,
                    ))),
                    'products' => $products,
                ];
            }

            return [
                'status' => 'success',
                'banks' => $banks,
            ];
        } catch (\Throwable $e) {
            Log::error('PwiWidgetService: payment-plan exception', ['error' => $e->getMessage()]);

            return $this->error('EXCEPTION', $e->getMessage());
        }
    }

    /**
     * Sadece başarılı (ve $cacheable'a göre eksiksiz) cevapları cache'te tutar;
     * diğerleri bir sonraki istekte tekrar denenir.
     */
    private function rememberSuccess(string $key, callable $callback, ?callable $cacheable = null): array
    {
        $result = $this->remember($key, $callback, self::CACHE_TTL_SECONDS);

        if (($result['status'] ?? null) !== 'success' || ($cacheable && ! $cacheable($result))) {
            $this->forget($key);
        }

        return $result;
    }

    /**
     * Kredi açık ve tutar kredi alt limitinin üstünde olduğu halde özet (vade/taksit) gelmediyse true.
     */
    private function isMissingCreditSummary(array $result): bool
    {
        return ($result['status'] ?? null) === 'success'
            && ($result['creditEnabled'] ?? false)
            && ($result['price'] ?? 0) >= self::MIN_CREDIT_AMOUNT
            && ($result['maxInstallment'] === null || $result['installmentPrice'] === null);
    }

    /**
     * widgetContent içindeki `var widgetInit = {...}` objesinden kredi özetini okur.
     * Değer sayı değilse (ör. 500 TL altı tutarlarda `maxInstallment:{}`) null döner.
     */
    private function parseWidgetInit(string $widgetContent): array
    {
        $number = function (string $key) use ($widgetContent): ?float {
            return preg_match('/\b'.$key.'\s*:\s*(-?\d+(?:\.\d+)?)/', $widgetContent, $m) ? (float) $m[1] : null;
        };
        $bool = function (string $key) use ($widgetContent): bool {
            return (bool) preg_match('/\b'.$key.'\s*:\s*true\b/', $widgetContent);
        };

        $maxInstallment = $number('maxInstallment');

        return [
            'creditEnabled' => $bool('creditEnabled'),
            'payWithIyzicoEnabled' => $bool('payWithIyzicoEnabled'),
            'maxInstallment' => $maxInstallment !== null ? (int) $maxInstallment : null,
            'installmentPrice' => $number('installmentPrice'),
        ];
    }

    private function effectivePrice(Product $product): string
    {
        $price = $product->sale_price && $product->sale_price < $product->price
            ? $product->sale_price
            : $product->price;

        return number_format((float) $price, 2, '.', '');
    }

    private function error(?string $code, ?string $message): array
    {
        return [
            'status' => 'error',
            'errorCode' => $code,
            'errorMessage' => $message,
        ];
    }
}
