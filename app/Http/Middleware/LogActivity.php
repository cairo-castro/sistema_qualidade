<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Log apenas em produção ou quando habilitado
        if (config('app.log_activities', false)) {
            $this->logActivity($request, $response);
        }

        return $response;
    }

    private function logActivity(Request $request, Response $response): void
    {
        $user = Auth::user();
        
        $logData = [
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->name : 'Guest',
            'ip' => $request->ip(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_agent' => $request->userAgent(),
            'status_code' => $response->getStatusCode(),
            'timestamp' => now()->toISOString(),
        ];

        // Log apenas rotas importantes (não assets, etc.)
        if ($this->shouldLog($request)) {
            Log::channel('activity')->info('User Activity', $logData);
        }
    }

    private function shouldLog(Request $request): bool
    {
        $path = $request->path();
        
        // Não logar assets, imagens, etc.
        $skipPatterns = [
            'css/', 'js/', 'images/', 'favicon.ico',
            'build/', '_debugbar', 'livewire/'
        ];

        foreach ($skipPatterns as $pattern) {
            if (str_starts_with($path, $pattern)) {
                return false;
            }
        }

        return true;
    }
}