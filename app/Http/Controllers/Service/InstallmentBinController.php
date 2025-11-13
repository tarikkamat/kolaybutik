<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Services\Service\InstallmentBinService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstallmentBinController extends Controller
{
    private InstallmentBinService $installmentBinService;

    public function __construct(InstallmentBinService $installmentBinService)
    {
        $this->installmentBinService = $installmentBinService;
    }

    /**
     * Display Installment & BIN Inquiry page
     */
    public function index(): Response
    {
        return Inertia::render('installment-bin/index');
    }

    /**
     * Get Installment Info
     */
    public function getInstallmentInfo(Request $request)
    {
        $validated = $request->validate([
            'price' => 'required|numeric|min:0.01',
            'binNumber' => 'nullable|string|size:6',
            'conversationId' => 'nullable|string',
        ]);

        $binNumber = $validated['binNumber'] ?? null;
        $price = (float) $validated['price'];
        $conversationId = $validated['conversationId'] ?? null;

        $result = $this->installmentBinService->getInstallmentInfo($binNumber, $price, $conversationId);

        return back()->with([
            'installmentData' => $result && $result['status'] === 'success' ? $result : null,
            'installmentError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'Taksit bilgileri alınamadı') : null,
        ]);
    }

    /**
     * Get BIN Number Info
     */
    public function getBinNumberInfo(Request $request)
    {
        $validated = $request->validate([
            'binNumber' => 'required|string|size:6',
            'conversationId' => 'nullable|string',
        ]);

        $binNumber = $validated['binNumber'];
        $conversationId = $validated['conversationId'] ?? null;

        $result = $this->installmentBinService->getBinNumberInfo($binNumber, $conversationId);

        return back()->with([
            'binData' => $result && $result['status'] === 'success' ? $result : null,
            'binError' => $result && $result['status'] !== 'success' ? ($result['errorMessage'] ?? 'BIN numarası bilgileri alınamadı') : null,
        ]);
    }
}

