<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class DebugVerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     */    protected $except = [
        'simple-login',
        'test-login',
        'test-csrf',
        'debug-csrf-submit',
        'simple-auth',  // Nova rota sem CSRF
    ];    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next)
    {
        // Log detailed CSRF debug information
        $sessionToken = $request->session()->token();
        $requestToken = $request->input('_token');
        $headerToken = $request->header('X-CSRF-TOKEN');
        
        \Log::info('CSRF Debug - Request Info', [
            'url' => $request->url(),
            'method' => $request->method(),
            'session_id' => $request->session()->getId(),
            'session_started' => $request->session()->isStarted(),
            'session_token' => $sessionToken,
            'request_token' => $requestToken,
            'header_token' => $headerToken,
            'tokens_match' => $requestToken === $sessionToken || $headerToken === $sessionToken,
            'excluded' => $this->inExceptArray($request),
        ]);

        if ($this->isReading($request) || 
            $this->runningUnitTests() || 
            $this->inExceptArray($request) || 
            $this->tokensMatch($request)) {
            
            \Log::info('CSRF Debug - Request allowed');
            return $this->addCookieToResponse($request, $next($request));
        }

        \Log::error('CSRF Debug - Token mismatch detected', [
            'expected' => $sessionToken,
            'received_input' => $requestToken,
            'received_header' => $headerToken,
        ]);

        // Instead of throwing exception, return custom response for debugging
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'CSRF token mismatch',
                'debug' => [
                    'session_token' => $sessionToken,
                    'request_token' => $requestToken,
                    'header_token' => $headerToken,
                    'session_id' => $request->session()->getId(),
                ]
            ], 419);
        }

        return back()->withErrors(['csrf' => 'CSRF token mismatch. Session token: ' . $sessionToken . ', Request token: ' . $requestToken]);
    }
}
