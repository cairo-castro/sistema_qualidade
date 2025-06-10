<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/**
 * Application Routes
 * Sistema de Qualidade - Production Routes
 */

// Root route - redirect based on authentication
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Authenticated routes group
Route::middleware(['auth'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats'])->name('dashboard.stats');
    Route::get('/dashboard/notifications', [DashboardController::class, 'getNotifications'])->name('dashboard.notifications');

    // Theme routes
    Route::prefix('theme')->name('theme.')->group(function () {
        Route::get('/', [\App\Http\Controllers\ThemeController::class, 'show'])->name('show');
        Route::post('/update', [\App\Http\Controllers\ThemeController::class, 'update'])->name('update');
        Route::post('/reset', [\App\Http\Controllers\ThemeController::class, 'reset'])->name('reset');
    });

    // Additional theme routes for JavaScript
    Route::post('/theme', [\App\Http\Controllers\ThemeController::class, 'store'])->name('theme.store');
    Route::post('/theme/reset', [\App\Http\Controllers\ThemeController::class, 'reset'])->name('theme.reset.alt');

    // User profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rota temporária para teste da sidebar
    Route::get('/test-sidebar', function () {
        return view('test-sidebar');
    })->name('test.sidebar');

    // Rota para teste do gerenciador de temas
    Route::get('/theme-test', function () {
        return view('theme-test');
    })->name('theme.test');

    // Rota para teste aprimorado do gerenciador de temas
    Route::get('/theme-test-enhanced', function () {
        return view('theme-test-enhanced');
    })->name('theme.test.enhanced');
});

// Include authentication routes
require __DIR__.'/auth.php';

// Include admin routes
require __DIR__.'/admin.php';

// Test route for debugging admin controllers
Route::get('/test-admin-debug', function () {
    try {
        // Test if we can access admin user
        $admin = \App\Models\User::where('email', 'admin@emserh.ma.gov.br')->first();

        if (!$admin) {
            return response('Admin user not found', 404);
        }

        // Login as admin
        \Illuminate\Support\Facades\Auth::login($admin);

        $output = [
            'user' => $admin->name,
            'permissions' => [
                'view users' => $admin->can('view users'),
                'create users' => $admin->can('create users'),
                'edit users' => $admin->can('edit users'),
                'delete users' => $admin->can('delete users'),
                'manage permissions' => $admin->can('manage permissions'),
            ],
            'all_permissions_count' => $admin->getAllPermissions()->count(),
        ];

        // Test UserController instantiation
        try {
            $controller = new \App\Http\Controllers\Admin\UserController();
            $output['user_controller'] = 'OK';

            // Test method call
            $request = \Illuminate\Http\Request::create('/admin/users', 'GET');
            $response = $controller->index($request);
            $output['user_controller_method'] = 'OK - ' . get_class($response);
        } catch (\Exception $e) {
            $output['user_controller_error'] = $e->getMessage();
            $output['user_controller_file'] = $e->getFile() . ':' . $e->getLine();
        }

        // Test RoleController
        try {
            $controller = new \App\Http\Controllers\Admin\RoleController();
            $output['role_controller'] = 'OK';

            $request = \Illuminate\Http\Request::create('/admin/roles', 'GET');
            $response = $controller->index($request);
            $output['role_controller_method'] = 'OK - ' . get_class($response);
        } catch (\Exception $e) {
            $output['role_controller_error'] = $e->getMessage();
            $output['role_controller_file'] = $e->getFile() . ':' . $e->getLine();
        }

        return response()->json($output, 200, [], JSON_PRETTY_PRINT);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile() . ':' . $e->getLine(),
            'trace' => explode("\n", $e->getTraceAsString())
        ], 500, [], JSON_PRETTY_PRINT);
    }
})->name('test.admin.debug');

// Include dashboard routes if they exist
if (file_exists(__DIR__.'/dashboard.php')) {
    require __DIR__.'/dashboard.php';
}

// 🧪 Rota temporária para teste dos gráficos ApexCharts
Route::get('/test-charts', function () {
    return view('test-charts');
})->name('test.charts');
