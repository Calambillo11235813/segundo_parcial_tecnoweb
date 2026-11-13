<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Aporte;
use App\Models\Auditoria;
use App\Models\Campana;
use App\Models\Comunidad;
use App\Models\Consulta;
use App\Models\ProgramaProductivo;
use App\Services\ReporteRecaudacionPdfService;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador de Reportes Ejecutivos y Estadísticas Consolidadas (CU-08, RF-17).
 * Acceso exclusivo para el Director de la Fundación FEDER.
 */
class ReporteController extends Controller
{
    /**
     * Proyecta el tablero interactivo de reportes y estadísticas según parámetros de consulta.
     */
    public function index(Request $request): Response
    {
        $datos = $this->procesarEstadisticas($request);

        return Inertia::render('Admin/Reportes/Index', [
            ...$datos,
            'filtros'          => $request->only(['comunidad_id', 'campana_id', 'fecha_desde', 'fecha_hasta']),
            'comunidadesLista' => Comunidad::select('id_comunidad', 'nombre')->orderBy('nombre')->get(),
            'campanasLista'    => Campana::select('id_campana', 'titulo', 'comunidad_id')->orderBy('titulo')->get(),
        ]);
    }

    /**
     * Genera y descarga el reporte estadístico consolidado en formato PDF (RF-17).
     */
    public function exportarRecaudacionPdf(Request $request, ReporteRecaudacionPdfService $pdfService): HttpResponse
    {
        $datos = $this->procesarEstadisticas($request);

        $pdfBinario = $pdfService->generar(
            $datos['resumenFinanciero'],
            $datos['campanasBalance'],
            $datos['aportesPorModalidad'],
            $datos['consultasStats'],
            $request->only(['comunidad_id', 'campana_id', 'fecha_desde', 'fecha_hasta'])
        );

        Auditoria::registrar('Exportar Reporte Estadístico Consolidado PDF', 'campana');

        $nombreArchivo = 'reporte_consolidado_feder_' . now()->format('Ymd_His') . '.pdf';

        return response($pdfBinario, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $nombreArchivo . '"',
        ]);
    }

    /**
     * Calcula los balances comparativos de recaudación, aportes, consultas y cobertura rural.
     */
    private function procesarEstadisticas(Request $request): array
    {
        $campanasQuery = Campana::with('comunidad:id_comunidad,nombre,ubicacion')
            ->withCount([
                'aportes as aportes_confirmados_count' => fn ($q) => $q->where('estado', Aporte::ESTADO_CONFIRMADO),
                'aportes as aportes_pendientes_count'  => fn ($q) => $q->where('estado', Aporte::ESTADO_PENDIENTE),
            ]);

        if ($request->filled('comunidad_id')) {
            $campanasQuery->where('comunidad_id', $request->input('comunidad_id'));
        }
        if ($request->filled('campana_id')) {
            $campanasQuery->where('id_campana', $request->input('campana_id'));
        }
        if ($request->filled('fecha_desde')) {
            $campanasQuery->whereDate('fecha_inicio', '>=', $request->input('fecha_desde'));
        }
        if ($request->filled('fecha_hasta')) {
            $campanasQuery->whereDate('fecha_inicio', '<=', $request->input('fecha_hasta'));
        }

        $campanas = $campanasQuery->orderByDesc('monto_recaudado')->get()->map(function ($c) {
            $c->porcentaje = $c->porcentaje;
            $c->dias_restantes = $c->dias_restantes;
            return $c;
        });

        $campanaIds = $campanas->pluck('id_campana');

        // Consulta de aportes vinculada a las campañas filtradas y rango de fechas
        $aportesQuery = Aporte::whereIn('campana_id', $campanaIds);
        if ($request->filled('fecha_desde')) {
            $aportesQuery->whereDate('fecha_registro', '>=', $request->input('fecha_desde'));
        }
        if ($request->filled('fecha_hasta')) {
            $aportesQuery->whereDate('fecha_registro', '<=', $request->input('fecha_hasta'));
        }

        $metaTotal = (float) $campanas->sum('meta_economica');
        $recaudadoTotal = (float) $campanas->sum('monto_recaudado');
        $efectividadGlobal = $metaTotal > 0 ? (int) min(100, round(($recaudadoTotal / $metaTotal) * 100)) : 0;

        $aportesConfirmados = (clone $aportesQuery)->where('estado', Aporte::ESTADO_CONFIRMADO)->count();
        $aportesPendientes = (clone $aportesQuery)->where('estado', Aporte::ESTADO_PENDIENTE)->count();
        $montoPendiente = (float) (clone $aportesQuery)->where('estado', Aporte::ESTADO_PENDIENTE)->sum('monto');

        $aportesPorModalidad = collect(Aporte::MODALIDADES)->map(function ($mod) use ($aportesQuery) {
            $q = (clone $aportesQuery)->where('estado', Aporte::ESTADO_CONFIRMADO)->where('modalidad', $mod);
            return [
                'modalidad'   => $mod,
                'cantidad'    => $q->count(),
                'monto_total' => (float) $q->sum('monto'),
            ];
        })->values()->all();

        // Estadísticas de Consultas Ciudadanas (filtradas por fecha si aplica)
        $consultasQuery = Consulta::query();
        if ($request->filled('fecha_desde')) {
            $consultasQuery->whereDate('fecha_envio', '>=', $request->input('fecha_desde'));
        }
        if ($request->filled('fecha_hasta')) {
            $consultasQuery->whereDate('fecha_envio', '<=', $request->input('fecha_hasta'));
        }

        $totalConsultas = (clone $consultasQuery)->count();
        $atendidas = (clone $consultasQuery)->where('estado', Consulta::ESTADO_ATENDIDO)->count();

        $consultasStats = [
            'total'         => $totalConsultas,
            'pendientes'    => (clone $consultasQuery)->where('estado', Consulta::ESTADO_PENDIENTE)->count(),
            'en_proceso'    => (clone $consultasQuery)->where('estado', Consulta::ESTADO_EN_PROCESO)->count(),
            'atendidos'     => $atendidas,
            'tasa_atencion' => $totalConsultas > 0 ? (int) round(($atendidas / $totalConsultas) * 100) : 0,
        ];

        // Cobertura Comunitaria
        $coberturaComunidades = Comunidad::withCount(['programas', 'campanas', 'testimonios'])
            ->when($request->filled('comunidad_id'), fn ($q) => $q->where('id_comunidad', $request->input('comunidad_id')))
            ->orderByDesc('programas_count')
            ->get();

        return [
            'resumenFinanciero' => [
                'meta_total'          => $metaTotal,
                'recaudado_total'     => $recaudadoTotal,
                'efectividad_global'  => $efectividadGlobal,
                'campanas_analizadas' => $campanas->count(),
                'metas_logradas'      => $campanas->filter(fn ($c) => (float) $c->monto_recaudado >= (float) $c->meta_economica)->count(),
                'aportes_confirmados' => $aportesConfirmados,
                'aportes_pendientes'  => $aportesPendientes,
                'monto_pendiente'     => $montoPendiente,
                'total_comunidades'   => Comunidad::count(),
                'total_programas'     => ProgramaProductivo::count(),
            ],
            'campanasBalance'      => $campanas->values(),
            'aportesPorModalidad'  => $aportesPorModalidad,
            'consultasStats'       => $consultasStats,
            'coberturaComunidades' => $coberturaComunidades,
        ];
    }
}

