@extends('layouts.admin')

@section('title', 'Editar Permissão')

@section('content')
<div class="hospital-content">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Permissão</h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">Modificar informações da permissão: <span class="font-semibold text-purple-600 dark:text-purple-400">{{ $permission->name }}</span></p>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <a href="{{ route('admin.permissions.show', $permission) }}" class="hospital-btn hospital-btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                Visualizar
            </a>
            <a href="{{ route('admin.permissions.index') }}" class="hospital-btn hospital-btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Voltar
            </a>
        </div>
    </div>    <div class="max-w-4xl mx-auto space-y-6">
        <!-- Main Edit Form -->
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Editar Informações
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Modifique os dados da permissão</p>
            </div>
            <div class="p-6">
                <form action="{{ route('admin.permissions.update', $permission) }}" method="POST">
                    @csrf
                    @method('PUT')

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome da Permissão <span class="text-red-500">*</span>
                            </label>
                            <input type="text" 
                                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white {{ $errors->has('name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' }}" 
                                   id="name" 
                                   name="name" 
                                   value="{{ old('name', $permission->name) }}"
                                   placeholder="Ex: user.create, role.edit, permission.delete"
                                   required>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Use o formato: recurso.ação (ex: user.create, role.edit)
                            </p>
                            @error('name')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="guard_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Guard <span class="text-red-500">*</span>
                            </label>
                            <select class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white {{ $errors->has('guard_name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' }}"
                                    id="guard_name" 
                                    name="guard_name">
                                <option value="web" {{ old('guard_name', $permission->guard_name) == 'web' ? 'selected' : '' }}>Web</option>
                                <option value="api" {{ old('guard_name', $permission->guard_name) == 'api' ? 'selected' : '' }}>API</option>
                            </select>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Guard define onde a permissão será aplicada
                            </p>
                            @error('guard_name')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <a href="{{ route('admin.permissions.index') }}" class="hospital-btn hospital-btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancelar
                        </a>
                        <button type="submit" class="hospital-btn hospital-btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>        <!-- Permission Information -->
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Informações da Permissão
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Detalhes e estatísticas de uso</p>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Details Card -->
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h4 class="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Detalhes
                        </h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">ID:</span>
                                <span class="font-medium text-gray-900 dark:text-white">{{ $permission->id }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Criada em:</span>
                                <span class="font-medium text-gray-900 dark:text-white">{{ $permission->created_at->format('d/m/Y H:i') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Atualizada em:</span>
                                <span class="font-medium text-gray-900 dark:text-white">{{ $permission->updated_at->format('d/m/Y H:i') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Usage Stats Card -->
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <h4 class="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            Uso
                        </h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Perfis associados:</span>
                                <span class="font-medium text-gray-900 dark:text-white">{{ $permission->roles->count() }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Usuários diretos:</span>
                                <span class="font-medium text-gray-900 dark:text-white">{{ $permission->users->count() }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Total de usuários:</span>
                                <span class="font-bold text-green-600 dark:text-green-400">
                                    {{ $permission->roles->sum(function($role) { return $role->users->count(); }) + $permission->users->count() }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Roles using this permission -->
                @if($permission->roles->count() > 0)
                <div class="mt-6">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Perfis que possuem esta permissão:</h4>
                    <div class="flex flex-wrap gap-2">
                        @foreach($permission->roles as $role)
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                            </svg>
                            {{ $role->name }} ({{ $role->users->count() }} usuários)
                        </span>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Users with direct permission -->
                @if($permission->users->count() > 0)
                <div class="mt-6">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Usuários com permissão direta:</h4>
                    <div class="flex flex-wrap gap-2">
                        @foreach($permission->users as $user)
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            {{ $user->name }}
                        </span>
                        @endforeach
                    </div>
                </div>
                @endif

                <!-- Warning if dependencies exist -->
                @if($permission->roles->count() > 0 || $permission->users->count() > 0)
                <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <div>
                            <h4 class="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Atenção</h4>
                            <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Esta permissão está sendo utilizada por {{ $permission->roles->count() }} perfil(is) e {{ $permission->users->count() }} usuário(s). 
                                Alterar o nome pode afetar o funcionamento do sistema.
                            </p>
                        </div>
                    </div>
                </div>
                @endif
            </div>
        </div>        <!-- Danger Zone -->
        <div class="gqa-card border border-red-200 dark:border-red-800">
            <div class="p-6 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Zona de Perigo
                </h3>
                <p class="text-sm text-red-700 dark:text-red-300 mt-1">Ações irreversíveis que podem afetar o funcionamento do sistema</p>
            </div>
            <div class="p-6">
                <button type="button" 
                        class="hospital-btn bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                        onclick="openDeleteModal()">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Excluir Permissão
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="deleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6 border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Confirmar Exclusão
            </h3>
        </div>
        <div class="p-6">
            <p class="text-gray-700 dark:text-gray-300 mb-4">
                Tem certeza que deseja excluir a permissão <strong class="text-purple-600 dark:text-purple-400">"{{ $permission->name }}"</strong>?
            </p>
            
            @if($permission->roles->count() > 0 || $permission->users->count() > 0)
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <div>
                        <h4 class="text-sm font-semibold text-red-800 dark:text-red-200">Atenção</h4>
                        <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                            Esta permissão está sendo utilizada e sua exclusão pode afetar:
                        </p>
                        <ul class="text-sm text-red-700 dark:text-red-300 list-disc list-inside mt-2">
                            @if($permission->roles->count() > 0)
                            <li>{{ $permission->roles->count() }} perfil(is)</li>
                            @endif
                            @if($permission->users->count() > 0)
                            <li>{{ $permission->users->count() }} usuário(s)</li>
                            @endif
                        </ul>
                    </div>
                </div>
            </div>
            @endif
            
            <p class="text-sm text-gray-600 dark:text-gray-400">Esta ação não pode ser desfeita.</p>
        </div>
        <div class="p-6 border-t border-gray-200 dark:border-gray-600 flex items-center justify-end space-x-3">
            <button type="button" 
                    class="hospital-btn hospital-btn-secondary" 
                    onclick="closeDeleteModal()">
                Cancelar
            </button>
            <form action="{{ route('admin.permissions.destroy', $permission) }}" method="POST" class="inline">
                @csrf
                @method('DELETE')
                <button type="submit" 
                        class="hospital-btn bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Excluir Permanentemente
                </button>
            </form>
        </div>
    </div>
</div>

<script>
function openDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Close modal when clicking outside
document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDeleteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
});
</script>
@endsection
