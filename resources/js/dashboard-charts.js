/**
 * 📊 Dashboard Charts - ApexCharts Integration
 * 
 * Este arquivo contém as configurações específicas para os gráficos
 * do dashboard principal usando ApexCharts
 */

// 🎯 Verificar se ApexCharts está disponível
let isApexChartsReady = false;
let initAttempts = 0;
const maxInitAttempts = 10;

// 📊 Aguardar ApexCharts estar disponível
function waitForApexCharts() {
    return new Promise((resolve, reject) => {
        function check() {
            if (typeof ApexCharts !== 'undefined') {
                isApexChartsReady = true;
                resolve(true);
            } else if (initAttempts < maxInitAttempts) {
                initAttempts++;
                setTimeout(check, 200);
            } else {
                reject(new Error('ApexCharts não foi carregado após várias tentativas'));
            }
        }
        check();
    });
}

// 📊 Inicializar gráfico principal quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏥 Inicializando gráficos do Dashboard...');
    
    // ⏳ Aguardar carregamento completo do sistema
    setTimeout(async () => {
        try {
            await waitForApexCharts();
            await initializeDashboardCharts();
        } catch (error) {
            console.error('❌ Erro ao aguardar ApexCharts:', error);
            showFallbackMessage();
        }
    }, 300);
});

/**
 * 📈 Inicializar todos os gráficos do dashboard
 */
async function initializeDashboardCharts() {
    try {
        // ✅ Verificar se ApexCharts está disponível
        if (!isApexChartsReady || typeof ApexCharts === 'undefined') {
            console.error('❌ ApexCharts não está disponível');
            showFallbackMessage();
            return;
        }

        // 📊 Gráfico principal de diagnósticos
        const chartElement = document.getElementById('diagnosticsChart');
        
        if (chartElement) {
            await createDiagnosticsChart();
        } else {
            console.warn('⚠️ Elemento diagnosticsChart não encontrado');
        }
        
    } catch (error) {
        console.error('❌ Erro ao inicializar gráficos:', error);
        showFallbackMessage();
    }
}

/**
 * 🔢 Validar e sanitizar dados numéricos
 */
function validateChartData(data) {
    if (!Array.isArray(data)) return [];
    
    return data.map(value => {
        const num = Number(value);
        return isNaN(num) || !isFinite(num) ? 0 : num;
    });
}

/**
 * 📈 Criar gráfico de diagnósticos por período
 */
