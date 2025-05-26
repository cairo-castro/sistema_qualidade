{{-- Partial: Tabela de Diagnósticos Recentes --}}
<div class="card">
    <div class="card-header">
        <h3 class="card-title">
            <i class="bi bi-list-ul me-2"></i>
            Diagnósticos Recentes
        </h3>
        
        <div class="card-tools">
            <!-- Filtros Rápidos -->
            <div class="btn-group btn-group-sm" role="group">
                <input type="radio" class="btn-check" name="status-filter" id="filter-all" value="all" checked>
                <label class="btn btn-outline-secondary" for="filter-all">Todos</label>

                <input type="radio" class="btn-check" name="status-filter" id="filter-pending" value="pending">
                <label class="btn btn-outline-warning" for="filter-pending">Pendentes</label>

                <input type="radio" class="btn-check" name="status-filter" id="filter-progress" value="in_progress">
                <label class="btn btn-outline-info" for="filter-progress">Em Andamento</label>

                <input type="radio" class="btn-check" name="status-filter" id="filter-completed" value="completed">
                <label class="btn btn-outline-success" for="filter-completed">Concluídos</label>
            </div>
            
            <!-- Botão de Atualização -->
            <button type="button" class="btn btn-tool" id="refresh-diagnostics">
                <i class="bi bi-arrow-clockwise"></i>
            </button>
            
            <!-- Botão de Collapse -->
            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                <i class="bi bi-dash"></i>
            </button>
        </div>
    </div>
    
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-striped table-hover mb-0" id="diagnostics-table">
                <thead class="table-light">
                    <tr>
                        <th width="80">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="select-all-diagnostics">
                                <label class="form-check-label" for="select-all-diagnostics">ID</label>
                            </div>
                        </th>
                        <th>Paciente</th>
                        <th>Tipo</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                        <th>Responsável</th>
                        <th>Data</th>
                        <th width="120">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($recentDiagnostics ?? [] as $diagnostic)
                        <tr class="diagnostic-row" 
                            data-diagnostic-id="{{ $diagnostic['id'] ?? 0 }}"
                            data-status="{{ $diagnostic['status'] ?? 'unknown' }}">
                            <td>
                                <div class="form-check">
                                    <input class="form-check-input diagnostic-checkbox" 
                                           type="checkbox" 
                                           value="{{ $diagnostic['id'] ?? 0 }}">
                                    <label class="form-check-label">
                                        #{{ $diagnostic['id'] ?? 'N/A' }}
                                    </label>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="https://ui-avatars.com/api/?name={{ urlencode($diagnostic['patient'] ?? 'N/A') }}&size=32" 
                                         class="img-circle me-2" 
                                         alt="Avatar"
                                         style="width: 32px; height: 32px;">
                                    <div>
                                        <strong>{{ $diagnostic['patient'] ?? 'N/A' }}</strong>
                                        @if(isset($diagnostic['patient_age']))
                                            <br><small class="text-muted">{{ $diagnostic['patient_age'] }} anos</small>
                                        @endif
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge bg-light text-dark">
                                    {{ $diagnostic['type'] ?? 'N/A' }}
                                </span>
                                @if(isset($diagnostic['category']))
                                    <br><small class="text-muted">{{ $diagnostic['category'] }}</small>
                                @endif
                            </td>
                            <td>
                                @php
                                    $priority = $diagnostic['priority'] ?? 'normal';
                                    $priorityClass = match($priority) {
                                        'high' => 'text-bg-danger',
                                        'medium' => 'text-bg-warning',
                                        'low' => 'text-bg-success',
                                        default => 'text-bg-secondary'
                                    };
                                    $priorityText = match($priority) {
                                        'high' => 'Alta',
                                        'medium' => 'Média',
                                        'low' => 'Baixa',
                                        default => 'Normal'
                                    };
                                @endphp
                                <span class="badge {{ $priorityClass }}">
                                    {{ $priorityText }}
                                </span>
                            </td>
                            <td>
                                <span class="badge {{ $diagnostic['status_class'] ?? 'bg-secondary' }}">
                                    {{ $diagnostic['status'] ?? 'N/A' }}
                                </span>
                                @if(isset($diagnostic['status_updated_at']))
                                    <br><small class="text-muted">{{ $diagnostic['status_updated_at'] }}</small>
                                @endif
                            </td>
                            <td>
                                @if(isset($diagnostic['responsible']))
                                    <div class="d-flex align-items-center">
                                        <img src="https://ui-avatars.com/api/?name={{ urlencode($diagnostic['responsible']) }}&size=24" 
                                             class="img-circle me-1" 
                                             alt="Responsável"
                                             style="width: 24px; height: 24px;">
                                        <small>{{ $diagnostic['responsible'] }}</small>
                                    </div>
                                @else
                                    <span class="text-muted">Não atribuído</span>
                                @endif
                            </td>
                            <td>
                                <span class="fw-bold">{{ $diagnostic['date'] ?? 'N/A' }}</span>
                                @if(isset($diagnostic['days_ago']))
                                    <br><small class="text-muted">{{ $diagnostic['days_ago'] }} dia(s) atrás</small>
                                @endif
                            </td>
                            <td>
                                <div class="btn-group btn-group-sm" role="group">
                                    <a href="javascript:void(0)" 
                                       class="btn btn-outline-primary btn-sm"
                                       title="Visualizar"
                                       onclick="alert('Visualizar diagnóstico #{{ $diagnostic['id'] ?? 0 }}')">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    
                                    @if(($diagnostic['status'] ?? '') !== 'completed')
                                        <a href="javascript:void(0)" 
                                           class="btn btn-outline-warning btn-sm"
                                           title="Editar"
                                           onclick="alert('Editar diagnóstico #{{ $diagnostic['id'] ?? 0 }}')">
                                            <i class="bi bi-pencil"></i>
                                        </a>
                                    @endif
                                    
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" 
                                                class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                                                data-bs-toggle="dropdown">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0)" onclick="alert('Gerando PDF para diagnóstico #{{ $diagnostic['id'] ?? 0 }}')">
                                                    <i class="bi bi-file-pdf me-2"></i>Gerar PDF
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item" href="javascript:void(0)" onclick="alert('Duplicando diagnóstico #{{ $diagnostic['id'] ?? 0 }}')">
                                                    <i class="bi bi-copy me-2"></i>Duplicar
                                                </a>
                                            </li>
                                            <li><hr class="dropdown-divider"></li>
                                            <li>
                                                <a class="dropdown-item text-danger" 
                                                   href="#" 
                                                   onclick="confirmDelete({{ $diagnostic['id'] ?? 0 }})">
                                                    <i class="bi bi-trash me-2"></i>Excluir
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="8" class="text-center py-4">
                                <div class="text-muted">
                                    <i class="bi bi-inbox display-4 mb-3"></i>
                                    <p class="mb-0">Nenhum diagnóstico encontrado</p>
                                    <small>Os diagnósticos aparecerão aqui conforme são criados</small>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <!-- Loading Overlay -->
        <div class="overlay" id="table-loading" style="display: none;">
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
            </div>
        </div>
    </div>
    
    @if(count($recentDiagnostics ?? []) > 0)
        <div class="card-footer">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <small class="text-muted">
                        Mostrando {{ count($recentDiagnostics ?? []) }} de {{ $totalDiagnostics ?? count($recentDiagnostics ?? []) }} diagnósticos
                    </small>
                </div>
                <div class="col-md-6 text-end">
                    <!-- Ações em Lote -->
                    <div class="btn-group btn-group-sm" id="bulk-actions" style="display: none;">
                        <button type="button" class="btn btn-outline-primary" onclick="bulkAssign()">
                            <i class="bi bi-person-plus me-1"></i>Atribuir
                        </button>
                        <button type="button" class="btn btn-outline-success" onclick="bulkUpdateStatus('completed')">
                            <i class="bi bi-check me-1"></i>Concluir
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="bulkDelete()">
                            <i class="bi bi-trash me-1"></i>Excluir
                        </button>
                    </div>
                    
                    <!-- Link para Ver Todos -->
                    <a href="javascript:void(0)" onclick="alert('Ver todos os diagnósticos')" class="btn btn-primary btn-sm">
                        <i class="bi bi-list me-1"></i>Ver Todos os Diagnósticos
                    </a>
                </div>
            </div>
        </div>
    @endif
