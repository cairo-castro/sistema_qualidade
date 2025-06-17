import { ColorUtils } from '../utils/color-utils.js';

export class ColorApplier {
    constructor() {
        this.applyTimeout = null;
        this.cachedElements = new Map();
        this.eventListeners = new Set();
        this.mutationObservers = new Set();
    }

    isValidHexColor(color) {
        return ColorUtils.isValidHexColor(color);
    }

    applyColorRealTime(type, color) {
        console.log(`🎯 applyColorRealTime: ${type} = ${color}`);
        
        if (!this.isValidHexColor(color)) {
            console.warn(`⚠️ Invalid color provided: ${color}`);
            return;
        }

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
        this._setCSSVariables(root, type, color, textColor);

        const styleAppliers = {
            navbar: () => this._applyNavbarStyles(color, textColor),
            sidebar: () => this._applySidebarStyles(color, textColor, root),
            background: () => this._applyBackgroundStyles(color, textColor, root),
            accent: () => this._applyAccentStyles(color, textColor)
        };

        const applier = styleAppliers[type];
        if (applier) {
            console.log(`🏗️ Applying ${type} styles...`);
            applier();
            this._ensureTextContrast();
            console.log(`✅ Completed ${type} styles application`);
        } else {
            console.warn(`⚠️ Unknown style type: ${type}`);
        }
    }

    // CSS Variables Management
    _setCSSVariables(root, type, color, textColor) {
        root.style.setProperty(`--${type}-bg`, color);
        root.style.setProperty(`--${type}-text`, textColor);
        
        if (type === 'accent') {
            root.style.setProperty('--gqa-primary', color);
            root.style.setProperty('--gqa-secondary', color);
        }
    }

    // Element Identification Methods
    _isDropdownElement(element) {
        if (!element) return false;
        
        const dropdownIndicators = [
            'dropdown', 'dropdown-menu', 'hs-dropdown-menu'
        ];
        
        const hasDropdownClass = dropdownIndicators.some(indicator => {
            if (element.classList && element.classList.contains(indicator)) {
                return true;
            }
            
            // Safely get className as string for SVG and other elements
            const className = this._getElementClassName(element);
            return className.includes(indicator);
        });
        
        const hasDropdownAttributes = element.hasAttribute && (
            element.hasAttribute('x-show') ||
            (element.hasAttribute('role') && element.getAttribute('role') === 'menu') ||
            element.hasAttribute('aria-labelledby')
        );
        
        const hasDropdownParent = element.closest && 
                                element.closest('.dropdown, [x-show], [role="menu"], .hs-dropdown');
        
        return hasDropdownClass || hasDropdownAttributes || !!hasDropdownParent;
    }

    _isThemeManagerElement(element) {
        if (!element) return false;
        
        try {
            return (element.closest && element.closest('[x-data*="themeManager"]')) ||
                   (element.hasAttribute && element.hasAttribute('x-data')) ||
                   (element.classList && element.classList.contains('theme-manager'));
        } catch (e) {
            console.warn('Error checking theme manager element:', element, e);
            return false;
        }
    }

    _isPresetButton(element) {
        if (!element) return false;
        
        try {
            const className = this._getElementClassName(element);
            return className.includes('preset-') || 
                   className.includes('gqa-btn') || 
                   (element.tagName === 'BUTTON' && className.includes('bg-'));
        } catch (e) {
            console.warn('Error checking preset button:', element, e);
            return false;
        }
    }

    _shouldApplyStyle(element, skipThemeManager = true) {
        if (!element) return false;
        
        try {
            const hasOwnBackground = (element.style && element.style.backgroundColor) ||
                                   (element.classList && element.classList.contains('bg-')) ||
                                   this._classNameIncludes(element, 'dark:bg-');

            const isThemeManager = skipThemeManager && this._isThemeManagerElement(element);
            
            return !hasOwnBackground && !isThemeManager;
        } catch (e) {
            console.warn('Error checking if should apply style:', element, e);
            return false;
        }
    }

    // Optimized Element Queries
    _getElementsOnce(selector, useCache = true) {
        if (useCache && this.cachedElements.has(selector)) {
            return this.cachedElements.get(selector);
        }
        
        const elements = document.querySelectorAll(selector);
        if (useCache) {
            this.cachedElements.set(selector, elements);
        }
        
        return elements;
    }

