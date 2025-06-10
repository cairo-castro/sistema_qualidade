// Importações necessárias
import Alpine from 'alpinejs';
import { ThemeConfig } from './config/theme-config.js';
import { ColorUtils } from './utils/color-utils.js';

// Definir HospitalSystem como uma classe completa
class HospitalSystem {
    constructor() {
        this.theme = {
            toggle: () => {
                const isDark = document.documentElement.classList.contains('dark');
                document.documentElement.classList.toggle('dark', !isDark);
                localStorage.setItem('theme', !isDark ? 'dark' : 'light');
            }
        };
        this.charts = {
            destroyAll: () => {
                console.log('Charts destroyed');
            }
        };
    }

    init() {
        console.log('Hospital System initialized');
    }

    loadModule(moduleName) {
        console.log(`Loading module: ${moduleName}`);
    }
}

// Global Setup and Initialization
window.Alpine = Alpine;
window.themeManager = null;
window.isCustomActive = window.hasCustomTheme || false;
window.colors = {
    navbar: window.userTheme?.navbar_color || ThemeConfig.DEFAULT_COLORS.navbar,
    sidebar: window.userTheme?.sidebar_color || ThemeConfig.DEFAULT_COLORS.sidebar,
    background: window.userTheme?.background_color || ThemeConfig.DEFAULT_COLORS.background
};

// Global utility functions
window.getContrastingTextColor = ColorUtils.getContrastingTextColor;

// Debug function to reset sidebar state
window.resetSidebarState = function() {
    localStorage.removeItem('hospital-sidebar-collapsed');
    console.log('🔄 Sidebar state reset. Reload page to apply changes.');
    location.reload();
};

// Debug function to check sidebar state
window.checkSidebarState = function() {
    const stored = localStorage.getItem('hospital-sidebar-collapsed');
    console.log('📋 Current sidebar state in localStorage:', stored);
    console.log('📋 Parsed value:', JSON.parse(stored || 'false'));
    console.log('📋 Expected: false (expanded), true (collapsed)');
};

// Initialize Hospital System
window.Hospital = new HospitalSystem();

