<?php

use Illuminate\Support\Facades\Route;
use Modules\DiagnosticoHospitalar\Http\Controllers\DiagnosticoController;

Route::middleware(['auth', 'permission:diagnostico.view'])->prefix('diagnostico')->name('diagnostico.')->group(function () {
    // VIEW Principal
    Route::get('/', [DiagnosticoController::class, 'index'])->name('index');
    
    // AJAX Routes
    Route::get('/unidades', [DiagnosticoController::class, 'obterUnidades'])->name('unidades');
    Route::get('/setores', [DiagnosticoController::class, 'obterSetores'])->name('setores');
    Route::get('/periodos', [DiagnosticoController::class, 'obterPeriodos'])->name('periodos');
    Route::get('/itens', [DiagnosticoController::class, 'obterItens'])->name('itens');
    Route::get('/progresso/{periodo}', [DiagnosticoController::class, 'obterProgresso'])->name('progresso');
    
    Route::post('/avaliar', [DiagnosticoController::class, 'salvarAvaliacao'])->name('avaliar');
    Route::post('/sincronizar/{periodo}', [DiagnosticoController::class, 'sincronizarItens'])->name('sincronizar');
    Route::post('/periodos', [DiagnosticoController::class, 'criarPeriodo'])->name('periodos.criar');
});
