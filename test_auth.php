<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

echo "=== Teste de Autenticação ===\n\n";

// Teste 1: Verificar se os usuários existem
echo "1. Verificando usuários:\n";
$users = User::all();
foreach ($users as $user) {
    echo "   - {$user->name} (Email: {$user->email})\n";
}
echo "\n";

// Teste 2: Verificar se o método getAuthIdentifierName está funcionando
echo "2. Testando getAuthIdentifierName:\n";
$user = new User();
echo "   Identificador de autenticação: " . $user->getAuthIdentifierName() . "\n\n";

// Teste 3: Tentar autenticar com credenciais válidas
echo "3. Testando autenticação manual:\n";
$credentials = ['name' => 'admin', 'password' => 'admin123'];

try {
    $attempt = Auth::attempt($credentials);
    echo "   Resultado da autenticação: " . ($attempt ? 'SUCESSO' : 'FALHA') . "\n";
    
    if ($attempt) {
        echo "   Usuário autenticado: " . Auth::user()->name . "\n";
        echo "   ID do usuário: " . Auth::user()->id . "\n";
    }
} catch (Exception $e) {
    echo "   ERRO: " . $e->getMessage() . "\n";
}

echo "\n";

// Teste 4: Verificar hashes de senha
echo "4. Verificando hashes de senha:\n";
$admin = User::where('name', 'admin')->first();
if ($admin) {
    echo "   Hash armazenado: " . substr($admin->password, 0, 20) . "...\n";
    echo "   Verificação de senha: " . (Hash::check('admin123', $admin->password) ? 'VÁLIDA' : 'INVÁLIDA') . "\n";
}

echo "\n=== Fim do Teste ===\n";
