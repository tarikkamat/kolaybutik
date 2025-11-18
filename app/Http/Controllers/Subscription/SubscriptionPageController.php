<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPageController extends Controller
{
    /**
     * Display subscription management page
     */
    public function index(): Response
    {
        return Inertia::render('subscription/index');
    }
}

