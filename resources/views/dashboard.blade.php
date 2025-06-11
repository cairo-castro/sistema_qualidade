<x-app-layout>
    <x-slot name="title">Dashboard</x-slot>

    <!-- Cards de Estatísticas Principais -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total de Diagnósticos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ count: stats.totalDiagnosticos }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Total de Diagnósticos</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="formatNumber(stats.totalDiagnosticos)">{{ number_format($totalDiagnosticos ?? 0) }}</p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">+12% este mês</span>
                        <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                        </svg>
                    </div>
                </div>
                <div class="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Taxa de Conformidade -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ rate: stats.taxaConformidade }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Taxa de Conformidade</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="formatNumber(stats.taxaConformidade) + '%'">{{ number_format($taxaConformidade ?? 85.4, 1) }}%</p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">+2.3% este mês</span>
                        <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                        </svg>
                    </div>
                </div>
                <div class="bg-success-100 dark:bg-success-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Períodos Ativos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ active: stats.periodosAtivos }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Períodos Ativos</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="stats.periodosAtivos">{{ $periodosAtivos ?? 3 }}</p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-blue-600 dark:text-blue-400 font-medium">{{ $periodosPendentes ?? 1 }} pendente(s)</span>
                    </div>
                </div>
                <div class="bg-warning-100 dark:bg-warning-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m-6 4h6m2-14H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Itens Não Conformes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ nonConform: stats.itensNaoConformes }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Itens Não Conformes</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="stats.itensNaoConformes">{{ $itensNaoConformes ?? 24 }}</p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-red-600 dark:text-red-400 font-medium">Requer atenção</span>
                        <svg class="w-4 h-4 text-red-600 dark:text-red-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                </div>
                <div class="bg-danger-100 dark:bg-danger-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
            </div>        </div>
    </div>

    <!-- Linha Principal: Gráficos e Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Gráfico de Diagnósticos por Período -->
        <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Diagnósticos por Período</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-300">Últimos 12 meses</p>
                    </div>
                    <div class="flex space-x-2">
                        <select class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm w-auto">
                            <option value="6m">6 meses</option>
                            <option value="1y" selected>1 ano</option>
                            <option value="2y">2 anos</option>
                        </select>
                        <button @click="reloadDashboard()"
                                class="gqa-btn secondary text-sm"
                                :disabled="loading"
                                title="Atualizar dados">
                            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Chart Container com ApexCharts -->
                <div class="relative h-80 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-4">
                    <!-- 📊 Gráfico ApexCharts -->
                    <div id="diagnosticsChart"
                         data-chart="line"
                         class="w-full h-full"
                         style="min-height: 320px;">
                        <!-- ⏳ Loading placeholder -->
                        <div class="flex items-center justify-center h-full">
                            <div class="text-center">
                                <svg class="animate-spin h-8 w-8 text-green-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p class="text-gray-500 text-sm">Carregando gráfico ApexCharts...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="space-y-6">
            <!-- Acesso Rápido ao Módulo Diagnóstico -->
            <div class="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-700 dark:to-blue-700 rounded-lg p-6 shadow-sm text-white">
                <h3 class="text-lg font-semibold mb-2 text-white">Módulo Diagnóstico</h3>
                <p class="text-green-100 dark:text-green-200 text-sm mb-4">Acesse rapidamente o sistema de diagnósticos</p>
                <div class="space-y-3">
                    <button class="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-lg px-4 py-2 flex items-center justify-center transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Novo Diagnóstico
                    </button>
                    <button class="w-full bg-transparent hover:bg-white/20 text-white border border-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Listar Diagnósticos
                    </button>
                </div>
            </div>

            <!-- Top Setores com Conformidades -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Conformidades</h3>
                <div class="space-y-3">
                    @forelse($topConformidades ?? [] as $item)
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">{{ $item['setor'] ?? 'UTI Geral' }}</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">{{ $item['subsetor'] ?? 'Medicamentos' }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-green-600 dark:text-green-400" x-text="formatNumber({{ $item['count'] ?? 12 }})">{{ $item['count'] ?? 12 }}</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    @empty
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">UTI Geral</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Medicamentos</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-green-600 dark:text-green-400">12</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">Pronto Socorro</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Equipamentos</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-green-600 dark:text-green-400">8</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">Enfermaria</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Higienização</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-green-600 dark:text-green-400">4</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>

    <!-- Linha Inferior: Diagnósticos Recentes e Atividades -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Diagnósticos Recentes -->
        <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Diagnósticos Recentes</h3>
                    <button class="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors">Ver Todos</button>
                </div>

                <!-- Tabela de Diagnósticos -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Setor
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Data
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Conformidade
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            @forelse($diagnosticosRecentes ?? [] as $diagnostico)
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ $diagnostico['setor'] ?? 'UTI Geral' }}</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ $diagnostico['subsetor'] ?? 'Monitoramento' }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {{ isset($diagnostico['data']) ? \Carbon\Carbon::parse($diagnostico['data'])->format('d/m/Y') : '15/01/2024' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        {{ $diagnostico['status'] ?? 'Finalizado' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: '{{ ($diagnostico['conformidade'] ?? 94) }}%'"></div>
                                        </div>
                                        <span class="text-sm font-medium">{{ $diagnostico['conformidade'] ?? 94 }}%</span>
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <!-- Dados de exemplo -->
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">UTI Geral</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">Monitoramento</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    15/01/2024
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        Finalizado
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: 94%"></div>
                                        </div>
                                        <span class="text-sm font-medium">94%</span>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">Cardiologia</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">Equipamentos</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    14/01/2024
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                        Em Análise
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                            <div class="bg-yellow-500 h-2 rounded-full" style="width: 87%"></div>
                                        </div>
                                        <span class="text-sm font-medium">87%</span>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">Pediatria</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">Medicamentos</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    13/01/2024
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        Finalizado
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    <div class="flex items-center">
                                        <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: 98%"></div>
                                        </div>
                                        <span class="text-sm font-medium">98%</span>
                                    </div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Atividades Recentes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Atividades Recentes</h3>
            <div class="space-y-4">
                @forelse($atividadesRecentes ?? [] as $atividade)
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ $atividade['titulo'] ?? 'Novo diagnóstico cadastrado' }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ $atividade['descricao'] ?? 'Setor UTI Geral' }}
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {{ isset($atividade['tempo']) ? $atividade['tempo'] : '2 horas atrás' }}
                        </p>
                    </div>
                </div>
                @empty
                <!-- Dados de exemplo -->
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            Novo diagnóstico cadastrado
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Setor UTI Geral
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            2 horas atrás
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            Relatório de conformidade gerado
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Taxa de 94.5% atingida
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            4 horas atrás
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            Não conformidade detectada
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Setor Pronto Socorro
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            6 horas atrás
                        </p>
                    </div>
                </div>
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            Período de diagnóstico iniciado
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Janeiro 2024 - Todas as áreas
                        </p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            1 dia atrás
                        </p>
                    </div>
                </div>
                @endforelse
            </div>
        </div>
    </div>

    <!-- Demonstração dos Novos Temas -->
    <div class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Demonstração dos Novos Temas</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Teste os novos temas personalizados clicando no ícone de paleta no navbar. Os elementos abaixo respondem automaticamente às mudanças de cor:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Botões com Accent Color -->
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">Botões Interativos</h4>
                    <div class="space-y-2">
                        <button class="btn-primary w-full">Botão Primário</button>
                        <button class="btn-accent w-full">Botão Accent</button>
                        <button class="primary-button w-full">Botão Customizado</button>
                    </div>
                </div>

                <!-- Links com Accent Color -->
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">Links e Textos</h4>
                    <div class="space-y-2">
                        <a href="#" class="text-blue-500 hover:text-blue-600 block">Link com accent color</a>
                        <p class="text-blue-500">Texto com accent color</p>
                        <span class="accent-color font-medium">Texto accent personalizado</span>
                    </div>
                </div>

                <!-- Elementos com Background -->
                <div class="space-y-3">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">Elementos Destacados</h4>
                    <div class="space-y-2">
                        <div class="bg-blue-500 text-white p-3 rounded">Background accent</div>
                        <div class="border-2 border-blue-500 p-3 rounded">Border accent</div>
                        <div class="bg-blue-100 border-l-4 border-blue-500 p-3 rounded">Accent highlight</div>
                    </div>
                </div>
            </div>

            <!-- Indicadores de Status -->
            <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Status Ativo</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Sucesso</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Atenção</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Erro</span>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    <!-- Scripts do dashboard já estão incluídos no app.js -->
    <script>
        // Dados iniciais do dashboard
        window.stats = {
            totalDiagnosticos: {{ $totalDiagnosticos ?? 150 }},
            taxaConformidade: {{ $taxaConformidade ?? 95.2 }},
            periodosAtivos: {{ $periodosAtivos ?? 12 }},
            itensNaoConformes: {{ $itensNaoConformes ?? 8 }}
        };
        window.notifications = @json($notifications ?? []);
    </script>
    @endpush
</x-app-layout>
