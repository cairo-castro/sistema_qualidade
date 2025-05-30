@extends('layouts.admin')

@section('title', 'Nova Permissão')

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
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nova Permissão</h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">Criar uma nova permissão no sistema</p>
            </div>
        </div>
        <a href="{{ route('admin.permissions.index') }}" class="hospital-btn hospital-btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Voltar
        </a>
    </div>

    <div class="max-w-3xl mx-auto">
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"></path>
                    </svg>
                    Informações da Permissão
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Preencha os dados da nova permissão</p>
            </div>
            <div class="p-6">
                <form action="{{ route('admin.permissions.store') }}" method="POST">
                    @csrf

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div class="lg:col-span-2">
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome da Permissão <span class="text-red-500">*</span>
                            </label>
                            <input type="text" 
                                   class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white {{ $errors->has('name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' }}" 
                                   id="name" 
                                   name="name" 
                                   value="{{ old('name') }}"
                                   placeholder="Ex: user.create, role.edit, permission.delete"
                                   required>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Use o formato: recurso.ação (ex: user.create, role.edit)
                            </p>
                            @error('name')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror                        </div>

                        <div>
                            <label for="guard_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Guard <span class="text-red-500">*</span>
                            </label>
                            <select class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white {{ $errors->has('guard_name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' }}"
                                    id="guard_name" 
                                    name="guard_name">
                                <option value="web" {{ old('guard_name', 'web') == 'web' ? 'selected' : '' }}>Web</option>
                                <option value="api" {{ old('guard_name') == 'api' ? 'selected' : '' }}>API</option>
                            </select>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Guard define onde a permissão será aplicada
                            </p>
                            @error('guard_name')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>                    <!-- Permission Examples -->
                    <div class="mt-8">
                        <div class="mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exemplos de Permissões Comuns</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-300">Clique em qualquer exemplo para preencher automaticamente</p>
                        </div>
                        
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <!-- Users Permissions -->
                            <div class="gqa-card">
                                <div class="p-4">
                                    <h4 class="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                        </svg>
                                        Usuários
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="suggestion-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors" data-value="user.index">user.index</span>
                                        <span class="suggestion-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors" data-value="user.create">user.create</span>
                                        <span class="suggestion-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors" data-value="user.edit">user.edit</span>
                                        <span class="suggestion-badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors" data-value="user.delete">user.delete</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Roles Permissions -->
                            <div class="gqa-card">
                                <div class="p-4">
                                    <h4 class="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                        </svg>
                                        Perfis
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="suggestion-badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" data-value="role.index">role.index</span>
                                        <span class="suggestion-badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" data-value="role.create">role.create</span>
                                        <span class="suggestion-badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" data-value="role.edit">role.edit</span>
                                        <span class="suggestion-badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors" data-value="role.delete">role.delete</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Permissions Permissions -->
                            <div class="gqa-card">
                                <div class="p-4">
                                    <h4 class="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z"></path>
                                        </svg>
                                        Permissões
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="suggestion-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors" data-value="permission.index">permission.index</span>
                                        <span class="suggestion-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors" data-value="permission.create">permission.create</span>
                                        <span class="suggestion-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors" data-value="permission.edit">permission.edit</span>
                                        <span class="suggestion-badge bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors" data-value="permission.delete">permission.delete</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Dashboard Permissions -->
                            <div class="gqa-card">
                                <div class="p-4">
                                    <h4 class="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                        </svg>
                                        Dashboard
                                    </h4>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="suggestion-badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors" data-value="dashboard.view">dashboard.view</span>
                                        <span class="suggestion-badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors" data-value="admin.access">admin.access</span>
                                        <span class="suggestion-badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors" data-value="reports.view">reports.view</span>
                                    </div>
                                </div>
                            </div>
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
                            Salvar Permissão
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Add click functionality to suggestion badges
    document.querySelectorAll('.suggestion-badge').forEach(function(badge) {
        badge.addEventListener('click', function() {
            const nameInput = document.getElementById('name');
            nameInput.value = this.dataset.value;
            nameInput.focus();
            
            // Temporarily highlight the input
            nameInput.classList.add('ring-2', 'ring-green-500', 'border-green-500');
            setTimeout(() => {
                nameInput.classList.remove('ring-2', 'ring-green-500', 'border-green-500');
            }, 1000);
        });
    });

    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        const nameInput = document.getElementById('name');
        if (!nameInput.value.trim()) {
            e.preventDefault();
            nameInput.focus();
            nameInput.classList.add('border-red-500');
        }
    });
});
</script>
@endsection
