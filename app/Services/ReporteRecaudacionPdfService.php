<?php

namespace App\Services;

/**
 * Servicio de Generación de Reporte Ejecutivo y Estadístico en PDF (CU-08, RF-17).
 * Construye un documento binario PDF 1.4 válido con tablas e indicadores consolidados.
 */
class ReporteRecaudacionPdfService
{
    private array $objects = [];

    /**
     * Genera el archivo PDF consolidado a partir de las métricas y campañas filtradas.
     */
    public function generar(array $resumen, iterable $campanas, array $porModalidad, array $consultasStats, array $filtros = []): string
    {
        $fechaEmision = now()->format('d/m/Y H:i');
        $rangoTexto = ($filtros['fecha_desde'] ?? 'Inicio') . ' al ' . ($filtros['fecha_hasta'] ?? 'Hoy');

        $stream = "q\n";
        // Banner superior institucional Verde FEDER
        $stream .= "0.02 0.37 0.27 rg\n";
        $stream .= "35 735 525 72 re f\n";
        $stream .= "Q\n";

        $stream .= "BT /F2 15 Tf 1 1 1 rg 50 780 Td (FUNDACION FEDER - REPORTE EJECUTIVO Y ESTADISTICO) Tj ET\n";
        $stream .= "BT /F1 9.5 Tf 1 1 1 rg 50 762 Td (Balance Consolidado de Recaudacion, Donaciones, Consultas y Cobertura Comunitaria) Tj ET\n";
        $stream .= "BT /F1 8 Tf 0.85 0.95 0.90 rg 50 745 Td (Fecha de emision: {$fechaEmision}  |  Periodo analizado: {$rangoTexto}) Tj ET\n";

        // 1. Indicadores Ejecutivos Globales
        $stream .= "BT /F2 11 Tf 0.1 0.1 0.1 rg 40 710 Td (1. INDICADORES FINANCIEROS Y DE GESTION CONSOLIDADOS) Tj ET\n";

        $stream .= "0.94 0.98 0.95 rg 40 650 125 48 re f\n";
        $stream .= "0.94 0.96 0.99 rg 173 650 125 48 re f\n";
        $stream .= "0.99 0.96 0.92 rg 306 650 125 48 re f\n";
        $stream .= "0.95 0.95 0.97 rg 439 650 121 48 re f\n";

        $metaGlobal = 'Bs. ' . number_format((float) ($resumen['meta_total'] ?? 0), 2, '.', ',');
        $recaudadoGlobal = 'Bs. ' . number_format((float) ($resumen['recaudado_total'] ?? 0), 2, '.', ',');
        $efectividad = ($resumen['efectividad_global'] ?? 0) . '%';
        $tasaConsultas = ($consultasStats['tasa_atencion'] ?? 0) . '% (' . ($consultasStats['atendidos'] ?? 0) . '/' . ($consultasStats['total'] ?? 0) . ')';

        $stream .= "BT /F1 8 Tf 0.4 0.4 0.4 rg 48 683 Td (RECAUDACION CONFIRMADA) Tj ET\n";
        $stream .= "BT /F2 11 Tf 0.02 0.40 0.25 rg 48 662 Td ({$recaudadoGlobal}) Tj ET\n";

        $stream .= "BT /F1 8 Tf 0.4 0.4 0.4 rg 181 683 Td (META ECONOMICA TOTAL) Tj ET\n";
        $stream .= "BT /F2 11 Tf 0.12 0.25 0.55 rg 181 662 Td ({$metaGlobal}) Tj ET\n";

        $stream .= "BT /F1 8 Tf 0.4 0.4 0.4 rg 314 683 Td (CUMPLIMIENTO GLOBAL) Tj ET\n";
        $stream .= "BT /F2 11 Tf 0.75 0.35 0.05 rg 314 662 Td ({$efectividad} de la meta) Tj ET\n";

        $stream .= "BT /F1 8 Tf 0.4 0.4 0.4 rg 447 683 Td (CONSULTAS ATENDIDAS) Tj ET\n";
        $stream .= "BT /F2 10.5 Tf 0.20 0.20 0.35 rg 447 662 Td ({$tasaConsultas}) Tj ET\n";

        // 2. Tabla de Balance por Campaña Comunitaria
        $stream .= "BT /F2 11 Tf 0.1 0.1 0.1 rg 40 622 Td (2. BALANCE DE RECAUDACION POR CAMPANA COMUNITARIA) Tj ET\n";
        $stream .= "0.15 0.22 0.30 rg 40 596 520 20 re f\n";
        $stream .= "BT /F2 8.5 Tf 1 1 1 rg 46 603 Td (CAMPANA / PROYECTO) Tj 210 0 Td (COMUNIDAD) Tj 105 0 Td (META BS.) Tj 75 0 Td (RECAUDADO) Tj 68 0 Td (AVANCE) Tj ET\n";

        $y = 580;
        $contador = 0;
        foreach ($campanas as $c) {
            if ($contador >= 8) {
                break;
            }
            if ($contador % 2 === 1) {
                $stream .= "0.97 0.98 0.99 rg 40 " . ($y - 5) . " 520 18 re f\n";
            }
            $titulo = substr($this->sanearTexto($c->titulo ?? ''), 0, 36);
            $comunidad = substr($this->sanearTexto($c->comunidad->nombre ?? 'Comunidad'), 0, 18);
            $meta = number_format((float) $c->meta_economica, 2, '.', ',');
            $rec = number_format((float) $c->monto_recaudado, 2, '.', ',');
            $porc = ($c->porcentaje ?? 0) . '% (' . ($c->estado ?? '') . ')';

            $stream .= "BT /F1 8.5 Tf 0.15 0.15 0.15 rg 46 {$y} Td ({$titulo}) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.25 0.25 0.25 rg 256 {$y} Td ({$comunidad}) Tj ET\n";
            $stream .= "BT /F1 8.5 Tf 0.20 0.20 0.20 rg 361 {$y} Td ({$meta}) Tj ET\n";
            $stream .= "BT /F2 8.5 Tf 0.02 0.40 0.25 rg 436 {$y} Td ({$rec}) Tj ET\n";
            $stream .= "BT /F2 8 Tf 0.20 0.20 0.20 rg 504 {$y} Td ({$porc}) Tj ET\n";

            $y -= 19;
            $contador++;
        }

        // 3. Desglose por Modalidad de Aporte e Interacción Ciudadana
        $ySeccion3 = min($y - 16, 405);
        $stream .= "0.82 0.85 0.88 RG 1 w 40 " . ($ySeccion3 + 14) . " m 560 " . ($ySeccion3 + 14) . " l S\n";
        $stream .= "BT /F2 11 Tf 0.1 0.1 0.1 rg 40 {$ySeccion3} Td (3. DESGLOSE DE APORTES POR MODALIDAD Y ATENCION CIUDADANA) Tj ET\n";

        $yMod = $ySeccion3 - 22;
        foreach ($porModalidad as $mod) {
            $nombreMod = $this->sanearTexto($mod['modalidad'] ?? 'Modalidad');
            $totalMod = 'Bs. ' . number_format((float) ($mod['monto_total'] ?? 0), 2, '.', ',');
            $cantMod = ($mod['cantidad'] ?? 0) . ' aportes confirmados';
            $stream .= "BT /F2 9 Tf 0.15 0.15 0.15 rg 50 {$yMod} Td (- {$nombreMod}:) Tj /F1 9 Tf 135 0 Td ({$totalMod}  [{$cantMod}]) Tj ET\n";
            $yMod -= 16;
        }

        $yMod -= 8;
        $resumenConsultas = sprintf(
            "Consultas Recibidas: %d  |  Pendientes: %d  |  En Proceso: %d  |  Atendidas: %d",
            $consultasStats['total'] ?? 0,
            $consultasStats['pendientes'] ?? 0,
            $consultasStats['en_proceso'] ?? 0,
            $consultasStats['atendidos'] ?? 0
        );
        $stream .= "BT /F2 9 Tf 0.1 0.25 0.20 rg 50 {$yMod} Td (Balance de Consultas Ciudadanas:) Tj ET\n";
        $yMod -= 15;
        $stream .= "BT /F1 9 Tf 0.25 0.25 0.25 rg 50 {$yMod} Td ({$resumenConsultas}) Tj ET\n";

        // Pie de página oficial
        $stream .= "0.02 0.37 0.27 RG 1.5 w 40 75 m 560 75 l S\n";
        $stream .= "BT /F1 8 Tf 0.45 0.45 0.45 rg 45 58 Td (Documento oficial generado por el Modulo de Reportes y Estadisticas FEDER (CU-08, RF-17) - Santa Cruz, Bolivia) Tj ET\n";

        return $this->compilarDocumentoPdf($stream);
    }

