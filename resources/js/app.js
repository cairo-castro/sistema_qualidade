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

        console.log(`🎨 updateColor called: ${type} = ${value}`);

        // Aplicar cor instantaneamente
        this.colors[type] = value;

        // Calcular cor de texto contrastante
        const textColor = ColorUtils.getContrastingTextColor(value);
        console.log(`🎨 Applying ${type}: ${value} with text: ${textColor}`);

        // Aplicar imediatamente
        this.applyStyles(type, value, textColor);
    },

    applyColorRealTime(type, color) {
        // Método mantido para compatibilidade, mas sem delay
        console.log(`🎯 applyColorRealTime: ${type} = ${color}`);
        const textColor = ColorUtils.getContrastingTextColor(color);
        console.log(`🎯 Calculated text color: ${textColor}`);
        this.applyStyles(type, color, textColor);
    },

    // Método principal de aplicação de presets (seguindo instruções: Clean Code - métodos pequenos e responsabilidade única)
    applyPreset(presetName) {
        console.log(`🎨 Applying preset: ${presetName}`);
        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) {
            this.showToast('Preset não encontrado: ' + presetName, 'error');
            return;
        }

        console.log(`🎨 Preset found:`, preset);

        // Atualizar cores internas
        this.colors.navbar = preset.navbar;
        this.colors.sidebar = preset.sidebar;
        this.colors.background = preset.background;
        this.colors.accent = preset.accent || preset.navbar;

        // Aplicar cada cor de forma sequencial e robusta
        this._applyPresetColors(preset);

        // Trigger business rules for custom theme activation
        if (typeof onCustomThemeActivated === 'function') {
            onCustomThemeActivated();
        }

        console.log(`✅ Preset ${presetName} applied successfully!`);
    },

    // Método responsável por aplicar todas as cores do preset (Clean Code: responsabilidade única)
    _applyPresetColors(preset) {
        // Aplicar navbar
        if (preset.navbar) {
            const navbarTextColor = ColorUtils.getContrastingTextColor(preset.navbar);
            this._applyNavbarColor(preset.navbar, navbarTextColor);
        }

        // Aplicar sidebar
        if (preset.sidebar) {
            const sidebarTextColor = ColorUtils.getContrastingTextColor(preset.sidebar);
            this._applySidebarColor(preset.sidebar, sidebarTextColor);
        }

        // Aplicar background
        if (preset.background) {
            const backgroundTextColor = ColorUtils.getContrastingTextColor(preset.background);
            this._applyBackgroundColor(preset.background, backgroundTextColor);
        }

        // Aplicar accent
        if (preset.accent) {
            const accentTextColor = ColorUtils.getContrastingTextColor(preset.accent);
            this._applyAccentColor(preset.accent, accentTextColor);
        }
    },

    // Método específico para aplicar cor da navbar (Clean Code: métodos pequenos)
    _applyNavbarColor(color, textColor) {
        console.log(`🎨 Applying navbar color: ${color} with text: ${textColor}`);

        // Aplicar às variáveis CSS
        document.documentElement.style.setProperty('--navbar-bg', color);
        document.documentElement.style.setProperty('--navbar-text', textColor);

        // Aplicar diretamente aos elementos navbar
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(navbar => {
            navbar.style.backgroundColor = color;
            navbar.style.color = textColor;

            // Aplicar aos filhos da navbar
            const children = navbar.querySelectorAll('*:not([x-data*="themeManager"])');
            children.forEach(child => {
                if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                    child.style.color = textColor;
                    child.style.setProperty('color', textColor, 'important');

                    // SVGs
                    if (child.tagName === 'SVG') {
                        child.style.fill = textColor;
                        child.style.stroke = textColor;
                    }
                }
            });
        });
    },

    // Método específico para aplicar cor da sidebar (Clean Code: métodos pequenos)
    _applySidebarColor(color, textColor) {
        console.log(`🎨 Applying sidebar color: ${color} with text: ${textColor}`);

        // Aplicar às variáveis CSS
        document.documentElement.style.setProperty('--sidebar-bg', color);
        document.documentElement.style.setProperty('--sidebar-text', textColor);

        // Buscar elementos sidebar de forma robusta
        const sidebarSelectors = [
            '.hospital-sidebar',
            '.sidebar',
            'aside',
            '[class*="sidebar"]'
        ];

        sidebarSelectors.forEach(selector => {
            const sidebars = document.querySelectorAll(selector);
            sidebars.forEach(sidebar => {
                // Verificar se não é theme manager
                if (!sidebar.closest('[x-data*="themeManager"]')) {
                    sidebar.style.backgroundColor = color;
                    sidebar.style.color = textColor;

                    // Aplicar aos filhos da sidebar
                    const children = sidebar.querySelectorAll('*');
                    children.forEach(child => {
                        if (!child.closest('[x-data*="themeManager"]') &&
                            !child.style.backgroundColor &&
                            !child.classList.contains('bg-')) {
                            child.style.color = textColor;

                            // SVGs
                            if (child.tagName === 'SVG') {
                                child.style.fill = textColor;
                                child.style.stroke = textColor;
                            }
                        }
                    });
                }
            });
        });
    },

    // Método específico para aplicar cor de background (Clean Code: métodos pequenos)
    _applyBackgroundColor(color, textColor) {
        console.log(`🎨 Applying background color: ${color} with text: ${textColor}`);

        // Aplicar às variáveis CSS
        document.documentElement.style.setProperty('--bg-color', color);
        document.documentElement.style.setProperty('--text-color', textColor);
        document.documentElement.style.setProperty('--content-bg', color);
        document.documentElement.style.setProperty('--content-text', textColor);

        // Buscar área de conteúdo principal
        const contentSelectors = [
            '.hospital-content',
            'main.hospital-main',
            'main',
            '.content-area',
            '.main-content'
        ];

        let contentArea = null;
        for (const selector of contentSelectors) {
            contentArea = document.querySelector(selector);
            if (contentArea) break;
        }

        // Se encontrou área de conteúdo, aplicar
        if (contentArea) {
            contentArea.style.backgroundColor = color;

            // Aplicar cor de texto aos elementos de texto dentro da área de conteúdo
            const textElements = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class*="bg-"]), a:not([class*="bg-"]), label');
            textElements.forEach(textEl => {
                if (!textEl.closest('.hospital-navbar') &&
                    !textEl.closest('.hospital-sidebar') &&
                    !textEl.style.backgroundColor &&
                    !textEl.classList.contains('bg-')) {
                    textEl.style.color = textColor;
                    textEl.style.setProperty('color', textColor, 'important');
                }
            });
        } else {
            // Fallback: aplicar ao body
            document.body.style.backgroundColor = color;
        }
    },

    // Método específico para aplicar cor de accent (Clean Code: métodos pequenos)
    _applyAccentColor(color, textColor) {
        console.log(`🎨 Applying accent color: ${color} with text: ${textColor}`);

        // Aplicar às variáveis CSS
        document.documentElement.style.setProperty('--accent-color', color);
        document.documentElement.style.setProperty('--accent-text', textColor);

        // Aplicar aos elementos accent
        const accentElements = document.querySelectorAll(
            '.btn-primary, .gqa-btn.primary, .text-blue-500, .bg-blue-500, ' +
            '.border-blue-500, [class*="blue-"], .btn-accent, .accent-color, .primary-button'
        );

        accentElements.forEach(element => {
            if (element.classList.contains('bg-blue-500') ||
                element.classList.contains('btn-primary') ||
                element.classList.contains('btn-accent') ||
                element.classList.contains('primary-button')) {
                element.style.backgroundColor = color;
                element.style.borderColor = color;
                element.style.color = textColor;
            } else if (element.classList.contains('text-blue-500') ||
                       element.classList.contains('accent-color')) {
                element.style.color = color;
            } else if (element.classList.contains('border-blue-500')) {
                element.style.borderColor = color;
            }
        });
    },

    applyStyles(type, color, textColor) {
        console.log(`🎯 applyStyles called: ${type} = ${color} (text: ${textColor})`);
        const root = document.documentElement;

        // Open/Closed Principle: Usar um mapa para evitar switch/case extenso
        const styleAppliers = {
            navbar: () => {
                console.log(`🏗️ EXEC: Applying navbar styles...`);
                this._applyNavbarStyles(color, textColor, root);
            },
            sidebar: () => {
                console.log(`🏗️ EXEC: Applying sidebar styles...`);
                this._applySidebarStyles(color, textColor, root);
            },
            background: () => {
                console.log(`🏗️ EXEC: Applying background styles...`);
                this._applyBackgroundStyles(color, textColor, root);
            },
            accent: () => {
                console.log(`🏗️ EXEC: Applying accent styles...`);
                this._applyAccentStyles(color, textColor, root);
            }
        };

        const applier = styleAppliers[type];
        if (applier) {
            console.log(`🏗️ Found applier for ${type}, executing...`);
            applier();
            console.log(`✅ Completed ${type} styles application`);
        } else {
            console.warn(`⚠️ Unknown style type: ${type}`);
            console.log(`🔍 Available types:`, Object.keys(styleAppliers));
        }

        // DRY: Centralizar a aplicação de contraste
        this._ensureTextContrast();
    },

    // SRP: Método responsável apenas por garantir contraste
    _ensureTextContrast() {
        const elementsWithBg = document.querySelectorAll(
            '.hospital-navbar[style*="background-color"], .hospital-sidebar[style*="background-color"], .hospital-content[style*="background-color"], main[style*="background-color"]'
        );

        elementsWithBg.forEach(element => {
            const bgColor = element.style.backgroundColor;
            if (bgColor) {
                const hexColor = this._rgbToHex(bgColor) || bgColor;
                if (ColorUtils.isValidHexColor(hexColor)) {
                    const contrastColor = ColorUtils.getContrastingTextColor(hexColor);
                    this._applyContrastToElement(element, contrastColor);
                }
            }
        });
    },

    // SRP: Método responsável apenas por aplicar contraste a um elemento
    _applyContrastToElement(element, contrastColor) {
        if (!element.classList.toString().includes('dark:')) {
            element.style.color = contrastColor;

            const children = element.querySelectorAll(':scope > span, :scope > a, :scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > div:not([class*="bg-"]):not([style*="background"])');
            children.forEach(child => {
                if (!child.style.backgroundColor &&
                    !child.classList.contains('bg-') &&
                    !this._classNameIncludes(child, 'dark:')) {
                    child.style.color = contrastColor;
                }
            });
        }
    },

    // DRY: Função auxiliar reutilizável para converter RGB para HEX
    _rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return null;

        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return null;

        const [, r, g, b] = match;
        return '#' + [r, g, b].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },

    // SRP: Método principal responsável apenas por coordenar a aplicação de estilos da navbar
    _applyNavbarStyles(color, textColor, root) {
        this._setCSSVariables(root, 'navbar', color, textColor);
        this._applyNavbarElementStyles(color, textColor);
        this._applyNavbarComprehensiveStyles(color, textColor);
        console.log(`✅ Navbar styles applied: ${color} with text: ${textColor}`);
    },

    // SRP: Método responsável apenas por definir variáveis CSS
    _setCSSVariables(root, type, color, textColor) {
        root.style.setProperty(`--${type}-bg`, color);
        root.style.setProperty(`--${type}-text`, textColor);
    },

    // SRP: Método responsável apenas por aplicar estilos aos elementos da navbar
    _applyNavbarElementStyles(color, textColor) {
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(nav => {
            this._styleNavbarContainer(nav, color, textColor);
            this._styleNavbarDescendants(nav, textColor);
            this._styleNavbarDropdowns(nav, color, textColor);
            this._styleNavbarBadges(nav, color, textColor);
            this._styleNavbarButtons(nav, textColor);
            this._styleNavbarLinks(nav, textColor);
        });
    },

    // SRP: Método responsável apenas por estilizar o container da navbar
    _styleNavbarContainer(nav, color, textColor) {
        nav.style.backgroundColor = color;
        nav.style.color = textColor;
    },

    // SRP: Método responsável apenas por estilizar descendentes da navbar
    _styleNavbarDescendants(nav, textColor) {
        const allNavbarElements = nav.querySelectorAll('*');
        allNavbarElements.forEach(element => {
            if (this._shouldApplyNavbarStyle(element)) {
                this._applyElementTextStyle(element, textColor);
                this._styleSVGElements(element, textColor);
                this._styleQuickStatElements(element, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por verificar se deve aplicar estilo
    _shouldApplyNavbarStyle(element) {
        const hasOwnBackground = element.style.backgroundColor ||
                               element.classList.contains('bg-') ||
                               this._classNameIncludes(element, 'dark:bg-');

        const isThemeButton = element.closest('[x-data*="themeManager"]') ||
                            element.hasAttribute('x-data') ||
                            element.classList.contains('theme-manager');

        return !hasOwnBackground && !isThemeButton;
    },

    // DRY: Método reutilizável para aplicar estilo de texto
    _applyElementTextStyle(element, textColor) {
        element.style.color = textColor;
        element.style.setProperty('color', textColor, 'important');
    },

    // DRY: Método reutilizável para estilizar SVGs
    _styleSVGElements(element, textColor) {
        if (element.tagName === 'SVG') {
            element.style.fill = textColor;
            element.style.stroke = textColor;
        }
    },

    // DRY: Método reutilizável para estilizar elementos de estatísticas rápidas
    _styleQuickStatElements(element, textColor) {
        if (element.classList.contains('quick-stat-badge') ||
            element.classList.contains('stat-value') ||
            element.classList.contains('stat-label') ||
            element.closest('.quick-stat-badge')) {
            this._applyElementTextStyle(element, textColor);
        }
    },

    // SRP: Método responsável apenas por estilizar dropdowns da navbar
    _styleNavbarDropdowns(nav, color, textColor) {
        const dropdowns = nav.querySelectorAll('[x-show], .dropdown, .dropdown-menu, [class*="dropdown"]');
        dropdowns.forEach(dropdown => {
            if (!dropdown.closest('[x-data*="themeManager"]')) {
                this._styleDropdownContainer(dropdown, color, textColor);
                this._styleDropdownItems(dropdown, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por estilizar container de dropdown
    _styleDropdownContainer(dropdown, color, textColor) {
        if (!dropdown.style.backgroundColor && !dropdown.classList.contains('bg-')) {
            dropdown.style.backgroundColor = color;
            dropdown.style.color = textColor;
        }
    },

    // SRP: Método responsável apenas por estilizar itens de dropdown
    _styleDropdownItems(dropdown, textColor) {
        const dropdownItems = dropdown.querySelectorAll('*');
        dropdownItems.forEach(item => {
            if (!item.style.backgroundColor &&
                !item.classList.contains('bg-') &&
                !this._classNameIncludes(item, 'dark:')) {
                this._applyElementTextStyle(item, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por estilizar badges da navbar
    _styleNavbarBadges(nav, color, textColor) {
        const quickStatBadges = nav.querySelectorAll('.quick-stat-badge, [class*="stat-"], .badge, .notification-badge');
        quickStatBadges.forEach(badge => {
            this._styleBadgeContainer(badge, color, textColor);
            this._styleBadgeChildren(badge, textColor);
        });
    },

    // SRP: Método responsável apenas por estilizar container de badge
    _styleBadgeContainer(badge, color, textColor) {
        if (!badge.classList.contains('bg-') && !badge.style.backgroundColor) {
            badge.style.backgroundColor = color;
            badge.style.borderColor = textColor;
        }
        this._applyElementTextStyle(badge, textColor);
    },

    // SRP: Método responsável apenas por estilizar filhos de badge
    _styleBadgeChildren(badge, textColor) {
        const badgeChildren = badge.querySelectorAll('*');
        badgeChildren.forEach(child => {
            if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por estilizar botões da navbar
    _styleNavbarButtons(nav, textColor) {
        const navbarButtons = nav.querySelectorAll('button:not([class*="theme"]):not([x-data])');
        navbarButtons.forEach(button => {
            if (!button.style.backgroundColor && !button.classList.contains('bg-')) {
                this._styleButtonContainer(button, textColor);
                this._styleButtonChildren(button, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por estilizar container de botão
    _styleButtonContainer(button, textColor) {
        button.style.color = textColor;
        button.style.borderColor = textColor;
        button.style.setProperty('color', textColor, 'important');
    },

    // SRP: Método responsável apenas por estilizar filhos de botão
    _styleButtonChildren(button, textColor) {
        const buttonChildren = button.querySelectorAll('*');
        buttonChildren.forEach(child => {
            if (child.tagName === 'SVG') {
                this._styleSVGElements(child, textColor);
            } else {
                this._applyElementTextStyle(child, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por estilizar links da navbar
    _styleNavbarLinks(nav, textColor) {
        const navbarLinks = nav.querySelectorAll('a');
        navbarLinks.forEach(link => {
            if (!link.style.backgroundColor && !link.classList.contains('bg-')) {
                this._applyElementTextStyle(link, textColor);
                this._styleLinkChildren(link, textColor);
            }
        });
    },

    // SRP: Método responsável apenas por estilizar filhos de link
    _styleLinkChildren(link, textColor) {
        const linkChildren = link.querySelectorAll('*');
        linkChildren.forEach(child => {
            if (!child.style.backgroundColor) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    },

    // SRP: Método responsável por aplicação abrangente de cores na navbar
    _applyNavbarComprehensiveStyles(color, textColor) {
        console.log(`🎨 Applying comprehensive navbar colors - BG: ${color}, Text: ${textColor}`);

        this._applyStylesToNavbarElements(color, textColor);
        this._applyStylesToSpecificNavbarSelectors(color, textColor);

        console.log(`✅ Comprehensive navbar colors applied: ${textColor} for background: ${color}`);
    },

    // SRP: Método responsável por aplicar estilos a todos os elementos da navbar
    _applyStylesToNavbarElements(color, textColor) {
        const navbarElements = document.querySelectorAll(
            '.hospital-navbar, .hospital-navbar *, nav.hospital-navbar, nav.hospital-navbar *'
        );

        navbarElements.forEach(element => {
            if (this._shouldApplyComprehensiveNavbarStyle(element)) {
                this._applyComprehensiveElementStyle(element, color, textColor);
            }
        });
    },

    // SRP: Método responsável por verificar se deve aplicar estilo abrangente
    _shouldApplyComprehensiveNavbarStyle(element) {
        const isInNavbar = element.closest('.hospital-navbar, nav.hospital-navbar');
        const isThemeManager = element.closest('[x-data*="themeManager"]') ||
                              element.hasAttribute('x-data') ||
                              element.classList.contains('theme-manager');
        const hasOwnBg = element.style.backgroundColor ||
                       element.classList.contains('bg-') ||
                       this._classNameIncludes(element, 'dark:bg-');

        return isInNavbar && !isThemeManager && !hasOwnBg;
    },

    // SRP: Método responsável por aplicar estilo abrangente a um elemento
    _applyComprehensiveElementStyle(element, color, textColor) {
        this._applyElementTextStyle(element, textColor);
        this._styleSVGElements(element, textColor);
        this._handleSpecialNavbarElements(element, color, textColor);
        this._handleDropdownElements(element, color, textColor);
        this._handleButtonElements(element, textColor);
        this._handleLinkElements(element, textColor);
    },

    // SRP: Método responsável por lidar com elementos especiais da navbar
    _handleSpecialNavbarElements(element, color, textColor) {
        if (element.classList.contains('quick-stat-badge') ||
            element.classList.contains('stat-value') ||
            element.classList.contains('stat-label') ||
            element.closest('.quick-stat-badge')) {

            if (element.classList.contains('quick-stat-badge')) {
                element.style.backgroundColor = color;
                element.style.borderColor = textColor;
            }
            this._applyElementTextStyle(element, textColor);
        }
    },

    // SRP: Método responsável por lidar com elementos de dropdown
    _handleDropdownElements(element, color, textColor) {
        if (element.classList.contains('dropdown') ||
            element.classList.contains('dropdown-menu') ||
            element.hasAttribute('x-show') ||
            element.closest('.dropdown, .dropdown-menu, [x-show]')) {

            this._applyElementTextStyle(element, textColor);

            if (element.classList.contains('dropdown-menu') ||
                element.hasAttribute('x-show')) {
                element.style.backgroundColor = color;
            }
        }
    },

    // SRP: Método responsável por lidar com elementos de botão
    _handleButtonElements(element, textColor) {
        if (element.tagName === 'BUTTON') {
            const isThemeManager = element.closest('[x-data*="themeManager"]') ||
                                  element.hasAttribute('x-data') ||
                                  element.classList.contains('theme-manager');

            if (!isThemeManager) {
                element.style.color = textColor;
                element.style.borderColor = textColor;
                element.style.setProperty('color', textColor, 'important');
            }
        }
    },

    // SRP: Método responsável por lidar com elementos de link
    _handleLinkElements(element, textColor) {
        if (element.tagName === 'A') {
            this._applyElementTextStyle(element, textColor);
        }
    },

    // SRP: Método responsável por aplicar estilos a seletores específicos da navbar
    _applyStylesToSpecificNavbarSelectors(color, textColor) {
        const specificSelectors = this._getSpecificNavbarSelectors();

        specificSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this._applyStyleToSpecificElement(element, color, textColor);
            });
        });
    },

    // DRY: Método para obter seletores específicos (evita repetir a lista)
    _getSpecificNavbarSelectors() {
        const baseSelectors = [
            '.quick-stat-badge', '.stat-value', '.stat-label',
            '.badge', '.notification-badge', '[x-show]',
            '.dropdown', '.dropdown-menu'
        ];

        const navbarPrefixes = ['.hospital-navbar ', 'nav.hospital-navbar '];

        return navbarPrefixes.flatMap(prefix =>
            baseSelectors.map(selector => prefix + selector)
        );
    },

    // SRP: Método responsável por aplicar estilo a elemento específico
    _applyStyleToSpecificElement(element, color, textColor) {
        const isThemeManager = element.closest('[x-data*="themeManager"]');
        if (!isThemeManager) {
            this._applyElementTextStyle(element, textColor);
            this._applyBackgroundToSpecialElements(element, color);
            this._applyStylesToElementChildren(element, textColor);
        }
    },

    // SRP: Método responsável por aplicar background a elementos especiais
    _applyBackgroundToSpecialElements(element, color) {
        if (element.classList.contains('dropdown-menu') ||
            element.classList.contains('quick-stat-badge') ||
            element.hasAttribute('x-show')) {
            element.style.backgroundColor = color;
        }
    },

    // SRP: Método responsável por aplicar estilos aos filhos de elementos
    _applyStylesToElementChildren(element, textColor) {
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            if (!child.style.backgroundColor &&
                !child.classList.contains('bg-') &&
                !child.closest('[x-data*="themeManager"]')) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    },

    // SRP: Método principal responsável por aplicar estilos da sidebar
    _applySidebarStyles(color, textColor, root) {
        this._setCSSVariables(root, 'sidebar', color, textColor);
        this._applySidebarElementStyles(color, textColor);
        this._applySidebarScrollbarStyles(color, textColor, root);
        console.log(`✅ Sidebar styles applied: ${color} with text: ${textColor}`);
    },    // SRP: Método responsável por aplicar estilos aos elementos da sidebar
    _applySidebarElementStyles(color, textColor) {
        // BUGFIX: Seletores mais abrangentes para encontrar a sidebar
        const sidebarSelectors = this._getSidebarSelectors();
        console.log(`🔍 DEBUG: Using sidebar selectors: ${sidebarSelectors}`);

        const sidebars = document.querySelectorAll(sidebarSelectors);
        console.log(`🔍 Found ${sidebars.length} sidebar elements`);

        // Log dos elementos encontrados para debug
        sidebars.forEach((sidebar, index) => {
            console.log(`🔍 Sidebar ${index + 1}: ${sidebar.className || sidebar.tagName}`);
        });

        sidebars.forEach(sidebar => {
            console.log(`🎨 Styling sidebar: ${sidebar.className || sidebar.tagName}`);
            this._styleSidebarContainer(sidebar, color, textColor);
            this._styleSidebarChildren(sidebar, textColor);
        });

        // BUGFIX: Estratégia adicional mais agressiva para garantir que a sidebar seja encontrada
        this._forceApplyToSidebarElements(color, textColor);
    },

    // BUGFIX: Método adicional para forçar aplicação na sidebar quando seletores normais falham
    _forceApplyToSidebarElements(color, textColor) {
        console.log(`🔧 FORCE: Applying sidebar colors to any element containing 'sidebar' class`);

        // Buscar TODOS os elementos da página e verificar se contêm 'sidebar' na classe
        const allElements = document.querySelectorAll('*');
        let foundSidebarElements = 0;

        allElements.forEach(element => {
            const className = this._getElementClassName(element);
            const id = element.id || '';

            // Verificar se contém 'sidebar' no nome da classe ou ID
            if (className.includes('sidebar') || id.includes('sidebar')) {
                console.log(`🔧 FORCE: Found sidebar element: ${element.tagName}.${className}#${id}`);
                foundSidebarElements++;

                // Aplicar estilo se não é o theme manager
                if (!element.closest('[x-data*="themeManager"]')) {
                    element.style.backgroundColor = color;
                    element.style.color = textColor;

                    // Aplicar aos filhos também
                    const children = element.querySelectorAll('*');
                    children.forEach(child => {
                        if (!child.closest('[x-data*="themeManager"]') &&
                            !child.style.backgroundColor &&
                            !child.classList.contains('bg-')) {
                            child.style.color = textColor;

                            // Para SVGs
                            if (child.tagName === 'SVG') {
                                child.style.fill = textColor;
                                child.style.stroke = textColor;
                            }
                        }
                    });
                }
            }
        });

        console.log(`🔧 FORCE: Applied to ${foundSidebarElements} sidebar elements`);
    },

    // DRY: Método para obter todos os seletores possíveis da sidebar
    _getSidebarSelectors() {
        return [
            '.hospital-sidebar',     // Seletor principal
            '.sidebar',              // Seletor genérico
            '[class*="sidebar"]',    // Qualquer classe que contenha "sidebar"
            'aside',                 // Tag aside (semântica para sidebar)
            'nav[role="navigation"]', // Nav com role de navegação
            '.nav-sidebar',          // Outras variações comuns
            '.side-nav',
            '.side-navigation',
            '.main-sidebar',
            '#sidebar'               // ID sidebar
        ].join(', ');
    },

    // SRP: Método responsável por estilizar container da sidebar
    _styleSidebarContainer(sidebar, color, textColor) {
        sidebar.style.backgroundColor = color;
        sidebar.style.color = textColor;
        console.log(`✅ Sidebar container styled: ${color}`);
    },

    // SRP: Método responsável por estilizar filhos da sidebar
    _styleSidebarChildren(sidebar, textColor) {
        const sidebarChildren = sidebar.querySelectorAll('a, span, div, p, h1, h2, h3, h4, h5, h6, svg, i, li, ul, ol, button');
        console.log(`🔍 Found ${sidebarChildren.length} sidebar children`);

        sidebarChildren.forEach(child => {
            if (this._shouldApplySidebarStyle(child)) {
                this._applySidebarChildStyle(child, textColor);
            }
        });
    },

    // SRP: Método responsável por verificar se deve aplicar estilo da sidebar
    _shouldApplySidebarStyle(child) {
        return !child.style.backgroundColor &&
               !child.classList.contains('bg-') &&
               !child.closest('[x-data*="themeManager"]'); // Evitar theme manager
    },

    // SRP: Método responsável por aplicar estilo a filho da sidebar
    _applySidebarChildStyle(child, textColor) {
        child.style.color = textColor;
        this._styleSVGElements(child, textColor);

        // Para links específicos, adicionar hover states
        if (child.tagName === 'A') {
            child.style.setProperty('color', textColor, 'important');
        }
    },

    // SRP: Método para aplicar estilos a elementos adicionais que podem ser sidebar
    _applyToAdditionalSidebarElements(color, textColor) {
        // Buscar por qualquer elemento que possa ser uma sidebar baseado em posicionamento
        const potentialSidebars = document.querySelectorAll('*');

        potentialSidebars.forEach(element => {
            if (this._isPotentialSidebar(element)) {
                console.log(`🔍 Found potential sidebar: ${element.className || element.tagName}`);
                this._styleSidebarContainer(element, color, textColor);
                this._styleSidebarChildren(element, textColor);
            }
        });
    },

    // SRP: Método para identificar elementos que podem ser sidebar
    _isPotentialSidebar(element) {
        const className = this._getElementClassName(element);
        const id = element.id || '';

        // Verificar por palavras-chave relacionadas a sidebar
        const sidebarKeywords = ['sidebar', 'side-nav', 'navigation', 'nav-menu', 'menu-lateral'];

        const hasKeyword = sidebarKeywords.some(keyword =>
            className.toLowerCase().includes(keyword) ||
            id.toLowerCase().includes(keyword)
        );

        // Verificar se é um aside que não é theme manager
        const isAsideElement = element.tagName === 'ASIDE' &&
                              !element.closest('[x-data*="themeManager"]');

        // Verificar se tem posicionamento typical de sidebar
        const styles = window.getComputedStyle(element);
        const isFixedOrAbsolute = styles.position === 'fixed' || styles.position === 'absolute';
        const isOnSide = (parseFloat(styles.left) === 0 || parseFloat(styles.right) === 0) &&
                        parseFloat(styles.width) < window.innerWidth / 2; // Menos da metade da largura da tela

        return (hasKeyword || isAsideElement || (isFixedOrAbsolute && isOnSide)) &&
               !element.closest('.hospital-navbar') && // Não é navbar
               !element.closest('[x-data*="themeManager"]'); // Não é theme manager
    },    // SRP: Método principal responsável por aplicar estilos de background
    _applyBackgroundStyles(color, textColor, root) {
        this._setCSSVariables(root, 'bg', color, textColor);
        this._setCSSVariables(root, 'text', color, textColor); // Para compatibilidade

        const mainContentArea = this._findMainContentArea();

        if (mainContentArea) {
            this._applyBackgroundToContentArea(mainContentArea, color, textColor);
        }

        // BUGFIX: Estratégia adicional para garantir que o background seja aplicado
        this._forceApplyBackgroundStyles(color, textColor);

        this._applyHeaderAndBreadcrumbColors(color, textColor);
        this._applyToAllPageHeadings(textColor);
        this._setContentCSSVariables(root, color, textColor);
        this._applyContentScrollbarStyles(color, textColor, root);

        console.log(`✅ Background styles applied to content area: ${color} with text: ${textColor}`);
    },

    // BUGFIX: Método para forçar aplicação de background quando método normal falha
    _forceApplyBackgroundStyles(color, textColor) {
        console.log(`🔧 FORCE: Applying background styles to main content areas`);

        // Aplicar background ao body se não tem cor customizada
        if (!document.body.style.backgroundColor) {
            document.body.style.backgroundColor = color;
            console.log(`🔧 FORCE: Applied background to body`);
        }

        // Procurar por áreas que possam ser o conteúdo principal
        const potentialContentSelectors = [
            'main', '.container', '.content', '.page', '.app',
            '[class*="content"]', '[class*="main"]', '[id*="content"]', '[id*="main"]'
        ];

        potentialContentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Verificar se não é navbar/sidebar e não tem background próprio
                if (!element.closest('.hospital-navbar') &&
                    !element.closest('.hospital-sidebar') &&
                    !element.closest('[x-data*="themeManager"]') &&
                    !element.style.backgroundColor &&
                    !element.classList.contains('bg-')) {

                    element.style.backgroundColor = color;
                    console.log(`🔧 FORCE: Applied background to ${element.tagName}.${element.className}`);

                    // Aplicar cor de texto aos elementos filhos
                    const textElements = element.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div:not([class*="bg-"]), a:not([class*="bg-"])');
                    textElements.forEach(textEl => {
                        if (!textEl.closest('.hospital-navbar') &&
                            !textEl.closest('.hospital-sidebar') &&
                            !textEl.style.backgroundColor &&
                            !textEl.classList.contains('bg-')) {
                            textEl.style.color = textColor;
                            textEl.style.setProperty('color', textColor, 'important');
                        }
                    });
                }
            });
        });
    },

    // SRP: Método responsável por encontrar a área principal de conteúdo
    _findMainContentArea() {
        const targetSelectors = [
            '.hospital-content',    // Área principal de conteúdo
            'main',                 // Tag main
            '.content-area',        // Área de conteúdo específica
            '.main-content',        // Conteúdo principal
            '.page-content',        // Conteúdo da página
            '.app-content',         // Conteúdo da aplicação
            '#content',             // ID content
            '[role="main"]'         // Role main
        ];

        for (const selector of targetSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`🎯 Found main content area: ${selector}`);
                return element;
            }
        }

        // BUGFIX: Se não encontrar área específica, buscar por estrutura típica de layout
        console.log(`🔍 DEBUG: Searching for typical layout structure...`);

        // Buscar por elementos que possam ser a área de conteúdo principal
        const potentialContentAreas = document.querySelectorAll('div, section, article');

        for (const element of potentialContentAreas) {
            const className = element.className || '';
            const id = element.id || '';

            // Verificar se não é navbar/sidebar e se tem características de área de conteúdo
            if (!className.includes('navbar') &&
                !className.includes('sidebar') &&
                !element.closest('.hospital-navbar') &&
                !element.closest('.hospital-sidebar') &&
                !element.closest('[x-data*="themeManager"]')) {

                // Se tem palavras-chave relacionadas a conteúdo
                if (className.includes('content') ||
                    className.includes('main') ||
                    className.includes('page') ||
                    id.includes('content') ||
                    id.includes('main')) {
                    console.log(`🎯 Found content area by keyword: ${element.tagName}.${className}#${id}`);
                    return element;
                }
            }
        }

        console.warn('⚠️ No specific content area found, using body as fallback');
        return document.body;
    },

    // SRP: Método responsável por aplicar background à área de conteúdo
    _applyBackgroundToContentArea(mainContentArea, color, textColor) {
        mainContentArea.style.backgroundColor = color;
        this._applyBackgroundToDirectChildren(mainContentArea, textColor);
    },

    // SRP: Método responsável por aplicar estilos aos filhos diretos da área de conteúdo
    _applyBackgroundToDirectChildren(mainContentArea, textColor) {
        const directChildren = mainContentArea.querySelectorAll(':scope > *');
        directChildren.forEach(child => {
            if (this._shouldApplyBackgroundStyle(child)) {
                child.style.color = textColor;
                this._applyToTextElements(child, textColor);
            }
        });
    },

    // SRP: Método responsável por verificar se deve aplicar estilo de background
    _shouldApplyBackgroundStyle(child) {
        return !child.style.backgroundColor &&
               !child.classList.contains('bg-') &&
               !child.classList.contains('hospital-navbar') &&
               !child.classList.contains('hospital-sidebar') &&
               !child.closest('.hospital-navbar') &&
               !child.closest('.hospital-sidebar') &&
               !this._classNameIncludes(child, 'dark:');
    },

    // SRP: Método responsável por aplicar estilos a elementos de texto
    _applyToTextElements(element, textColor) {
        const textElements = element.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div:not([class*="bg-"]):not([style*="background"]), a:not([class*="bg-"])');
        textElements.forEach(textEl => {
            if (this._shouldApplyTextStyle(textEl)) {
                textEl.style.color = textColor;
                textEl.style.setProperty('color', textColor, 'important');
            }
        });
    },

    // SRP: Método responsável por verificar se deve aplicar estilo de texto
    _shouldApplyTextStyle(textEl) {
        return !textEl.style.backgroundColor &&
               !textEl.classList.contains('bg-') &&
               !this._classNameIncludes(textEl, 'dark:') &&
               !textEl.closest('.hospital-navbar') &&
               !textEl.closest('.hospital-sidebar');
    },

    // SRP: Método responsável por aplicar estilos a todos os headings da página
    _applyToAllPageHeadings(textColor) {
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        allHeadings.forEach(heading => {
            if (this._shouldApplyHeadingStyle(heading)) {
                heading.style.color = textColor;
                heading.style.setProperty('color', textColor, 'important');
            }
        });
    },

    // SRP: Método responsável por verificar se deve aplicar estilo de heading
    _shouldApplyHeadingStyle(heading) {
        return !heading.closest('.hospital-navbar') &&
               !heading.closest('.hospital-sidebar') &&
               !heading.style.backgroundColor &&
               !heading.classList.contains('bg-');
    },

    // SRP: Método responsável por definir variáveis CSS de conteúdo
    _setContentCSSVariables(root, color, textColor) {
        root.style.setProperty('--content-bg', color);
        root.style.setProperty('--content-text', textColor);
    },

    // SRP: Método principal responsável por aplicar estilos de accent
    _applyAccentStyles(color, textColor, root) {
        console.log(`🎨 _applyAccentStyles called: ${color} / ${textColor}`);

        this._setCSSVariables(root, 'accent-color', color, textColor);
        this._setCSSVariables(root, 'accent-text', color, textColor);
        this._applyAccentToElements(color, textColor);

        console.log(`✅ Accent styles applied: ${color} with text: ${textColor}`);
    },

    // SRP: Método responsável por aplicar accent a elementos específicos
    _applyAccentToElements(color, textColor) {
        const accentElements = this._getAccentElements();

        accentElements.forEach(element => {
            this._applyAccentStyleToElement(element, color, textColor);
        });
    },

    // DRY: Método para obter elementos que devem receber accent
    _getAccentElements() {
        const accentSelectors = [
            '.btn-primary', '.gqa-btn.primary',
            '.text-blue-500', '.bg-blue-500',
            '.border-blue-500', '.focus\\:ring-blue-500',
            '[class*="blue-"]', '.btn-accent',
            '.accent-color', '.primary-button',
            'button.primary', '.link-primary'
        ];

        return document.querySelectorAll(accentSelectors.join(', '));
    },

    // SRP: Método responsável por aplicar estilo de accent a um elemento específico
    _applyAccentStyleToElement(element, color, textColor) {
        if (this._isBackgroundAccentElement(element)) {
            element.style.backgroundColor = color;
            element.style.borderColor = color;
            element.style.color = textColor;
        } else if (this._isTextAccentElement(element)) {
            element.style.color = color;
        } else if (this._isBorderAccentElement(element)) {
            element.style.borderColor = color;
        }
    },

    // SRP: Método responsável por verificar se elemento deve ter background accent
    _isBackgroundAccentElement(element) {
        return element.classList.contains('bg-blue-500') ||
               element.classList.contains('btn-primary') ||
               element.classList.contains('btn-accent') ||
               element.classList.contains('primary-button');
    },

    // SRP: Método responsável por verificar se elemento deve ter texto accent
    _isTextAccentElement(element) {
        return element.classList.contains('text-blue-500') ||
               element.classList.contains('link-primary') ||
               element.classList.contains('accent-color');
    },

    // SRP: Método responsável por verificar se elemento deve ter borda accent
    _isBorderAccentElement(element) {
        return element.classList.contains('border-blue-500');
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
            this._performThemeReset();
            this._updateThemeStates();
            
            // Trigger business rules for theme reset to default
            if (typeof onThemeResetToDefault === 'function') {
                onThemeResetToDefault();
            }
            
            console.log(`✅ Theme reset completed successfully`);
        } catch (error) {
            console.error('❌ Error during theme reset:', error);
            this._handleResetError();
        }
    },

    // SRP: Método responsável por executar o reset do tema
    _performThemeReset() {
        const isDarkMode = this._detectDarkMode();
        const defaultColors = this._getDefaultColors(isDarkMode);

        this._resetColorsObject(defaultColors);
        this._removeCustomCSSProperties();
        this._removeCustomInlineStyles();
    },

    // SRP: Método responsável por detectar modo dark
    _detectDarkMode() {
        const isDarkMode = document.documentElement.classList.contains('dark');
        console.log('🌙 Dark mode active:', isDarkMode);
        return isDarkMode;
    },

    // SRP: Método responsável por obter cores padrão baseadas no modo
    _getDefaultColors(isDarkMode) {
        return isDarkMode ? {
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
    },

    // SRP: Método responsável por resetar o objeto de cores
    _resetColorsObject(defaultColors) {
        this.colors = { ...defaultColors };
    },

    // SRP: Método responsável por remover propriedades CSS customizadas
    _removeCustomCSSProperties() {
        const root = document.documentElement;
        const customProperties = [
            '--navbar-bg', '--navbar-text',
            '--sidebar-bg', '--sidebar-text',
            '--bg-color', '--text-color',
            '--accent-color', '--accent-text',
            '--content-bg', '--content-text'
        ];

        customProperties.forEach(prop => {
            root.style.removeProperty(prop);
        });
    },

    // SRP: Método responsável por remover estilos inline customizados
    _removeCustomInlineStyles() {
        this._removeThemeElementStyles();
        this._removeThemeChildrenStyles();
    },

    // SRP: Método responsável por remover estilos de elementos principais do tema
    _removeThemeElementStyles() {
        const elementsWithCustomTheme = document.querySelectorAll(
            '.hospital-navbar[style], .hospital-sidebar[style], .hospital-content[style], [style*="background-color: rgb"]'
        );

        elementsWithCustomTheme.forEach(el => {
            this._removeElementThemeProperties(el);
        });
    },

    // SRP: Método responsável por remover propriedades de tema de um elemento
    _removeElementThemeProperties(element) {
        element.style.removeProperty('background-color');
        element.style.removeProperty('color');
        element.style.removeProperty('border-color');
    },

    // SRP: Método responsável por remover estilos de filhos de elementos do tema
    _removeThemeChildrenStyles() {
        const themeChildren = document.querySelectorAll(
            '.hospital-navbar *, .hospital-sidebar *, .hospital-content *'
        );

        themeChildren.forEach(child => {
            if (this._hasCustomThemeColor(child)) {
                this._removeChildThemeProperties(child);
            }
        });
    },

    // SRP: Método responsável por verificar se elemento tem cor customizada
    _hasCustomThemeColor(child) {
        return child.style.color && (
            child.style.color.includes('rgb') ||
            child.style.color.startsWith('#')
        );
    },

    // SRP: Método responsável por remover propriedades de tema de filho
    _removeChildThemeProperties(child) {
        child.style.removeProperty('color');
        child.style.removeProperty('background-color');
        child.style.removeProperty('fill');
        child.style.removeProperty('stroke');
    },

    // SRP: Método responsável por atualizar estados do tema
    _updateThemeStates() {
        window.hasCustomTheme = false;
        this.updateIsCustomActive();
        this.toggleLightDarkButton();
        this.open = false;
    },

    // SRP: Método responsável por lidar com erro no reset
    _handleResetError() {
        // Em caso de erro, pelo menos tenta resetar o estado
        window.hasCustomTheme = false;
        this.open = false;
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

    // SRP: Método responsável por aplicar cores aos headers e breadcrumbs
    _applyHeaderAndBreadcrumbColors(backgroundColor, textColor) {
        console.log(`🎨 Applying header/breadcrumb colors - BG: ${backgroundColor}, Text: ${textColor}`);

        this._applyToPageHeaders(textColor);
        this._applyToBreadcrumbs(textColor);
        this._applyToAllHeadingsInContent(textColor);

        console.log(`✅ Header and breadcrumb colors applied: ${textColor} for background: ${backgroundColor}`);
    },

    // SRP: Método responsável por aplicar estilos aos headers da página
    _applyToPageHeaders(textColor) {
        const headerSelectors = this._getHeaderSelectors();

        headerSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this._shouldApplyHeaderStyle(element)) {
                    this._applyHeaderElementStyle(element, textColor);
                }
            });
        });
    },

    // DRY: Método para obter seletores de headers
    _getHeaderSelectors() {
        return [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            '.page-header', '.page-title', '.content-header',
            '.header-title', '.main-header', '.page-heading',
            '[class*="header"]', '[class*="title"]'
        ];
    },

    // SRP: Método responsável por verificar se deve aplicar estilo de header
    _shouldApplyHeaderStyle(element) {
        const isInMainContent = element.closest('.hospital-content, main, .content-area, .main-content, body');
        const isNotInNavbar = !element.closest('.hospital-navbar, nav.hospital-navbar');
        const isNotInSidebar = !element.closest('.hospital-sidebar, .sidebar, aside');
        const hasNoOwnBackground = !element.style.backgroundColor && !element.classList.contains('bg-');
        const isNotDarkMode = !this._classNameIncludes(element, 'dark:');

        return isInMainContent && isNotInNavbar && isNotInSidebar && hasNoOwnBackground && isNotDarkMode;
    },

    // SRP: Método responsável por aplicar estilo a um elemento de header
    _applyHeaderElementStyle(element, textColor) {
        this._applyElementTextStyle(element, textColor);

        if (element.tagName.match(/^H[1-6]$/)) {
            this._applyToHeaderChildren(element, textColor);
        }

        console.log(`✅ Applied header color to: ${element.tagName}.${element.className || 'no-class'}`);
    },

    // SRP: Método responsável por aplicar estilos aos filhos de headers
    _applyToHeaderChildren(element, textColor) {
        const childTexts = element.querySelectorAll('span, a, em, strong, i, b');
        childTexts.forEach(child => {
            if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    },

    // SRP: Método responsável por aplicar estilos aos breadcrumbs
    _applyToBreadcrumbs(textColor) {
        const breadcrumbSelectors = this._getBreadcrumbSelectors();

        breadcrumbSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this._shouldApplyBreadcrumbStyle(element)) {
                    this._applyBreadcrumbElementStyle(element, textColor);
                }
            });
        });
    },

    // DRY: Método para obter seletores de breadcrumbs
    _getBreadcrumbSelectors() {
        return [
            '.breadcrumb', '.breadcrumbs', 'nav[aria-label="breadcrumb"]',
            '.page-breadcrumb', '[class*="breadcrumb"]',
            'ol.breadcrumb', 'ul.breadcrumb', '.breadcrumb-nav'
        ];
    },

    // SRP: Método responsável por verificar se deve aplicar estilo de breadcrumb
    _shouldApplyBreadcrumbStyle(element) {
        const isInMainContent = element.closest('.hospital-content, main, .content-area, .main-content, body');
        const isNotInNavbar = !element.closest('.hospital-navbar, nav.hospital-navbar');
        const isNotInSidebar = !element.closest('.hospital-sidebar, .sidebar, aside');
        const hasNoOwnBackground = !element.style.backgroundColor && !element.classList.contains('bg-');
        const isNotDarkMode = !this._classNameIncludes(element, 'dark:');

        return isInMainContent && isNotInNavbar && isNotInSidebar && hasNoOwnBackground && isNotDarkMode;
    },

    // SRP: Método responsável por aplicar estilo a um elemento de breadcrumb
    _applyBreadcrumbElementStyle(element, textColor) {
        this._applyElementTextStyle(element, textColor);
        this._applyToBreadcrumbChildren(element, textColor);
        this._applyToBreadcrumbItems(element, textColor);

        console.log(`✅ Applied breadcrumb color to: ${element.tagName}.${element.className || 'no-class'}`);
    },

    // SRP: Método responsável por aplicar estilos a todos os filhos de breadcrumb
    _applyToBreadcrumbChildren(element, textColor) {
        const allBreadcrumbItems = element.querySelectorAll('*');
        allBreadcrumbItems.forEach(item => {
            if (!item.style.backgroundColor &&
                !item.classList.contains('bg-') &&
                !(item.className && item.className.includes('dark:'))) {
                this._applyElementTextStyle(item, textColor);
            }
        });
    },

    // SRP: Método responsável por aplicar estilos a itens específicos de breadcrumb
    _applyToBreadcrumbItems(element, textColor) {
        const breadcrumbItems = element.querySelectorAll('a, span, li, .breadcrumb-item, .breadcrumb-link');
        breadcrumbItems.forEach(item => {
            if (!item.style.backgroundColor && !item.classList.contains('bg-')) {
                this._applyElementTextStyle(item, textColor);
            }
        });
    },

    // SRP: Método responsável por aplicar estilos a todos os headings no conteúdo
    _applyToAllHeadingsInContent(textColor) {
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        allHeadings.forEach(heading => {
            if (this._shouldApplyContentHeadingStyle(heading)) {
                this._applyContentHeadingStyle(heading, textColor);
            }
        });
    },

    // SRP: Método responsável por verificar se deve aplicar estilo de heading no conteúdo
    _shouldApplyContentHeadingStyle(heading) {
        const isNotInNavbar = !heading.closest('.hospital-navbar, nav.hospital-navbar');
        const isNotInSidebar = !heading.closest('.hospital-sidebar, .sidebar, aside');
        const hasNoOwnBackground = !heading.style.backgroundColor && !heading.classList.contains('bg-');

        return isNotInNavbar && isNotInSidebar && hasNoOwnBackground;
    },

    // SRP: Método responsável por aplicar estilo a heading no conteúdo
    _applyContentHeadingStyle(heading, textColor) {
        this._applyElementTextStyle(heading, textColor);

        const children = heading.querySelectorAll('*');
        children.forEach(child => {
            if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    },

    // SRP: Método responsável por configurar aplicação dinâmica de cores na navbar
    setupDynamicNavbarColorApplication() {
        const observer = this._createNavbarMutationObserver();
        this._observeNavbarElements(observer);
        this.navbarObserver = observer;
    },

    // SRP: Método responsável por criar o observer de mutação
    _createNavbarMutationObserver() {
        return new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this._handleNavbarMutations(mutation);
                }
            });
        });
    },

    // SRP: Método responsável por lidar com mutações na navbar
    _handleNavbarMutations(mutation) {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                this._applyColorsToNewNavbarNode(node);
            }
        });
    },

    // SRP: Método responsável por aplicar cores a novos nós da navbar
    _applyColorsToNewNavbarNode(node) {
        const isInNavbar = node.closest('.hospital-navbar, nav.hospital-navbar');
        if (isInNavbar && window.hasCustomTheme) {
            const currentColors = this.colors;
            if (currentColors.navbar) {
                const textColor = ColorUtils.getContrastingTextColor(currentColors.navbar);
                this._applyDynamicNavbarColors(node, currentColors.navbar, textColor);
            }
        }
    },

    // SRP: Método responsável por observar elementos da navbar
    _observeNavbarElements(observer) {
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(navbar => {
            observer.observe(navbar, {
                childList: true,
                subtree: true
            });
        });
    },

    // SRP: Método responsável por aplicar cores a um elemento específico da navbar dinamicamente
    _applyDynamicNavbarColors(element, backgroundColor, textColor) {
        if (!this._isThemeManagerElement(element)) {
            this._applyDynamicBackground(element, backgroundColor);
            this._applyDynamicColors(element, textColor);
            this._applyDynamicColorsToChildren(element, textColor);
        }
    },

    // DRY: Método reutilizável para verificar se é elemento do theme manager
    _isThemeManagerElement(element) {
        return element.closest('[x-data*="themeManager"]') ||
               element.hasAttribute('x-data') ||
               element.classList.contains('theme-manager');
    },

    // SRP: Método responsável por aplicar background dinâmico
    _applyDynamicBackground(element, backgroundColor) {
        if (!element.style.backgroundColor && !element.classList.contains('bg-')) {
            if (element.classList.contains('dropdown-menu') ||
                element.classList.contains('quick-stat-badge') ||
                element.hasAttribute('x-show')) {
                element.style.backgroundColor = backgroundColor;
            }
        }
    },

    // SRP: Método responsável por aplicar cores dinâmicas
    _applyDynamicColors(element, textColor) {
        element.style.color = textColor;
        element.style.setProperty('color', textColor, 'important');
    },

    // SRP: Método responsável por aplicar cores dinâmicas aos filhos
    _applyDynamicColorsToChildren(element, textColor) {
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            if (!child.style.backgroundColor &&
                !child.classList.contains('bg-') &&
                !child.closest('[x-data*="themeManager"]')) {
                this._applyDynamicColors(child, textColor);
                this._styleSVGElements(child, textColor);
            }
        });
    },

    // ===== MÉTODOS UTILITÁRIOS =====

    // DRY: Método utilitário para verificar className de forma segura
    _getElementClassName(element) {
        if (!element.className) return '';
        return typeof element.className === 'string' ? element.className : element.className.toString();
    },

    // DRY: Método utilitário para verificar se className contém uma string
    _classNameIncludes(element, searchString) {
        const className = this._getElementClassName(element);
        return className.includes(searchString);
    },

    // ===== MÉTODOS DE SCROLLBAR DINÂMICA =====

    // SRP: Método responsável por aplicar estilos de scrollbar da sidebar
    _applySidebarScrollbarStyles(color, textColor, root) {
        console.log(`🎨 Applying sidebar scrollbar styles: ${color}`);
        
        // Calcular cores derivadas para scrollbar
        const scrollbarBg = this._adjustColorOpacity(color, 0.1);
        const scrollbarThumb = this._adjustColorOpacity(textColor, 0.4);
        const scrollbarThumbHover = this._adjustColorOpacity(textColor, 0.7);
        
        // Definir variáveis CSS para scrollbar da sidebar
        root.style.setProperty('--scrollbar-sidebar-bg', scrollbarBg);
        root.style.setProperty('--scrollbar-sidebar-thumb', scrollbarThumb);
        root.style.setProperty('--scrollbar-sidebar-thumb-hover', scrollbarThumbHover);
        
        console.log(`✅ Sidebar scrollbar applied - BG: ${scrollbarBg}, Thumb: ${scrollbarThumb}, Hover: ${scrollbarThumbHover}`);
    },

    // SRP: Método responsável por aplicar estilos de scrollbar do content
    _applyContentScrollbarStyles(color, textColor, root) {
        console.log(`🎨 Applying content scrollbar styles: ${color}`);
        
        // Calcular cores derivadas para scrollbar
        const scrollbarBg = this._adjustColorOpacity(color, 0.1);
        const scrollbarThumb = this._adjustColorOpacity(textColor, 0.3);
        const scrollbarThumbHover = this._adjustColorOpacity(textColor, 0.6);
        
        // Definir variáveis CSS para scrollbar do content
        root.style.setProperty('--scrollbar-content-bg', scrollbarBg);
        root.style.setProperty('--scrollbar-content-thumb', scrollbarThumb);
        root.style.setProperty('--scrollbar-content-thumb-hover', scrollbarThumbHover);
        
        console.log(`✅ Content scrollbar applied - BG: ${scrollbarBg}, Thumb: ${scrollbarThumb}, Hover: ${scrollbarThumbHover}`);
    },

    // DRY: Método utilitário para ajustar opacidade de cores
    _adjustColorOpacity(color, opacity) {
        // Se a cor já é hex, converter para rgba
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        
        // Se a cor já é rgb/rgba, ajustar opacidade
        if (color.startsWith('rgb')) {
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) {
                const [, r, g, b] = match;
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
        }
        
        // Fallback: usar a cor original com opacidade padrão
        return color;
    },

    // SRP: Método para calcular cor complementar para scrollbar
    _getComplementaryScrollbarColor(baseColor, isLight = true) {
        // Se é cor clara, usar tom escuro; se é escura, usar tom claro
        const lightColors = ['#ffffff', '#f9fafb', '#f8f9fa', '#f5f5f5'];
        const isDarkBase = !lightColors.some(light => 
            baseColor.toLowerCase().includes(light.toLowerCase())
        );
        
        if (isDarkBase) {
            // Base escura: scrollbar clara
            return isLight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)';
        } else {
            // Base clara: scrollbar escura
            return isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)';
        }
    },

    // MÉTODO DE TESTE SIMPLES: Para diagnosticar o problema dos presets
    testSimplePreset() {
        console.log(`🔧 TESTE: Iniciando teste simples de preset`);

        // Testar preset blue manualmente
        const bluePreset = {
            navbar: '#2563eb',
            sidebar: '#1e40af',
            background: '#f8fafc',
            accent: '#3b82f6'
        };

        console.log(`🔧 TESTE: Aplicando cores manualmente...`);

        // Aplicar diretamente cada tipo
        console.log(`🔧 TESTE: Aplicando navbar...`);
        this.applyStyles('navbar', bluePreset.navbar, '#ffffff');

        console.log(`🔧 TESTE: Aplicando sidebar...`);
        this.applyStyles('sidebar', bluePreset.sidebar, '#ffffff');

        console.log(`🔧 TESTE: Aplicando background...`);
        this.applyStyles('background', bluePreset.background, '#1f2937');

        console.log(`🔧 TESTE: Aplicando accent...`);
        this.applyStyles('accent', bluePreset.accent, '#ffffff');

        console.log(`🔧 TESTE: Teste simples concluído`);
    },

    // MÉTODO DE DEBUG: Para testar se todos os elementos estão sendo encontrados
    debugElements() {
        console.log('🔍 DEBUG: Checking all theme elements...');

        // Testar navbar
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        console.log(`🔍 Navbar elements found: ${navbars.length}`, navbars);

        // Testar sidebar
        const sidebars = document.querySelectorAll('.hospital-sidebar, .sidebar, [class*="sidebar"], aside');
        console.log(`🔍 Sidebar elements found: ${sidebars.length}`, sidebars);

        // Testar área de conteúdo
        const contentAreas = document.querySelectorAll('.hospital-content, main, .content-area, .main-content');
        console.log(`🔍 Content areas found: ${contentAreas.length}`, contentAreas);

        // Testar elementos accent
        const accentElements = document.querySelectorAll('.btn-primary, .gqa-btn.primary, .text-blue-500, .bg-blue-500');
        console.log(`🔍 Accent elements found: ${accentElements.length}`, accentElements);

        return {
            navbars: navbars.length,
            sidebars: sidebars.length,
            contentAreas: contentAreas.length,
            accentElements: accentElements.length
        };
    },

    // MÉTODO DE TESTE: Para testar aplicação de preset específico
    testPreset(presetName) {
        console.log(`🧪 TEST: Testing preset ${presetName}...`);

        // Debug elementos primeiro
        const elementCounts = this.debugElements();

        // Aplicar preset
        this.applyPreset(presetName);

        // Verificar se as cores foram aplicadas
        setTimeout(() => {
            this.verifyPresetApplication(presetName);
        }, 1000);

        return elementCounts;
    },

    // MÉTODO DE VERIFICAÇÃO: Para verificar se preset foi aplicado corretamente
    verifyPresetApplication(presetName) {
        console.log(`🔍 VERIFY: Checking if preset ${presetName} was applied correctly...`);

        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) return;

        // Verificar navbar
        const navbar = document.querySelector('.hospital-navbar, nav.hospital-navbar');
        if (navbar) {
            const navbarBg = window.getComputedStyle(navbar).backgroundColor;
            console.log(`🔍 Navbar background:`, navbarBg);
        }

        // Verificar sidebar
        const sidebar = document.querySelector('.hospital-sidebar, .sidebar, [class*="sidebar"], aside');
        if (sidebar) {
            const sidebarBg = window.getComputedStyle(sidebar).backgroundColor;
            console.log(`🔍 Sidebar background:`, sidebarBg);
        }

        // Verificar content area
        const contentArea = document.querySelector('.hospital-content, main, .content-area, .main-content') || document.body;
        if (contentArea) {
            const contentBg = window.getComputedStyle(contentArea).backgroundColor;
            console.log(`🔍 Content background:`, contentBg);
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

    // Initialize animated theme switches
    initializeAnimatedThemeSwitches();

    // Initialize theme business rules
    initializeThemeBusinessRules();

    window.Hospital.init();

    // Garantir que Alpine.js seja inicializado
    if (typeof Alpine !== 'undefined') {
        Alpine.start();
        console.log('✅ Alpine.js started');
    } else {
        console.error('❌ Alpine.js not found');
    }
});

// ===== ANIMATED THEME SWITCH FUNCTIONALITY =====
function initializeAnimatedThemeSwitches() {
    console.log('🎨 Initializing animated theme switches...');
    
    // Find all theme switches
    const themeSwitches = document.querySelectorAll('[data-hs-theme-switch]');
    
    themeSwitches.forEach(switchElement => {
        const checkbox = switchElement.querySelector('.hs-theme-checkbox');
        const label = switchElement.querySelector('label');
        
        if (checkbox && label) {
            // Set initial state based on current theme
            updateSwitchState(checkbox);
            
            // Add click handler
            label.addEventListener('click', (e) => {
                e.preventDefault();
                handleThemeSwitch(checkbox);
            });
            
            // Add keyboard support
            checkbox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleThemeSwitch(checkbox);
                }
            });
        }
    });
    
    // Listen for theme changes from other sources
    window.addEventListener('theme-changed', () => {
        updateAllSwitches();
    });
    
    console.log(`✅ ${themeSwitches.length} animated theme switches initialized`);
}

