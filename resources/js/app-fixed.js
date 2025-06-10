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
            return;
        }

        // Aplicar cor instantaneamente
        this.colors[type] = value;
        const textColor = ColorUtils.getContrastingTextColor(value);
        this.applyStyles(type, value, textColor);
    },

    applyColorRealTime(type, color) {
        // Método mantido para compatibilidade, mas sem delay
        const textColor = ColorUtils.getContrastingTextColor(color);
        this.applyStyles(type, color, textColor);
    },

    applyPreset(presetName) {
        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) {
            this.showToast('Preset não encontrado: ' + presetName, 'error');
            return;
        }

        // Update colors
        this.colors.navbar = preset.navbar;
        this.colors.sidebar = preset.sidebar;
        this.colors.background = preset.background;
        this.colors.accent = preset.accent || preset.navbar;

        // Apply all colors
        Object.entries(preset).forEach(([type, color]) => {
            if (color && type !== 'name') {
                this.applyColorRealTime(type, color);
            }
        });

        this.showToast(`Tema ${preset.name} aplicado!`, 'success');
    },

    applyStyles(type, color, textColor) {
        const root = document.documentElement;

        switch (type) {
            case 'navbar':
                this.applyNavbarStyles(color, textColor, root);
                break;
            case 'sidebar':
                this.applySidebarStyles(color, textColor, root);
                break;
            case 'background':
                this.applyBackgroundStyles(color, textColor, root);
                break;
            case 'accent':
                this.applyAccentStyles(color, textColor, root);
                break;
        }
    },

    applyNavbarStyles(color, textColor, root) {
        root.style.setProperty('--navbar-bg', color);
        root.style.setProperty('--navbar-text', textColor);

        // Apply directly to navbar elements only (more specific selector)
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(nav => {
            nav.style.backgroundColor = color;
            nav.style.color = textColor;
        });
    },

    applySidebarStyles(color, textColor, root) {
        root.style.setProperty('--sidebar-bg', color);
        root.style.setProperty('--sidebar-text', textColor);

        // Apply directly to sidebar elements
        const sidebars = document.querySelectorAll('.sidebar, [class*="sidebar"], aside');
        sidebars.forEach(sidebar => {
            sidebar.style.backgroundColor = color;
            sidebar.style.color = textColor;
        });
    },

    applyBackgroundStyles(color, textColor, root) {
        root.style.setProperty('--bg-color', color);
        root.style.setProperty('--text-color', textColor);

        // Apply to main content areas
        const mainContent = document.querySelector('.hospital-content');
        const body = document.body;

        if (mainContent) {
            mainContent.style.backgroundColor = color;
            mainContent.style.color = textColor;
        }

        // Apply to body as fallback
        body.style.setProperty('--custom-bg', color);
        body.style.setProperty('--custom-text', textColor);

        // Apply to cards and content areas
        const contentAreas = document.querySelectorAll('.bg-white, .dark\\:bg-gray-800, .hospital-content');
        contentAreas.forEach(area => {
            if (!area.closest('.hospital-navbar') && !area.closest('.hospital-sidebar')) {
                area.style.backgroundColor = color;
                area.style.color = textColor;
            }
        });
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

    async resetTheme() {
        this.loading = true;

        try {
            const response = await fetch('/theme/reset', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Reset colors to default and apply immediately
                const defaultColors = {
                    navbar: ThemeConfig.DEFAULT_COLORS.navbar,
                    sidebar: ThemeConfig.DEFAULT_COLORS.sidebar,
                    background: ThemeConfig.DEFAULT_COLORS.background,
                    accent: ThemeConfig.DEFAULT_COLORS.accent
                };

                this.colors = { ...defaultColors };

                // Apply default colors immediately
                Object.entries(defaultColors).forEach(([type, color]) => {
                    const textColor = ColorUtils.getContrastingTextColor(color);
                    this.applyStyles(type, color, textColor);
                });

                // Remove custom styles
                this.removeCustomStyles();

                this.showToast('Tema resetado com sucesso!', 'success');
                window.hasCustomTheme = false;
                this.updateIsCustomActive();
                this.toggleLightDarkButton();

                // Close dropdown
                this.open = false;
            } else {
                throw new Error(data.message || 'Erro ao resetar tema');
            }
        } catch (error) {
            this.showToast('Erro ao resetar tema: ' + error.message, 'error');
        } finally {
            this.loading = false;
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

    removeCustomStyles() {
        const properties = [
            '--navbar-bg', '--navbar-text',
            '--sidebar-bg', '--sidebar-text',
            '--bg-color', '--text-color',
            '--accent-color', '--accent-text'
        ];

        properties.forEach(prop => {
            document.documentElement.style.removeProperty(prop);
        });

        document.querySelectorAll('*[style]').forEach(el => {
            el.removeAttribute('style');
        });

        console.log('Custom styles removed');
    }
};

// Hospital utilities for global access
window.hospitalUtils = {
    toggleTheme() {
        window.Hospital.theme.toggle();
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
            this.loading = true;
            window.Hospital.themeManager.resetTheme().finally(() => {
                this.loading = false;
            });
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

// Cleanup and global functions
window.addEventListener('beforeunload', () => {
    window.Hospital.charts.destroyAll();
    console.log('Resources cleaned');
});

window.toggleHospitalTheme = () => window.hospitalUtils.toggleTheme();

export { Alpine };
