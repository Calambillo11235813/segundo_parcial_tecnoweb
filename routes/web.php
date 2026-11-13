<?php

use App\Http\Controllers\Admin\AporteController;
use App\Http\Controllers\Admin\CampanaController;
use App\Http\Controllers\Admin\ComunidadController;
use App\Http\Controllers\Admin\ConsultaController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GaleriaController;
use App\Http\Controllers\Admin\InstitucionalController;
use App\Http\Controllers\Admin\NoticiaController;
use App\Http\Controllers\Admin\ProgramaController;
use App\Http\Controllers\Admin\ReporteController;
use App\Http\Controllers\Admin\TestimonioController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Public\PublicAporteController;
use App\Http\Controllers\Public\PublicCampanaController;
use App\Http\Controllers\Public\PublicComunidadController;
use App\Http\Controllers\Public\PublicConsultaController;
use App\Http\Controllers\Public\PublicNoticiaController;
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
Route::get('/noticias', [PublicNoticiaController::class, 'index'])->name('public.noticias.index');
Route::get('/noticias/{id}', [PublicNoticiaController::class, 'show'])->name('public.noticias.show');
Route::get('/comunidades', [PublicComunidadController::class, 'index'])->name('public.comunidades.index');
Route::get('/comunidades/{id}', [PublicComunidadController::class, 'show'])->name('public.comunidades.show');
Route::get('/campanas', [PublicCampanaController::class, 'index'])->name('public.campanas.index');
Route::get('/campanas/{id}', [PublicCampanaController::class, 'show'])->name('public.campanas.show');
Route::get('/campanas/{id}/ficha-pdf', [PublicCampanaController::class, 'descargarFichaPdf'])->name('public.campanas.pdf');
Route::get('/campanas/{id}/donar', [PublicAporteController::class, 'create'])->name('public.donaciones.create');
Route::post('/campanas/{id}/donar', [PublicAporteController::class, 'store'])->name('public.donaciones.store');
Route::get('/donaciones/{id}/comprobante', [PublicAporteController::class, 'comprobante'])->name('public.donaciones.comprobante');
Route::get('/contacto', [PublicConsultaController::class, 'create'])->name('public.contacto.index');
Route::post('/contacto', [PublicConsultaController::class, 'store'])->name('public.contacto.store');

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

            // CU-05: Campañas de Recaudación (Crowdfunding - Exclusivo Director)
            Route::get('/campanas', [CampanaController::class, 'index'])->name('campanas.index');
            Route::get('/campanas/crear', [CampanaController::class, 'create'])->name('campanas.create');
            Route::post('/campanas', [CampanaController::class, 'store'])->name('campanas.store');
            Route::get('/campanas/{id}/editar', [CampanaController::class, 'edit'])->name('campanas.edit');
            Route::put('/campanas/{id}', [CampanaController::class, 'update'])->name('campanas.update');
            Route::patch('/campanas/{id}/cerrar', [CampanaController::class, 'cerrar'])->name('campanas.cerrar');

            // CU-08: Reportes Estadísticos y Exportación PDF (Exclusivo Director)
            Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
            Route::get('/reportes/recaudacion-pdf', [ReporteController::class, 'exportarRecaudacionPdf'])->name('reportes.pdf');
        });

        // CU-03: Publicaciones, Galerías y Testimonios (Director e Instructor)
        Route::middleware('role:Director,Instructor')->group(function () {
            // Gestión de Noticias
            Route::get('/noticias', [NoticiaController::class, 'index'])->name('noticias.index');
            Route::get('/noticias/crear', [NoticiaController::class, 'create'])->name('noticias.create');
            Route::post('/noticias', [NoticiaController::class, 'store'])->name('noticias.store');
            Route::get('/noticias/{id}/editar', [NoticiaController::class, 'edit'])->name('noticias.edit');
            Route::put('/noticias/{id}', [NoticiaController::class, 'update'])->name('noticias.update');
            Route::delete('/noticias/{id}', [NoticiaController::class, 'destroy'])->name('noticias.destroy');

            // Galería Multimedia asociada a Noticias
            Route::post('/noticias/{id}/galeria', [GaleriaController::class, 'store'])->name('noticias.galeria.store');
            Route::delete('/galeria/{id}', [GaleriaController::class, 'destroy'])->name('galeria.destroy');

            // Gestión de Testimonios Comunitarios
            Route::get('/testimonios', [TestimonioController::class, 'index'])->name('testimonios.index');
            Route::post('/testimonios', [TestimonioController::class, 'store'])->name('testimonios.store');
            Route::put('/testimonios/{id}', [TestimonioController::class, 'update'])->name('testimonios.update');
            Route::delete('/testimonios/{id}', [TestimonioController::class, 'destroy'])->name('testimonios.destroy');

            // CU-04: Comunidades Beneficiarias y Programas Productivos
            Route::get('/comunidades', [ComunidadController::class, 'index'])->name('comunidades.index');
            Route::post('/comunidades', [ComunidadController::class, 'store'])->name('comunidades.store');
            Route::put('/comunidades/{id}', [ComunidadController::class, 'update'])->name('comunidades.update');
            Route::delete('/comunidades/{id}', [ComunidadController::class, 'destroy'])->name('comunidades.destroy');
            Route::post('/comunidades/{id}/programas', [ProgramaController::class, 'store'])->name('programas.store');
            Route::put('/programas/{id}', [ProgramaController::class, 'update'])->name('programas.update');
            Route::delete('/programas/{id}', [ProgramaController::class, 'destroy'])->name('programas.destroy');
        });

        // CU-06 y CU-07: Gestión de Aportes y Bandeja de Consultas (Director y Secretaria)
        Route::middleware('role:Director,Secretaria')->group(function () {
            Route::get('/aportes', [AporteController::class, 'index'])->name('aportes.index');
            Route::patch('/aportes/{id}/confirmar', [AporteController::class, 'confirmar'])->name('aportes.confirmar');
            Route::patch('/aportes/{id}/rechazar', [AporteController::class, 'rechazar'])->name('aportes.rechazar');

            Route::get('/consultas', [ConsultaController::class, 'index'])->name('consultas.index');
            Route::get('/consultas/{id}', [ConsultaController::class, 'show'])->name('consultas.show');
            Route::post('/consultas/{id}/responder', [ConsultaController::class, 'responder'])->name('consultas.responder');
            Route::patch('/consultas/{id}/estado', [ConsultaController::class, 'cambiarEstado'])->name('consultas.cambiarEstado');
        });
    });
});
