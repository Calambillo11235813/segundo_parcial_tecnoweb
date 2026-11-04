<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InstitucionalController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

/**
 * Mapeo de Rutas del Portal FEDER (ROUTES_MAP.md)
 */

// Redirección inicial hacia el portal público o login
Route::get('/', function () {
    return redirect()->route('public.nosotros');
})->name('home');

// Rutas Públicas (Visitante / Donante)
Route::get('/nosotros', [InstitucionalController::class, 'showPublic'])->name('public.nosotros');

// Autenticación (CU-01)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

// Atajo para acceder a la raíz del panel administrativo
Route::get('/admin', function () {
    return redirect()->route('admin.dashboard');
})->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Rutas del Panel Administrativo (/admin)
    Route::prefix('admin')->name('admin.')->group(function () {
        // Dashboard general para Director, Secretaria e Instructor
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Módulos con Acceso Exclusivo para Director
        Route::middleware('role:Director')->group(function () {
            // CU-01: Usuarios y Roles
            Route::get('/usuarios', [UsuarioController::class, 'index'])->name('usuarios.index');
            Route::get('/usuarios/crear', [UsuarioController::class, 'create'])->name('usuarios.create');
            Route::post('/usuarios', [UsuarioController::class, 'store'])->name('usuarios.store');
            Route::get('/usuarios/{id}/editar', [UsuarioController::class, 'edit'])->name('usuarios.edit');
            Route::put('/usuarios/{id}', [UsuarioController::class, 'update'])->name('usuarios.update');
            Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy'])->name('usuarios.destroy');

            // CU-02: Información Institucional y Redes Sociales
            Route::get('/institucional', [InstitucionalController::class, 'index'])->name('institucional.index');
            Route::put('/institucional/pagina/{id}', [InstitucionalController::class, 'updatePagina'])->name('institucional.pagina.update');
            Route::post('/institucional/redes', [InstitucionalController::class, 'storeRed'])->name('institucional.redes.store');
            Route::put('/institucional/redes/{id}', [InstitucionalController::class, 'updateRed'])->name('institucional.redes.update');
            Route::delete('/institucional/redes/{id}', [InstitucionalController::class, 'destroyRed'])->name('institucional.redes.destroy');
        });
    });
});