function handleThemeSwitch(checkbox) {
    // Don't switch if custom theme is active
    if (window.hasCustomTheme) {
        console.log('🚫 Custom theme active, theme switch disabled');
        return;
    }
    
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    console.log(`🎨 Switching theme: ${currentTheme} → ${newTheme}`);
    
    // Apply theme with smooth animation
    applyThemeWithAnimation(newTheme);
    
    // Update all switches
    setTimeout(() => {
        updateAllSwitches();
    }, 50);
}

function applyThemeWithAnimation(theme) {
    const html = document.documentElement;
    const body = document.body;
    
    // Add transition class for smooth animation
    html.classList.add('theme-transitioning');
    
    // Apply theme with proper class management
    if (theme === 'dark') {
        html.classList.add('dark');
        html.classList.add('hs-dark-mode-active');
        body.classList.add('dark');
        body.classList.add('hs-dark-mode-active');
    } else {
        html.classList.remove('dark');
        html.classList.remove('hs-dark-mode-active');
        body.classList.remove('dark');
        body.classList.remove('hs-dark-mode-active');
    }
    
    // Force update all theme switches immediately
    updateAllSwitchesImmediate(theme === 'dark');
    
    // Store preference
    localStorage.setItem('theme', theme);
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('theme-changed', { 
        detail: { theme, previousTheme: theme === 'dark' ? 'light' : 'dark' }
    }));
    
    // Remove transition class after animation
    setTimeout(() => {
        html.classList.remove('theme-transitioning');
    }, 300);
    
    console.log(`✅ Theme applied: ${theme}, dark mode active: ${theme === 'dark'}`);
}

