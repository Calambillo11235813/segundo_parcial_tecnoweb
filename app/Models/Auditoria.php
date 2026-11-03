<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Auditoria (CU-01)
 * Registra trazas de operaciones críticas en feder.auditoria.
 */
class Auditoria extends Model
{
    protected $table = 'feder.auditoria';
    protected $primaryKey = 'id_auditoria';
    public $timestamps = false;

    protected $fillable = [
        'accion_realizada',
        'tabla_afectada',
        'fecha_hora',
        'usuario_id',
    ];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    /**
     * Usuario autor de la acción auditada.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }

    /**
     * Registra un evento de auditoría de forma rápida.
     */
    public static function registrar(string $accion, string $tabla, ?int $usuarioId = null): self
    {
        return self::create([
            'accion_realizada' => $accion,
            'tabla_afectada'   => $tabla,
            'fecha_hora'       => now(),
            'usuario_id'       => $usuarioId ?? auth()->id() ?? 1,
        ]);
    }
}

