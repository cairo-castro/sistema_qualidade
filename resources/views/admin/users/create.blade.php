@extends('layouts.admin')

@section('title', 'Criar Usuário')

@section('content')
<div class="hospital-content">
    <!-- Header da Página -->
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Criar Novo Usuário</h1>
            <p class="text-gray-600 mt-1">Adicione um novo usuário ao sistema</p>
        </div>
        <a href="{{ route('admin.users.index') }}" class="gqa-btn secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Voltar
        </a>
    </div>

    <!-- Card Principal -->
    <div class="gqa-card">
        <!-- Alertas de Erro -->
        @if ($errors->any())
            <div class="gqa-alert danger mb-6">
                <div class="flex items-start">
                    <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                        <h6 class="font-medium mb-2">Erro de Validação</h6>
                        <ul class="text-sm space-y-1">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        @endif
        
        <form method="POST" action="{{ route('admin.users.store') }}" class="p-6 space-y-6" x-data="userForm()">
            @csrf
            
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">                <!-- Nome -->
                <div>
                    <label for="name" class="gqa-label">
                        Nome <span class="text-red-500">*</span>
                    </label>
                    <input type="text" 
                           id="name" 
                           name="name" 
                           value="{{ old('name') }}" 
                           required
                           class="gqa-input @error('name') error @enderror"
                           placeholder="Digite o nome completo">
                    @error('name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>                <!-- Email -->
                <div>
                    <label for="email" class="gqa-label">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" 
                           id="email" 
                           name="email" 
                           value="{{ old('email') }}" 
                           required
                           class="gqa-input @error('email') error @enderror"
                           placeholder="exemplo@empresa.com">
                    @error('email')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Password Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">                <!-- Senha -->
                <div>
                    <label for="password" class="gqa-label">
                        Senha <span class="text-red-500">*</span>
                    </label>
                    <div class="relative" x-data="{ showPassword: false }">
                        <input x-bind:type="showPassword ? 'text' : 'password'" 
                               id="password" 
                               name="password" 
                               required
                               class="gqa-input pr-20 @error('password') error @enderror"
                               placeholder="Mínimo 8 caracteres">
                        <div class="absolute inset-y-0 right-0 flex items-center">
                            <button type="button" 
                                    x-on:click="showPassword = !showPassword"
                                    class="px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                <svg class="w-4 h-4" x-show="!showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                <svg class="w-4 h-4" x-show="showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                </svg>
                            </button>                            <button type="button" 
                                    x-on:click="generatePassword()"
                                    class="px-3 py-2 text-hospital-400 hover:text-hospital-600 focus:outline-none"
                                    title="Gerar senha forte">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    @error('password')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-sm text-gray-500">Mínimo de 8 caracteres</p>
                </div>                <!-- Confirmar Senha -->
                <div>
                    <label for="password_confirmation" class="gqa-label">
                        Confirmar Senha <span class="text-red-500">*</span>
                    </label>
                    <div class="relative" x-data="{ showConfirmPassword: false }">
                        <input x-bind:type="showConfirmPassword ? 'text' : 'password'" 
                               id="password_confirmation" 
                               name="password_confirmation" 
                               required
                               class="gqa-input pr-10"
                               placeholder="Repita a senha">
                        <button type="button" 
                                x-on:click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-0 px-3 py-2 text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg class="w-4 h-4" x-show="!showConfirmPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <svg class="w-4 h-4" x-show="showConfirmPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>            <!-- Roles Section -->
            <div>
                <label class="gqa-label mb-3">
                    Perfis de Acesso
                </label>
                <div class="gqa-card-info p-4">
                    @if($roles->count() > 0)
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            @foreach($roles as $role)
                                <div class="relative">
                                    <label class="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input type="checkbox" 
                                               value="{{ $role->id }}" 
                                               name="roles[]" 
                                               {{ in_array($role->id, old('roles', [])) ? 'checked' : '' }}
                                               class="h-4 w-4 text-hospital-600 focus:ring-hospital-500 border-gray-300 rounded">
                                        <div class="ml-3 flex-1">
                                            <div class="flex items-center">
                                                <span class="gqa-badge {{ $role->name == 'Admin' ? 'danger' : ($role->name == 'Gestor' ? 'warning' : 'info') }}">
                                                    {{ $role->name }}
                                                </span>
                                            </div>
                                            @if($role->permissions->count() > 0)
                                                <p class="text-xs text-gray-500 mt-1">{{ $role->permissions->count() }} permissões</p>
                                            @endif
                                        </div>
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <p class="text-gray-500 text-center py-4">Nenhum perfil disponível.</p>
                    @endif
                </div>
                @error('roles')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>            <!-- Action Buttons -->
            <div class="flex justify-between pt-6 border-t border-gray-200">
                <a href="{{ route('admin.users.index') }}" 
                   class="gqa-btn ghost">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancelar
                </a>
                <button type="submit" 
                        class="gqa-btn primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Criar Usuário
                </button>
            </div>        </form>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('userForm', () => ({
        generatePassword() {
            const length = 12;
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let password = "";
            for (let i = 0, n = charset.length; i < length; ++i) {
                password += charset.charAt(Math.floor(Math.random() * n));
            }
            
            // Atualizar ambos os campos
            document.getElementById('password').value = password;
            document.getElementById('password_confirmation').value = password;
            
            // Disparar eventos para atualizar validação
            document.getElementById('password').dispatchEvent(new Event('input'));
            document.getElementById('password_confirmation').dispatchEvent(new Event('input'));
        }
    }));
});

document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const form = document.querySelector('form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('password_confirmation');

    function validatePasswords() {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('As senhas não conferem');
            confirmPasswordInput.classList.add('error');
        } else {
            confirmPasswordInput.setCustomValidity('');
            confirmPasswordInput.classList.remove('error');
        }
    }

    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', validatePasswords);
        confirmPasswordInput.addEventListener('input', validatePasswords);
    }
});
</script>
@endpush
@endsection