    _clearElementCache() {
        this.cachedElements.clear();
    }

    // Navbar Styling
    _applyNavbarStyles(color, textColor) {
        console.log(`🎨 _applyNavbarStyles: ${color} / ${textColor}`);
        
        const navbars = this._getElementsOnce('.hospital-navbar, nav.hospital-navbar');
        
        navbars.forEach(navbar => {
            this._styleElementRecursively(navbar, color, textColor, {
                isRoot: true,
                skipThemeManager: true,
                handleDropdowns: true
            });
        });
        
        console.log(`✅ Navbar styles applied`);
    }

    // Sidebar Styling
    _applySidebarStyles(color, textColor, root) {
        const sidebarSelectors = [
            '.hospital-sidebar', '.sidebar', '[class*="sidebar"]',
            'aside', 'nav[role="navigation"]', '.nav-sidebar',
            '.side-nav', '.side-navigation', '.main-sidebar', '#sidebar'
        ].join(', ');
        
        const sidebars = this._getElementsOnce(sidebarSelectors);
        
        sidebars.forEach(sidebar => {
            this._styleElementRecursively(sidebar, color, textColor, {
                isRoot: true,
                skipThemeManager: true
            });
        });
        
        this._applySidebarScrollbarStyles(color, root);
        console.log(`✅ Sidebar styles applied`);
    }

    _applySidebarScrollbarStyles(color, root) {
        const sidebarScrollbarColor = this._adjustColorOpacity(color, 0.3);
        const sidebarScrollbarHoverColor = this._adjustColorOpacity(color, 0.5);

        root.style.setProperty('--sidebar-scrollbar-color', sidebarScrollbarColor);
        root.style.setProperty('--sidebar-scrollbar-hover-color', sidebarScrollbarHoverColor);

        this._createOrUpdateStyle('sidebar-scrollbar', `
            .hospital-sidebar::-webkit-scrollbar-thumb {
                background-color: ${sidebarScrollbarColor} !important;
            }
            .hospital-sidebar::-webkit-scrollbar-thumb:hover {
                background-color: ${sidebarScrollbarHoverColor} !important;
            }
        `);
    }

    // Background Styling
    _applyBackgroundStyles(color, textColor, root) {
        this._setCSSVariables(root, 'content', color, textColor);
        this._setCSSVariables(root, 'bg', color, textColor);
        
        const contentArea = this._findMainContentArea();
        if (contentArea) {
            this._styleContentArea(contentArea, color);
        } else {
            document.body.style.backgroundColor = color;
        }

        console.log(`✅ Background styles applied`);
    }

    _findMainContentArea() {
        const contentSelectors = [
            '.hospital-content', 'main.hospital-main', 'main',
            '.content-area', '.main-content'
        ];

        for (const selector of contentSelectors) {
            const contentArea = document.querySelector(selector);
            if (contentArea) return contentArea;
        }
        return null;
    }

    _styleContentArea(contentArea, color) {
        contentArea.style.backgroundColor = color;

        const textElements = contentArea.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, span, div:not([class*="bg-"]), a:not([class*="bg-"]), label'
        );
        
        const defaultTextColor = this._getDefaultContentTextColor();
        
        textElements.forEach(textEl => {
            if (!textEl.closest('.hospital-navbar') &&
                !textEl.closest('.hospital-sidebar') &&
                !textEl.style.backgroundColor &&
                !textEl.classList.contains('bg-')) {
                
                textEl.style.color = defaultTextColor;
                textEl.style.setProperty('color', defaultTextColor, 'important');
            }
        });
        
