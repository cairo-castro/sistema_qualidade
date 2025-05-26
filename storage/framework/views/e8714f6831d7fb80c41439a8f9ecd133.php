<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" x-data="{ 
    darkMode: localStorage.getItem('darkMode') === 'true' || false,
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        document.documentElement.classList.toggle('dark', this.darkMode);
    },
    init() {
        document.documentElement.classList.toggle('dark', this.darkMode);
    }
}" x-init="init()" :class="{ 'dark': darkMode }">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    
    <title><?php echo e($title ?? 'Login'); ?> - <?php echo e(config('app.name', 'Sistema GQA')); ?></title>
    
    <!-- Preload important fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Vite Assets -->
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>

<body class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-50 dark:opacity-30 transition-all duration-500 -z-10"></div>
    
    <!-- Dark Mode Toggle -->
    <div class="absolute top-4 right-4 z-10">
        <button @click="toggleDarkMode()" 
                class="p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <!-- Sun Icon (Show in Dark Mode) -->
            <svg x-show="darkMode" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 scale-75" x-transition:enter-end="opacity-100 scale-100" class="w-5 h-5 text-yellow-500 transform transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <!-- Moon Icon (Show in Light Mode) -->
            <svg x-show="!darkMode" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 scale-75" x-transition:enter-end="opacity-100 scale-100" class="w-5 h-5 text-slate-600 transform transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
        </button>
    </div>
    
    <div class="relative min-h-screen flex items-center justify-center p-4">
        <!-- Main Container -->
        <div class="w-full max-w-md">
            <!-- Logo/Header -->
            <div class="text-center mb-8">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-2xl flex items-center justify-center shadow-xl dark:shadow-2xl">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors"><?php echo e(config('sistema.name', 'Sistema GQA')); ?></h1>
                <p class="text-slate-600 dark:text-slate-400 transition-colors">Gestão da Qualidade Assistencial</p>
            </div>
            
            <!-- Auth Card -->
            <div class="overflow-hidden rounded-xl border shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <div class="p-8 bg-white dark:bg-slate-800">
                    <?php echo e($slot); ?>

                </div>
                
                <!-- Footer -->
                <div class="px-8 py-4 border-t transition-colors bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                    <div class="flex items-center justify-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>© <?php echo e(date('Y')); ?> <?php echo e(config('sistema.company', 'EMSERH')); ?></span>
                        <span>•</span>
                        <a href="#" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Suporte</a>
                        <span>•</span>
                        <a href="#" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacidade</a>
                    </div>
                </div>
            </div>
            
            <!-- Version Info -->
            <div class="text-center mt-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                <p>Versão <?php echo e(config('sistema.version', '1.0.0')); ?> • Laravel <?php echo e(app()->version()); ?></p>
                <?php if(config('app.env') !== 'production'): ?>
                    <p class="mt-1">
                        <span class="gqa-badge warning"><?php echo e(strtoupper(config('app.env'))); ?></span>
                    </p>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <!-- Loading Overlay -->
    <div id="gqa-loading-overlay" class="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 transition-colors" style="display: none;">
        <div class="rounded-xl border shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <div class="flex items-center space-x-3 p-6">
                <div class="gqa-loading lg"></div>
                <span class="text-slate-700 dark:text-slate-300 transition-colors">Autenticando...</span>
            </div>
        </div>
    </div>
    
    <script>
        // Show loading overlay on form submit
        document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            const overlay = document.getElementById('gqa-loading-overlay');
            
            forms.forEach(form => {
                form.addEventListener('submit', function() {
                    if (overlay) {
                        overlay.style.display = 'flex';
                    }
                });
            });
            
            // Auto-hide alerts after 5 seconds
            const alerts = document.querySelectorAll('.gqa-alert[data-auto-hide]');
            alerts.forEach(alert => {
                setTimeout(() => {
                    alert.style.opacity = '0';
                    setTimeout(() => alert.remove(), 300);
                }, 5000);
            });
        });
    </script>
</body>
</html><?php /**PATH C:\projects\qualidade\sistema-qualidade\resources\views/layouts/guest.blade.php ENDPATH**/ ?>