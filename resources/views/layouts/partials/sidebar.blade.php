<!-- Sidebar com layout corrigido -->
<aside class="hospital-sidebar" :class="{ 'collapsed': sidebarCollapsed, 'open': sidebarOpen }">
    <!-- Header da Sidebar -->
    <div class="hospital-sidebar-header">
        <div class="hospital-sidebar-logo">
            <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div class="hospital-sidebar-logo-text ml-3 min-w-0 transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">
                <h1 class="text-lg font-bold text-gray-900 truncate">Sistema GQA</h1>
                <p class="text-xs text-gray-600 truncate">Gestão da Qualidade</p>
            </div>
        </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="hospital-sidebar-nav">
        <!-- Dashboard -->
        <a href="{{ route('dashboard') }}" 
           class="hospital-nav-item {{ request()->routeIs('dashboard') ? 'active' : '' }}"
           data-tooltip="Dashboard">
            <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-5-3-5 3V5z"></path>
            </svg>
            <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Dashboard</span>
        </a>
        
        <!-- Diagnósticos Section -->
        @can('view', App\Models\User::class)
        <div class="hospital-nav-section">
            <div class="hospital-nav-section-title transition-opacity duration-300 transition-display" :class="{ 'opacity-0 !hidden': sidebarCollapsed }">Diagnósticos</div>
            
            <a href="#" 
               class="hospital-nav-item {{ request()->is('diagnosticos*') ? 'active' : '' }}"
               data-tooltip="Listar Diagnósticos">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Listar Diagnósticos</span>
            </a>
            
            <a href="#" 
               class="hospital-nav-item"
               data-tooltip="Novo Diagnóstico">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Novo Diagnóstico</span>
            </a>
            
            <a href="#" 
               class="hospital-nav-item"
               data-tooltip="Períodos">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m-6 4h6m2-14H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2z"></path>
                </svg>
                <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Períodos</span>
            </a>
        </div>
        @endcan
        
        <!-- Estrutura Section -->
        <div class="hospital-nav-section">
            <div class="hospital-nav-section-title transition-opacity duration-300 transition-display" :class="{ 'opacity-0 !hidden': sidebarCollapsed }">Estrutura</div>
            
            <a href="#" 
               class="hospital-nav-item {{ request()->is('unidades*') ? 'active' : '' }}">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Unidades</span>
            </a>
            
            <a href="#" 
               class="hospital-nav-item {{ request()->is('setores*') ? 'active' : '' }}">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Setores</span>
            </a>
        </div>
        
        <!-- Relatórios Section -->
        <div class="hospital-nav-section">
            <div class="hospital-nav-section-title" :class="{ 'opacity-0 hidden': sidebarCollapsed }">Relatórios</div>
            
            <a href="#" 
               class="hospital-nav-item {{ request()->is('relatorios*') ? 'active' : '' }}">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Dashboard Analytics</span>
            </a>
            
            <a href="#" 
               class="hospital-nav-item">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Exportar Dados</span>
            </a>
            
            <a href="#" 
               class="hospital-nav-item">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Relatórios Rápidos</span>
            </a>
        </div>
        
        <!-- Permissões Section -->
        @canany(['role.index', 'permission.index'])
        <div class="hospital-nav-section">
            <div class="hospital-nav-section-title transition-opacity duration-300 transition-display" :class="{ 'opacity-0 !hidden': sidebarCollapsed }">Permissões</div>
            
            @can('role.index')
            <a href="{{ route('admin.roles.index') }}" 
               class="hospital-nav-item {{ request()->routeIs('admin.roles.*') ? 'active' : '' }}"
               data-tooltip="Perfis">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Perfis</span>
            </a>
            @endcan
            
            @can('permission.index')
            <a href="{{ route('admin.permissions.index') }}" 
               class="hospital-nav-item {{ request()->routeIs('admin.permissions.*') ? 'active' : '' }}"
               data-tooltip="Permissões">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Permissões</span>
            </a>
            @endcan
        </div>
        @endcanany
        
        <!-- Sistema Section -->
        <div class="hospital-nav-section">
            <div class="hospital-nav-section-title" :class="{ 'opacity-0 hidden': sidebarCollapsed }">Sistema</div>
            
            <a href="#" 
               class="hospital-nav-item {{ request()->is('configuracoes*') ? 'active' : '' }}">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Configurações</span>
            </a>
            
            @can('user.index')
            <a href="{{ route('admin.users.index') }}" 
               class="hospital-nav-item {{ request()->routeIs('admin.users.*') ? 'active' : '' }}"
               data-tooltip="Usuários">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <span class="hospital-nav-text transition-opacity duration-300" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Usuários</span>
            </a>
            @endcan
            
            <a href="#" 
               class="hospital-nav-item {{ request()->is('logs*') ? 'active' : '' }}">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Logs do Sistema</span>
            </a>
            
            <a href="#" 
               class="hospital-nav-item">
                <svg class="hospital-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                </svg>
                <span class="hospital-nav-text" :class="{ 'opacity-0 w-0 overflow-hidden': sidebarCollapsed }">Backup</span>
            </a>
        </div>
    </nav>

    <!-- Status do Sistema (apenas quando expandido) -->
    <div class="px-4 py-3 border-t border-gray-200 status-system-container" x-show="!sidebarCollapsed" x-transition>
        <div class="gqa-card !p-4">
            <h4 class="font-semibold text-sm text-gray-900 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Status do Sistema
            </h4>
            
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-600">Servidor</span>
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="text-xs font-medium text-green-600">Online</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-600">Banco de Dados</span>
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-xs font-medium text-green-600">Conectado</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-600">Cache</span>
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span class="text-xs font-medium text-yellow-600">Parcial</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-gray-200">
                <div class="text-xs text-gray-600">
                    <div class="flex justify-between">
                        <span>Usuários Online:</span>
                        <span class="font-medium text-gray-900">{{ \App\Models\User::count() }}</span>
                    </div>
                    <div class="flex justify-between mt-1">
                        <span>Uptime:</span>
                        <span class="font-medium text-gray-900">99.9%</span>
                    </div>
                    <div class="flex justify-between mt-1">
                        <span>Última Atualização:</span>
                        <span class="font-medium text-gray-900">{{ now()->format('H:i') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Stats (mini ícones quando colapsado) -->
    <div class="px-2 py-4 space-y-3 border-t border-gray-200">
        <div class="gqa-stat-card !p-3" :class="{ '!p-2': sidebarCollapsed }">
            <div class="flex items-center" :class="{ 'justify-center': sidebarCollapsed }">
                <div class="gqa-stat-icon primary !w-8 !h-8 flex-shrink-0" :class="{ '!w-6 !h-6': sidebarCollapsed }">
                    <svg class="w-4 h-4" :class="{ 'w-3 h-3': sidebarCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <div class="ml-3 min-w-0" :class="{ 'opacity-0 w-0 overflow-hidden ml-0': sidebarCollapsed }">
                    <p class="text-2xl font-bold text-green-600" x-text="formatNumber(stats.totalDiagnosticos)">0</p>
                    <p class="text-xs text-gray-600">Diagnósticos</p>
                </div>
            </div>
        </div>
        
        <div class="gqa-stat-card !p-3" :class="{ '!p-2': sidebarCollapsed }">
            <div class="flex items-center" :class="{ 'justify-center': sidebarCollapsed }">
                <div class="gqa-stat-icon success !w-8 !h-8 flex-shrink-0" :class="{ '!w-6 !h-6': sidebarCollapsed }">
                    <svg class="w-4 h-4" :class="{ 'w-3 h-3': sidebarCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div class="ml-3 min-w-0" :class="{ 'opacity-0 w-0 overflow-hidden ml-0': sidebarCollapsed }">
                    <p class="text-2xl font-bold text-green-600" x-text="formatNumber(stats.taxaConformidade) + '%'">0%</p>
                    <p class="text-xs text-gray-600">Conformidade</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-gray-200">
        <div class="text-center" :class="{ 'opacity-0 hidden': sidebarCollapsed }">
            <div class="text-xs text-gray-500">
                <p class="font-medium">Sistema GQA v1.0.0</p>
                <p class="mt-1">© {{ date('Y') }} EMSERH</p>
                <p class="mt-1">Laravel {{ app()->version() }}</p>
            </div>
        </div>
        
        <!-- Versão compacta quando colapsado -->
        <div class="text-center" :class="{ 'opacity-0 hidden': !sidebarCollapsed }">
            <div class="text-xs text-gray-500 font-bold">
                GQA
            </div>
        </div>
    </div>
</aside>

<!-- Overlay para mobile -->
<div x-show="sidebarOpen" 
     @click="closeSidebar()"
     x-transition:enter="transition-opacity ease-linear duration-300"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition-opacity ease-linear duration-300"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     class="hospital-sidebar-overlay lg:hidden"
     style="display: none;">
</div>

<style>
.hospital-sidebar-collapsed {
    width: 6rem !important; /* Increased from 5rem to 6rem for better icon display */
}

.hospital-main-collapsed {
    margin-left: 6rem !important; /* Matching the sidebar width */
}

/* Ensure section titles are hidden in collapsed state */
.hospital-sidebar-collapsed .hospital-nav-section-title {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
}

/* Status system container */
.hospital-sidebar-collapsed .status-system-container {
    display: none !important;
}

/* Better icon spacing in collapsed state */
.hospital-sidebar-collapsed .hospital-nav-item {
    padding: 0.9rem 0.75rem !important; /* Increased horizontal padding from 0.5rem to 0.75rem */
    justify-content: center !important;
    margin: 0.25rem 0 !important;
    border-radius: 0.5rem !important;
}

/* Better icon sizing */
.hospital-sidebar-collapsed .hospital-nav-icon {
    width: 1.5rem !important;
    height: 1.5rem !important;
    margin-right: 0 !important;
}

/* Improved Tooltip adjustments */
.hospital-sidebar-collapsed .hospital-nav-item[data-tooltip] {
    position: relative;
}

.hospital-sidebar-collapsed .hospital-nav-item[data-tooltip]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    left: 100%;
    top: 0;
    transform: translateY(-50%);
    background: #1f2937;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    white-space: nowrap;
    margin-left: 0.75rem;
    z-index: 9999; /* Very high z-index to ensure it's above everything */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.hospital-sidebar-collapsed .hospital-nav-item[data-tooltip]:hover::before {
    content: "";
    position: absolute;
    top: 30%;
    left: 100%;
    transform: translateY(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent #1f2937 transparent transparent;
    margin-left: -6px;
    z-index: 9999; /* Very high z-index to ensure it's above everything */
}

.transition-display {
    transition: opacity 0.3s ease, visibility 0.3s ease, height 0.3s ease;
}
</style>