</div>

{{-- Script para interações da tabela --}}
@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Controle de seleção de checkboxes
    const selectAllCheckbox = document.getElementById('select-all-diagnostics');
    const diagnosticCheckboxes = document.querySelectorAll('.diagnostic-checkbox');
    const bulkActions = document.getElementById('bulk-actions');
    
    // Select All functionality
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            diagnosticCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            toggleBulkActions();
        });
    }
    
    // Individual checkbox change
    diagnosticCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllState();
            toggleBulkActions();
        });
    });
    
    // Atualiza estado do select all
    function updateSelectAllState() {
        const checkedCount = document.querySelectorAll('.diagnostic-checkbox:checked').length;
        const totalCount = diagnosticCheckboxes.length;
        
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === totalCount;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;
        }
    }
    
    // Mostra/esconde ações em lote
    function toggleBulkActions() {
        const checkedCount = document.querySelectorAll('.diagnostic-checkbox:checked').length;
        if (bulkActions) {
            bulkActions.style.display = checkedCount > 0 ? 'inline-flex' : 'none';
        }
    }
    
    // Filtros de status
    document.querySelectorAll('input[name="status-filter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            filterByStatus(this.value);
        });
    });
    
    // Filtra diagnósticos por status
    function filterByStatus(status) {
        const rows = document.querySelectorAll('.diagnostic-row');
        
        rows.forEach(row => {
            if (status === 'all' || row.dataset.status === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Atualiza contador
        const visibleRows = document.querySelectorAll('.diagnostic-row[style=""], .diagnostic-row:not([style])');
        console.log(`Mostrando ${visibleRows.length} diagnósticos (filtro: ${status})`);
    }
    
    // Refresh da tabela
    const refreshBtn = document.getElementById('refresh-diagnostics');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            refreshDiagnosticsTable();
        });
    }
    
    // Função para atualizar tabela
    function refreshDiagnosticsTable() {
        const loading = document.getElementById('table-loading');
        const refreshIcon = document.querySelector('#refresh-diagnostics i');
        
        if (loading) loading.style.display = 'block';
        if (refreshIcon) {
            refreshIcon.classList.add('spin');
        }
        
        // Simular atualização para demo
        setTimeout(() => {
            // Aqui apenas simulamos uma atualização
            alert('Tabela atualizada com sucesso!');
            console.log('Tabela de diagnósticos atualizada (simulação)');
            
            if (loading) loading.style.display = 'none';
            if (refreshIcon) {
                refreshIcon.classList.remove('spin');
            }
        }, 1000);
        
        // A parte abaixo está comentada porque é apenas para demo
        /*
        fetch('/dashboard/diagnostics', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.html) {
                const tbody = document.querySelector('#diagnostics-table tbody');
                if (tbody) {
                    tbody.innerHTML = data.html;
                    // Reattach event listeners aos novos elementos
                    attachTableEventListeners();
                }
                console.log('Tabela de diagnósticos atualizada');
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar tabela:', error);
        })
        .finally(() => {
            if (loading) loading.style.display = 'none';
            if (refreshIcon) {
                refreshIcon.classList.remove('spin');
            }
        });
        */
    }
    
    // Reattach event listeners após AJAX
    function attachTableEventListeners() {
        // Re-implementar os event listeners para os novos elementos
        console.log('Event listeners reattached');
    }
});    // Funções para ações em lote
function bulkAssign() {
    const selected = getSelectedDiagnostics();
    if (selected.length === 0) {
        alert('Selecione ao menos um diagnóstico');
        return;
    }
    
    // Esta é uma versão de demonstração
    alert(`Atribuir ${selected.length} diagnóstico(s) a um responsável`);
    console.log('Atribuir diagnósticos:', selected);
}

