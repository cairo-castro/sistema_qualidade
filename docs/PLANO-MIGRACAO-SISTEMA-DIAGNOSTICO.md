# Plano de Migração: Sistema de Diagnóstico para Laravel 12

## 📋 Visão Geral

Migração do sistema de diagnóstico hospitalar (`sistema_antigo`) para a arquitetura Laravel 12 atual, mantendo o banco de dados existente e todas as funcionalidades, usando uma abordagem enxuta adequada para 1 desenvolvedor.

### Stack Atual vs. Nova
| Atual | Nova |
|-------|------|
| PHP Puro + PDO | Laravel 12 + Eloquent |
| JavaScript Vanilla | Alpine.js |
| Bootstrap 5 | Tailwind CSS + Preline UI + DaisyUI |
| Tabulator.js | Alpine.js + DataTables |
| Controle manual de sessão | Spatie Laravel Permission |
| Estrutura monolítica | Nwidart Laravel Modules |

## 🎯 Funcionalidades a Migrar

- ✅ Gestão de períodos (congelados/dinâmicos)
- ✅ Avaliação de itens por setor/subsetor
- ✅ 4 estados: conforme, não conforme, parcial, N/A
- ✅ Sincronização de itens
- ✅ Interface de tabela interativa
- ✅ Relatórios e progresso
- ✅ Controle de acesso
- ✅ Auditoria básica

## 🏗️ Estrutura MVC Básica (Nwidart)

```
Modules/DiagnosticoHospitalar/
├── Config/
│   └── config.php
├── Database/
│   ├── Migrations/
│   └── Seeders/
├── Entities/ (Models)
│   ├── PeriodoDiagnostico.php
│   ├── Diagnostico.php
│   ├── Unidade.php
│   ├── Setor.php
│   ├── Subsetor.php
│   ├── ItemDiagnostico.php
│   └── ProblemaDiagnostico.php
├── Http/
│   ├── Controllers/ (Controllers)
│   │   └── DiagnosticoController.php
│   └── Requests/
│       ├── CriarPeriodoRequest.php
│       └── SalvarAvaliacaoRequest.php
├── Resources/ (Views)
│   ├── assets/
│   │   ├── js/diagnostico.js
│   │   └── css/diagnostico.css
│   └── views/
│       ├── index.blade.php
│       └── partials/
├── Routes/
│   └── web.php
└── Providers/
    └── DiagnosticoHospitalarServiceProvider.php
```

## 📊 Banco de Dados (Manter Estrutura Atual)

### Tabelas Existentes (usar as atuais)
- `unidade` → usar como está
- `setores` → usar como está  
- `subsetores` → usar como está
- `periodo_diagnostico` → usar como está
- `items_diagnostico` → usar como está
- `diagnostico` → usar como está
- `problemas_diagnostico` → usar como está

### Models Eloquent (mapeamento direto)
```php
// Modules/DiagnosticoHospitalar/Entities/PeriodoDiagnostico.php
class PeriodoDiagnostico extends Model
{
    protected $table = 'periodo_diagnostico';
    protected $guarded = ['id'];
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
}

// Diagnostico.php (tabela 'diagnostico')
class Diagnostico extends Model
{
    protected $table = 'diagnostico';
    protected $guarded = ['id'];
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
    
    public function problemas()
    {
        return $this->hasMany(ProblemaDiagnostico::class, 'id_items_diagnostico');
    }
}

// Unidade.php (tabela 'unidade')
class Unidade extends Model
{
    protected $table = 'unidade';
    protected $guarded = ['id'];
    
    public function periodos()
    {
        return $this->hasMany(PeriodoDiagnostico::class, 'id_unidade');
    }
}

// Setor.php (tabela 'setores')
class Setor extends Model
{
    protected $table = 'setores';
    protected $guarded = ['id'];
    
    public function subsetores()
    {
        return $this->hasMany(Subsetor::class, 'setor_id');
    }
    
    public function itens()
    {
        return $this->hasMany(ItemDiagnostico::class, 'setor_id');
    }
}
```

## 🎛️ Controller MVC Básico

