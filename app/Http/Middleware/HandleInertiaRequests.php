<?php

namespace App\Http\Middleware;

use App\Services\VisitaSitioService;
use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * Middleware para configurar las propiedades globales de Inertia.js (CU-01).
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * Plantilla raíz de Blade que se carga en la primera visita.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determina la versión actual de los activos compilados.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define las propiedades compartidas por defecto a todas las vistas de Inertia.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            $user->loadMissing('rol');
        }

        $esRutaPublica = $request->isMethod('GET')
            && !$request->is('admin', 'admin/*', 'login', 'logout');

        $visitasSitio = ($esRutaPublica && !$request->header('X-Inertia'))
            ? VisitaSitioService::registrarVisita()
            : VisitaSitioService::obtenerTotal();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'visitas_sitio' => $visitasSitio,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
