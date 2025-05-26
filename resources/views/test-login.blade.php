<!DOCTYPE html>
<html>
<head>
    <title>Teste de Login</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <h1>Teste de Login</h1>
    
    <form id="loginForm">
        <div>
            <label>Usuário:</label>
            <input type="text" name="name" value="admin" required>
        </div>
        <div>
            <label>Senha:</label>
            <input type="password" name="password" value="admin123" required>
        </div>
        <button type="submit">Fazer Login</button>
    </form>
    
    <div id="result"></div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Primeiro, obter o token CSRF
            fetch('/test-auth')
                .then(response => response.json())
                .then(authData => {
                    console.log('Status atual:', authData);
                      // Tentar fazer login usando a rota simplificada
                    return fetch('/simple-login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                })
                .then(response => response.json())
                .then(result => {
                    document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    
                    if (result.success) {
                        // Tentar redirecionar para dashboard
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    document.getElementById('result').innerHTML = '<p style="color: red;">Erro: ' + error.message + '</p>';
                });
        });
    </script>
</body>
</html>
