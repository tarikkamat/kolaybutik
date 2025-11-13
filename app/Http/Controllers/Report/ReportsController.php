<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Services\Report\ReportsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    private ReportsService $reportsService;

    public function __construct(ReportsService $reportsService)
    {
        $this->reportsService = $reportsService;
    }

    /**
     * Display Reports page
     */
    public function index(): Response
    {
        return Inertia::render('reports/index');
    }

    /**
     * Scroll Transactions Report
     */
    public function scrollTransactions(Request $request)
    {
        $validated = $request->validate([
            'documentScrollVoSortingOrder' => 'nullable|string',
            'conversationId' => 'nullable|string',
            'lastId' => 'nullable|string',
            'transactionDate' => 'nullable|date_format:Y-m-d',
        ]);

        $result = $this->reportsService->scrollTransactions($validated);

        return back()->with([
            'scrollTransactionsData' => $result && $result['status'] === 'success' ? $result : null,
            'scrollTransactionsError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'Rapor alınamadı') : null,
        ]);
    }

    /**
     * Transaction Daily Report
     */
    public function transactionDaily(Request $request)
    {
        $validated = $request->validate([
            'conversationId' => 'nullable|string',
            'transactionDate' => 'required|date_format:Y-m-d',
        ]);

        $result = $this->reportsService->transactionDaily($validated);

        return back()->with([
            'transactionDailyData' => $result && $result['status'] === 'success' ? $result : null,
            'transactionDailyError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'Rapor alınamadı') : null,
        ]);
    }

    /**
     * Transaction Based Report
     */
    public function transactionBased(Request $request)
    {
        $validated = $request->validate([
            'conversationId' => 'nullable|string',
            'paymentId' => 'nullable|string',
            'paymentConversationId' => 'nullable|string',
        ]);

        // At least one of paymentId or paymentConversationId is required
        if (empty($validated['paymentId']) && empty($validated['paymentConversationId'])) {
            return back()->withErrors([
                'paymentId' => 'paymentId veya paymentConversationId alanlarından biri gereklidir',
            ]);
        }

        $result = $this->reportsService->transactionBased($validated);

        return back()->with([
            'transactionBasedData' => $result && $result['status'] === 'success' ? $result : null,
            'transactionBasedError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'Rapor alınamadı') : null,
        ]);
    }

    /**
     * Marketplace Payout Completed Report
     */
    public function marketplacePayoutCompleted(Request $request)
    {
        $validated = $request->validate([
            'conversationId' => 'nullable|string',
            'transactionDate' => 'required|date_format:Y-m-d',
        ]);

        $result = $this->reportsService->marketplacePayoutCompleted($validated);

        return back()->with([
            'marketplacePayoutData' => $result && $result['status'] === 'success' ? $result : null,
            'marketplacePayoutError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'Rapor alınamadı') : null,
        ]);
    }

    /**
     * Marketplace Retrieve Bounced Payments
     */
    public function marketplaceRetrieveBouncedPayments(Request $request)
    {
        $validated = $request->validate([
            'conversationId' => 'nullable|string',
            'transactionDate' => 'required|date_format:Y-m-d',
        ]);

        $result = $this->reportsService->marketplaceRetrieveBouncedPayments($validated);

        return back()->with([
            'marketplaceBouncedData' => $result && $result['status'] === 'success' ? $result : null,
            'marketplaceBouncedError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'Rapor alınamadı') : null,
        ]);
    }
}

