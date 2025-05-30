<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Rotas para administração de usuários, papéis e permissões
|
*/

Route::middleware(['auth', 'role:Admin|Gestor'])->prefix('admin')->name('admin.')->group(function () {
    
    // Users Management
    Route::resource('users', UserController::class);
    Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');
    
    // Roles Management (apenas para Admin)
    Route::middleware('role:Admin')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::post('roles/{role}/clone', [RoleController::class, 'clone'])->name('roles.clone');
        
        // Permissions Management
        Route::resource('permissions', PermissionController::class);
        Route::post('permissions/bulk-create', [PermissionController::class, 'bulkCreate'])->name('permissions.bulk-create');
    });
});
