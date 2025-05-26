{{-- Cards de Estatísticas Principais --}}
<div class="row statistics-row">
    <!-- Total de Usuários -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-info" 
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="total-users" data-stat-value="{{ $totalUsers ?? 0 }}">
                    {{ number_format($totalUsers ?? 0) }}
                </h3>
                <p>Total de Usuários</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-people"></i>
            </div>
            <a href="#" class="small-box-footer">
                Mais informações <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>

    <!-- Diagnósticos do Mês -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-success"
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="monthly-diagnostics" data-stat-value="{{ $monthlyDiagnostics ?? 0 }}">
                    {{ number_format($monthlyDiagnostics ?? 0) }}
                </h3>
                <p>Diagnósticos do Mês</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-heart-pulse"></i>
            </div>
            <a href="#" class="small-box-footer">
                Ver diagnósticos <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>

    <!-- Taxa de Conclusão -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-warning"
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="completion-rate" data-stat-value="{{ $completionRate ?? 0 }}">
                    {{ number_format($completionRate ?? 0, 1) }}%
                </h3>
                <p>Taxa de Conclusão</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-graph-up"></i>
            </div>
            <a href="#" class="small-box-footer">
                Ver relatório <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>

    <!-- Pendências -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-danger"
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="pending-items" data-stat-value="{{ $pendingItems ?? 0 }}">
                    {{ number_format($pendingItems ?? 0) }}
                </h3>
                <p>Pendências</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-exclamation-triangle"></i>
            </div>
            <a href="#" class="small-box-footer">
                Ver pendências <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>
</div>

{{-- Botão de Atualização das Estatísticas --}}
<div class="row mt-3 mb-3">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                <i class="bi bi-info-circle"></i>
                Última atualização: {{ $lastUpdate ?? now()->format('d/m/Y H:i:s') }}
            </small>
            
            <button type="button" class="btn btn-sm btn-outline-primary" id="refresh-dashboard">
                <i class="bi bi-arrow-clockwise"></i> Atualizar
            </button>
        </div>
    </div>
</div>
            <div class="small-box-icon">
                <i class="bi bi-people"></i>
            </div>
            <a href="#" class="small-box-footer">
                Mais informações <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>

    <!-- Diagnósticos do Mês -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-success"
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="monthly-diagnostics" data-stat-value="{{ $monthlyDiagnostics ?? 0 }}">
                    {{ number_format($monthlyDiagnostics ?? 0) }}
                </h3>
                <p>Diagnósticos do Mês</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-heart-pulse"></i>
            </div>
            <a href="#" class="small-box-footer">
                Ver diagnósticos <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>

    <!-- Taxa de Conclusão -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-warning"
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="completion-rate" data-stat-value="{{ $completionRate ?? 0 }}">
                    {{ number_format($completionRate ?? 0, 1) }}%
                </h3>
                <p>Taxa de Conclusão</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-graph-up"></i>
            </div>
            <a href="#" class="small-box-footer">
                Ver relatório <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>

    <!-- Pendências -->
    <div class="col-lg-3 col-6">
        <div class="small-box text-bg-danger"
             data-stats-managed="false"
             data-auto-refresh="false">
            <div class="inner">
                <h3 id="pending-items" data-stat-value="{{ $pendingItems ?? 0 }}">
                    {{ number_format($pendingItems ?? 0) }}
                </h3>
                <p>Pendências</p>
            </div>
            <div class="small-box-icon">
                <i class="bi bi-exclamation-triangle"></i>
            </div>
            <a href="#" class="small-box-footer">
                Ver pendências <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>
</div>

{{-- Botão de Atualização das Estatísticas --}}
<div class="row mt-3 mb-3">
    <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
                <i class="bi bi-info-circle"></i>
                Última atualização: {{ $lastUpdate ?? now()->format('d/m/Y H:i:s') }}
            </small>
            
            <button type="button" class="btn btn-sm btn-outline-primary" id="refresh-dashboard">
                <i class="bi bi-arrow-clockwise"></i> Atualizar
            </button>
        </div>
    </div>
</div>