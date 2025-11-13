<?php

use App\Http\Controllers\Checkout\CartController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\Checkout\OrderController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\Payment\ApiPaymentController;
use App\Http\Controllers\Payment\AlternativePaymentController;
use App\Http\Controllers\Product\CategoryController as StoreCategoryController;
use App\Http\Controllers\Product\ProductController as StoreProductController;
use App\Http\Controllers\Report\ReportsController;
use App\Http\Controllers\Service\CardStorageController;
use App\Http\Controllers\Service\InstallmentBinController;
use App\Http\Controllers\Service\PaymentInquiryController;
use App\Http\Controllers\Service\ServicesController;
use App\Http\Controllers\Service\SftpController;
use App\Http\Controllers\Service\WebhookController;
use App\Http\Controllers\Store\StoreController;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'home'])->name('home');


Route::prefix('services')->group(function () {
    Route::get('/', [ServicesController::class, 'index'])->name('services.index');
    Route::get('/webhook-catcher', [WebhookController::class, 'index'])->name('webhook-handler.index');
    Route::get('/sftp', [SftpController::class, 'index'])->name('sftp.index');
    Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');
    Route::get('/installment-bin', [InstallmentBinController::class, 'index'])->name('installment-bin.index');
    Route::get('/payment-inquiry', [PaymentInquiryController::class, 'index'])->name('payment-inquiry.index');
    Route::get('/card-storage', [CardStorageController::class, 'index'])->name('card-storage.index');

    // Card Storage API routes
    Route::post('/card-storage/create', [CardStorageController::class, 'createCard'])->name('card-storage.create');
    Route::post('/card-storage/delete', [CardStorageController::class, 'deleteCard'])->name('card-storage.delete');
    Route::post('/card-storage/retrieve',
        [CardStorageController::class, 'retrieveCards'])->name('card-storage.retrieve');

    // Payment Inquiry API routes
    Route::post('/payment-inquiry/retrieve',
        [PaymentInquiryController::class, 'retrievePayment'])->name('payment-inquiry.retrieve');
    Route::post('/payment-inquiry/retrieve-conversation', [
        PaymentInquiryController::class, 'retrievePaymentWithConversationId'
    ])->name('payment-inquiry.retrieve-conversation');

    // SFTP routes
    Route::get('/sftp/list', [SftpController::class, 'listDirectory'])->name('sftp.list');
    Route::get('/sftp/read', [SftpController::class, 'readFile'])->name('sftp.read');
    Route::get('/sftp/download', [SftpController::class, 'downloadFile'])->name('sftp.download');

    // Webhook routes (except handle which stays in api.php for external systems)
    Route::get('/webhooks', [WebhookController::class, 'getWebhooks'])->name('webhook.get');
    Route::get('/webhook-settings', [WebhookController::class, 'getSettings'])->name('webhook.settings.get');
    Route::post('/webhook-settings', [WebhookController::class, 'updateSettings'])->name('webhook.settings.update');

    // Installment & BIN routes
    Route::post('/installment-bin/installment',
        [InstallmentBinController::class, 'getInstallmentInfo'])->name('installment-bin.installment');
    Route::post('/installment-bin/bin',
        [InstallmentBinController::class, 'getBinNumberInfo'])->name('installment-bin.bin');

    // Reports routes
    Route::get('/reports/scroll-transactions',
        [ReportsController::class, 'scrollTransactions'])->name('reports.scroll-transactions');
    Route::get('/reports/transaction-daily',
        [ReportsController::class, 'transactionDaily'])->name('reports.transaction-daily');
    Route::get('/reports/transaction-based',
        [ReportsController::class, 'transactionBased'])->name('reports.transaction-based');
    Route::get('/reports/marketplace-payout-completed',
        [ReportsController::class, 'marketplacePayoutCompleted'])->name('reports.marketplace-payout-completed');
    Route::get('/reports/marketplace-bounced-payments',
        [ReportsController::class, 'marketplaceRetrieveBouncedPayments'])->name('reports.marketplace-bounced-payments');
});

