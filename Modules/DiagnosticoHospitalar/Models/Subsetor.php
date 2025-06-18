<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subsetor extends Model
{
    use HasFactory;

    protected $table = 'subsetores';
    protected $guarded = ['id'];
    public $timestamps = false;
    
    public function setor()
    {
        return $this->belongsTo(Setor::class, 'setor_id');
    }
    
    public function itens()
    {
        return $this->hasMany(ItemDiagnostico::class, 'subsetor_id');
    }
    
    // Escopo para itens não deletados
    public function scopeAtivo($query)
    {
        return $query->where('deletado', 0);
    }
}
