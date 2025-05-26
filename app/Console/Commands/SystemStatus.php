<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SystemStatus extends Command
{
    protected $signature = 'sistema:status';
    protected $description = 'Mostrar status geral do sistema';

    public function handle()
    {
        $this->info('🏥 Sistema de Qualidade - Status Geral');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Laravel Info
        $this->newLine();
        $this->info('📊 Informações do Sistema:');
        $this->line("Laravel: " . app()->version());
        $this->line("PHP: " . PHP_VERSION);
        $this->line("Ambiente: " . app()->environment());
        $this->line("Debug: " . (config('app.debug') ? 'Ativado' : 'Desativado'));

        // Database Info  
        $this->newLine();
        $this->info('🗄️  Banco de Dados:');
        try {
            $connection = DB::connection();
            $this->line("Conexão: ✅ Conectado");
            $this->line("Driver: " . $connection->getDriverName());
            $this->line("Database: " . $connection->getDatabaseName());
        } catch (\Exception $e) {
            $this->error("Conexão: ❌ Erro - " . $e->getMessage());
        }

        // Users & Permissions
        $this->newLine();
        $this->info('👥 Usuários e Permissões:');
        $this->line("Usuários totais: " . User::count());
        $this->line("Funções (Roles): " . Role::count());
        $this->line("Permissões: " . Permission::count());

        // Roles breakdown
        $roles = Role::withCount('users')->get();
        foreach ($roles as $role) {
            $this->line("  • {$role->name}: {$role->users_count} usuário(s)");
        }

        // Sistema Tables (if exist)
        $this->newLine();
        $this->info('🏗️  Tabelas do Sistema:');
        $sistemaTabelas = [
            'usuarios' => 'Usuários do Sistema',
            'diagnostico' => 'Diagnósticos', 
            'unidade' => 'Unidades',
            'setores' => 'Setores',
            'permissoes' => 'Permissões do Sistema',
            'niveis_de_acesso' => 'Níveis de Acesso'
        ];

        foreach ($sistemaTabelas as $tabela => $nome) {
            try {
                if (DB::getSchemaBuilder()->hasTable($tabela)) {
                    $count = DB::table($tabela)->count();
                    $ativos = 0;
                    
                    if (DB::getSchemaBuilder()->hasColumn($tabela, 'deletado')) {
                        $ativos = DB::table($tabela)->where('deletado', 0)->count();
                        $this->line("  • {$nome}: {$count} total ({$ativos} ativos)");
                    } else {
                        $this->line("  • {$nome}: {$count} registros");
                    }
                } else {
                    $this->line("  • {$nome}: ❌ Tabela não encontrada");
                }
            } catch (\Exception $e) {
                $this->line("  • {$nome}: ❌ Erro ao verificar");
            }
        }

        // Cache Info
        $this->newLine();
        $this->info('⚡ Cache:');
        $this->line("Config: " . (app()->configurationIsCached() ? 'Cached' : 'Not cached'));
        $this->line("Routes: " . (app()->routesAreCached() ? 'Cached' : 'Not cached'));

        $this->newLine();
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->info('✅ Verificação concluída!');

        return 0;
    }
}