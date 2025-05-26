<x-app-layout>
    <x-slot name="title">Meu Perfil</x-slot>
    
    @php
    $breadcrumbs = [
        ['title' => 'Meu Perfil']
    ];
    @endphp
    
    <div class="space-y-6" x-data="profileEditor()" x-init="init()">
        <!-- Primeira linha de cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <!-- Dados Pessoais -->
            <div class="gqa-card">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="gqa-stat-icon primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Informações Pessoais</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Atualize suas informações básicas</p>
                    </div>
                </div>
                
                @if (session('status') === 'profile-updated')
                    <div class="gqa-alert success mb-6" 
                         x-data="{ show: true }" 
                         x-show="show" 
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="opacity-100 transform scale-100"
                         x-transition:leave-end="opacity-0 transform scale-95"
                         x-init="setTimeout(() => show = false, 5000)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Perfil atualizado com sucesso!</span>
                            </div>
                            <button @click="show = false" class="text-current opacity-70 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                @endif
                
                <form method="post" action="{{ route('profile.update') }}" class="space-y-6" @submit="isSubmitting = true" x-ref="profileForm">
                    @csrf
                    @method('patch')
                    
                    <div class="space-y-4">
                        <div>
                            <label class="gqa-label" for="name">Nome Completo</label>
                            <div class="relative">
                                <input type="text" 
                                       id="name" name="name" 
                                       value="{{ old('name', $user->name) }}" 
                                       class="gqa-input {{ $errors->has('name') ? 'error' : '' }}" 
                                       required autofocus autocomplete="name"
                                       x-model="form.name"
                                       @input="validateField('name', $event.target.value)">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" 
                                     x-show="validation.name.isValid && form.name.length > 0">
                                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            @error('name')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                        </div>
                        
                        <div>
                            <label class="gqa-label" for="email">Email</label>
                            <div class="relative">
                                <input type="email" 
                                       id="email" name="email" 
                                       value="{{ old('email', $user->email) }}" 
                                       class="gqa-input {{ $errors->has('email') ? 'error' : '' }}" 
                                       required autocomplete="email"
                                       x-model="form.email"
                                       @input="validateField('email', $event.target.value)">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" 
                                     x-show="validation.email.isValid && form.email.length > 0">
                                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            @error('email')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                    
                    <div class="flex justify-end pt-4">
                        <button type="submit" 
                                class="gqa-btn primary"
                                :disabled="isSubmitting || !isFormValid"
                                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !isFormValid }">
                            <span x-text="isSubmitting ? 'Salvando...' : 'Salvar'"></span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Alterar Senha -->
            <div class="gqa-card" x-data="passwordForm()">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="gqa-stat-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Alterar Senha</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Mantenha sua conta segura</p>
                    </div>
                </div>
                
                @if (session('status') === 'password-updated')
                    <div class="gqa-alert success mb-6" x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)">
                        <span>Senha alterada com sucesso!</span>
                    </div>
                @endif
                
                <form method="post" action="{{ route('password.update') }}" class="space-y-4" @submit="isSubmittingPassword = true">
                    @csrf
                    @method('put')
                    
                    <div>
                        <label class="gqa-label" for="current_password">Senha Atual</label>
                        <input :type="showCurrentPassword ? 'text' : 'password'" 
                               id="current_password" name="current_password" 
                               class="gqa-input {{ $errors->updatePassword->has('current_password') ? 'error' : '' }}" 
                               x-model="passwordForm.current_password">
                        @error('current_password', 'updatePassword')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label class="gqa-label" for="password">Nova Senha</label>
                        <input :type="showNewPassword ? 'text' : 'password'" 
                               id="password" name="password" 
                               class="gqa-input {{ $errors->updatePassword->has('password') ? 'error' : '' }}" 
                               x-model="passwordForm.password"
                               @input="checkPasswordStrength($event.target.value)">
                        @error('password', 'updatePassword')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label class="gqa-label" for="password_confirmation">Confirmar Senha</label>
                        <input :type="showConfirmPassword ? 'text' : 'password'" 
                               id="password_confirmation" name="password_confirmation" 
                               class="gqa-input {{ $errors->updatePassword->has('password_confirmation') ? 'error' : '' }}" 
                               x-model="passwordForm.password_confirmation"
                               @input="checkPasswordMatch()">
                        @error('password_confirmation', 'updatePassword')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="flex justify-end pt-4">
                        <button type="submit" 
                                class="gqa-btn warning"
                                :disabled="isSubmittingPassword || !isPasswordFormValid">
                            <span x-text="isSubmittingPassword ? 'Alterando...' : 'Alterar'"></span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Informações da Conta -->
            <div class="gqa-card">
                <div class="text-center mb-6">
                    <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto mb-4">
                        <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=random&size=96" 
                             alt="{{ Auth::user()->name }}" class="w-full h-full object-cover" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ Auth::user()->name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ Auth::user()->email }}</p>
                </div>
                
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">ID</span>
                        <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">#{{ Auth::user()->id }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Membro desde</span>
                        <span class="text-sm">{{ Auth::user()->created_at->format('d/m/Y') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Ativo
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Segunda linha de cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Estatísticas -->
            <div class="gqa-card" x-data="userStats()" x-init="loadStats()">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suas Estatísticas</h3>
                
                <div class="space-y-4" x-show="!loading">
                    <div class="gqa-stat-card primary">
                        <div class="gqa-stat-content">
                            <div class="gqa-stat-title">Diagnósticos</div>
                            <div class="gqa-stat-value" x-text="stats.diagnosticos"></div>
                            <div class="gqa-stat-desc">Realizados</div>
                        </div>
                    </div>
                    
                    <div class="gqa-stat-card success">
                        <div class="gqa-stat-content">
                            <div class="gqa-stat-title">Conformidade</div>
                            <div class="gqa-stat-value" x-text="stats.conformidades + '%'"></div>
                            <div class="gqa-stat-desc">Média</div>
                        </div>
                    </div>
                </div>
                
                <div x-show="loading" class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>

            <!-- Zona de Perigo -->
            <div class="gqa-card border-red-200 dark:border-red-800" x-data="{ showDangerZone: false }">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-4">
                        <div class="gqa-stat-icon danger">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">Zona de Perigo</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Ações irreversíveis</p>
                        </div>
                    </div>
                    <button @click="showDangerZone = !showDangerZone" class="text-red-400 hover:text-red-600">
                        <svg :class="showDangerZone ? 'rotate-180' : ''" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                
                <div x-show="showDangerZone" x-transition>
                    <div class="gqa-alert danger mb-4">
                        <p class="text-sm">Uma vez que sua conta for deletada, todos os recursos e dados serão permanentemente excluídos.</p>
                    </div>
                    
                    <button class="gqa-btn danger outline w-full" @click="$dispatch('open-delete-modal')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Deletar Conta
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Deletar Conta -->
    <div x-data="deleteModal()" @open-delete-modal.window="openModal()" x-show="isOpen" 
         x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
         class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeModal()"></div>
            
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Confirmar Exclusão</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <form method="post" action="{{ route('profile.destroy') }}" class="px-4 pb-4 sm:px-6 sm:pb-6" @submit="isDeleting = true">
                    @csrf
                    @method('delete')
                    
                    <div class="mt-4">
                        <label for="delete_password" class="gqa-label">Digite sua senha:</label>
                        <input type="password" id="delete_password" name="password" 
                               class="gqa-input {{ $errors->userDeletion->has('password') ? 'error' : '' }}" 
                               required x-model="password" x-ref="passwordInput">
                        @error('password', 'userDeletion')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="mt-6 flex space-x-3 justify-end">
                        <button type="button" @click="closeModal()" class="gqa-btn ghost" :disabled="isDeleting">Cancelar</button>
                        <button type="submit" class="gqa-btn danger" :disabled="isDeleting || !password.length">
                            <span x-text="isDeleting ? 'Deletando...' : 'Deletar'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        function profileEditor() {
            return {
                isSubmitting: false,
                form: { name: '{{ old('name', $user->name) }}', email: '{{ old('email', $user->email) }}' },
                validation: { name: { isValid: true }, email: { isValid: true } },
                
                init() {
                    this.validateField('name', this.form.name);
                    this.validateField('email', this.form.email);
                },
                
                validateField(field, value) {
                    if (field === 'name') this.validation.name.isValid = value.length >= 2;
                    if (field === 'email') this.validation.email.isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                
                get isFormValid() {
                    return this.validation.name.isValid && this.validation.email.isValid && this.form.name.length > 0 && this.form.email.length > 0;
                }
            }
        }

        function passwordForm() {
            return {
                isSubmittingPassword: false,
                showCurrentPassword: false, showNewPassword: false, showConfirmPassword: false,
                passwordForm: { current_password: '', password: '', password_confirmation: '' },
                passwordStrength: { score: 0, checks: { length: false, uppercase: false, number: false, special: false } },
                passwordMatch: true,
                
                checkPasswordStrength(password) {
                    this.passwordStrength.checks.length = password.length >= 8;
                    this.passwordStrength.checks.uppercase = /[A-Z]/.test(password);
                    this.passwordStrength.checks.number = /\d/.test(password);
                    this.passwordStrength.checks.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                    this.passwordStrength.score = Object.values(this.passwordStrength.checks).filter(Boolean).length;
                    this.checkPasswordMatch();
                },
                
                checkPasswordMatch() {
                    this.passwordMatch = this.passwordForm.password === this.passwordForm.password_confirmation || this.passwordForm.password_confirmation.length === 0;
                },
                
                get isPasswordFormValid() {
                    return this.passwordForm.current_password.length > 0 && this.passwordStrength.score >= 3 && this.passwordMatch && this.passwordForm.password.length > 0 && this.passwordForm.password_confirmation.length > 0;
                }
            }
        }

        function userStats() {
            return {
                loading: true,
                stats: { diagnosticos: 0, conformidades: 0, periodos: 0, ultima_atividade: '' },
                
                async loadStats() {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    this.stats = {
                        diagnosticos: Math.floor(Math.random() * 45) + 5,
                        conformidades: Math.floor(Math.random() * 20) + 80,
                        periodos: Math.floor(Math.random() * 6) + 2,
                        ultima_atividade: 'há 2 horas'
                    };
                    this.loading = false;
                }
            }
        }

        function deleteModal() {
            return {
                isOpen: false, isDeleting: false, password: '',
                
                openModal() {
                    this.isOpen = true;
                    this.password = '';
                    this.$nextTick(() => { if (this.$refs.passwordInput) this.$refs.passwordInput.focus(); });
                },
                
                closeModal() { if (!this.isDeleting) { this.isOpen = false; this.password = ''; } }
            }
        }
    </script>

            <!-- Dados Pessoais -->
            <div class="gqa-card">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="gqa-stat-icon primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Informações Pessoais</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Atualize suas informações básicas</p>
                    </div>
                </div>
                
                @if (session('status') === 'profile-updated')
                    <div class="gqa-alert success mb-6" 
                         x-data="{ show: true }" 
                         x-show="show" 
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="opacity-100 transform scale-100"
                         x-transition:leave-end="opacity-0 transform scale-95"
                         x-init="setTimeout(() => show = false, 5000)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Perfil atualizado com sucesso!</span>
                            </div>
                            <button @click="show = false" class="text-current opacity-70 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                @endif
                
                <form method="post" 
                      action="{{ route('profile.update') }}" 
                      class="space-y-6" 
                      @submit="isSubmitting = true"
                      x-ref="profileForm">
                    @csrf
                    @method('patch')
                    
                    <div class="space-y-4">
                        <div>
                            <label class="gqa-label" for="name">Nome Completo</label>
                            <div class="relative">
                                <input type="text" 
                                       id="name"
                                       name="name" 
                                       value="{{ old('name', $user->name) }}" 
                                       class="gqa-input {{ $errors->has('name') ? 'error' : '' }}" 
                                       required 
                                       autofocus
                                       autocomplete="name"
                                       x-model="form.name"
                                       @input="validateField('name', $event.target.value)">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" 
                                     x-show="validation.name.isValid && form.name.length > 0">
                                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            @error('name')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                            <p x-show="!validation.name.isValid && validation.name.message" 
                               x-text="validation.name.message" 
                               class="mt-1 text-sm text-red-600 dark:text-red-400"></p>
                        </div>
                        
                        <div>
                            <label class="gqa-label" for="email">Endereço de Email</label>
                            <div class="relative">
                                <input type="email" 
                                       id="email"
                                       name="email" 
                                       value="{{ old('email', $user->email) }}" 
                                       class="gqa-input {{ $errors->has('email') ? 'error' : '' }}" 
                                       required
                                       autocomplete="email"
                                       x-model="form.email"
                                       @input="validateField('email', $event.target.value)">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none" 
                                     x-show="validation.email.isValid && form.email.length > 0">
                                    <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            @error('email')
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                            @enderror
                            <p x-show="!validation.email.isValid && validation.email.message" 
                               x-text="validation.email.message" 
                               class="mt-1 text-sm text-red-600 dark:text-red-400"></p>
                            
                            @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
                                <div class="gqa-alert warning mt-3">
                                    <div class="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div>
                                            <p class="font-medium">Email não verificado</p>
                                            <p class="text-sm mt-1">
                                                Seu endereço de email ainda não foi verificado. 
                                                <button form="send-verification" class="gqa-btn ghost sm">
                                                    Clique aqui para reenviar o email de verificação.
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                @if (session('status') === 'verification-link-sent')
                                    <div class="gqa-alert info mt-3">
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Um novo link de verificação foi enviado para seu email.</span>
                                        </div>
                                    </div>
                                @endif
                            @endif
                        </div>
                    </div>
                    
                    <div class="flex justify-end pt-4">
                        <button type="submit" 
                                class="gqa-btn primary"
                                :disabled="isSubmitting || !isFormValid"
                                :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !isFormValid }">
                            <svg x-show="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <svg x-show="isSubmitting" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span x-text="isSubmitting ? 'Salvando...' : 'Salvar Alterações'"></span>
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Alterar Senha -->
            <div class="gqa-card">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="gqa-stat-icon warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Alterar Senha</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Mantenha sua conta segura com uma senha forte</p>
                    </div>
                </div>
                
                @if (session('status') === 'password-updated')
                    <div class="gqa-alert success mb-6"
                         x-data="{ show: true }" 
                         x-show="show" 
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 transform scale-95"
                         x-transition:enter-end="opacity-100 transform scale-100"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="opacity-100 transform scale-100"
                         x-transition:leave-end="opacity-0 transform scale-95"
                         x-init="setTimeout(() => show = false, 5000)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Senha alterada com sucesso!</span>
                            </div>
                            <button @click="show = false" class="text-current opacity-70 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                @endif
                
                <form method="post" 
                      action="{{ route('password.update') }}" 
                      class="space-y-4"
                      x-data="passwordForm()"
                      @submit="isSubmittingPassword = true"
                      x-ref="passwordForm">
                    @csrf
                    @method('put')
                    
                    <div>
                        <label class="gqa-label" for="current_password">Senha Atual</label>
                        <div class="relative">
                            <input :type="showCurrentPassword ? 'text' : 'password'" 
                                   id="current_password"
                                   name="current_password" 
                                   class="gqa-input {{ $errors->updatePassword->has('current_password') ? 'error' : '' }}" 
                                   autocomplete="current-password"
                                   x-model="passwordForm.current_password">
                            <button type="button" 
                                    @click="showCurrentPassword = !showCurrentPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg x-show="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg x-show="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            </button>
                        </div>
                        @error('current_password', 'updatePassword')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label class="gqa-label" for="password">Nova Senha</label>
                        <div class="relative">
                            <input :type="showNewPassword ? 'text' : 'password'" 
                                   id="password"
                                   name="password" 
                                   class="gqa-input {{ $errors->updatePassword->has('password') ? 'error' : '' }}" 
                                   autocomplete="new-password"
                                   x-model="passwordForm.password"
                                   @input="checkPasswordStrength($event.target.value)">
                            <button type="button" 
                                    @click="showNewPassword = !showNewPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg x-show="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg x-show="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Password Strength Indicator -->
                        <div x-show="passwordForm.password.length > 0" class="mt-2">
                            <div class="flex items-center space-x-2">
                                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="h-2 rounded-full transition-all duration-300"
                                         :class="{
                                             'bg-red-500 w-1/4': passwordStrength.score === 1,
                                             'bg-orange-500 w-2/4': passwordStrength.score === 2,
                                             'bg-yellow-500 w-3/4': passwordStrength.score === 3,
                                             'bg-green-500 w-full': passwordStrength.score === 4
                                         }"></div>
                                </div>
                                <span class="text-xs font-medium"
                                      :class="{
                                          'text-red-600 dark:text-red-400': passwordStrength.score === 1,
                                          'text-orange-600 dark:text-orange-400': passwordStrength.score === 2,
                                          'text-yellow-600 dark:text-yellow-400': passwordStrength.score === 3,
                                          'text-green-600 dark:text-green-400': passwordStrength.score === 4
                                      }"
                                      x-text="passwordStrength.label"></span>
                            </div>
                            <ul class="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                <li class="flex items-center" :class="{ 'text-green-600 dark:text-green-400': passwordStrength.checks.length }">
                                    <svg class="h-3 w-3 mr-1" :class="passwordStrength.checks.length ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    Pelo menos 8 caracteres
                                </li>
                                <li class="flex items-center" :class="{ 'text-green-600 dark:text-green-400': passwordStrength.checks.uppercase }">
                                    <svg class="h-3 w-3 mr-1" :class="passwordStrength.checks.uppercase ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    Uma letra maiúscula
                                </li>
                                <li class="flex items-center" :class="{ 'text-green-600 dark:text-green-400': passwordStrength.checks.number }">
                                    <svg class="h-3 w-3 mr-1" :class="passwordStrength.checks.number ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    Um número
                                </li>
                                <li class="flex items-center" :class="{ 'text-green-600 dark:text-green-400': passwordStrength.checks.special }">
                                    <svg class="h-3 w-3 mr-1" :class="passwordStrength.checks.special ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                    Um caractere especial
                                </li>
                            </ul>
                        </div>
                        
                        @error('password', 'updatePassword')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label class="gqa-label" for="password_confirmation">Confirmar Nova Senha</label>
                        <div class="relative">
                            <input :type="showConfirmPassword ? 'text' : 'password'" 
                                   id="password_confirmation"
                                   name="password_confirmation" 
                                   class="gqa-input {{ $errors->updatePassword->has('password_confirmation') ? 'error' : '' }}" 
                                   autocomplete="new-password"
                                   x-model="passwordForm.password_confirmation"
                                   @input="checkPasswordMatch()">
                            <button type="button" 
                                    @click="showConfirmPassword = !showConfirmPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <svg x-show="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <svg x-show="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            </button>
                            <div class="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none" 
                                 x-show="passwordMatch && passwordForm.password_confirmation.length > 0">
                                <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p x-show="!passwordMatch && passwordForm.password_confirmation.length > 0" 
                           class="mt-1 text-sm text-red-600 dark:text-red-400">
                            As senhas não coincidem
                        </p>
                        @error('password_confirmation', 'updatePassword')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="flex justify-end pt-4">
                        <button type="submit" 
                                class="gqa-btn warning"
                                :disabled="isSubmittingPassword || !isPasswordFormValid"
                                :class="{ 'opacity-50 cursor-not-allowed': isSubmittingPassword || !isPasswordFormValid }">
                            <svg x-show="!isSubmittingPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <svg x-show="isSubmittingPassword" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span x-text="isSubmittingPassword ? 'Alterando...' : 'Alterar Senha'"></span>
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Informações da Conta -->
            <div class="gqa-card" x-data="{ showAccountDetails: true }">
                <div class="text-center">
                    <div class="relative inline-block mb-4">
                        <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=random&size=96" 
                                 alt="{{ Auth::user()->name }}"
                                 class="w-full h-full object-cover" />
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ Auth::user()->name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ Auth::user()->email }}</p>
                    
                    @if(Auth::user()->getRoleNames()->isNotEmpty())
                        <div class="flex justify-center mb-4 flex-wrap gap-2">
                            @foreach(Auth::user()->getRoleNames() as $role)
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {{ $role }}
                                </span>
                            @endforeach
                        </div>
                    @endif
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                
                <button @click="showAccountDetails = !showAccountDetails" 
                        class="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <span>Detalhes da Conta</span>
                    <svg :class="showAccountDetails ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                
                <div x-show="showAccountDetails" 
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform scale-95"
                     x-transition:enter-end="opacity-100 transform scale-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100 transform scale-100"
                     x-transition:leave-end="opacity-0 transform scale-95"
                     class="space-y-3 mt-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">ID do Usuário</span>
                        <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">#{{ Auth::user()->id }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Membro desde</span>
                        <span class="text-sm">{{ Auth::user()->created_at->format('d/m/Y') }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Último login</span>
                        <span class="text-sm">{{ Auth::user()->updated_at->diffForHumans() }}</span>
                    </div>
                    
                    @if(Auth::user()->email_verified_at)
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email verificado</span>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                                Sim
                            </span>
                        </div>
                    @else
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email verificado</span>
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                Não
                            </span>
                        </div>
                    @endif
                </div>
            </div>
            
            <!-- Permissões e Roles -->
            <div class="gqa-card" x-data="{ showPermissions: false }">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Permissões e Acessos</h3>
                    <button @click="showPermissions = !showPermissions" 
                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg :class="showPermissions ? 'rotate-180' : ''" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Roles -->
                <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Funções</h4>
                    <div class="space-y-2">
                        @forelse(Auth::user()->getRoleNames() as $role)
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span class="text-sm text-gray-900 dark:text-white">{{ $role }}</span>
                            </div>
                        @empty
                            <p class="text-sm text-gray-500 dark:text-gray-400">Nenhuma função atribuída</p>
                        @endforelse
                    </div>
                </div>
                
                <!-- Permissões Principais -->
                <div x-show="showPermissions" 
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0">
                    <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Permissões Principais</h4>
                    <div class="space-y-2">
                        @php
                            $mainPermissions = [
                                'view diagnosticos' => 'Ver Diagnósticos',
                                'create diagnosticos' => 'Criar Diagnósticos',
                                'edit diagnosticos' => 'Editar Diagnósticos',
                                'view reports' => 'Ver Relatórios',
                                'manage users' => 'Gerenciar Usuários',
                                'manage system' => 'Administrar Sistema'
                            ];
                        @endphp
                        
                        @foreach($mainPermissions as $permission => $label)
                            <div class="flex items-center justify-between py-1">
                                <span class="text-sm text-gray-900 dark:text-white">{{ $label }}</span>
                                @can($permission)
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                @else
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                @endcan
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suas Estatísticas</h3>
                
                <div class="space-y-4" x-show="!loading">
                    <div class="gqa-stat-card primary">
                        <div class="gqa-stat-content">
                            <div class="gqa-stat-title">Diagnósticos Realizados</div>
                            <div class="gqa-stat-value" x-text="stats.diagnosticos"></div>
                            <div class="gqa-stat-desc">Este mês</div>
                        </div>
                        <div class="gqa-stat-icon primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                    
                    <div class="gqa-stat-card success">
                        <div class="gqa-stat-content">
                            <div class="gqa-stat-title">Taxa de Conformidade</div>
                            <div class="gqa-stat-value" x-text="stats.conformidades + '%'"></div>
                            <div class="gqa-stat-desc">Média geral</div>
                        </div>
                        <div class="gqa-stat-icon success">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div class="gqa-stat-card warning">
                        <div class="gqa-stat-content">
                            <div class="gqa-stat-title">Períodos Ativos</div>
                            <div class="gqa-stat-value" x-text="stats.periodos"></div>
                            <div class="gqa-stat-desc">Em andamento</div>
                        </div>
                        <div class="gqa-stat-icon warning">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div x-show="loading" class="flex items-center justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                
                <div class="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4">
                    <div class="text-center">
                        <p class="text-xs text-gray-500 dark:text-gray-400" x-text="'Última atividade: ' + stats.ultima_atividade">
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Links Úteis -->
            <div class="gqa-card">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Links Úteis</h3>
                
                <div class="space-y-3">
                    <a href="{{ route('dashboard') }}" 
                       class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                        <div class="gqa-stat-icon sm primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Voltar ao Dashboard
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                    
                    @can('view diagnosticos')
                    <a href="#" 
                       class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                        <div class="gqa-stat-icon sm info">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Meus Diagnósticos
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                    @endcan
                    
                    @can('view reports')
                    <a href="#" 
                       class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                        <div class="gqa-stat-icon sm success">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Relatórios
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                    @endcan
                    
                    <a href="#" 
                       class="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                        <div class="gqa-stat-icon sm warning">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Central de Ajuda
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-blue-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Segunda linha de cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Zona de Perigo -->
            <div class="gqa-card border-red-200 dark:border-red-800" x-data="{ showDangerZone: false }">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="gqa-stat-icon danger">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">Zona de Perigo</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Ações irreversíveis</p>
                    </div>
                    <button @click="showDangerZone = !showDangerZone" 
                            class="text-red-400 hover:text-red-600 dark:hover:text-red-300">
                        <svg :class="showDangerZone ? 'rotate-180' : ''" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </div>
                
                <div x-show="showDangerZone" 
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0">
                    <div class="gqa-alert danger mb-4">
                        <div class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h4 class="font-bold">Atenção!</h4>
                                <div class="text-sm">
                                    Uma vez que sua conta for deletada, todos os recursos e dados serão permanentemente excluídos.
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="gqa-btn danger outline w-full" 
                            @click="$dispatch('open-delete-modal')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Deletar Conta
                    </button>
                </div>
            </div>
            
            <!-- Estatísticas do Usuário -->
            <div class="gqa-card" x-data="userStats()" x-init="loadStats()">
    <div x-data="deleteModal()" 
         @open-delete-modal.window="openModal()"
         x-show="isOpen" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 z-50 overflow-y-auto"
         style="display: none;">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal()"></div>
            
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                 x-show="isOpen"
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                 x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                 x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                Confirmar Exclusão da Conta
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    Tem certeza que deseja deletar sua conta? Esta ação <strong>não pode ser desfeita</strong> 
                                    e todos os seus dados serão permanentemente removidos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <form method="post" 
                      action="{{ route('profile.destroy') }}" 
                      class="px-4 pb-4 sm:px-6 sm:pb-6"
                      @submit="isDeleting = true">
                    @csrf
                    @method('delete')
                    
                    <div class="mt-4">
                        <label for="delete_password" class="gqa-label">
                            Digite sua senha para confirmar:
                        </label>
                        <input type="password" 
                               id="delete_password"
                               name="password" 
                               class="gqa-input {{ $errors->userDeletion->has('password') ? 'error' : '' }}" 
                               placeholder="Sua senha atual" 
                               required
                               x-model="password"
                               x-ref="passwordInput">
                        @error('password', 'userDeletion')
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="mt-6 flex space-x-3 justify-end">
                        <button type="button" 
                                @click="closeModal()" 
                                class="gqa-btn ghost"
                                :disabled="isDeleting">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="gqa-btn danger"
                                :disabled="isDeleting || !password.length"
                                :class="{ 'opacity-50 cursor-not-allowed': isDeleting || !password.length }">
                            <svg x-show="!isDeleting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <svg x-show="isDeleting" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span x-text="isDeleting ? 'Deletando...' : 'Sim, Deletar Conta'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Form para reenvio de verificação de email -->
    @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
        <form id="send-verification" method="post" action="{{ route('verification.send') }}" style="display: none;">
            @csrf
        </form>
    @endif

    <script>
        // Profile Editor Component
        function profileEditor() {
            return {
                isSubmitting: false,
                form: {
                    name: '{{ old('name', $user->name) }}',
                    email: '{{ old('email', $user->email) }}'
                },
                validation: {
                    name: { isValid: true, message: '' },
                    email: { isValid: true, message: '' }
                },
                
                init() {
                    this.validateField('name', this.form.name);
                    this.validateField('email', this.form.email);
                },
                
                validateField(field, value) {
                    switch(field) {
                        case 'name':
                            this.validation.name.isValid = value.length >= 2;
                            this.validation.name.message = value.length >= 2 ? '' : 'Nome deve ter pelo menos 2 caracteres';
                            break;
                        case 'email':
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            this.validation.email.isValid = emailRegex.test(value);
                            this.validation.email.message = emailRegex.test(value) ? '' : 'Email inválido';
                            break;
                    }
                },
                
                get isFormValid() {
                    return this.validation.name.isValid && 
                           this.validation.email.isValid &&
                           this.form.name.length > 0 && 
                           this.form.email.length > 0;
                }
            }
        }

        // Password Form Component
        function passwordForm() {
            return {
                isSubmittingPassword: false,
                showCurrentPassword: false,
                showNewPassword: false,
                showConfirmPassword: false,
                passwordForm: {
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                },
                passwordStrength: {
                    score: 0,
                    label: '',
                    checks: {
                        length: false,
                        uppercase: false,
                        number: false,
                        special: false
                    }
                },
                passwordMatch: true,
                
                checkPasswordStrength(password) {
                    this.passwordStrength.checks.length = password.length >= 8;
                    this.passwordStrength.checks.uppercase = /[A-Z]/.test(password);
                    this.passwordStrength.checks.number = /\d/.test(password);
                    this.passwordStrength.checks.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                    
                    const score = Object.values(this.passwordStrength.checks).filter(Boolean).length;
                    this.passwordStrength.score = score;
                    
                    const labels = ['', 'Muito Fraca', 'Fraca', 'Boa', 'Forte'];
                    this.passwordStrength.label = labels[score] || '';
                    
                    this.checkPasswordMatch();
                },
                
                checkPasswordMatch() {
                    this.passwordMatch = this.passwordForm.password === this.passwordForm.password_confirmation || 
                                       this.passwordForm.password_confirmation.length === 0;
                },
                
                get isPasswordFormValid() {
                    return this.passwordForm.current_password.length > 0 &&
                           this.passwordStrength.score >= 3 &&
                           this.passwordMatch &&
                           this.passwordForm.password.length > 0 &&
                           this.passwordForm.password_confirmation.length > 0;
                }
            }
        }

        // User Stats Component
        function userStats() {
            return {
                loading: true,
                stats: {
                    diagnosticos: 0,
                    conformidades: 0,
                    periodos: 0,
                    ultima_atividade: ''
                },
                
                async loadStats() {
                    // Simulate loading delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Simulate stats data - replace with actual API call
                    this.stats = {
                        diagnosticos: Math.floor(Math.random() * 45) + 5,
                        conformidades: Math.floor(Math.random() * 20) + 80,
                        periodos: Math.floor(Math.random() * 6) + 2,
                        ultima_atividade: this.getRelativeTime(Date.now() - Math.random() * 48 * 60 * 60 * 1000)
                    };
                    
                    this.loading = false;
                },
                
                getRelativeTime(timestamp) {
                    const now = Date.now();
                    const diff = now - timestamp;
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    
                    if (hours < 1) return 'há poucos minutos';
                    if (hours === 1) return 'há 1 hora';
                    if (hours < 24) return `há ${hours} horas`;
                    
                    const days = Math.floor(hours / 24);
                    if (days === 1) return 'há 1 dia';
                    return `há ${days} dias`;
                }
            }
        }

        // Delete Modal Component
        function deleteModal() {
            return {
                isOpen: false,
                isDeleting: false,
                password: '',
                
                openModal() {
                    this.isOpen = true;
                    this.password = '';
                    this.$nextTick(() => {
                        if (this.$refs.passwordInput) {
                            this.$refs.passwordInput.focus();
                        }
                    });
                },
                
                closeModal() {
                    if (!this.isDeleting) {
                        this.isOpen = false;
                        this.password = '';
                    }
                }
            }
        }

        // Auto-hide alerts after delay
        document.addEventListener('DOMContentLoaded', function() {
            // Auto-focus first input with error
            const firstError = document.querySelector('.gqa-input.error');
            if (firstError) {
                firstError.focus();
            }
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                // Ctrl+S to save profile
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    const profileForm = document.querySelector('[x-ref="profileForm"]');
                    if (profileForm) {
                        profileForm.dispatchEvent(new Event('submit'));
                    }
                }
                
                // Escape to close modal
                if (e.key === 'Escape') {
                    Alpine.store('modal', { isOpen: false });
                }
            });
        });
    </script>
</x-app-layout>