async function createDiagnosticsChart() {
    const container = document.getElementById('diagnosticsChart');
    if (!container) {
        console.error('❌ Container diagnosticsChart não encontrado');
        return;
    }
    
    try {
        // 🧹 Limpar container
        container.innerHTML = '';
        
        // 🎨 Verificar tema atual
        const isDark = document.documentElement.classList.contains('dark');
        
        // 📊 Dados do gráfico validados
        const rawData = {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            diagnosticos: [120, 150, 180, 200, 170, 190, 220, 240, 210, 180, 160, 140],
            conformidades: [110, 140, 165, 185, 155, 175, 200, 220, 195, 165, 145, 125]
        };

        // ✅ Validar dados
        const chartData = {
            labels: rawData.labels || [],
            diagnosticos: validateChartData(rawData.diagnosticos),
            conformidades: validateChartData(rawData.conformidades)
        };

        // 🔍 Verificar se há dados válidos
        if (chartData.diagnosticos.length === 0 || chartData.conformidades.length === 0) {
            throw new Error('Dados do gráfico inválidos ou vazios');
        }

        // ⚙️ Configurações do gráfico
        const options = {
            series: [
                {
                    name: 'Diagnósticos Realizados',
                    data: chartData.diagnosticos,
                    color: '#22c55e'
                },
                {
                    name: 'Conformidades',
                    data: chartData.conformidades,
                    color: '#3b82f6'
                }
            ],
            chart: {
                height: 320,
                type: 'line',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: false,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: false,
                        reset: true
                    }
                },
                animations: {
                    enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                background: 'transparent',
                foreColor: isDark ? '#e5e7eb' : '#374151',
                fontFamily: 'Inter, system-ui, sans-serif'
            },
            xaxis: {
                categories: chartData.labels,
                labels: {
                    style: {
                        colors: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: '12px',
                        fontWeight: 400
                    },
                    trim: true
                },
                axisBorder: {
                    show: true,
                    color: isDark ? '#4b5563' : '#e5e7eb'
                },
                axisTicks: {
                    show: true,
                    color: isDark ? '#4b5563' : '#e5e7eb'
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                min: 0,
                forceNiceScale: true,
                labels: {
                    style: {
                        colors: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: '12px',
                        fontWeight: 400
                    },
                    formatter: function(value) {
                        // ✅ Garantir que value é um número válido
                        const num = Number(value);
                        if (isNaN(num) || !isFinite(num)) return '0';
                        return new Intl.NumberFormat('pt-BR').format(Math.round(num));
                    }
                },
                title: {
                    text: 'Quantidade',
                    style: {
                        color: isDark ? '#9ca3af' : '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500
                    }
                }
            },
            grid: {
                show: true,
                borderColor: isDark ? '#374151' : '#f3f4f6',
                strokeDashArray: 3,
                position: 'back',
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            },
            stroke: {
                curve: 'smooth',
                width: 3,
                lineCap: 'round'
            },
            markers: {
                size: 4,
                colors: ['#ffffff'],
                strokeColors: ['#22c55e', '#3b82f6'],
                strokeWidth: 2,
                hover: {
                    size: 6,
                    sizeOffset: 2
                },
                discrete: []
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    gradientToColors: ['#16a34a', '#2563eb'],
                    inverseColors: false,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                    stops: [0, 100]
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                fontSize: '14px',
                fontWeight: 500,
                labels: {
                    colors: isDark ? '#e5e7eb' : '#374151',
                    useSeriesColors: false
                },
                markers: {
                    width: 12,
                    height: 12,
                    radius: 6,
                    offsetX: 0,
                    offsetY: 0
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5
                }
            },
            tooltip: {
                enabled: true,
                theme: isDark ? 'dark' : 'light',
                style: {
                    fontSize: '12px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                },
                x: {
                    show: true,
                    format: 'dd MMM'
                },
                y: {
                    formatter: function(value, { seriesIndex }) {
                        // ✅ Validar valor antes de formatar
                        const num = Number(value);
                        if (isNaN(num) || !isFinite(num)) return '0';
                        
                        const formatted = new Intl.NumberFormat('pt-BR').format(Math.round(num));
                        if (seriesIndex === 0) {
                            return `${formatted} diagnósticos`;
                        } else {
                            return `${formatted} conformes`;
                        }
                    }
                },
                marker: {
                    show: true
                },
                fixed: {
                    enabled: false
                }
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            height: 280
                        },
                        legend: {
                            position: 'bottom',
                            horizontalAlign: 'center'
                        }
                    }
                }
            ],
            dataLabels: {
                enabled: false
            },
            states: {
                hover: {
                    filter: {
                        type: 'lighten',
                        value: 0.15
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: false,
                    filter: {
                        type: 'darken',
                        value: 0.35
                    }
                }
            }
        };

        // 🎯 Criar o gráfico com verificações de segurança
        console.log('📊 Criando gráfico ApexCharts...');
        const chart = new ApexCharts(container, options);
        
        await chart.render();
        
        // 💾 Armazenar referência global para atualizações
        if (!window.dashboardCharts) {
            window.dashboardCharts = {};
        }
        window.dashboardCharts.diagnostics = chart;
        
        console.log('✅ Gráfico de diagnósticos criado com sucesso');
        
        // 🎨 Configurar observer para mudanças de tema
        setupThemeObserver(chart);
        
        // 🔄 Configurar atualização automática
        setupAutoRefresh(chart);
        
    } catch (error) {
        console.error('❌ Erro ao criar gráfico de diagnósticos:', error);
        showChartError(container, error.message);
    }
}

/**
 * 🎨 Configurar observador de mudanças de tema
 */
function setupThemeObserver(chart) {
    if (!chart) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                // ⏳ Debounce theme updates
                clearTimeout(window.themeUpdateTimeout);
                window.themeUpdateTimeout = setTimeout(() => {
                    updateChartTheme(chart);
                }, 100);
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });

    // 💾 Armazenar observer para cleanup
    if (!window.chartObservers) {
        window.chartObservers = [];
    }
    window.chartObservers.push(observer);
}

/**
 * 🎨 Atualizar tema do gráfico
 */
function updateChartTheme(chart) {
    if (!chart || typeof chart.updateOptions !== 'function') {
        console.warn('⚠️ Chart não está disponível para atualização de tema');
        return;
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    
    try {
        chart.updateOptions({
            chart: {
                foreColor: isDark ? '#e5e7eb' : '#374151'
            },
            xaxis: {
                labels: {
                    style: {
                        colors: isDark ? '#9ca3af' : '#6b7280'
                    }
                },
                axisBorder: {
                    color: isDark ? '#4b5563' : '#e5e7eb'
                },
                axisTicks: {
                    color: isDark ? '#4b5563' : '#e5e7eb'
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: isDark ? '#9ca3af' : '#6b7280'
                    }
                },
                title: {
                    style: {
                        color: isDark ? '#9ca3af' : '#6b7280'
                    }
                }
            },
            grid: {
                borderColor: isDark ? '#374151' : '#f3f4f6'
            },
            legend: {
                labels: {
                    colors: isDark ? '#e5e7eb' : '#374151'
                }
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light'
            }
        }, false, false);
        
        console.log('🎨 Tema do gráfico atualizado');
    } catch (error) {
        console.error('❌ Erro ao atualizar tema do gráfico:', error);
    }
}