### Controller Principal
```php
// Http/Controllers/DiagnosticoController.php
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
        $setores = Setor::with('subsetores')->get();
        
        return view('diagnosticohospitalar::index', compact('unidades', 'setores'));
    }
    
    // AJAX - Criar período
    public function criarPeriodo(CriarPeriodoRequest $request)
    {
        $periodo = PeriodoDiagnostico::create($request->validated());
        
        // Sincronizar itens automaticamente
        $this->sincronizarItens($periodo);
        
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
        $periodo = $periodo_id ? PeriodoDiagnostico::findOrFail($periodo_id) : null;
        
        if (!$periodo && request()->route('periodo')) {
            $periodo = request()->route('periodo');
        }
        
        $itens = DB::table('items_diagnostico')
            ->where('deletado', 0)
            ->get();
        
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
        $setores = Setor::with('subsetores')->where('deletado', 0)->get();
        return response()->json($setores);
    }
    
    // AJAX - Obter unidades
    public function obterUnidades()
    {
        $unidades = Unidade::all();
        return response()->json($unidades);
    }
}
```

## 🎨 Frontend com Alpine.js

### Componente Principal
```javascript
// Resources/assets/js/diagnostico.js
document.addEventListener('alpine:init', () => {
    Alpine.data('diagnostico', () => ({
        // Estado
        unidadeSelecionada: null,
        periodoSelecionado: null,
        setorSelecionado: null,
        subsetorSelecionado: null,
        carregando: false,
        
        // Dados
        unidades: [],
        periodos: [],
        setores: [],
        subsetores: [],
        itens: [],
        progresso: {},
        
        // Inicialização
        async init() {
            await this.carregarDados();
            
            // Watchers
            this.$watch('unidadeSelecionada', () => this.carregarPeriodos());
            this.$watch('periodoSelecionado', () => this.atualizarProgresso());
            this.$watch('setorSelecionado', () => {
                this.carregarSubsetores();
                this.carregarItens();
            });
            this.$watch('subsetorSelecionado', () => this.carregarItens());
        },
        
        async carregarDados() {
            this.carregando = true;
            try {
                const [unidadesRes, setoresRes] = await Promise.all([
                    fetch('/diagnostico/unidades'),
                    fetch('/diagnostico/setores')
                ]);
                
                this.unidades = await unidadesRes.json();
                this.setores = await setoresRes.json();
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                this.carregando = false;
            }
        },
        
        async carregarPeriodos() {
            if (!this.unidadeSelecionada) return;
            
            try {
                const response = await fetch(`/diagnostico/periodos?unidade_id=${this.unidadeSelecionada}`);
                this.periodos = await response.json();
            } catch (error) {
                console.error('Erro ao carregar períodos:', error);
            }
        },
        
        carregarSubsetores() {
            if (!this.setorSelecionado) {
                this.subsetores = [];
                return;
            }
            
            const setor = this.setores.find(s => s.id == this.setorSelecionado);
            this.subsetores = setor?.subsetores || [];
        },
        
        async carregarItens() {
            if (!this.periodoSelecionado || !this.setorSelecionado) return;
            
            this.carregando = true;
            try {
                const params = new URLSearchParams({
                    periodo_id: this.periodoSelecionado,
                    setor_id: this.setorSelecionado,
                    ...(this.subsetorSelecionado && { subsetor_id: this.subsetorSelecionado })
                });
                
                const response = await fetch(`/diagnostico/itens?${params}`);
                const data = await response.json();
                this.itens = data.data;
            } catch (error) {
                console.error('Erro ao carregar itens:', error);
            } finally {
                this.carregando = false;
            }
        },
        
        async salvarAvaliacao(item, resultado, observacoes = '') {
            try {
                const response = await fetch('/diagnostico/avaliar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        id_periodo_diagnostico: this.periodoSelecionado,
                        item_diagnostico_id: item.id,
                        unidade_id: this.unidadeSelecionada,
                        setor_id: this.setorSelecionado,
                        subsetor_id: this.subsetorSelecionado,
                        item: item.nome_item,
                        avaliacao_resultado: resultado,
                        observacoes
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.mostrarSucesso('Avaliação salva!');
                    await this.carregarItens();
                    await this.atualizarProgresso();
                } else {
                    this.mostrarErro(data.message);
                }
            } catch (error) {
                this.mostrarErro('Erro ao salvar avaliação');
            }
        },
        
        async sincronizar() {
            if (!this.periodoSelecionado) return;
            
            try {
                const response = await fetch(`/diagnostico/sincronizar/${this.periodoSelecionado}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.mostrarSucesso(data.message);
                    await this.carregarItens();
                }
            } catch (error) {
                this.mostrarErro('Erro ao sincronizar');
            }
        },
        
        async atualizarProgresso() {
            if (!this.periodoSelecionado) return;
            
            try {
                const response = await fetch(`/diagnostico/progresso/${this.periodoSelecionado}`);
                const data = await response.json();
                this.progresso = data.data;
            } catch (error) {
                console.error('Erro ao carregar progresso:', error);
            }
        },
        
        mostrarSucesso(msg) {
            // Implementar toast
            alert('Sucesso: ' + msg);
        },
        
        mostrarErro(msg) {
            // Implementar toast
            alert('Erro: ' + msg);
        }
    }));
});
```

### View Principal
```php
{{-- Resources/views/index.blade.php --}}
@extends('layouts.app')

