<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Services\Service\CardStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CardStorageController extends Controller
{
    private CardStorageService $cardStorageService;

    public function __construct(CardStorageService $cardStorageService)
    {
        $this->cardStorageService = $cardStorageService;
    }

    /**
     * Display Card Storage page
     */
    public function index(): Response
    {
        return Inertia::render('card-storage/index');
    }

    /**
     * Create Card
     */
    public function createCard(Request $request): JsonResponse
    {
        $request->validate([
            'cardHolderName' => 'required|string|max:255',
            'cardNumber' => 'required|string|max:19',
            'expireMonth' => 'required|string|size:2',
            'expireYear' => 'required|string|size:4',
            'cardAlias' => 'nullable|string|max:255',
            'cardUserKey' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'externalId' => 'nullable|string|max:255',
            'conversationId' => 'nullable|string|max:255',
        ]);

        $params = $request->only([
            'cardHolderName',
            'cardNumber',
            'expireMonth',
            'expireYear',
            'cardAlias',
            'cardUserKey',
            'email',
            'externalId',
            'conversationId',
        ]);

        $result = $this->cardStorageService->createCard($params);

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['errorMessage'] ?? 'Kart kaydedilemedi',
            'errorCode' => $result['errorCode'] ?? null,
        ], 400);
    }

    /**
     * Delete Card
     */
    public function deleteCard(Request $request): JsonResponse
    {
        $request->validate([
            'cardToken' => 'required|string',
            'cardUserKey' => 'required|string',
        ]);

        $result = $this->cardStorageService->deleteCard(
            $request->input('cardToken'),
            $request->input('cardUserKey')
        );

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['errorMessage'] ?? 'Kart silinemedi',
            'errorCode' => $result['errorCode'] ?? null,
        ], 400);
    }

    /**
     * Retrieve Cards
     */
    public function retrieveCards(Request $request): JsonResponse
    {
        $request->validate([
            'cardUserKey' => 'required|string',
        ]);

        $result = $this->cardStorageService->retrieveCards(
            $request->input('cardUserKey')
        );

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['errorMessage'] ?? 'Kartlar getirilemedi',
            'errorCode' => $result['errorCode'] ?? null,
        ], 400);
    }
}

