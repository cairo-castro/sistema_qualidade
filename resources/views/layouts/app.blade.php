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
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/js/dashboard-components.js'])

    <!-- User Theme Settings Injection -->
    @php
        $userTheme = auth()->user()->getThemeSettings();
        $hasCustomTheme = auth()->user()->hasCustomTheme();
    @endphp
     @if($hasCustomTheme)
    <style id="user-theme-styles">
        :root {
            @if($userTheme['navbar_color'])
                --custom-navbar-bg: {{ $userTheme['navbar_color'] }};
                --custom-navbar-text: {{ \App\Helpers\ThemeHelper::getContrastingTextColor($userTheme['navbar_color']) }};
            @endif
            @if($userTheme['sidebar_color'])
                --custom-sidebar-bg: {{ $userTheme['sidebar_color'] }};
                --custom-sidebar-text: {{ \App\Helpers\ThemeHelper::getContrastingTextColor($userTheme['sidebar_color']) }};
            @endif
            @if($userTheme['background_color'])
                --custom-background: {{ $userTheme['background_color'] }};
                --custom-background-text: {{ \App\Helpers\ThemeHelper::getContrastingTextColor($userTheme['background_color']) }};
            @endif
        }

        .hospital-navbar {
            @if($userTheme['navbar_color'])
                background-color: var(--custom-navbar-bg) !important;
                color: var(--custom-navbar-text) !important;
            @endif
        }

        /* Apply navbar colors to most elements, but preserve dropdown styling */
        .hospital-navbar > *,
        .hospital-navbar button,
        .hospital-navbar a,
        .hospital-navbar span,
        .hospital-navbar div,
        .hospital-navbar input,
        .hospital-navbar svg {
            @if($userTheme['navbar_color'])
                color: var(--custom-navbar-text) !important;
                stroke: var(--custom-navbar-text) !important;
                fill: var(--custom-navbar-text) !important;
            @endif
        }

        /* Preserve dropdown and overlay styling - reset to default */
        .hospital-navbar [class*="dropdown"],
        .hospital-navbar [class*="dropdown"] *,
        .hospital-navbar .absolute,
        .hospital-navbar .absolute *,
        .hospital-navbar [x-show],
        .hospital-navbar [x-show] *,
        .hospital-navbar .shadow-xl,
        .hospital-navbar .shadow-xl *,
        .hospital-navbar [class*="bg-white"],
        .hospital-navbar [class*="bg-white"] *,
        .hospital-navbar [class*="bg-gray"],
        .hospital-navbar [class*="bg-gray"] *,
        .hospital-navbar [class*="text-gray"],
        .hospital-navbar [class*="text-gray"] *,
        .hospital-navbar [class*="border-gray"],
        .hospital-navbar [class*="border-gray"] * {
            color: revert !important;
            background-color: revert !important;
            border-color: revert !important;
            stroke: revert !important;
            fill: revert !important;
        }

        .hospital-sidebar {
            @if($userTheme['sidebar_color'])
                background-color: var(--custom-sidebar-bg) !important;
                color: var(--custom-sidebar-text) !important;
            @endif
        }

        .hospital-sidebar *,
        .hospital-sidebar a,
        .hospital-sidebar span,
        .hospital-sidebar div,
        .hospital-sidebar h1,
        .hospital-sidebar h2,
        .hospital-sidebar h3,
        .hospital-sidebar h4,
        .hospital-sidebar h5,
        .hospital-sidebar h6,
        .hospital-sidebar .hospital-nav-item,
        .hospital-sidebar svg,
        .hospital-sidebar i {
            @if($userTheme['sidebar_color'])
                color: var(--custom-sidebar-text) !important;
                stroke: var(--custom-sidebar-text) !important;
                fill: var(--custom-sidebar-text) !important;
            @endif
        }

        .hospital-content {
            @if($userTheme['background_color'])
                background-color: var(--custom-background) !important;
                color: var(--custom-background-text) !important;
            @endif
        }

        /* Apply background theme to main content areas */
        .hospital-content *:not(.hospital-card):not(.card):not(.bg-white):not([class*="card"]),
        body {
            @if($userTheme['background_color'])
                background-color: var(--custom-background) !important;
                color: var(--custom-background-text) !important;
            @endif
        }

        /* Ensure text elements inherit the background text color */
        .hospital-content p,
        .hospital-content span:not(.hospital-card *):not(.card *),
        .hospital-content div:not(.hospital-card):not(.card):not(.bg-white),
        .hospital-content h1,
        .hospital-content h2,
        .hospital-content h3,
        .hospital-content h4,
        .hospital-content h5,
        .hospital-content h6,
        .hospital-content label,
        .hospital-content a:not(.hospital-card *):not(.card *) {
            @if($userTheme['background_color'])
                color: var(--custom-background-text) !important;
            @endif
        }

        /* Enhanced contrast for interactive elements - FIXED NAVBAR BUTTONS */
        .hospital-navbar button:not(.gqa-dropdown *):not(.gqa-dropdown-item):not([x-show] *):not([x-data] *),
        .hospital-navbar .gqa-btn:not(.gqa-dropdown *):not(.gqa-dropdown-item):not([x-show] *):not([x-data] *) {
            @if($userTheme['navbar_color'])
                color: var(--custom-navbar-text) !important;
                border-color: var(--custom-navbar-text) !important;
                stroke: var(--custom-navbar-text) !important;
                fill: var(--custom-navbar-text) !important;
            @endif
        }

        /* Fix specific navbar button issues */
        .hospital-navbar .gqa-btn.ghost:not(.gqa-dropdown *):not(.gqa-dropdown-item):not([x-show] *):not([x-data] *) {
            @if($userTheme['navbar_color'])
                background-color: transparent !important;
                color: var(--custom-navbar-text) !important;
                border-color: var(--custom-navbar-text) !important;
            @endif
        }

        .hospital-navbar button:hover,
        .hospital-navbar .gqa-btn:hover {
            @if($userTheme['navbar_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['navbar_color']);
                    $hoverBg = $isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                @endphp
                background-color: {{ $hoverBg }} !important;
                color: var(--custom-navbar-text) !important;
            @endif
        }

        /* Reset hover for dropdown elements */
        .hospital-navbar [class*="dropdown"] button:hover,
        .hospital-navbar [class*="dropdown"] .gqa-btn:hover,
        .hospital-navbar .absolute button:hover,
        .hospital-navbar .absolute .gqa-btn:hover,
        .hospital-navbar [x-show] button:hover,
        .hospital-navbar [x-show] .gqa-btn:hover {
            background-color: revert !important;
            color: revert !important;
        }

        .hospital-sidebar .hospital-nav-item {
            @if($userTheme['sidebar_color'])
                color: var(--custom-sidebar-text) !important;
            @endif
        }

        .hospital-sidebar .hospital-nav-item:hover {
            @if($userTheme['sidebar_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['sidebar_color']);
                    $hoverBg = $isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                @endphp
                background-color: {{ $hoverBg }} !important;
            @endif
        }

        /* Ensure cards maintain good contrast and adapt to dark backgrounds */
        .hospital-content .hospital-card,
        .hospital-content .card,
        .hospital-content .bg-white,
        .hospital-content [class*="card"] {
            @if($userTheme['background_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['background_color']);
                    $cardBg = $isDark ? '#2d3748' : 'rgba(255,255,255,0.95)';
                    $cardText = $isDark ? '#f7fafc' : '#2d3748';
                    $cardBorder = $isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                    $cardShadow = $isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)';
                @endphp
                background-color: {{ $cardBg }} !important;
                color: {{ $cardText }} !important;
                border: 1px solid {{ $cardBorder }} !important;
                box-shadow: 0 4px 6px -1px {{ $cardShadow }}, 0 2px 4px -1px rgba(0,0,0,0.06) !important;
            @endif
        }

        /* Ensure text within cards uses proper contrast */
        .hospital-content .hospital-card *,
        .hospital-content .card *,
        .hospital-content .bg-white *,
        .hospital-content [class*="card"] * {
            @if($userTheme['background_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['background_color']);
                    $cardText = $isDark ? '#f7fafc' : '#2d3748';
                @endphp
                color: {{ $cardText }} !important;
            @endif
        }

        /* Enhanced badge styling with proper contrast for both navbar and global badges */
        .hospital-navbar .bg-green-50,
        .hospital-navbar .dark\\:bg-green-900\\/20,
        .hospital-navbar [class*="bg-"][class*="50"],
        .hospital-navbar [class*="bg-"][class*="100"],
        .hospital-navbar .badge,
        .hospital-navbar [class*="badge"] {
            @if($userTheme['navbar_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['navbar_color']);
                    $badgeBg = $isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
                    $badgeText = $isDark ? '#ffffff' : '#1f2937';
                @endphp
                background-color: {{ $badgeBg }} !important;
                color: {{ $badgeText }} !important;
                border-color: {{ $badgeText }} !important;
            @endif
        }

        /* Badge text elements and indicators */
        .hospital-navbar .bg-green-50 *,
        .hospital-navbar .dark\\:bg-green-900\\/20 *,
        .hospital-navbar [class*="bg-"][class*="50"] *,
        .hospital-navbar [class*="bg-"][class*="100"] *,
        .hospital-navbar .badge *,
        .hospital-navbar [class*="badge"] * {
            @if($userTheme['navbar_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['navbar_color']);
                    $badgeText = $isDark ? '#ffffff' : '#1f2937';
                @endphp
                color: {{ $badgeText }} !important;
            @endif
        }

        /* Special handling for indicator dots in badges */
        .hospital-navbar .w-2.h-2.bg-green-500,
        .hospital-navbar .animate-pulse.bg-green-500 {
            @if($userTheme['navbar_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['navbar_color']);
                    $indicatorColor = $isDark ? '#4ade80' : '#22c55e';
                @endphp
                background-color: {{ $indicatorColor }} !important;
            @endif
        }

        /* Global badges styling for background contrast */
        .bg-green-50:not(.hospital-navbar *):not(.hospital-sidebar *),
        .dark\\:bg-green-900\\/20:not(.hospital-navbar *):not(.hospital-sidebar *),
        [class*="bg-"][class*="50"]:not(.hospital-navbar *):not(.hospital-sidebar *),
        [class*="bg-"][class*="100"]:not(.hospital-navbar *):not(.hospital-sidebar *),
        .badge:not(.hospital-navbar *):not(.hospital-sidebar *),
        [class*="badge"]:not(.hospital-navbar *):not(.hospital-sidebar *) {
            @if($userTheme['background_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['background_color']);
                    $badgeBg = $isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(249, 250, 251, 0.9)';
                    $badgeText = $isDark ? '#f3f4f6' : '#1f2937';
                    $badgeBorder = $isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
                @endphp
                background-color: {{ $badgeBg }} !important;
                color: {{ $badgeText }} !important;
                border-color: {{ $badgeBorder }} !important;
            @endif
        }

        /* Global badges text elements */
        .bg-green-50:not(.hospital-navbar *):not(.hospital-sidebar *) *,
        .dark\\:bg-green-900\\/20:not(.hospital-navbar *):not(.hospital-sidebar *) *,
        [class*="bg-"][class*="50"]:not(.hospital-navbar *):not(.hospital-sidebar *) *,
        [class*="bg-"][class*="100"]:not(.hospital-navbar *):not(.hospital-sidebar *) *,
        .badge:not(.hospital-navbar *):not(.hospital-sidebar *) *,
        [class*="badge"]:not(.hospital-navbar *):not(.hospital-sidebar *) * {
            @if($userTheme['background_color'])
                @php
                    $isDark = \App\Helpers\ThemeHelper::isDarkColor($userTheme['background_color']);
                    $badgeText = $isDark ? '#f3f4f6' : '#1f2937';
                @endphp
                color: {{ $badgeText }} !important;
            @endif
        }
    </style>
    @endif

    <script>
        window.userTheme = @json($userTheme);
        window.hasCustomTheme = @json($hasCustomTheme);
    </script>

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

        <!-- Mobile Sidebar Overlay -->
        <div class="mobile-sidebar-overlay" 
             @click="sidebarOpen = false; $el.classList.remove('active'); document.querySelector('.hospital-sidebar').classList.remove('mobile-open'); document.body.style.overflow = ''"
             x-show="sidebarOpen && window.innerWidth < 1024"></div>

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
                            <a href="{{ route('dashboard') }}" class="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
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
                                        <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                        @if(isset($breadcrumb['url']))
                                            <a href="{{ $breadcrumb['url'] }}" class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 md:ml-2 transition-colors">
                                                {{ $breadcrumb['title'] }}
                                            </a>
                                        @else
                                            <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">{{ $breadcrumb['title'] }}</span>
                                        @endif
                                    </div>
                                </li>
                            @endforeach
                        @elseif(isset($title) && $title !== 'Dashboard')
                            <li>
                                <div class="flex items-center">
                                    <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">{{ $title }}</span>
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
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $title }}</h1>
                            @if(isset($description))
                                <p class="text-gray-600 dark:text-gray-300 mt-2">{{ $description }}</p>
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
                    {{ $slot }}
                </div>
            </div>
        </main>
    </div>

    <!-- Toast container -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2"></div>

    <!-- Scripts específicos da página -->
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
