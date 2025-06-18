# Módulo DiagnosticoHospitalar

Módulo de migração do Sistema de Diagnóstico Hospitalar para o Laravel 12.

## Estrutura do Módulo

A migração segue uma estrutura MVC (Model-View-Controller):

```
Modules/DiagnosticoHospitalar/
├── Models/
│   ├── Unidade.php
│   ├── Setor.php
│   ├── Subsetor.php
│   ├── PeriodoDiagnostico.php
│   ├── ItemDiagnostico.php
│   ├── Diagnostico.php
│   └── ProblemaDiagnostico.php
├── Http/
│   ├── Controllers/
│   │   └── DiagnosticoController.php
│   └── Requests/
│       ├── CriarPeriodoRequest.php
│       └── SalvarAvaliacaoRequest.php
├── resources/
│   ├── js/
│   │   └── diagnostico.js
│   └── views/
│       └── index.blade.php
├── routes/
│   └── web.php
└── database/
    └── seeders/
        ├── DiagnosticoHospitalarDatabaseSeeder.php
        └── DiagnosticoPermissionsSeeder.php
```

## Banco de Dados

O módulo utiliza as tabelas existentes do sistema antigo:

- `unidade`
- `setores`
- `subsetores`
- `periodo_diagnostico`
- `items_diagnostico`
- `diagnostico`
- `problemas_diagnostico`

## Permissões (Spatie Laravel Permission)

As seguintes permissões são definidas:

- `diagnostico.view` - Visualizar o sistema de diagnóstico
- `diagnostico.edit` - Editar avaliações
- `diagnostico.periodo.create` - Criar períodos de diagnóstico
- `diagnostico.periodo.sync` - Sincronizar itens de diagnóstico
- `diagnostico.relatorio.view` - Visualizar relatórios

## Funções Principais

1. **Gestão de Períodos**
   - Criação de períodos de diagnóstico
   - Definição de períodos congelados/dinâmicos
   - Sincronização de itens

2. **Avaliação de Itens**
   - Visualização de itens por setor/subsetor
   - Registro de avaliações (conforme, não conforme, parcial, N/A)
   - Registro de problemas para itens não conformes

3. **Relatórios e Progresso**
   - Visualização do progresso por período
   - Estatísticas de conformidade

## Frontend

- Interface baseada em Alpine.js
- Estilos com Tailwind CSS e componentes DaisyUI
- Comunicação AJAX com backend

## Rotas

Todas as rotas são agrupadas sob o prefixo `/diagnostico` e protegidas pela permissão `diagnostico.view`:

- `GET /diagnostico` - Página principal
- `GET /diagnostico/unidades` - Lista de unidades
- `GET /diagnostico/setores` - Lista de setores
- `GET /diagnostico/periodos` - Períodos por unidade
- `GET /diagnostico/itens` - Itens por setor/período
- `GET /diagnostico/progresso/{periodo}` - Progresso do período
- `POST /diagnostico/avaliar` - Salvar avaliação
- `POST /diagnostico/sincronizar/{periodo}` - Sincronizar itens
- `POST /diagnostico/periodos` - Criar período

## Instalação

1. Execute o seeder para criar as permissões:
   ```bash
   php artisan module:seed DiagnosticoHospitalar
   ```

2. Compilar os assets:
   ```bash
   npm run build
   ```

3. Acessar o sistema via `/diagnostico`