        console.log(`📝 Content area styled with background: ${color}`);
    }

    // Accent Styling
    _applyAccentStyles(color, textColor) {
        const accentSelectors = [
            '.btn-primary', '.gqa-btn.primary', '.text-blue-500',
            '.bg-blue-500', '.border-blue-500', '[class*="accent"]',
            '.highlight', '.primary-action'
        ];
        
        const accentElements = this._getElementsOnce(accentSelectors.join(', '));
        
        accentElements.forEach(element => {
            if (element.classList.contains('bg-blue-500') ||
                element.classList.contains('btn-primary') ||
                element.classList.contains('primary')) {
                
                element.style.backgroundColor = color;
                element.style.setProperty('background-color', color, 'important');
                element.style.color = textColor;
                element.style.setProperty('color', textColor, 'important');
            }
        });
        
        console.log(`✅ Accent styles applied`);
    }

    // Unified Element Styling
    _styleElementRecursively(element, color, textColor, options = {}) {
        const {
            isRoot = false,
            skipThemeManager = true,
            handleDropdowns = false
        } = options;

        if (!element) return;

        try {
            if (skipThemeManager && this._isThemeManagerElement(element)) {
                return;
            }

            // Style root element
            if (isRoot && element.style) {
                element.style.backgroundColor = color;
                element.style.color = textColor;
            }

            // Handle different element types
            this._applyElementStyles(element, color, textColor, handleDropdowns);

            // Recursively style children
            if (element.children) {
                Array.from(element.children).forEach(child => {
                    if (this._shouldApplyStyle(child, skipThemeManager)) {
                        this._styleElementRecursively(child, color, textColor, {
                            ...options,
                            isRoot: false
                        });
                    }
                });
            }
        } catch (e) {
            console.warn('Error styling element recursively:', element, e);
        }
    }

    _applyElementStyles(element, color, textColor, handleDropdowns) {
        if (!element || !element.tagName) return;
        
        try {
            const tagName = element.tagName.toLowerCase();
            
            // Handle dropdowns specially
            if (handleDropdowns && this._isDropdownElement(element)) {
                this._styleDropdownElement(element, color);
                return;
            }

            // Handle specific element types
            switch (tagName) {
                case 'a':
                    this._styleLink(element, textColor);
                    break;
                case 'button':
                    if (!this._isThemeManagerElement(element)) {
                        this._styleButton(element, textColor);
                    }
                    break;
                case 'svg':
                    if (!this._isThemeManagerElement(element)) {
                        this._styleSVG(element, textColor);
                    }
                    break;
                default:
                    if (this._shouldApplyStyle(element) && element.style) {
                        element.style.color = textColor;
                        element.style.setProperty('color', textColor, 'important');
                    }
                    break;
            }

            // Handle special classes
            this._handleSpecialElements(element, color, textColor);
        } catch (e) {
            console.warn('Error applying element styles:', element, e);
        }
    }

    _styleDropdownElement(dropdown, color) {
        // Apply navbar background to dropdown
        dropdown.style.backgroundColor = color;
        dropdown.style.setProperty('background-color', color, 'important');
        
        // Calculate appropriate text color for dropdown
        const dropdownTextColor = this._getDropdownTextColor(color);
        dropdown.style.color = dropdownTextColor;
        dropdown.style.setProperty('color', dropdownTextColor, 'important');
        
        // Remove conflicting classes
        this._removeConflictingClasses(dropdown);
        
        // Style all dropdown items
        const dropdownItems = dropdown.querySelectorAll('*');
        dropdownItems.forEach(item => {
            if (!this._isPresetButton(item) && !this._isThemeManagerElement(item)) {
                this._removeConflictingClasses(item);
                
                item.style.backgroundColor = color;
                item.style.setProperty('background-color', color, 'important');
                item.style.color = dropdownTextColor;
                item.style.setProperty('color', dropdownTextColor, 'important');
                
                if (item.tagName === 'SVG') {
                    item.style.fill = dropdownTextColor;
                    item.style.stroke = dropdownTextColor;
                }
            }
        });
        
        console.log(`📋 Dropdown styled: BG=${color}, Text=${dropdownTextColor}`);
    }

    _handleSpecialElements(element, color, textColor) {
        // Quick stat badges
        if (element.classList.contains('quick-stat-badge') ||
            element.classList.contains('stat-value') ||
            element.classList.contains('stat-label') ||
            element.closest('.quick-stat-badge')) {
            
            if (element.classList.contains('quick-stat-badge')) {
                element.style.backgroundColor = color;
                element.style.borderColor = textColor;
            }
            element.style.color = textColor;
            element.style.setProperty('color', textColor, 'important');
        }
    }

    // Element Type Styling Methods
    _styleLink(link, textColor) {
        if (this._shouldApplyStyle(link)) {
            link.style.color = textColor;
            link.style.setProperty('color', textColor, 'important');
            
            // Clean up old event listeners
            this._cleanupElementListeners(link);
            
            // Add hover effects
            const mouseEnterHandler = () => link.style.setProperty('opacity', '0.8', 'important');
            const mouseLeaveHandler = () => link.style.removeProperty('opacity');
            
            link.addEventListener('mouseenter', mouseEnterHandler);
            link.addEventListener('mouseleave', mouseLeaveHandler);
            
            this.eventListeners.add({ element: link, type: 'mouseenter', handler: mouseEnterHandler });
            this.eventListeners.add({ element: link, type: 'mouseleave', handler: mouseLeaveHandler });
        }
    }

    _styleButton(button, textColor) {
        if (this._shouldApplyStyle(button)) {
            button.style.color = textColor;
            button.style.borderColor = textColor;
            button.style.setProperty('color', textColor, 'important');
        }
    }

    _styleSVG(svg, textColor) {
        svg.style.fill = textColor;
        svg.style.stroke = textColor;
        svg.style.setProperty('fill', textColor, 'important');
        svg.style.setProperty('stroke', textColor, 'important');
    }

    // Text Contrast and Color Utilities
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
                    this._applyContrastToChildren(element, contrastColor);
                }
            }
        });
    }

    _applyContrastToChildren(element, contrastColor) {
        if (!element.classList.toString().includes('dark:')) {
            element.style.color = contrastColor;

            const children = element.querySelectorAll(
                ':scope > span, :scope > a, :scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > div:not([class*="bg-"]):not([style*="background"])'
            );
            
            children.forEach(child => {
                if (this._shouldApplyStyle(child, false)) {
                    child.style.color = contrastColor;
                }
            });
        }
    }

    _getDefaultContentTextColor() {
        const isDarkMode = document.documentElement.classList.contains('dark');
        return isDarkMode ? '#f8fafc' : '#1f2937';
    }

    _getDropdownTextColor(navbarBackgroundColor) {
        if (navbarBackgroundColor && ColorUtils.isValidHexColor(navbarBackgroundColor)) {
            return ColorUtils.getSmartContrastColor(navbarBackgroundColor, {
                lightColor: '#ffffff',
                darkColor: '#1f2937',
                mediumLightColor: '#f9fafb',
                mediumDarkColor: '#374151'
            });
        }
        
        const isDarkMode = document.documentElement.classList.contains('dark');
        return isDarkMode ? '#f8fafc' : '#1f2937';
    }

    // Utility Methods
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

    _adjustColorOpacity(color, opacity) {
        if (!color.startsWith('#')) return color;

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    _classNameIncludes(element, searchText) {
        if (!element || !element.classList || !searchText) return false;
        
        for (let className of element.classList) {
            if (className.includes(searchText)) {
                return true;
            }
        }
        
        return false;
    }

    _getElementClassName(element) {
        if (!element) return '';
        
        // Handle elements without className property
        if (!element.className) return '';
        
        // Handle string className (most common case)
        if (typeof element.className === 'string') {
            return element.className;
        }
        
        // Handle SVGAnimatedString and other objects
        if (element.className.baseVal !== undefined) {
            return element.className.baseVal || '';
        }
        
        // Fallback to toString() for other object types
        try {
            return element.className.toString() || '';
        } catch (e) {
            console.warn('Failed to get className for element:', element, e);
            return '';
        }
    }

    _removeConflictingClasses(element) {
        if (!element || !element.classList) return;
        
        const conflictingClasses = [
            // Background classes
            'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300',
            'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800',
            'bg-gray-900', 'bg-transparent',
            // Text classes
            'text-white', 'text-gray-50', 'text-gray-100', 'text-gray-200', 'text-gray-300',
            'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800',
            'text-gray-900', 'text-black',
            // Dark mode classes
            'dark:bg-white', 'dark:bg-gray-50', 'dark:bg-gray-100', 'dark:bg-gray-200',
            'dark:bg-gray-300', 'dark:bg-gray-400', 'dark:bg-gray-500', 'dark:bg-gray-600',
            'dark:bg-gray-700', 'dark:bg-gray-800', 'dark:bg-gray-900', 'dark:bg-transparent',
            'dark:text-white', 'dark:text-gray-50', 'dark:text-gray-100', 'dark:text-gray-200',
            'dark:text-gray-300', 'dark:text-gray-400', 'dark:text-gray-500', 'dark:text-gray-600',
            'dark:text-gray-700', 'dark:text-gray-800', 'dark:text-gray-900', 'dark:text-black'
        ];
        
        try {
            conflictingClasses.forEach(className => {
                if (element.classList.contains(className)) {
                    element.classList.remove(className);
                }
            });
        } catch (e) {
            console.warn('Error removing conflicting classes:', element, e);
        }
    }

    _createOrUpdateStyle(id, css) {
        const existingStyle = document.head.querySelector(`style[data-${id}]`);
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.textContent = css;
        style.setAttribute(`data-${id}`, 'true');
        document.head.appendChild(style);
    }

    // Event Management
    _cleanupElementListeners(element) {
        this.eventListeners.forEach(listener => {
            if (listener.element === element) {
                element.removeEventListener(listener.type, listener.handler);
                this.eventListeners.delete(listener);
            }
        });
    }

    _cleanupAllListeners() {
        this.eventListeners.forEach(listener => {
            listener.element.removeEventListener(listener.type, listener.handler);
        });
        this.eventListeners.clear();
    }

    _cleanupMutationObservers() {
        this.mutationObservers.forEach(observer => {
            observer.disconnect();
        });
        this.mutationObservers.clear();
    }

    // Reset Functionality
    reset() {
        console.log('🔄 Starting comprehensive theme reset...');
        
        const root = document.documentElement;
        
        // Clean up event listeners and observers
        this._cleanupAllListeners();
        this._cleanupMutationObservers();
        this._clearElementCache();
        
        // Remove CSS variables
        ['navbar', 'sidebar', 'content', 'bg', 'accent'].forEach(type => {
            root.style.removeProperty(`--${type}-bg`);
            root.style.removeProperty(`--${type}-text`);
        });
        
        root.style.removeProperty('--gqa-primary');
        root.style.removeProperty('--gqa-secondary');
        
        // Reset all elements
        this._resetAllElements();
        
        // Remove dynamic styles
        const dynamicStyles = document.querySelectorAll('style[data-theme], style[data-sidebar-scrollbar]');
        dynamicStyles.forEach(style => style.remove());
        
        console.log('✅ Comprehensive theme reset completed');
    }

    _resetAllElements() {
        const allElements = document.querySelectorAll('*');
        let resetCount = 0;
        
        allElements.forEach(element => {
            if (!this._isThemeManagerElement(element)) {
                const hadStyles = element.hasAttribute('style');
                
                const stylesToRemove = [
                    'background-color', 'color', 'border-color', 'fill', 'stroke', 
                    'background-image', 'background', 'border', 'opacity'
                ];
                
                stylesToRemove.forEach(prop => {
                    element.style.removeProperty(prop);
                });
                
                if (hadStyles && !element.getAttribute('style')) {
                    element.removeAttribute('style');
                    resetCount++;
                }
            }
        });
        
        console.log(`🔄 Reset ${resetCount} elements`);
    }

    // Dynamic Color Application Setup
    setupDynamicNavbarColorApplication() {
        console.log('🎨 Setting up dynamic navbar color application');
        
        const navbar = document.querySelector('.hospital-navbar, nav.hospital-navbar');
        if (!navbar) {
            console.warn('⚠️ Navbar not found');
            return;
        }

        if (window.hasCustomTheme && window.userTheme) {
            console.log('🎨 Applying initial navbar colors');
            this._applyNavbarStyles(window.userTheme.navbar);
        }

        const observer = new MutationObserver((mutations) => {
            let shouldReapply = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && 
                    (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    shouldReapply = true;
                }
                
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    shouldReapply = true;
                }
            });

            if (shouldReapply && window.hasCustomTheme && window.userTheme) {
                console.log('🎨 DOM changes detected, reapplying navbar colors');
                setTimeout(() => {
                    this._applyNavbarStyles(window.userTheme.navbar);
                }, 100);
            }
        });

        observer.observe(navbar, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        this.mutationObservers.add(observer);
        console.log('✅ Dynamic navbar color application setup complete');
    }

    // Cleanup method to be called when the instance is no longer needed
    destroy() {
        this._cleanupAllListeners();
        this._cleanupMutationObservers();
        this._clearElementCache();
    }
}