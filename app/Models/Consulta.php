<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Eloquent para Consultas Ciudadanas y Mensajes de Contacto (CU-07, RF-16).
 * Esquema físico: feder.consulta
 */
class Consulta extends Model
{
    use HasFactory;

    public const ESTADO_PENDIENTE = 'Pendiente';
    public const ESTADO_EN_PROCESO = 'En Proceso';
    public const ESTADO_ATENDIDO = 'Atendido';

    public const ESTADOS = [
        self::ESTADO_PENDIENTE,
        self::ESTADO_EN_PROCESO,
        self::ESTADO_ATENDIDO,
    ];

    protected $table = 'feder.consulta';
    protected $primaryKey = 'id_consulta';
    public $timestamps = false;

    protected $fillable = [
        'nombre_remitente',
        'correo_remitente',
        'asunto',
        'mensaje',
        'fecha_envio',
        'estado',
        'usuario_id',
    ];

    protected $casts = [
        'fecha_envio' => 'datetime',
    ];

    /**
     * Usuario administrativo (Director o Secretaria) que gestionó o atendió la consulta.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }
}