    /**
     * Empaqueta el flujo gráfico dentro de la estructura estándar PDF 1.4.
     */
    private function compilarDocumentoPdf(string $stream): string
    {
        $this->objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
            '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
            "<< /Length " . strlen($stream) . " >>\nstream\n{$stream}\nendstream",
        ];

        $out = "%PDF-1.4\n";
        $offsets = [];
        foreach ($this->objects as $i => $obj) {
            $offsets[] = strlen($out);
            $out .= ($i + 1) . " 0 obj\n{$obj}\nendobj\n";
        }

        $xrefOffset = strlen($out);
        $out .= "xref\n0 " . (count($this->objects) + 1) . "\n0000000000 65535 f \n";
        foreach ($offsets as $off) {
            $out .= sprintf("%010d 00000 n \n", $off);
        }

        return $out . "trailer\n<< /Size " . (count($this->objects) + 1) . " /Root 1 0 R >>\nstartxref\n{$xrefOffset}\n%%EOF";
    }

    /**
     * Limpia tildes y caracteres especiales para codificación estándar PDF.
     */
    private function sanearTexto(string $str): string
    {
        $map = ['á'=>'a', 'é'=>'e', 'í'=>'i', 'ó'=>'o', 'ú'=>'u', 'ñ'=>'n', 'Á'=>'A', 'É'=>'E', 'Í'=>'I', 'Ó'=>'O', 'Ú'=>'U', 'Ñ'=>'N'];
        $clean = preg_replace('/[^\x20-\x7E]/', '', strtr($str, $map));
        return str_replace(['(', ')', '\\'], ['[', ']', '/'], $clean ?? '');
    }
}

