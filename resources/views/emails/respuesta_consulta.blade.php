<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respuesta Institucional - Fundación FEDER</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
        .header { background: linear-gradient(135deg, #065f46, #0f172a); padding: 28px; color: #ffffff; text-align: center; }
        .content { padding: 28px; font-size: 14px; line-height: 1.65; }
        .reply-box { background: #f0fdf4; border-left: 4px solid #059669; border-radius: 8px; padding: 18px; margin: 20px 0; color: #064e3b; white-space: pre-line; }
        .original-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 22px; font-size: 12px; color: #64748b; }
        .footer { background: #0f172a; color: #94a3b8; font-size: 11px; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1 style="margin: 0; font-size: 22px;">Fundación FEDER</h1>
            <p style="margin: 6px 0 0; font-size: 12px; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1px;">Atención Institucional y Cooperación</p>
        </div>

        <div class="content">
            <p>Estimado(a) <strong>{{ $consulta->nombre_remitente }}</strong>,</p>
            <p>En atención a su comunicación recibida a través de nuestro portal institucional sobre el asunto <strong>"{{ $consulta->asunto }}"</strong>, le hacemos llegar nuestra respuesta oficial:</p>

            <div class="reply-box">{{ $respuestaTexto }}</div>

            <p style="margin-top: 20px;">Agradecemos su interés en las iniciativas de desarrollo rural sostenible para las comunidades de la Chiquitanía.</p>
            <p style="margin-bottom: 0;">Atentamente,<br><strong>{{ $responsableNombre }}</strong><br><span style="font-size: 12px; color: #64748b;">Fundación FEDER - Santa Cruz, Bolivia</span></p>

            <div class="original-box">
                <strong>Referencia de su mensaje original (#{{ $consulta->id_consulta }} - {{ $consulta->fecha_envio ? $consulta->fecha_envio->format('d/m/Y H:i') : '' }}):</strong>
                <p style="margin: 6px 0 0; white-space: pre-line;">{{ $consulta->mensaje }}</p>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0 0 6px;">Fundación FEDER © {{ date('Y') }} - San Joaquín 2052, Santa Cruz de la Sierra, Bolivia</p>
            <p style="margin: 0; color: #64748b;">Correo despachado desde el Módulo de Consultas Ciudadanas (CU-07).</p>
        </div>
    </div>
</body>
</html>

