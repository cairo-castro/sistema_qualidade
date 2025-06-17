<div class="flex items-center justify-between w-full">
    <!-- Left side: Menu button + Search -->
    <div class="flex items-center space-x-4">
        <!-- Sidebar toggle button -->
        <button @click="toggleSidebar()"
                class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle Sidebar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                :class="{ 'rotate-180': !sidebarCollapsed }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
        </button>

        <!-- Search bar (desktop) -->
        <div class="hidden md:block">
            <div class="gqa-search-container w-80">
                <svg class="gqa-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input type="search"
                       placeholder="Buscar diagnósticos, pacientes..."
                       class="gqa-search-input"
                       @keydown.enter="performSearch()"
                       @input.debounce.500ms="performSearch()"
                />
            </div>
        </div>

        <!-- Quick Stats Badge - IMPROVED DARK MODE -->
        <div class="hidden lg:flex items-center space-x-3">
            <div class="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-green-700 dark:text-green-400">Sistema Online</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
                <span x-text="formatNumber(stats.totalDiagnosticos)">0</span> diagnósticos
            </div>
        </div>
    </div>

    <!-- Right side: Actions + Notifications + User menu -->
    <div class="flex items-center space-x-3">
        <!-- Quick Actions (desktop only) -->
        <div class="hidden lg:flex items-center space-x-2">
            <button class="gqa-btn primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="hidden xl:inline">Novo</span>
            </button>

            <button class="gqa-btn secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
            </button>
        </div>

        <!-- Theme Controls -->
        <div class="flex items-center space-x-1">
            <!-- Animated Light/Dark Mode Toggle - Hidden when custom theme is active -->
            <div class="hs-theme-switch" 
                 data-hs-theme-switch
                 x-show="!window.hasCustomTheme"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95">
                <label class="relative inline-flex items-center cursor-pointer"
                       title="Alternar modo claro/escuro">
                    
                    <!-- Hidden checkbox for state management -->
                    <input type="checkbox" class="sr-only hs-theme-checkbox">
                    
                    <!-- Toggle background -->
                    <div class="relative w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300 ease-in-out">
                        
                        <!-- Toggle knob with icons -->
                        <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md 
                                    transition-all duration-300 ease-in-out transform flex items-center justify-center
                                    hs-dark-mode-active:translate-x-5 hs-dark-mode-active:bg-slate-800
                                    translate-x-0 bg-white z-10">
                            
                            <!-- Icon container for rotation effect -->
                            <div class="icon-container relative w-4 h-4">
                                <!-- Sun icon (visible in light mode) -->
                                <svg class="sun-icon absolute inset-0 w-4 h-4 text-yellow-500"
                                     fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                                </svg>
                                
                                <!-- Moon icon (visible in dark mode) -->
                                <svg class="moon-icon absolute inset-0 w-4 h-4 text-slate-200"
                                     fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </label>
            </div>

            <!-- Custom Theme Manager -->
            <div class="relative" x-data="themeManager" x-init="console.log('ThemeManager component initialized')">
                <button @click="toggle(); console.log('Theme button clicked, open:', open)"
                        class="gqa-btn ghost"
                        title="Personalizar cores do tema"
                        x-bind:class="{ 'bg-green-100 text-green-600': open }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-5m-5 8V9a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2z"></path>
                    </svg>
                    <span x-show="window.hasCustomTheme" class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                </button>

                <!-- Theme Manager Dropdown - Versão Completa -->
                <div x-show="open"
                     @click.outside="open = false"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 scale-95"
                     x-transition:enter-end="opacity-100 scale-100"
                     x-transition:leave="transition ease-in duration-150"
                     x-transition:leave-start="opacity-100 scale-100"
                     x-transition:leave-end="opacity-0 scale-95"
                     class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-gray-600 z-50"
                     style="display: none;">

                    <!-- Header -->
                    <div class="p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tema Personalizado</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Personalize as cores do sistema</p>
                            </div>
                            <button @click="open = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Status do Tema -->
                    <div class="p-4 border-b border-gray-200 dark:border-gray-600">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full"
                                     :class="window.hasCustomTheme ? 'bg-green-500' : 'bg-gray-400'"></div>
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <span x-text="window.hasCustomTheme ? 'Tema Personalizado Ativo' : 'Tema Padrão'"></span>
                                </span>
                            </div>
                            <button @click="resetTheme()"
                                    x-show="window.hasCustomTheme"
                                    :disabled="loading"
                                    class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <span x-show="!loading">Resetar</span>
                                <span x-show="loading" class="flex items-center">
                                    <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetando...
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Seletores de Cor -->
                    <div class="p-4 space-y-4 max-h-80 overflow-y-auto">
                        <!-- Navbar Color -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cor da Barra de Navegação
                            </label>
                            <div class="flex items-center space-x-3">
                                <input type="color"
                                       x-model="window.Hospital.themeManager.colors.navbar"
                                       @input="window.Hospital.themeManager.updateColor('navbar', $event.target.value)"
                                       class="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
                                <div class="flex-1">
                                    <input type="text"
                                           x-model="window.Hospital.themeManager.colors.navbar"
                                           @input="window.Hospital.themeManager.updateColor('navbar', $event.target.value)"
                                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                           placeholder="#ffffff">
                                </div>
                            </div>
                        </div>

                        <!-- Sidebar Color -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cor da Barra Lateral
                            </label>
                            <div class="flex items-center space-x-3">
                                <input type="color"
                                       x-model="window.Hospital.themeManager.colors.sidebar"
                                       @input="window.Hospital.themeManager.updateColor('sidebar', $event.target.value)"
                                       class="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
                                <div class="flex-1">
                                    <input type="text"
                                           x-model="window.Hospital.themeManager.colors.sidebar"
                                           @input="window.Hospital.themeManager.updateColor('sidebar', $event.target.value)"
                                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                           placeholder="#f8f9fa">
                                </div>
                            </div>
                        </div>

                        <!-- Background Color -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cor do Fundo
                            </label>
                            <div class="flex items-center space-x-3">
                                <input type="color"
                                       x-model="window.Hospital.themeManager.colors.background"
                                       @input="window.Hospital.themeManager.updateColor('background', $event.target.value)"
                                       class="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
                                <div class="flex-1">
                                    <input type="text"
                                           x-model="window.Hospital.themeManager.colors.background"
                                           @input="window.Hospital.themeManager.updateColor('background', $event.target.value)"
                                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                           placeholder="#ffffff">
                                </div>
                            </div>
                        </div>

                        <!-- Accent Color -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cor de Destaque
                            </label>
                            <div class="flex items-center space-x-3">
                                <input type="color"
                                       x-model="window.Hospital.themeManager.colors.accent"
                                       @input="window.Hospital.themeManager.updateColor('accent', $event.target.value)"
                                       class="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
                                <div class="flex-1">
                                    <input type="text"
                                           x-model="window.Hospital.themeManager.colors.accent"
                                           @input="window.Hospital.themeManager.updateColor('accent', $event.target.value)"
                                           class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                           placeholder="#3b82f6">
                                </div>
                            </div>
                        </div>

                        <!-- Presets de Cores -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Temas da Equipe Hospitalar
                            </label>
                            <div class="grid grid-cols-4 gap-2">
                                <!-- Linha 1 -->
                                <button @click="window.Hospital.themeManager.applyPreset('crimson')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200"
                                        title="Tema Daniela (Carmesim)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('coral')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 transition-all duration-200"
                                        title="Tema Milena (Coral)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('amethyst')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                                        title="Tema Jo (Ametista)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('azure')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                                        title="Tema Hugo (Azure)">
                                </button>

                                <!-- Linha 2 -->
                                <button @click="window.Hospital.themeManager.applyPreset('indigo')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-200"
                                        title="Tema Claudio (Índigo)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('sunset')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                                        title="Tema Danyara (Pôr do Sol)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('emerald')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all duration-200"
                                        title="Tema Andre (Esmeralda)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('lightpink')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 transition-all duration-200"
                                        title="Tema Carol (Rosa Claro)">
                                </button>

                                <!-- Linha 3 -->
                                <button @click="window.Hospital.themeManager.applyPreset('lightblue')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-sky-300 to-blue-300 hover:from-sky-400 hover:to-blue-400 transition-all duration-200"
                                        title="Tema Izabela (Azul Claro)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('lightred')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-red-300 to-red-400 hover:from-red-400 hover:to-red-500 transition-all duration-200"
                                        title="Tema Makerlya (Vermelho Claro)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('lightgreen')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-green-300 to-green-400 hover:from-green-400 hover:to-green-500 transition-all duration-200"
                                        title="Tema Thamirys (Verde Claro)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('beige')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 transition-all duration-200"
                                        title="Tema Carol Mendes (Bege)">
                                </button>

                                <!-- Linha 4 -->
                                <button @click="window.Hospital.themeManager.applyPreset('lilac')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-200"
                                        title="Tema Thayanne (Lilás)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('militarygreen')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 transition-all duration-200"
                                        title="Tema Mercia (Verde Militar)">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('turquoise')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 transition-all duration-200"
                                        title="Tema Turquesa">
                                </button>
                                <button @click="window.Hospital.themeManager.applyPreset('gold')"
                                        class="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200"
                                        title="Tema Dourado">
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Footer com Ações -->
                    <div class="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                        <div class="flex items-center justify-between space-x-3">
                            <button @click="resetTheme()"
                                    :disabled="loading"
                                    class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                                <template x-if="!loading">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                </template>
                                <template x-if="loading">
                                    <svg class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </template>
                                <span x-text="loading ? 'Resetando...' : 'Resetar'"></span>
                            </button>
                            <button @click="window.Hospital.themeManager.saveTheme()"
                                    class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Salvar Tema
                            </button>
                        </div>
                        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                            Alterações são aplicadas em tempo real
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notifications Dropdown -->
        <div class="relative" x-data="{ open: false, notifications: [], hasNew: false }" x-init="hasNew = notifications && notifications.length > 0">
            <button @click="open = !open"
                    class="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span x-show="hasNew"
                      x-text="notifications.length"
                      class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse"
                      style="display: none;">
                </span>
            </button>

            <!-- Notifications dropdown -->
            <div x-show="open"
                 @click.outside="open = false"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 class="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-gray-600 overflow-hidden"
                 style="display: none; z-index: 9999;">

                <div class="p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h3>
                        <button @click="open = false" class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="max-h-80 overflow-y-auto">
                    <div x-show="notifications.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
                        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        <p class="text-sm font-medium">Nenhuma notificação</p>
                        <p class="text-xs mt-1">Você está em dia!</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- User Menu Dropdown - DARK MODE FIXED -->
        <div class="relative" x-data="{ open: false }" x-init="console.log('UserMenu initialized:', $data)">
            <button @click="open = !open; console.log('User menu clicked, open:', open)"
                    class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    x-bind:class="{ 'bg-gray-100 dark:bg-gray-700': open }">
                <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-md">
                    <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=22c55e&color=fff&size=32"
                         alt="{{ Auth::user()->name }}"
                         class="w-full h-full object-cover" />
                </div>
                <div class="hidden md:block text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ Auth::user()->name }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-300">{{ Auth::user()->email }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400 dark:text-gray-300 transition-transform duration-200"
                     :class="{ 'rotate-180': open }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            <!-- User dropdown -->
            <div x-show="open"
                 @click.outside="open = false"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95"
                 x-transition:enter-end="opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                 class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 dark:ring-gray-600 overflow-hidden z-50"
                 style="display: none; z-index: 9999;">

                <!-- User Info Header -->
                <div class="p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-500 shadow-md">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=22c55e&color=fff&size=48"
                                 alt="{{ Auth::user()->name }}"
                                 class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ Auth::user()->name }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300 truncate">{{ Auth::user()->email }}</p>
                            @if(Auth::user()->getRoleNames()->isNotEmpty())
                                <div class="mt-1">
                                    <span class="gqa-badge primary">{{ Auth::user()->getRoleNames()->first() }}</span>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>

                <!-- Menu Items - FIXED DARK MODE -->
                <div class="py-2">
                    @php
                    try {
                        $profileEditUrl = route('profile.edit');
                    } catch (\Exception $e) {
                        $profileEditUrl = '/profile';
                    }
                    @endphp

                    <a href="{{ $profileEditUrl }}"
                       class="gqa-dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors">
                        <svg class="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Meu Perfil
                    </a>

                    <a href="#"
                       class="gqa-dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors">
                        <svg class="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Configurações
                    </a>

                    @can('view diagnosticos')
                    <a href="#"
                       class="gqa-dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors">
                        <svg class="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Meus Diagnósticos
                    </a>
                    @endcan

                    <a href="#"
                       class="gqa-dropdown-item flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full transition-colors">
                        <svg class="w-4 h-4 mr-3 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Ajuda
                    </a>

                    <div class="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                    <!-- Animated Theme Toggle - Hidden when custom theme is active -->
                    <div class="hs-theme-switch" 
                         data-hs-theme-switch
                         x-show="!window.hasCustomTheme"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95">
                        <label class="gqa-dropdown-item flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                            
                            <!-- Animated Toggle Switch -->
                            <div class="relative w-9 h-5 mr-3">
                                <!-- Hidden checkbox -->
                                <input type="checkbox" class="sr-only hs-theme-checkbox">
                                
                                <!-- Toggle background -->
                                <div class="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors duration-300 ease-in-out">
                                    
                                    <!-- Toggle knob with icons -->
                                    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md 
                                                transition-all duration-300 ease-in-out transform flex items-center justify-center
                                                hs-dark-mode-active:translate-x-4 hs-dark-mode-active:bg-slate-800
                                                translate-x-0 bg-white">
                                        
                                        <!-- Icon container for rotation effect -->
                                        <div class="icon-container relative w-3 h-3">
                                            <!-- Sun icon (light mode) -->
                                            <svg class="sun-icon absolute inset-0 w-3 h-3 text-yellow-500"
                                                 fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                                            </svg>
                                            
                                            <!-- Moon icon (dark mode) -->
                                            <svg class="moon-icon absolute inset-0 w-3 h-3 text-slate-200"
                                                 fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Dynamic text -->
                            <span class="hs-dark-mode-active:hidden">Ativar Modo Escuro</span>
                            <span class="hs-dark-mode-active:block hidden">Ativar Modo Claro</span>
                        </label>
                    </div>

                    <!-- Custom Theme Active Notice - Only visible when custom theme is active -->
                    <div x-show="window.hasCustomTheme"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95"
                         class="px-4 py-3 mx-2 mb-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span class="text-xs font-medium text-blue-700 dark:text-blue-400">Tema Personalizado Ativo</span>
                        </div>
                        <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">Modo claro/escuro desabilitado</p>
                    </div>

                    <!-- Divisor - Only visible when dark mode toggle is visible -->
                    <div class="border-t border-gray-200 dark:border-gray-600 my-2"
                         x-show="!window.hasCustomTheme"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0"
                         x-transition:enter-end="opacity-100"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100"
                         x-transition:leave-end="opacity-0"></div>

                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit"
                                class="gqa-dropdown-item flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <svg class="w-4 h-4 mr-3 text-red-500 dark:text-red-400"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            Sair do Sistema
                        </button>
                    </form>
                </div>

                <!-- Footer with system info -->
                <div class="p-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Sessão: {{ substr(session()->getId(), 0, 8) }}...</span>
                        <span>{{ now()->format('H:i') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function performSearch() {
        const searchInput = event.target;
        const search = searchInput.value.trim();

        if (search.length >= 2) {
            console.log('Buscando:', search);
            if (window.Hospital?.utils?.showToast) {
                window.Hospital.utils.showToast(`Buscando por: "${search}"`, 'info', 2000);
            }
        }
    }

    // Funções para notificações
    window.markAsRead = function(notificationId) {
        console.log('Marcando notificação como lida:', notificationId);
        if (window.Hospital?.utils?.showToast) {
            window.Hospital.utils.showToast('Notificação marcada como lida', 'success', 2000);
        }
    };

    window.markAllAsRead = function() {
        console.log('Marcando todas as notificações como lidas');
        if (window.Hospital?.utils?.showToast) {
            window.Hospital.utils.showToast('Todas as notificações foram marcadas como lidas', 'success');
        }
    };

    // Atalhos de teclado
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            console.log('Atalho: Novo diagnóstico');
            if (window.Hospital?.utils?.showToast) {
                window.Hospital.utils.showToast('Abrindo novo diagnóstico...', 'info');
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            console.log('Atalho: Relatórios');
            if (window.Hospital?.utils?.showToast) {
                window.Hospital.utils.showToast('Abrindo relatórios...', 'info');
            }
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }

        if (e.key === 'Escape') {
            // Fechar todos os dropdowns abertos
            document.querySelectorAll('[x-data]').forEach(el => {
                if (el.__x && el.__x.$data.open) {
                    el.__x.$data.open = false;
                }
            });
        }
    });

    // Alpine.js component for theme manager
    document.addEventListener('alpine:init', () => {
        Alpine.data('themeManager', () => ({
            open: false,
            loading: false,
            
            toggle() {
                this.open = !this.open;
            },
            
            async resetTheme() {
                console.log('🔄 Alpine resetTheme called');
                
                if (!window.Hospital?.themeManager) {
                    console.error('❌ Hospital.themeManager not available');
                    if (window.Hospital?.utils?.showToast) {
                        window.Hospital.utils.showToast('Erro: Sistema de temas não disponível', 'error');
                    }
                    return;
                }
                
                this.loading = true;
                try {
                    console.log('🔄 Calling resetThemeWithoutState...');
                    const result = await window.Hospital.themeManager.resetThemeWithoutState();
                    console.log('🔄 Reset result:', result);
                    
                    if (result === true) {
                        console.log('✅ Reset completed successfully');
                        // Success toast is already shown by themeManager.resetThemeWithoutState()
                    } else if (result === false) {
                        console.error('❌ Reset returned false');
                        // Error toast is already shown by themeManager.resetThemeWithoutState()
                    }
                } catch (error) {
                    console.error('❌ Error in Alpine resetTheme:', error);
                    if (window.Hospital?.utils?.showToast) {
                        window.Hospital.utils.showToast('Erro ao resetar tema', 'error');
                    }
                } finally {
                    this.loading = false;
                }
            }
        }));
    });
</script>

