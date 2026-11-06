<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo Eloquent para Programas Productivos y de Asistencia Técnica (CU-04, RF-06).
 * Esquema físico: feder.programa_productivo
 */
class ProgramaProductivo extends Model
{
    protected $table = 'feder.programa_productivo';
    protected $primaryKey = 'id_programa';
    public $timestamps = false;

    /**
     * Rubros productivos sugeridos para la Chiquitanía (catálogo de referencia).
     */
    public const AREAS_PRODUCTIVAS = [
        'Aceites Naturales',
        'Jabonería Artesanal',
        'Harinas y Derivados',
        'Artesanía y Textiles',
        'Apicultura',
        'Agroforestería',
        'Turismo Comunitario',
    ];

    protected $fillable = [
        'nombre',
        'descripcion',
        'area_productiva',
        'poblacion_beneficiaria',
        'comunidad_id',
    ];

    /**
     * Comunidad donde se ejecuta el programa.
     */
    public function comunidad(): BelongsTo
    {
        return $this->belongsTo(Comunidad::class, 'comunidad_id', 'id_comunidad');
    }
}

