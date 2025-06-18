<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Diagnostico extends Model
{
    use HasFactory;

    protected $table = 'diagnostico';
    protected $guarded = ['id'];
    public $timestamps = false;
    protected $casts = [
        'nao_se_aplica' => 'boolean'
    ];
    
    public function periodo()
    {
        return $this->belongsTo(PeriodoDiagnostico::class, 'id_periodo_diagnostico');
    }
    
    public function setor()
    {
        return $this->belongsTo(Setor::class, 'setor_id');
    }
    
    public function subsetor()
    {
        return $this->belongsTo(Subsetor::class, 'subsetor_id');
    }
    
    public function item()
    {
        return $this->belongsTo(ItemDiagnostico::class, 'item_diagnostico_id');
    }
    
    public function unidade()
    {
        return $this->belongsTo(Unidade::class, 'unidade_id');
    }
    
    public function problemas()
    {
        return $this->hasMany(ProblemaDiagnostico::class, 'id_items_diagnostico', 'item_diagnostico_id');
    }
}
