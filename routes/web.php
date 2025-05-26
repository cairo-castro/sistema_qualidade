<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Rota raiz - redireciona baseado na autenticação
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Grupo de rotas autenticadas
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
  // Rotas AJAX para dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->name('dashboard.stats');
    Route::get('/dashboard/notifications', [DashboardController::class, 'getNotifications'])->name('dashboard.notifications');
    
    // Perfil do usuário
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rota de login simplificado para teste
Route::post('/simple-login', function (Illuminate\Http\Request $request) {
    $credentials = [
        'name' => $request->input('name'), 
        'password' => $request->input('password')
    ];
    
    // Tentar autenticar diretamente
    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate();
        
        return response()->json([
            'success' => true,
            'redirect' => route('dashboard'),
            'user' => Auth::user()->only(['id', 'name', 'email'])
        ]);
    }
    
    return response()->json([
        'success' => false,
        'message' => 'Credenciais inválidas'
    ], 422);
});

// Rota de autenticação simples (sem CSRF para debug)
Route::get('/simple-auth', [App\Http\Controllers\Auth\SimpleAuthController::class, 'create'])->name('simple-auth.create');
Route::post('/simple-auth', [App\Http\Controllers\Auth\SimpleAuthController::class, 'store'])->name('simple-auth.store');

// Rotas de teste para diagnóstico
Route::get('/test-auth', function (Illuminate\Http\Request $request) {
    return response()->json([
        'authenticated' => Auth::check(),
        'user' => Auth::user() ? Auth::user()->only(['id', 'name', 'email']) : null,
        'session_id' => $request->session()->getId(),
    ]);
});

Route::get('/test-login-page', function () {
    return view('test-login');
});

Route::post('/test-login', function (Illuminate\Http\Request $request) {
    $credentials = ['name' => $request->input('name'), 'password' => $request->input('password')];
    $result = Auth::attempt($credentials);
    
    return response()->json([
        'success' => $result,
        'authenticated_after' => Auth::check(),
        'user' => Auth::user() ? Auth::user()->only(['id', 'name', 'email']) : null,
    ]);
});

// Rota de debug CSRF
Route::get('/debug-csrf', function () {
    return view('debug-csrf');
});

Route::post('/debug-csrf-submit', function (Illuminate\Http\Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'CSRF token válido!',
        'data' => $request->all()
    ]);
});

// Rota de teste para verificar CSRF
Route::get('/test-csrf', function () {
    return response()->json([
        'csrf_token' => csrf_token(),
        'session_id' => session()->getId(),
        'session_name' => session()->getName(),
        'cookies' => request()->cookies->all()
    ]);
});

// Rota de teste AJAX
Route::get('/test-ajax-login', function () {
    return view('test-ajax-login');
});

// Rota de teste CSRF simples
Route::get('/test-csrf-simple', function () {
    return view('test-csrf-simple');
});

Route::post('/test-csrf-submit', function (Illuminate\Http\Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'CSRF OK!',
        'data' => $request->all(),
        'session_id' => session()->getId(),
        'csrf_token' => csrf_token(),
    ]);
});

// Incluir rotas de autenticação
require __DIR__.'/auth.php';

// Incluir rotas da dashboard (se existir)
if (file_exists(__DIR__.'/dashboard.php')) {
    require __DIR__.'/dashboard.php';
}