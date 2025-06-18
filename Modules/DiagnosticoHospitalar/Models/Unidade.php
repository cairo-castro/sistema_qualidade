<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unidade extends Model
{
    use HasFactory;

    protected $table = 'unidade';
    protected $guarded = ['id'];
    public $timestamps = false;
    
    public function periodos()
    {
        return $this->hasMany(PeriodoDiagnostico::class, 'id_unidade');
    }
}
