<?php

namespace Modules\DiagnosticoHospitalar\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PeriodoDiagnostico extends Model
{
    use HasFactory;

    protected $table = 'periodo_diagnostico';
    protected $guarded = ['id'];
    public $timestamps = false;
    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'is_frozen' => 'boolean'
    ];
    
    public function unidade()
    {
        return $this->belongsTo(Unidade::class, 'id_unidade');
    }
    
    public function avaliacoes()
    {
        return $this->hasMany(Diagnostico::class, 'id_periodo_diagnostico');
    }
    
    // Método direto para calcular progresso
    public function getProgresso()
    {
        $avaliacoes = $this->avaliacoes;
        $total = $avaliacoes->count();
        
        if ($total === 0) {
            return [
                'total' => 0,
                'conformes' => 0,
                'nao_conformes' => 0,
                'parciais' => 0,
                'nao_se_aplica' => 0,
                'percentual' => 0
            ];
        }
        
        $conformes = $avaliacoes->where('avaliacao_resultado', 'conforme')->count();
        $naoConformes = $avaliacoes->where('avaliacao_resultado', 'nao_conforme')->count();
        $parciais = $avaliacoes->where('avaliacao_resultado', 'parcialmente_conforme')->count();
        $naoSeAplica = $avaliacoes->where('nao_se_aplica', 1)->count();
        
        return [
            'total' => $total,
            'conformes' => $conformes,
            'nao_conformes' => $naoConformes,
            'parciais' => $parciais,
            'nao_se_aplica' => $naoSeAplica,
            'percentual' => round((($conformes + $naoConformes + $parciais + $naoSeAplica) / $total) * 100, 1)
        ];
    }
    
    // Escopo para itens não deletados
    public function scopeAtivo($query)
    {
        return $query->where('deletado', 0);
    }
}
