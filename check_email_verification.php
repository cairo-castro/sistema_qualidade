<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "=== Checking Email Verification Status ===\n\n";

$demoUsers = ['admin', 'gestor', 'operador'];

foreach ($demoUsers as $username) {
    $user = User::where('name', $username)->first();
    if ($user) {
        echo "User: {$username}\n";
        echo "  Email: {$user->email}\n";
        echo "  Email verified: " . ($user->hasVerifiedEmail() ? 'YES' : 'NO') . "\n";
        echo "  email_verified_at: " . ($user->email_verified_at ?: 'NULL') . "\n";
        echo "  implements MustVerifyEmail: " . ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail ? 'YES' : 'NO') . "\n";
        echo "\n";
    } else {
        echo "User '{$username}' not found!\n\n";
    }
}

echo "=== Checking Middleware Configuration ===\n";
echo "Dashboard route middleware: ['auth', 'verified']\n";
echo "The 'verified' middleware requires email verification.\n";