/**
 * 🔄 Configurar atualização automática dos dados
 */
function setupAutoRefresh(chart) {
    // Atualizar dados a cada 5 minutos
    const refreshInterval = setInterval(async () => {
        try {
            await refreshChartData(chart);
        } catch (error) {
            console.error('❌ Erro na atualização automática:', error);
        }
    }, 5 * 60 * 1000); // 5 minutos

    // 💾 Armazenar interval para cleanup
    if (!window.chartIntervals) {
        window.chartIntervals = [];
    }
    window.chartIntervals.push(refreshInterval);
}

/**
 * 🔄 Atualizar dados do gráfico
 */
async function refreshChartData(chart) {
    if (!chart || typeof chart.updateSeries !== 'function') {
        console.warn('⚠️ Chart não está disponível para atualização de dados');
        return;
    }

    try {
        // Em um ambiente real, buscar dados do backend
        const response = await fetch('/dashboard/stats');
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.chartData) {
                // ✅ Validar dados antes de atualizar
                const diagnosticos = validateChartData(data.chartData.diagnosticos);
                const conformidades = validateChartData(data.chartData.conformidades);
                
                chart.updateSeries([
                    {
                        name: 'Diagnósticos Realizados',
                        data: diagnosticos
                    },
                    {
                        name: 'Conformidades',
                        data: conformidades
                    }
                ]);
                
                console.log('✅ Dados do gráfico atualizados');
            }
        }
    } catch (error) {
        console.warn('⚠️ Erro ao atualizar dados do gráfico:', error);
    }
}

/**
 * ⚠️ Mostrar erro no container do gráfico
 */
function showChartError(container, errorMessage = 'Erro desconhecido') {
    if (!container) return;

    container.innerHTML = `
        <div class="flex items-center justify-center h-full min-h-[300px]">
            <div class="text-center text-gray-500 dark:text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm font-medium">Erro ao carregar gráfico</p>
                <p class="text-xs mt-1">Tente recarregar a página</p>
                <p class="text-xs mt-2 text-gray-400">${errorMessage}</p>
                <button onclick="location.reload()" class="mt-3 px-4 py-2 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded transition-colors">
                    Recarregar
                </button>
            </div>
        </div>
    `;
}

/**
 * 💬 Mostrar mensagem de fallback
 */
function showFallbackMessage() {
    const container = document.getElementById('diagnosticsChart');
    if (!container) return;

    container.innerHTML = `
        <div class="flex items-center justify-center h-full min-h-[300px]">
            <div class="text-center text-gray-500 dark:text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <p class="text-sm font-medium">Carregando biblioteca de gráficos...</p>
                <p class="text-xs mt-1">Aguarde um momento</p>
            </div>
        </div>
    `;
}

/**
 * 🧹 Limpar gráficos do dashboard
 */
function cleanupDashboardCharts() {
    try {
        // Limpar gráficos
        if (window.dashboardCharts) {
            Object.values(window.dashboardCharts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            window.dashboardCharts = {};
        }

        // Limpar observers
        if (window.chartObservers) {
            window.chartObservers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            window.chartObservers = [];
        }

        // Limpar intervals
        if (window.chartIntervals) {
            window.chartIntervals.forEach(interval => {
                clearInterval(interval);
            });
            window.chartIntervals = [];
        }

        // Limpar timeouts
        if (window.themeUpdateTimeout) {
            clearTimeout(window.themeUpdateTimeout);
        }

    } catch (error) {
        console.error('❌ Erro durante limpeza:', error);
    }
}

// 🧹 Cleanup quando a página for descarregada
window.addEventListener('beforeunload', cleanupDashboardCharts);

// 🔄 Recriar gráficos quando a página for mostrada novamente (mobile)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.dashboardCharts) {
        // Verificar se os gráficos ainda existem
        setTimeout(() => {
            const chartElement = document.getElementById('diagnosticsChart');
            if (chartElement && !window.dashboardCharts.diagnostics) {
                initializeDashboardCharts();
            }
        }, 100);
    }
});

// 🌐 Exportar funções para uso global
window.dashboardChartsFunctions = {
    init: initializeDashboardCharts,
    cleanup: cleanupDashboardCharts,
    refresh: refreshChartData,
    validateData: validateChartData
}; 