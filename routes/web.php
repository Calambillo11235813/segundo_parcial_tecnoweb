<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

/**
 * Mapeo de Rutas del Portal FEDER (ROUTES_MAP.md)
 */

// Redirección raíz hacia login
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// Autenticación (CU-01)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Rutas del Panel Administrativo (/admin)
    Route::prefix('admin')->name('admin.')->group(function () {
        // Dashboard general para Director, Secretaria e Instructor
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // CU-01: Usuarios y Roles (Exclusivo Director)
        Route::middleware('role:Director')->group(function () {
            Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
            Route::get('/usuarios/crear', [UsuarioController::class, 'create'])->name('usuarios.create');
            Route::post('/usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
            Route::get('/usuarios/{id}/editar', [UsuarioController::class, 'edit'])->name('usuarios.edit');
            Route::put('/usuarios/{id}', [UsuarioController::class, 'update'])->name('usuarios.update');
            Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy'])->name('usuarios.destroy');
        });
    });
});
