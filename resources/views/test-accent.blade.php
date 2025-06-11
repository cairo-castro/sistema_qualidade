<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Qualidade - Teste de Accent Colors</title>
    <link href="{{ asset('build/assets/app.css') }}" rel="stylesheet">
    <script src="{{ asset('build/assets/app.js') }}" defer></script>
    <script src="{{ asset('build/assets/vendor-alpine.js') }}" defer></script>
</head>
<body class="hospital-layout" x-data="hospitalTheme()" :class="{ 'dark': isDarkMode }">
    <!-- Navbar -->
    <nav class="hospital-navbar">
        <div class="flex items-center justify-between w-full">
            <!-- Logo -->
            <div class="flex items-center space-x-4">
                <h1 class="text-xl font-bold">🏥 Sistema de Qualidade</h1>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
                <!-- Botão que deveria mudar com accent -->
                <button class="gqa-btn primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Novo Item
                </button>

                <!-- Dropdown de temas -->
                <div x-data="{ open: false }" class="relative">
                    <button @click="open = !open"
                            class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9m12 4H9m12 4H9m12 4H9"></path>
                        </svg>
                    </button>

                    <!-- Dropdown menu -->
                    <div x-show="open"
                         @click.away="open = false"
                         x-transition:enter="transition ease-out duration-100"
                         x-transition:enter-start="transform opacity-0 scale-95"
                         x-transition:enter-end="transform opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-75"
                         x-transition:leave-start="transform opacity-100 scale-100"
                         x-transition:leave-end="transform opacity-0 scale-95"
                         class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-3">Configurar Tema</h3>

                            <!-- Accent Color -->
                            <div class="space-y-2 mb-4">
                                <label class="text-sm font-medium text-gray-700">Cor de Destaque (Accent)</label>
                                <div class="flex items-center space-x-3">
                                    <input type="color"
                                           x-model="colors.accent"
                                           @input="updateAccentColor($event.target.value)"
                                           class="w-10 h-10 border border-gray-300 rounded cursor-pointer">
                                    <input type="text"
                                           x-model="colors.accent"
                                           @input="updateAccentColor($event.target.value)"
                                           class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md"
                                           placeholder="#3b82f6">
                                </div>
                            </div>

                            <!-- Presets -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700">Temas Pré-definidos</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <button @click="applyAccentPreset('#3b82f6')" class="w-full h-8 rounded bg-blue-500 hover:bg-blue-600" title="Azul"></button>
                                    <button @click="applyAccentPreset('#22c55e')" class="w-full h-8 rounded bg-green-500 hover:bg-green-600" title="Verde"></button>
                                    <button @click="applyAccentPreset('#8b5cf6')" class="w-full h-8 rounded bg-purple-500 hover:bg-purple-600" title="Roxo"></button>
                                    <button @click="applyAccentPreset('#ef4444')" class="w-full h-8 rounded bg-red-500 hover:bg-red-600" title="Vermelho"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="hospital-content p-6">
        <div class="max-w-6xl mx-auto space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Teste de Accent Colors</h1>
                    <p class="text-gray-600">Demonstração dos elementos afetados pela cor de destaque</p>
                </div>
                <div class="text-sm text-gray-500">
                    Accent atual: <span x-text="colors.accent" class="font-mono"></span>
                </div>
            </div>

            <!-- Seção 1: Botões -->
            <div class="gqa-card">
                <h2 class="text-lg font-semibold mb-4">🎯 Botões (Background muda)</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center space-y-2">
                        <button class="btn-primary w-full">btn-primary</button>
                        <code class="text-xs text-gray-500">.btn-primary</code>
                    </div>
                    <div class="text-center space-y-2">
                        <button class="gqa-btn primary w-full">gqa-btn primary</button>
                        <code class="text-xs text-gray-500">.gqa-btn.primary</code>
                    </div>
                    <div class="text-center space-y-2">
                        <button class="btn-accent w-full">btn-accent</button>
                        <code class="text-xs text-gray-500">.btn-accent</code>
                    </div>
                    <div class="text-center space-y-2">
                        <button class="primary-button w-full">primary-button</button>
                        <code class="text-xs text-gray-500">.primary-button</code>
                    </div>
                </div>
            </div>

            <!-- Seção 2: Elementos com background -->
            <div class="gqa-card">
                <h2 class="text-lg font-semibold mb-4">🎨 Elementos de Background</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <div class="bg-blue-500 text-white p-4 rounded-lg text-center">
                            Background Azul (.bg-blue-500)
                        </div>
                        <code class="text-xs text-gray-500 block text-center">.bg-blue-500</code>
                    </div>
                    <div class="space-y-2">
                        <div class="border-blue-500 border-2 p-4 rounded-lg text-center">
                            Borda Azul (.border-blue-500)
                        </div>
                        <code class="text-xs text-gray-500 block text-center">.border-blue-500</code>
                    </div>
                </div>
            </div>

            <!-- Seção 3: Textos -->
            <div class="gqa-card">
                <h2 class="text-lg font-semibold mb-4">📝 Elementos de Texto</h2>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-blue-500 font-medium">Texto azul (.text-blue-500)</span>
                        <code class="text-xs text-gray-500">.text-blue-500</code>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="accent-color font-medium">Cor de accent (.accent-color)</span>
                        <code class="text-xs text-gray-500">.accent-color</code>
                    </div>
                    <div class="flex justify-between items-center">
                        <a href="#" class="link-primary font-medium">Link primário (.link-primary)</a>
                        <code class="text-xs text-gray-500">.link-primary</code>
                    </div>
                </div>
            </div>

            <!-- Seção 4: Simulação Interface Real -->
            <div class="gqa-card">
                <h2 class="text-lg font-semibold mb-4">🏥 Simulação de Interface Real</h2>
                <div class="space-y-6">
                    <!-- Header da seção -->
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-lg font-semibold">Gestão de Qualidade</h3>
                            <p class="text-gray-600">Análise de <span class="text-blue-500 font-medium">conformidade</span> em tempo real</p>
                        </div>
                        <button class="btn-primary">Nova Análise</button>
                    </div>

                    <!-- Cards de estatísticas -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm text-gray-600">Conformidade</p>
                                    <p class="text-2xl font-bold accent-color">95%</p>
                                </div>
                                <button class="btn-accent text-sm px-3 py-1">Ver</button>
                            </div>
                        </div>

                        <div class="border-blue-500 border-l-4 bg-blue-50 p-4 rounded-r-lg">
                            <p class="text-sm text-gray-600">Indicadores</p>
                            <p class="text-lg font-semibold text-blue-500">Dentro do padrão</p>
                            <a href="#" class="link-primary text-sm">Ver detalhes →</a>
                        </div>

                        <div class="border border-gray-200 rounded-lg p-4">
                            <p class="text-sm text-gray-600">Ações</p>
                            <div class="mt-2 space-y-2">
                                <button class="primary-button w-full text-sm">Aprovar</button>
                                <button class="bg-blue-500 text-white w-full px-3 py-1 rounded text-sm">Download</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Explicação técnica -->
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-yellow-800 mb-2">💡 Como funciona o sistema de Accent Colors</h3>
                <div class="text-sm text-yellow-700 space-y-2">
                    <p><strong>Elementos afetados pelo accent:</strong></p>
                    <ul class="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Background:</strong> .btn-primary, .gqa-btn.primary, .bg-blue-500, .btn-accent, .primary-button</li>
                        <li><strong>Texto:</strong> .text-blue-500, .accent-color, .link-primary</li>
                        <li><strong>Borda:</strong> .border-blue-500</li>
                    </ul>
                    <p class="mt-2"><strong>Teste:</strong> Use o seletor de cores na navbar para alterar o accent e veja as mudanças em tempo real!</p>
                </div>
            </div>
        </div>
    </main>

    <script>
        function hospitalTheme() {
            return {
                isDarkMode: false,
                colors: {
                    accent: '#3b82f6'
                },

                init() {
                    // Aguardar o sistema carregar
                    this.$nextTick(() => {
                        setTimeout(() => {
                            console.log('🔍 Sistema de tema inicializado');
                            this.testAccentSystem();
                        }, 500);
                    });
                },

                updateAccentColor(color) {
                    this.colors.accent = color;
                    console.log(`🎨 Atualizando accent para: ${color}`);

                    if (window.Hospital && window.Hospital.themeManager) {
                        window.Hospital.themeManager.updateColor('accent', color);
                    } else {
                        // Aplicação manual caso o sistema não esteja disponível
                        this.applyAccentManually(color);
                    }
                },

                applyAccentPreset(color) {
                    this.colors.accent = color;
                    this.updateAccentColor(color);
                },

                applyAccentManually(color) {
                    console.log(`🔧 Aplicando accent manualmente: ${color}`);

                    // Aplicar aos elementos de background
                    const bgElements = document.querySelectorAll('.btn-primary, .gqa-btn.primary, .bg-blue-500, .btn-accent, .primary-button');
                    bgElements.forEach(el => {
                        el.style.backgroundColor = color;
                        el.style.borderColor = color;
                        console.log(`  ✓ Background aplicado em: ${el.className}`);
                    });

                    // Aplicar aos elementos de texto
                    const textElements = document.querySelectorAll('.text-blue-500, .accent-color, .link-primary');
                    textElements.forEach(el => {
                        el.style.color = color;
                        console.log(`  ✓ Texto aplicado em: ${el.className}`);
                    });

                    // Aplicar às bordas
                    const borderElements = document.querySelectorAll('.border-blue-500');
                    borderElements.forEach(el => {
                        el.style.borderColor = color;
                        console.log(`  ✓ Borda aplicada em: ${el.className}`);
                    });
                },

                testAccentSystem() {
                    const accentElements = document.querySelectorAll(
                        '.btn-primary, .gqa-btn.primary, .text-blue-500, .bg-blue-500, ' +
                        '.border-blue-500, .btn-accent, .accent-color, .primary-button, .link-primary'
                    );

                    console.log(`🎯 Encontrados ${accentElements.length} elementos de accent:`);
                    accentElements.forEach((el, i) => {
                        console.log(`  ${i+1}. ${el.tagName} com classes: ${el.className}`);
                    });

                    if (window.Hospital && window.Hospital.themeManager) {
                        console.log('✅ Sistema de temas disponível');
                    } else {
                        console.warn('⚠️ Sistema de temas não disponível - usando aplicação manual');
                    }
                }
            }
        }
    </script>
</body>
</html>
