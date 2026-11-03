<?php

namespace App\Http\Middleware;

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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
