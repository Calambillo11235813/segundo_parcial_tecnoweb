<?php

namespace App\Services;

use App\Models\Campana;

/**
 * Servicio de Generación de Fichas Técnicas en Formato PDF Estándar (CU-06, RF-13).
 * Construye documentos binarios PDF 1.4 válidos sin dependencias externas.
 */
class FichaTecnicaPdfService
{
    private array $objects = [];

    /**
     * Genera la ficha técnica estructurada de la campaña en PDF.
     */
    public function generar(Campana $campana): string
    {
        $campana->loadMissing('comunidad');

        $titulo = $this->sanearTexto($campana->titulo);
        $comunidad = $this->sanearTexto($campana->comunidad->nombre ?? 'Comunidad Rural');
        $ubicacion = $this->sanearTexto($campana->comunidad->ubicacion ?? 'Chiquitanía, Santa Cruz');
        $meta = 'Bs. ' . number_format((float) $campana->meta_economica, 2, '.', ',');
        $recaudado = 'Bs. ' . number_format((float) $campana->monto_recaudado, 2, '.', ',');
        $porcentaje = $campana->porcentaje . '%';
        $dias = $campana->dias_restantes > 0 ? "{$campana->dias_restantes} dias restantes" : 'Finaliza hoy';
        $plazo = ($campana->fecha_inicio?->format('d/m/Y') ?? 'N/D') . ' al ' . ($campana->fecha_limite?->format('d/m/Y') ?? 'N/D');

        $stream = "q\n";
        // Encabezado institucional Verde Chiquitano
        $stream .= "0.02 0.37 0.27 rg\n";
        $stream .= "40 730 515 75 re f\n";
        $stream .= "Q\n";

        // Título del encabezado (Blanco)
        $stream .= "BT /F2 16 Tf 1 1 1 rg 55 775 Td (FUNDACION FEDER - FICHA TECNICA DE PROYECTO) Tj ET\n";
        $stream .= "BT /F1 10 Tf 1 1 1 rg 55 755 Td (Desarrollo Rural Sostenible - Chiquitania, Santa Cruz, Bolivia) Tj ET\n";
        $stream .= "BT /F1 8 Tf 1 1 1 rg 55 740 Td (Codigo de Campana: CAMP-" . str_pad((string)$campana->id_campana, 4, '0', STR_PAD_LEFT) . ") Tj ET\n";

        // Sección 1: Datos de la Campaña
        $stream .= "BT /F2 12 Tf 0.1 0.1 0.1 rg 45 700 Td (1. IDENTIFICACION DEL PLAN PRODUCTIVO) Tj ET\n";
        $stream .= "BT /F2 10 Tf 0.2 0.2 0.2 rg 55 680 Td (Titulo:) Tj /F1 10 Tf 45 0 Td (" . substr($titulo, 0, 70) . ") Tj ET\n";
        $stream .= "BT /F2 10 Tf 0.2 0.2 0.2 rg 55 662 Td (Comunidad:) Tj /F1 10 Tf 70 0 Td ({$comunidad} - {$ubicacion}) Tj ET\n";
        $stream .= "BT /F2 10 Tf 0.2 0.2 0.2 rg 55 644 Td (Estado:) Tj /F1 10 Tf 50 0 Td ({$campana->estado} - {$dias}) Tj ET\n";

        // Línea divisoria
        $stream .= "0.85 0.85 0.85 RG 1 w 45 630 m 550 630 l S\n";

        // Sección 2: Marco Financiero y Metas
        $stream .= "BT /F2 12 Tf 0.1 0.1 0.1 rg 45 605 Td (2. CUADRO ECONOMICO Y FINANCIAMIENTO) Tj ET\n";

        // Cajas de estadísticas
        $stream .= "0.95 0.97 0.95 rg 50 540 150 50 re f\n";
        $stream .= "0.95 0.95 0.98 rg 220 540 150 50 re f\n";
        $stream .= "0.98 0.96 0.93 rg 390 540 150 50 re f\n";

        $stream .= "BT /F1 9 Tf 0.4 0.4 0.4 rg 60 575 Td (META ECONOMICA) Tj ET\n";
        $stream .= "BT /F2 12 Tf 0.05 0.4 0.25 rg 60 552 Td ({$meta}) Tj ET\n";

        $stream .= "BT /F1 9 Tf 0.4 0.4 0.4 rg 230 575 Td (TOTAL RECAUDADO) Tj ET\n";
        $stream .= "BT /F2 12 Tf 0.1 0.2 0.6 rg 230 552 Td ({$recaudado}) Tj ET\n";

        $stream .= "BT /F1 9 Tf 0.4 0.4 0.4 rg 400 575 Td (AVANCE LOGRADO) Tj ET\n";
        $stream .= "BT /F2 12 Tf 0.8 0.4 0.0 rg 400 552 Td ({$porcentaje} ({$campana->estado})) Tj ET\n";

        $stream .= "BT /F2 10 Tf 0.2 0.2 0.2 rg 55 520 Td (Plazo de Ejecucion:) Tj /F1 10 Tf 110 0 Td ({$plazo}) Tj ET\n";

        // Sección 3: Descripción del Proyecto
        $stream .= "0.85 0.85 0.85 RG 1 w 45 500 m 550 500 l S\n";
        $stream .= "BT /F2 12 Tf 0.1 0.1 0.1 rg 45 475 Td (3. RESUMEN EJECUTIVO DEL PROYECTO) Tj ET\n";
        
        $desc = $this->sanearTexto($campana->descripcion);
        $lineas = str_split($desc, 90);
        $y = 455;
        foreach (array_slice($lineas, 0, 5) as $linea) {
            $stream .= "BT /F1 9.5 Tf 0.25 0.25 0.25 rg 55 {$y} Td ({$linea}) Tj ET\n";
            $y -= 16;
        }

        // Sección 4: Canales para Cooperantes y Donantes
        $stream .= "0.85 0.85 0.85 RG 1 w 45 350 m 550 350 l S\n";
        $stream .= "BT /F2 12 Tf 0.1 0.1 0.1 rg 45 325 Td (4. CANALES PARA APORTES Y DONACIONES) Tj ET\n";
        $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 55 305 Td (Modalidad Bancaria:) Tj /F1 9.5 Tf 115 0 Td (Banco Union - Cta Cte: 1-12345678 - Titular: Fundacion FEDER) Tj ET\n";
        $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 55 288 Td (NIT Institucional:) Tj /F1 9.5 Tf 100 0 Td (1028374029 - Santa Cruz, Bolivia) Tj ET\n";
        $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 55 271 Td (Modalidad QR y Web:) Tj /F1 9.5 Tf 115 0 Td (Registro directo en el portal: https://feder.org.bo/campanas/{$campana->id_campana}) Tj ET\n";
        $stream .= "BT /F2 9.5 Tf 0.2 0.2 0.2 rg 55 254 Td (Oficina Central:) Tj /F1 9.5 Tf 90 0 Td (San Joaquin 2052, Santa Cruz de la Sierra - Tel: +591 3 334-5678) Tj ET\n";

        // Pie de página oficial
        $stream .= "0.02 0.37 0.27 RG 1.5 w 45 80 m 550 80 l S\n";
        $fechaEmision = now()->format('d/m/Y H:i');
        $stream .= "BT /F1 8 Tf 0.5 0.5 0.5 rg 55 65 Td (Expediente tecnico emitido por el Portal FEDER - Fecha: {$fechaEmision} - Documento Informativo Oficial) Tj ET\n";

        // Ensamblado de Objetos PDF 1.4
        $this->objects = [];
        $this->objects[] = '<< /Type /Catalog /Pages 2 0 R >>';
        $this->objects[] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
        $this->objects[] = '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>';
        $this->objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
        $this->objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';

        $len = strlen($stream);
        $this->objects[] = "<< /Length {$len} >>\nstream\n{$stream}\nendstream";

        $out = "%PDF-1.4\n";
        $offsets = [];
        foreach ($this->objects as $i => $obj) {
            $offsets[] = strlen($out);
            $out .= ($i + 1) . " 0 obj\n" . $obj . "\nendobj\n";
        }

        $xrefOffset = strlen($out);
        $out .= "xref\n0 " . (count($this->objects) + 1) . "\n0000000000 65535 f \n";
        foreach ($offsets as $off) {
            $out .= sprintf("%010d 00000 n \n", $off);
        }

        $out .= "trailer\n<< /Size " . (count($this->objects) + 1) . " /Root 1 0 R >>\n";
        $out .= "startxref\n{$xrefOffset}\n%%EOF";

        return $out;
    }

    /**
     * Limpia caracteres especiales para formato PDF plano.
     */
    private function sanearTexto(string $str): string
    {
        $map = ['á'=>'a', 'é'=>'e', 'í'=>'i', 'ó'=>'o', 'ú'=>'u', 'ñ'=>'n', 'Á'=>'A', 'É'=>'E', 'Í'=>'I', 'Ó'=>'O', 'Ú'=>'U', 'Ñ'=>'N'];
        $clean = strtr($str, $map);
        $clean = preg_replace('/[^\x20-\x7E]/', '', $clean);
        return str_replace(['(', ')', '\\'], ['[', ']', '/'], $clean);
    }
}