// Initialize theme manager directly in Hospital object
window.Hospital.themeManager = {
    open: false,
    loading: false,
    isResetting: false, // Previne múltiplas execuções de reset
    isCustomActive: window.hasCustomTheme || false,
    applyTimeout: null,
    colors: {
        navbar: window.userTheme?.navbar_color || ThemeConfig.DEFAULT_COLORS.navbar,
        sidebar: window.userTheme?.sidebar_color || ThemeConfig.DEFAULT_COLORS.sidebar,
        background: window.userTheme?.background_color || ThemeConfig.DEFAULT_COLORS.background,
        accent: window.userTheme?.accent_color || ThemeConfig.DEFAULT_COLORS.accent
    },

    init() {
        this.updateIsCustomActive();
        this.toggleLightDarkButton();

        // Garantir que a função global está disponível
        if (!window.getContrastingTextColor) {
            window.getContrastingTextColor = ColorUtils.getContrastingTextColor;
        }

        // Configurar aplicação dinâmica de cores na navbar
        this.setupDynamicNavbarColorApplication();
    },

    toggle() {
        this.open = !this.open;
    },

    updateIsCustomActive() {
        this.isCustomActive = window.hasCustomTheme || false;
        window.isCustomActive = this.isCustomActive;
    },

    toggleLightDarkButton() {
        const button = document.querySelector('button[onclick="toggleHospitalTheme()"]');
        if (!button) return;

        if (window.hasCustomTheme) {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.title = 'Tema personalizado ativo - modo claro/escuro desabilitado';
        } else {
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.title = 'Alternar modo claro/escuro';
        }
    },

    updateColor(type, value) {
        if (!ColorUtils.isValidHexColor(value)) {
            console.warn('Invalid hex color:', value);
            return;
        }

        // Aplicar cor instantaneamente
        this.colors[type] = value;

        // Calcular cor de texto contrastante
        const textColor = ColorUtils.getContrastingTextColor(value);
        console.log(`🎨 Applying ${type}: ${value} with text: ${textColor}`);

        this.applyStyles(type, value, textColor);
    },

    applyColorRealTime(type, color) {
        // Método mantido para compatibilidade, mas sem delay
        console.log(`🎯 applyColorRealTime: ${type} = ${color}`);
        const textColor = ColorUtils.getContrastingTextColor(color);
        console.log(`🎯 Calculated text color: ${textColor}`);
        this.applyStyles(type, color, textColor);
    },

    applyPreset(presetName) {
        console.log(`🎨 Applying preset: ${presetName}`);
        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) {
            this.showToast('Preset não encontrado: ' + presetName, 'error');
            return;
        }

        console.log(`🎨 Preset found:`, preset);

        // Update colors
        this.colors.navbar = preset.navbar;
        this.colors.sidebar = preset.sidebar;
        this.colors.background = preset.background;
        this.colors.accent = preset.accent || preset.navbar;

        console.log(`🎨 Colors updated:`, this.colors);

        // Apply all colors with individual logs
        Object.entries(preset).forEach(([type, color]) => {
            if (color && type !== 'name') {
                console.log(`🎨 Applying ${type}: ${color}`);
                this.applyColorRealTime(type, color);
            }
        });

        console.log(`✅ Preset ${presetName} applied successfully!`);
        // Notificação removada para melhor UX
    },

    applyStyles(type, color, textColor) {
        console.log(`🎯 applyStyles called: ${type} = ${color} (text: ${textColor})`);
        const root = document.documentElement;

        switch (type) {
            case 'navbar':
                console.log(`🏗️ Applying navbar styles...`);
                this.applyNavbarStyles(color, textColor, root);
                break;
            case 'sidebar':
                console.log(`🏗️ Applying sidebar styles...`);
                this.applySidebarStyles(color, textColor, root);
                break;
            case 'background':
                console.log(`🏗️ Applying background styles...`);
                this.applyBackgroundStyles(color, textColor, root);
                break;
            case 'accent':
                console.log(`🏗️ Applying accent styles...`);
                this.applyAccentStyles(color, textColor, root);
                break;
        }

        // Aplicar contraste em elementos com cores dinâmicas
        this.ensureTextContrast();
    },

    // Nova função para garantir contraste em todos os elementos
    ensureTextContrast() {
        // Aplicar contraste APENAS em elementos que têm background-color inline
        // e que são parte do sistema de tema personalizado
        const elementsWithBg = document.querySelectorAll(
            '.hospital-navbar[style*="background-color"], .hospital-sidebar[style*="background-color"], .hospital-content[style*="background-color"], main[style*="background-color"]'
        );

        elementsWithBg.forEach(element => {
            const bgColor = element.style.backgroundColor;
            if (bgColor) {
                // Converter RGB para HEX se necessário
                const hexColor = this.rgbToHex(bgColor) || bgColor;
                if (ColorUtils.isValidHexColor(hexColor)) {
                    const contrastColor = ColorUtils.getContrastingTextColor(hexColor);

                    // Só aplicar se o elemento não tem classes dark mode
                    if (!element.classList.toString().includes('dark:')) {
                        element.style.color = contrastColor;

                        // Aplicar apenas aos filhos diretos que não têm background próprio
                        // e que estão dentro deste elemento específico
                        const children = element.querySelectorAll(':scope > span, :scope > a, :scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > div:not([class*="bg-"]):not([style*="background"])');
                        children.forEach(child => {
                            if (!child.style.backgroundColor &&
                                !child.classList.contains('bg-') &&
                                !(child.className && child.className.includes('dark:'))) {
                                child.style.color = contrastColor;
                            }
                        });
                    }
                }
            }
        });
    },

    // Função auxiliar para converter RGB para HEX
    rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return null;

        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return null;

        const [, r, g, b] = match;
        return '#' + [r, g, b].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    applyNavbarStyles(color, textColor, root) {
        root.style.setProperty('--navbar-bg', color);
        root.style.setProperty('--navbar-text', textColor);

        // Apply directly to navbar elements and their children
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(nav => {
            nav.style.backgroundColor = color;
            nav.style.color = textColor;

            // Apply to ALL navbar descendants (not just direct children)
            const allNavbarElements = nav.querySelectorAll('*');
            allNavbarElements.forEach(element => {
                // Only apply if element doesn't have its own background color or specific styling
                const hasOwnBackground = element.style.backgroundColor ||
                                       element.classList.contains('bg-') ||
                                       (element.className && element.className.includes('dark:bg-'));

                const isThemeButton = element.closest('[x-data*="themeManager"]') ||
                                    element.hasAttribute('x-data') ||
                                    (element.classList && element.classList.contains('theme-manager'));

                if (!hasOwnBackground && !isThemeButton) {
                    // Apply text color
                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');

                    // For SVG icons
                    if (element.tagName === 'SVG') {
                        element.style.fill = textColor;
                        element.style.stroke = textColor;
                    }

                    // For specific navbar elements
                    if (element.classList.contains('quick-stat-badge') ||
                        element.classList.contains('stat-value') ||
                        element.classList.contains('stat-label') ||
                        element.closest('.quick-stat-badge')) {
                        element.style.color = textColor;
                        element.style.setProperty('color', textColor, 'important');
                    }
                }
            });

            // Apply to dropdown elements specifically
            const dropdowns = nav.querySelectorAll('[x-show], .dropdown, .dropdown-menu, [class*="dropdown"]');
            dropdowns.forEach(dropdown => {
                if (!dropdown.closest('[x-data*="themeManager"]')) {
                    // Apply to dropdown container
                    if (!dropdown.style.backgroundColor && !dropdown.classList.contains('bg-')) {
                        dropdown.style.backgroundColor = color;
                        dropdown.style.color = textColor;
                    }

                    // Apply to all dropdown children
                    const dropdownItems = dropdown.querySelectorAll('*');
                    dropdownItems.forEach(item => {
                        if (!item.style.backgroundColor &&
                            !item.classList.contains('bg-') &&
                            !(item.className && item.className.includes('dark:'))) {
                            item.style.color = textColor;
                            item.style.setProperty('color', textColor, 'important');
                        }
                    });
                }
            });

            // Apply to quick stat badges specifically
            const quickStatBadges = nav.querySelectorAll('.quick-stat-badge, [class*="stat-"], .badge, .notification-badge');
            quickStatBadges.forEach(badge => {
                // Apply background color to the badge
                if (!badge.classList.contains('bg-') && !badge.style.backgroundColor) {
                    badge.style.backgroundColor = color;
                    badge.style.borderColor = textColor;
                }

                // Apply text color to badge and its children
                badge.style.color = textColor;
                badge.style.setProperty('color', textColor, 'important');

                const badgeChildren = badge.querySelectorAll('*');
                badgeChildren.forEach(child => {
                    if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                        child.style.color = textColor;
                        child.style.setProperty('color', textColor, 'important');
                    }
                });
            });

            // Apply to buttons in navbar (except theme manager buttons)
            const navbarButtons = nav.querySelectorAll('button:not([class*="theme"]):not([x-data])');
            navbarButtons.forEach(button => {
                if (!button.style.backgroundColor && !button.classList.contains('bg-')) {
                    button.style.color = textColor;
                    button.style.borderColor = textColor;
                    button.style.setProperty('color', textColor, 'important');

                    // Apply to button children
                    const buttonChildren = button.querySelectorAll('*');
                    buttonChildren.forEach(child => {
                        if (child.tagName === 'SVG') {
                            child.style.fill = textColor;
                            child.style.stroke = textColor;
                        } else {
                            child.style.color = textColor;
                            child.style.setProperty('color', textColor, 'important');
                        }
                    });
                }
            });

            // Apply to links in navbar
            const navbarLinks = nav.querySelectorAll('a');
            navbarLinks.forEach(link => {
                if (!link.style.backgroundColor && !link.classList.contains('bg-')) {
                    link.style.color = textColor;
                    link.style.setProperty('color', textColor, 'important');

                    const linkChildren = link.querySelectorAll('*');
                    linkChildren.forEach(child => {
                        if (!child.style.backgroundColor) {
                            child.style.color = textColor;
                            child.style.setProperty('color', textColor, 'important');
                        }
                    });
                }
            });
        });

        // Aplicar cores de forma abrangente para garantir que todos os elementos sejam cobertos
        this.applyNavbarColorsComprehensive(color, textColor);

        console.log(`✅ Navbar styles applied comprehensively: ${color} with text: ${textColor}`);
    },

    // Função específica para aplicar cores abrangentes na navbar
    applyNavbarColorsComprehensive(color, textColor) {
        console.log(`🎨 Applying comprehensive navbar colors - BG: ${color}, Text: ${textColor}`);

        // Seletores abrangentes para todos os elementos da navbar
        const navbarElements = document.querySelectorAll(
            '.hospital-navbar, .hospital-navbar *, nav.hospital-navbar, nav.hospital-navbar *'
        );

        navbarElements.forEach(element => {
            // Verificar se o elemento está realmente na navbar e não é o theme manager
            const isInNavbar = element.closest('.hospital-navbar, nav.hospital-navbar');
            const isThemeManager = element.closest('[x-data*="themeManager"]') ||
                                  element.hasAttribute('x-data') ||
                                  element.classList.contains('theme-manager');
            const hasOwnBg = element.style.backgroundColor ||
                           element.classList.contains('bg-') ||
                           (element.className && element.className.includes('dark:bg-'));

            if (isInNavbar && !isThemeManager && !hasOwnBg) {
                // Aplicar cor de texto
                element.style.color = textColor;
                element.style.setProperty('color', textColor, 'important');

                // Para SVGs
                if (element.tagName === 'SVG') {
                    element.style.fill = textColor;
                    element.style.stroke = textColor;
                }

                // Para quick stat badges - aplicar background também
                if (element.classList.contains('quick-stat-badge') ||
                    element.classList.contains('stat-value') ||
                    element.classList.contains('stat-label') ||
                    element.closest('.quick-stat-badge')) {

                    // Se é o container do badge, aplicar background
                    if (element.classList.contains('quick-stat-badge')) {
                        element.style.backgroundColor = color;
                        element.style.borderColor = textColor;
                    }

                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');
                }

                // Para dropdowns específicos
                if (element.classList.contains('dropdown') ||
                    element.classList.contains('dropdown-menu') ||
                    element.hasAttribute('x-show') ||
                    element.closest('.dropdown, .dropdown-menu, [x-show]')) {

                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');

                    // Se é um container de dropdown, aplicar background
                    if (element.classList.contains('dropdown-menu') ||
                        element.hasAttribute('x-show')) {
                        element.style.backgroundColor = color;
                    }
                }

                // Para botões específicos (exceto theme manager)
                if (element.tagName === 'BUTTON' && !isThemeManager) {
                    element.style.color = textColor;
                    element.style.borderColor = textColor;
                    element.style.setProperty('color', textColor, 'important');
                }

                // Para links
                if (element.tagName === 'A') {
                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');
                }
            }
        });

        // Aplicar especificamente aos elementos que podem ter sido perdidos
        const specificSelectors = [
            '.hospital-navbar .quick-stat-badge',
            '.hospital-navbar .stat-value',
            '.hospital-navbar .stat-label',
            '.hospital-navbar .badge',
            '.hospital-navbar .notification-badge',
            '.hospital-navbar [x-show]',
            '.hospital-navbar .dropdown',
            '.hospital-navbar .dropdown-menu',
            'nav.hospital-navbar .quick-stat-badge',
            'nav.hospital-navbar .stat-value',
            'nav.hospital-navbar .stat-label',
            'nav.hospital-navbar .badge',
            'nav.hospital-navbar .notification-badge',
            'nav.hospital-navbar [x-show]',
            'nav.hospital-navbar .dropdown',
            'nav.hospital-navbar .dropdown-menu'
        ];

        specificSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const isThemeManager = element.closest('[x-data*="themeManager"]');
                if (!isThemeManager) {
                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');

                    // Para containers de dropdown e badges
                    if (element.classList.contains('dropdown-menu') ||
                        element.classList.contains('quick-stat-badge') ||
                        element.hasAttribute('x-show')) {
                        element.style.backgroundColor = color;
                    }

                    // Aplicar aos filhos também
                    const children = element.querySelectorAll('*');
                    children.forEach(child => {
                        if (!child.style.backgroundColor &&
                            !child.classList.contains('bg-') &&
                            !child.closest('[x-data*="themeManager"]')) {
                            child.style.color = textColor;
                            child.style.setProperty('color', textColor, 'important');
                        }
                    });
                }
            });
        });

        console.log(`✅ Comprehensive navbar colors applied: ${textColor} for background: ${color}`);
    },

    applySidebarStyles(color, textColor, root) {
        root.style.setProperty('--sidebar-bg', color);
        root.style.setProperty('--sidebar-text', textColor);

        // Apply directly to sidebar elements and their children - CORRIGIDO para usar .hospital-sidebar
        const sidebars = document.querySelectorAll('.hospital-sidebar, .sidebar, [class*="sidebar"], aside');
        sidebars.forEach(sidebar => {
            sidebar.style.backgroundColor = color;
            sidebar.style.color = textColor;

            // Apply to sidebar children (links, text, icons)
            const sidebarChildren = sidebar.querySelectorAll('a, span, div, p, h1, h2, h3, h4, h5, h6, svg, i');
            sidebarChildren.forEach(child => {
                // Only apply if element doesn't have its own background color
                if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                    child.style.color = textColor;
                    // For SVG icons
                    if (child.tagName === 'SVG') {
                        child.style.fill = textColor;
                        child.style.stroke = textColor;
                    }
                }
            });
        });

        console.log(`✅ Sidebar styles applied: ${color} with text: ${textColor}`);
    },

    applyBackgroundStyles(color, textColor, root) {
        root.style.setProperty('--bg-color', color);
        root.style.setProperty('--text-color', textColor);

        // Aplicar APENAS às áreas de conteúdo principal, não à página toda
        const targetSelectors = [
            '.hospital-content',    // Área principal de conteúdo
            'main',                 // Tag main
            '.content-area',        // Área de conteúdo específica
            '.main-content'         // Conteúdo principal
        ];

        // Encontrar o container principal de conteúdo
        let mainContentArea = null;
        for (const selector of targetSelectors) {
            mainContentArea = document.querySelector(selector);
            if (mainContentArea) break;
        }

        // Se não encontrar uma área específica, aplicar apenas ao body como fallback mínimo
        if (!mainContentArea) {
            mainContentArea = document.body;
        }

        // Aplicar cor de fundo apenas ao container principal
        if (mainContentArea) {
            mainContentArea.style.backgroundColor = color;

            // Aplicar cor de texto apenas aos elementos filhos DIRETOS
            // que não têm suas próprias cores de fundo
            const directChildren = mainContentArea.querySelectorAll(':scope > *');
            directChildren.forEach(child => {
                // Só aplicar se o elemento não tem background próprio
                // e não é navbar/sidebar
                if (!child.style.backgroundColor &&
                    !child.classList.contains('bg-') &&
                    !child.classList.contains('hospital-navbar') &&
                    !child.classList.contains('hospital-sidebar') &&
                    !child.closest('.hospital-navbar') &&
                    !child.closest('.hospital-sidebar') &&
                    !(child.className && child.className.includes('dark:'))) {

                    child.style.color = textColor;

                    // Aplicar também aos textos diretos dentro desses elementos
                    const textElements = child.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div:not([class*="bg-"]):not([style*="background"]), a:not([class*="bg-"])');
                    textElements.forEach(textEl => {
                        if (!textEl.style.backgroundColor &&
                            !textEl.classList.contains('bg-') &&
                            !(textEl.className && textEl.className.includes('dark:')) &&
                            !textEl.closest('.hospital-navbar') &&
                            !textEl.closest('.hospital-sidebar')) {
                            textEl.style.color = textColor;
                            // Usar important para sobrescrever CSS existente se necessário
                            textEl.style.setProperty('color', textColor, 'important');
                        }
                    });
                }
            });
        }

        // Aplicar cores de contraste aos page headers e breadcrumbs (SEMPRE)
        this.applyHeaderAndBreadcrumbColors(color, textColor);

        // Estratégia adicional: Aplicar diretamente a todos os H1-H6 que não estão em navbar/sidebar
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        allHeadings.forEach(heading => {
            if (!heading.closest('.hospital-navbar') &&
                !heading.closest('.hospital-sidebar') &&
                !heading.style.backgroundColor &&
                !heading.classList.contains('bg-')) {
                heading.style.color = textColor;
                heading.style.setProperty('color', textColor, 'important');
            }
        });

        // Definir propriedades CSS customizadas para uso em CSS
        root.style.setProperty('--content-bg', color);
        root.style.setProperty('--content-text', textColor);

        console.log(`✅ Background styles applied to content area: ${color} with text: ${textColor}`);
    },

    applyAccentStyles(color, textColor, root) {
        root.style.setProperty('--accent-color', color);
        root.style.setProperty('--accent-text', textColor);

        // Apply to buttons, links and accent elements
        const accentElements = document.querySelectorAll(
            '.btn-primary, .gqa-btn.primary, .text-blue-500, .bg-blue-500, ' +
            '.border-blue-500, .focus\\:ring-blue-500, [class*="blue-"]'
        );

        accentElements.forEach(element => {
            if (element.classList.contains('bg-blue-500') || element.classList.contains('btn-primary')) {
                element.style.backgroundColor = color;
                element.style.borderColor = color;
                element.style.color = textColor;
            } else if (element.classList.contains('text-blue-500')) {
                element.style.color = color;
            } else if (element.classList.contains('border-blue-500')) {
                element.style.borderColor = color;
            }
        });
    },

    async saveTheme() {
        this.loading = true;

        try {
            const response = await fetch('/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    navbar_color: this.colors.navbar,
                    sidebar_color: this.colors.sidebar,
                    background_color: this.colors.background,
                    accent_color: this.colors.accent
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.showToast('Tema salvo com sucesso!', 'success');
                window.hasCustomTheme = true;
                this.updateIsCustomActive();
                this.toggleLightDarkButton();
            } else {
                throw new Error(data.message || 'Erro ao salvar tema');
            }
        } catch (error) {
            console.error('Error saving theme:', error);
            this.showToast('Erro ao salvar tema: ' + error.message, 'error');
        } finally {
            this.loading = false;
        }
    },

    resetTheme() {
        console.log('🔄 Resetting theme to default...');

        try {
            // 1. Detectar se o modo dark está ativo
            const isDarkMode = document.documentElement.classList.contains('dark');
            console.log('🌙 Dark mode active:', isDarkMode);

            // 2. Definir cores padrão baseadas no modo atual
            const defaultColors = isDarkMode ? {
                navbar: '#1f2937',    // dark gray para dark mode
                sidebar: '#111827',   // darker gray para dark mode
                background: '#0f172a', // very dark para dark mode
                accent: '#22c55e'     // green mantém igual
            } : {
                navbar: '#ffffff',    // white para light mode
                sidebar: '#ffffff',   // white para light mode
                background: '#f9fafb', // light gray para light mode
                accent: '#22c55e'     // green mantém igual
            };

            // 3. Definir cores de texto apropriadas
            const defaultTextColors = isDarkMode ? {
                navbar: '#f9fafb',    // texto claro para fundo escuro
                sidebar: '#f9fafb',   // texto claro para fundo escuro
                background: '#f9fafb', // texto claro para fundo escuro
                accent: '#ffffff'     // texto branco para accent
            } : {
                navbar: '#1f2937',    // texto escuro para fundo claro
                sidebar: '#1f2937',   // texto escuro para fundo claro
                background: '#1f2937', // texto escuro para fundo claro
                accent: '#ffffff'     // texto branco para accent
            };

            // 4. Reset colors object
            this.colors = { ...defaultColors };

            // 5. Remove apenas custom properties específicas (preserva CSS do dark mode)
            const root = document.documentElement;
            const customProperties = [
                '--navbar-bg', '--navbar-text',
                '--sidebar-bg', '--sidebar-text',
                '--bg-color', '--text-color',
                '--accent-color', '--accent-text'
            ];

            customProperties.forEach(prop => {
                root.style.removeProperty(prop);
            });

            // 6. Remove apenas estilos inline de elementos com cores customizadas específicas
            // Preserva outras cores que podem ser necessárias para o dark mode
            const elementsWithCustomTheme = document.querySelectorAll(
                '.hospital-navbar[style], .hospital-sidebar[style], .hospital-content[style], [style*="background-color: rgb"]'
            );

            elementsWithCustomTheme.forEach(el => {
                // Remove apenas propriedades de cor de tema personalizado
                el.style.removeProperty('background-color');
                el.style.removeProperty('color');
                el.style.removeProperty('border-color');
            });

            // 7. Limpar cores inline de filhos de elementos de tema
            const themeChildren = document.querySelectorAll(
                '.hospital-navbar *, .hospital-sidebar *, .hospital-content *'
            );

            themeChildren.forEach(child => {
                // Remove apenas se foi aplicado pelo sistema de tema
                if (child.style.color && (
                    child.style.color.includes('rgb') ||
                    child.style.color.startsWith('#')
                )) {
                    child.style.removeProperty('color');
                    child.style.removeProperty('background-color');
                    child.style.removeProperty('fill');
                    child.style.removeProperty('stroke');
                }
            });

            // 8. Update states
            window.hasCustomTheme = false;
            this.updateIsCustomActive();
            this.toggleLightDarkButton();
            this.open = false;

            console.log(`✅ Theme reset completed for ${isDarkMode ? 'dark' : 'light'} mode`);

        } catch (error) {
            console.error('❌ Error during theme reset:', error);
            // Em caso de erro, pelo menos tenta resetar o estado
            window.hasCustomTheme = false;
            this.open = false;
        }
    },

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full`;

        // Set background color based on type
        switch (type) {
            case 'success':
                toast.classList.add('bg-green-500');
                break;
            case 'error':
                toast.classList.add('bg-red-500');
                break;
            case 'warning':
                toast.classList.add('bg-yellow-500');
                break;
            default:
                toast.classList.add('bg-blue-500');
        }

        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },

    // Função específica para aplicar cores aos headers e breadcrumbs
    applyHeaderAndBreadcrumbColors(backgroundColor, textColor) {
        console.log(`🎨 Applying header/breadcrumb colors - BG: ${backgroundColor}, Text: ${textColor}`);

        // Seletores mais amplos para capturar todos os headers
        const headerSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',           // Todos os headings
            '.page-header', '.page-title', '.content-header',
            '.header-title', '.main-header', '.page-heading',
            '[class*="header"]', '[class*="title"]'
        ];

        // Seletores para breadcrumbs mais específicos
        const breadcrumbSelectors = [
            '.breadcrumb', '.breadcrumbs', 'nav[aria-label="breadcrumb"]',
            '.page-breadcrumb', '[class*="breadcrumb"]',
            'ol.breadcrumb', 'ul.breadcrumb', '.breadcrumb-nav'
        ];

        // Aplicar aos headers da página com estratégia mais ampla
        headerSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Verificar se está na área de conteúdo e não em navbar/sidebar
                const isInMainContent = element.closest('.hospital-content, main, .content-area, .main-content, body');
                const isNotInNavbar = !element.closest('.hospital-navbar, nav.hospital-navbar');
                const isNotInSidebar = !element.closest('.hospital-sidebar, .sidebar, aside');
                const hasNoOwnBackground = !element.style.backgroundColor && !element.classList.contains('bg-');
                const isNotDarkMode = !(element.className && element.className.includes('dark:'));

                if (isInMainContent && isNotInNavbar && isNotInSidebar && hasNoOwnBackground && isNotDarkMode) {
                    // Aplicar cor ao elemento principal
                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');

                    // Para elementos H1-H6, aplicar também aos elementos filhos
                    if (element.tagName.match(/^H[1-6]$/)) {
                        const childTexts = element.querySelectorAll('span, a, em, strong, i, b');
                        childTexts.forEach(child => {
                            if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                                child.style.color = textColor;
                                child.style.setProperty('color', textColor, 'important');
                            }
                        });
                    }

                    console.log(`✅ Applied header color to: ${element.tagName}.${element.className || 'no-class'}`);
                }
            });
        });

        // Aplicar aos breadcrumbs com estratégia mais ampla
        breadcrumbSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const isInMainContent = element.closest('.hospital-content, main, .content-area, .main-content, body');
                const isNotInNavbar = !element.closest('.hospital-navbar, nav.hospital-navbar');
                const isNotInSidebar = !element.closest('.hospital-sidebar, .sidebar, aside');
                const hasNoOwnBackground = !element.style.backgroundColor && !element.classList.contains('bg-');
                const isNotDarkMode = !(element.className && element.className.includes('dark:'));

                if (isInMainContent && isNotInNavbar && isNotInSidebar && hasNoOwnBackground && isNotDarkMode) {
                    // Aplicar cor ao container do breadcrumb
                    element.style.color = textColor;
                    element.style.setProperty('color', textColor, 'important');

                    // Aplicar a todos os elementos filhos do breadcrumb
                    const allBreadcrumbItems = element.querySelectorAll('*');
                    allBreadcrumbItems.forEach(item => {
                        if (!item.style.backgroundColor &&
                            !item.classList.contains('bg-') &&
                            !(item.className && item.className.includes('dark:'))) {
                            item.style.color = textColor;
                            item.style.setProperty('color', textColor, 'important');
                        }
                    });

                    // Aplicar especificamente aos links, spans e list items
                    const breadcrumbItems = element.querySelectorAll('a, span, li, .breadcrumb-item, .breadcrumb-link');
                    breadcrumbItems.forEach(item => {
                        if (!item.style.backgroundColor && !item.classList.contains('bg-')) {
                            item.style.color = textColor;
                            item.style.setProperty('color', textColor, 'important');
                        }
                    });

                    console.log(`✅ Applied breadcrumb color to: ${element.tagName}.${element.className || 'no-class'}`);
                }
            });
        });

        // Estratégia adicional: Aplicar a TODOS os H1-H6 e breadcrumbs na página que não tenham background próprio
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        allHeadings.forEach(heading => {
            const isNotInNavbar = !heading.closest('.hospital-navbar, nav.hospital-navbar');
            const isNotInSidebar = !heading.closest('.hospital-sidebar, .sidebar, aside');
            const hasNoOwnBackground = !heading.style.backgroundColor && !heading.classList.contains('bg-');

            if (isNotInNavbar && isNotInSidebar && hasNoOwnBackground) {
                heading.style.color = textColor;
                heading.style.setProperty('color', textColor, 'important');

                // Aplicar também aos filhos
                const children = heading.querySelectorAll('*');
                children.forEach(child => {
                    if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                        child.style.color = textColor;
                        child.style.setProperty('color', textColor, 'important');
                    }
                });
            }
        });

        console.log(`✅ Header and breadcrumb colors applied: ${textColor} for background: ${backgroundColor}`);
    },

    // Função para aplicar cores dinamicamente a elementos que aparecem após o carregamento
    setupDynamicNavbarColorApplication() {
        // Observer para detectar quando novos elementos são adicionados à navbar
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const isInNavbar = node.closest('.hospital-navbar, nav.hospital-navbar');
                            if (isInNavbar && window.hasCustomTheme) {
                                // Aplicar cores do tema atual
                                const currentColors = this.colors;
                                if (currentColors.navbar) {
                                    const textColor = ColorUtils.getContrastingTextColor(currentColors.navbar);
                                    this.applyDynamicNavbarColors(node, currentColors.navbar, textColor);
                                }
                            }
                        }
                    });
                }
            });
        });

        // Observar mudanças na navbar
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(navbar => {
            observer.observe(navbar, {
                childList: true,
                subtree: true
            });
        });

        // Salvar referência para poder desconectar depois se necessário
        this.navbarObserver = observer;
    },

    // Aplicar cores a um elemento específico da navbar
    applyDynamicNavbarColors(element, backgroundColor, textColor) {
        const isThemeManager = element.closest('[x-data*="themeManager"]') ||
                              element.hasAttribute('x-data') ||
                              element.classList.contains('theme-manager');

        if (!isThemeManager) {
            // Aplicar ao elemento principal
            if (!element.style.backgroundColor && !element.classList.contains('bg-')) {
                if (element.classList.contains('dropdown-menu') ||
                    element.classList.contains('quick-stat-badge') ||
                    element.hasAttribute('x-show')) {
                    element.style.backgroundColor = backgroundColor;
                }
                element.style.color = textColor;
                element.style.setProperty('color', textColor, 'important');
            }

            // Aplicar aos filhos
            const children = element.querySelectorAll('*');
            children.forEach(child => {
                if (!child.style.backgroundColor &&
                    !child.classList.contains('bg-') &&
                    !child.closest('[x-data*="themeManager"]')) {
                    child.style.color = textColor;
                    child.style.setProperty('color', textColor, 'important');

                    // Para SVGs
                    if (child.tagName === 'SVG') {
                        child.style.fill = textColor;
                        child.style.stroke = textColor;
                    }
                }
            });
        }
    },

    // Hospital utilities for global access
    hospitalUtils: {
        toggleTheme() {
            window.Hospital.theme.toggle();
        }
    }
};

// Alpine.js Components
document.addEventListener('alpine:init', () => {
    Alpine.data('hospitalDashboard', () => ({
        sidebarCollapsed: JSON.parse(localStorage.getItem('hospital-sidebar-collapsed') || 'false'),
        sidebarOpen: false,
        loading: false,
        notifications: window.notifications || [],
        stats: window.stats || {
            totalDiagnosticos: 150,
            taxaConformidade: 95.2,
            periodosAtivos: 12,
            itensNaoConformes: 8
        },

        init() {
            this.loadStats();
        },

        async loadStats() {
            try {
                // Simular carregamento de dados - substituir por chamada real da API
                this.stats = {
                    totalDiagnosticos: Math.floor(Math.random() * 200) + 100,
                    taxaConformidade: (Math.random() * 10 + 90).toFixed(1),
                    periodosAtivos: Math.floor(Math.random() * 20) + 5,
                    itensNaoConformes: Math.floor(Math.random() * 15) + 1
                };
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        },

        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            localStorage.setItem('hospital-sidebar-collapsed', JSON.stringify(this.sidebarCollapsed));
        },

        formatNumber(num) {
            if (num === null || num === undefined) return '0';
            return new Intl.NumberFormat('pt-BR').format(num);
        },
    }));

    // Alpine.js component for theme manager
    Alpine.data('themeManager', () => ({
        open: false,
        loading: false,

        init() {
        },

        toggle() {
            this.open = !this.open;
        },

        applyPreset(presetName) {
            return window.Hospital.themeManager.applyPreset(presetName);
        },

        updateColor(type, value) {
            return window.Hospital.themeManager.updateColor(type, value);
        },

        saveTheme() {
            this.loading = true;
            window.Hospital.themeManager.saveTheme().finally(() => {
                this.loading = false;
            });
        },

        resetTheme() {
            console.log('🔄 Alpine reset theme called');

            // Prevenir múltiplas execuções
            if (this.loading) {
                console.log('Reset já em andamento, ignorando...');
                return;
            }

            this.loading = true;

            try {
                // Executa o reset simples
                window.Hospital.themeManager.resetTheme();
                console.log('✅ Reset completed successfully');

                // Pequeno delay para mostrar feedback visual
                setTimeout(() => {
                    this.loading = false;
                }, 100);

            } catch (error) {
                console.error('❌ Error in reset:', error);
                this.loading = false;
            }
        },

        get colors() {
            return window.Hospital.themeManager.colors;
        },

        get isCustomActive() {
            return window.Hospital.themeManager.isCustomActive;
        }
    }));
});

// DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Hospital System...');

    // Inicializar o theme manager primeiro
    window.Hospital.themeManager.init();

    window.Hospital.init();

    // Garantir que Alpine.js seja inicializado
    if (typeof Alpine !== 'undefined') {
        Alpine.start();
        console.log('✅ Alpine.js started');
    } else {
        console.error('❌ Alpine.js not found');
    }
});

// Global utilities for easy access
window.hospitalUtils = {
    toggleTheme() {
        window.Hospital.theme.toggle();
    }
};

// Cleanup and global functions
window.addEventListener('beforeunload', () => {
    window.Hospital.charts.destroyAll();
    console.log('Resources cleaned');
});

window.toggleHospitalTheme = () => window.hospitalUtils.toggleTheme();

export { Alpine };
