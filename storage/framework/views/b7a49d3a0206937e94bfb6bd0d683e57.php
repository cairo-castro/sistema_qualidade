<?php if (isset($component)) { $__componentOriginal69dc84650370d1d4dc1b42d016d7226b = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal69dc84650370d1d4dc1b42d016d7226b = $attributes; } ?>
<?php $component = App\View\Components\GuestLayout::resolve([] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('guest-layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\GuestLayout::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
     <?php $__env->slot('title', null, []); ?> Login <?php $__env->endSlot(); ?>
    
    <!-- Header -->
    <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">Bem-vindo de volta!</h2>
        <p class="text-slate-600 dark:text-slate-400 mt-2 transition-colors">Entre com suas credenciais para continuar</p>
    </div>
    
    <!-- Session Status -->
    <?php if(session('status')): ?>
        <div class="gqa-alert info mb-6" data-auto-hide>
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium"><?php echo e(session('status')); ?></p>
                </div>
            </div>
        </div>
    <?php endif; ?>
    
    <!-- Login Form -->
    <form method="POST" action="<?php echo e(route('login')); ?>" class="space-y-6">
        <?php echo csrf_field(); ?>
        
        <!-- User Name -->
        <div>
            <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 transition-colors">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Nome de Usuário
            </label>
            <input type="text" 
                   name="name" 
                   value="<?php echo e(old('name')); ?>" 
                   class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 <?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> border-red-500 <?php else: ?> border-slate-300 dark:border-slate-600 <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?> bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400" 
                   placeholder="Digite seu nome de usuário"
                   required 
                   autofocus 
                   autocomplete="username">
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
        
        <!-- Password -->
        <div>
            <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 transition-colors">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Senha
            </label>
            <div class="relative" x-data="{ show: false }">
                <input :type="show ? 'text' : 'password'" 
                       name="password" 
                       class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 <?php $__errorArgs = ['password'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> border-red-500 <?php else: ?> border-slate-300 dark:border-slate-600 <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?> bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary-500 dark:focus:border-primary-400" 
                       placeholder="••••••••"
                       required 
                       autocomplete="current-password">
                <button type="button" 
                        @click="show = !show"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                    <svg x-show="!show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg x-show="show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                </button>
            </div>
            <?php $__errorArgs = ['password'];
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
        
        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
            <label class="flex items-center">
                <input type="checkbox" 
                       name="remember" 
                       class="rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors" 
                       <?php echo e(old('remember') ? 'checked' : ''); ?>>
                <span class="ml-2 text-sm text-slate-600 dark:text-slate-400 transition-colors">Lembrar de mim</span>
            </label>
            
            <?php if(Route::has('password.request')): ?>
                <a href="<?php echo e(route('password.request')); ?>" 
                   class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
                    Esqueceu sua senha?
                </a>
            <?php endif; ?>
        </div>
        
        <!-- Submit Button -->
        <button type="submit" class="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Entrar no Sistema
        </button>
    </form>
    
    <!-- Divider -->
    <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-300 dark:border-slate-600 transition-colors"></div>
        </div>
        <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">ou</span>
        </div>
    </div>
    
    <!-- Demo Accounts -->
    <div class="p-4 rounded-xl border transition-all duration-300 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
        <h3 class="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-center transition-colors">Contas de Demonstração</h3>
        <div class="space-y-2">
            <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-500 transition-colors">
                <div>
                    <span class="font-medium text-sm text-slate-900 dark:text-slate-100 transition-colors">Administrador</span>
                    <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">Admin</span>
                </div>
                <button class="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors" 
                        onclick="fillLogin('admin', 'admin123')">
                    Usar
                </button>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-500 transition-colors">
                <div>
                    <span class="font-medium text-sm text-slate-900 dark:text-slate-100 transition-colors">Gestor</span>
                    <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Gestor</span>
                </div>
                <button class="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors" 
                        onclick="fillLogin('gestor', 'gestor123')">
                    Usar
                </button>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-lg border border-slate-200 dark:border-slate-500 transition-colors">
                <div>
                    <span class="font-medium text-sm text-slate-900 dark:text-slate-100 transition-colors">Operador</span>
                    <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Operador</span>
                </div>
                <button class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors" 
                        onclick="fillLogin('operador', 'operador123')">
                    Usar
                </button>
            </div>
        </div>
        
        <div class="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 transition-colors">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-blue-400 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 transition-colors">Ambiente de Demonstração</h4>
                    <div class="text-sm text-blue-700 dark:text-blue-300 mt-1 transition-colors">
                        Use as contas acima para testar diferentes níveis de acesso. Após clicar em "Usar", clique no botão "Entrar no Sistema" para fazer login.
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Registration Link -->
    <?php if(Route::has('register')): ?>
        <div class="text-center mt-6">
            <p class="text-sm text-slate-600 dark:text-slate-400 transition-colors">
                Não tem uma conta? 
                <a href="<?php echo e(route('register')); ?>" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
                    Solicite acesso aqui
                </a>
            </p>
        </div>
    <?php endif; ?>
    
    <script>
        function fillLogin(name, password) {
            document.querySelector('input[name="name"]').value = name;
            document.querySelector('input[name="password"]').value = password;
            
            // Focus no botão de submit para indicar que pode clicar
            const submitBtn = document.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.focus();
                submitBtn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    submitBtn.style.transform = '';
                }, 200);
            }
        }
        
        // Auto-focus on name field
        document.addEventListener('DOMContentLoaded', function() {
            const nameInput = document.querySelector('input[name="name"]');
            if (nameInput && !nameInput.value) {
                nameInput.focus();
            }
        });
    </script>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal69dc84650370d1d4dc1b42d016d7226b)): ?>
<?php $attributes = $__attributesOriginal69dc84650370d1d4dc1b42d016d7226b; ?>
<?php unset($__attributesOriginal69dc84650370d1d4dc1b42d016d7226b); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal69dc84650370d1d4dc1b42d016d7226b)): ?>
<?php $component = $__componentOriginal69dc84650370d1d4dc1b42d016d7226b; ?>
<?php unset($__componentOriginal69dc84650370d1d4dc1b42d016d7226b); ?>
<?php endif; ?><?php /**PATH C:\projects\qualidade\sistema-qualidade\resources\views/auth/login.blade.php ENDPATH**/ ?>