function getCurrentTheme() {
    if (document.documentElement.classList.contains('dark') || 
        document.documentElement.classList.contains('hs-dark-mode-active')) {
        return 'dark';
    }
    return 'light';
}

function updateSwitchState(checkbox) {
    const isDark = getCurrentTheme() === 'dark';
    checkbox.checked = isDark;
    
    // Add visual feedback
    const switchContainer = checkbox.closest('[data-hs-theme-switch]');
    if (switchContainer) {
        if (isDark) {
            switchContainer.classList.add('theme-dark');
        } else {
            switchContainer.classList.remove('theme-dark');
        }
    }
}

function updateAllSwitches() {
    const checkboxes = document.querySelectorAll('.hs-theme-checkbox');
    checkboxes.forEach(checkbox => {
        updateSwitchState(checkbox);
    });
}

function updateAllSwitchesImmediate(isDark) {
    const checkboxes = document.querySelectorAll('.hs-theme-checkbox');
    const switches = document.querySelectorAll('[data-hs-theme-switch]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isDark;
    });
    
    switches.forEach(switchElement => {
        if (isDark) {
            switchElement.classList.add('theme-dark');
            switchElement.classList.add('hs-dark-mode-active');
        } else {
            switchElement.classList.remove('theme-dark');
            switchElement.classList.remove('hs-dark-mode-active');
        }
    });
    
    console.log(`🔄 All switches updated: isDark=${isDark}`);
}

