<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Open Graph (vista previa al compartir en redes sociales) -->
        @php
            $og = $og ?? \App\Services\OpenGraphService::porDefecto();
        @endphp
        <meta property="og:title" content="{{ $og['titulo'] }}">
        <meta property="og:description" content="{{ $og['descripcion'] }}">
        <meta property="og:url" content="{{ $og['url'] }}">
        <meta property="og:image" content="{{ $og['imagen'] }}">
        @if ($og['imagen_ancho'] && $og['imagen_alto'])
            <meta property="og:image:width" content="{{ $og['imagen_ancho'] }}">
            <meta property="og:image:height" content="{{ $og['imagen_alto'] }}">
        @endif
        <meta property="og:type" content="{{ $og['tipo'] }}">
        <meta property="og:site_name" content="Fundación FEDER">
        <meta property="og:locale" content="es_BO">
        <meta name="twitter:card" content="summary_large_image">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
