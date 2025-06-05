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
            <!-- ApexCharts Container -->
            <div id="diagnosticsChartPartial"
                data-chart="line"
                class="w-100"
                style="min-height: 300px; height: 300px;">
                <!-- Loading placeholder -->
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center">
                        <div class="spinner-border text-primary mb-2" role="status">
                            <span class="visually-hidden">Carregando...</span>
                        </div>
                        <p class="text-muted small">Carregando gráfico ApexCharts...</p>
                    </div>
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
                        ($data[count($data)-1] > $data[count($data)-2] ? '+' : '-') : '=';
                        $lastValue = end($data);
                        $secondLastValue = prev($data);
                        $trendValue = $secondLastValue !== false ? abs($lastValue - $secondLastValue) : 0;
                        @endphp
                        {{ $trend }}{{ $trendValue }}
                    </h5>
                    <span class="description-text">TENDÊNCIA</span>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🏥 Inicializando gráfico da partial...');

        // Aguardar ApexCharts estar disponível
        function waitForApexCharts() {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 15;

                function check() {
                    if (typeof ApexCharts !== 'undefined') {
                        console.log('✅ ApexCharts detectado na partial');
                        resolve(true);
                    } else if (attempts < maxAttempts) {
                        attempts++;
                        setTimeout(check, 300);
                    } else {
                        console.error('❌ ApexCharts não foi carregado na partial após', maxAttempts, 'tentativas');
                        reject(new Error('ApexCharts não foi carregado'));
                    }
                }
                check();
            });
        }

        // Configuração dos dados do gráfico
        const chartConfig = {
            week: {
                labels: @json($weekLabels ?? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']),
                data: @json($weekData ?? [5, 8, 12, 7, 15, 10, 6])
            },
            month: {
                labels: @json($chartLabels ?? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']),
                data: @json($chartData ?? [12, 19, 3, 5, 2, 3])
            },
            year: {
                labels: @json($yearLabels ?? ['2020', '2021', '2022', '2023', '2024', '2025']),
                data: @json($yearData ?? [150, 200, 175, 300, 250, 400])
            }
        };

        let diagnosticsPartialChart = null;

        // Inicializar gráfico
        async function initializeChart() {
            try {
                console.log('⏳ Aguardando ApexCharts...');
                await waitForApexCharts();

                const container = document.getElementById('diagnosticsChartPartial');
                if (!container) {
                    console.error('❌ Container diagnosticsChartPartial não encontrado');
                    return;
                }

                // Limpar container
                container.innerHTML = '';

                // Verificar tema
                const isDark = document.documentElement.classList.contains('dark') ||
                    document.documentElement.getAttribute('data-theme') === 'dark';

                // Dados iniciais (mês)
                const initialData = chartConfig.month;

                console.log('📊 Criando gráfico da partial com dados:', initialData);

                const options = {
                    series: [{
                        name: 'Diagnósticos',
                        data: initialData.data,
                        color: '#22c55e'
                    }],
                    chart: {
                        height: 300,
                        type: 'line',
                        toolbar: {
                            show: true,
                            tools: {
                                download: true,
                                zoom: true,
                                reset: true
                            }
                        },
                        background: 'transparent',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    },
                    theme: {
                        mode: isDark ? 'dark' : 'light'
                    },
                    xaxis: {
                        categories: initialData.labels,
                        labels: {
                            style: {
                                colors: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    },
                    yaxis: {
                        min: 0,
                        forceNiceScale: true,
                        labels: {
                            style: {
                                colors: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    grid: {
                        borderColor: isDark ? '#374151' : '#f3f4f6'
                    },
                    tooltip: {
                        theme: isDark ? 'dark' : 'light'
                    },
                    legend: {
                        labels: {
                            colors: isDark ? '#e5e7eb' : '#374151'
                        }
                    }
                };

                diagnosticsPartialChart = new ApexCharts(container, options);
                await diagnosticsPartialChart.render();

                console.log('✅ Gráfico da partial criado com sucesso');

                // Atualizar estatísticas iniciais
                updateChartStats(initialData.data);

            } catch (error) {
                console.error('❌ Erro ao criar gráfico da partial:', error);
                const container = document.getElementById('diagnosticsChartPartial');
                if (container) {
                    container.innerHTML = `
                    <div class="d-flex align-items-center justify-content-center h-100">
                        <div class="text-center text-muted">
                            <i class="bi bi-exclamation-triangle display-4 mb-3"></i>
                            <p class="mb-2">Erro ao carregar gráfico</p>
                            <button onclick="location.reload()" class="btn btn-sm btn-outline-secondary">
                                <i class="bi bi-arrow-clockwise me-1"></i>Recarregar
                            </button>
                        </div>
                    </div>
                `;
                }
            }
        }

        // Atualizar gráfico quando período muda
        document.querySelectorAll('input[name="chart-period"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked && diagnosticsPartialChart) {
                    updateChart(this.value);
                }
            });
        });

        function updateChart(period) {
            if (!chartConfig[period] || !diagnosticsPartialChart) {
                console.warn('⚠️ Configuração não encontrada para período:', period);
                return;
            }

            try {
                console.log('🔄 Atualizando gráfico da partial para período:', period);

                // Atualizar dados do gráfico
                diagnosticsPartialChart.updateSeries([{
                    name: 'Diagnósticos',
                    data: chartConfig[period].data
                }]);

                diagnosticsPartialChart.updateOptions({
                    xaxis: {
                        categories: chartConfig[period].labels
                    }
                });

                // Atualizar estatísticas do footer
                updateChartStats(chartConfig[period].data);

                console.log('✅ Gráfico da partial atualizado para período:', period);
            } catch (error) {
                console.error('❌ Erro ao atualizar gráfico da partial:', error);
            }
        }

        function updateChartStats(data) {
            const total = data.reduce((a, b) => a + b, 0);
            const avg = data.length > 0 ? (total / data.length).toFixed(1) : 0;
            const max = Math.max(...data);
            const trend = data.length > 1 ?
                (data[data.length - 1] > data[data.length - 2] ? '+' : '-') : '=';
            const trendValue = data.length > 1 ?
                Math.abs(data[data.length - 1] - data[data.length - 2]) : 0;

            // Atualizar elementos
            const totalElement = document.getElementById('chart-total');
            const avgElement = document.getElementById('chart-avg');
            const maxElement = document.getElementById('chart-max');
            const trendElement = document.getElementById('chart-trend');

            if (totalElement) totalElement.textContent = total;
            if (avgElement) avgElement.textContent = avg;
            if (maxElement) maxElement.textContent = max;
            if (trendElement) trendElement.textContent = trend + trendValue;
        }

        // Inicializar com um pequeno delay para garantir que tudo esteja carregado
        setTimeout(initializeChart, 1000);
    });
</script>
@endpush
