<?php

namespace App\Services\Payment;

use App\Models\Product;
use App\Services\Payment\Support\LocaleResolver;
use App\Traits\RedisCache;
use Illuminate\Support\Facades\Log;
use Iyzipay\Model\Currency;
use Iyzipay\Model\PayWithIyzicoWidgetInitialize;
use Iyzipay\Model\PayWithIyzicoWidgetPaymentPlan;
use Iyzipay\Model\PayWithIyzicoWidgetBasketItem;
use Iyzipay\Options;
use Iyzipay\Request\CreatePayWithIyzicoWidgetInitializeRequest;
use Iyzipay\Request\RetrievePayWithIyzicoWidgetPaymentPlanRequest;

/**
 * Pay with iyzico (PWI) Widget
 *
 * Ürün detay sayfasında "iyzico ile öde" taksit / alışveriş kredisi bilgisini gösterir.
 * 1) /v1/pay-with-iyzico/widget/init          -> widgetToken + widgetContent (script)
 * 2) /v1/pay-with-iyzico/widget/credit/payment-plan -> banka bazlı kredi planları
 */
class PwiWidgetService
{
    use RedisCache;

    /** Widget sadece gösterim amaçlı; her sayfa görüntülemede iyzico'ya gitmemek için kısa süre cache'lenir. */
    private const CACHE_TTL_SECONDS = 600;

    private const MAX_INSTALLMENT = 12;

    private Options $options;

    public function __construct()
    {
        // Widget, PWI açık olan Quick PWI merchant'ı ile çalışır.
        $config = config('iyzipay.quick_pwi');

        $this->options = new Options();
        $this->options->setApiKey($config['api_key']);
        $this->options->setSecretKey($config['secret_key']);
        $this->options->setBaseUrl($config['base_url']);
    }

    public function getProductWidget(Product $product, ?string $locale = null): array
    {
        $locale = LocaleResolver::resolve($locale);
        $price = $this->effectivePrice($product);
        $cacheKey = sprintf('product:%d:%s:%s', $product->id, $price, $locale);

        $cached = $this->remember($cacheKey, fn () => $this->fetchWidget($product, $price, $locale), self::CACHE_TTL_SECONDS);

        // Hata cevaplarını cache'te tutma, bir sonraki istekte tekrar denensin.
        if (($cached['status'] ?? null) !== 'success') {
            $this->forget($cacheKey);
        }

        return $cached;
    }

    private function fetchWidget(Product $product, string $price, string $locale): array
    {
        try {
            $request = new CreatePayWithIyzicoWidgetInitializeRequest();
            $request->setLocale($locale);
            $request->setConversationId(uniqid('pwi_widget_', true));
            $request->setPrice($price);
            $request->setCurrency(Currency::TL);
            $request->setInstallment(self::MAX_INSTALLMENT);

            $basketItem = new PayWithIyzicoWidgetBasketItem();
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

                return [
                    'status' => 'error',
                    'errorCode' => $initialize->getErrorCode(),
                    'errorMessage' => $initialize->getErrorMessage(),
                ];
            }

            $widgetContent = (string) $initialize->getWidgetContent();
            $widgetInit = $this->parseWidgetInit($widgetContent);

            $plans = $widgetInit['creditEnabled']
                ? $this->fetchPaymentPlans($initialize->getWidgetToken(), $locale)
                : [];

            return [
                'status' => 'success',
                'widgetToken' => $initialize->getWidgetToken(),
                // Script'in yüklediği CSS/JS adresleri boş dönebiliyor; boşsa frontend'e
                // vermiyoruz, aksi halde tarayıcı sayfanın kendisini script olarak yükler.
                'widgetContent' => $this->hasLoadableAssets($widgetContent) ? $widgetContent : null,
                'price' => (float) $price,
                'currency' => Currency::TL,
                'payWithIyzicoEnabled' => $widgetInit['payWithIyzicoEnabled'],
                'creditEnabled' => $widgetInit['creditEnabled'],
                'maxInstallment' => $widgetInit['maxInstallment'],
                'installmentPrice' => $widgetInit['installmentPrice'],
                'creditPlans' => $plans,
            ];
        } catch (\Throwable $e) {
            Log::error('PwiWidgetService: exception', [
                'product_id' => $product->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => 'error',
                'errorCode' => 'EXCEPTION',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Banka bazlı alışveriş kredisi planları.
     */
    private function fetchPaymentPlans(string $widgetToken, string $locale): array
    {
        $request = new RetrievePayWithIyzicoWidgetPaymentPlanRequest();
        $request->setLocale($locale);
        $request->setConversationId(uniqid('pwi_widget_plan_', true));
        $request->setWidgetToken($widgetToken);

        $response = PayWithIyzicoWidgetPaymentPlan::retrieve($request, $this->options);

        if ($response->getStatus() !== 'success') {
            Log::warning('PwiWidgetService: payment-plan failed', [
                'errorCode' => $response->getErrorCode(),
                'errorMessage' => $response->getErrorMessage(),
            ]);

            return [];
        }

        $plans = [];
        foreach ($response->getFilteredPlans() ?? [] as $bankPlan) {
            $terms = [];
            foreach ($bankPlan->getMonthlyPayments() ?? [] as $monthlyPayment) {
                foreach ($monthlyPayment->getPaymentPlans() ?? [] as $detail) {
                    $terms[] = [
                        'productType' => $monthlyPayment->getProductType(),
                        'term' => (int) $detail->getTerm(),
                        'interestRate' => (float) $detail->getInterestRate(),
                        'amount' => (float) $detail->getAmount(),
                        'totalPaymentAmount' => (float) $detail->getTotalPaymentAmount(),
                        'annualEffectiveInterestRate' => $detail->getAnnualEffectiveInterestRate() !== null
                            ? (float) $detail->getAnnualEffectiveInterestRate()
                            : null,
                    ];
                }
            }

            usort($terms, fn ($a, $b) => [$a['term'], $a['productType']] <=> [$b['term'], $b['productType']]);

            $plans[] = [
                'bankId' => $bankPlan->getBankId(),
                'bankName' => $bankPlan->getBankName(),
                'bankLogoUrl' => $bankPlan->getBankLogoUrl(),
                'existingCustomer' => (bool) $bankPlan->getExistingCustomer(),
                'terms' => $terms,
            ];
        }

        return $plans;
    }

    /**
     * widgetContent içindeki `var widgetInit = {...}` objesinden taksit bilgilerini okur.
     * Değer sayı değilse (ör. `maxInstallment:{}`) null döner.
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
            'payWithIyzicoEnabled' => $bool('payWithIyzicoEnabled'),
            'creditEnabled' => $bool('creditEnabled'),
            'maxInstallment' => $maxInstallment !== null ? (int) $maxInstallment : null,
            'installmentPrice' => $number('installmentPrice'),
        ];
    }

    /**
     * Script'in eklediği <link href> ve <script src> değerleri gerçek bir adres mi?
     */
    private function hasLoadableAssets(string $widgetContent): bool
    {
        preg_match_all("/setAttribute\\(\\s*'(?:src|href)'\\s*,\\s*'([^']*)'\\s*\\)/", $widgetContent, $matches);

        if (empty($matches[1])) {
            return false;
        }

        foreach ($matches[1] as $url) {
            if (! preg_match('#^(https?:)?//#i', $url)) {
                return false;
            }
        }

        return true;
    }

    private function effectivePrice(Product $product): string
    {
        $price = $product->sale_price && $product->sale_price < $product->price
            ? $product->sale_price
            : $product->price;

        return number_format((float) $price, 2, '.', '');
    }
}
