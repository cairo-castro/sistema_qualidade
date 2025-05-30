<?php if (isset($component)) { $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54 = $attributes; } ?>
<?php $component = App\View\Components\AppLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('app-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\AppLayout::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
     <?php $__env->slot('title', null, []); ?> Dashboard <?php $__env->endSlot(); ?>
    
    <!-- Cards de Estatísticas Principais -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total de Diagnósticos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ count: <?php echo e($totalDiagnosticos ?? 0); ?> }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Total de Diagnósticos</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="formatNumber(count)"><?php echo e(number_format($totalDiagnosticos ?? 0)); ?></p>
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
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ rate: <?php echo e($taxaConformidade ?? 85.4); ?> }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Taxa de Conformidade</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="rate + '%'"><?php echo e(number_format($taxaConformidade ?? 85.4, 1)); ?>%</p>
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
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ active: <?php echo e($periodosAtivos ?? 3); ?> }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Períodos Ativos</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="active"><?php echo e($periodosAtivos ?? 3); ?></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-blue-600 dark:text-blue-400 font-medium"><?php echo e($periodosPendentes ?? 1); ?> pendente(s)</span>
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
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600" x-data="{ nonConform: <?php echo e($itensNaoConformes ?? 24); ?> }">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-slate-600 dark:text-slate-300">Itens Não Conformes</h3>
                    <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2" x-text="nonConform"><?php echo e($itensNaoConformes ?? 24); ?></p>
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
            </div>
        </div>
    </div>
    
    <!-- Linha Principal: Gráficos e Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Gráfico de Diagnósticos por Período -->
        <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Diagnósticos por Período</h3>
                        <p class="text-sm text-slate-600 dark:text-slate-300">Últimos 6 meses</p>
                    </div>
                    <div class="flex space-x-2">
                        <select class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm w-auto">
                            <option value="6m">6 meses</option>
                            <option value="1y">1 ano</option>
                            <option value="2y">2 anos</option>
                        </select>
                    </div>
                </div>
                
                <!-- Chart Container -->
                <div class="relative h-80 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-4" x-data="hospitalChart">
                    <canvas id="diagnosticsChart" class="w-full h-full" x-init="initChart($el)"></canvas>
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
            
            <!-- Top Subsetores com Não Conformidades -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Não Conformidades</h3>
                <div class="space-y-3">
                    <?php $__empty_1 = true; $__currentLoopData = $topNaoConformidades ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white"><?php echo e($item['setor'] ?? 'UTI Geral'); ?></p>
                            <p class="text-sm text-slate-600 dark:text-slate-300"><?php echo e($item['subsetor'] ?? 'Medicamentos'); ?></p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-red-600 dark:text-red-400"><?php echo e($item['count'] ?? 12); ?></p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">UTI Geral</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Medicamentos</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-red-600 dark:text-red-400">12</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">Pronto Socorro</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Equipamentos</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-red-600 dark:text-red-400">8</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                            <p class="font-medium text-slate-900 dark:text-white">Enfermaria</p>
                            <p class="text-sm text-slate-600 dark:text-slate-300">Higienização</p>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold text-red-600 dark:text-red-400">4</p>
                            <p class="text-xs text-slate-600 dark:text-slate-400">itens</p>
                        </div>
                    </div>
                    <?php endif; ?>
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
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unidade</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Setor</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conformidade</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            <?php $__empty_1 = true; $__currentLoopData = $diagnosticosRecentes ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $diagnostico): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white"><?php echo e($diagnostico['unidade'] ?? 'Hospital Central'); ?></div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400"><?php echo e($diagnostico['codigo'] ?? 'HC-001'); ?></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white"><?php echo e($diagnostico['setor'] ?? 'UTI Geral'); ?></div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400"><?php echo e($diagnostico['subsetor'] ?? 'Medicamentos'); ?></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <?php
                                        $status = $diagnostico['status'] ?? 'Em Andamento';
                                        $statusClass = match($status) {
                                            'Concluído' => 'gqa-badge success',
                                            'Em Andamento' => 'gqa-badge warning',
                                            'Pendente' => 'gqa-badge danger',
                                            default => 'gqa-badge info'
                                        };
                                    ?>
                                    <span class="<?php echo e($statusClass); ?>"><?php echo e($status); ?></span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <?php
                                        $conformidade = $diagnostico['conformidade'] ?? 85;
                                        $confClass = $conformidade >= 80 ? 'text-emerald-600 dark:text-emerald-400' : ($conformidade >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400');
                                    ?>
                                    <span class="font-medium <?php echo e($confClass); ?>"><?php echo e($conformidade); ?>%</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm">
                                        <div class="text-gray-900 dark:text-white"><?php echo e($diagnostico['data'] ?? '23/05/2025'); ?></div>
                                        <div class="text-slate-500 dark:text-slate-400"><?php echo e($diagnostico['hora'] ?? '14:30'); ?></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button class="gqa-btn primary sm">Ver</button>
                                        <button class="gqa-btn ghost sm">Editar</button>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                            <!-- Dados de exemplo -->
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white">Hospital Central</div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400">HC-001</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white">UTI Geral</div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400">Medicamentos</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="gqa-badge success">Concluído</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="font-medium text-emerald-600 dark:text-emerald-400">92%</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm">
                                        <div class="text-gray-900 dark:text-white">23/05/2025</div>
                                        <div class="text-slate-500 dark:text-slate-400">14:30</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button class="gqa-btn primary sm">Ver</button>
                                        <button class="gqa-btn ghost sm">Editar</button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white">Hospital Regional</div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400">HR-002</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-white">Pronto Socorro</div>
                                        <div class="text-sm text-slate-500 dark:text-slate-400">Equipamentos</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="gqa-badge warning">Em Andamento</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="font-medium text-amber-600 dark:text-amber-400">75%</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm">
                                        <div class="text-gray-900 dark:text-white">22/05/2025</div>
                                        <div class="text-slate-500 dark:text-slate-400">09:15</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex space-x-2">
                                        <button class="gqa-btn primary sm">Ver</button>
                                        <button class="gqa-btn ghost sm">Editar</button>
                                    </div>
                                </td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Atividades e Notificações -->
        <div class="space-y-6">
            <!-- Últimas Atividades -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Atividades Recentes</h3>
                <div class="space-y-4">
                    <?php $__empty_1 = true; $__currentLoopData = $atividadesRecentes ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $atividade): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white"><?php echo e($atividade['titulo'] ?? 'Diagnóstico concluído'); ?></p>
                            <p class="text-xs text-slate-600 dark:text-slate-300"><?php echo e($atividade['descricao'] ?? 'UTI Geral - Hospital Central'); ?></p>
                            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1"><?php echo e($atividade['tempo'] ?? '5 min atrás'); ?></p>
                        </div>
                    </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">Diagnóstico concluído</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300">UTI Geral - Hospital Central</p>
                            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">5 min atrás</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">Novo período criado</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300">Maio 2025 - Hospital Regional</p>
                            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">1 hora atrás</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3">
                        <div class="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">Não conformidade detectada</p>
                            <p class="text-xs text-slate-600 dark:text-slate-300">Enfermaria - Medicamentos</p>
                            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">3 horas atrás</p>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Ranking de Problemas -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">Problemas Frequentes</h3>
                <div class="space-y-3">
                    <?php $__empty_1 = true; $__currentLoopData = $problemasFrequentes ?? []; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $problema): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white"><?php echo e($problema['nome'] ?? 'Falta de medicamentos'); ?></p>
                            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-1">
                                <div class="bg-danger-500 h-2 rounded-full" style="width: <?php echo e($problema['porcentagem'] ?? 45); ?>%"></div>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white ml-3"><?php echo e($problema['ocorrencias'] ?? 12); ?></span>
                    </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">Falta de medicamentos</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-1">
                                <div class="bg-danger-500 h-2 rounded-full" style="width: 45%"></div>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white ml-3">12</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">Equipamentos defeituosos</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-1">
                                <div class="bg-warning-500 h-2 rounded-full" style="width: 30%"></div>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white ml-3">8</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-sm font-medium text-slate-900 dark:text-white">Higienização inadequada</p>
                            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-1">
                                <div class="bg-info-500 h-2 rounded-full" style="width: 20%"></div>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-slate-900 dark:text-white ml-3">5</span>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <?php $__env->startPush('scripts'); ?>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('hospitalChart', () => ({
                chart: null,
                
                initChart(el) {
                    const isDark = document.documentElement.classList.contains('dark');
                    
                    const data = {
                        labels: ['Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25'],
                        datasets: [
                            {
                                label: 'Diagnósticos Realizados',
                                data: [0, 0, 0, 0, 2662, 767],
                                borderColor: isDark ? '#6366f1' : '#4f46e5',
                                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                                tension: 0.4,
                                fill: true
                            }, 
                            {
                                label: 'Conformidades',
                                data: [0, 0, 0, 0, 942, 0],
                                borderColor: isDark ? '#10b981' : '#059669',
                                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                                tension: 0.4,
                                fill: true
                            }
                        ]
                    };
                    
                    const ctx = el.getContext('2d');
                    this.chart = new Chart(ctx, {
                        type: 'line',
                        data: data,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: isDark ? '#e5e7eb' : '#374151',
                                        font: {
                                            size: 12
                                        },
                                        padding: 20,
                                        usePointStyle: true
                                    }
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    backgroundColor: isDark ? '#374151' : '#ffffff',
                                    titleColor: isDark ? '#e5e7eb' : '#374151',
                                    bodyColor: isDark ? '#e5e7eb' : '#374151',
                                    borderColor: isDark ? '#6b7280' : '#d1d5db',
                                    borderWidth: 1,
                                    cornerRadius: 8,
                                    padding: 12
                                }
                            },
                            scales: {
                                x: {
                                    grid: {
                                        color: isDark ? '#374151' : '#f3f4f6',
                                        drawBorder: false
                                    },
                                    ticks: {
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        font: {
                                            size: 11
                                        }
                                    },
                                    border: {
                                        color: isDark ? '#4b5563' : '#e5e7eb'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: isDark ? '#374151' : '#f3f4f6',
                                        drawBorder: false
                                    },
                                    ticks: {
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        font: {
                                            size: 11
                                        },
                                        callback: function(value) {
                                            return new Intl.NumberFormat('pt-BR').format(value);
                                        }
                                    },
                                    border: {
                                        color: isDark ? '#4b5563' : '#e5e7eb'
                                    }
                                }
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            },
                            elements: {
                                point: {
                                    radius: 4,
                                    hoverRadius: 6,
                                    backgroundColor: isDark ? '#ffffff' : '#ffffff',
                                    borderWidth: 2
                                },
                                line: {
                                    borderWidth: 2
                                }
                            }
                        }
                    });
                    
                    // Listen for theme changes
                    this.setupThemeListener();
                },
                
                setupThemeListener() {
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                if (this.chart) {
                                    this.updateChartTheme();
                                }
                            }
                        });
                    });
                    
                    observer.observe(document.documentElement, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                },
                
                updateChartTheme() {
                    const isDark = document.documentElement.classList.contains('dark');
                    
                    // Update dataset colors
                    this.chart.data.datasets[0].borderColor = isDark ? '#6366f1' : '#4f46e5';
                    this.chart.data.datasets[0].backgroundColor = isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)';
                    this.chart.data.datasets[1].borderColor = isDark ? '#10b981' : '#059669';
                    this.chart.data.datasets[1].backgroundColor = isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(5, 150, 105, 0.1)';
                    
                    // Update chart options
                    this.chart.options.plugins.legend.labels.color = isDark ? '#e5e7eb' : '#374151';
                    this.chart.options.plugins.tooltip.backgroundColor = isDark ? '#374151' : '#ffffff';
                    this.chart.options.plugins.tooltip.titleColor = isDark ? '#e5e7eb' : '#374151';
                    this.chart.options.plugins.tooltip.bodyColor = isDark ? '#e5e7eb' : '#374151';
                    this.chart.options.plugins.tooltip.borderColor = isDark ? '#6b7280' : '#d1d5db';
                    
                    this.chart.options.scales.x.grid.color = isDark ? '#374151' : '#f3f4f6';
                    this.chart.options.scales.x.ticks.color = isDark ? '#9ca3af' : '#6b7280';
                    this.chart.options.scales.x.border.color = isDark ? '#4b5563' : '#e5e7eb';
                    
                    this.chart.options.scales.y.grid.color = isDark ? '#374151' : '#f3f4f6';
                    this.chart.options.scales.y.ticks.color = isDark ? '#9ca3af' : '#6b7280';
                    this.chart.options.scales.y.border.color = isDark ? '#4b5563' : '#e5e7eb';
                    
                    this.chart.options.elements.point.backgroundColor = isDark ? '#ffffff' : '#ffffff';
                    
                    this.chart.update('none');
                }
            }));
            
            Alpine.data('formatNumber', () => {
                return function(value) {
                    return new Intl.NumberFormat('pt-BR').format(value);
                };
            });
        });
    </script>
    <?php $__env->stopPush(); ?>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $attributes = $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $component = $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?><?php /**PATH C:\projects\qualidade\sistema-qualidade\resources\views/dashboard.blade.php ENDPATH**/ ?>