// Store Routes
Route::prefix('store')->name('store.')->group(function () {
    Route::get('/', [StoreController::class, 'index'])->name('index');

    // Cart routes should be before dynamic routes to avoid conflicts
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/add', [CartController::class, 'add'])->name('add');
        Route::get('/count', [CartController::class, 'count'])->name('count');
        Route::put('/{productId}', [CartController::class, 'update'])->name('update');
        Route::delete('/{productId}', [CartController::class, 'remove'])->name('remove');
        Route::delete('/', [CartController::class, 'clear'])->name('clear');
    });

    // Checkout routes
    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/', [CheckoutController::class, 'index'])->name('index');
        Route::post('/', [CheckoutController::class, 'store'])->name('store');
    });

    // Payment routes - API based payments (Non-3DS, 3DS, Saved Cards)
    Route::prefix('payment')->name('payment.')->group(function () {
        // API Payment routes
        Route::post('/credit-card', [ApiPaymentController::class, 'processCreditCardPayment'])->name('credit-card');
        Route::post('/saved-card', [ApiPaymentController::class, 'processSavedCardPayment'])->name('saved-card');
        Route::get('/saved-cards', [ApiPaymentController::class, 'getSavedCards'])->name('saved-cards');
        Route::post('/installment-options',
            [ApiPaymentController::class, 'getInstallmentOptions'])->name('installment-options');

        // 3DS routes
        Route::get('/threeds-page', [ApiPaymentController::class, 'threedsPage'])->name('threeds-page');
        Route::post('/threeds-proxy', [ApiPaymentController::class, 'proxyThreedsForm'])
            ->withoutMiddleware([ValidateCsrfToken::class])
            ->name('threeds-proxy');
        Route::match(['get', 'post'], '/threeds-callback', [ApiPaymentController::class, 'threedsCallback'])
            ->withoutMiddleware([ValidateCsrfToken::class])
            ->name('threeds-callback');

        // Alternative Payment routes (CheckoutForm, QuickPWI, PWI)
        Route::post('/checkout-form/initialize',
            [AlternativePaymentController::class, 'initializeCheckoutForm'])->name('checkout-form.initialize');
        Route::match(['get', 'post'], '/checkout-form/callback',
            [AlternativePaymentController::class, 'checkoutFormCallback'])
            ->withoutMiddleware([ValidateCsrfToken::class])
            ->name('checkout-form.callback');
        Route::post('/checkout-form', [AlternativePaymentController::class, 'processCheckoutFormPayment'])->name('checkout-form');
        Route::post('/iyzico/initialize', [AlternativePaymentController::class, 'initializePayWithIyzico'])->name('iyzico.initialize');
        Route::post('/iyzico', [AlternativePaymentController::class, 'processIyzicoPayment'])->name('iyzico');
        Route::match(['get', 'post'], '/wallet/callback',
            [AlternativePaymentController::class, 'walletCallback'])
            ->withoutMiddleware([ValidateCsrfToken::class])
            ->name('wallet.callback');
        Route::post('/quick-pwi/initialize', [AlternativePaymentController::class, 'initializeQuickPwi'])->name('quick-pwi.initialize');
        Route::post('/iyzico-quick', [AlternativePaymentController::class, 'processIyzicoQuickPayment'])->name('iyzico-quick');
        Route::match(['get', 'post'], '/quick-pwi/callback',
            [AlternativePaymentController::class, 'quickPwiCallback'])
            ->withoutMiddleware([ValidateCsrfToken::class])
            ->name('quick-pwi.callback');
    });

    // Order routes
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/success', [OrderController::class, 'success'])->name('success');
        Route::get('/failed', [OrderController::class, 'failed'])->name('failed');
        Route::get('/{orderId}', [OrderController::class, 'show'])->name('show');
    });

    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [StoreCategoryController::class, 'index'])->name('index');
        Route::get('/{slug}', [StoreCategoryController::class, 'show'])->name('show');
    });

    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/{slug}', [StoreProductController::class, 'show'])->name('show');
    });
});
