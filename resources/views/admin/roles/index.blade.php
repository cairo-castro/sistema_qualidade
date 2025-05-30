@extends('layouts.admin')

@section('title', 'Gerenciar Papéis')

@section('content')
<div class="hospital-content">
    <!-- Page Header -->
    <div class="mb-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    <svg class="w-6 h-6 inline-block mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Gerenciar Papéis
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie papéis e permissões do sistema</p>
            </div>
            
            @can('create roles')
                <a href="{{ route('admin.roles.create') }}" class="hospital-btn hospital-btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Novo Papel
                </a>
            @endcan
        </div>
    </div>

    <!-- Alerts -->
    @if(session('success'))
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-green-800 dark:text-green-200">{{ session('success') }}</span>
            </div>
        </div>
    @endif

    @if(session('error'))
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-red-800 dark:text-red-200">{{ session('error') }}</span>
            </div>
        </div>
    @endif

    <!-- Filters Card -->
    <div class="gqa-card mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filtros</h3>
        <form method="GET" action="{{ route('admin.roles.index') }}" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="md:col-span-2">
                <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
                <input type="text" 
                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                       id="search" name="search" 
                       value="{{ request('search') }}" 
                       placeholder="Nome do papel...">
            </div>
            
            <div>
                <label for="sort_by" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ordenar por</label>
                <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                        id="sort_by" name="sort_by">
                    <option value="name" {{ request('sort_by') == 'name' ? 'selected' : '' }}>Nome</option>
                    <option value="users_count" {{ request('sort_by') == 'users_count' ? 'selected' : '' }}>Nº Usuários</option>
                    <option value="created_at" {{ request('sort_by') == 'created_at' ? 'selected' : '' }}>Data Criação</option>
                </select>
            </div>
            
            <div>
                <label for="sort_direction" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Direção</label>
                <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                        id="sort_direction" name="sort_direction">
                    <option value="asc" {{ request('sort_direction') == 'asc' ? 'selected' : '' }}>Crescente</option>
                    <option value="desc" {{ request('sort_direction') == 'desc' ? 'selected' : '' }}>Decrescente</option>
                </select>
            </div>
            
            <div class="flex items-end">
                <button type="submit" class="w-full hospital-btn hospital-btn-outline-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Buscar
                </button>
            </div>
        </form>
    </div>    <!-- Roles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if($roles->count() > 0)
            @foreach($roles as $role)
                <div class="gqa-card group hover:shadow-lg transition-all duration-200">
                    <!-- Role Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3
                                {{ $role->name == 'Admin' ? 'bg-red-100 dark:bg-red-900/20' : 
                                   ($role->name == 'Gestor' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
                                    'bg-blue-100 dark:bg-blue-900/20') }}">
                                <svg class="w-5 h-5 
                                    {{ $role->name == 'Admin' ? 'text-red-600 dark:text-red-400' : 
                                       ($role->name == 'Gestor' ? 'text-yellow-600 dark:text-yellow-400' : 
                                        'text-blue-600 dark:text-blue-400') }}" 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $role->name }}</h3>
                        </div>
                        
                        <!-- Actions Dropdown -->
                        <div class="relative">
                            <button type="button" 
                                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onclick="toggleRoleDropdown('{{ $role->id }}')">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                </svg>
                            </button>
                            
                            <div id="roleDropdown{{ $role->id }}" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                <div class="py-1">
                                    @can('view roles')
                                        <a href="{{ route('admin.roles.show', $role) }}" 
                                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            Visualizar
                                        </a>
                                    @endcan
                                    
                                    @can('edit roles')
                                        <a href="{{ route('admin.roles.edit', $role) }}" 
                                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                            Editar
                                        </a>
                                    @endcan
                                    
                                    @can('create roles')
                                        <a href="{{ route('admin.roles.clone', $role) }}" 
                                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                            </svg>
                                            Clonar
                                        </a>
                                    @endcan
                                    
                                    @if($role->name !== 'Admin')
                                        @can('delete roles')
                                            <hr class="border-gray-200 dark:border-gray-700">
                                            <form method="POST" action="{{ route('admin.roles.destroy', $role) }}" 
                                                  onsubmit="return confirm('Tem certeza que deseja deletar este papel?')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" 
                                                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                    Deletar
                                                </button>
                                            </form>
                                        @endcan
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ $role->users_count }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Usuários</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $role->permissions->count() }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Permissões</div>
                        </div>
                    </div>

                    <!-- Permissions Preview -->
                    @if($role->permissions->count() > 0)
                        <div class="mb-4">
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissões principais:</h4>
                            <div class="flex flex-wrap gap-1">
                                @foreach($role->permissions->take(3) as $permission)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        {{ $permission->name }}
                                    </span>
                                @endforeach
                                @if($role->permissions->count() > 3)
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        +{{ $role->permissions->count() - 3 }} mais
                                    </span>
                                @endif
                            </div>
                        </div>
                    @endif

                    <!-- Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m1 5v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m2 0V9a2 2 0 012-2h8a2 2 0 012 2v2m-2 4h.01"></path>
                            </svg>
                            {{ $role->created_at->diffForHumans() }}
                        </div>
                        
                        <div class="flex gap-2">
                            @can('view roles')
                                <a href="{{ route('admin.roles.show', $role) }}" 
                                   class="hospital-btn hospital-btn-outline-info hospital-btn-sm">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </a>
                            @endcan
                            
                            @can('edit roles')
                                <a href="{{ route('admin.roles.edit', $role) }}" 
                                   class="hospital-btn hospital-btn-outline-primary hospital-btn-sm">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </a>
                            @endcan
                        </div>
                    </div>
                </div>
            @endforeach
        @else            <div class="col-span-full">
                <div class="text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum papel encontrado</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">Tente ajustar os filtros ou criar um novo papel.</p>
                    @can('create roles')
                        <a href="{{ route('admin.roles.create') }}" class="hospital-btn hospital-btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Criar Primeiro Papel
                        </a>
                    @endcan
                </div>
            </div>
        @endif
    </div>

    <!-- Pagination -->
    @if($roles->hasPages())
        <div class="flex justify-center mt-6">
            {{ $roles->appends(request()->query())->links() }}
        </div>
    @endif

    <!-- Summary Card -->
    <div class="gqa-card mt-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumo do Sistema</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ $roles->total() }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total de Papéis</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $roles->sum('users_count') }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Usuários com Papéis</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {{ $roles->avg('users_count') ? number_format($roles->avg('users_count'), 1) : '0' }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Média de Usuários por Papel</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {{ $roles->sum(function($role) { return $role->permissions->count(); }) }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Total de Permissões Atribuídas</div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('[id^="roleDropdown"]');
        dropdowns.forEach(dropdown => {
            const button = dropdown.previousElementSibling;
            if (!dropdown.contains(event.target) && !button.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });
});

function toggleRoleDropdown(roleId) {
    const dropdown = document.getElementById('roleDropdown' + roleId);
    const allDropdowns = document.querySelectorAll('[id^="roleDropdown"]');
    
    // Close all other dropdowns
    allDropdowns.forEach(d => {
        if (d.id !== 'roleDropdown' + roleId) {
            d.classList.add('hidden');
        }
    });
    
    // Toggle current dropdown
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}
</script>
@endpush
@endsection
