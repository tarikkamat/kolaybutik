<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Services\Payment\IyzicoLinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IyzicoLinkController extends Controller
{
    public function __construct(
        protected IyzicoLinkService $iyzicoLinkService
    ) {
    }

    /**
     * Display iyzico Link management page
     */
    public function index(): Response
    {
        return Inertia::render('services/iyzico-link');
    }

    /**
     * Create iyzico Link
     */
    public function create(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|in:TRY,USD,EUR,TL',
            'addressIgnorable' => 'nullable|boolean',
            'soldLimit' => 'nullable|integer|min:1',
            'installmentRequested' => 'nullable|boolean',
            'sourceType' => 'nullable|string|in:API,WEB',
            'stockEnabled' => 'nullable|boolean',
            'stockCount' => 'nullable|integer|min:0',
            'imagePath' => 'nullable|string',
            'base64EncodedImage' => 'nullable|string',
        ]);

        $result = $this->iyzicoLinkService->createIyziLink($data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Create Fastlink
     */
    public function createFastlink(Request $request): JsonResponse
    {
        $data = $request->validate([
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'currencyCode' => 'nullable|string|in:TRY,USD,EUR',
            'sourceType' => 'nullable|string|in:API,WEB',
        ]);

        $result = $this->iyzicoLinkService->createFastlink($data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Retrieve iyzico Link details
     */
    public function retrieve(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $result = $this->iyzicoLinkService->retrieveIyziLink($request->input('token'));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * List iyzico Links
     */
    public function list(Request $request): JsonResponse
    {
        $data = $request->validate([
            'page' => 'nullable|integer|min:1',
            'count' => 'nullable|integer|min:1|max:100',
        ]);

        $result = $this->iyzicoLinkService->listIyziLinks($data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Update iyzico Link
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|in:TRY,USD,EUR,TL',
            'addressIgnorable' => 'nullable|boolean',
            'soldLimit' => 'nullable|integer|min:1',
            'installmentRequested' => 'nullable|boolean',
            'sourceType' => 'nullable|string|in:API,WEB',
            'stockEnabled' => 'nullable|boolean',
            'stockCount' => 'nullable|integer|min:0',
            'imagePath' => 'nullable|string',
            'base64EncodedImage' => 'nullable|string',
        ]);

        $token = $request->input('token');
        $data = $request->except(['token']);

        $result = $this->iyzicoLinkService->updateIyziLink($token, $data);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Update iyzico Link status
     */
    public function updateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'status' => 'required|string|in:ACTIVE,PASSIVE',
        ]);

        $result = $this->iyzicoLinkService->updateIyziLinkStatus(
            $request->input('token'),
            $request->input('status')
        );

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Delete iyzico Link
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $result = $this->iyzicoLinkService->deleteIyziLink($request->input('token'));

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }
}

