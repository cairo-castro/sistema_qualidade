<?php

namespace Modules\DiagnosticoHospitalar\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DiagnosticoPermissionsSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            'diagnostico.view',
            'diagnostico.edit',
            'diagnostico.periodo.create',
            'diagnostico.periodo.sync',
            'diagnostico.relatorio.view'
        ];
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        
        // Roles
        $avaliador = Role::firstOrCreate(['name' => 'diagnostico.avaliador']);
        $coordenador = Role::firstOrCreate(['name' => 'diagnostico.coordenador']);
        
        $avaliador->givePermissionTo(['diagnostico.view', 'diagnostico.edit']);
        $coordenador->givePermissionTo($permissions);
    }
}
