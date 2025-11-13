<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display services page
     */
    public function index(): Response
    {
        return Inertia::render('services/index');
    }
}

