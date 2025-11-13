<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function home()
    {
        return Inertia::render('landing/home');
    }

    public function getGitHubStars(): JsonResponse
    {
        $repos = [
            'iyzipay-php',
            'iyzipay-dotnet',
            'iyzipay-java',
            'iyzipay-node',
            'iyzipay-python',
            'iyzipay-go',
        ];

        $starCounts = [];

        foreach ($repos as $repo) {
            $cacheKey = "github_stars_{$repo}";

            $stars = Cache::remember($cacheKey, now()->addHours(24), function () use ($repo) {
                try {
                    $response = Http::timeout(5)->get(
                        "https://api.github.com/repos/iyzico/{$repo}"
                    );

                    if ($response->successful()) {
                        return $response->json('stargazers_count');
                    }

                    return null;
                } catch (Exception $e) {
                    Log::warning("Failed to fetch GitHub stars for {$repo}: ".$e->getMessage());
                    return null;
                }
            });

            $starCounts[$repo] = $stars;
        }

        return response()->json($starCounts);
    }
}
