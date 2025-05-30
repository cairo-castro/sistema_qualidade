

<?php $__env->startSection('content'); ?>
<div class="hospital-content">
    <!-- Page Header -->
    <div class="mb-8">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    <svg class="w-8 h-8 inline-block mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
                    </svg>
                    Gerenciar Usuários
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">Gerencie usuários, papéis e permissões do sistema hospitalar</p>
            </div>
              <div class="flex items-center gap-3">
                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('create users')): ?>
                    <a href="<?php echo e(route('admin.users.create')); ?>" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Novo Usuário
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Users -->
        <div class="gqa-card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Usuários</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"><?php echo e($users->total()); ?></p>
                    <div class="flex items-center mt-2">
                        <svg class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                        </svg>
                        <span class="text-sm text-green-600 dark:text-green-400">+<?php echo e(\App\Models\User::whereDate('created_at', today())->count()); ?> hoje</span>
                    </div>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Active Users -->
        <div class="gqa-card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Usuários Ativos</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"><?php echo e(\App\Models\User::whereDate('updated_at', '>=', now()->subDays(30))->count()); ?></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-blue-600 dark:text-blue-400">Últimos 30 dias</span>
                    </div>
                </div>
                <div class="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- User Roles Distribution -->
        <div class="gqa-card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Papéis Ativos</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"><?php echo e($roles->count()); ?></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-purple-600 dark:text-purple-400"><?php echo e(\App\Models\User::role('Admin')->count()); ?> Admins</span>
                    </div>
                </div>
                <div class="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- New Registrations -->
        <div class="gqa-card">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Novos Registros</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2"><?php echo e(\App\Models\User::whereDate('created_at', '>=', now()->subDays(7))->count()); ?></p>
                    <div class="flex items-center mt-2">
                        <span class="text-sm text-orange-600 dark:text-orange-400">Esta semana</span>
                    </div>
                </div>
                <div class="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                    <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                </div>
            </div>
        </div>    </div>

    <!-- Users Table Card -->
    <div class="gqa-card">        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <svg class="w-5 h-5 inline-block mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                    Lista de Usuários
                </h3>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    <?php echo e($users->total()); ?> <?php echo e($users->total() == 1 ? 'registro' : 'registros'); ?>

                </span>
            </div>
  
        </div>          <?php if($users->count() > 0): ?>
            <!-- DataTable Container -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                
                <!-- DataTable Header Controls -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <!-- Search and Entries -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <!-- Search Input -->
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input type="search" 
                                   data-hs-datatable-search=""
                                   class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-green-500 focus:border-green-500"
                                   placeholder="Buscar usuários...">
                        </div>
                        
                        <!-- Entries per page -->
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-700 dark:text-gray-300">Mostrar:</label>
                            <select data-hs-datatable-page-entities=""
                                    class="block w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-green-500 focus:border-green-500">
                                <option value="10">10</option>
                                <option value="25" selected>25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span class="text-sm text-gray-700 dark:text-gray-300">registros</span>
                        </div>
                    </div>
                    
                    <!-- Bulk Actions -->
                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('delete users')): ?>
                        <div class="flex items-center gap-3">
                            <button type="button" 
                                    id="bulkActionsBtn" 
                                    class="hidden relative inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    onclick="toggleBulkDropdown()">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Ações (<span id="bulkActionCount">0</span>)
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            
                            <!-- Bulk Actions Dropdown -->
                            <div id="bulkDropdown" class="hidden absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                <div class="py-1">
                                    <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Ações em Lote
                                    </div>
                                    <button type="button" 
                                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center" 
                                            onclick="bulkAction('delete')">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Deletar Selecionados
                                    </button>
                                    <hr class="border-gray-200 dark:border-gray-700">
                                    <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Atribuir Papel
                                    </div>
                                    <?php $__currentLoopData = $roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <button type="button" 
                                                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center" 
                                                onclick="bulkAction('assign_role', '<?php echo e($role->id); ?>')">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                            </svg>
                                            <?php echo e($role->name); ?>

                                        </button>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- DataTable -->
                <div data-hs-datatable='{
                    "pageLength": 25,
                    "pagingOptions": {
                        "pageBtnClasses": "min-h-[38px] min-w-[38px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                    },
                    "info": {
                        "totalQty": "#datatableWithPagingInfoTotalQty"
                    },
                    "search": "#datatableSearch",
                    "entries": "#datatableEntries",
                    "isResponsive": false,
                    "isShowPaging": true,
                    "pagination": "datatableWithPagingPagination",
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Buscar usuários...",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                        "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                        "infoFiltered": "(filtrado de _MAX_ registros)",
                        "lengthMenu": "Mostrar _MENU_ registros",
                        "loadingRecords": "Carregando...",
                        "processing": "Processando...",
                        "zeroRecords": "Nenhum registro encontrado",
                        "paginate": {
                            "first": "Primeiro",
                            "last": "Último",
                            "next": "Próximo",
                            "previous": "Anterior"
                        }
                    }
                }'>
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('delete users')): ?>
                                    <th scope="col" class="px-6 py-3 text-left">
                                        <input type="checkbox" 
                                               data-hs-datatable-row-selecting-all=""
                                               class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                    </th>
                                <?php endif; ?>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        Usuário
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        Email
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider --exclude-from-ordering">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                        </svg>
                                        Papéis
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Atividade
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider --exclude-from-ordering">
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 9v2m-6 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                                        </svg>
                                        Status
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider --exclude-from-ordering">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('delete users')): ?>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox"
                                                   data-hs-datatable-row-selecting-individual=""
                                                   class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 user-checkbox" 
                                                   value="<?php echo e($user->id); ?>" 
                                                   <?php echo e($user->id == auth()->id() ? 'disabled' : ''); ?>>
                                        </td>
                                    <?php endif; ?>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="relative">
                                                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                                                    <?php echo e(strtoupper(substr($user->name, 0, 2))); ?>

                                                </div>
                                                <?php if($user->updated_at > now()->subDays(7)): ?>
                                                    <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                                <?php endif; ?>
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    <?php echo e($user->name); ?>

                                                </div>
                                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                                    ID: <?php echo e($user->id); ?>

                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900 dark:text-gray-100"><?php echo e($user->email); ?></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-wrap gap-1">
                                            <?php $__empty_1 = true; $__currentLoopData = $user->roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                                    </svg>
                                                    <?php echo e($role->name); ?>

                                                </span>
                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    Sem papel
                                                </span>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm">
                                            <div class="text-gray-900 dark:text-gray-100 font-medium" 
                                                 title="<?php echo e($user->updated_at->format('d/m/Y H:i:s')); ?>">
                                                <?php echo e($user->updated_at->diffForHumans()); ?>

                                            </div>
                                            <div class="text-gray-500 dark:text-gray-400">
                                                Criado <?php echo e($user->created_at->format('d/m/Y')); ?>

                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <?php if($user->updated_at > now()->subDays(7)): ?>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                                                Ativo
                                            </span>
                                        <?php elseif($user->updated_at > now()->subDays(30)): ?>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                                                <div class="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></div>
                                                Moderado
                                            </span>
                                        <?php else: ?>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                                                Inativo
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex items-center justify-end gap-2">
                                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('view users')): ?>
                                                <a href="<?php echo e(route('admin.users.show', $user)); ?>" 
                                                   class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors" 
                                                   title="Visualizar perfil">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                    </svg>
                                                </a>
                                            <?php endif; ?>
                                            
                                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('edit users')): ?>
                                                <a href="<?php echo e(route('admin.users.edit', $user)); ?>" 
                                                   class="inline-flex items-center px-3 py-1.5 border border-green-300 text-sm leading-4 font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors" 
                                                   title="Editar usuário">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </a>
                                            <?php endif; ?>
                                            
                                            <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('delete users')): ?>
                                                <?php if($user->id !== auth()->id()): ?>
                                                    <form method="POST" 
                                                          action="<?php echo e(route('admin.users.destroy', $user)); ?>" 
                                                          class="inline" 
                                                          onsubmit="return confirm('Tem certeza que deseja deletar este usuário?')">
                                                        <?php echo csrf_field(); ?>
                                                        <?php echo method_field('DELETE'); ?>
                                                        <button type="submit" 
                                                                class="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" 
                                                                title="Deletar usuário">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                        </button>
                                                    </form>
                                                <?php else: ?>
                                                    <button class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed opacity-50" 
                                                            disabled 
                                                            title="Não é possível deletar sua própria conta">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                <?php endif; ?>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                    
                    <!-- DataTable Footer -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                <span class="font-semibold text-gray-800 dark:text-gray-200" data-hs-datatable-info-from="">1</span>
                                -
                                <span class="font-semibold text-gray-800 dark:text-gray-200" data-hs-datatable-info-to="">10</span>
                                de
                                <span class="font-semibold text-gray-800 dark:text-gray-200" data-hs-datatable-info-length=""><?php echo e($users->count()); ?></span>
                                resultados
                            </p>
                        </div>

                        <div>
                            <div class="inline-flex gap-x-2">
                                <button type="button" 
                                        data-hs-datatable-paging-prev=""
                                        class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m15 18-6-6 6-6"/>
                                    </svg>
                                    Anterior
                                </button>

                                <div data-hs-datatable-paging="" class="flex items-center space-x-1"></div>

                                <button type="button" 
                                        data-hs-datatable-paging-next=""
                                        class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    Próximo
                                    <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div><?php else: ?>
            <!-- Enhanced Empty State -->
            <div class="text-center py-16">
                <div class="max-w-md mx-auto">
                    <!-- Illustration -->
                    <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"></path>
                        </svg>
                    </div>
                    
                    <!-- Content -->
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Nenhum usuário encontrado</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-6">
                        <?php if(request()->hasAny(['search', 'role', 'activity', 'sort_by'])): ?>
                            Não foram encontrados usuários com os filtros aplicados. Tente ajustar os critérios de busca.
                        <?php else: ?>
                            Não há usuários cadastrados no sistema. Comece criando o primeiro usuário.
                        <?php endif; ?>
                    </p>
                    
                    <!-- Actions -->
                    <div class="flex flex-col sm:flex-row gap-3 justify-center">
                        <?php if(request()->hasAny(['search', 'role', 'activity', 'sort_by'])): ?>
                            <a href="<?php echo e(route('admin.users.index')); ?>" 
                               class="hospital-btn hospital-btn-outline-secondary">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                Limpar Filtros
                            </a>
                        <?php endif; ?>
                        
                        <?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('create users')): ?>
                            <a href="<?php echo e(route('admin.users.create')); ?>" 
                               class="hospital-btn hospital-btn-primary">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <?php echo e(request()->hasAny(['search', 'role', 'activity', 'sort_by']) ? 'Criar Usuário' : 'Criar Primeiro Usuário'); ?>

                            </a>
                        <?php endif; ?>
                    </div>
                    
                    <?php if(!request()->hasAny(['search', 'role', 'activity', 'sort_by'])): ?>
                        <!-- Quick Tips -->
                        <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div class="flex items-center text-blue-800 dark:text-blue-200 mb-2">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span class="font-medium text-sm">Dica</span>
                            </div>
                            <p class="text-blue-700 dark:text-blue-300 text-sm text-left">
                                Após criar usuários, você pode gerenciar papéis e permissões, filtrar por atividade, 
                                e realizar ações em lote para facilitar a administração.
                            </p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- Bulk Actions Form -->
