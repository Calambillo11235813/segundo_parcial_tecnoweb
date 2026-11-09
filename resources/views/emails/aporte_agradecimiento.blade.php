<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Comprobante Preliminar de Aporte - Fundación FEDER</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: linear-gradient(135deg, #065f46, #0f172a); padding: 28px; color: #ffffff; text-align: center; }
        .content { padding: 28px; font-size: 14px; line-height: 1.6; }
        .metric-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
        .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 9999px; background: #fef3c7; color: #92400e; }
        .footer { background: #0f172a; color: #94a3b8; font-size: 11px; padding: 20px; text-align: center; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
        .details-table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
        .details-table td.label { color: #64748b; font-weight: 600; width: 40%; }
        .details-table td.value { color: #0f172a; font-weight: 700; text-align: right; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1 style="margin: 0; font-size: 22px;">Fundación FEDER</h1>
            <p style="margin: 6px 0 0; font-size: 12px; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1px;">Desarrollo Rural Chiquitano</p>
        </div>

        <div class="content">
            <h2 style="font-size: 18px; margin-top: 0; color: #065f46;">¡Muchas gracias por tu compromiso solidario!</h2>
            <p>Estimado(a) <strong>{{ $aporte->nombre_donante }}</strong>,</p>
            <p>Hemos registrado exitosamente tu intención de aporte económico para fortalecer el plan comunitario en la Chiquitanía. Tu apoyo impulsa directamente a los productores y artesanos locales.</p>

            <div class="metric-box">
                <span class="badge">{{ $aporte->estado }}</span>
                <p style="margin: 10px 0 0; font-size: 11px; color: #166534; font-weight: 600; text-transform: uppercase;">Monto Comprometido</p>
                <p style="margin: 4px 0 0; font-size: 28px; font-weight: 800; color: #047857;">Bs. {{ number_format((float) $aporte->monto, 2, '.', ',') }}</p>
            </div>

            <table class="details-table">
                <tr>
                    <td class="label">Comprobante #</td>
                    <td class="value">{{ $aporte->codigo_comprobante }}</td>
                </tr>
                <tr>
                    <td class="label">Campaña de Destino</td>
                    <td class="value">{{ $aporte->campana->titulo ?? 'Fondo de Desarrollo Rural' }}</td>
                </tr>
                <tr>
                    <td class="label">Comunidad Beneficiaria</td>
                    <td class="value">{{ $aporte->campana->comunidad->nombre ?? 'Chiquitanía' }}</td>
                </tr>
                <tr>
                    <td class="label">Modalidad de Aporte</td>
                    <td class="value">{{ $aporte->modalidad }}</td>
                </tr>
                <tr>
                    <td class="label">Fecha de Registro</td>
                    <td class="value">{{ $aporte->fecha_registro ? $aporte->fecha_registro->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}</td>
                </tr>
            </table>

            <div style="margin-top: 24px; padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #065f46;">
                <p style="margin: 0; font-size: 12px; color: #334155;">
                    <strong>Instrucciones para completar tu aporte:</strong><br>
                    @if($aporte->modalidad === 'Transferencia bancaria')
                        Realiza tu transferencia a: <strong>Banco Unión S.A.</strong> - Cta Cte: <strong>1-12345678</strong> (NIT: 1028374029, Titular: Fundación FEDER). Envía tu comprobante a tesoreria@feder.org.bo citando el código <strong>{{ $aporte->codigo_comprobante }}</strong>.
                    @elseif($aporte->modalidad === 'QR')
                        Escanea el código QR institucional emitido en pantalla desde tu aplicación bancaria móvil. Tu donación será validada en las próximas 24 horas.
                    @else
                        Puedes apersonarte a nuestra oficina central: <strong>San Joaquín 2052, Santa Cruz de la Sierra</strong>, en horario de 08:30 a 16:30.
                    @endif
                </p>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0 0 6px;">Fundación FEDER © {{ date('Y') }} - Santa Cruz de la Sierra, Bolivia</p>
            <p style="margin: 0; color: #64748b;">Este es un mensaje institucional automático generado por el Portal FEDER (CU-06).</p>
        </div>
    </div>
</body>
</html>

