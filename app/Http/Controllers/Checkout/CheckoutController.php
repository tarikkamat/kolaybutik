<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Services\Checkout\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {
    }

    /**
     * Display checkout page
     */
    public function index(): Response|RedirectResponse
    {
        $summary = $this->cartService->getCartSummary();

        // Redirect to cart if cart is empty
        if (empty($summary['items'])) {
            return redirect()->route('store.cart.index');
        }

        return Inertia::render('store/checkout/index', [
            'items' => $summary['items'],
            'subtotal' => $summary['subtotal'],
            'tax' => $summary['tax'],
            'shipping' => $summary['shipping'],
            'total' => $summary['total'],
        ]);
    }

    /**
     * Process checkout
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'card_number' => 'required|string|max:19',
            'card_name' => 'required|string|max:255',
            'card_expiry' => 'required|string|max:5',
            'card_cvv' => 'required|string|max:3',
        ]);

        // TODO: Process payment and create order
        // For now, just redirect to success page
        $orderId = 'ORD-'.strtoupper(uniqid());

        return redirect()->route('store.orders.success', ['orderId' => $orderId]);
    }
}