// ===== THEME BUSINESS RULES =====

// Function to manage dark mode switch visibility based on custom theme state
function manageDarkModeSwitchVisibility() {
    const hasCustomTheme = window.hasCustomTheme || false;
    const body = document.body;
    const html = document.documentElement;
    
    console.log(`🎨 Managing switch visibility - Custom theme active: ${hasCustomTheme}`);
    
    if (hasCustomTheme) {
        // Add transitioning class for smooth fade out
        body.classList.add('custom-theme-active', 'transitioning');
        html.classList.add('custom-theme-active', 'transitioning');
        
        // If dark mode is currently active, switch to light mode
        const isDarkMode = getCurrentTheme() === 'dark';
        if (isDarkMode) {
            console.log('🌙→☀️ Switching to light mode due to custom theme activation');
            applyThemeWithAnimation('light');
        }
        
        // Disable all dark mode switches
        disableAllDarkModeSwitches();
        
        // Remove transitioning class after animation completes
        setTimeout(() => {
            body.classList.remove('transitioning');
            html.classList.remove('transitioning');
        }, 300);
        
    } else {
        // Show dark mode switches when using default theme with smooth transition
        body.classList.add('transitioning');
        html.classList.add('transitioning');
        
        // Remove custom theme classes
        body.classList.remove('custom-theme-active');
        html.classList.remove('custom-theme-active');
        
        // Re-enable all dark mode switches
        enableAllDarkModeSwitches();
        
        // Remove transitioning class after animation completes
        setTimeout(() => {
            body.classList.remove('transitioning');
            html.classList.remove('transitioning');
        }, 300);
    }
}

