<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/test-auth', function (Request $request) {
    return response()->json([
        'authenticated' => Auth::check(),
        'user' => Auth::user() ? Auth::user()->only(['id', 'name', 'email']) : null,
        'session_id' => $request->session()->getId(),
        'csrf_token' => csrf_token(),
    ]);
});

Route::post('/test-login', function (Request $request) {
    $credentials = [
        'name' => $request->input('name'),
        'password' => $request->input('password')
    ];
    
    $result = Auth::attempt($credentials);
    
    return response()->json([
        'success' => $result,
        'authenticated_after' => Auth::check(),
        'user' => Auth::user() ? Auth::user()->only(['id', 'name', 'email']) : null,
        'credentials_tested' => $credentials['name'],
        'session_id' => $request->session()->getId(),
    ]);
});
