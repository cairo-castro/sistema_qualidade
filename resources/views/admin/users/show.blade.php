@extends('layouts.admin')

@section('title', 'Visualizar Usuário')

@section('content')
<div class="hospital-content">
    <!-- Page Header -->
    <div class="mb-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    <svg class="w-6 h-6 inline-block mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Visualizar Usuário
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">{{ $user->name }}</p>
            </div>
            
            <div class="flex gap-3">
                @can('edit users')
                    <a href="{{ route('admin.users.edit', $user) }}" class="hospital-btn hospital-btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Editar
                    </a>
                @endcan
                <a href="{{ route('admin.users.index') }}" class="hospital-btn hospital-btn-secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Voltar
                </a>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- User Profile Card -->
        <div class="lg:col-span-1">
            <div class="gqa-card text-center">
                <!-- Avatar -->
                <div class="mb-4">
                    <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                        {{ strtoupper(substr($user->name, 0, 2)) }}
                    </div>
                </div>
                
                <!-- User Info -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ $user->name }}</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">{{ $user->email }}</p>
                
                <!-- Status Badges -->
                <div class="space-y-2 mb-4">
                    @if($user->email_verified_at)
                        <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Email Verificado
                        </div>
                    @else
                        <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Email Não Verificado
                        </div>
                    @endif

                    @if($user->id == auth()->id())
                        <div class="block">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Sua Conta
                            </span>
                        </div>
                    @endif
                </div>                
                <!-- Quick Stats -->
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $user->roles->count() }}</div>
                        <div class="text-sm text-blue-800 dark:text-blue-300">Papéis</div>
                    </div>
                    <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ $user->roles->sum(function($role) { return $role->permissions->count(); }) }}</div>
                        <div class="text-sm text-green-800 dark:text-green-300">Permissões</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
            <!-- User Roles -->
            <div class="gqa-card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Papéis Atribuídos</h3>
                    <span class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
                        {{ $user->roles->count() }}
                    </span>
                </div>
                
                @if($user->roles->count() > 0)
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @foreach($user->roles as $role)
                            <div class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg {{ $role->name == 'Admin' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' : ($role->name == 'Gestor' ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800') }}">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="px-3 py-1 text-sm font-medium rounded-full {{ $role->name == 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : ($role->name == 'Gestor' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400') }}">
                                        {{ $role->name }}
                                    </span>
                                    <span class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ $role->permissions->count() }} permissões
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Atribuído em {{ $role->pivot->created_at ? $role->pivot->created_at->format('d/m/Y') : 'N/A' }}
                                </p>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3h3a3 3 0 013 3v2a3 3 0 01-3 3H7z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum papel atribuído</h3>
                        <p class="text-gray-600 dark:text-gray-400">Este usuário não possui papéis atribuídos.</p>
                    </div>
                @endif
            </div>

            <!-- User Permissions -->
            <div class="gqa-card">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Permissões Efetivas</h3>
                
                @php
                    $allPermissions = $user->getAllPermissions();
                    $groupedPermissions = $allPermissions->groupBy(function ($permission) {
                        $parts = explode(' ', $permission->name);
                        return $parts[1] ?? 'other';
                    });
                @endphp

                @if($allPermissions->count() > 0)
                    <div class="space-y-4">
                        @foreach($groupedPermissions as $group => $permissions)
                            <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-3 capitalize">{{ $group }}</h4>
                                <div class="flex flex-wrap gap-2">
                                    @foreach($permissions as $permission)
                                        @php
                                            $action = explode(' ', $permission->name)[0] ?? '';
                                            $colorClass = match($action) {
                                                'view' => 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                                                'create' => 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                                                'edit' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                                                'delete' => 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                                                'manage' => 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
                                                default => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            };
                                        @endphp
                                        <span class="px-2 py-1 text-xs font-medium rounded {{ $colorClass }}">
                                            {{ $permission->name }}
                                        </span>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="text-center py-8">
                        <svg class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2h-2m2 0h2M9 7h6m0 10v-5m-6 5h6m6-4a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma permissão</h3>
                        <p class="text-gray-600 dark:text-gray-400">Este usuário não possui permissões efetivas.</p>
                    </div>
                @endif
            </div>

            <!-- System Information -->
            <div class="gqa-card">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Informações do Sistema</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">ID do Usuário</div>
                        <div class="text-gray-900 dark:text-gray-100 font-mono">#{{ $user->id }}</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Data de Criação</div>
                        <div class="text-gray-900 dark:text-gray-100" title="{{ $user->created_at->format('d/m/Y H:i:s') }}">
                            {{ $user->created_at->diffForHumans() }}
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Última Atualização</div>
                        <div class="text-gray-900 dark:text-gray-100" title="{{ $user->updated_at->format('d/m/Y H:i:s') }}">
                            {{ $user->updated_at->diffForHumans() }}
                        </div>
                    </div>
                    @if($user->email_verified_at)
                        <div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Email Verificado</div>
                            <div class="text-green-600 dark:text-green-400" title="{{ $user->email_verified_at->format('d/m/Y H:i:s') }}">
                                {{ $user->email_verified_at->diffForHumans() }}
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
                    @if($user->roles->count() > 0)
                        <div class="row">
                            @foreach($user->roles as $role)
                                <div class="col-md-6 mb-3">
                                    <div class="card border-left-{{ $role->name == 'Admin' ? 'danger' : ($role->name == 'Gestor' ? 'warning' : 'info') }}">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 class="mb-1">{{ $role->name }}</h6>
                                                    <small class="text-muted">{{ $role->permissions->count() }} permissões</small>
                                                </div>
                                                <span class="badge bg-{{ $role->name == 'Admin' ? 'danger' : ($role->name == 'Gestor' ? 'warning' : 'info') }}">
                                                    {{ $role->name }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="text-center py-4">
                            <i class="fas fa-user-tag fa-3x text-muted mb-3"></i>
                            <h6 class="text-muted">Nenhum papel atribuído</h6>
                            <p class="text-muted">Este usuário não possui papéis no sistema.</p>
                            @can('edit users')
                                <a href="{{ route('admin.users.edit', $user) }}" class="btn btn-primary btn-sm">
                                    <i class="fas fa-plus me-1"></i>Atribuir Papéis
                                </a>
                            @endcan
                        </div>
                    @endif
                </div>
            </div>

            <!-- Permissões Detalhadas -->
            @if($user->roles->count() > 0)
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-primary">Permissões Detalhadas</h6>
                    </div>
                    <div class="card-body">
                        @foreach($user->roles as $role)
                            <div class="mb-4">
                                <h6 class="border-bottom pb-2">
                                    <span class="badge bg-{{ $role->name == 'Admin' ? 'danger' : ($role->name == 'Gestor' ? 'warning' : 'info') }} me-2">
                                        {{ $role->name }}
                                    </span>
                                    ({{ $role->permissions->count() }} permissões)
                                </h6>
                                
                                @if($role->permissions->count() > 0)
                                    @php
                                        $permissionsByGroup = $role->permissions->groupBy(function($permission) {
                                            $parts = explode(' ', $permission->name);
                                            return count($parts) > 1 ? $parts[1] : 'other';
                                        });
                                    @endphp

                                    <div class="row">
                                        @foreach($permissionsByGroup as $group => $permissions)
                                            <div class="col-md-6 mb-3">
                                                <div class="card border-0 bg-light">
                                                    <div class="card-body py-2">
                                                        <h6 class="text-capitalize mb-2">{{ $group }}</h6>
                                                        @foreach($permissions as $permission)
                                                            <span class="badge bg-secondary me-1 mb-1">
                                                                {{ $permission->name }}
                                                            </span>
                                                        @endforeach
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <p class="text-muted">Este papel não possui permissões específicas.</p>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Ações -->
    @can('edit users')
        <div class="row mt-4">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h6 class="m-0 font-weight-bold text-primary">Ações Rápidas</h6>
                    </div>
                    <div class="card-body">
                        <div class="btn-group me-2">
                            <a href="{{ route('admin.users.edit', $user) }}" class="btn btn-primary">
                                <i class="fas fa-edit me-1"></i>Editar Usuário
                            </a>
                        </div>
                        
                        @can('delete users')
                            @if($user->id !== auth()->id())
                                <form method="POST" action="{{ route('admin.users.destroy', $user) }}" 
                                      class="d-inline" onsubmit="return confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger">
                                        <i class="fas fa-trash me-1"></i>Deletar Usuário
                                    </button>
                                </form>
                            @else
                                <button class="btn btn-secondary" disabled title="Não é possível deletar sua própria conta">
                                    <i class="fas fa-trash me-1"></i>Deletar Usuário
                                </button>
                            @endif
                        @endcan
                    </div>
                </div>
            </div>
        </div>
    @endcan
</div>

@push('styles')
<style>
.avatar-xl {
    width: 80px;
    height: 80px;
    font-size: 32px;
}

.border-left-danger {
    border-left: 4px solid #dc3545 !important;
}

.border-left-warning {
    border-left: 4px solid #ffc107 !important;
}

.border-left-info {
    border-left: 4px solid #17a2b8 !important;
}
</style>
@endpush
@endsection