// Function to disable all dark mode switches
function disableAllDarkModeSwitches() {
    const switches = document.querySelectorAll('[data-hs-theme-switch]');
    const checkboxes = document.querySelectorAll('.hs-theme-checkbox');
    
    switches.forEach(switchElement => {
        switchElement.classList.add('disabled');
        switchElement.setAttribute('aria-disabled', 'true');
        
        // Add tooltip explaining why it's disabled
        const label = switchElement.querySelector('label');
        if (label) {
            label.title = 'Modo escuro desabilitado - tema personalizado ativo';
        }
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });
    
    console.log('🚫 Dark mode switches disabled');
}

// Function to enable all dark mode switches
function enableAllDarkModeSwitches() {
    const switches = document.querySelectorAll('[data-hs-theme-switch]');
    const checkboxes = document.querySelectorAll('.hs-theme-checkbox');
    
    switches.forEach(switchElement => {
        switchElement.classList.remove('disabled');
        switchElement.removeAttribute('aria-disabled');
        
        // Restore original tooltip
        const label = switchElement.querySelector('label');
        if (label) {
            label.title = 'Alternar modo claro/escuro';
        }
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.disabled = false;
    });
    
    console.log('✅ Dark mode switches enabled');
}

// Function to handle custom theme activation
function onCustomThemeActivated() {
    console.log('🎨 Custom theme activated - applying business rules');
    
    // Update global state
    window.hasCustomTheme = true;
    
    // Manage switch visibility
    manageDarkModeSwitchVisibility();
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('custom-theme-activated'));
}