<?php if (app(\Illuminate\Contracts\Auth\Access\Gate::class)->check('delete users')): ?>
<form id="bulkActionForm" method="POST" action="<?php echo e(route('admin.users.bulk-action')); ?>" class="hidden">
    <?php echo csrf_field(); ?>
    <input type="hidden" name="action" id="bulkActionType">
    <input type="hidden" name="role_id" id="bulkRoleId">
    <div id="bulkUserIds"></div>
</form>
<?php endif; ?>

<?php $__env->startPush('scripts'); ?>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable
    const dataTable = HSDataTable.init(document.querySelector('[data-hs-datatable]'));
    
    // Bulk actions functionality
    const bulkActionsBtn = document.getElementById('bulkActionsBtn');
    const bulkActionCount = document.getElementById('bulkActionCount');
    
    // Handle bulk selection changes
    document.addEventListener('change', function(e) {
        if (e.target.matches('[data-hs-datatable-row-selecting-individual]') || 
            e.target.matches('[data-hs-datatable-row-selecting-all]')) {
            updateBulkActions();
        }
    });
    
    function updateBulkActions() {
        const checkedBoxes = document.querySelectorAll('[data-hs-datatable-row-selecting-individual]:checked');
        const count = checkedBoxes.length;
        
        if (bulkActionCount) {
            bulkActionCount.textContent = count;
        }
        
        if (bulkActionsBtn) {
            if (count > 0) {
                bulkActionsBtn.classList.remove('hidden');
            } else {
                bulkActionsBtn.classList.add('hidden');
                // Hide dropdown
                const dropdown = document.getElementById('bulkDropdown');
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            }
        }
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('bulkDropdown');
        const button = document.getElementById('bulkActionsBtn');
        
        if (dropdown && !dropdown.contains(event.target) && button && !button.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    // Initialize bulk actions state
    updateBulkActions();
});

