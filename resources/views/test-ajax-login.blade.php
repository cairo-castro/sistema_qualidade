<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Teste Login AJAX</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .form-group { margin: 10px 0; }
        label { display: block; margin-bottom: 5px; }
        input { padding: 8px; width: 300px; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        .result { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        .error { background: #ffebee; color: #c62828; }
        .success { background: #e8f5e8; color: #2e7d32; }
    </style>
</head>
<body>
    <h1>Teste de Login AJAX</h1>
    
    <div>
        <h3>Informações de Debug:</h3>
        <p><strong>CSRF Token:</strong> <span id="csrf-token">{{ csrf_token() }}</span></p>
        <p><strong>Session ID:</strong> {{ session()->getId() }}</p>
        <p><strong>URL da aplicação:</strong> {{ config('app.url') }}</p>
    </div>
    
    <form id="login-form">
        <div class="form-group">
            <label>Nome de usuário:</label>
            <input type="text" id="username" value="admin" required>
        </div>
        
        <div class="form-group">
            <label>Senha:</label>
            <input type="password" id="password" value="password" required>
        </div>
        
        <div class="form-group">
            <button type="submit">Login</button>
            <button type="button" onclick="testCsrf()">Testar CSRF</button>
            <button type="button" onclick="testWithoutCsrf()">Testar sem CSRF</button>
        </div>
    </form>
    
    <div id="result" class="result" style="display: none;"></div>
    
    <script>
        // Configura CSRF token para todas requisições AJAX
        fetch('/sanctum/csrf-cookie').then(() => {
            // Token foi configurado
        });
        
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            testLogin(true);
        });
        
        function testLogin(withCsrf = true) {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const formData = new FormData();
            formData.append('name', username);
            formData.append('password', password);
            
            if (withCsrf) {
                formData.append('_token', token);
            }
            
            showResult('Enviando requisição...', 'info');
            
            fetch('/login', {
                method: 'POST',
                headers: withCsrf ? {
                    'X-CSRF-TOKEN': token
                } : {},
                body: formData
            })
            .then(response => {
                console.log('Status:', response.status);
                console.log('Headers:', [...response.headers.entries()]);
                
                if (response.redirected) {
                    showResult(`Redirecionado para: ${response.url}`, 'success');
                    if (response.url.includes('dashboard')) {
                        showResult('LOGIN SUCESSO! Redirecionando...', 'success');
                        setTimeout(() => window.location.href = response.url, 2000);
                    }
                } else {
                    return response.text();
                }
            })
            .then(text => {
                if (text) {
                    console.log('Response:', text);
                    if (text.includes('419') || text.includes('Page Expired')) {
                        showResult('Erro 419 - Page Expired (CSRF mismatch)', 'error');
                    } else if (text.includes('validation') || text.includes('error')) {
                        showResult('Erro de validação: ' + text.substring(0, 200) + '...', 'error');
                    } else {
                        showResult('Resposta recebida: ' + text.substring(0, 200) + '...', 'info');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showResult('Erro: ' + error.message, 'error');
            });
        }
        
        function testCsrf() {
            testLogin(true);
        }
        
        function testWithoutCsrf() {
            testLogin(false);
        }
        
        function showResult(message, type) {
            const result = document.getElementById('result');
            result.style.display = 'block';
            result.className = 'result ' + type;
            result.innerHTML = '<strong>' + new Date().toLocaleTimeString() + ':</strong> ' + message;
        }
    </script>
</body>
</html>
