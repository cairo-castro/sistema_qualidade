@extends('layouts.admin')

@section('title', 'Criar Papel')

@section('content')
<div class="hospital-content">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
            </div>
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Criar Novo Papel</h1>
                <p class="text-sm text-gray-600 dark:text-gray-300">Defina um novo papel e suas permissões</p>
            </div>
        </div>
        <a href="{{ route('admin.roles.index') }}" class="hospital-btn hospital-btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Voltar
        </a>
    </div>    <div class="max-w-4xl mx-auto">
        <div class="gqa-card">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Informações do Papel</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Preencha os dados básicos do papel</p>
            </div>
            
            <div class="p-6">
                <form method="POST" action="{{ route('admin.roles.store') }}">
                    @csrf
                    
                    <div class="mb-6">
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome do Papel *
                        </label>                        <input type="text" 
                               class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white {{ $errors->has('name') ? 'border-red-500' : 'border-gray-300 dark:border-gray-600' }}" 
                               id="name" name="name" value="{{ old('name') }}" required
                               placeholder="Ex: Administrador, Gestor, Operador">
                        @error('name')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Ex: Administrador, Gestor, Operador</p>
                    </div>                    <!-- Permissões -->
                    <div class="mb-6">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Permissões</label>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Selecione as permissões para este papel</p>
                            </div>
                            <div class="flex space-x-2">
                                <button type="button" class="hospital-btn hospital-btn-sm hospital-btn-success" id="selectAll">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Selecionar Todas
                                </button>
                                <button type="button" class="hospital-btn hospital-btn-sm hospital-btn-outline" id="deselectAll">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Desmarcar Todas
                                </button>
                            </div>
                        </div>

                            @if($permissions->count() > 0)
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                @foreach($permissions as $group => $groupPermissions)
                                    <div class="gqa-card">
                                        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                                            <div class="flex items-center justify-between">
                                                <h4 class="text-sm font-semibold text-gray-900 dark:text-white capitalize flex items-center">
                                                    <svg class="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                                                    </svg>
                                                    {{ $group }}
                                                </h4>
                                                <label class="flex items-center">
                                                    <input class="form-checkbox h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded group-checkbox" 
                                                           type="checkbox" 
                                                           id="group_{{ $group }}" 
                                                           data-group="{{ $group }}">
                                                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-300">Selecionar Grupo</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="p-4 space-y-3">
                                            @foreach($groupPermissions as $permission)
                                                <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <input class="form-checkbox h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded permission-checkbox" 
                                                           type="checkbox" 
                                                           value="{{ $permission->id }}" 
                                                           id="permission_{{ $permission->id }}" 
                                                           name="permissions[]"
                                                           data-group="{{ $group }}"
                                                           {{ in_array($permission->id, old('permissions', [])) ? 'checked' : '' }}>
                                                    <span class="ml-3 flex items-center text-sm text-gray-700 dark:text-gray-300">
                                                        @php
                                                            $action = explode(' ', $permission->name)[0] ?? '';
                                                        @endphp
                                                        @switch($action)
                                                            @case('view')
                                                                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                                </svg>
                                                                @break
                                                            @case('create')
                                                                <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                                </svg>
                                                                @break
                                                            @case('edit')
                                                                <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                </svg>
                                                                @break
                                                            @case('delete')
                                                                <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                </svg>
                                                                @break
                                                            @case('manage')
                                                                <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                </svg>
                                                                @break
                                                            @default
                                                                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                                                </svg>
                                                        @endswitch
                                                        {{ $permission->name }}
                                                    </span>
                                                </label>
                                            @endforeach
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <div class="flex items-center">
                                    <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                    </svg>
                                    <span class="text-yellow-800 dark:text-yellow-200">Nenhuma permissão disponível. Crie permissões primeiro.</span>
                                </div>
                            </div>
                        @endif
                        
                        @error('permissions')
                            <p class="mt-2 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>                    <!-- Preview -->
                    <div class="gqa-card" id="permissionsPreview" style="display: none;">
                        <div class="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h4 class="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Permissões Selecionadas (<span id="selectedCount">0</span>)
                            </h4>
                        </div>
                        <div class="p-4">
                            <div id="selectedPermissions" class="flex flex-wrap gap-2"></div>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div class="flex items-center justify-between pt-6">
                        <a href="{{ route('admin.roles.index') }}" class="hospital-btn hospital-btn-secondary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Cancelar
                        </a>
                        <button type="submit" class="hospital-btn hospital-btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                            Criar Papel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const selectAllBtn = document.getElementById('selectAll');
    const deselectAllBtn = document.getElementById('deselectAll');
    const groupCheckboxes = document.querySelectorAll('.group-checkbox');
    const permissionCheckboxes = document.querySelectorAll('.permission-checkbox');
    const previewDiv = document.getElementById('permissionsPreview');
    const selectedCount = document.getElementById('selectedCount');
    const selectedPermissions = document.getElementById('selectedPermissions');

    // Select all permissions
    selectAllBtn.addEventListener('click', function() {
        permissionCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        updateGroupCheckboxes();
        updatePreview();
    });

    // Deselect all permissions
    deselectAllBtn.addEventListener('click', function() {
        permissionCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        groupCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updatePreview();
    });

    // Group checkbox functionality
    groupCheckboxes.forEach(groupCheckbox => {
        groupCheckbox.addEventListener('change', function() {
            const group = this.dataset.group;
            const groupPermissions = document.querySelectorAll(`input[data-group="${group}"].permission-checkbox`);
            
            groupPermissions.forEach(permission => {
                permission.checked = this.checked;
            });
            
            updatePreview();
        });
    });

    // Individual permission checkbox functionality
    permissionCheckboxes.forEach(permissionCheckbox => {
        permissionCheckbox.addEventListener('change', function() {
            updateGroupCheckboxes();
            updatePreview();
        });
    });

    function updateGroupCheckboxes() {
        groupCheckboxes.forEach(groupCheckbox => {
            const group = groupCheckbox.dataset.group;
            const groupPermissions = document.querySelectorAll(`input[data-group="${group}"].permission-checkbox`);
            const checkedPermissions = document.querySelectorAll(`input[data-group="${group}"].permission-checkbox:checked`);
            
            if (checkedPermissions.length === 0) {
                groupCheckbox.checked = false;
                groupCheckbox.indeterminate = false;
            } else if (checkedPermissions.length === groupPermissions.length) {
                groupCheckbox.checked = true;
                groupCheckbox.indeterminate = false;
            } else {
                groupCheckbox.checked = false;
                groupCheckbox.indeterminate = true;
            }
        });
    }

    function updatePreview() {
        const checkedPermissions = document.querySelectorAll('.permission-checkbox:checked');
        selectedCount.textContent = checkedPermissions.length;
        
        if (checkedPermissions.length > 0) {
            previewDiv.style.display = 'block';
            selectedPermissions.innerHTML = '';
              checkedPermissions.forEach(checkbox => {
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                const badge = document.createElement('span');
                badge.className = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
                badge.innerHTML = label.querySelector('span').innerHTML;
                selectedPermissions.appendChild(badge);
            });
        } else {
            previewDiv.style.display = 'none';
        }
    }

    // Initialize
    updateGroupCheckboxes();
    updatePreview();
});
</script>
@endpush
@endsection
