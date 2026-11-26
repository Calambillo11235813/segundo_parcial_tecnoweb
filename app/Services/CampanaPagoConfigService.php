<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Gestiona la configuración personalizada de pagos (QR y cuenta bancaria)
 * por campaña sin alterar el esquema físico feder.campana.
 */
class CampanaPagoConfigService
{
    private const CONFIG_PATH = 'campanas_pagos.json';

    public const DEFAULTS = [
        'banco'              => '',
        'numero_cuenta'      => '',
        'titular'            => '',
        'nit_ci'             => '',
        'direccion_efectivo' => 'San Joaquín 2052, Santa Cruz (Horario 08:30 - 16:30)',
        'qr_imagen'          => null,
        'video_youtube'      => '',
        'destino_fondos'     => '',
    ];

    /**
     * Obtiene la configuración de pago de una campaña específica.
     *
     * @return array<string, mixed>
     */
    public static function get(int $campanaId): array
    {
        $all = self::readAll();
        $saved = $all[(string) $campanaId] ?? [];

        return array_merge(self::DEFAULTS, is_array($saved) ? $saved : []);
    }

    /**
     * Guarda o actualiza la configuración de pago de una campaña.
     *
     * @param  array<string, mixed>  $datos
     */
    public static function save(
        int $campanaId,
        array $datos,
        ?UploadedFile $qrArchivo = null,
        bool $eliminarQr = false
    ): array {
        $all = self::readAll();
        $actual = self::get($campanaId);

        $qrUrl = $actual['qr_imagen'];

        if ($eliminarQr && $qrUrl) {
            self::deleteQrFile($qrUrl);
            $qrUrl = null;
        }

        if ($qrArchivo) {
            if ($qrUrl) {
                self::deleteQrFile($qrUrl);
            }
            $path = $qrArchivo->store('campanas/qr', 'public');
            $qrUrl = '/storage/' . $path;
        }

        $nuevo = [
            'banco'              => trim((string) ($datos['pago_banco'] ?? $actual['banco'] ?? '')),
            'numero_cuenta'      => trim((string) ($datos['pago_numero_cuenta'] ?? $actual['numero_cuenta'] ?? '')),
            'titular'            => trim((string) ($datos['pago_titular'] ?? $actual['titular'] ?? '')),
            'nit_ci'             => trim((string) ($datos['pago_nit_ci'] ?? $actual['nit_ci'] ?? '')),
            'direccion_efectivo' => trim((string) ($datos['pago_direccion_efectivo'] ?? $actual['direccion_efectivo'] ?? '')),
            'qr_imagen'          => $qrUrl,
            'video_youtube'      => trim((string) ($datos['video_youtube'] ?? $actual['video_youtube'] ?? '')),
            'destino_fondos'     => trim((string) ($datos['destino_fondos'] ?? $actual['destino_fondos'] ?? '')),
        ];

        $all[(string) $campanaId] = $nuevo;
        self::writeAll($all);

        return $nuevo;
    }

    /**
     * Elimina la configuración de pago y la imagen QR asociada a una campaña.
     */
    public static function delete(int $campanaId): void
    {
        $all = self::readAll();
        $key = (string) $campanaId;

        if (!isset($all[$key])) {
            return;
        }

        $qrUrl = $all[$key]['qr_imagen'] ?? null;
        if (is_string($qrUrl) && $qrUrl !== '') {
            self::deleteQrFile($qrUrl);
        }

        unset($all[$key]);
        self::writeAll($all);
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private static function readAll(): array
    {
        if (!Storage::disk('local')->exists(self::CONFIG_PATH)) {
            return [];
        }

        $raw = Storage::disk('local')->get(self::CONFIG_PATH);
        $decoded = json_decode($raw ?: '{}', true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param  array<string, array<string, mixed>>  $all
     */
    private static function writeAll(array $all): void
    {
        Storage::disk('local')->put(
            self::CONFIG_PATH,
            json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        );
    }

    private static function deleteQrFile(string $qrUrl): void
    {
        if (str_starts_with($qrUrl, '/storage/')) {
            $relativo = str_replace('/storage/', '', $qrUrl);
            Storage::disk('public')->delete($relativo);
        }
    }
}
