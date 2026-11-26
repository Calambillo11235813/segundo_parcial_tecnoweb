<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

/**
 * Modelo Eloquent para Comunidades Beneficiarias (CU-03 y CU-04).
 * Esquema físico: feder.comunidad
 */
class Comunidad extends Model
{
    use HasFactory;

    protected $table = 'feder.comunidad';
    protected $primaryKey = 'id_comunidad';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'estado',
        'usuario_id',
    ];

    protected $appends = ['mapa_url'];

    private const MAPAS_CONFIG_PATH = 'comunidades_mapas.json';

    /**
     * Enlace de Google Maps o coordenadas geográficas configuradas para la comunidad.
     */
    public function getMapaUrlAttribute(): string
    {
        if (!$this->id_comunidad || !Storage::disk('local')->exists(self::MAPAS_CONFIG_PATH)) {
            return '';
        }

        $decoded = json_decode(Storage::disk('local')->get(self::MAPAS_CONFIG_PATH) ?: '{}', true);

        return is_array($decoded) ? (string) ($decoded[(string) $this->id_comunidad] ?? '') : '';
    }

    /**
     * Guarda el enlace de Google Maps o coordenadas de la comunidad.
     */
    public static function guardarMapaUrl(int $comunidadId, ?string $mapaUrl): void
    {
        $all = [];
        if (Storage::disk('local')->exists(self::MAPAS_CONFIG_PATH)) {
            $decoded = json_decode(Storage::disk('local')->get(self::MAPAS_CONFIG_PATH) ?: '{}', true);
            if (is_array($decoded)) {
                $all = $decoded;
            }
        }

        $limpio = trim((string) $mapaUrl);
        if ($limpio === '') {
            unset($all[(string) $comunidadId]);
        } else {
            $all[(string) $comunidadId] = $limpio;
        }

        Storage::disk('local')->put(
            self::MAPAS_CONFIG_PATH,
            json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }

    /**
     * Relación con el usuario registrador.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'id_usuario');
    }

    /**
     * Programas productivos ejecutados en esta comunidad (CU-04).
     */
    public function programas(): HasMany
    {
        return $this->hasMany(ProgramaProductivo::class, 'comunidad_id', 'id_comunidad');
    }

    /**
     * Campañas de recaudación asociadas a esta comunidad (CU-05).
     */
    public function campanas(): HasMany
    {
        return $this->hasMany(Campana::class, 'comunidad_id', 'id_comunidad');
    }

    /**
     * Testimonios asociados a esta comunidad.
     */
    public function testimonios(): HasMany
    {
        return $this->hasMany(Testimonio::class, 'comunidad_id', 'id_comunidad');
    }
}

