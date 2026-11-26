<?php

namespace App\Services;

use App\Models\Aporte;
use Illuminate\Support\Facades\Storage;

/**
 * Servicio de Generación de Comprobante Digital de Aporte en PDF 1.4 (CU-06, RF-12).
 * Genera un recibo oficial de 1 página sin dependencias externas e incrusta el QR si existe.
 */
class ComprobanteAportePdfService
{
    /**
     * Genera el contenido binario del comprobante en PDF.
     */
    public function generar(Aporte $aporte): string
    {
        $aporte->loadMissing('campana.comunidad');

        $campana = $aporte->campana;
        $pago = $campana?->config_pago ?? [];

        $codigo = $this->sanearTexto($aporte->codigo_comprobante);
        $monto = 'Bs. ' . number_format((float) $aporte->monto, 2, '.', ',');
        $estado = $this->sanearTexto($aporte->estado ?? 'Pendiente de Confirmacion');
        $donante = $this->sanearTexto($aporte->es_anonimo ? 'Donante Anonimo (Privado)' : ($aporte->nombre_donante ?? 'Donante'));
        $correo = $this->sanearTexto($aporte->correo_donante ?? '');
        $tituloCampana = $this->sanearTexto($campana->titulo ?? 'Fondo de Desarrollo Rural');
        $comunidad = $this->sanearTexto($campana->comunidad->nombre ?? 'Chiquitania');
        $modalidad = $this->sanearTexto($aporte->modalidad ?? 'Transferencia bancaria');
        $fecha = $aporte->fecha_registro ? $aporte->fecha_registro->format('d/m/Y H:i') : now()->format('d/m/Y H:i');

        // Preparar imagen QR embebida si la modalidad es QR y existe archivo
        $qrJpeg = null;
        $qrWidth = 0;
        $qrHeight = 0;
        if ($aporte->modalidad === 'QR' && !empty($pago['qr_imagen'])) {
            $qrInfo = $this->cargarImagenQrComoJpeg((string) $pago['qr_imagen']);
            if ($qrInfo !== null) {
                [$qrJpeg, $qrWidth, $qrHeight] = $qrInfo;
            }
        }

        $stream = "q\n";
        // Encabezado institucional Verde Chiquitano
        $stream .= "0.02 0.37 0.27 rg\n";
        $stream .= "40 730 515 75 re f\n";
        $stream .= "Q\n";

        $stream .= "BT /F2 16 Tf 1 1 1 rg 55 776 Td (FUNDACION FEDER - COMPROBANTE DE APORTE) Tj ET\n";
        $stream .= "BT /F1 10 Tf 0.85 0.96 0.90 rg 55 757 Td (Desarrollo Rural Chiquitano - Santa Cruz, Bolivia) Tj ET\n";
        $stream .= "BT /F2 10 Tf 1 0.85 0.35 rg 55 740 Td (Comprobante Nro.: {$codigo}) Tj ET\n";

        // Caja de Monto Comprometido
        $stream .= "0.95 0.98 0.96 rg 40 650 515 65 re f\n";
        $stream .= "0.80 0.90 0.84 RG 1 w 40 650 515 65 re S\n";
        $stream .= "BT /F1 9 Tf 0.40 0.45 0.42 rg 245 696 Td (MONTO COMPROMETIDO) Tj ET\n";
        $stream .= "BT /F2 20 Tf 0.02 0.45 0.30 rg 235 671 Td ({$monto}) Tj ET\n";
        $stream .= "BT /F1 9 Tf 0.35 0.35 0.35 rg 225 656 Td (Estado: {$estado}) Tj ET\n";

        // Sección 1: Detalle del Comprobante
        $stream .= "BT /F2 11 Tf 0.10 0.12 0.15 rg 45 622 Td (DETALLE DEL COMPROMISO DE DONACION) Tj ET\n";
        $stream .= "0.85 0.87 0.90 RG 0.8 w 45 614 m 550 614 l S\n";

        $filas = [
            ['Donante / Benefactor:', $donante],
            ['Correo Electronico:', $correo],
            ['Campana de Destino:', substr($tituloCampana, 0, 62)],
            ['Comunidad Beneficiaria:', $comunidad],
            ['Modalidad Elegida:', $modalidad],
            ['Fecha y Hora de Emision:', $fecha],
        ];

        $y = 594;
        foreach ($filas as [$etiqueta, $valor]) {
            $stream .= "BT /F2 9.5 Tf 0.38 0.42 0.47 rg 50 {$y} Td ({$etiqueta}) Tj ET\n";
            $stream .= "BT /F1 9.5 Tf 0.10 0.12 0.15 rg 200 {$y} Td ({$valor}) Tj ET\n";
            $y -= 10;
            $stream .= "0.93 0.94 0.96 RG 0.5 w 50 {$y} m 545 {$y} l S\n";
            $y -= 16;
        }

        // Sección 2: Instrucciones según Modalidad
        $y -= 10;
        $stream .= "BT /F2 11 Tf 0.10 0.12 0.15 rg 45 {$y} Td (INSTRUCCIONES PARA COMPLETAR SU APORTE) Tj ET\n";
        $y -= 8;
        $stream .= "0.85 0.87 0.90 RG 0.8 w 45 {$y} m 550 {$y} l S\n";
        $y -= 20;

        if ($aporte->modalidad === 'Transferencia bancaria') {
            $banco = $this->sanearTexto($pago['banco'] ?? 'Entidad bancaria asignada por FEDER');
            $cuenta = $this->sanearTexto($pago['numero_cuenta'] ?? 'Consultar con tesoreria');
            $titular = $this->sanearTexto($pago['titular'] ?? 'Fundacion FEDER');
            $nitCi = $this->sanearTexto($pago['nit_ci'] ?? '');

            $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 {$y} Td (Banco / Entidad:) Tj /F1 9.5 Tf 110 0 Td ({$banco}) Tj ET\n";
            $y -= 18;
            $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 {$y} Td (Nro. Cuenta / Tarjeta:) Tj /F1 9.5 Tf 125 0 Td ({$cuenta}) Tj ET\n";
            $y -= 18;
            $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 {$y} Td (Titular:) Tj /F1 9.5 Tf 65 0 Td ({$titular}" . ($nitCi !== '' ? " - NIT/CI: {$nitCi}" : '') . ") Tj ET\n";
            $y -= 18;
            $stream .= "BT /F1 9 Tf 0.35 0.35 0.35 rg 50 {$y} Td (Indique en la glosa de su transferencia el codigo: {$codigo}) Tj ET\n";
        } elseif ($aporte->modalidad === 'QR') {
            $stream .= "BT /F1 9.5 Tf 0.2 0.2 0.2 rg 50 {$y} Td (Escanee el codigo QR de la campana desde su app bancaria por {$monto}.) Tj ET\n";
            $y -= 16;
            $stream .= "BT /F1 9 Tf 0.35 0.35 0.35 rg 50 {$y} Td (Indique en la glosa o referencia su codigo de comprobante: {$codigo}.) Tj ET\n";

            if ($qrJpeg !== null) {
                $boxSize = 175;
                $imgX = (595.28 - $boxSize) / 2;
                $imgY = max(115, $y - $boxSize - 18);

                $stream .= "0.90 0.92 0.94 RG 1 w " . ($imgX - 6) . " " . ($imgY - 6) . " " . ($boxSize + 12) . " " . ($boxSize + 12) . " re S\n";
                $stream .= "q {$boxSize} 0 0 {$boxSize} {$imgX} {$imgY} cm /Im1 Do Q\n";
            } else {
                $y -= 24;
                $stream .= "BT /F1 9 Tf 0.45 0.45 0.45 rg 50 {$y} Td (Codigo QR disponible en la ficha web de la campana.) Tj ET\n";
            }
        } else {
            $direccion = $this->sanearTexto($pago['direccion_efectivo'] ?: 'Oficina Central: San Joaquin 2052, Santa Cruz (08:30 - 16:30)');
            $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 50 {$y} Td (Punto de recepcion:) Tj /F1 9.5 Tf 115 0 Td (" . substr($direccion, 0, 75) . ") Tj ET\n";
            $y -= 18;
            $stream .= "BT /F1 9 Tf 0.35 0.35 0.35 rg 50 {$y} Td (Presente este comprobante con el codigo {$codigo} al entregar su aporte.) Tj ET\n";
        }

        // Pie de página oficial
        $stream .= "0.02 0.37 0.27 RG 1.5 w 40 75 m 555 75 l S\n";
        $emision = now()->format('d/m/Y H:i');
        $stream .= "BT /F1 8 Tf 0.45 0.48 0.52 rg 50 58 Td (Comprobante preliminar generado por el Portal Institucional FEDER - Emitido: {$emision}) Tj ET\n";

        // Ensamblado de Objetos PDF 1.4
        $objects = [];
        $objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
        $objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';

        $resources = '/Font << /F1 4 0 R /F2 5 0 R >>';
        if ($qrJpeg !== null) {
            $resources .= ' /XObject << /Im1 7 0 R >>';
        }

        $objects[] = "<< /Type /Page /Parent 2 0 R /Resources << {$resources} >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>";
        $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
        $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

        $len = strlen($stream);
        $objects[] = "<< /Length {$len} >>\nstream\n{$stream}\nendstream";

        if ($qrJpeg !== null) {
            $imgLen = strlen($qrJpeg);
            $objects[] = "<< /Type /XObject /Subtype /Image /Width {$qrWidth} /Height {$qrHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length {$imgLen} >>\nstream\n{$qrJpeg}\nendstream";
        }

        $out = "%PDF-1.4\n";
        $offsets = [];
        foreach ($objects as $i => $obj) {
            $offsets[] = strlen($out);
            $out .= ($i + 1) . " 0 obj\n" . $obj . "\nendobj\n";
        }

        $xrefOffset = strlen($out);
        $out .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        foreach ($offsets as $off) {
            $out .= sprintf("%010d 00000 n \n", $off);
        }

        $out .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\n";
        $out .= "startxref\n{$xrefOffset}\n%%EOF";

        return $out;
    }

