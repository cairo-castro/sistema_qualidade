<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setor extends Model
{
    use HasFactory;

    protected $table = 'setores';
    protected $guarded = ['id'];
    public $timestamps = false;
    
    public function subsetores()
    {
        return $this->hasMany(Subsetor::class, 'setor_id');
    }
    
    public function itens()
    {
        return $this->hasMany(ItemDiagnostico::class, 'setor_id');
    }
    
    // Escopo para itens não deletados
    public function scopeAtivo($query)
    {
        return $query->where('deletado', 0);
    }
}
