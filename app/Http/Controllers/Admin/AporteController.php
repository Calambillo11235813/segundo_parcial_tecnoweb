<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Aporte;
use App\Models\Auditoria;
use App\Models\Campana;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Administrativo de Aportes y Donaciones (CU-06, RF-11).
 * Exclusivo para roles Director y Secretaria.
 */
class AporteController extends Controller
{
    /**
     * Muestra la bandeja de gestión y verificación de aportes económicos.
     */
    public function index(Request $request): Response
    {
        $query = Aporte::with(['campana.comunidad'])
            ->orderBy('fecha_registro', 'desc');

        if ($request->filled('buscar')) {
            $term = '%' . trim($request->input('buscar')) . '%';
            $query->where(function ($q) use ($term) {
                $q->where('nombre_donante', 'ilike', $term)
                  ->orWhere('correo_donante', 'ilike', $term)
                  ->orWhereHas('campana', fn ($c) => $c->where('titulo', 'ilike', $term));
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        if ($request->filled('modalidad')) {
            $query->where('modalidad', $request->input('modalidad'));
        }

        if ($request->filled('campana_id')) {
            $query->where('campana_id', $request->input('campana_id'));
        }

        $aportes = $query->paginate(10)->withQueryString();

        $metricas = [
            'total_aportes'     => Aporte::count(),
            'total_recaudado'   => (float) Aporte::where('estado', Aporte::ESTADO_CONFIRMADO)->sum('monto'),
            'total_pendiente'   => (float) Aporte::where('estado', Aporte::ESTADO_PENDIENTE)->sum('monto'),
            'pendientes_count'  => Aporte::where('estado', Aporte::ESTADO_PENDIENTE)->count(),
            'confirmados_count' => Aporte::where('estado', Aporte::ESTADO_CONFIRMADO)->count(),
            'rechazados_count'  => Aporte::where('estado', Aporte::ESTADO_RECHAZADO)->count(),
        ];

        $campanasLista = Campana::select('id_campana', 'titulo')->orderBy('titulo')->get();

        return Inertia::render('Admin/Aportes/Index', [
            'aportes'       => $aportes,
            'filtros'       => $request->only(['buscar', 'estado', 'modalidad', 'campana_id']),
            'metricas'      => $metricas,
            'modalidades'   => Aporte::MODALIDADES,
            'campanasLista' => $campanasLista,
        ]);
    }

    /**
     * Confirma un aporte monetario e impacta el saldo de la campaña (CU-05, CU-06, RF-10).
     */
    public function confirmar(int $id): RedirectResponse
    {
        $aporte = Aporte::with('campana')->findOrFail($id);

        $aporte->estado = Aporte::ESTADO_CONFIRMADO;
        $aporte->save();

        // Recalcula el monto recaudado de la campaña con base en aportes confirmados
        if ($aporte->campana) {
            $aporte->campana->recalcularRecaudacion();
        }

        Auditoria::registrar(
            "Confirmar Aporte #{$aporte->id_aporte} por Bs. {$aporte->monto}",
            'aporte'
        );

        return redirect()->back()->with('success', "Aporte #{$aporte->codigo_comprobante} confirmado con éxito. Se sumó a la campaña.");
    }

    /**
     * Rechaza o anula un aporte monetario y ajusta el saldo de la campaña.
     */
    public function rechazar(int $id): RedirectResponse
    {
        $aporte = Aporte::with('campana')->findOrFail($id);

        $aporte->estado = Aporte::ESTADO_RECHAZADO;
        $aporte->save();

        if ($aporte->campana) {
            $aporte->campana->recalcularRecaudacion();
        }

        Auditoria::registrar(
            "Rechazar Aporte #{$aporte->id_aporte} por Bs. {$aporte->monto}",
            'aporte'
        );

        return redirect()->back()->with('success', "Aporte #{$aporte->codigo_comprobante} marcado como Rechazado.");
    }
}

