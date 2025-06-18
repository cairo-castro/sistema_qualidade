<?php

namespace Modules\DiagnosticoHospitalar\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\DiagnosticoHospitalar\Models\Unidade;
use Modules\DiagnosticoHospitalar\Models\Setor;
use Modules\DiagnosticoHospitalar\Models\Subsetor;
use Modules\DiagnosticoHospitalar\Models\PeriodoDiagnostico;
use Modules\DiagnosticoHospitalar\Models\ItemDiagnostico;
use Modules\DiagnosticoHospitalar\Models\Diagnostico;
use Modules\DiagnosticoHospitalar\Models\ProblemaDiagnostico;
use Modules\DiagnosticoHospitalar\Http\Requests\CriarPeriodoRequest;
use Modules\DiagnosticoHospitalar\Http\Requests\SalvarAvaliacaoRequest;

class DiagnosticoController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'permission:diagnostico.view']);
    }
    
    // VIEW - Página principal
    public function index()
    {
        $unidades = Unidade::all();
        $setores = Setor::with('subsetores')->ativo()->get();
        
        return view('diagnosticohospitalar::index', compact('unidades', 'setores'));
    }
    
    // AJAX - Criar período
    public function criarPeriodo(CriarPeriodoRequest $request)
    {
        $periodo = PeriodoDiagnostico::create($request->validated());
        
        // Sincronizar itens automaticamente
        $this->sincronizarItens($periodo->id);
        
        return response()->json([
            'success' => true,
            'message' => 'Período criado com sucesso',
            'data' => $periodo
        ]);
    }
    
    // AJAX - Obter períodos por unidade
    public function obterPeriodos(Request $request)
    {
        $periodos = PeriodoDiagnostico::where('id_unidade', $request->unidade_id)
            ->ativo()
            ->orderBy('data_inicio', 'desc')
            ->get();
            
        return response()->json($periodos);
    }
    
    // AJAX - Obter itens para avaliação
    public function obterItens(Request $request)
    {
        $query = DB::table('items_diagnostico as i')
            ->leftJoin('diagnostico as d', function($join) use ($request) {
                $join->on('i.id', '=', 'd.item_diagnostico_id')
                     ->where('d.id_periodo_diagnostico', $request->periodo_id);
            })
            ->leftJoin('setores as s', 'i.setor_id', '=', 's.id')
            ->leftJoin('subsetores as sub', 'i.subsetor_id', '=', 'sub.id')
            ->where('i.setor_id', $request->setor_id)
            ->where('i.deletado', 0);
        
        if ($request->subsetor_id) {
            $query->where('i.subsetor_id', $request->subsetor_id);
        }
        
        $itens = $query->select([
            'i.id',
            'i.nome_item',
            'i.setor_id',
            'i.subsetor_id',
            's.nome as setor_nome',
            'sub.nome as subsetor_nome',
            'd.id as diagnostico_id',
            'd.avaliacao_resultado',
            'd.observacoes',
            'd.nao_se_aplica'
        ])->get();
        
        return response()->json(['data' => $itens]);
    }
    
    // AJAX - Salvar avaliação
    public function salvarAvaliacao(SalvarAvaliacaoRequest $request)
    {
        $diagnostico = Diagnostico::updateOrCreate(
            [
                'id_periodo_diagnostico' => $request->id_periodo_diagnostico,
                'item_diagnostico_id' => $request->item_diagnostico_id
            ],
            [
                'unidade_id' => $request->unidade_id,
                'setor_id' => $request->setor_id,
                'subsetor_id' => $request->subsetor_id,
                'item' => $request->item,
                'avaliacao_resultado' => $request->avaliacao_resultado,
                'observacoes' => $request->observacoes,
                'nao_se_aplica' => $request->nao_se_aplica ?? 0,
                'estado_avaliacao' => 'avaliado'
            ]
        );
        
        // Salvar problemas se não conforme
        if ($request->avaliacao_resultado === 'nao_conforme' && $request->problemas) {
            ProblemaDiagnostico::where('id_items_diagnostico', $request->item_diagnostico_id)->delete();
            
            foreach ($request->problemas as $problema) {
                ProblemaDiagnostico::create([
                    'id_items_diagnostico' => $request->item_diagnostico_id,
                    'nome' => $problema
                ]);
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Avaliação salva com sucesso'
        ]);
    }
    
    // AJAX - Sincronizar itens
    public function sincronizarItens($periodo_id = null)
    {
        $periodo = is_numeric($periodo_id) ? PeriodoDiagnostico::findOrFail($periodo_id) : null;
        
        if (!$periodo && request()->route('periodo')) {
            $periodo = request()->route('periodo');
        }
        
        $itens = ItemDiagnostico::ativo()->get();
        
        $novos = 0;
        
        foreach ($itens as $item) {
            $existe = Diagnostico::where([
                'id_periodo_diagnostico' => $periodo->id,
                'item_diagnostico_id' => $item->id
            ])->exists();
            
            if (!$existe) {
                Diagnostico::create([
                    'id_periodo_diagnostico' => $periodo->id,
                    'unidade_id' => $periodo->id_unidade,
                    'setor_id' => $item->setor_id,
                    'subsetor_id' => $item->subsetor_id,
                    'item_diagnostico_id' => $item->id,
                    'item' => $item->nome_item,
                    'item_hash' => md5($item->nome_item),
                    'avaliacao_resultado' => null,
                    'estado_avaliacao' => 'pendente'
                ]);
                $novos++;
            }
        }
        
        return response()->json([
            'success' => true,
            'message' => "Sincronização concluída. {$novos} novos itens adicionados."
        ]);
    }
    
    // AJAX - Obter progresso
    public function obterProgresso($periodo_id)
    {
        $periodo = PeriodoDiagnostico::findOrFail($periodo_id);
        $progresso = $periodo->getProgresso();
        
        return response()->json([
            'success' => true,
            'data' => $progresso
        ]);
    }
    
    // AJAX - Obter setores
    public function obterSetores()
    {
        $setores = Setor::with('subsetores')->ativo()->get();
        return response()->json($setores);
    }
    
    // AJAX - Obter unidades
    public function obterUnidades()
    {
        $unidades = Unidade::all();
        return response()->json($unidades);
    }
}
