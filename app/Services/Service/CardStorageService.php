<?php

namespace App\Services\Service;

use Iyzipay\Model\Card;
use Iyzipay\Model\CardInformation;
use Iyzipay\Model\CardList;
use Iyzipay\Model\Locale;
use Iyzipay\Options;
use Iyzipay\Request\CreateCardRequest;
use Iyzipay\Request\DeleteCardRequest;
use Iyzipay\Request\RetrieveCardListRequest;

class CardStorageService
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
     * @return array|null
     */
    public function retrieveCards(string $cardUserKey): ?array
    {
        try {
            $request = new RetrieveCardListRequest();
            $request->setLocale(Locale::TR);
            $request->setConversationId(uniqid('conv_', true));
            $request->setCardUserKey($cardUserKey);

            $cardList = CardList::retrieve($request, $this->options);

            if ($cardList->getStatus() === 'success') {
                $cards = [];

                if ($cardList->getCardDetails()) {
                    foreach ($cardList->getCardDetails() as $card) {
                        $cards[] = [
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
                }

                return [
                    'status' => $cardList->getStatus(),
                    'locale' => $cardList->getLocale(),
                    'systemTime' => $cardList->getSystemTime(),
                    'conversationId' => $cardList->getConversationId(),
                    'cardUserKey' => $cardList->getCardUserKey(),
                    'cards' => $cards,
                ];
            }

            return [
                'status' => $cardList->getStatus(),
                'errorMessage' => $cardList->getErrorMessage(),
                'errorCode' => $cardList->getErrorCode(),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'errorMessage' => $e->getMessage(),
            ];
        }
    }
}

