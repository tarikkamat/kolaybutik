<?php

namespace App\Services\Service;

use Iyzipay\Model\BinNumber;
use Iyzipay\Model\InstallmentInfo;
use Iyzipay\Model\Locale;
use Iyzipay\Options;
use Iyzipay\Request\RetrieveBinNumberRequest;
use Iyzipay\Request\RetrieveInstallmentInfoRequest;

class InstallmentBinService
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
     * Get Installment Info
     *
     * @param  string|null  $binNumber  BIN numarası (opsiyonel)
     * @param  float  $price  Fiyat
     * @param  string|null  $conversationId  Conversation ID (opsiyonel)
     * @return array|null
     */
    public function getInstallmentInfo(
        ?string $binNumber = null,
        float $price = 100.0,
        ?string $conversationId = null
    ): ?array {
        try {
            $request = new RetrieveInstallmentInfoRequest();
            $request->setLocale(Locale::TR);
            $request->setPrice($price);
            $request->setConversationId($conversationId ?? uniqid('conv_', true));

            if ($binNumber) {
                $request->setBinNumber($binNumber);
            }

            $installmentInfo = InstallmentInfo::retrieve($request, $this->options);

            if ($installmentInfo->getStatus() === 'success') {
                $result = [
                    'status' => $installmentInfo->getStatus(),
                    'locale' => $installmentInfo->getLocale(),
                    'systemTime' => $installmentInfo->getSystemTime(),
                    'conversationId' => $installmentInfo->getConversationId(),
                    'installmentDetails' => [],
                ];

                foreach ($installmentInfo->getInstallmentDetails() as $detail) {
                    $installmentPrices = [];
                    foreach ($detail->getInstallmentPrices() as $price) {
                        $installmentPrices[] = [
                            'installmentNumber' => $price->getInstallmentNumber(),
                            'installmentPrice' => $price->getInstallmentPrice(),
                            'totalPrice' => $price->getTotalPrice(),
                        ];
                    }

                    $result['installmentDetails'][] = [
                        'binNumber' => $detail->getBinNumber(),
                        'price' => $detail->getPrice(),
                        'cardType' => $detail->getCardType(),
                        'cardAssociation' => $detail->getCardAssociation(),
                        'cardFamilyName' => $detail->getCardFamilyName(),
                        'force3ds' => $detail->getForce3ds(),
                        'bankCode' => $detail->getBankCode(),
                        'bankName' => $detail->getBankName(),
                        'forceCvc' => $detail->getForceCvc(),
                        'commercial' => $detail->getCommercial(),
                        'installmentPrices' => $installmentPrices,
                    ];
                }

                return $result;
            }

            return [
                'status' => $installmentInfo->getStatus(),
                'errorMessage' => $installmentInfo->getErrorMessage(),
                'errorCode' => $installmentInfo->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get BIN Number Info
     *
     * @param  string  $binNumber  BIN numarası
     * @param  string|null  $conversationId  Conversation ID (opsiyonel)
     * @return array|null
     */
    public function getBinNumberInfo(string $binNumber, ?string $conversationId = null): ?array
    {
        try {
            $request = new RetrieveBinNumberRequest();
            $request->setLocale(Locale::TR);
            $request->setBinNumber($binNumber);
            $request->setConversationId($conversationId ?? uniqid('conv_', true));

            $binNumberResult = BinNumber::retrieve($request, $this->options);

            if ($binNumberResult->getStatus() === 'success') {
                return [
                    'status' => $binNumberResult->getStatus(),
                    'binNumber' => $binNumberResult->getBinNumber(),
                    'cardType' => $binNumberResult->getCardType(),
                    'cardAssociation' => $binNumberResult->getCardAssociation(),
                    'cardFamily' => $binNumberResult->getCardFamily(),
                    'bankName' => $binNumberResult->getBankName(),
                    'bankCode' => $binNumberResult->getBankCode(),
                    'commercial' => $binNumberResult->getCommercial(),
                    'locale' => $binNumberResult->getLocale(),
                    'systemTime' => $binNumberResult->getSystemTime(),
                    'conversationId' => $binNumberResult->getConversationId(),
                ];
            }

            return [
                'status' => $binNumberResult->getStatus(),
                'errorMessage' => $binNumberResult->getErrorMessage(),
                'errorCode' => $binNumberResult->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }
}