// Function to handle theme reset to default
function onThemeResetToDefault() {
    console.log('🔄 Theme reset to default - applying business rules');
    
    // Update global state
    window.hasCustomTheme = false;
    
    // Manage switch visibility
    manageDarkModeSwitchVisibility();
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('theme-reset-to-default'));
}

// Enhanced theme application with business rules
function applyCustomThemeWithBusinessRules(colors) {
    console.log('🎨 Applying custom theme with business rules', colors);
    
    // First, activate custom theme (this will handle dark mode switch)
    onCustomThemeActivated();
    
    // Then apply the custom colors
    // This should integrate with your existing theme manager
    if (window.Hospital && window.Hospital.themeManager) {
        // Apply colors using existing theme manager
        Object.entries(colors).forEach(([type, color]) => {
            if (color) {
                window.Hospital.themeManager.updateColor(type, color);
            }
        });
    }
}

// Enhanced theme reset with business rules
function resetThemeWithBusinessRules() {
    console.log('🔄 Resetting theme with business rules');
    
    // First, reset theme using existing theme manager
    if (window.Hospital && window.Hospital.themeManager) {
        window.Hospital.themeManager.resetTheme();
    }
    
    // Then handle business rules
    onThemeResetToDefault();
}

// Monitor custom theme state changes
function initializeThemeBusinessRules() {
    console.log('🎯 Initializing theme business rules...');
    
    // Initial state management
    manageDarkModeSwitchVisibility();
    
    // Listen for theme manager events
    window.addEventListener('custom-theme-applied', onCustomThemeActivated);
    window.addEventListener('theme-reset', onThemeResetToDefault);
    
    // Override existing theme manager methods to include business rules
    if (window.Hospital && window.Hospital.themeManager) {
        const originalSaveTheme = window.Hospital.themeManager.saveTheme;
        const originalResetTheme = window.Hospital.themeManager.resetTheme;
        
        // Enhance saveTheme method
        window.Hospital.themeManager.saveTheme = function() {
            const result = originalSaveTheme.call(this);
            onCustomThemeActivated();
            return result;
        };
        
        // Enhance resetTheme method
        window.Hospital.themeManager.resetTheme = function() {
            const result = originalResetTheme.call(this);
            onThemeResetToDefault();
            return result;
        };
    }
    
    console.log('✅ Theme business rules initialized');
}

