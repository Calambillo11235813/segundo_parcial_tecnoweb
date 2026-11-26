<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

/**
 * Servicio liviano para contabilizar y consultar las visitas públicas del sitio web.
 */
class VisitaSitioService
{
    private const FILE_PATH = 'visitas_sitio.json';

    /**
     * Incrementa en 1 el contador global de visitas con bloqueo de archivo.
     */
    public static function registrarVisita(): int
    {
        $fullPath = Storage::disk('local')->path(self::FILE_PATH);
        $dir = dirname($fullPath);

        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        $fp = @fopen($fullPath, 'c+');
        if (!$fp) {
            return self::obtenerTotal();
        }

        try {
            flock($fp, LOCK_EX);
            $raw = stream_get_contents($fp);
            $data = json_decode($raw ?: '{}', true);
            $total = is_array($data) && isset($data['total']) ? (int) $data['total'] : 0;
            $total++;

            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode([
                'total' => $total,
                'updated_at' => now()->toIso8601String(),
            ], JSON_PRETTY_PRINT));
            fflush($fp);

            return $total;
        } finally {
            flock($fp, LOCK_UN);
            fclose($fp);
        }
    }

    /**
     * Devuelve el total acumulado de visitas registradas.
     */
    public static function obtenerTotal(): int
    {
        if (!Storage::disk('local')->exists(self::FILE_PATH)) {
            return 0;
        }

        $decoded = json_decode(Storage::disk('local')->get(self::FILE_PATH) ?: '{}', true);

        return is_array($decoded) && isset($decoded['total']) ? (int) $decoded['total'] : 0;
    }
}
