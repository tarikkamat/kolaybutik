<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

class WebhookController extends Controller
{
    /**
     * Display webhook handler page
     */
    public function index(): Response
    {
        $sessionId = Session::getId();

        // Get initial webhooks
        $webhooks = Cache::get('webhooks:global', []);
        $oneHourAgo = now()->subHour()->timestamp;
        $webhooks = array_filter($webhooks, function ($webhook) use ($oneHourAgo) {
            $webhookTime = strtotime($webhook['timestamp'] ?? '');
            return $webhookTime >= $oneHourAgo;
        });
        usort($webhooks, function ($a, $b) {
            $timeA = strtotime($a['timestamp'] ?? '');
            $timeB = strtotime($b['timestamp'] ?? '');
            return $timeB <=> $timeA;
        });

        // Get user settings
        $settingsCacheKey = "webhook_settings:{$sessionId}";
        $settings = Cache::get($settingsCacheKey, null);

        // Apply filters if settings exist
        $filteredWebhooks = $webhooks;
        if ($settings !== null) {
            $filteredWebhooks = array_map(function ($webhook) use ($settings) {
                $filtered = $webhook;
                if (!empty($settings['eventTypeFilter']) && is_array($settings['eventTypeFilter'])) {
                    $body = $filtered['body'] ?? [];
                    $eventType = $body['iyziEventType'] ?? null;
                    if (!in_array($eventType, $settings['eventTypeFilter'])) {
                        return null;
                    }
                }
                if (!empty($settings['statusFilter']) && is_array($settings['statusFilter'])) {
                    $body = $filtered['body'] ?? [];
                    $status = $body['status'] ?? null;
                    if (!in_array($status, $settings['statusFilter'])) {
                        return null;
                    }
                }
                if (!empty($settings['hiddenFields']) && isset($filtered['body'])) {
                    $body = $filtered['body'];
                    foreach ($settings['hiddenFields'] as $field) {
                        unset($body[$field]);
                    }
                    $filtered['body'] = $body;
                }
                return $filtered;
            }, $webhooks);
            $filteredWebhooks = array_filter($filteredWebhooks, fn($w) => $w !== null);
            $filteredWebhooks = array_values($filteredWebhooks);
        }

        return Inertia::render('webhook-handler/index', [
            'webhooks' => $filteredWebhooks,
            'webhooksCount' => count($filteredWebhooks),
            'webhooksTotalCount' => count($webhooks),
            'webhookSettings' => $settings,
        ]);
    }

    /**
     * Handle incoming webhook
     * Store webhook globally (last 100 webhooks, 1 hour TTL)
     */
    public function handle(Request $request): JsonResponse
    {
        $data = [
            'timestamp' => now()->toIso8601String(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'body' => $request->all(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ];

        // Store webhook globally (last 100 webhooks, 1 hour TTL)
        $webhooks = Cache::get('webhooks:global', []);
        array_unshift($webhooks, $data);

        // Filter: only keep webhooks from last 1 hour
        $oneHourAgo = now()->subHour()->timestamp;
        $webhooks = array_filter($webhooks, function ($webhook) use ($oneHourAgo) {
            $webhookTime = strtotime($webhook['timestamp'] ?? '');
            return $webhookTime >= $oneHourAgo;
        });

        // Keep only last 100
        $webhooks = array_slice($webhooks, 0, 100);

        // Store with 1 hour TTL
        Cache::put('webhooks:global', $webhooks, now()->addHour());

        return response()->json([
            'success' => true,
            'message' => 'Webhook received',
            'timestamp' => $data['timestamp'],
        ]);
    }


    /**
     * Get recent webhooks (last 1 hour, max 100)
     */
    public function getWebhooks(Request $request)
    {
        $sessionId = Session::getId();

        // Get global webhooks (last 1 hour, max 100)
        $webhooks = Cache::get('webhooks:global', []);

        // Filter: only keep webhooks from last 1 hour
        $oneHourAgo = now()->subHour()->timestamp;
        $webhooks = array_filter($webhooks, function ($webhook) use ($oneHourAgo) {
            $webhookTime = strtotime($webhook['timestamp'] ?? '');
            return $webhookTime >= $oneHourAgo;
        });

        // Sort by timestamp descending (newest first)
        usort($webhooks, function ($a, $b) {
            $timeA = strtotime($a['timestamp'] ?? '');
            $timeB = strtotime($b['timestamp'] ?? '');
            return $timeB <=> $timeA;
        });

        // Get user settings (use session ID for guests) - only for filtering
        $settingsCacheKey = "webhook_settings:{$sessionId}";
        $settings = Cache::get($settingsCacheKey, null);

        // Apply filters only if settings exist
        $filteredWebhooks = $webhooks;

        if ($settings !== null) {
            // User has settings, apply filters
            $filteredWebhooks = array_map(function ($webhook) use ($settings) {
                $filtered = $webhook;

                // Filter by event type if set (multiple selection)
                if (!empty($settings['eventTypeFilter']) && is_array($settings['eventTypeFilter'])) {
                    $body = $filtered['body'] ?? [];
                    $eventType = $body['iyziEventType'] ?? null;

                    if (!in_array($eventType, $settings['eventTypeFilter'])) {
                        return null; // Will be filtered out
                    }
                }

                // Filter by status if set (multiple selection)
                if (!empty($settings['statusFilter']) && is_array($settings['statusFilter'])) {
                    $body = $filtered['body'] ?? [];
                    $status = $body['status'] ?? null;

                    if (!in_array($status, $settings['statusFilter'])) {
                        return null; // Will be filtered out
                    }
                }

                // Hide specified fields from body
                if (!empty($settings['hiddenFields']) && isset($filtered['body'])) {
                    $body = $filtered['body'];
                    foreach ($settings['hiddenFields'] as $field) {
                        unset($body[$field]);
                    }
                    $filtered['body'] = $body;
                }

                return $filtered;
            }, $webhooks);
        }

        // Remove null values (filtered out by event type)
        $filteredWebhooks = array_filter($filteredWebhooks, fn($w) => $w !== null);
        $filteredWebhooks = array_values($filteredWebhooks); // Re-index

        return back()->with([
            'webhooks' => $filteredWebhooks,
            'webhooksCount' => count($filteredWebhooks),
            'webhooksTotalCount' => count($webhooks),
        ]);
    }

    /**
     * Get user's webhook settings
     */
    public function getSettings(Request $request)
    {
        $sessionId = Session::getId();
        $cacheKey = "webhook_settings:{$sessionId}";

        $settings = Cache::get($cacheKey, null);

        return back()->with([
            'webhookSettings' => $settings,
        ]);
    }

    /**
     * Update user's webhook settings
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'hiddenFields' => 'array',
            'hiddenFields.*' => 'string',
            'eventTypeFilter' => 'array',
            'eventTypeFilter.*' => 'string',
            'statusFilter' => 'array',
            'statusFilter.*' => 'string',
        ]);

        $sessionId = Session::getId();
        $cacheKey = "webhook_settings:{$sessionId}";

        $settings = [
            'hiddenFields' => $validated['hiddenFields'] ?? [],
            'eventTypeFilter' => $validated['eventTypeFilter'] ?? [],
            'statusFilter' => $validated['statusFilter'] ?? [],
        ];

        // Cache for 1 hour (same as webhooks)
        Cache::put($cacheKey, $settings, now()->addHour());

        return back()->with([
            'webhookSettings' => $settings,
        ]);
    }

}

