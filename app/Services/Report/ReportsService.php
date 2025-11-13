<?php

namespace App\Services\Report;

use Iyzipay\Model\Locale;
use Iyzipay\Model\PayoutCompletedTransactionList;
use Iyzipay\Model\ReportingPaymentDetail;
use Iyzipay\Model\ReportingPaymentTransaction;
use Iyzipay\Model\ReportingScrollTransaction;
use Iyzipay\Options;
use Iyzipay\Request\ReportingPaymentDetailRequest;
use Iyzipay\Request\ReportingPaymentTransactionRequest;
use Iyzipay\Request\ReportingScrollTransactionRequest;
use Iyzipay\Request\RetrieveTransactionsRequest;

class ReportsService
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
     * Scroll Transactions Report
     *
     * @param  array  $params  Query parameters: documentScrollVoSortingOrder, conversationId, lastId, transactionDate
     * @return array|null
     */
    public function scrollTransactions(array $params): ?array
    {
        try {
            $request = new ReportingScrollTransactionRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($params['conversationId'] ?? uniqid('conv_', true));

            if (isset($params['transactionDate'])) {
                $request->setTransactionDate($params['transactionDate']);
            }

            if (isset($params['lastId'])) {
                $request->setLastId($params['lastId']);
            }

            if (isset($params['documentScrollVoSortingOrder'])) {
                $request->setDocumentScrollVoSortingOrder($params['documentScrollVoSortingOrder']);
            }

            $result = ReportingScrollTransaction::create($request, $this->options);

            if ($result->getStatus() === 'success') {
                return $this->formatReportingResponse($result);
            }

            return [
                'status' => $result->getStatus(),
                'errorMessage' => $result->getErrorMessage(),
                'errorCode' => $result->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Transaction Daily Report
     *
     * @param  array  $params  Query parameters: conversationId, transactionDate
     * @return array|null
     */
    public function transactionDaily(array $params): ?array
    {
        try {
            $request = new ReportingPaymentTransactionRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($params['conversationId'] ?? uniqid('conv_', true));

            if (isset($params['transactionDate'])) {
                $request->setTransactionDate($params['transactionDate']);
            }

            if (isset($params['page'])) {
                $request->setPage($params['page']);
            } else {
                $request->setPage('1');
            }

            $result = ReportingPaymentTransaction::create($request, $this->options);

            if ($result->getStatus() === 'success') {
                return $this->formatReportingResponse($result);
            }

            return [
                'status' => $result->getStatus(),
                'errorMessage' => $result->getErrorMessage(),
                'errorCode' => $result->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Transaction Based Report
     *
     * @param  array  $params  Query parameters: conversationId, transactionDate
     * @return array|null
     */
    public function transactionBased(array $params): ?array
    {
        try {
            $request = new ReportingPaymentDetailRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($params['conversationId'] ?? uniqid('conv_', true));

            if (isset($params['paymentId'])) {
                $request->setPaymentId($params['paymentId']);
            }

            if (isset($params['paymentConversationId'])) {
                $request->setPaymentConversationId($params['paymentConversationId']);
            }

            $result = ReportingPaymentDetail::create($request, $this->options);

            if ($result->getStatus() === 'success') {
                return $this->formatReportingResponse($result);
            }

            return [
                'status' => $result->getStatus(),
                'errorMessage' => $result->getErrorMessage(),
                'errorCode' => $result->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Marketplace Payout Completed Report
     *
     * @param  array  $params  Query parameters: conversationId, transactionDate
     * @return array|null
     */
    public function marketplacePayoutCompleted(array $params): ?array
    {
        try {
            $request = new RetrieveTransactionsRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($params['conversationId'] ?? uniqid('conv_', true));

            if (isset($params['transactionDate'])) {
                $request->setDate($params['transactionDate']);
            }

            $result = PayoutCompletedTransactionList::retrieve($request, $this->options);

            if ($result->getStatus() === 'success') {
                return $this->formatReportingResponse($result);
            }

            return [
                'status' => $result->getStatus(),
                'errorMessage' => $result->getErrorMessage(),
                'errorCode' => $result->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Marketplace Retrieve Bounced Payments
     *
     * @param  array  $params  Query parameters: conversationId, transactionDate
     * @return array|null
     */
    public function marketplaceRetrieveBouncedPayments(array $params): ?array
    {
        try {
            // Bounced payments için de RetrieveTransactionsRequest kullanılıyor
            // Ancak endpoint farklı olabilir, şimdilik aynı request'i kullanıyoruz
            $request = new RetrieveTransactionsRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($params['conversationId'] ?? uniqid('conv_', true));

            if (isset($params['transactionDate'])) {
                $request->setDate($params['transactionDate']);
            }

            // Bounced payments için özel bir model yoksa, PayoutCompletedTransactionList kullanabiliriz
            // veya ReportingPaymentDetail kullanabiliriz
            $result = PayoutCompletedTransactionList::retrieve($request, $this->options);

            if ($result->getStatus() === 'success') {
                return $this->formatReportingResponse($result);
            }

            return [
                'status' => $result->getStatus(),
                'errorMessage' => $result->getErrorMessage(),
                'errorCode' => $result->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Format reporting response to array
     *
     * @param  mixed  $result
     * @return array
     */
    private function formatReportingResponse($result): array
    {
        $response = [
            'status' => $result->getStatus(),
            'locale' => $result->getLocale(),
            'systemTime' => $result->getSystemTime(),
            'conversationId' => $result->getConversationId(),
        ];

        // Convert result to array recursively
        if (method_exists($result, 'getJsonObject')) {
            $jsonObject = $result->getJsonObject();
            if ($jsonObject) {
                $response['data'] = json_decode($jsonObject, true);
            }
        }

        // Try to get common properties
        $reflection = new \ReflectionClass($result);
        $properties = $reflection->getProperties();

        foreach ($properties as $property) {
            $property->setAccessible(true);
            $value = $property->getValue($result);
            if ($value !== null && !isset($response[$property->getName()])) {
                if (is_object($value)) {
                    if (method_exists($value, 'getJsonObject')) {
                        $response[$property->getName()] = json_decode($value->getJsonObject(), true);
                    } else {
                        $response[$property->getName()] = $this->objectToArray($value);
                    }
                } else {
                    $response[$property->getName()] = $value;
                }
            }
        }

        return $response;
    }

    /**
     * Convert object to array recursively
     *
     * @param  mixed  $object
     * @return mixed
     */
    private function objectToArray($object)
    {
        if (is_object($object)) {
            if (method_exists($object, 'getJsonObject')) {
                return json_decode($object->getJsonObject(), true);
            }
            return get_object_vars($object);
        }
        if (is_array($object)) {
            return array_map([$this, 'objectToArray'], $object);
        }
        return $object;
    }
}

