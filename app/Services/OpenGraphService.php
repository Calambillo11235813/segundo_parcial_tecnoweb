<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

/**
 * Servicio para preparar las etiquetas Open Graph (vista previa al compartir en redes sociales).
 * Se generan en el servidor porque el lector de Facebook no ejecuta JavaScript.
 * Todas las direcciones se construyen a partir de APP_URL.
 */
class OpenGraphService
{
    private const TITULO_DEFECTO = 'Fundación FEDER';
    private const TEXTO_DEFECTO = 'Portal de Fundación FEDER: noticias, comunidades, programas productivos y campañas solidarias.';
    private const IMAGEN_DEFECTO = '/images/og-feder.jpg';
    private const LARGO_RESUMEN = 150;

    /**
     * Datos generales del portal para las páginas sin contenido propio.
     *
     * @return array<string, mixed>
     */
    public static function porDefecto(): array
    {
        return self::construir(self::TITULO_DEFECTO, self::TEXTO_DEFECTO, request()->path());
    }

    /**
     * Arma el conjunto de datos Open Graph de una página.
     *
     * @return array<string, mixed>
     */
    public static function construir(
        string $titulo,
        ?string $texto,
        string $ruta,
        ?string $imagen = null,
        string $tipo = 'website'
    ): array {
        $url = self::urlAbsoluta($ruta);

        return [
            'titulo'      => $titulo,
            'descripcion' => self::descripcion($texto, $url),
            'url'         => $url,
            'tipo'        => $tipo,
            ...self::imagen($imagen),
        ];
    }

    /**
     * Descripción breve seguida del enlace de la página.
     */
    private static function descripcion(?string $texto, string $url): string
    {
        $breve = self::resumir($texto);
        $invitacion = "Para más información ingresar a {$url}";

        if ($breve === '') {
            return $invitacion;
        }

        if (!preg_match('/[.!?…]$/u', $breve)) {
            $breve .= '.';
        }

        return "{$breve} {$invitacion}";
    }

    /**
     * Quita el HTML y los saltos de línea, y recorta sin partir palabras.
     */
    private static function resumir(?string $texto): string
    {
        $limpio = preg_replace('/<\/?[a-z!][^>]*>/i', ' ', (string) $texto);
        $limpio = html_entity_decode((string) $limpio, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $limpio = trim((string) preg_replace('/[\s\x{00A0}]+/u', ' ', $limpio));

        if (mb_strlen($limpio) <= self::LARGO_RESUMEN) {
            return $limpio;
        }

        $corte = mb_substr($limpio, 0, self::LARGO_RESUMEN - 3);
        $ultimoEspacio = mb_strrpos($corte, ' ');

        if ($ultimoEspacio !== false) {
            $corte = mb_substr($corte, 0, $ultimoEspacio);
        }

        return preg_replace('/[\s.,;:]+$/u', '', $corte) . '...';
    }

    /**
     * Dirección absoluta de la imagen y sus medidas.
     * Las imágenes externas se usan tal cual, sin medidas para no descargarlas en cada visita.
     *
     * @return array{imagen: string, imagen_ancho: int|null, imagen_alto: int|null}
     */
    private static function imagen(?string $imagen): array
    {
        $imagen = trim((string) $imagen);

        if (preg_match('/^https?:\/\//i', $imagen)) {
            return ['imagen' => $imagen, 'imagen_ancho' => null, 'imagen_alto' => null];
        }

        $medidas = $imagen !== '' ? self::medidas($imagen) : null;

        // Sin imagen, o archivo local inexistente: se usa el logo de FEDER
        if (!$medidas) {
            $imagen = self::IMAGEN_DEFECTO;
            $medidas = self::medidas($imagen);
        }

        return [
            'imagen'       => self::urlAbsoluta($imagen),
            'imagen_ancho' => $medidas[0] ?? null,
            'imagen_alto'  => $medidas[1] ?? null,
        ];
    }

    /**
     * Lee ancho y alto de una imagen guardada en el servidor.
     *
     * @return array<int|string, mixed>|null
     */
    private static function medidas(string $ruta): ?array
    {
        $archivo = str_starts_with($ruta, '/storage/')
            ? Storage::disk('public')->path(substr($ruta, strlen('/storage/')))
            : public_path(ltrim($ruta, '/'));

        if (!is_file($archivo)) {
            return null;
        }

        return @getimagesize($archivo) ?: null;
    }

    /**
     * Convierte una ruta del portal en una dirección completa usando APP_URL.
     */
    private static function urlAbsoluta(string $ruta): string
    {
        return rtrim((string) config('app.url'), '/') . '/' . ltrim($ruta, '/');
    }
}
