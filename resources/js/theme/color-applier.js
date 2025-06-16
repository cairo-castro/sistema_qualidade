import { ColorUtils } from '../utils/color-utils.js';

export class ColorApplier {
    constructor() {
        this.applyTimeout = null;
    }

    isValidHexColor(color) {
        return ColorUtils.isValidHexColor(color);
    }

    applyColorRealTime(type, color) {
        console.log(`🎯 applyColorRealTime: ${type} = ${color}`);
        const textColor = ColorUtils.getSmartContrastColor(color, {
            lightColor: type === 'background' ? '#1f2937' : '#ffffff',
            darkColor: type === 'background' ? '#f8fafc' : '#1f2937',
            mediumLightColor: type === 'background' ? '#374151' : '#f8fafc',
            mediumDarkColor: type === 'background' ? '#e5e7eb' : '#374151'
        });
        console.log(`🎯 Calculated smart contrast text color: ${textColor}`);
        this.applyStyles(type, color, textColor);
    }

    applyStyles(type, color, textColor) {
        console.log(`🎯 applyStyles called: ${type} = ${color} (text: ${textColor})`);
        const root = document.documentElement;

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

        this._ensureTextContrast();
    }

    _ensureTextContrast() {
        const elementsWithBg = document.querySelectorAll(
            '.hospital-navbar[style*="background-color"], .hospital-sidebar[style*="background-color"], .hospital-content[style*="background-color"], main[style*="background-color"]'
        );

        elementsWithBg.forEach(element => {
            const bgColor = element.style.backgroundColor;
            if (bgColor) {
                const hexColor = this._rgbToHex(bgColor) || bgColor;
                if (ColorUtils.isValidHexColor(hexColor)) {
                    const contrastColor = ColorUtils.getSmartContrastColor(hexColor);
                    this._applyContrastToElement(element, contrastColor);
                }
            }
        });
    }

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
    }

    _rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent') return null;

        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return null;

        const [, r, g, b] = match;
        return '#' + [r, g, b].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    _applyNavbarStyles(color, textColor, root) {
        console.log(`🎨 Applying navbar styles - BG: ${color}, Text: ${textColor}`);
        this._setCSSVariables(root, 'navbar', color, textColor);
        this._applyNavbarElementStyles(color, textColor);
        this._applyNavbarComprehensiveStyles(color, textColor);
        console.log(`✅ Navbar styles applied: ${color} with calculated contrast text: ${textColor}`);
    }

    _setCSSVariables(root, type, color, textColor) {
        root.style.setProperty(`--${type}-bg`, color);
        root.style.setProperty(`--${type}-text`, textColor);
    }

    _applyNavbarElementStyles(color, textColor) {
        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(nav => {
            this._styleNavbarContainer(nav, color, textColor);
            this._styleNavbarDescendants(nav, color, textColor);
            this._styleNavbarDropdowns(nav, color, textColor);
            this._styleNavbarBadges(nav, color, textColor);
            this._styleNavbarButtons(nav, textColor);
            this._styleNavbarLinks(nav, textColor);
        });
    }

    _styleNavbarContainer(nav, color, textColor) {
        nav.style.backgroundColor = color;
        nav.style.color = textColor;
        console.log(`📝 Navbar container styled: BG=${color}, Text=${textColor}`);
    }

    _styleNavbarDescendants(nav, navbarBackgroundColor, textColor) {
        const allNavbarElements = nav.querySelectorAll('*');
        allNavbarElements.forEach(element => {
            if (this._shouldApplyNavbarStyle(element)) {
                // Verificar se é um elemento de dropdown antes de aplicar
                if (this._isDropdownElement(element)) {
                    // Para dropdowns, calcular contraste adequado com a cor de fundo da navbar
                    const defaultDropdownTextColor = this._getDefaultNavbarDropdownTextColor(navbarBackgroundColor);
                    element.style.color = defaultDropdownTextColor;
                    element.style.setProperty('color', defaultDropdownTextColor, 'important');
                } else {
                    // Para elementos normais da navbar, usar contraste calculado
                    this._applyElementTextStyle(element, textColor);
                }
                this._styleSVGElements(element, textColor);
                this._styleQuickStatElements(element, textColor);
            }
        });
    }

    _shouldApplyNavbarStyle(element) {
        const hasOwnBackground = element.style.backgroundColor ||
                               element.classList.contains('bg-') ||
                               this._classNameIncludes(element, 'dark:bg-');

        const isThemeButton = element.closest('[x-data*="themeManager"]') ||
                            element.hasAttribute('x-data') ||
                            element.classList.contains('theme-manager');

        return !hasOwnBackground && !isThemeButton;
    }

    _applyElementTextStyle(element, textColor) {
        element.style.color = textColor;
        element.style.setProperty('color', textColor, 'important');
    }

    _styleSVGElements(element, textColor) {
        if (element.tagName === 'SVG') {
            element.style.fill = textColor;
            element.style.stroke = textColor;
        }
    }

    _styleQuickStatElements(element, textColor) {
        if (element.classList.contains('quick-stat-badge') ||
            element.classList.contains('stat-value') ||
            element.classList.contains('stat-label') ||
            element.closest('.quick-stat-badge')) {
            this._applyElementTextStyle(element, textColor);
        }
    }

    _styleNavbarDropdowns(nav, color, textColor) {
        // Selecionar dropdowns com múltiplos seletores para garantir cobertura completa
        const dropdownSelectors = [
            '[x-show]',
            '.dropdown',
            '.dropdown-menu', 
            '[class*="dropdown"]',
            '[role="menu"]',
            '[aria-expanded]',
            '.user-menu',
            '.nav-dropdown',
            '.menu-dropdown'
        ];
        
        const dropdowns = nav.querySelectorAll(dropdownSelectors.join(', '));
        console.log(`📋 Found ${dropdowns.length} dropdown elements in navbar`);
        
        dropdowns.forEach((dropdown, index) => {
            if (!dropdown.closest('[x-data*="themeManager"]')) {
                console.log(`📋 Processing dropdown ${index + 1}: ${dropdown.className || dropdown.tagName}`);
                this._styleDropdownContainer(dropdown, color, textColor);
                this._styleDropdownItems(dropdown, color);
            }
        });
        
        // Aplicação adicional para garantir que todos os dropdowns sejam capturados
        this._forceDropdownStyling(nav, color);
    }

    _styleDropdownContainer(dropdown, color, textColor) {
        // Forçar aplicação da cor de fundo da navbar nos dropdowns
        // mesmo se já existir uma cor definida
        dropdown.style.backgroundColor = color;
        dropdown.style.setProperty('background-color', color, 'important');
        
        // Para dropdowns da navbar, calcular contraste adequado com a cor de fundo
        const defaultDropdownTextColor = this._getDefaultNavbarDropdownTextColor(color);
        dropdown.style.color = defaultDropdownTextColor;
        dropdown.style.setProperty('color', defaultDropdownTextColor, 'important');
        
        console.log(`📋 Dropdown container forced: BG=${color}, Text=${defaultDropdownTextColor}`);
    }

    _styleDropdownItems(dropdown, navbarBackgroundColor) {
        // Para itens dos dropdowns da navbar, calcular contraste adequado
        const defaultDropdownTextColor = this._getDefaultNavbarDropdownTextColor(navbarBackgroundColor);
        const dropdownItems = dropdown.querySelectorAll('*');
        dropdownItems.forEach(item => {
            // Aplicar cor de texto com mais agressividade, mas evitar elementos com background próprio
            if (!item.classList.contains('bg-blue-') && 
                !item.classList.contains('bg-red-') && 
                !item.classList.contains('bg-green-') &&
                !this._classNameIncludes(item, 'bg-')) {
                item.style.color = defaultDropdownTextColor;
                item.style.setProperty('color', defaultDropdownTextColor, 'important');
                
                // Se o item não tem background próprio, aplicar o background da navbar
                if (!item.style.backgroundColor && !this._classNameIncludes(item, 'bg-')) {
                    item.style.backgroundColor = navbarBackgroundColor;
                }
            }
        });
        
        console.log(`📋 Dropdown items forced styling: Text=${defaultDropdownTextColor}, BG=${navbarBackgroundColor}`);
    }

    // Método adicional para forçar estilização de dropdowns que possam ter sido perdidos
    _forceDropdownStyling(nav, color) {
        // Procurar por elementos que podem ser dropdowns baseado em atributos comuns
        const potentialDropdowns = nav.querySelectorAll('*[style*="display: none"], *[style*="display:none"], *[hidden], *[x-show], *[aria-hidden]');
        const defaultDropdownTextColor = this._getDefaultNavbarDropdownTextColor(color);
        
        potentialDropdowns.forEach(element => {
            // Verificar se parece um dropdown baseado em classes ou conteúdo
            const classString = element.className.toLowerCase();
            if (classString.includes('menu') || 
                classString.includes('dropdown') || 
                classString.includes('popover') ||
                element.hasAttribute('x-show') ||
                element.getAttribute('role') === 'menu') {
                
                element.style.backgroundColor = color;
                element.style.setProperty('background-color', color, 'important');
                element.style.color = defaultDropdownTextColor;
                element.style.setProperty('color', defaultDropdownTextColor, 'important');
                
                console.log(`📋 Force styled potential dropdown: ${element.className || element.tagName}`);
            }
        });
    }

    _styleNavbarBadges(nav, color, textColor) {
        const quickStatBadges = nav.querySelectorAll('.quick-stat-badge, [class*="stat-"], .badge, .notification-badge');
        quickStatBadges.forEach(badge => {
            this._styleBadgeContainer(badge, color, textColor);
            this._styleBadgeChildren(badge, textColor);
        });
    }

    _styleBadgeContainer(badge, color, textColor) {
        if (!badge.classList.contains('bg-') && !badge.style.backgroundColor) {
            badge.style.backgroundColor = color;
            badge.style.borderColor = textColor;
        }
        this._applyElementTextStyle(badge, textColor);
    }

    _styleBadgeChildren(badge, textColor) {
        const badgeChildren = badge.querySelectorAll('*');
        badgeChildren.forEach(child => {
            if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    }

    _styleNavbarButtons(nav, textColor) {
        const navbarButtons = nav.querySelectorAll('button:not([class*="theme"]):not([x-data])');
        navbarButtons.forEach(button => {
            if (!button.style.backgroundColor && !button.classList.contains('bg-')) {
                this._styleButtonContainer(button, textColor);
                this._styleButtonChildren(button, textColor);
            }
        });
    }

    _styleButtonContainer(button, textColor) {
        button.style.color = textColor;
        button.style.borderColor = textColor;
        button.style.setProperty('color', textColor, 'important');
    }

    _styleButtonChildren(button, textColor) {
        const buttonChildren = button.querySelectorAll('*');
        buttonChildren.forEach(child => {
            if (child.tagName === 'SVG') {
                this._styleSVGElements(child, textColor);
            } else {
                this._applyElementTextStyle(child, textColor);
            }
        });
    }

    _styleNavbarLinks(nav, textColor) {
        const navbarLinks = nav.querySelectorAll('a');
        navbarLinks.forEach(link => {
            if (!link.style.backgroundColor && !link.classList.contains('bg-')) {
                this._applyElementTextStyle(link, textColor);
                this._styleLinkChildren(link, textColor);
            }
        });
    }

    _styleLinkChildren(link, textColor) {
        const linkChildren = link.querySelectorAll('*');
        linkChildren.forEach(child => {
            if (!child.style.backgroundColor) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    }

    _applyNavbarComprehensiveStyles(color, textColor) {
        console.log(`🎨 Applying comprehensive navbar colors - BG: ${color}, Text: ${textColor}`);

        this._applyStylesToNavbarElements(color, textColor);
        this._applyStylesToSpecificNavbarSelectors(color, textColor);

        console.log(`✅ Comprehensive navbar colors applied: ${textColor} for background: ${color}`);
    }

    _applyStylesToNavbarElements(color, textColor) {
        const navbarElements = document.querySelectorAll(
            '.hospital-navbar, .hospital-navbar *, nav.hospital-navbar, nav.hospital-navbar *'
        );

        navbarElements.forEach(element => {
            if (this._shouldApplyComprehensiveNavbarStyle(element)) {
                this._applyComprehensiveElementStyle(element, color, textColor);
            }
        });
    }

    _shouldApplyComprehensiveNavbarStyle(element) {
        const isInNavbar = element.closest('.hospital-navbar, nav.hospital-navbar');
        const isThemeManager = element.closest('[x-data*="themeManager"]') ||
                              element.hasAttribute('x-data') ||
                              element.classList.contains('theme-manager');
        const hasOwnBg = element.style.backgroundColor ||
                       element.classList.contains('bg-') ||
                       this._classNameIncludes(element, 'dark:bg-');

        return isInNavbar && !isThemeManager && !hasOwnBg;
    }

    _applyComprehensiveElementStyle(element, color, textColor) {
        // Verificar se é um elemento de dropdown antes de aplicar estilos
        if (this._isDropdownElement(element)) {
            // Para dropdowns, calcular contraste adequado com a cor de fundo da navbar
            const defaultDropdownTextColor = this._getDefaultNavbarDropdownTextColor(color);
            element.style.color = defaultDropdownTextColor;
            element.style.setProperty('color', defaultDropdownTextColor, 'important');
        } else {
            // Para elementos normais da navbar, usar contraste calculado
            this._applyElementTextStyle(element, textColor);
        }
        
        this._styleSVGElements(element, textColor);
        this._handleSpecialNavbarElements(element, color, textColor);
        this._handleDropdownElements(element, color, textColor);
        this._handleButtonElements(element, textColor);
        this._handleLinkElements(element, textColor);
    }

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
    }

    _handleDropdownElements(element, color, textColor) {
        if (element.classList.contains('dropdown') ||
            element.classList.contains('dropdown-menu') ||
            element.hasAttribute('x-show') ||
            element.closest('.dropdown, .dropdown-menu, [x-show]')) {

            // Para elementos de dropdown da navbar, calcular contraste adequado
            const defaultDropdownTextColor = this._getDefaultNavbarDropdownTextColor(color);
            element.style.color = defaultDropdownTextColor;
            element.style.setProperty('color', defaultDropdownTextColor, 'important');

            // Aplicar background da navbar a todos os elementos de dropdown
            element.style.backgroundColor = color;
            element.style.setProperty('background-color', color, 'important');
            
            console.log(`📋 Dropdown element handled: ${element.className || element.tagName}, BG=${color}, Text=${defaultDropdownTextColor}`);
        }
    }

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
    }

    _handleLinkElements(element, textColor) {
        if (element.tagName === 'A') {
            this._applyElementTextStyle(element, textColor);
        }
    }

    _applyStylesToSpecificNavbarSelectors(color, textColor) {
        const specificSelectors = this._getSpecificNavbarSelectors();

        specificSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this._applyStyleToSpecificElement(element, color, textColor);
            });
        });
    }

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
    }

    _applyStyleToSpecificElement(element, color, textColor) {
        const isThemeManager = element.closest('[x-data*="themeManager"]');
        if (!isThemeManager) {
            this._applyElementTextStyle(element, textColor);
            this._applyBackgroundToSpecialElements(element, color);
            this._applyStylesToElementChildren(element, textColor);
        }
    }

    _applyBackgroundToSpecialElements(element, color) {
        if (element.classList.contains('dropdown-menu') ||
            element.classList.contains('quick-stat-badge') ||
            element.hasAttribute('x-show')) {
            element.style.backgroundColor = color;
        }
    }

    _applyStylesToElementChildren(element, textColor) {
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            if (!child.style.backgroundColor &&
                !child.classList.contains('bg-') &&
                !child.closest('[x-data*="themeManager"]')) {
                this._applyElementTextStyle(child, textColor);
            }
        });
    }

    _applySidebarStyles(color, textColor, root) {
        this._setCSSVariables(root, 'sidebar', color, textColor);
        this._applySidebarElementStyles(color, textColor);
        this._applySidebarScrollbarStyles(color, textColor, root);
        console.log(`✅ Sidebar styles applied: ${color} with text: ${textColor}`);
    }

    _applySidebarElementStyles(color, textColor) {
        const sidebarSelectors = this._getSidebarSelectors();
        console.log(`🔍 DEBUG: Using sidebar selectors: ${sidebarSelectors}`);

        const sidebars = document.querySelectorAll(sidebarSelectors);
        console.log(`🔍 Found ${sidebars.length} sidebar elements`);

        sidebars.forEach((sidebar, index) => {
            console.log(`🔍 Sidebar ${index + 1}: ${sidebar.className || sidebar.tagName}`);
        });

        sidebars.forEach(sidebar => {
            console.log(`🎨 Styling sidebar: ${sidebar.className || sidebar.tagName}`);
            this._styleSidebarContainer(sidebar, color, textColor);
            this._styleSidebarChildren(sidebar, textColor);
        });

        this._forceApplyToSidebarElements(color, textColor);
    }

    _forceApplyToSidebarElements(color, textColor) {
        console.log(`🔧 FORCE: Applying sidebar colors to any element containing 'sidebar' class`);

        const allElements = document.querySelectorAll('*');
        let foundSidebarElements = 0;

        allElements.forEach(element => {
            const className = this._getElementClassName(element);
            const id = element.id || '';

            if (this._classNameIncludes(element, 'sidebar') || id.includes('sidebar')) {
                console.log(`🔧 FORCE: Found sidebar element: ${element.tagName}.${className}#${id}`);
                foundSidebarElements++;

                if (!element.closest('[x-data*="themeManager"]')) {
                    element.style.backgroundColor = color;
                    element.style.color = textColor;

                    const children = element.querySelectorAll('*');
                    children.forEach(child => {
                        if (!child.closest('[x-data*="themeManager"]') &&
                            !child.style.backgroundColor &&
                            !child.classList.contains('bg-')) {
                            child.style.color = textColor;

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
    }

    _getSidebarSelectors() {
        return [
            '.hospital-sidebar',
            '.sidebar',
            '[class*="sidebar"]',
            'aside',
            'nav[role="navigation"]',
            '.nav-sidebar',
            '.side-nav',
            '.side-navigation',
            '.main-sidebar',
            '#sidebar'
        ].join(', ');
    }

    _styleSidebarContainer(sidebar, color, textColor) {
        sidebar.style.backgroundColor = color;
        sidebar.style.color = textColor;
    }

    _styleSidebarChildren(sidebar, textColor) {
        const children = sidebar.querySelectorAll('*');
        children.forEach(child => {
            if (!child.closest('[x-data*="themeManager"]') &&
                !child.style.backgroundColor &&
                !child.classList.contains('bg-')) {
                child.style.color = textColor;

                if (child.tagName === 'SVG') {
                    child.style.fill = textColor;
                    child.style.stroke = textColor;
                }
            }
        });
    }

    _applySidebarScrollbarStyles(color, textColor, root) {
        const sidebarScrollbarColor = this._adjustColorOpacity(color, 0.3);
        const sidebarScrollbarHoverColor = this._adjustColorOpacity(color, 0.5);

        root.style.setProperty('--sidebar-scrollbar-color', sidebarScrollbarColor);
        root.style.setProperty('--sidebar-scrollbar-hover-color', sidebarScrollbarHoverColor);

        const style = document.createElement('style');
        style.textContent = `
            .hospital-sidebar::-webkit-scrollbar-thumb {
                background-color: ${sidebarScrollbarColor} !important;
            }
            .hospital-sidebar::-webkit-scrollbar-thumb:hover {
                background-color: ${sidebarScrollbarHoverColor} !important;
            }
        `;
        
        const existingStyle = document.head.querySelector('style[data-sidebar-scrollbar]');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.setAttribute('data-sidebar-scrollbar', 'true');
        document.head.appendChild(style);
    }

    _adjustColorOpacity(color, opacity) {
        if (!color.startsWith('#')) return color;

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    _applyBackgroundStyles(color, textColor, root) {
        this._setCSSVariables(root, 'content', color, textColor);
        this._setCSSVariables(root, 'bg', color, textColor);
        
        const contentArea = this._findMainContentArea();
        if (contentArea) {
            this._styleContentArea(contentArea, color, textColor);
        } else {
            document.body.style.backgroundColor = color;
        }

        console.log(`✅ Background styles applied: ${color} with text: ${textColor}`);
    }

    _findMainContentArea() {
        const contentSelectors = [
            '.hospital-content',
            'main.hospital-main',
            'main',
            '.content-area',
            '.main-content'
        ];

        for (const selector of contentSelectors) {
            const contentArea = document.querySelector(selector);
            if (contentArea) return contentArea;
        }
        return null;
    }

    _styleContentArea(contentArea, color, textColor) {
        contentArea.style.backgroundColor = color;

        // Para o conteúdo principal, sempre manter textos claros/escuros padrão
        // Não aplicar a cor de contraste automática para preservar legibilidade
        const textElements = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class*="bg-"]), a:not([class*="bg-"]), label');
        textElements.forEach(textEl => {
            if (!textEl.closest('.hospital-navbar') &&
                !textEl.closest('.hospital-sidebar') &&
                !textEl.style.backgroundColor &&
                !textEl.classList.contains('bg-')) {
                
                // Aplicar cor de texto padrão baseada no tema atual (claro/escuro)
                // ao invés da cor de contraste calculada
                const defaultTextColor = this._getDefaultContentTextColor();
                textEl.style.color = defaultTextColor;
                textEl.style.setProperty('color', defaultTextColor, 'important');
            }
        });
        
        console.log(`📝 Content area styled with background: ${color}, keeping default text colors`);
    }

    // Método para obter cor de texto padrão do conteúdo baseada no tema atual
    _getDefaultContentTextColor() {
        const isDarkMode = document.documentElement.classList.contains('dark');
        // Para conteúdo principal, sempre usar cores neutras legíveis
        return isDarkMode ? '#f8fafc' : '#1f2937'; // Texto claro no dark mode, escuro no light mode
    }

    // Método para obter cor de texto padrão dos dropdowns da navbar
    _getDefaultNavbarDropdownTextColor(navbarBackgroundColor = null) {
        // Se temos a cor de fundo da navbar, calcular contraste adequado
        if (navbarBackgroundColor && ColorUtils.isValidHexColor(navbarBackgroundColor)) {
            // Para dropdowns, garantir contraste adequado com a cor de fundo da navbar
            return ColorUtils.getSmartContrastColor(navbarBackgroundColor, {
                lightColor: '#ffffff',
                darkColor: '#1f2937',
                mediumLightColor: '#f9fafb',
                mediumDarkColor: '#374151'
            });
        }
        
        // Fallback baseado no tema atual
        const isDarkMode = document.documentElement.classList.contains('dark');
        return isDarkMode ? '#f8fafc' : '#1f2937'; // Contraste forte em ambos os modos
    }

    // Método para identificar se um elemento é parte de um dropdown
    _isDropdownElement(element) {
        return element.classList.contains('dropdown') ||
               element.classList.contains('dropdown-menu') ||
               element.hasAttribute('x-show') ||
               element.closest('.dropdown, .dropdown-menu, [x-show]') ||
               element.closest('[role="menu"]') ||
               element.classList.contains('dropdown-item');
    }

    _applyAccentStyles(color, textColor, root) {
        this._setCSSVariables(root, 'accent', color, textColor);
        this._applyAccentToElements(color, textColor);
        console.log(`✅ Accent styles applied: ${color} with text: ${textColor}`);
    }

    _applyAccentToElements(color, textColor) {
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
    }

    applyDefaultTheme() {
        console.log('🔄 Applying default theme...');
        
        // Remove custom CSS properties
        document.documentElement.style.removeProperty('--navbar-bg');
        document.documentElement.style.removeProperty('--navbar-text');
        document.documentElement.style.removeProperty('--sidebar-bg');
        document.documentElement.style.removeProperty('--sidebar-text');
        document.documentElement.style.removeProperty('--content-bg');
        document.documentElement.style.removeProperty('--content-text');
        document.documentElement.style.removeProperty('--accent-color');
        document.documentElement.style.removeProperty('--accent-text');
        document.documentElement.style.removeProperty('--bg-color');
        document.documentElement.style.removeProperty('--text-color');

        // Remove inline styles from elements
        const elementsToReset = document.querySelectorAll('[style*="background-color"], [style*="color"]');
        elementsToReset.forEach(element => {
            // Don't reset theme manager elements
            if (!element.closest('[x-data*="themeManager"]')) {
                element.style.removeProperty('background-color');
                element.style.removeProperty('color');
                element.style.removeProperty('border-color');
                element.style.removeProperty('fill');
                element.style.removeProperty('stroke');
            }
        });

        // Remove custom scrollbar styles
        const customScrollbarStyle = document.head.querySelector('style[data-sidebar-scrollbar]');
        if (customScrollbarStyle) {
            customScrollbarStyle.remove();
        }
        
        console.log('✅ Default theme applied successfully');
    }

    setupDynamicNavbarColorApplication() {
        const targetNode = document.querySelector('.hospital-navbar, nav.hospital-navbar');
        if (!targetNode) {
            console.warn('⚠️ Navbar not found for dynamic color application');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const hasCustomTheme = window.hasCustomTheme;
                    if (hasCustomTheme && window.Hospital?.themeManager?.colors?.navbar) {
                        const navbarColor = window.Hospital.themeManager.colors.navbar;
                        const textColor = ColorUtils.getSmartContrastColor(navbarColor, {
                            lightColor: '#ffffff',
                            darkColor: '#1f2937',
                            mediumLightColor: '#f8fafc',
                            mediumDarkColor: '#374151'
                        });

                        console.log(`🔄 Navbar DOM changed, reapplying colors: ${navbarColor}`);
                        this._applyNavbarStyles(navbarColor, textColor, document.documentElement);
                    }
                }
            });
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        console.log('🔄 Dynamic navbar color application observer initialized');
    }

    _getElementClassName(element) {
        // Handle both regular elements and SVG elements
        if (typeof element.className === 'string') {
            return element.className;
        } else if (element.className && element.className.baseVal) {
            // SVG elements have className as SVGAnimatedString
            return element.className.baseVal;
        } else if (element.getAttribute) {
            // Fallback to getAttribute
            return element.getAttribute('class') || '';
        }
        return '';
    }

    _classNameIncludes(element, search) {
        const className = this._getElementClassName(element);
        return typeof className === 'string' && className.includes(search);
    }
}