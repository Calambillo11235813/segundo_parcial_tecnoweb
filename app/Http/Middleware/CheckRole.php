<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware CheckRole (CU-01)
 * Control de acceso basado en roles jerárquicos (Director, Secretaria, Instructor).
 */
class CheckRole
{
    /**
     * Maneja una solicitud entrante y verifica los roles requeridos.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->hasRole($roles)) {
            if ($request->wantsJson()) {
                abort(403, 'Acceso denegado: No cuenta con permisos para este recurso.');
            }

            return redirect()->route('admin.dashboard')->with('error', 'Acceso denegado: Se requiere rol ' . implode(' o ', $roles) . ' para acceder a este módulo.');
        }

        return $next($request);
    }
}
