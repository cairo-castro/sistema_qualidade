{{-- Partial: Atividades Recentes --}}
<div class="card">
    <div class="card-header">
        <h3 class="card-title">
            <i class="bi bi-clock-history me-2"></i>
            Atividades Recentes
        </h3>
        
        <div class="card-tools">
            <span class="badge badge-primary">{{ count($recentActivities ?? []) }}</span>
            
            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                <i class="bi bi-dash"></i>
            </button>
        </div>
    </div>
    
    <div class="card-body p-0">
        <div class="activities-container">
            @forelse($recentActivities ?? [] as $activity)
                <div class="d-flex align-items-center p-3 border-bottom activity-item" 
                     data-activity-id="{{ $activity['id'] ?? $loop->index }}">
                    <div class="me-3">
                        <div class="activity-icon">
                            @switch($activity['type'] ?? 'default')
                                @case('user_created')
                                    <i class="bi bi-person-plus text-success"></i>
                                    @break
                                @case('diagnostic_created')
                                    <i class="bi bi-file-medical text-info"></i>
                                    @break
                                @case('diagnostic_completed')
                                    <i class="bi bi-check-circle text-success"></i>
                                    @break
                                @case('report_generated')
                                    <i class="bi bi-file-earmark-text text-warning"></i>
                                    @break
                                @case('user_login')
                                    <i class="bi bi-box-arrow-in-right text-primary"></i>
                                    @break
                                @case('system_update')
                                    <i class="bi bi-arrow-clockwise text-info"></i>
                                    @break
                                @default
                                    <i class="bi bi-circle-fill text-muted"></i>
                            @endswitch
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1 activity-title">
                            {{ $activity['title'] ?? 'Atividade sem título' }}
                        </h6>
                        <p class="mb-1 text-sm activity-description">
                            {{ $activity['description'] ?? 'Sem descrição disponível' }}
                        </p>
                        <small class="text-muted activity-time">
                            <i class="bi bi-clock me-1"></i>
                            {{ $activity['time'] ?? 'Agora' }}
                            @if(isset($activity['user']))
                                • por {{ $activity['user'] }}
                            @endif
                        </small>
                    </div>
                    @if(isset($activity['link']) && $activity['link'])
                        <div class="ms-2">
                            <a href="{{ $activity['link'] }}" class="btn btn-sm btn-outline-primary">
                                <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    @endif
                </div>
            @empty
                <div class="p-4 text-center text-muted">
                    <i class="bi bi-inbox display-4 mb-3"></i>
                    <p class="mb-0">Nenhuma atividade recente</p>
                    <small>As atividades aparecerão aqui conforme ocorrem</small>
                </div>
            @endforelse
        </div>
    </div>
    
    @if(count($recentActivities ?? []) > 0)
        <div class="card-footer text-center">
            <a href="javascript:void(0)" onclick="alert('Ver todas as atividades')" class="btn btn-sm btn-primary">
                <i class="bi bi-list me-1"></i>
                Ver Todas as Atividades
            </a>
        </div>
    @endif
</div>

{{-- Seção de Notificações Rápidas --}}
<div class="card mt-3">
    <div class="card-header">
        <h3 class="card-title">
            <i class="bi bi-bell me-2"></i>
            Notificações
        </h3>
        
        <div class="card-tools">
            <span class="badge badge-warning">{{ count($notifications ?? []) }}</span>
        </div>
    </div>
    
    <div class="card-body p-0">
        @forelse($notifications ?? [] as $notification)
            <div class="d-flex align-items-center p-3 border-bottom notification-item"
                 data-notification-id="{{ $notification['id'] ?? $loop->index }}">
                <div class="me-3">
                    @switch($notification['priority'] ?? 'low')
                        @case('high')
                            <i class="bi bi-exclamation-triangle text-danger"></i>
                            @break
                        @case('medium')
                            <i class="bi bi-info-circle text-warning"></i>
                            @break
                        @default
                            <i class="bi bi-bell text-info"></i>
                    @endswitch
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">{{ $notification['title'] ?? 'Notificação' }}</h6>
                    <p class="mb-1 text-sm">{{ $notification['message'] ?? 'Sem mensagem' }}</p>
                    <small class="text-muted">{{ $notification['time'] ?? 'Agora' }}</small>
                </div>
                @if(!($notification['read'] ?? false))
                    <div class="ms-2">
                        <span class="badge bg-primary">Novo</span>
                    </div>
                @endif
            </div>
        @empty
            <div class="p-4 text-center text-muted">
                <i class="bi bi-bell-slash display-4 mb-3"></i>
                <p class="mb-0">Nenhuma notificação</p>
                <small>Você está em dia!</small>
            </div>
        @endforelse
    </div>
    
    @if(count($notifications ?? []) > 0)
        <div class="card-footer text-center">
            <a href="javascript:void(0)" onclick="alert('Ver todas as notificações')" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-bell me-1"></i>
                Ver Todas
            </a>
            <button type="button" class="btn btn-sm btn-outline-success ms-2" id="mark-all-read">
                <i class="bi bi-check-all me-1"></i>
                Marcar como Lidas
            </button>
        </div>
    @endif
