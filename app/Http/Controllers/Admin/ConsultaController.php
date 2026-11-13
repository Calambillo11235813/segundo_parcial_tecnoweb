<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResponderConsultaRequest;
use App\Mail\RespuestaConsultaMail;
use App\Models\Auditoria;
use App\Models\Consulta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controlador Administrativo de la Bandeja de Consultas Ciudadanas (CU-07, RF-16).
 * Accesible para los roles Director y Secretaria.
 */
class ConsultaController extends Controller
{
    /**
     * Muestra el listado clasificado de consultas con filtros y métricas de atención.
     */
    public function index(Request $request): Response
    {
        $this->inicializarConsultasBase();

        $query = Consulta::with('usuario:id_usuario,nombre_completo')
            ->orderByRaw("CASE WHEN estado = 'Pendiente' THEN 0 WHEN estado = 'En Proceso' THEN 1 ELSE 2 END")
            ->orderByDesc('fecha_envio');

        if ($request->filled('buscar')) {
            $term = '%' . trim($request->input('buscar')) . '%';
            $query->where(function ($q) use ($term) {
                $q->where('nombre_remitente', 'ilike', $term)
                  ->orWhere('correo_remitente', 'ilike', $term)
                  ->orWhere('asunto', 'ilike', $term)
                  ->orWhere('mensaje', 'ilike', $term);
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->input('estado'));
        }

        $consultas = $query->paginate(10)->withQueryString();

        $metricas = [
            'total'      => Consulta::count(),
            'pendientes' => Consulta::where('estado', Consulta::ESTADO_PENDIENTE)->count(),
            'en_proceso' => Consulta::where('estado', Consulta::ESTADO_EN_PROCESO)->count(),
            'atendidos'  => Consulta::where('estado', Consulta::ESTADO_ATENDIDO)->count(),
        ];

        return Inertia::render('Admin/Consultas/Index', [
            'consultas' => $consultas,
            'filtros'   => $request->only(['buscar', 'estado']),
            'metricas'  => $metricas,
            'estados'   => Consulta::ESTADOS,
        ]);
    }

    /**
     * Muestra el detalle completo de una consulta y el formulario de contestación.
     */
    public function show(int $id): Response
    {
        $consulta = Consulta::with('usuario:id_usuario,nombre_completo,correo_electronico')
            ->findOrFail($id);

        return Inertia::render('Admin/Consultas/Show', [
            'consulta' => $consulta,
            'estados'  => Consulta::ESTADOS,
        ]);
    }

    /**
     * Actualiza el estado de atención de una consulta (Pendiente, En Proceso, Atendido).
     */
    public function cambiarEstado(Request $request, int $id): RedirectResponse
    {
        $datos = $request->validate([
            'estado' => ['required', 'string', Rule::in(Consulta::ESTADOS)],
        ]);

        $consulta = Consulta::findOrFail($id);
        $consulta->estado = $datos['estado'];
        $consulta->usuario_id = auth()->id();
        $consulta->save();

        Auditoria::registrar(
            "Cambiar estado de Consulta #{$consulta->id_consulta} a {$consulta->estado}",
            'consulta'
        );

        return redirect()->back()->with('success', "Estado actualizado a '{$consulta->estado}'.");
    }

    /**
     * Despacha la respuesta oficial por correo electrónico (SMTP) y marca como Atendido.
     */
    public function responder(ResponderConsultaRequest $request, int $id): RedirectResponse
    {
        $consulta = Consulta::findOrFail($id);
        $respuestaTexto = trim($request->validated()['respuesta']);
        $responsable = auth()->user()?->nombre_completo ?? 'Administración FEDER';

        $enviadoSmtp = true;
        try {
            Mail::to($consulta->correo_remitente)->send(
                new RespuestaConsultaMail($consulta, $respuestaTexto, $responsable)
            );
        } catch (\Throwable $e) {
            $enviadoSmtp = false;
            Log::warning("No se pudo despachar correo SMTP a {$consulta->correo_remitente}: " . $e->getMessage());
        }

        $selloFecha = now()->format('d/m/Y H:i');
        $separador = "\n\n--- [RESPUESTA OFICIAL FEDER - {$selloFecha} por {$responsable}] ---\n";
        $consulta->mensaje = $consulta->mensaje . $separador . $respuestaTexto;
        $consulta->estado = Consulta::ESTADO_ATENDIDO;
        $consulta->usuario_id = auth()->id();
        $consulta->save();

        Auditoria::registrar(
            "Responder Consulta #{$consulta->id_consulta} a {$consulta->correo_remitente}",
            'consulta'
        );

        $aviso = $enviadoSmtp
            ? "Respuesta enviada por correo electrónico a {$consulta->correo_remitente} y marcada como Atendida."
            : "Respuesta registrada y consulta marcada como Atendida (el servidor SMTP local no está activo, se guardó en bitácora).";

        return redirect()
            ->route('admin.consultas.show', $consulta->id_consulta)
            ->with('success', $aviso);
    }

    /**
     * Semilla inicial de consultas ciudadanas si la tabla se encuentra vacía.
     */
    private function inicializarConsultasBase(): void
    {
        if (Consulta::count() > 0) {
            return;
        }

        Consulta::create([
            'nombre_remitente' => 'Fundación Cooperación Suiza',
            'correo_remitente' => 'cooperacion@helvetas-bo.org',
            'asunto'           => 'Alianza Estratégica / Cooperación Internacional',
            'mensaje'          => 'Estimado equipo de FEDER, deseamos conocer el portafolio de proyectos productivos en San Ignacio de Velasco para evaluar cofinanciamiento en la gestión 2026.',
            'fecha_envio'      => now()->subDays(2),
            'estado'           => Consulta::ESTADO_PENDIENTE,
        ]);

        Consulta::create([
            'nombre_remitente' => 'Carlos Alberto Méndez',
            'correo_remitente' => 'cmendez.scz@gmail.com',
            'asunto'           => 'Consultas sobre Donaciones y Crowdfunding',
            'mensaje'          => 'Buenas tardes, quisiera saber si emiten certificados de donación para empresas privadas que aporten mediante transferencia bancaria.',
            'fecha_envio'      => now()->subDay(),
            'estado'           => Consulta::ESTADO_EN_PROCESO,
        ]);
    }
}

