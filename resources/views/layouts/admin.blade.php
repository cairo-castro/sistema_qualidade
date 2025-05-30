<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ $title ?? 'Dashboard' }} - {{ config('app.name', 'Sistema GQA') }}</title>
    
    <!-- Preload important fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- Additional styles for specific pages -->
    @stack('styles')
</head>

<body class="hospital-layout" x-data="hospitalDashboard">
    <!-- Loading overlay global -->
    <div x-show="loading" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200" 
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
         style="display: none;">
        <div class="bg-white rounded-lg p-6 shadow-xl">
            <div class="flex items-center space-x-3">
                <div class="gqa-loading lg hospital"></div>
                <span class="text-gray-700">Carregando...</span>
            </div>
        </div>
    </div>

    <!-- Main Container -->
    <div class="hospital-layout">
        <!-- Sidebar -->
        @include('layouts.partials.sidebar')
        
        <!-- Main Content -->
        <main class="hospital-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
            <!-- Navbar -->
            <nav class="hospital-navbar">
                @include('layouts.partials.navbar')
            </nav>
            
            <!-- Page Content -->
            <div class="hospital-content">
                <!-- Breadcrumb -->
                @if(isset($breadcrumbs) || isset($title))
                <nav class="flex mb-6" aria-label="Breadcrumb">
                    <ol class="inline-flex items-center space-x-1 md:space-x-3">
                        <li class="inline-flex items-center">
                            <a href="{{ route('dashboard') }}" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                Dashboard
                            </a>
                        </li>
                        @if(isset($breadcrumbs))
                            @foreach($breadcrumbs as $breadcrumb)
                                <li>
                                    <div class="flex items-center">
                                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        @if(isset($breadcrumb['url']))
                                            <a href="{{ $breadcrumb['url'] }}" class="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2 transition-colors">
                                                {{ $breadcrumb['title'] }}
                                            </a>
                                        @else
                                            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ $breadcrumb['title'] }}</span>
                                        @endif
                                    </div>
                                </li>
                            @endforeach
                        @elseif(isset($title) && $title !== 'Dashboard')
                            <li>
                                <div class="flex items-center">
                                    <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ $title }}</span>
                                </div>
                            </li>
                        @endif
                    </ol>
                </nav>
                @endif
                
                <!-- Page Header -->
                @if(isset($title))
                <div class="mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">{{ $title }}</h1>
                            @if(isset($description))
                                <p class="text-gray-600 mt-2">{{ $description }}</p>
                            @endif
                        </div>
                        
                        @if(isset($headerActions))
                            <div class="flex items-center space-x-4">
                                {{ $headerActions }}
                            </div>
                        @endif
                    </div>
                </div>
                @endif
                
                <!-- Flash Messages -->
                @if(session('success'))
                    <div class="gqa-alert success mb-6 hospital-fade-in-up" data-auto-hide>
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h4 class="text-sm font-medium text-green-800">Sucesso!</h4>
                                <p class="text-sm text-green-700 mt-1">{{ session('success') }}</p>
                            </div>
                            <div class="ml-auto pl-3">
                                <button class="inline-flex text-green-400 hover:text-green-600" onclick="this.closest('.gqa-alert').remove()">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
                
                @if(session('error'))
                    <div class="gqa-alert danger mb-6 hospital-fade-in-up" data-auto-hide>
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h4 class="text-sm font-medium text-red-800">Erro!</h4>
                                <p class="text-sm text-red-700 mt-1">{{ session('error') }}</p>
                            </div>
                            <div class="ml-auto pl-3">
                                <button class="inline-flex text-red-400 hover:text-red-600" onclick="this.closest('.gqa-alert').remove()">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
                
                @if(session('warning'))
                    <div class="gqa-alert warning mb-6 hospital-fade-in-up" data-auto-hide>
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h4 class="text-sm font-medium text-yellow-800">Atenção!</h4>
                                <p class="text-sm text-yellow-700 mt-1">{{ session('warning') }}</p>
                            </div>
                            <div class="ml-auto pl-3">
                                <button class="inline-flex text-yellow-400 hover:text-yellow-600" onclick="this.closest('.gqa-alert').remove()">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
                
                @if(session('info'))
                    <div class="gqa-alert info mb-6 hospital-fade-in-up" data-auto-hide>
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h4 class="text-sm font-medium text-blue-800">Informação</h4>
                                <p class="text-sm text-blue-700 mt-1">{{ session('info') }}</p>
                            </div>
                            <div class="ml-auto pl-3">
                                <button class="inline-flex text-blue-400 hover:text-blue-600" onclick="this.closest('.gqa-alert').remove()">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
                
                <!-- Main Content -->
                <div class="hospital-fade-in-up">
                    @yield('content')
                </div>
            </div>
        </main>
    </div>
    
    <!-- Toast container -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2"></div>
    
    <!-- Scripts específicos da página -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    @stack('scripts')
    
    <!-- Script de inicialização -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar sistema
            console.log('🏥 Sistema GQA inicializado');
            
            // Configurar tooltips para elementos colapsados da sidebar
            const sidebar = document.querySelector('.hospital-sidebar');
            const navItems = sidebar?.querySelectorAll('.hospital-nav-item');
            
            if (navItems) {
                navItems.forEach(item => {
                    const textElement = item.querySelector('.hospital-nav-text');
                    if (textElement) {
                        const text = textElement.textContent.trim();
                        item.setAttribute('title', text);
                        
                        // Adicionar tooltip personalizado quando sidebar está colapsada
                        item.addEventListener('mouseenter', function(e) {
                            if (sidebar.classList.contains('collapsed')) {
                                const tooltip = document.createElement('div');
                                tooltip.className = 'fixed bg-gray-900 text-white px-2 py-1 rounded text-xs z-50 pointer-events-none';
                                tooltip.textContent = text;
                                tooltip.style.left = (e.target.getBoundingClientRect().right + 10) + 'px';
                                tooltip.style.top = e.target.getBoundingClientRect().top + 'px';
                                tooltip.id = 'sidebar-tooltip';
                                document.body.appendChild(tooltip);
                            }
                        });
                        
                        item.addEventListener('mouseleave', function() {
                            const tooltip = document.getElementById('sidebar-tooltip');
                            if (tooltip) {
                                tooltip.remove();
                            }
                        });
                    }
                });
            }
            
            // Auto-hide alerts após 5 segundos
            setTimeout(() => {
                const alerts = document.querySelectorAll('[data-auto-hide]');
                alerts.forEach(alert => {
                    alert.style.transition = 'all 0.5s ease';
                    alert.style.opacity = '0';
                    alert.style.transform = 'translateY(-20px)';
                    setTimeout(() => alert.remove(), 500);
                });
            }, 5000);
            
            // Tema automático baseado na hora
            const currentHour = new Date().getHours();
            if (currentHour >= 19 || currentHour <= 6) {
                // Entre 19h e 6h, sugerir tema escuro
                const prefersDark = localStorage.getItem('hospital-theme') === 'dark';
                if (!localStorage.getItem('hospital-theme') && !prefersDark) {
                    // Mostrar notificação sobre tema escuro
                    setTimeout(() => {
                        if (window.Hospital && window.Hospital.utils) {
                            window.Hospital.utils.showToast('Modo escuro disponível para o período noturno', 'info', 6000);
                        }
                    }, 2000);
                }
            }
        });
        
        // Função global para alternar tema
        window.toggleHospitalTheme = function() {
            if (window.hospitalUtils) {
                window.hospitalUtils.toggleTheme();
            }
        };
        
        // Atalhos de teclado
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + B para toggle da sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                if (window.Hospital && window.Hospital.sidebar) {
                    window.Hospital.sidebar.toggle();
                }
            }
            
            // Ctrl/Cmd + K para busca (se existir)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar"], input[placeholder*="Buscar"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    </script>
</body>
</html>