</div>

{{-- Script para interações das atividades --}}
@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Auto-refresh das atividades (se habilitado)
    const enableActivityRefresh = {{ $enableActivityRefresh ?? 'false' }};
    
    if (enableActivityRefresh) {
        setInterval(() => {
            refreshActivities();
        }, 60000); // 1 minuto
    }
    
    // Função para atualizar atividades
    function refreshActivities() {
        // Simulação para demo
        console.log('Atualizando atividades (simulação)...');
        
        setTimeout(() => {
            // Atividades fictícias para demo
            const mockActivities = [
                {
                    id: 1,
                    type: 'user_login',
                    title: 'Novo login',
                    description: 'Usuário acessou o sistema',
                    time: 'Agora mesmo',
                    user: 'Maria Silva'
                },
                {
                    id: 2,
                    type: 'diagnostic_created',
                    title: 'Diagnóstico criado',
                    description: 'Um novo diagnóstico foi registrado',
                    time: '5 min atrás',
                    user: 'João Costa'
                }
            ];
            
            updateActivitiesDisplay(mockActivities);
        }, 1000);
        
        /* Código original comentado para demo
        fetch('/dashboard/activities', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.activities) {
                updateActivitiesDisplay(data.activities);
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar atividades:', error);
        });
        */
    }
    
    // Atualiza display das atividades
    function updateActivitiesDisplay(activities) {
        const container = document.querySelector('.activities-container');
        if (!container) return;
        
        // Implementar lógica de atualização sem recarregar a página
        console.log('Atividades atualizadas:', activities.length);
    }
    
    // Marcar todas as notificações como lidas
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            if (confirm('Marcar todas as notificações como lidas?')) {
                // Simulação para demo
                setTimeout(() => {
                    // Simula uma resposta de sucesso
                    const data = { success: true };
                        // Remove badges "Novo"
                        document.querySelectorAll('.notification-item .badge').forEach(badge => {
                            if (badge.textContent === 'Novo') {
                                badge.remove();
                            }
                        });
                        
                        // Atualiza contador
                        const counter = document.querySelector('.card-title .badge');
                        if (counter) {
                            counter.textContent = '0';
                        }
                        
                        // Feedback visual
                        this.innerHTML = '<i class="bi bi-check me-1"></i> Marcadas!';
                        this.classList.remove('btn-outline-success');
                        this.classList.add('btn-success');
                        
                        setTimeout(() => {
                            this.innerHTML = '<i class="bi bi-check-all me-1"></i> Marcar como Lidas';
                            this.classList.remove('btn-success');
                            this.classList.add('btn-outline-success');
                        }, 2000);
                    }
                }, 500); // Simula um delay de processamento
            }
        });
    }
    
    // Animação para novas atividades
    function highlightNewActivity(element) {
        element.style.backgroundColor = '#e3f2fd';
        element.style.transform = 'scale(1.02)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.transform = '';
        }, 2000);
    }
    
    // Observer para novas atividades
    const activityObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE && 
                    node.classList.contains('activity-item')) {
                    highlightNewActivity(node);
                }
            });
        });
    });
    
    const activitiesContainer = document.querySelector('.activities-container');
    if (activitiesContainer) {
        activityObserver.observe(activitiesContainer, {
            childList: true
        });
    }
});
</script>
@endpush