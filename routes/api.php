<?php

use App\Http\Controllers\LandingController;
use App\Http\Controllers\Service\WebhookController;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Route;

Route::get('/github-stars', [LandingController::class, 'getGitHubStars'])->name('api.github-stars');

// Webhook handle endpoint - external systems call this, must stay as JSON response
Route::middleware(['web'])->group(function () {
    Route::post('/webhook', [WebhookController::class, 'handle'])
        ->withoutMiddleware([ValidateCsrfToken::class])
        ->name('webhook.handle');
});


