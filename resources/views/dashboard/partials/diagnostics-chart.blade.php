{{-- Partial: Gráfico de Diagnósticos --}}
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">
            <i class="bi bi-graph-up me-2"></i>
            Diagnósticos por Período
        </h3>
        
        <div class="card-tools">
            <!-- Seletor de Período -->
            <div class="btn-group btn-group-sm" role="group">
                <input type="radio" class="btn-check" name="chart-period" id="period-week" value="week">
                <label class="btn btn-outline-primary" for="period-week">Semana</label>

                <input type="radio" class="btn-check" name="chart-period" id="period-month" value="month" checked>
                <label class="btn btn-outline-primary" for="period-month">Mês</label>

                <input type="radio" class="btn-check" name="chart-period" id="period-year" value="year">
                <label class="btn btn-outline-primary" for="period-year">Ano</label>
            </div>
            
            <!-- Botão de Fullscreen -->
            <button type="button" class="btn btn-tool" data-lte-toggle="card-fullscreen">
                <i class="bi bi-arrows-fullscreen"></i>
            </button>
            
            <!-- Botão de Collapse -->
            <button type="button" class="btn btn-tool" data-lte-toggle="card-collapse">
                <i class="bi bi-dash"></i>
            </button>
        </div>
    </div>
    
    <div class="card-body">
        <div class="chart-container">
            <canvas id="diagnosticsChart" style="height: 300px; max-height: 300px;"></canvas>
        </div>
        
        <!-- Loading Overlay -->
        <div class="overlay" id="chart-loading" style="display: none;">
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="card-footer">
        <div class="row">
            <div class="col-sm-3 col-6">
                <div class="description-block border-end">
                    <h5 class="description-header" id="chart-total">
                        {{ array_sum($chartData ?? []) }}
                    </h5>
                    <span class="description-text">TOTAL GERAL</span>
                </div>
            </div>
            
            <div class="col-sm-3 col-6">
                <div class="description-block border-end">
                    <h5 class="description-header text-success" id="chart-avg">
                        {{ count($chartData ?? []) > 0 ? round(array_sum($chartData ?? []) / count($chartData ?? []), 1) : 0 }}
                    </h5>
                    <span class="description-text">MÉDIA</span>
                </div>
            </div>
            
            <div class="col-sm-3 col-6">
                <div class="description-block border-end">
                    <h5 class="description-header text-warning" id="chart-max">
                        {{ max($chartData ?? [0]) }}
                    </h5>
                    <span class="description-text">MÁXIMO</span>
                </div>
            </div>
            
            <div class="col-sm-3 col-6">
                <div class="description-block">
                    <h5 class="description-header text-info" id="chart-trend">
                        @php
                            $data = $chartData ?? [0];
                            $trend = count($data) > 1 ? 
                                ($data[count($data)-1] > $data[count($data)-2] ? '+' : '-') : '='
                        @endphp
                        {{ $trend }}{{ abs(end($data) - prev($data)) }}
                    </h5>
                    <span class="description-text">TENDÊNCIA</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Script específico para o gráfico --}}
@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Configuração dos dados do gráfico
    const chartConfig = {
        week: {
            labels: {!! json_encode($weekLabels ?? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']) !!},
            data: {!! json_encode($weekData ?? [5, 8, 12, 7, 15, 10, 6]) !!}
        },
        month: {
            labels: {!! json_encode($chartLabels ?? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']) !!},
            data: {!! json_encode($chartData ?? [12, 19, 3, 5, 2, 3]) !!}
        },
        year: {
            labels: {!! json_encode($yearLabels ?? ['2020', '2021', '2022', '2023', '2024', '2025']) !!},
            data: {!! json_encode($yearData ?? [150, 200, 175, 300, 250, 400]) !!}
        }
    };
    
    // Atualiza gráfico quando período muda
    document.querySelectorAll('input[name="chart-period"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                updateChart(this.value);
            }
        });
    });
    
    function updateChart(period) {
        const loadingOverlay = document.getElementById('chart-loading');
        
        if (!chartConfig[period] || !window.diagnosticsChart) {
            return;
        }
        
        // Mostra loading
        loadingOverlay.style.display = 'block';
        
        setTimeout(() => {
            try {
                // Atualiza dados do gráfico
                window.diagnosticsChart.data.labels = chartConfig[period].labels;
                window.diagnosticsChart.data.datasets[0].data = chartConfig[period].data;
                window.diagnosticsChart.update('active');
                
                // Atualiza estatísticas do footer
                updateChartStats(chartConfig[period].data);
                
                console.log('Gráfico atualizado para período:', period);
            } catch (error) {
                console.error('Erro ao atualizar gráfico:', error);
            } finally {
                // Esconde loading
                loadingOverlay.style.display = 'none';
            }
        }, 500);
    }
    
    function updateChartStats(data) {
        const total = data.reduce((a, b) => a + b, 0);
        const avg = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        const max = Math.max(...data);
        const trend = data.length > 1 ? 
            (data[data.length - 1] > data[data.length - 2] ? '+' : '-') : '=';
        const trendValue = data.length > 1 ? 
            Math.abs(data[data.length - 1] - data[data.length - 2]) : 0;
        
        // Atualiza elementos
        const totalElement = document.getElementById('chart-total');
        const avgElement = document.getElementById('chart-avg');
        const maxElement = document.getElementById('chart-max');
        const trendElement = document.getElementById('chart-trend');
        
        if (totalElement) totalElement.textContent = total;
        if (avgElement) avgElement.textContent = avg;
        if (maxElement) maxElement.textContent = max;
        if (trendElement) trendElement.textContent = trend + trendValue;
    }
});
</script>
@endpush