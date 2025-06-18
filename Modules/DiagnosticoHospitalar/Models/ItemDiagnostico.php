<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemDiagnostico extends Model
{
    use HasFactory;

    protected $table = 'items_diagnostico';
    protected $guarded = ['id'];
    public $timestamps = false;
    
    public function setor()
    {
        return $this->belongsTo(Setor::class, 'setor_id');
    }
    
    public function subsetor()
    {
        return $this->belongsTo(Subsetor::class, 'subsetor_id');
    }
    
    public function avaliacoes()
    {
        return $this->hasMany(Diagnostico::class, 'item_diagnostico_id');
    }
    
    public function problemas()
    {
        return $this->hasMany(ProblemaDiagnostico::class, 'id_items_diagnostico');
    }
    
    // Escopo para itens não deletados
    public function scopeAtivo($query)
    {
        return $query->where('deletado', 0);
    }
}
