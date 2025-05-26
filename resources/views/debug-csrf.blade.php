<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Debug CSRF</title>
</head>
<body>
    <h1>Debug CSRF Token</h1>
    
    <div>
        <h2>Token Information</h2>
        <p><strong>CSRF Token:</strong> {{ csrf_token() }}</p>
        <p><strong>Session ID:</strong> {{ session()->getId() }}</p>
        <p><strong>Session Name:</strong> {{ session()->getName() }}</p>
        <p><strong>Session Driver:</strong> {{ config('session.driver') }}</p>
        <p><strong>Session Path:</strong> {{ config('session.path') }}</p>
        <p><strong>Session Domain:</strong> {{ config('session.domain') ?? 'null' }}</p>
        <p><strong>Session Secure:</strong> {{ config('session.secure') ? 'true' : 'false' }}</p>
        <p><strong>Session HTTP Only:</strong> {{ config('session.http_only') ? 'true' : 'false' }}</p>
        <p><strong>Session Same Site:</strong> {{ config('session.same_site') }}</p>
    </div>
    
    <div>
        <h2>Test Form</h2>
        <form method="POST" action="/debug-csrf-submit">
            @csrf
            <input type="text" name="test" placeholder="Test input" required>
            <button type="submit">Submit Test</button>
        </form>
    </div>
    
    <div>
        <h2>Session Data</h2>
        <pre>{{ json_encode(session()->all(), JSON_PRETTY_PRINT) }}</pre>
    </div>
    
    <div>
        <h2>Cookies</h2>
        <pre>{{ json_encode($_COOKIE, JSON_PRETTY_PRINT) }}</pre>
    </div>
    
    <script>
        console.log('CSRF Token from meta:', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
    </script>
</body>
</html>
