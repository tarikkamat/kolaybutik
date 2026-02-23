<?php

namespace App\Services\Service;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ToqanService
{
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('TOQAN_API_KEY', '');
        $this->baseUrl = 'https://api.coco.prod.toqan.ai/api';

        if (empty($this->apiKey)) {
            throw new \RuntimeException('TOQAN_API_KEY is not set in .env file');
        }
    }

    /**
     * Create a new conversation
     *
     * @param  string  $userMessage
     * @param  array  $userInfo
     * @return array
     */
    public function createConversation(string $userMessage, array $userInfo = []): array
    {
        try {
            $response = Http::withHeaders([
                'X-Api-Key' => $this->apiKey,
                'accept' => '*/*',
                'content-type' => 'application/json',
            ])->post("{$this->baseUrl}/create_conversation", [
                'user_message' => $userMessage,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'conversation_id' => $data['conversation_id'] ?? null,
                        'request_id' => $data['request_id'] ?? null,
                    ],
                    'message' => 'Conversation başarıyla oluşturuldu',
                ];
            }

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => $response->json()['message'] ?? 'Conversation oluşturulamadı',
                'errorCode' => $response->status(),
            ];
        } catch (Exception $e) {
            Log::error('ToqanService: Create conversation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Conversation oluşturulurken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Continue an existing conversation
     *
     * @param  string  $conversationId
     * @param  string  $userMessage
     * @param  array|null  $fileIds
     * @param  array  $userInfo
     * @return array
     */
    public function continueConversation(
        string $conversationId,
        string $userMessage,
        ?array $fileIds = null,
        array $userInfo = []
    ): array {
        try {
            $payload = [
                'conversation_id' => $conversationId,
                'user_message' => $userMessage,
            ];

            if ($fileIds && !empty($fileIds)) {
                $payload['private_user_files'] = array_map(function ($fileId) {
                    return ['id' => $fileId];
                }, $fileIds);
            }

            $response = Http::withHeaders([
                'X-Api-Key' => $this->apiKey,
                'accept' => '*/*',
                'content-type' => 'application/json',
            ])->post("{$this->baseUrl}/continue_conversation", $payload);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'conversation_id' => $data['conversation_id'] ?? $conversationId,
                        'request_id' => $data['request_id'] ?? null,
                    ],
                    'message' => 'Conversation başarıyla devam ettirildi',
                ];
            }

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => $response->json()['message'] ?? 'Conversation devam ettirilemedi',
                'errorCode' => $response->status(),
            ];
        } catch (Exception $e) {
            Log::error('ToqanService: Continue conversation failed', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversationId,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Conversation devam ettirilirken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Get answer status for a conversation request
     *
     * @param  string  $conversationId
     * @param  string  $requestId
     * @return array
     */
    public function getAnswer(string $conversationId, string $requestId): array
    {
        try {
            $response = Http::withHeaders([
                'X-Api-Key' => $this->apiKey,
                'accept' => '*/*',
            ])->get("{$this->baseUrl}/get_answer", [
                'conversation_id' => $conversationId,
                'request_id' => $requestId,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                // Log response for debugging
                Log::debug('ToqanService: Get answer response', [
                    'response' => $data,
                    'status_code' => $response->status(),
                ]);

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'status' => $data['status'] ?? 'unknown',
                        'answer' => $data['answer'] ?? null,
                        'timestamp' => $data['timestamp'] ?? null,
                        'conversation_id' => $conversationId,
                        'request_id' => $requestId,
                    ],
                    'message' => 'Answer başarıyla alındı',
                ];
            }

            // Log error response
            Log::error('ToqanService: Get answer failed', [
                'status_code' => $response->status(),
                'response' => $response->body(),
            ]);

            $errorData = $response->json();
            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => $errorData['message'] ?? 'Answer alınamadı',
                'errorCode' => $response->status(),
            ];
        } catch (Exception $e) {
            Log::error('ToqanService: Get answer failed', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversationId,
                'request_id' => $requestId,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Answer alınırken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }

    /**
     * Find conversation history
     *
     * @param  string  $conversationId
     * @return array
     */
    public function findConversation(string $conversationId): array
    {
        try {
            $response = Http::withHeaders([
                'X-Api-Key' => $this->apiKey,
                'accept' => '*/*',
                'content-type' => 'application/json',
            ])->post("{$this->baseUrl}/find_conversation", [
                'conversation_id' => $conversationId,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return [
                    'status' => 'success',
                    'success' => true,
                    'data' => [
                        'conversation' => $data ?? [],
                        'conversation_id' => $conversationId,
                    ],
                    'message' => 'Conversation geçmişi başarıyla alındı',
                ];
            }

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => $response->json()['message'] ?? 'Conversation geçmişi alınamadı',
                'errorCode' => $response->status(),
            ];
        } catch (Exception $e) {
            Log::error('ToqanService: Find conversation failed', [
                'error' => $e->getMessage(),
                'conversation_id' => $conversationId,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'status' => 'error',
                'success' => false,
                'errorMessage' => 'Conversation geçmişi alınırken bir hata oluştu: '.$e->getMessage(),
                'errorCode' => 'EXCEPTION',
            ];
        }
    }
}
