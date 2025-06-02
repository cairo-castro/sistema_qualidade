<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Teste ApexCharts - Sistema Hospital</title>
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/dashboard-charts.js'])
</head>
<body class="bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto py-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🧪 Teste ApexCharts - Sistema Hospital
            </h1>
            
            <!-- Status do ApexCharts -->
            <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Status do Sistema</h2>
                <div id="status-container" class="space-y-2 text-sm">
                    <div class="flex items-center">
                        <span class="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                        <span class="text-gray-700 dark:text-gray-300">Verificando ApexCharts...</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                        <span class="text-gray-700 dark:text-gray-300">Verificando Alpine.js...</span>
                    </div>
                </div>
            </div>
            
            <!-- Container do Gráfico de Teste -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Gráfico de Teste
                </h2>
                
                <div class="h-80 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div id="testChart" class="w-full h-full">
                        <div class="flex items-center justify-center h-full">
                            <div class="text-center">
                                <svg class="animate-spin h-8 w-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p class="text-gray-500 text-sm">Carregando gráfico de teste...</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Botões de Teste -->
                <div class="mt-4 flex space-x-4">
                    <button onclick="createTestChart()" 
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        ✅ Criar Gráfico
                    </button>
                    <button onclick="updateTestChart()" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        🔄 Atualizar Dados
                    </button>
                    <button onclick="destroyTestChart()" 
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        🗑️ Destruir Gráfico
                    </button>
                </div>
            </div>
            
            <!-- Log de Eventos -->
            <div class="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">📋 Log de Eventos</h3>
                <div id="event-log" class="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 p-3 h-32 overflow-y-auto font-mono text-xs">
                    <div class="text-gray-500">Aguardando eventos...</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 🧪 Variáveis globais para teste
        let testChart = null;
        
        // 📋 Função para adicionar logs
        function addLog(message, type = 'info') {
            const logContainer = document.getElementById('event-log');
            const timestamp = new Date().toLocaleTimeString();
            const color = {
                info: 'text-blue-600',
                success: 'text-green-600',
                error: 'text-red-600',
                warning: 'text-yellow-600'
            }[type] || 'text-gray-600';
            
            const logEntry = document.createElement('div');
            logEntry.className = `${color} mb-1`;
            logEntry.innerHTML = `[${timestamp}] ${message}`;
            
            if (logContainer.children.length > 0 && logContainer.children[0].textContent.includes('Aguardando')) {
                logContainer.innerHTML = '';
            }
            
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        
        // 🔍 Verificar status do sistema
        function checkSystemStatus() {
            const statusContainer = document.getElementById('status-container');
            
            // ✅ Verificar ApexCharts
            const apexStatus = typeof ApexCharts !== 'undefined';
            const apexIndicator = apexStatus ? 'bg-green-500' : 'bg-red-500';
            const apexText = apexStatus ? 'ApexCharts carregado ✅' : 'ApexCharts não encontrado ❌';
            
            // ✅ Verificar Alpine.js
            const alpineStatus = typeof Alpine !== 'undefined';
            const alpineIndicator = alpineStatus ? 'bg-green-500' : 'bg-red-500';
            const alpineText = alpineStatus ? 'Alpine.js carregado ✅' : 'Alpine.js não encontrado ❌';
            
            statusContainer.innerHTML = `
                <div class="flex items-center">
                    <span class="w-3 h-3 rounded-full ${apexIndicator} mr-2"></span>
                    <span class="text-gray-700 dark:text-gray-300">${apexText}</span>
                </div>
                <div class="flex items-center">
                    <span class="w-3 h-3 rounded-full ${alpineIndicator} mr-2"></span>
                    <span class="text-gray-700 dark:text-gray-300">${alpineText}</span>
                </div>
            `;
            
            addLog(`Sistema verificado - ApexCharts: ${apexStatus}, Alpine: ${alpineStatus}`, apexStatus && alpineStatus ? 'success' : 'error');
        }
        
        // 📊 Criar gráfico de teste
        async function createTestChart() {
            try {
                addLog('Iniciando criação do gráfico de teste...', 'info');
                
                if (typeof ApexCharts === 'undefined') {
                    throw new Error('ApexCharts não está disponível');
                }
                
                // 🗑️ Destruir gráfico existente se houver
                if (testChart) {
                    testChart.destroy();
                    addLog('Gráfico anterior destruído', 'warning');
                }
                
                const container = document.getElementById('testChart');
                if (!container) {
                    throw new Error('Container testChart não encontrado');
                }
                
                // 🧹 Limpar container
                container.innerHTML = '';
                
                // 📊 Dados de teste válidos
                const testData = {
                    series: [{
                        name: 'Série Teste',
                        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 80, 65]
                    }],
                    chart: {
                        height: 300,
                        type: 'line',
                        background: 'transparent'
                    },
                    xaxis: {
                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    colors: ['#22c55e'],
                    grid: {
                        borderColor: '#e5e7eb'
                    },
                    tooltip: {
                        y: {
                            formatter: function(value) {
                                return value + ' unidades';
                            }
                        }
                    }
                };
                
                // ✨ Criar gráfico
                testChart = new ApexCharts(container, testData);
                await testChart.render();
                
                addLog('✅ Gráfico de teste criado com sucesso!', 'success');
                
            } catch (error) {
                addLog(`❌ Erro ao criar gráfico: ${error.message}`, 'error');
                console.error('Erro ao criar gráfico de teste:', error);
            }
        }
        
        // 🔄 Atualizar dados do gráfico
        async function updateTestChart() {
            try {
                if (!testChart) {
                    throw new Error('Nenhum gráfico existe para atualizar');
                }
                
                addLog('Atualizando dados do gráfico...', 'info');
                
                // 📊 Gerar novos dados aleatórios
                const newData = Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 20);
                
                await testChart.updateSeries([{
                    name: 'Série Teste',
                    data: newData
                }]);
                
                addLog('✅ Dados do gráfico atualizados com sucesso!', 'success');
                
            } catch (error) {
                addLog(`❌ Erro ao atualizar gráfico: ${error.message}`, 'error');
                console.error('Erro ao atualizar gráfico:', error);
            }
        }
        
        // 🗑️ Destruir gráfico
        function destroyTestChart() {
            try {
                if (!testChart) {
                    addLog('⚠️ Nenhum gráfico existe para destruir', 'warning');
                    return;
                }
                
                testChart.destroy();
                testChart = null;
                
                const container = document.getElementById('testChart');
                container.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center text-gray-500">
                            <p class="text-sm">Gráfico destruído</p>
                            <p class="text-xs mt-1">Clique em "Criar Gráfico" para gerar um novo</p>
                        </div>
                    </div>
                `;
                
                addLog('🗑️ Gráfico destruído com sucesso', 'success');
                
            } catch (error) {
                addLog(`❌ Erro ao destruir gráfico: ${error.message}`, 'error');
                console.error('Erro ao destruir gráfico:', error);
            }
        }
        
        // 🚀 Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            addLog('📋 Página de teste carregada', 'info');
            
            // ⏳ Aguardar um pouco para verificar o status
            setTimeout(() => {
                checkSystemStatus();
                
                // 🎯 Tentar criar gráfico automaticamente
                setTimeout(() => {
                    createTestChart();
                }, 500);
            }, 1000);
        });
    </script>
</body>
</html> 