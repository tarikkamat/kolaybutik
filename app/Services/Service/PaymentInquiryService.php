<?php

namespace App\Services\Service;

use Iyzipay\Model\Locale;
use Iyzipay\Model\Payment;
use Iyzipay\Options;
use Iyzipay\Request\RetrievePaymentRequest;

class PaymentInquiryService
{
    /**
     * Build iyzipay Options for the given connection.
     * Use 'quick_pwi' for Quick Pay with iyzico payments (checkout).
     *
     * @param  string  $connection  'default' or 'quick_pwi'
     */
    private function getOptions(string $connection = 'default'): Options
    {
        $options = new Options();
        if ($connection === 'quick_pwi') {
            $config = config('iyzipay.quick_pwi');
            $options->setApiKey($config['api_key']);
            $options->setSecretKey($config['secret_key']);
            $options->setBaseUrl($config['base_url']);
        } else {
            $options->setApiKey(config('iyzipay.api_key'));
            $options->setSecretKey(config('iyzipay.secret_key'));
            $options->setBaseUrl(config('iyzipay.base_url'));
        }

        return $options;
    }

    /**
     * Retrieve Payment by Payment ID
     *
     * @param  string  $paymentId
     * @param  string|null  $conversationId
     * @param  string  $connection  'default' or 'quick_pwi' (use quick_pwi for Quick Pay with iyzico checkout payments)
     * @return array|null
     */
    public function retrievePayment(string $paymentId, ?string $conversationId = null, string $connection = 'default'): ?array
    {
        try {
            $options = $this->getOptions($connection);
            $request = new RetrievePaymentRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId ?? uniqid('conv_', true));
            $request->setPaymentId($paymentId);

            $payment = Payment::retrieve($request, $options);

            if ($payment->getStatus() === 'success') {
                $paymentItems = [];
                if ($payment->getPaymentItems()) {
                    foreach ($payment->getPaymentItems() as $item) {
                        $paymentItems[] = [
                            'itemId' => $item->getItemId(),
                            'paymentTransactionId' => $item->getPaymentTransactionId(),
                            'transactionStatus' => $item->getTransactionStatus(),
                            'price' => $item->getPrice(),
                            'paidPrice' => $item->getPaidPrice(),
                            'merchantCommissionRate' => $item->getMerchantCommissionRate(),
                            'merchantCommissionRateAmount' => $item->getMerchantCommissionRateAmount(),
                            'iyziCommissionRateAmount' => $item->getIyziCommissionRateAmount(),
                            'iyziCommissionFee' => $item->getIyziCommissionFee(),
                            'blockageRate' => $item->getBlockageRate(),
                            'blockageRateAmountMerchant' => $item->getBlockageRateAmountMerchant(),
                            'blockageRateAmountSubMerchant' => $item->getBlockageRateAmountSubMerchant(),
                            'blockageResolvedDate' => $item->getBlockageResolvedDate(),
                            'subMerchantKey' => $item->getSubMerchantKey(),
                            'subMerchantPrice' => $item->getSubMerchantPrice(),
                            'subMerchantPayoutRate' => $item->getSubMerchantPayoutRate(),
                            'subMerchantPayoutAmount' => $item->getSubMerchantPayoutAmount(),
                            'merchantPayoutAmount' => $item->getMerchantPayoutAmount(),
                            'convertedPayout' => $item->getConvertedPayout() ? [
                                'paidPrice' => $item->getConvertedPayout()->getPaidPrice(),
                                'iyziCommissionRateAmount' => $item->getConvertedPayout()->getIyziCommissionRateAmount(),
                                'iyziCommissionFee' => $item->getConvertedPayout()->getIyziCommissionFee(),
                                'blockageRateAmountMerchant' => $item->getConvertedPayout()->getBlockageRateAmountMerchant(),
                                'blockageRateAmountSubMerchant' => $item->getConvertedPayout()->getBlockageRateAmountSubMerchant(),
                                'subMerchantPayoutAmount' => $item->getConvertedPayout()->getSubMerchantPayoutAmount(),
                                'merchantPayoutAmount' => $item->getConvertedPayout()->getMerchantPayoutAmount(),
                                'iyziConversionRate' => $item->getConvertedPayout()->getIyziConversionRate(),
                                'iyziConversionRateAmount' => $item->getConvertedPayout()->getIyziConversionRateAmount(),
                                'currency' => $item->getConvertedPayout()->getCurrency(),
                            ] : null,
                        ];
                    }
                }

                return [
                    'status' => $payment->getStatus(),
                    'locale' => $payment->getLocale(),
                    'systemTime' => $payment->getSystemTime(),
                    'conversationId' => $payment->getConversationId(),
                    'price' => $payment->getPrice(),
                    'paidPrice' => $payment->getPaidPrice(),
                    'installment' => $payment->getInstallment(),
                    'currency' => $payment->getCurrency(),
                    'paymentId' => $payment->getPaymentId(),
                    'paymentStatus' => $payment->getPaymentStatus(),
                    'fraudStatus' => $payment->getFraudStatus(),
                    'merchantCommissionRate' => $payment->getMerchantCommissionRate(),
                    'merchantCommissionRateAmount' => $payment->getMerchantCommissionRateAmount(),
                    'iyziCommissionRateAmount' => $payment->getIyziCommissionRateAmount(),
                    'iyziCommissionFee' => $payment->getIyziCommissionFee(),
                    'cardType' => $payment->getCardType(),
                    'cardAssociation' => $payment->getCardAssociation(),
                    'cardFamily' => $payment->getCardFamily(),
                    'cardToken' => $payment->getCardToken(),
                    'cardUserKey' => $payment->getCardUserKey(),
                    'binNumber' => $payment->getBinNumber(),
                    'basketId' => $payment->getBasketId(),
                    'connectorName' => $payment->getConnectorName(),
                    'authCode' => $payment->getAuthCode(),
                    'phase' => $payment->getPhase(),
                    'lastFourDigits' => $payment->getLastFourDigits(),
                    'posOrderId' => $payment->getPosOrderId(),
                    'paymentItems' => $paymentItems,
                ];
            }

            return [
                'status' => $payment->getStatus(),
                'errorMessage' => $payment->getErrorMessage(),
                'errorCode' => $payment->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Retrieve Payment with Payment Conversation ID
     *
     * @param  string  $paymentConversationId
     * @param  string|null  $conversationId
     * @param  string  $connection  'default' or 'quick_pwi'
     * @return array|null
     */
    public function retrievePaymentWithConversationId(
        string $paymentConversationId,
        ?string $conversationId = null,
        string $connection = 'default'
    ): ?array {
        try {
            $options = $this->getOptions($connection);
            $request = new RetrievePaymentRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($conversationId ?? uniqid('conv_', true));
            $request->setPaymentConversationId($paymentConversationId);

            $payment = Payment::retrieve($request, $options);

            if ($payment->getStatus() === 'success') {
                $paymentItems = [];
                if ($payment->getPaymentItems()) {
                    foreach ($payment->getPaymentItems() as $item) {
                        $paymentItems[] = [
                            'itemId' => $item->getItemId(),
                            'paymentTransactionId' => $item->getPaymentTransactionId(),
                            'transactionStatus' => $item->getTransactionStatus(),
                            'price' => $item->getPrice(),
                            'paidPrice' => $item->getPaidPrice(),
                            'merchantCommissionRate' => $item->getMerchantCommissionRate(),
                            'merchantCommissionRateAmount' => $item->getMerchantCommissionRateAmount(),
                            'iyziCommissionRateAmount' => $item->getIyziCommissionRateAmount(),
                            'iyziCommissionFee' => $item->getIyziCommissionFee(),
                            'blockageRate' => $item->getBlockageRate(),
                            'blockageRateAmountMerchant' => $item->getBlockageRateAmountMerchant(),
                            'blockageRateAmountSubMerchant' => $item->getBlockageRateAmountSubMerchant(),
                            'blockageResolvedDate' => $item->getBlockageResolvedDate(),
                            'subMerchantKey' => $item->getSubMerchantKey(),
                            'subMerchantPrice' => $item->getSubMerchantPrice(),
                            'subMerchantPayoutRate' => $item->getSubMerchantPayoutRate(),
                            'subMerchantPayoutAmount' => $item->getSubMerchantPayoutAmount(),
                            'merchantPayoutAmount' => $item->getMerchantPayoutAmount(),
                            'convertedPayout' => $item->getConvertedPayout() ? [
                                'paidPrice' => $item->getConvertedPayout()->getPaidPrice(),
                                'iyziCommissionRateAmount' => $item->getConvertedPayout()->getIyziCommissionRateAmount(),
                                'iyziCommissionFee' => $item->getConvertedPayout()->getIyziCommissionFee(),
                                'blockageRateAmountMerchant' => $item->getConvertedPayout()->getBlockageRateAmountMerchant(),
                                'blockageRateAmountSubMerchant' => $item->getConvertedPayout()->getBlockageRateAmountSubMerchant(),
                                'subMerchantPayoutAmount' => $item->getConvertedPayout()->getSubMerchantPayoutAmount(),
                                'merchantPayoutAmount' => $item->getConvertedPayout()->getMerchantPayoutAmount(),
                                'iyziConversionRate' => $item->getConvertedPayout()->getIyziConversionRate(),
                                'iyziConversionRateAmount' => $item->getConvertedPayout()->getIyziConversionRateAmount(),
                                'currency' => $item->getConvertedPayout()->getCurrency(),
                            ] : null,
                        ];
                    }
                }

                return [
                    'status' => $payment->getStatus(),
                    'locale' => $payment->getLocale(),
                    'systemTime' => $payment->getSystemTime(),
                    'conversationId' => $payment->getConversationId(),
                    'price' => $payment->getPrice(),
                    'paidPrice' => $payment->getPaidPrice(),
                    'installment' => $payment->getInstallment(),
                    'currency' => $payment->getCurrency(),
                    'paymentId' => $payment->getPaymentId(),
                    'paymentStatus' => $payment->getPaymentStatus(),
                    'fraudStatus' => $payment->getFraudStatus(),
                    'merchantCommissionRate' => $payment->getMerchantCommissionRate(),
                    'merchantCommissionRateAmount' => $payment->getMerchantCommissionRateAmount(),
                    'iyziCommissionRateAmount' => $payment->getIyziCommissionRateAmount(),
                    'iyziCommissionFee' => $payment->getIyziCommissionFee(),
                    'cardType' => $payment->getCardType(),
                    'cardAssociation' => $payment->getCardAssociation(),
                    'cardFamily' => $payment->getCardFamily(),
                    'cardToken' => $payment->getCardToken(),
                    'cardUserKey' => $payment->getCardUserKey(),
                    'binNumber' => $payment->getBinNumber(),
                    'basketId' => $payment->getBasketId(),
                    'connectorName' => $payment->getConnectorName(),
                    'authCode' => $payment->getAuthCode(),
                    'phase' => $payment->getPhase(),
                    'lastFourDigits' => $payment->getLastFourDigits(),
                    'posOrderId' => $payment->getPosOrderId(),
                    'paymentItems' => $paymentItems,
                ];
            }

            return [
                'status' => $payment->getStatus(),
                'errorMessage' => $payment->getErrorMessage(),
                'errorCode' => $payment->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }
}

