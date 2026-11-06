<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Eloquent para Aportes y Donaciones (CU-05 y CU-06).
 * Esquema físico: feder.aporte
 */
class Aporte extends Model
{
    use HasFactory;

    protected $table = 'feder.aporte';
    protected $primaryKey = 'id_aporte';
    public $timestamps = false;

    protected $fillable = [
        'nombre_donante',
        'correo_donante',
        'monto',
        'modalidad',
        'fecha_registro',
        'estado',
        'campana_id',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_registro' => 'datetime',
    ];

    /**
     * Campaña de financiamiento a la que se destina este aporte.
     */
    public function campana(): BelongsTo
    {
        return $this->belongsTo(Campana::class, 'campana_id', 'id_campana');
    }
}

