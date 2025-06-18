<?php

namespace Modules\DiagnosticoHospitalar\Database\Seeders;

use Illuminate\Database\Seeder;

class DiagnosticoHospitalarDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            DiagnosticoPermissionsSeeder::class
        ]);
    }
}
