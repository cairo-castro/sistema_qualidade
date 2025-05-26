<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@4.0.0-beta3/dist/css/adminlte.min.css">
</head>
<body class="hold-transition lockscreen">
    <div class="lockscreen-wrapper">
        <div class="lockscreen-logo">
            <a href="/"><b>Admin</b>LTE</a>
        </div>
        
        <div class="lockscreen-name">{{ config('app.name', 'Laravel') }}</div>
        
        <div class="lockscreen-item">
            <div class="lockscreen-image">
                <img src="https://adminlte.io/themes/v3/dist/img/user1-128x128.jpg" alt="User Image">
            </div>
            
            <div class="card">
                <div class="card-body login-card-body">
                    <p class="login-box-msg">Bem-vindo ao Sistema</p>
                    
                    <div class="row">
                        <div class="col-6">
                            <a href="{{ route('login') }}" class="btn btn-primary btn-block">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </a>
                        </div>
                        @if (Route::has('register'))
                        <div class="col-6">
                            <a href="{{ route('register') }}" class="btn btn-success btn-block">
                                <i class="fas fa-user-plus"></i> Registrar
                            </a>
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        
        <div class="help-block text-center">
            Sistema de Gestão - {{ config('app.name') }}
        </div>
        
        <div class="lockscreen-footer text-center">
            Copyright &copy; {{ date('Y') }} <b><a href="#" class="text-black">{{ config('app.name') }}</a></b><br>
            Todos os direitos reservados
        </div>
    </div>
</body>
</html>