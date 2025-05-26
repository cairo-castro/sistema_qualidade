<!DOCTYPE html>
<html>
<head>
    <title>Login Simples</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Login Simplificado</h1>
    
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <div>
            <label>Usuário:</label>
            <input type="text" name="name" value="admin" required>
        </div>
        <div>
            <label>Senha:</label>
            <input type="password" name="password" value="admin123" required>
        </div>
        <div>
            <input type="checkbox" name="remember"> Lembrar-me
        </div>
        <button type="submit">Login</button>
    </form>
    
    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
</body>
</html>
