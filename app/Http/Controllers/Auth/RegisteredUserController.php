<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

/**
 * Controlador de Registro Público (Inhabilitado en FEDER).
 * El registro de personal se gestiona de forma centralizada en /admin/usuarios (CU-01).
 */
class RegisteredUserController extends Controller
{
    /**
     * Redirige al login institucional al estar inhabilitado el auto-registro.
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('login');
    }
}
