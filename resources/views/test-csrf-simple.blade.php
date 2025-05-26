<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Teste CSRF Simples</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <h1>Teste CSRF Simples</h1>
    
    <div>
        <p><strong>Token CSRF:</strong> <span id="csrf-display">{{ csrf_token() }}</span></p>
        <p><strong>Session ID:</strong> {{ session()->getId() }}</p>
    </div>
    
    <!-- Teste 1: Form simples -->
    <form id="simple-form" method="POST" action="/test-csrf-submit">
        @csrf
        <input type="text" name="test" value="teste123" placeholder="Dados de teste">
        <button type="submit">Teste Form Normal</button>
    </form>
    
    <br><br>
    
    <!-- Teste 2: AJAX sem CSRF -->
    <button onclick="testAjaxWithoutCsrf()">Teste AJAX sem CSRF</button>
    
    <!-- Teste 3: AJAX com CSRF no header -->
    <button onclick="testAjaxWithCsrf()">Teste AJAX com CSRF</button>
    
    <!-- Teste 4: Login direto -->
    <button onclick="testLogin()">Teste Login Direto</button>
    
    <div id="results" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc;"></div>
    
    <script>
        // Configura CSRF para jQuery
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        
        function logResult(message, data = null) {
            const results = document.getElementById('results');
            const timestamp = new Date().toLocaleTimeString();
            results.innerHTML += `<p><strong>${timestamp}:</strong> ${message}</p>`;
            if (data) {
                results.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            }
            results.scrollTop = results.scrollHeight;
        }
        
        function testAjaxWithoutCsrf() {
            logResult('Testando AJAX sem CSRF...');
            $.ajax({
                url: '/test-csrf-submit',
                method: 'POST',
                data: { test: 'ajax-sem-csrf' },
                success: function(response) {
                    logResult('✅ AJAX sem CSRF: Sucesso', response);
                },
                error: function(xhr, status, error) {
                    logResult('❌ AJAX sem CSRF: Erro ' + xhr.status, {
                        status: xhr.status,
                        error: error,
                        response: xhr.responseText.substring(0, 200)
                    });
                }
            });
        }
        
        function testAjaxWithCsrf() {
            logResult('Testando AJAX com CSRF...');
            $.ajax({
                url: '/test-csrf-submit',
                method: 'POST',
                data: { 
                    test: 'ajax-com-csrf',
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response) {
                    logResult('✅ AJAX com CSRF: Sucesso', response);
                },
                error: function(xhr, status, error) {
                    logResult('❌ AJAX com CSRF: Erro ' + xhr.status, {
                        status: xhr.status,
                        error: error,
                        response: xhr.responseText.substring(0, 200)
                    });
                }
            });
        }
        
        function testLogin() {
            logResult('Testando login direto...');
            $.ajax({
                url: '/login',
                method: 'POST',
                data: { 
                    name: 'admin',
                    password: 'password',
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function(response, status, xhr) {
                    logResult('✅ Login: Sucesso', {
                        status: xhr.status,
                        redirected: !!xhr.responseURL,
                        url: xhr.responseURL
                    });
                },
                error: function(xhr, status, error) {
                    logResult('❌ Login: Erro ' + xhr.status, {
                        status: xhr.status,
                        error: error,
                        response: xhr.responseText.substring(0, 500)
                    });
                }
            });
        }
        
        // Intercepta o form simples
        document.getElementById('simple-form').addEventListener('submit', function(e) {
            e.preventDefault();
            logResult('Submetendo form normal...');
            
            const formData = new FormData(this);
            
            fetch('/test-csrf-submit', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('HTTP ' + response.status);
                }
            }).then(data => {
                logResult('✅ Form normal: Sucesso', data);
            }).catch(error => {
                logResult('❌ Form normal: Erro', { error: error.message });
            });
        });
        
        // Log inicial
        logResult('Página carregada. Token CSRF: ' + $('meta[name="csrf-token"]').attr('content'));
    </script>
</body>
</html>
