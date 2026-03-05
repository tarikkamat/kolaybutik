<?php

namespace App\Services\Service;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Iyzipay\Model\Card;
use Iyzipay\Model\CardInformation;
use Iyzipay\Model\Locale;
use Iyzipay\Options;
use Iyzipay\Request\CreateCardRequest;
use Iyzipay\Request\DeleteCardRequest;

class CardStorageService
{
    private Options $options;
    private string $apiKey;
    private string $secretKey;
    private string $baseUrl;

    public function __construct()
    {
        $cardStorageConfig = config('iyzipay.card_storage', []);

        $this->apiKey = (string) ($cardStorageConfig['api_key'] ?? config('iyzipay.api_key', ''));
        $this->secretKey = (string) ($cardStorageConfig['secret_key'] ?? config('iyzipay.secret_key', ''));
        $this->baseUrl = rtrim((string) ($cardStorageConfig['base_url'] ?? config('iyzipay.base_url', '')), '/');

        $this->options = new Options();
        $this->options->setApiKey($this->apiKey);
        $this->options->setSecretKey($this->secretKey);
        $this->options->setBaseUrl($this->baseUrl);
    }

    private function getCacheStore()
    {
        try {
            return Cache::store('redis');
        } catch (\Throwable $e) {
            return Cache::store();
        }
    }

    private function cardsCacheKey(string $cardUserKey): string
    {
        return 'iyzipay:card-storage:cards:'.$cardUserKey;
    }

    private function forgetCardsCache(?string $cardUserKey): void
    {
        if (!$cardUserKey) {
            return;
        }

        $this->getCacheStore()->forget($this->cardsCacheKey($cardUserKey));
    }

    private function buildIyzwsV2Authorization(string $uri, string $jsonPayload, string $randomKey): string
    {
        $payload = $uri.$jsonPayload;
        $signature = hash_hmac('sha256', $randomKey.$payload, $this->secretKey, true);
        $signatureHex = bin2hex($signature);

        $hashString = sprintf(
            'apiKey:%s&randomKey:%s&signature:%s',
            $this->apiKey,
            $randomKey,
            $signatureHex
        );

        return 'IYZWSv2 '.base64_encode($hashString);
    }