@section('content')
<div x-data="diagnostico" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Sistema de Diagnóstico Hospitalar
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Avaliação de qualidade hospitalar
            </p>
        </div>
        
        <button @click="sincronizar()" 
                :disabled="!periodoSelecionado"
                class="btn btn-primary">
            Sincronizar Itens
        </button>
    </div>
    
    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <!-- Unidade -->
        <select x-model="unidadeSelecionada" class="select select-bordered">
            <option value="">Selecione Unidade</option>
            <template x-for="unidade in unidades">
                <option :value="unidade.id" x-text="unidade.unidade"></option>
            </template>
        </select>
        
        <!-- Período -->
        <select x-model="periodoSelecionado" class="select select-bordered" :disabled="!unidadeSelecionada">
            <option value="">Selecione Período</option>
            <template x-for="periodo in periodos">
                <option :value="periodo.id">
                    <span x-text="`${periodo.data_inicio} - ${periodo.data_fim}`"></span>
                    <span x-show="periodo.is_frozen" class="text-warning">(Congelado)</span>
                </option>
            </template>
        </select>
        
        <!-- Setor -->
        <select x-model="setorSelecionado" class="select select-bordered" :disabled="!periodoSelecionado">
            <option value="">Selecione Setor</option>
            <template x-for="setor in setores">
                <option :value="setor.id" x-text="setor.nome"></option>
            </template>
        </select>
        
        <!-- Subsetor -->
        <select x-model="subsetorSelecionado" class="select select-bordered" :disabled="!setorSelecionado">
            <option value="">Todos Subsetores</option>
            <template x-for="subsetor in subsetores">
                <option :value="subsetor.id" x-text="subsetor.nome"></option>
            </template>
        </select>
    </div>
    
    <!-- Progresso -->
    <div x-show="periodoSelecionado" class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Total</div>
            <div class="stat-value text-primary" x-text="progresso.total || 0"></div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Conformes</div>
            <div class="stat-value text-success" x-text="progresso.conformes || 0"></div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Não Conformes</div>
            <div class="stat-value text-error" x-text="progresso.nao_conformes || 0"></div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Parciais</div>
            <div class="stat-value text-warning" x-text="progresso.parciais || 0"></div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Progresso</div>
            <div class="stat-value" x-text="(progresso.percentual || 0) + '%'"></div>
        </div>
    </div>
    
    <!-- Tabela de Itens -->
    <div x-show="setorSelecionado" class="overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Subsetor</th>
                    <th>Status</th>
                    <th>Observações</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <template x-for="item in itens">
                    <tr>
                        <td x-text="item.nome_item" class="max-w-md"></td>
                        <td x-text="item.subsetor_nome || 'N/A'"></td>
                        <td>
                            <div class="badge" 
                                 :class="{
                                     'badge-success': item.avaliacao_resultado === 'conforme',
                                     'badge-error': item.avaliacao_resultado === 'nao_conforme',
                                     'badge-warning': item.avaliacao_resultado === 'parcialmente_conforme'
                                 }">
                                <span x-text="item.avaliacao_resultado || 'Pendente'"></span>
                            </div>
                        </td>
                        <td x-text="item.observacoes || '-'" class="max-w-xs truncate"></td>
                        <td>
                            <div class="dropdown">
                                <label tabindex="0" class="btn btn-sm">Avaliar</label>
                                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a @click="salvarAvaliacao(item, 'conforme')">Conforme</a></li>
                                    <li><a @click="salvarAvaliacao(item, 'nao_conforme')">Não Conforme</a></li>
                                    <li><a @click="salvarAvaliacao(item, 'parcialmente_conforme')">Parcial</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
    
    <!-- Loading -->
    <div x-show="carregando" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('modules/diagnosticohospitalar/js/diagnostico.js') }}"></script>
