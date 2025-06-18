<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProblemaDiagnostico extends Model
{
    use HasFactory;

    protected $table = 'problemas_diagnostico';
    protected $guarded = ['id'];
    public $timestamps = false;
    
    public function item()
    {
        return $this->belongsTo(ItemDiagnostico::class, 'id_items_diagnostico');
    }
    
    // Escopo para itens não deletados
    public function scopeAtivo($query)
    {
        return $query->where('deletado', 0);
    }
}
