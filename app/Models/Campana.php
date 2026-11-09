<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo Eloquent para Campañas de Recaudación / Crowdfunding (CU-05, RF-09, RF-10).
 * Esquema físico: feder.campana
 */
class Campana extends Model
{
    use HasFactory;

    protected $table = 'feder.campana';
    protected $primaryKey = 'id_campana';
    public $timestamps = false;

    protected $fillable = [
        'titulo',
        'descripcion',
        'meta_economica',
        'monto_recaudado',
        'fecha_inicio',
        'fecha_limite',
        'estado',
        'comunidad_id',
    ];

    protected $casts = [
        'meta_economica'  => 'decimal:2',
        'monto_recaudado' => 'decimal:2',
        'fecha_inicio'    => 'date',
        'fecha_limite'    => 'date',
    ];

    /**
     * Comunidad beneficiaria de la campaña comunitaria.
     */
    public function comunidad(): BelongsTo
    {
        return $this->belongsTo(Comunidad::class, 'comunidad_id', 'id_comunidad');
    }

    /**
     * Aportes y compromisos registrados para esta campaña.
     */
    public function aportes(): HasMany
    {
        return $this->hasMany(Aporte::class, 'campana_id', 'id_campana');
    }

    /**
     * Calcula el porcentaje de avance respecto a la meta económica.
     */
    public function getPorcentajeAttribute(): int
    {
        $meta = (float) $this->meta_economica;
        if ($meta <= 0) {
            return 0;
        }
        return (int) min(100, round(((float) $this->monto_recaudado / $meta) * 100));
    }

    /**
     * Calcula los días restantes antes de la fecha límite.
     */
    public function getDiasRestantesAttribute(): int
    {
        if (!$this->fecha_limite) {
            return 0;
        }
        $hoy = now()->startOfDay();
        $limite = $this->fecha_limite->startOfDay();
        return (int) $hoy->diffInDays($limite, false);
    }

    /**
     * Recalcula el monto recaudado consolidando exclusivamente los aportes confirmados (RF-10, CU-06).
     */
    public function recalcularRecaudacion(): void
    {
        $totalConfirmado = (float) $this->aportes()
            ->where('estado', 'Confirmado')
            ->sum('monto');

        $this->monto_recaudado = $totalConfirmado;
        $this->save();
    }
}

