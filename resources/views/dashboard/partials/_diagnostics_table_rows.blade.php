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
            <div class="btn-group btn-group-sm" role="group">                <a href="javascript:void(0)" 
                    class="btn btn-outline-primary btn-sm"
                    title="Visualizar"
                    onclick="alert('Visualizar diagnóstico #{{ $diagnostic['id'] ?? 0 }}')">
                    <i class="bi bi-eye"></i>
                </a>
                
                @if(($diagnostic['status'] ?? '') !== 'Concluído')
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
                    <ul class="dropdown-menu">                        <li>
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