function toggleBulkDropdown() {
    const dropdown = document.getElementById('bulkDropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function bulkAction(action, roleId = null) {
    const checkedBoxes = document.querySelectorAll('[data-hs-datatable-row-selecting-individual]:checked');
    
    if (checkedBoxes.length === 0) {
        alert('Selecione pelo menos um usuário.');
        return;
    }

    let message = '';
    if (action === 'delete') {
        message = `Tem certeza que deseja deletar ${checkedBoxes.length} usuário(s)?`;
    } else if (action === 'assign_role') {
        message = `Tem certeza que deseja atribuir este papel a ${checkedBoxes.length} usuário(s)?`;
    }

    if (confirm(message)) {
        const form = document.getElementById('bulkActionForm');
        const userIdsContainer = document.getElementById('bulkUserIds');
        
        // Clear previous inputs
        userIdsContainer.innerHTML = '';
        
        // Add selected user IDs
        checkedBoxes.forEach(checkbox => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'users[]';
            input.value = checkbox.value;
            userIdsContainer.appendChild(input);
        });

        document.getElementById('bulkActionType').value = action;
        if (roleId) {
            document.getElementById('bulkRoleId').value = roleId;
        }

        form.submit();
    }

    // Hide dropdown after action
    const dropdown = document.getElementById('bulkDropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}
</script>
<?php $__env->stopPush(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\projects\qualidade\sistema-qualidade\resources\views/admin/users/index.blade.php ENDPATH**/ ?>