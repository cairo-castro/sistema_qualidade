<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DemoUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Atualizar usuário administrador (pode existir com nome "Administrador")
        $admin = User::where('email', 'admin@sistema.local')->first();
        if ($admin) {
            $admin->update([
                'name' => 'admin',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]);
        } else {
            $admin = User::create([
                'name' => 'admin',
                'email' => 'admin@sistema.local',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]);
        }

        // Atualizar usuário gestor (pode existir com nome "Gestor")
        $gestor = User::where('email', 'gestor@sistema.local')->first();
        if ($gestor) {
            $gestor->update([
                'name' => 'gestor',
                'password' => Hash::make('gestor123'),
            ]);
        } else {
            $gestor = User::create([
                'name' => 'gestor',
                'email' => 'gestor@sistema.local',
                'password' => Hash::make('gestor123'),
            ]);
        }

        // Atualizar usuário operador (pode existir com nome "Operador")
        $operador = User::where('email', 'operador@sistema.local')->first();
        if ($operador) {
            $operador->update([
                'name' => 'operador',
                'password' => Hash::make('operador123'),
            ]);
        } else {
            $operador = User::create([
                'name' => 'operador',
                'email' => 'operador@sistema.local',
                'password' => Hash::make('operador123'),
            ]);
        }

        // Atribuir roles se existirem
        try {
            if (Role::where('name', 'Super Admin')->exists()) {
                $admin->assignRole('Super Admin');
            }

            if (Role::where('name', 'Gestor')->exists()) {
                $gestor->assignRole('Gestor');
            }

            if (Role::where('name', 'Operador')->exists()) {
                $operador->assignRole('Operador');
            }
        } catch (\Exception $e) {
            // Ignora se as roles não existirem
        }

        $this->command->info('Usuários de demonstração criados com sucesso!');
        $this->command->table(
            ['Nome de Usuário', 'Email', 'Senha'],
            [
                ['admin', 'admin@sistema.local', 'admin123'],
                ['gestor', 'gestor@sistema.local', 'gestor123'],
                ['operador', 'operador@sistema.local', 'operador123'],
            ]
        );
    }
}