// Global utilities for easy access
window.hospitalUtils = {
    toggleTheme() {
        window.Hospital.theme.toggle();
    }
};

// Global functions for testing presets
window.testPreset = function(presetName) {
    console.log(`🧪 Testing preset: ${presetName}`);

    if (window.Hospital && window.Hospital.themeManager) {
        window.Hospital.themeManager.applyPreset(presetName);
        console.log(`✅ Preset ${presetName} applied via global function`);
    } else {
        console.error('❌ Theme manager not available');
    }
};

window.debugThemeElements = function() {
    console.log('🔍 DEBUG: Checking theme elements...');

    const navbar = document.querySelector('.hospital-navbar');
    const sidebar = document.querySelector('.hospital-sidebar');
    const content = document.querySelector('.hospital-content');

    console.log('📋 Elements found:');
    console.log('   Navbar:', navbar ? `${navbar.className}` : 'NOT FOUND');
    console.log('   Sidebar:', sidebar ? `${sidebar.className}` : 'NOT FOUND');
    console.log('   Content:', content ? `${content.className}` : 'NOT FOUND');

    // Test with available presets
    console.log('🎨 Available presets:', Object.keys(ThemeConfig.PRESETS));

    return {
        navbar: navbar,
        sidebar: sidebar,
        content: content,
        presets: Object.keys(ThemeConfig.PRESETS)
    };
};

window.testAllPresets = function() {
    console.log('🧪 Testing all available presets...');

    const presets = Object.keys(ThemeConfig.PRESETS);
    let index = 0;

    const testNext = () => {
        if (index < presets.length) {
            const presetName = presets[index];
            console.log(`🧪 Testing preset ${index + 1}/${presets.length}: ${presetName}`);
            window.testPreset(presetName);
            index++;
            setTimeout(testNext, 2000); // 2 segundos entre cada teste
        } else {
            console.log('✅ All presets tested!');
        }
    };

    testNext();
};

// Cleanup and global functions
window.addEventListener('beforeunload', () => {
    window.Hospital.charts.destroyAll();
    console.log('Resources cleaned');
});

window.toggleHospitalTheme = () => window.hospitalUtils.toggleTheme();

export { Alpine };
