{{-- Partial: Status do Sistema --}}
<div class="card">
    <div class="card-header">
        <h3 class="card-title">
            <i class="bi bi-server me-2"></i>
            Status do Sistema
        </h3>
        
        <div class="card-tools">
            <span class="badge {{ ($systemStatus['overall'] ?? 'unknown') === 'healthy' ? 'bg-success' : 'bg-warning' }}">
                {{ ($systemStatus['overall'] ?? 'unknown') === 'healthy' ? 'Online' : 'Atenção' }}
            </span>
        </div>
    </div>
    
    <div class="card-body">
        <!-- Status Geral -->
        <div class="row mb-3">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">Status Geral</span>
                    <div class="d-flex align-items-center">
                        <div class="status-indicator {{ ($systemStatus['overall'] ?? 'unknown') === 'healthy' ? 'bg-success' : 'bg-warning' }}"></div>
                        <span class="ms-2">{{ ucfirst($systemStatus['overall'] ?? 'Desconhecido') }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Métricas de Performance -->
        <div class="row g-3">
            <!-- CPU Usage -->
            <div class="col-6">
                <div class="text-center">
                    <div class="progress-circle" data-progress="{{ $systemMetrics['cpu'] ?? 0 }}">
                        <span class="progress-value">{{ $systemMetrics['cpu'] ?? 0 }}%</span>
                    </div>
                    <small class="text-muted d-block mt-1">CPU</small>
                </div>
            </div>
            
            <!-- Memory Usage -->
            <div class="col-6">
                <div class="text-center">
                    <div class="progress-circle" data-progress="{{ $systemMetrics['memory'] ?? 0 }}">
                        <span class="progress-value">{{ $systemMetrics['memory'] ?? 0 }}%</span>
                    </div>
                    <small class="text-muted d-block mt-1">Memória</small>
                </div>
            </div>
        </div>
        
        <!-- Detalhes dos Serviços -->
        <hr class="my-3">
        
        <div class="services-status">
            @php
                $services = $systemServices ?? [
                    'database' => ['name' => 'Banco de Dados', 'status' => 'online', 'response_time' => '2ms'],
                    'cache' => ['name' => 'Cache', 'status' => 'online', 'response_time' => '1ms'],
                    'storage' => ['name' => 'Armazenamento', 'status' => 'online', 'usage' => '45%'],
                    'queue' => ['name' => 'Filas', 'status' => 'online', 'pending' => 0]
                ];
            @endphp
            
            @foreach($services as $key => $service)
                <div class="d-flex justify-content-between align-items-center mb-2 service-item" 
                     data-service="{{ $key }}">
                    <div class="d-flex align-items-center">
                        <div class="service-status-dot {{ $service['status'] === 'online' ? 'bg-success' : 'bg-danger' }}"></div>
                        <span class="ms-2">{{ $service['name'] }}</span>
                    </div>
                    <div class="text-end">
                        @if(isset($service['response_time']))
                            <small class="text-muted">{{ $service['response_time'] }}</small>
                        @elseif(isset($service['usage']))
                            <small class="text-muted">{{ $service['usage'] }}</small>
                        @elseif(isset($service['pending']))
                            <small class="text-muted">{{ $service['pending'] }} pendentes</small>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
        
        <!-- Informações do Servidor -->
        <hr class="my-3">
        
        <div class="server-info">
            <h6 class="fw-bold mb-2">Informações do Servidor</h6>
            
            <div class="row g-2 text-sm">
                <div class="col-6">
                    <strong>Laravel:</strong> {{ app()->version() }}
                </div>
                <div class="col-6">
                    <strong>PHP:</strong> {{ PHP_VERSION }}
                </div>
                <div class="col-6">
                    <strong>Uptime:</strong> {{ $serverInfo['uptime'] ?? 'N/A' }}
                </div>
                <div class="col-6">
                    <strong>Timezone:</strong> {{ config('app.timezone') }}
                </div>
            </div>
        </div>
        
        <!-- Alertas do Sistema -->
        @if(isset($systemAlerts) && count($systemAlerts) > 0)
            <hr class="my-3">
            
            <div class="system-alerts">
                <h6 class="fw-bold mb-2 text-warning">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    Alertas do Sistema
                </h6>
                
                @foreach($systemAlerts as $alert)
                    <div class="alert alert-{{ $alert['type'] ?? 'warning' }} alert-sm mb-2" role="alert">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <strong>{{ $alert['title'] ?? 'Alerta' }}</strong>
                                @if(isset($alert['message']))
                                    <br><small>{{ $alert['message'] }}</small>
                                @endif
                            </div>
                            @if(isset($alert['action_url']))
                                <a href="{{ $alert['action_url'] }}" class="btn btn-sm btn-outline-{{ $alert['type'] ?? 'warning' }}">
                                    Resolver
                                </a>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
    
    <div class="card-footer">
        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                <i class="bi bi-clock me-1"></i>
                Última verificação: {{ $lastCheck ?? now()->format('H:i:s') }}
            </small>
            
            <button type="button" class="btn btn-sm btn-outline-primary" id="refresh-system-status">
                <i class="bi bi-arrow-clockwise"></i>
                Atualizar
            </button>
        </div>
    </div>
</div>

<!-- Card de Estatísticas do Banco -->
<div class="card mt-3">
    <div class="card-header">
        <h3 class="card-title">
            <i class="bi bi-database me-2"></i>
            Estatísticas do Banco
        </h3>
    </div>
    
    <div class="card-body">
        @php
            $dbStats = $databaseStats ?? [
                'total_tables' => 15,
                'total_records' => 1542,
                'database_size' => '12.5 MB',
                'connections' => 3,
                'slow_queries' => 0
            ];
        @endphp
        
        <div class="row g-3">
            <div class="col-6 text-center">
                <div class="metric-card">
                    <div class="metric-value">{{ $dbStats['total_tables'] }}</div>
                    <div class="metric-label">Tabelas</div>
                </div>
            </div>
            
            <div class="col-6 text-center">
                <div class="metric-card">
                    <div class="metric-value">{{ number_format($dbStats['total_records']) }}</div>
                    <div class="metric-label">Registros</div>
                </div>
            </div>
            
            <div class="col-6 text-center">
                <div class="metric-card">
                    <div class="metric-value">{{ $dbStats['database_size'] }}</div>
                    <div class="metric-label">Tamanho</div>
                </div>
            </div>
            
            <div class="col-6 text-center">
                <div class="metric-card">
                    <div class="metric-value">{{ $dbStats['connections'] }}</div>
                    <div class="metric-label">Conexões</div>
                </div>
            </div>
        </div>
        
        @if($dbStats['slow_queries'] > 0)
            <div class="alert alert-warning mt-3 mb-0" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Atenção:</strong> {{ $dbStats['slow_queries'] }} consulta(s) lenta(s) detectada(s).
            </div>
        @endif
    </div>
</div>

{{-- CSS para o componente de status --}}
@push('styles')
<style>
.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.service-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.progress-circle {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: conic-gradient(#007bff 0deg, #007bff calc(var(--progress) * 3.6deg), #e9ecef calc(var(--progress) * 3.6deg), #e9ecef 360deg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.progress-circle::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
}

.progress-value {
    position: relative;
    z-index: 1;
    font-weight: bold;
    font-size: 0.875rem;
}

.metric-card {
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    background: #f8f9fa;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #495057;
}

.metric-label {
    font-size: 0.875rem;
    color: #6c757d;
    margin-top: 0.25rem;
}

.alert-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
}

.service-item {
    padding: 0.25rem 0;
    border-bottom: 1px solid #f8f9fa;
}

.service-item:last-child {
    border-bottom: none;
}

@media (max-width: 768px) {
    .progress-circle {
        width: 50px;
        height: 50px;
    }
    
    .progress-circle::before {
        width: 34px;
        height: 34px;
    }
    
    .progress-value {
        font-size: 0.75rem;
    }
}
</style>
@endpush

{{-- Script para atualização do status --}}
@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Configura os círculos de progresso
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const progress = circle.dataset.progress || 0;
        circle.style.setProperty('--progress', progress);
        
        // Muda cor baseado no valor
        let color = '#28a745'; // Verde
        if (progress > 70) color = '#ffc107'; // Amarelo
        if (progress > 90) color = '#dc3545'; // Vermelho
        
        circle.style.background = `conic-gradient(${color} 0deg, ${color} calc(${progress} * 3.6deg), #e9ecef calc(${progress} * 3.6deg), #e9ecef 360deg)`;
    });
    
    // Atualiza display do status geral
    function updateStatusDisplay(status) {
        const statusBadge = document.querySelector('.card-tools .badge');
        const statusIndicator = document.querySelector('.status-indicator');
        
        if (statusBadge) {
            statusBadge.textContent = status.overall === 'healthy' ? 'Online' : 'Atenção';
            statusBadge.className = `badge ${status.overall === 'healthy' ? 'bg-success' : 'bg-warning'}`;
        }
        
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status.overall === 'healthy' ? 'bg-success' : 'bg-warning'}`;
        }
        
        // Atualiza timestamp
        const lastCheckElement = document.querySelector('.card-footer small');
        if (lastCheckElement) {
            const now = new Date();
            lastCheckElement.innerHTML = `<i class="bi bi-clock me-1"></i>Última verificação: ${now.toLocaleTimeString()}`;
        }
    }
    
    // Atualiza display das métricas
    function updateMetricsDisplay(metrics) {
        if (!metrics) return;
        
        // Atualiza círculos de progresso
        const cpuCircle = document.querySelector('[data-progress]');
        const memoryCircle = document.querySelectorAll('[data-progress]')[1];
        
        if (cpuCircle && metrics.cpu !== undefined) {
            updateProgressCircle(cpuCircle, metrics.cpu);
        }
        
        if (memoryCircle && metrics.memory !== undefined) {
            updateProgressCircle(memoryCircle, metrics.memory);
        }
    }
    
    // Atualiza círculo de progresso individual
    function updateProgressCircle(circle, value) {
        circle.dataset.progress = value;
        circle.querySelector('.progress-value').textContent = value + '%';
        circle.style.setProperty('--progress', value);
        
        // Atualiza cor
        let color = '#28a745'; // Verde
        if (value > 70) color = '#ffc107'; // Amarelo
        if (value > 90) color = '#dc3545'; // Vermelho
        
        circle.style.background = `conic-gradient(${color} 0deg, ${color} calc(${value} * 3.6deg), #e9ecef calc(${value} * 3.6deg), #e9ecef 360deg)`;
        
        // Animação suave
        circle.style.transition = 'background 0.5s ease';
    }
    
    // Atualiza status dos serviços
    function updateServicesDisplay(services) {
        if (!services) return;
        
        Object.keys(services).forEach(serviceKey => {
            const serviceItem = document.querySelector(`[data-service="${serviceKey}"]`);
            if (!serviceItem) return;
            
            const service = services[serviceKey];
            const statusDot = serviceItem.querySelector('.service-status-dot');
            
            if (statusDot) {
                statusDot.className = `service-status-dot ${service.status === 'online' ? 'bg-success' : 'bg-danger'}`;
            }
            
            // Atualiza informações adicionais
            const infoElement = serviceItem.querySelector('.text-end small');
            if (infoElement) {
                if (service.response_time) {
                    infoElement.textContent = service.response_time;
                } else if (service.usage) {
                    infoElement.textContent = service.usage;
                } else if (service.pending !== undefined) {
                    infoElement.textContent = service.pending + ' pendentes';
                }
            }
        });
    }
    
    // Detecta problemas críticos e mostra alertas
    function checkCriticalAlerts(metrics) {
        if (!metrics) return;
        
        const alerts = [];
        
        if (metrics.cpu > 90) {
            alerts.push({
                type: 'danger',
                title: 'CPU Crítica',
                message: `Uso de CPU em ${metrics.cpu}%`
            });
        }
        
        if (metrics.memory > 95) {
            alerts.push({
                type: 'danger',
                title: 'Memória Crítica',
                message: `Uso de memória em ${metrics.memory}%`
            });
        }
        
        // Mostra alertas se houver
        if (alerts.length > 0) {
            showSystemAlerts(alerts);
        }
    }
    
    // Mostra alertas do sistema
    function showSystemAlerts(alerts) {
        alerts.forEach(alert => {
            // Cria notificação toast ou modal
            if (typeof showToast === 'function') {
                showToast(alert.message, alert.type);
            } else {
                console.warn('Alerta do Sistema:', alert.title, '-', alert.message);
            }
        });
    }
    
    // Monitor de conectividade
    let isOnline = navigator.onLine;
    
    window.addEventListener('online', function() {
        if (!isOnline) {
            isOnline = true;
            updateSystemStatus();
            console.log('Conexão restaurada - atualizando status');
        }
    });
    
    window.addEventListener('offline', function() {
        isOnline = false;
        clearInterval(statusUpdateInterval);
        console.log('Conexão perdida - pausando atualizações');
        
        // Mostra status offline
        const statusBadge = document.querySelector('.card-tools .badge');
        if (statusBadge) {
            statusBadge.textContent = 'Offline';
            statusBadge.className = 'badge bg-danger';
        }
    });
    
    // Cleanup ao sair da página
    window.addEventListener('beforeunload', function() {
        if (statusUpdateInterval) {
            clearInterval(statusUpdateInterval);
        }
    });
    
    // Inicia verificação inicial
    setTimeout(() => {
        updateSystemStatus();
    }, 1000);
});

// Função auxiliar para mostrar notificações
function showToast(message, type = 'info') {
    // Se você tem um sistema de toast/notification, use aqui
    // Caso contrário, log no console
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Exemplo de implementação básica com alert (substitua por sistema próprio)
    if (type === 'danger') {
        alert(`⚠️ ${message}`);
    }
}

// Monitora performance da página
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                const loadTime = entry.loadEventEnd - entry.loadEventStart;
                if (loadTime > 3000) { // Mais de 3 segundos
                    console.warn('Página carregou lentamente:', loadTime + 'ms');
                }
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}
</script>
@endpush