    /**
     * Convierte la imagen QR almacenada en public storage a bytes JPEG para incrustarla en PDF 1.4.
     *
     * @return array{0: string, 1: int, 2: int}|null
     */
    private function cargarImagenQrComoJpeg(string $qrUrl): ?array
    {
        if (!function_exists('imagecreatefromstring') || !str_starts_with($qrUrl, '/storage/')) {
            return null;
        }

        $relativo = str_replace('/storage/', '', $qrUrl);
        if (!Storage::disk('public')->exists($relativo)) {
            return null;
        }

        $raw = Storage::disk('public')->get($relativo);
        $img = @imagecreatefromstring($raw);
        if (!$img) {
            return null;
        }

        $w = imagesx($img);
        $h = imagesy($img);

        // Componer sobre fondo blanco por si el QR es PNG con transparencia
        $canvas = imagecreatetruecolor($w, $h);
        $blanco = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $blanco);
        imagecopy($canvas, $img, 0, 0, 0, 0, $w, $h);

        ob_start();
        imagejpeg($canvas, null, 92);
        $jpegBytes = ob_get_clean();

        imagedestroy($img);
        imagedestroy($canvas);

        if (!is_string($jpegBytes) || $jpegBytes === '') {
            return null;
        }

        return [$jpegBytes, $w, $h];
    }

    private function sanearTexto(string $str): string
    {
        $map = [
            'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ñ' => 'n',
            'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U', 'Ñ' => 'N',
            'ü' => 'u', 'Ü' => 'U',
        ];
        $clean = strtr($str, $map);
        $clean = preg_replace('/[^\x20-\x7E]/', '', $clean);

        return str_replace(['(', ')', '\\'], ['[', ']', '/'], (string) $clean);
    }
}