@endpush
```

## 🔐 Controle de Acesso (Spatie)

### Permissions
```php
// Database/Seeders/DiagnosticoPermissionsSeeder.php
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
```

## 📍 Rotas MVC Básicas

### Routes/web.php
```php
Route::middleware(['auth', 'permission:diagnostico.view'])->prefix('diagnostico')->name('diagnostico.')->group(function () {
    // VIEW Principal
    Route::get('/', [DiagnosticoController::class, 'index'])->name('index');
    
    // AJAX Routes
    Route::get('/unidades', [DiagnosticoController::class, 'obterUnidades'])->name('unidades');
    Route::get('/setores', [DiagnosticoController::class, 'obterSetores'])->name('setores');
    Route::get('/periodos', [DiagnosticoController::class, 'obterPeriodos'])->name('periodos');
    Route::get('/itens', [DiagnosticoController::class, 'obterItens'])->name('itens');
    Route::get('/progresso/{periodo}', [DiagnosticoController::class, 'obterProgresso'])->name('progresso');
    
    Route::post('/avaliar', [DiagnosticoController::class, 'salvarAvaliacao'])->name('avaliar');
    Route::post('/sincronizar/{periodo}', [DiagnosticoController::class, 'sincronizarItens'])->name('sincronizar');
    Route::post('/periodos', [DiagnosticoController::class, 'criarPeriodo'])->name('periodos.criar');
});
```

## 📋 Cronograma de Migração

### Semana 1: Setup
- ✅ Criar módulo Nwidart
- ✅ Configurar models para tabelas existentes
- ✅ Setup permissions Spatie

### Semana 2: Backend
- ✅ Implementar controllers
- ✅ Criar rotas API
- ✅ Testes básicos

### Semana 3: Frontend
- ✅ Setup Alpine.js
- ✅ Criar interface principal
- ✅ Integração com Tailwind/Preline

### Semana 4: Testes e Deploy
- ✅ Testes finais
- ✅ Migração de dados (se necessário)
- ✅ Deploy

## ✅ Checklist de Migração

### Setup Inicial
- [ ] Instalar Nwidart Modules
- [ ] Criar módulo DiagnosticoHospitalar
- [ ] Configurar models para tabelas existentes
- [ ] Setup Spatie permissions

### Backend
- [ ] Controller principal com métodos básicos
- [ ] API endpoints para CRUD
- [ ] Validações de request
- [ ] Testes unitários básicos

### Frontend
- [ ] Componente Alpine.js principal
- [ ] Interface com Tailwind + Preline
- [ ] Integração com APIs
- [ ] Estados de loading

### Integração
- [ ] Rotas web e API
- [ ] Middleware de autorização
- [ ] Teste de fluxo completo
- [ ] Documentação básica

### Deploy
- [ ] Configuração em produção
- [ ] Backup do sistema antigo
- [ ] Testes finais
- [ ] Go-live

## 🎯 Resultado Final

Sistema moderno mantendo todas as funcionalidades:
- **Interface responsiva** com Tailwind + Preline
- **Interatividade** com Alpine.js
- **Backend robusto** com Laravel 12
- **Organização modular** com Nwidart
- **Segurança** com Spatie Permissions
- **Banco existente** preservado
- **Código enxuto** adequado para 1 dev