@extends('layouts.app')

@section('title', 'Gráficos ApexCharts - Dashboard Hospital')

@section('content')
<div class="hospital-content">
    <!-- 📊 Header da página -->
    <div class="page-header mb-8">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    📊 Dashboard de Qualidade
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    Monitoramento em tempo real dos indicadores hospitalares
                </p>
            </div>
            <div class="flex space-x-3">
                <!-- 🔄 Botão para atualizar dados -->
                <button 
                    onclick="updateChartData()" 
                    class="gqa-btn secondary"
                    title="Atualizar dados dos gráficos"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Atualizar
                </button>
                
                <!-- 🌓 Botão para alternar tema -->
                <button 
                    onclick="toggleChartsTheme()" 
                    class="gqa-btn outline"
                    title="Alternar tema claro/escuro"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Tema
                </button>
            </div>
        </div>
    </div>

    <!-- 📈 Grid de gráficos otimizado -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <!-- 📊 Gráfico 1: Diagnósticos por mês -->
        <div class="gqa-card">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    📈 Diagnósticos Mensais
                </h3>
                <span class="gqa-badge success">Em dia</span>
            </div>
            <div 
                id="diagnostics-chart" 
                data-chart="line" 
                class="w-full h-96"
                style="min-height: 350px;"
            >
                <!-- ⏳ Loading placeholder -->
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="animate-spin h-8 w-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">Carregando gráfico...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 📊 Gráfico 2: Conformidade por setor -->
        <div class="gqa-card">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    📊 Conformidade por Setor
                </h3>
                <span class="gqa-badge warning">Atenção</span>
            </div>
            <div 
                id="compliance-chart" 
                data-chart="bar" 
                class="w-full h-96"
                style="min-height: 350px;"
            >
                <!-- ⏳ Loading placeholder -->
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">Carregando gráfico...</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- 🍩 Grid de gráficos secundários -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- 🍩 Gráfico 3: Distribuição de não conformidades -->
        <div class="gqa-card">
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    🍩 Não Conformidades
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Distribuição por categoria
                </p>
            </div>
            <div 
                id="noncompliance-chart" 
                data-chart="donut" 
                class="w-full h-80"
                style="min-height: 300px;"
            >
                <!-- ⏳ Loading placeholder -->
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="animate-spin h-8 w-8 text-yellow-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">Carregando gráfico...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 📊 Gráfico 4: Evolução da qualidade -->
        <div class="gqa-card">
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    📈 Índice de Qualidade
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Evolução anual
                </p>
            </div>
            <div 
                id="quality-chart" 
                data-chart="area" 
                class="w-full h-80"
                style="min-height: 300px;"
            >
                <!-- ⏳ Loading placeholder -->
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="animate-spin h-8 w-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">Carregando gráfico...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 📋 Gráfico 5: Performance por categoria -->
        <div class="gqa-card">
            <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    📋 Performance Radar
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Análise multidimensional
                </p>
            </div>
            <div 
                id="performance-chart" 
                data-chart="radar" 
                class="w-full h-80"
                style="min-height: 300px;"
            >
                <!-- ⏳ Loading placeholder -->
                <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="animate-spin h-8 w-8 text-purple-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p class="text-gray-500 text-sm">Carregando gráfico...</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- 📊 Estatísticas resumidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <div class="gqa-card gqa-card-success text-center">
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                94.5%
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Taxa Geral de Conformidade
            </div>
        </div>

        <div class="gqa-card gqa-card-info text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                1,247
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Diagnósticos este Mês
            </div>
        </div>

        <div class="gqa-card gqa-card-warning text-center">
            <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                23
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Não Conformidades Abertas
            </div>
        </div>

        <div class="gqa-card gqa-card-danger text-center">
            <div class="text-3xl font-bold text-red-600 dark:text-red-400">
                5
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ações Pendentes
            </div>
        </div>

    </div>

    <!-- 📝 Instruções de uso -->
    <div class="gqa-card gqa-card-info">
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Como usar os gráficos ApexCharts
        </h3>
        <div class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <p><strong>🔄 Atualizar dados:</strong> Clique no botão "Atualizar" para simular novos dados</p>
            <p><strong>🌓 Alternar tema:</strong> Use o botão "Tema" para alternar entre modo claro e escuro</p>
            <p><strong>📊 Interação:</strong> Passe o mouse sobre os gráficos para ver detalhes</p>
            <p><strong>💾 Exportar:</strong> Use a barra de ferramentas dos gráficos para exportar em PNG, SVG ou CSV</p>
            <p><strong>🔍 Zoom:</strong> Use os controles de zoom para focar em períodos específicos</p>
        </div>
    </div>

</div>

<!-- 🎯 Performance monitoring -->
<div class="hidden" id="performance-debug">
    <div class="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
        <div>📊 ApexCharts carregado via lazy loading</div>
        <div>⚡ Tema dinâmico ativo</div>
        <div>🚀 Performance otimizada</div>
        <div>📱 Responsivo para mobile</div>
    </div>
</div>
@endsection

@push('styles')
<style>
/* 📊 Estilos específicos para gráficos ApexCharts */
.apexcharts-canvas {
    margin: 0 auto;
}

.apexcharts-legend {
    justify-content: center !important;
}

.apexcharts-tooltip {
    border-radius: 8px !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
}

/* 🎨 Loading states */
.chart-loading {
    background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
    background-size: 400% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* 🌓 Dark mode adjustments */
[data-theme="dark"] .chart-loading {
    background: linear-gradient(90deg, #374151 25%, transparent 37%, #374151 63%);
    background-size: 400% 100%;
}

/* 📱 Mobile responsivity */
@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .page-header .flex.space-x-3 {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
    }
    
    .page-header .flex.space-x-3 button {
        width: 100%;
        justify-content: center;
    }
}
</style>
@endpush

@push('scripts')
<!-- 📊 Carregar exemplos de gráficos -->
@vite(['resources/js/charts-examples.js'])

<script>
// 🎯 Monitoramento de performance (desenvolvimento)
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Performance da página:');
            console.log(`⏱️ DOM carregado em: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            console.log(`🚀 Página completa em: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 1000);
    });
}

// 🔧 Debugging helpers (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    document.getElementById('performance-debug').classList.remove('hidden');
    
    // 📊 Log de gráficos carregados
    document.addEventListener('chartReady', (event) => {
        console.log('📊 Gráfico pronto:', event.target.id);
    });
}

// 🎨 Listener para mudanças de tema do sistema
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener((e) => {
        if (!document.documentElement.hasAttribute('data-theme')) {
            // Se não há tema manual definido, seguir sistema
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            console.log(`🎨 Tema automático alterado para: ${newTheme}`);
        }
    });
}
</script>
@endpush 