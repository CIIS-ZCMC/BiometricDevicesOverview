<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $deviceApiUrl = env('DEVICE_API');
        return Inertia::render('Home', [
            'deviceApiUrl' => $deviceApiUrl,
        ]);
    }
}
