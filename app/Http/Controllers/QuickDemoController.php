<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\CreditCardPaymentRequest;
use App\Models\Category;
use App\Models\Product;
use App\Repositories\Checkout\CartRepository;
use App\Services\Checkout\CartService;
use App\Services\Payment\PaymentService;
use App\Services\Service\InstallmentBinService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuickDemoController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
        protected CartService $cartService,
        protected CartRepository $cartRepository,
        protected InstallmentBinService $installmentBinService
    ) {
    }

    /**
     * Create dummy cart data for demo
     */
    private function createDummyCart(): void
    {
        $sessionId = session()->getId();

        // Önce sepeti temizle
        $this->cartRepository->clear($sessionId);

        // Demo kategori oluştur
        $demoCategory = Category::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Demo Kategori',
                'slug' => 'demo-kategori',
            ]
        );

        // Fındık (100gr)ünü oluştur veya mevcut olanı kullan
        $demoProduct = Product::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'Fındık (100gr)',
                'slug' => 'demo-urun',
                'price' => 100.00,
                'sale_price' => null,
                'image' => '/findik.webp',
                'category_id' => $demoCategory->id,
            ]
        );

        // Fındık (100gr)ü sepete ekle
        $demoItemData = [
            'quantity' => 1,
            'price' => 100.00,
            'added_at' => now()->toIso8601String(),
            'updated_at' => now()->toIso8601String(),
        ];

        $this->cartRepository->addOrUpdate($sessionId, $demoProduct->id, $demoItemData);
    }

    /**
     * Display quick demo page
     */
    public function index(string $paymentMethod = 'credit-card'): Response
    {
        // Demo sepet verilerini oluştur
        $this->createDummyCart();

        // Fındık (100gr) bilgileri
        $demoProduct = [
            'id' => 1,
            'name' => 'Fındık (100gr)',
            'image' => '/findik.webp',
            'price' => 100.00,
            'quantity' => 1,
        ];

        // Geçerli ödeme yöntemlerini kontrol et
        $validPaymentMethods = ['credit-card', 'checkout-form', 'pay-with-iyzico'];
        if (!in_array($paymentMethod, $validPaymentMethods)) {
            $paymentMethod = 'credit-card';
        }

        return Inertia::render('quick-demo', [
            'product' => $demoProduct,
            'subtotal' => 100.00,
            'tax' => 20.00,
            'shipping' => 30.00,
            'total' => 150.00,
            'paymentMethod' => $paymentMethod,
        ]);
    }

    /**
     * Get demo cart summary for quick demo
     */
    private function getDemoCartSummary(): array
    {
        return [
            'items' => [
                [
                    'id' => 1,
                    'product_id' => 1,
                    'product' => [
                        'id' => 1,
                        'name' => 'Fındık (100gr)',
                        'slug' => 'demo-urun',
                        'price' => 100.00,
                        'sale_price' => null,
                        'image' => '/findik.webp',
                        'category' => [
                            'name' => 'Demo Kategori',
                        ],
                    ],
                    'quantity' => 1,
                    'price' => 100.00,
                ],
            ],
            'subtotal' => 100.00,
            'tax' => 20.00,
            'shipping' => 30.00,
            'total' => 150.00,
            'item_count' => 1,
        ];
    }

    /**
     * Get demo buyer and address data
     */
    private function getDemoBuyerData(): array
    {
        return [
            'full_name' => 'Test Kullanıcı',
            'email' => 'test@example.com',
            'phone' => '05551234567',
            'address' => 'Demo Adres',
            'city' => 'Istanbul',
            'country' => 'Turkey',
            'postal_code' => '34000',
        ];
    }

    /**
     * Process quick demo credit card payment
     */
    public function processCreditCardPayment(CreditCardPaymentRequest $request): JsonResponse|RedirectResponse
    {
        // Demo sepet verilerini oluştur
        $this->createDummyCart();

        $data = $request->validated();
        $use3d = $request->boolean('use_3d', false);

        // Demo buyer ve adres bilgilerini ekle
        $demoBuyerData = $this->getDemoBuyerData();
        $data['full_name'] = $demoBuyerData['full_name'];
        $data['email'] = $demoBuyerData['email'];
        $data['phone'] = $demoBuyerData['phone'];
        $data['address'] = $demoBuyerData['address'];
        $data['city'] = $demoBuyerData['city'];
        $data['country'] = $demoBuyerData['country'];
        $data['postal_code'] = $demoBuyerData['postal_code'];

        // Demo cart summary ekle
        $data['demo_cart_summary'] = $this->getDemoCartSummary();

        if ($use3d) {
            $result = $this->paymentService->initializeThreedsPayment($data);
            return $this->handlePaymentResult($request, $result, true);
        }

        $result = $this->paymentService->processCreditCardPayment($data);
        return $this->handlePaymentResult($request, $result, false);
    }

    /**
     * Initialize checkout form for quick demo
     */
    public function initializeCheckoutForm(Request $request): JsonResponse
    {
        // Demo sepet verilerini oluştur
        $this->createDummyCart();

        $data = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Demo buyer ve adres bilgilerini ekle
        $demoBuyerData = $this->getDemoBuyerData();
        $data['full_name'] = $demoBuyerData['full_name'];
        $data['email'] = $demoBuyerData['email'];
        $data['phone'] = $demoBuyerData['phone'];
        $data['address'] = $demoBuyerData['address'];
        $data['city'] = $demoBuyerData['city'];
        $data['country'] = $demoBuyerData['country'];
        $data['postal_code'] = $demoBuyerData['postal_code'];

        // Demo cart summary ekle
        $data['demo_cart_summary'] = $this->getDemoCartSummary();

        $result = $this->paymentService->initializeCheckoutForm($data);

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result['data'] ?? [],
            ], 200);
        }

        return response()->json([
            'success' => false,
            'errorMessage' => $result['errorMessage'] ?? 'Checkout form başlatılamadı',
            'message' => $result['errorMessage'] ?? 'Checkout form başlatılamadı',
        ], 400);
    }

    /**
     * Initialize pay with iyzico for quick demo
     */
    public function initializePayWithIyzico(Request $request): JsonResponse
    {
        // Demo sepet verilerini oluştur
        $this->createDummyCart();

        $data = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        // Demo buyer ve adres bilgilerini ekle
        $demoBuyerData = $this->getDemoBuyerData();
        $data['full_name'] = $demoBuyerData['full_name'];
        $data['email'] = $demoBuyerData['email'];
        $data['phone'] = "+905546041451"; // TODO:
        $data['address'] = $demoBuyerData['address'];
        $data['city'] = $demoBuyerData['city'];
        $data['country'] = $demoBuyerData['country'];
        $data['postal_code'] = $demoBuyerData['postal_code'];

        // Demo cart summary ekle
        $data['demo_cart_summary'] = $this->getDemoCartSummary();

        $result = $this->paymentService->initializePayWithIyzico($data);

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'success' => true,
                'data' => $result['data'] ?? [],
            ], 200);
        }

        return response()->json([
            'success' => false,
            'errorMessage' => $result['errorMessage'] ?? 'Pay with iyzico başlatılamadı',
            'message' => $result['errorMessage'] ?? 'Pay with iyzico başlatılamadı',
        ], 400);
    }

    /**
     * Get installment options for quick demo
     */
    public function getInstallmentOptions(Request $request): JsonResponse
    {
        $request->validate([
            'binNumber' => 'required|string|min:6|max:6',
        ]);

        $binNumber = $request->input('binNumber');
        $total = 150.00; // Demo tutar

        $result = $this->installmentBinService->getInstallmentInfo($binNumber, $total);

        if ($result && $result['status'] === 'success') {
            return response()->json([
                'status' => 'success',
                'installmentDetails' => $result['installmentDetails'] ?? [],
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => $result['errorMessage'] ?? 'Taksit bilgileri alınamadı',
        ], 400);
    }

    /**
     * Display quick demo success page
     */
    public function success(Request $request): Response
    {
        $orderId = $request->query('orderId');
        $paymentId = $request->query('paymentId');

        return Inertia::render('quick-demo-success', [
            'orderId' => $orderId,
            'paymentId' => $paymentId,
        ]);
    }

    /**
     * Display quick demo failed page
     */
    public function failed(Request $request): Response
    {
        $error = $request->query('error');
        $errorMessage = $request->query('errorMessage');

        return Inertia::render('quick-demo-failed', [
            'error' => $error,
            'errorMessage' => $errorMessage,
        ]);
    }

    /**
     * Handle payment result
     */
    private function handlePaymentResult(Request $request, ?array $result, bool $is3ds = false): JsonResponse|RedirectResponse
    {
        if (!$result) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ödeme işlemi başarısız',
                ], 400);
            }
            return redirect()->route('demo.orders.failed');
        }

        if ($result['status'] === 'error') {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $result['errorMessage'] ?? 'Ödeme işlemi başarısız',
                ], 400);
            }
            return redirect()->route('demo.orders.failed', [
                'errorMessage' => $result['errorMessage'] ?? 'Ödeme işlemi başarısız',
            ]);
        }

        if ($is3ds && isset($result['htmlContent'])) {
            session([
                'threeds_html_content' => $result['htmlContent'],
                'threeds_payment_id' => $result['paymentId'] ?? null,
                'threeds_conversationId' => $result['conversationId'] ?? null,
            ]);

            return redirect()->route('store.payment.threeds-page');
        }

        if (isset($result['redirectUrl'])) {
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'success',
                    'requires3ds' => true,
                    'redirectUrl' => $result['redirectUrl'],
                ]);
            }
            return redirect($result['redirectUrl']);
        }

        $orderId = $result['paymentId'] ?? 'ORD-'.time();
        if ($request->expectsJson()) {
            return response()->json([
                'status' => 'success',
                'paymentId' => $result['paymentId'] ?? null,
                'orderId' => $orderId,
            ]);
        }

        return redirect()->route('demo.orders.success', [
            'orderId' => $orderId,
            'paymentId' => $result['paymentId'] ?? null,
        ]);
    }
}
