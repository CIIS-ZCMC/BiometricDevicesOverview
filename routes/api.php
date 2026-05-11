<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\StatusController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/status', [StatusController::class, 'index']);
Route::post('/deviceList', [StatusController::class, 'deviceList']);
