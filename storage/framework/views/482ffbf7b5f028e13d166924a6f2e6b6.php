<?php if (isset($component)) { $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54 = $attributes; } ?>
<?php $component = App\View\Components\AppLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('app-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\AppLayout::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
     <?php $__env->slot('title', null, []); ?> Meu Perfil <?php $__env->endSlot(); ?>
    
    <?php
    $breadcrumbs = [
        ['title' => 'Meu Perfil']
    ];
    ?>
    
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
                
                <?php if(session('status') === 'profile-updated'): ?>
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
                <?php endif; ?>
                
                <form method="post" action="<?php echo e(route('profile.update')); ?>" class="space-y-6" @submit="isSubmitting = true" x-ref="profileForm">
                    <?php echo csrf_field(); ?>
                    <?php echo method_field('patch'); ?>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="gqa-label" for="name">Nome Completo</label>
                            <div class="relative">
                                <input type="text" 
                                       id="name" name="name" 
                                       value="<?php echo e(old('name', $user->name)); ?>" 
                                       class="gqa-input <?php echo e($errors->has('name') ? 'error' : ''); ?>" 
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
                            <?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400"><?php echo e($message); ?></p>
                            <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                        </div>
                        
                        <div>
                            <label class="gqa-label" for="email">Email</label>
                            <div class="relative">
                                <input type="email" 
                                       id="email" name="email" 
                                       value="<?php echo e(old('email', $user->email)); ?>" 
                                       class="gqa-input <?php echo e($errors->has('email') ? 'error' : ''); ?>" 
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
                            <?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400"><?php echo e($message); ?></p>
                            <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
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
                
                <?php if(session('status') === 'password-updated'): ?>
                    <div class="gqa-alert success mb-6" x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)">
                        <span>Senha alterada com sucesso!</span>
                    </div>
                <?php endif; ?>
                
                <form method="post" action="<?php echo e(route('password.update')); ?>" class="space-y-4" @submit="isSubmittingPassword = true">
                    <?php echo csrf_field(); ?>
                    <?php echo method_field('put'); ?>
                    
                    <div>
                        <label class="gqa-label" for="current_password">Senha Atual</label>
                        <input :type="showCurrentPassword ? 'text' : 'password'" 
                               id="current_password" name="current_password" 
                               class="gqa-input <?php echo e($errors->updatePassword->has('current_password') ? 'error' : ''); ?>" 
                               x-model="passwordForm.current_password">
                        <?php $__errorArgs = ['current_password', 'updatePassword'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400"><?php echo e($message); ?></p>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                    </div>
                    
                    <div>
                        <label class="gqa-label" for="password">Nova Senha</label>
                        <input :type="showNewPassword ? 'text' : 'password'" 
                               id="password" name="password" 
                               class="gqa-input <?php echo e($errors->updatePassword->has('password') ? 'error' : ''); ?>" 
                               x-model="passwordForm.password"
                               @input="checkPasswordStrength($event.target.value)">
                        <?php $__errorArgs = ['password', 'updatePassword'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400"><?php echo e($message); ?></p>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                    </div>
                    
                    <div>
                        <label class="gqa-label" for="password_confirmation">Confirmar Senha</label>
                        <input :type="showConfirmPassword ? 'text' : 'password'" 
                               id="password_confirmation" name="password_confirmation" 
                               class="gqa-input <?php echo e($errors->updatePassword->has('password_confirmation') ? 'error' : ''); ?>" 
                               x-model="passwordForm.password_confirmation"
                               @input="checkPasswordMatch()">
                        <?php $__errorArgs = ['password_confirmation', 'updatePassword'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400"><?php echo e($message); ?></p>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
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
                        <img src="https://ui-avatars.com/api/?name=<?php echo e(urlencode(Auth::user()->name)); ?>&background=random&size=96" 
                             alt="<?php echo e(Auth::user()->name); ?>" class="w-full h-full object-cover" />
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white"><?php echo e(Auth::user()->name); ?></h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400"><?php echo e(Auth::user()->email); ?></p>
                </div>
                
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">ID</span>
                        <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">#<?php echo e(Auth::user()->id); ?></span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Membro desde</span>
                        <span class="text-sm"><?php echo e(Auth::user()->created_at->format('d/m/Y')); ?></span>
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
                
                <form method="post" action="<?php echo e(route('profile.destroy')); ?>" class="px-4 pb-4 sm:px-6 sm:pb-6" @submit="isDeleting = true">
                    <?php echo csrf_field(); ?>
                    <?php echo method_field('delete'); ?>
                    
                    <div class="mt-4">
                        <label for="delete_password" class="gqa-label">Digite sua senha:</label>
                        <input type="password" id="delete_password" name="password" 
                               class="gqa-input <?php echo e($errors->userDeletion->has('password') ? 'error' : ''); ?>" 
                               required x-model="password" x-ref="passwordInput">
                        <?php $__errorArgs = ['password', 'userDeletion'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                            <p class="mt-1 text-sm text-red-600 dark:text-red-400"><?php echo e($message); ?></p>
                        <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
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
                form: { name: '<?php echo e(old('name', $user->name)); ?>', email: '<?php echo e(old('email', $user->email)); ?>' },
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
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $attributes = $__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__attributesOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54)): ?>
<?php $component = $__componentOriginal9ac128a9029c0e4701924bd2d73d7f54; ?>
<?php unset($__componentOriginal9ac128a9029c0e4701924bd2d73d7f54); ?>
<?php endif; ?>
<?php /**PATH C:\projects\qualidade\sistema-qualidade\resources\views/profile/edit.blade.php ENDPATH**/ ?>