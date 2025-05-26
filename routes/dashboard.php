<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Dashboard Routes
|--------------------------------------------------------------------------
|
| Rotas específicas para funcionalidades da dashboard
|
*/

Route::middleware(['auth'])->group(function () {
    
    // Rota principal da dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // AJAX Endpoints para atualizações da dashboard
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        
        // Atualização das estatísticas principais
        Route::post('/update-stats', [DashboardController::class, 'updateStats'])
            ->middleware('throttle:10,1') // 10 requests per minute
            ->name('update-stats');
        
        // Buscar atividades recentes
        Route::get('/activities', [DashboardController::class, 'getRecentActivities'])
            ->middleware('throttle:20,1')
            ->name('activities');
        
        // Buscar diagnósticos recentes
        Route::get('/diagnostics', [DashboardController::class, 'getRecentDiagnostics'])
            ->middleware('throttle:20,1')
            ->name('diagnostics');
        
        // Status do sistema
        Route::get('/system-status', [DashboardController::class, 'getSystemStatus'])
            ->middleware('throttle:30,1')
            ->name('system-status');
        
        // Importação de dados
        Route::post('/import', [DashboardController::class, 'importData'])
            ->middleware('throttle:5,1') // 5 imports per minute
            ->name('import');
        
        // Limpar cache (apenas admins)
        Route::post('/clear-cache', [DashboardController::class, 'clearCache'])
            ->middleware(['role:Admin', 'throttle:3,1'])
            ->name('clear-cache');
        
        // Exportar dados da dashboard
        Route::get('/export/{type}', [DashboardController::class, 'exportData'])
            ->middleware('throttle:5,1')
            ->where('type', 'statistics|diagnostics|activities')
            ->name('export');
        
        // Configurações personalizadas da dashboard
        Route::get('/settings', [DashboardController::class, 'getSettings'])
            ->name('settings.get');
            
        Route::post('/settings', [DashboardController::class, 'updateSettings'])
            ->middleware('throttle:10,1')
            ->name('settings.update');
    });
    
    // Rotas para widgets específicos
    Route::prefix('widgets')->name('widgets.')->group(function () {
        
        // Widget de gráfico de diagnósticos
        Route::get('/diagnostics-chart/{period}', [DashboardController::class, 'getDiagnosticsChartData'])
            ->middleware('throttle:20,1')
            ->where('period', 'week|month|year')
            ->name('diagnostics-chart');
        
        // Widget de estatísticas em tempo real
        Route::get('/real-time-stats', [DashboardController::class, 'getRealTimeStats'])
            ->middleware('throttle:60,1') // Mais requests para real-time
            ->name('real-time-stats');
        
        // Widget de notificações
        Route::get('/notifications', [DashboardController::class, 'getNotifications'])
            ->middleware('throttle:30,1')
            ->name('notifications');
        
        // Marcar notificações como lidas
        Route::post('/notifications/mark-read', [DashboardController::class, 'markNotificationsAsRead'])
            ->middleware('throttle:20,1')
            ->name('notifications.mark-read');
        
        // Widget de usuários online
        Route::get('/users-online', [DashboardController::class, 'getUsersOnline'])
            ->middleware('throttle:30,1')
            ->name('users-online');
    });
    
    // Rotas para relatórios rápidos
    Route::prefix('reports')->name('reports.')->group(function () {
        
        // Relatório de performance
        Route::get('/performance', [DashboardController::class, 'getPerformanceReport'])
            ->middleware('throttle:10,1')
            ->name('performance');
        
        // Relatório de uso do sistema
        Route::get('/usage', [DashboardController::class, 'getUsageReport'])
            ->middleware('throttle:10,1')
            ->name('usage');
        
        // Relatório de erros
        Route::get('/errors', [DashboardController::class, 'getErrorReport'])
            ->middleware(['role:Admin', 'throttle:5,1'])
            ->name('errors');
    });
});

// Rotas para WebSockets (se implementado)
Route::prefix('ws')->name('ws.')->group(function () {
    
    // Endpoint para estatísticas em tempo real via WebSocket
    Route::get('/stats', [DashboardController::class, 'websocketStats'])
        ->middleware('auth')
        ->name('stats');
        
    // Endpoint para notificações em tempo real
    Route::get('/notifications', [DashboardController::class, 'websocketNotifications'])
        ->middleware('auth')
        ->name('notifications');
});

// Rotas de API para aplicações móveis (opcional)
Route::prefix('api/dashboard')->name('api.dashboard.')->middleware(['auth:sanctum'])->group(function () {
    
    // API para estatísticas principais
    Route::get('/stats', [DashboardController::class, 'apiGetStats'])
        ->middleware('throttle:60,1')
        ->name('stats');
    
    // API para atividades
    Route::get('/activities', [DashboardController::class, 'apiGetActivities'])
        ->middleware('throttle:60,1')
        ->name('activities');
    
    // API para notificações
    Route::get('/notifications', [DashboardController::class, 'apiGetNotifications'])
        ->middleware('throttle:60,1')
        ->name('notifications');
});

// Rotas para testes e debug (apenas em desenvolvimento)
if (app()->environment('local', 'staging')) {
    Route::prefix('dashboard/debug')->name('dashboard.debug.')->middleware(['auth', 'role:Admin'])->group(function () {
        
        // Simular dados de teste
        Route::get('/simulate-data', [DashboardController::class, 'simulateTestData'])
            ->name('simulate-data');
        
        // Limpar todos os dados de teste
        Route::post('/clear-test-data', [DashboardController::class, 'clearTestData'])
            ->name('clear-test-data');
        
        // Gerar dados de exemplo
        Route::post('/generate-sample-data', [DashboardController::class, 'generateSampleData'])
            ->name('generate-sample-data');
        
        // Monitor de performance em tempo real
        Route::get('/performance-monitor', [DashboardController::class, 'performanceMonitor'])
            ->name('performance-monitor');
    });
}