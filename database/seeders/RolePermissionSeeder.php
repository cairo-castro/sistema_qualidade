<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Criar permissões
        $permissions = [
            // Dashboard
            'view dashboard',
            
            // Diagnósticos
            'view diagnosticos',
            'create diagnosticos', 
            'edit diagnosticos',
            'delete diagnosticos',
            'export diagnosticos',
            
            // Usuários
            'view users',
            'create users',
            'edit users', 
            'delete users',
            'manage users',
            
            // Unidades
            'view unidades',
            'create unidades',
            'edit unidades',
            'delete unidades',
            
            // Setores
            'view setores',
            'create setores',
            'edit setores', 
            'delete setores',
            
            // Relatórios
            'view reports',
            'export reports',
            
            // Sistema
            'manage system',
            'manage permissions',
            'view logs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Criar roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $gestorRole = Role::firstOrCreate(['name' => 'Gestor']); 
        $operadorRole = Role::firstOrCreate(['name' => 'Operador']);

        // Atribuir todas as permissões ao Admin
        $adminRole->givePermissionTo(Permission::all());

        // Atribuir permissões limitadas ao Gestor
        $gestorPermissions = [
            'view dashboard',
            'view diagnosticos', 'create diagnosticos', 'edit diagnosticos', 'export diagnosticos',
            'view users', 'edit users',
            'view unidades', 'create unidades', 'edit unidades',
            'view setores', 'create setores', 'edit setores',
            'view reports', 'export reports'
        ];
        $gestorRole->givePermissionTo($gestorPermissions);

        // Atribuir permissões básicas ao Operador
        $operadorPermissions = [
            'view dashboard',
            'view diagnosticos', 'create diagnosticos',
            'view unidades', 'view setores'
        ];
        $operadorRole->givePermissionTo($operadorPermissions);

        // Criar usuários de teste
        $admin = User::updateOrCreate([
            'email' => 'admin@sistema.local'
        ], [
            'name' => 'Administrador',
            'email' => 'admin@sistema.local',
            'password' => bcrypt('admin123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('Admin');

        $gestor = User::updateOrCreate([
            'email' => 'gestor@sistema.local'
        ], [
            'name' => 'Gestor',
            'email' => 'gestor@sistema.local', 
            'password' => bcrypt('gestor123'),
            'email_verified_at' => now(),
        ]);
        $gestor->assignRole('Gestor');

        $operador = User::updateOrCreate([
            'email' => 'operador@sistema.local'
        ], [
            'name' => 'Operador',
            'email' => 'operador@sistema.local',
            'password' => bcrypt('operador123'),
            'email_verified_at' => now(),
        ]);
        $operador->assignRole('Operador');

        $this->command->info('✅ Roles e Permissions criados com sucesso!');
        $this->command->info('👤 Admin: admin@sistema.local / admin123');
        $this->command->info('👤 Gestor: gestor@sistema.local / gestor123');
        $this->command->info('👤 Operador: operador@sistema.local / operador123');
    }
}