<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class SimpleAuthController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.simple-login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        // Log the request for debugging
        \Log::info('Simple Auth Attempt', [
            'has_token' => $request->has('_token'),
            'token_value' => $request->input('_token'),
            'session_token' => $request->session()->token(),
            'tokens_match' => $request->input('_token') === $request->session()->token(),
            'session_id' => $request->session()->getId(),
            'request_data' => $request->only(['name', 'password', 'remember'])
        ]);

        // Simple validation
        $credentials = $request->validate([
            'name' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            \Log::info('Simple Auth Success', [
                'user_id' => Auth::id(),
                'user_name' => Auth::user()->name
            ]);

            return redirect()->intended(route('dashboard'));
        }

        \Log::warning('Simple Auth Failed', [
            'credentials' => $credentials
        ]);

        return back()->withErrors([
            'name' => 'As credenciais fornecidas não coincidem com nossos registros.',
        ])->onlyInput('name');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
