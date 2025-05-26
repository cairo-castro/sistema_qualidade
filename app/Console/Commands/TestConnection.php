<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestConnection extends Command
{
    protected $signature = 'test:connection';
    protected $description = 'Test database connection';

    public function handle()
    {
        try {
            DB::connection()->getPdo();
            $this->info('✅ Database connection: OK');
            
            // Testar algumas tabelas
            $usuarios = DB::table('usuarios')->count();
            $unidades = DB::table('unidade')->count();
            
            $this->info("📊 Usuários encontrados: {$usuarios}");
            $this->info("🏢 Unidades encontradas: {$unidades}");
            
        } catch (\Exception $e) {
            $this->error('❌ Database connection failed: ' . $e->getMessage());
        }
    }
}