function bulkUpdateStatus(status) {
    const selected = getSelectedDiagnostics();
    if (selected.length === 0) {
        alert('Selecione ao menos um diagnóstico');
        return;
    }
    
    if (confirm(`Alterar status de ${selected.length} diagnóstico(s) para ${status}?`)) {
        // Esta é uma versão de demonstração
        alert(`Status alterado para ${selected.length} diagnóstico(s)`);
        console.log('Atualizar status:', selected, 'para:', status);
    }
}

function bulkDelete() {
    const selected = getSelectedDiagnostics();
    if (selected.length === 0) {
        alert('Selecione ao menos um diagnóstico');
        return;
    }
    
    if (confirm(`Excluir ${selected.length} diagnóstico(s) selecionado(s)? Esta ação não pode ser desfeita.`)) {
        // Esta é uma versão de demonstração
        alert(`${selected.length} diagnóstico(s) excluído(s) com sucesso`);
        console.log('Excluir diagnósticos:', selected);
    }
}

function confirmDelete(id) {
    if (confirm('Tem certeza que deseja excluir este diagnóstico? Esta ação não pode ser desfeita.')) {
        // Esta é uma versão de demonstração
        alert(`Diagnóstico #${id} excluído com sucesso`);
        console.log('Excluir diagnóstico:', id);
    }
}

function getSelectedDiagnostics() {
    const checkboxes = document.querySelectorAll('.diagnostic-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}
</script>
@endpush