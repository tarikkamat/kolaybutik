<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Services\Service\ToqanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChatbotController extends Controller
{
    public function __construct(
        protected ToqanService $toqanService
    ) {
    }

    /**
     * Display chatbot page
     */
    public function index(): Response
    {
        return Inertia::render('services/chatbot/index');
    }

    /**
     * Create a new conversation
     */
    public function createConversation(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_message' => 'required|string|max:5000',
            'user_info' => 'nullable|array',
            'user_info.name' => 'nullable|string|max:255',
            'user_info.technicalLevel' => 'nullable|string|in:beginner,intermediate,advanced,expert',
            'user_info.purpose' => 'nullable|string|max:1000',
        ]);

        $result = $this->toqanService->createConversation(
            $data['user_message'],
            $data['user_info'] ?? []
        );

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Continue an existing conversation
     */
    public function continueConversation(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => 'required|string',
            'user_message' => 'required|string|max:5000',
            'user_info' => 'nullable|array',
            'user_info.name' => 'nullable|string|max:255',
            'user_info.technicalLevel' => 'nullable|string|in:beginner,intermediate,advanced,expert',
            'user_info.purpose' => 'nullable|string|max:1000',
            'file_ids' => 'nullable|array',
            'file_ids.*' => 'string',
        ]);

        $result = $this->toqanService->continueConversation(
            $data['conversation_id'],
            $data['user_message'],
            $data['file_ids'] ?? null,
            $data['user_info'] ?? []
        );

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Get answer status
     */
    public function getAnswer(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => 'required|string',
            'request_id' => 'required|string',
        ]);

        $result = $this->toqanService->getAnswer(
            $data['conversation_id'],
            $data['request_id']
        );

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }

    /**
     * Get conversation history
     */
    public function getHistory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => 'required|string',
        ]);

        $result = $this->toqanService->findConversation($data['conversation_id']);

        if ($result['status'] === 'error') {
            return response()->json($result, 400);
        }

        return response()->json($result);
    }
}
