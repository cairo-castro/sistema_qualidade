@extends('layouts.admin')

@section('title', 'Detalhes da Permissão')

@section('content')
<div class="hospital-content">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"></path>
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Detalhes da Permissão</h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">Visualizar informações da permissão: <span class="font-semibold text-purple-600 dark:text-purple-400">{{ $permission->name }}</span></p>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <a href="{{ route('admin.permissions.edit', $permission) }}" class="hospital-btn hospital-btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar
            </a>
            <a href="{{ route('admin.permissions.index') }}" class="hospital-btn hospital-btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Voltar
            </a>
        </div>
    </div>

    <div class="max-w-7xl mx-auto space-y-6">
        <!-- Basic Information and Statistics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div class="gqa-card">
                <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Informações Básicas
                    </h3>
                </div>
                <div class="p-6 space-y-4">
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Nome:</span>
                        <code class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">{{ $permission->name }}</code>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Guard:</span>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{{ $permission->guard_name }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">ID:</span>
                        <span class="text-sm text-gray-900 dark:text-white">{{ $permission->id }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Criada em:</span>
                        <span class="text-sm text-gray-900 dark:text-white">{{ $permission->created_at->format('d/m/Y H:i') }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Atualizada em:</span>
                        <span class="text-sm text-gray-900 dark:text-white">{{ $permission->updated_at->format('d/m/Y H:i') }}</span>
                    </div>
                </div>
            </div>

            <!-- Usage Statistics -->
            <div class="gqa-card">
                <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        Estatísticas de Uso
                    </h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ $permission->roles->count() }}</div>
                            <div class="text-xs text-gray-600 dark:text-gray-400">Perfis</div>
                        </div>
                        <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ $permission->users->count() }}</div>
                            <div class="text-xs text-gray-600 dark:text-gray-400">Usuários Diretos</div>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            @php
                                $totalUsers = $permission->roles->sum(function($role) { 
                                    return $role->users->count(); 
                                }) + $permission->users->count();
                            @endphp
                            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ $totalUsers }}</div>
                            <div class="text-xs text-gray-600 dark:text-gray-400">Total de Usuários</div>
                        </div>
                    </div>

                    @php
                        $resource = explode('.', $permission->name)[0] ?? 'other';
                        $action = explode('.', $permission->name)[1] ?? 'unknown';
                        
                        $iconMap = [
                            'user' => 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
                            'role' => 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
                            'permission' => 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z',
                            'dashboard' => 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                        ];
                        $iconPath = $iconMap[$resource] ?? 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z';
                    @endphp

                    <div class="mt-6 flex justify-center">
                        <div class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $iconPath }}"></path>
                            </svg>
                            <div>
                                <div class="font-semibold text-gray-900 dark:text-white">{{ ucfirst($resource) }}</div>
                                <div class="text-sm text-gray-600 dark:text-gray-400">{{ ucfirst($action) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        <!-- Roles with this Permission -->
        @if($permission->roles->count() > 0)
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                    </svg>
                    Perfis com esta Permissão ({{ $permission->roles->count() }})
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Perfis que possuem esta permissão</p>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    @foreach($permission->roles as $role)
                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-3">
                            <h4 class="font-semibold text-gray-900 dark:text-white">{{ $role->name }}</h4>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                {{ $role->users->count() }} usuários
                            </span>
                        </div>
                        <div class="space-y-2 text-sm">
                            <div class="text-gray-600 dark:text-gray-400">
                                Guard: <code class="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{{ $role->guard_name }}</code>
                            </div>
                            <div class="text-gray-600 dark:text-gray-400">
                                {{ $role->permissions->count() }} permissões no total
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="{{ route('admin.roles.show', $role) }}" class="hospital-btn hospital-btn-sm hospital-btn-secondary w-full">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Ver Perfil
                            </a>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
        @endif

        <!-- Users with Direct Permission -->
        @if($permission->users->count() > 0)
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    Usuários com Permissão Direta ({{ $permission->users->count() }})
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Usuários que possuem esta permissão diretamente</p>
            </div>
            <div class="p-6">
                <div class="gqa-table-wrapper">
                    <table class="gqa-table">
                        <thead>
                            <tr>
                                <th>Usuário</th>
                                <th>Email</th>
                                <th>Perfis</th>
                                <th>Atribuída em</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($permission->users as $user)
                            <tr>
                                <td>
                                    <div class="flex items-center">
                                        <div class="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                            {{ strtoupper(substr($user->name, 0, 1)) }}
                                        </div>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ $user->name }}</span>
                                    </div>
                                </td>
                                <td class="text-gray-600 dark:text-gray-300">{{ $user->email }}</td>
                                <td>
                                    @if($user->roles->count() > 0)
                                        <div class="flex flex-wrap gap-1">
                                            @foreach($user->roles as $role)
                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">{{ $role->name }}</span>
                                            @endforeach
                                        </div>
                                    @else
                                        <span class="text-gray-400 dark:text-gray-500">Nenhum perfil</span>
                                    @endif
                                </td>
                                <td class="text-gray-600 dark:text-gray-300">
                                    @php
                                        $pivot = $user->permissions->where('id', $permission->id)->first();
                                    @endphp
                                    {{ $pivot ? $pivot->pivot->created_at->format('d/m/Y H:i') : 'N/A' }}
                                </td>
                                <td>
                                    <a href="{{ route('admin.users.show', $user) }}" class="hospital-btn hospital-btn-sm hospital-btn-secondary">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                        Ver
                                    </a>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        @endif        <!-- Related Permissions -->
        @php
            $relatedPermissions = \Spatie\Permission\Models\Permission::where('name', 'LIKE', $resource . '.%')
                ->where('id', '!=', $permission->id)
                ->take(8)
                ->get();
        @endphp

        @if($relatedPermissions->count() > 0)
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    Permissões Relacionadas ({{ ucfirst($resource) }})
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Outras permissões do mesmo recurso</p>
            </div>
            <div class="p-6">
                <div class="flex flex-wrap gap-3">
                    @foreach($relatedPermissions as $related)
                    <a href="{{ route('admin.permissions.show', $related) }}" 
                       class="inline-flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm">
                        {{ $related->name }}
                        <span class="ml-2 text-xs text-blue-500 dark:text-blue-400">({{ $related->roles->count() + $related->users->count() }})</span>
                    </a>
                    @endforeach
                </div>
            </div>
        </div>
        @endif

        <!-- Empty State Message -->
        @if($permission->roles->count() == 0 && $permission->users->count() == 0)
        <div class="gqa-card">
            <div class="p-6 text-center">
                <div class="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Permissão não utilizada</h3>
                <p class="text-gray-600 dark:text-gray-300">Esta permissão não está sendo utilizada por nenhum perfil ou usuário no momento.</p>
            </div>
        </div>
        @endif
    </div>
</div>
@endsection