    /**
     * Create Card
     *
     * @param  array  $params
     * @return array|null
     */
    public function createCard(array $params): ?array
    {
        try {
            $request = new CreateCardRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId($params['conversationId'] ?? uniqid('conv_', true));

            // Eğer cardUserKey varsa, mevcut kullanıcıya kart ekle
            if (isset($params['cardUserKey'])) {
                $request->setCardUserKey($params['cardUserKey']);
            }

            // Eğer yeni kullanıcı oluşturuluyorsa
            if (isset($params['email'])) {
                $request->setEmail($params['email']);
            }

            if (isset($params['externalId'])) {
                $request->setExternalId($params['externalId']);
            }

            // Kart bilgileri
            $cardInformation = new CardInformation();
            $cardInformation->setCardAlias($params['cardAlias'] ?? 'Kartım');
            $cardInformation->setCardHolderName($params['cardHolderName']);
            $cardInformation->setCardNumber($params['cardNumber']);
            $cardInformation->setExpireMonth($params['expireMonth']);
            $cardInformation->setExpireYear($params['expireYear']);

            $request->setCard($cardInformation);

            $card = Card::create($request, $this->options);

            if ($card->getStatus() === 'success') {
                $this->forgetCardsCache($card->getCardUserKey());

                return [
                    'status' => $card->getStatus(),
                    'locale' => $card->getLocale(),
                    'systemTime' => $card->getSystemTime(),
                    'conversationId' => $card->getConversationId(),
                    'externalId' => $card->getExternalId(),
                    'email' => $card->getEmail(),
                    'cardUserKey' => $card->getCardUserKey(),
                    'cardToken' => $card->getCardToken(),
                    'cardAlias' => $card->getCardAlias(),
                    'binNumber' => $card->getBinNumber(),
                    'lastFourDigits' => $card->getLastFourDigits(),
                    'cardType' => $card->getCardType(),
                    'cardAssociation' => $card->getCardAssociation(),
                    'cardFamily' => $card->getCardFamily(),
                    'cardBankCode' => $card->getCardBankCode(),
                    'cardBankName' => $card->getCardBankName(),
                ];
            }

            return [
                'status' => $card->getStatus(),
                'errorMessage' => $card->getErrorMessage(),
                'errorCode' => $card->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete Card
     *
     * @param  string  $cardToken
     * @param  string  $cardUserKey
     * @return array|null
     */
    public function deleteCard(string $cardToken, string $cardUserKey): ?array
    {
        try {
            $request = new DeleteCardRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setCardToken($cardToken);
            $request->setCardUserKey($cardUserKey);

            $card = Card::delete($request, $this->options);

            if ($card->getStatus() === 'success') {
                $this->forgetCardsCache($cardUserKey);

                return [
                    'status' => $card->getStatus(),
                    'locale' => $card->getLocale(),
                    'systemTime' => $card->getSystemTime(),
                    'conversationId' => $card->getConversationId(),
                ];
            }

            return [
                'status' => $card->getStatus(),
                'errorMessage' => $card->getErrorMessage(),
                'errorCode' => $card->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }

    /**
     * Retrieve Cards
     *
     * @param  string  $cardUserKey
     * @param  bool  $forceRefresh
     * @return array|null
     */
    public function retrieveCards(string $cardUserKey, bool $forceRefresh = false): ?array
    {
        if (empty($cardUserKey)) {
            return [
                'status' => 'error',
                'errorMessage' => 'cardUserKey gerekli',
                'errorCode' => 'MISSING_CARD_USER_KEY',
            ];
        }

        $cacheStore = $this->getCacheStore();
        $cacheKey = $this->cardsCacheKey($cardUserKey);

        if (!$forceRefresh) {
            $cached = $cacheStore->get($cacheKey);
            if (is_array($cached)) {
                return $cached;
            }
        }

        $result = $this->retrieveCardsDirect($cardUserKey);

        if ($result && ($result['status'] ?? '') === 'success') {
            $cacheStore->forever($cacheKey, $result);
        }

        return $result;
    }

    private function retrieveCardsDirect(string $cardUserKey): ?array
    {
        try {
            if (empty($this->apiKey) || empty($this->secretKey) || empty($this->baseUrl)) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Card storage credentials eksik',
                    'errorCode' => 'MISSING_CARD_STORAGE_CREDENTIALS',
                ];
            }

            $uri = '/cardstorage/cards';
            $conversationId = uniqid('conv_', true);
            $payload = [
                'locale' => 'tr',
                'conversationId' => $conversationId,
                'cardUserKey' => $cardUserKey,
            ];

            $jsonPayload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if ($jsonPayload === false) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Kart listesi isteği hazırlanamadı',
                    'errorCode' => 'JSON_ENCODE_FAILED',
                ];
            }

            $randomKey = (string) random_int(100000000000000, 999999999999999);
            $authorization = $this->buildIyzwsV2Authorization($uri, $jsonPayload, $randomKey);

            $response = Http::withHeaders([
                'Authorization' => $authorization,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(20)->send('POST', $this->baseUrl.$uri, [
                'body' => $jsonPayload,
            ]);

            $responseData = $response->json();
            if (!is_array($responseData)) {
                return [
                    'status' => 'error',
                    'errorMessage' => 'Kart listesi yanıtı parse edilemedi',
                    'errorCode' => 'INVALID_RESPONSE',
                ];
            }

            if (($responseData['status'] ?? '') !== 'success') {
                return [
                    'status' => $responseData['status'] ?? 'error',
                    'errorMessage' => $responseData['errorMessage'] ?? 'Kartlar getirilemedi',
                    'errorCode' => $responseData['errorCode'] ?? 'CARD_RETRIEVE_FAILED',
                ];
            }

            $rawCardDetails = is_array($responseData['cardDetails'] ?? null)
                ? $responseData['cardDetails']
                : [];

            $cards = array_map(static function ($card): array {
                return [
                    'cardToken' => $card['cardToken'] ?? '',
                    'cardAlias' => $card['cardAlias'] ?? null,
                    'binNumber' => $card['binNumber'] ?? null,
                    'lastFourDigits' => $card['lastFourDigits'] ?? null,
                    'cardType' => $card['cardType'] ?? null,
                    'cardAssociation' => $card['cardAssociation'] ?? null,
                    'cardFamily' => $card['cardFamily'] ?? null,
                    'cardBankCode' => $card['cardBankCode'] ?? null,
                    'cardBankName' => $card['cardBankName'] ?? null,
                    'expireMonth' => $card['expireMonth'] ?? null,
                    'expireYear' => $card['expireYear'] ?? null,
                ];
            }, $rawCardDetails);

            return [
                'status' => $responseData['status'],
                'locale' => $responseData['locale'] ?? 'tr',
                'systemTime' => $responseData['systemTime'] ?? null,
                'conversationId' => $responseData['conversationId'] ?? $conversationId,
                'cardUserKey' => $responseData['cardUserKey'] ?? $cardUserKey,
                'cards' => $cards,
                'cardDetails' => $cards,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => 'error',
                'errorMessage' => 'Kart listesi alınamadı: '.$e->getMessage(),
                'errorCode' => 'CARD_RETRIEVE_EXCEPTION',
            ];
        }
    }
}
