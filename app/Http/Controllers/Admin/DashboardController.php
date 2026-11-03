<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador de Panel Administrativo Central (CU-01)
 */
class DashboardController extends Controller
{
    /**
     * Muestra el resumen principal del panel administrativo con auditoría reciente.
     */
    public function index(Request $request): Response
    {
        $usuario = $request->user();

        $stats = [
            'total_usuarios'  => Usuario::count(),
            'usuarios_activos' => Usuario::where('estado', 'Activo')->count(),
            'total_roles'     => Rol::count(),
            'total_auditorias'=> Auditoria::count(),
        ];

        $ultimasAuditorias = Auditoria::with('usuario:id_usuario,nombre_completo,correo_electronico')
            ->orderBy('fecha_hora', 'desc')
            ->take(6)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'             => $stats,
            'ultimasAuditorias' => $ultimasAuditorias,
        ]);
    }
}

