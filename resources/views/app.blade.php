<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>ZCMC Biometric Devices Overview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <!-- <script src="{{ asset('qz-tray.js') }}"></script>  -->
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet">
    <link rel="shortcut icon" href="https://zcmc.online/assets/zcmc-logo-1-BPbPoHby.png" type="image/x-icon">

    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @vite('resources/css/app.css')
    @inertiaHead
</head>

<body class="font-sans antialiased" style="background-color: #e9ebec;">
    @inertia
</body>


</html>
