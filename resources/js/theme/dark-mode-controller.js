/**
 * Dark Mode Controller
 * Manages dark mode toggle visibility and forces light mode when custom themes are active
 */
export class DarkModeController {
    constructor() {
        this.darkModeToggles = [];
        this.customThemeNotices = [];
        this.originalDarkModeState = null;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🌙 Initializing Dark Mode Controller');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
        
        this.isInitialized = true;
    }

    setup() {
        this.findDarkModeElements();
        this.setupEventListeners();
        this.updateVisibility();
        
        console.log('✅ Dark Mode Controller initialized');
    }

    findDarkModeElements() {
        // Find all dark mode toggles
        this.darkModeToggles = [
            ...document.querySelectorAll('.hs-theme-switch'),
            ...document.querySelectorAll('[data-hs-theme-switch]')
        ];
        
        // Find custom theme notices
        this.customThemeNotices = document.querySelectorAll('[x-show*="hasCustomTheme"]');
        
        console.log(`🔍 Found ${this.darkModeToggles.length} dark mode toggles`);
    }

    setupEventListeners() {
        // Listen for theme state changes
        this.setupThemeStateWatcher();
        
        // Listen for storage changes (for cross-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'hasCustomTheme' || e.key === 'userTheme') {
                this.updateVisibility();
            }
        });
    }

    setupThemeStateWatcher() {
        // Watch for changes in window.hasCustomTheme
        let lastCustomThemeState = window.hasCustomTheme;
        
        const checkThemeState = () => {
            const currentState = window.hasCustomTheme;
            
            if (currentState !== lastCustomThemeState) {
                console.log(`🔄 Theme state changed: ${lastCustomThemeState} → ${currentState}`);
                this.handleThemeStateChange(currentState);
                lastCustomThemeState = currentState;
            }
        };
        
        // Check every 100ms for theme state changes
        setInterval(checkThemeState, 100);
        
        // Also watch for theme manager events
        document.addEventListener('themeApplied', () => {
            setTimeout(() => this.updateVisibility(), 50);
        });
        
        document.addEventListener('themeReset', () => {
            setTimeout(() => this.updateVisibility(), 50);
        });
    }

    handleThemeStateChange(hasCustomTheme) {
        if (hasCustomTheme) {
            this.onCustomThemeActivated();
        } else {
            this.onCustomThemeDeactivated();
        }
        
        this.updateVisibility();
    }

    onCustomThemeActivated() {
        console.log('🎨 Custom theme activated - managing dark mode');
        
        // Store current dark mode state
        this.originalDarkModeState = this.isDarkModeActive();
        
        // Force light mode if dark mode is currently active
        if (this.originalDarkModeState) {
            console.log('🌞 Forcing light mode');
            this.forceLightMode();
        }
        
        // Hide dark mode toggles
        this.hideDarkModeToggles();
        
        // Show custom theme notices
        this.showCustomThemeNotices();
    }

    onCustomThemeDeactivated() {
        console.log('🌙 Custom theme deactivated - restoring dark mode controls');
        
        // Show dark mode toggles
        this.showDarkModeToggles();
        
        // Hide custom theme notices
        this.hideCustomThemeNotices();
        
        // Restore original dark mode state if it was previously active
        if (this.originalDarkModeState) {
            console.log('🌙 Restoring dark mode');
            setTimeout(() => this.restoreDarkMode(), 200);
        }
        
        this.originalDarkModeState = null;
    }

    isDarkModeActive() {
        return document.documentElement.classList.contains('dark') ||
               document.documentElement.hasAttribute('data-theme') ||
               localStorage.getItem('hs_theme') === 'dark';
    }

    forceLightMode() {
        console.log('🌞 Starting comprehensive light mode restoration...');
        
        // 1. Remove dark classes from document (Tailwind control points)
        document.documentElement.classList.remove('dark', 'hs-dark-mode-active');
        document.documentElement.removeAttribute('data-theme');
        // Don't remove dark class from body - it's not needed and may cause issues
        
        // 2. Update all localStorage theme keys
        localStorage.setItem('hs_theme', 'light');
        localStorage.setItem('theme', 'light');
        localStorage.removeItem('darkMode');
        
        // 3. Clear custom CSS variables that might interfere
        this._clearDarkModeVariables();
        
        // 3.5. Clear any theme-related inline styles
        this._clearThemeInlineStyles();
        
        // 4. Reset Preline UI components
        this._resetPrelineUI();
        
        // 5. Clean up any stuck dark mode classes
        this._removeDarkModeClasses();
        
        // 5.5. Reset color applier interference
        this._resetColorApplierInterference();
        
        // 6. Update all dark mode checkboxes and switches
        this.updateDarkModeCheckboxes(false);
        this._updateThemeSwitchVisuals(false);
        
        // 7. Force Tailwind default styles restoration
        this._restoreTailwindDefaults();
        
        // 8. Clean up dropdown specific issues
        this._fixDropdownDarkMode(false);
        
        // 9. Force style recalculation
        this._forceStyleRecalculation();
        
        console.log('✅ Comprehensive light mode restoration completed');
    }

    restoreDarkMode() {
        console.log('🌙 Starting comprehensive dark mode restoration...');
        
        // 1. Add dark classes to document (Tailwind control points)
        document.documentElement.classList.add('dark', 'hs-dark-mode-active');
        document.documentElement.setAttribute('data-theme', 'dark');
        // Don't add dark class to body - Tailwind uses documentElement
        
        // 2. Update all localStorage theme keys
        localStorage.setItem('hs_theme', 'dark');
        localStorage.setItem('theme', 'dark');
        
        // 3. Reset Preline UI components
        this._resetPrelineUI();
        
        // 4. Update all dark mode checkboxes and switches
        this.updateDarkModeCheckboxes(true);
        this._updateThemeSwitchVisuals(true);
        
        // 5. Fix dropdown dark mode
        this._fixDropdownDarkMode(true);
        
        // 6. Force style recalculation
        this._forceStyleRecalculation();
        
        console.log('✅ Comprehensive dark mode restoration completed');
    }

    updateDarkModeCheckboxes(isDark) {
        const checkboxes = document.querySelectorAll('.hs-theme-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = isDark;
        });
    }

    hideDarkModeToggles() {
        this.darkModeToggles.forEach(toggle => {
            if (toggle) {
                // Use CSS transition for smooth hiding
                toggle.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
                toggle.style.opacity = '0';
                toggle.style.transform = 'scale(0.95)';
                toggle.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    if (toggle.style.opacity === '0') {
                        toggle.style.display = 'none';
                    }
                }, 200);
            }
        });
    }

    showDarkModeToggles() {
        this.darkModeToggles.forEach(toggle => {
            if (toggle) {
                toggle.style.display = '';
                toggle.style.pointerEvents = '';
                
                // Force reflow
                toggle.offsetHeight;
                
                toggle.style.opacity = '1';
                toggle.style.transform = 'scale(1)';
            }
        });
    }

    showCustomThemeNotices() {
        // Create and show custom theme notice if it doesn't exist
        const existingNotice = document.querySelector('.custom-theme-notice');
        if (!existingNotice) {
            this.createCustomThemeNotice();
        }
    }

    hideCustomThemeNotices() {
        const notices = document.querySelectorAll('.custom-theme-notice');
        notices.forEach(notice => {
            notice.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
            notice.style.opacity = '0';
            notice.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                if (notice.parentNode) {
                    notice.parentNode.removeChild(notice);
                }
            }, 200);
        });
    }

    createCustomThemeNotice() {
        // Find user dropdown menu
        const userDropdown = document.querySelector('.gqa-dropdown-item')?.closest('[x-show]');
        if (!userDropdown) return;
        
        // Create notice element
        const notice = document.createElement('div');
        notice.className = 'custom-theme-notice px-4 py-3 mx-2 mb-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg';
        notice.style.opacity = '0';
        notice.style.transform = 'scale(0.95)';
        notice.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
        
        notice.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span class="text-xs font-medium text-blue-700 dark:text-blue-400">Tema Personalizado Ativo</span>
            </div>
            <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">Modo claro/escuro desabilitado</p>
        `;
        
        // Find insertion point (before logout form)
        const logoutForm = userDropdown.querySelector('form[action*="logout"]');
        if (logoutForm) {
            logoutForm.parentNode.insertBefore(notice, logoutForm);
        } else {
            userDropdown.appendChild(notice);
        }
        
        // Animate in
        setTimeout(() => {
            notice.style.opacity = '1';
            notice.style.transform = 'scale(1)';
        }, 50);
    }

    updateVisibility() {
        const hasCustomTheme = window.hasCustomTheme;
        
        if (hasCustomTheme) {
            this.hideDarkModeToggles();
            this.showCustomThemeNotices();
        } else {
            this.showDarkModeToggles();
            this.hideCustomThemeNotices();
        }
    }

    // Helper Methods for Enhanced Light Mode Restoration
    _clearDarkModeVariables() {
        const root = document.documentElement;
        
        // Clear common dark mode CSS variables
        const darkModeVariables = [
            '--hs-dark-mode-active',
            '--dark-bg', '--dark-text', '--dark-border',
            '--theme-bg', '--theme-text', '--theme-accent',
            '--custom-bg', '--custom-text', '--custom-border'
        ];
        
        darkModeVariables.forEach(variable => {
            root.style.removeProperty(variable);
        });
        
        console.log('🧹 Cleared dark mode CSS variables');
    }

    _clearThemeInlineStyles() {
        // Clear ONLY custom theme inline styles, preserve Tailwind functionality
        const elementsToClean = [
            '.hospital-navbar', '.hospital-sidebar', '.hospital-content', '.hospital-main'
        ];
        
        elementsToClean.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style) {
                    // Only remove styles that were applied by our custom theme system
                    const stylesToCheck = ['background-color', 'color', 'border-color'];
                    
                    stylesToCheck.forEach(prop => {
                        const currentValue = element.style[prop];
                        // Only remove if it's a custom color (hex) or CSS variable, not default Tailwind
                        if (currentValue && (
                            currentValue.includes('#') ||
                            currentValue.includes('var(--navbar-') ||
                            currentValue.includes('var(--sidebar-') ||
                            currentValue.includes('var(--background-') ||
                            currentValue.includes('var(--gqa-')
                        )) {
                            element.style.removeProperty(prop);
                        }
                    });
                }
            });
        });
        
        console.log('🧹 Cleared custom theme inline styles only');
    }

    _restoreTailwindDefaults() {
        // ONLY remove inline styles that override Tailwind, don't add new ones
        const elementsToClean = [
            'body', 'html', 
            '.hospital-navbar', '.hospital-sidebar', '.hospital-content', '.hospital-main'
        ];

        elementsToClean.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style) {
                    // Remove inline styles to let Tailwind CSS classes work
                    const stylesToRemove = ['background-color', 'color', 'border-color'];
                    stylesToRemove.forEach(prop => {
                        const currentValue = element.style[prop];
                        // Only remove if it looks like a custom override
                        if (currentValue && (
                            currentValue.includes('#') ||
                            currentValue.includes('rgb') ||
                            currentValue.includes('var(--')
                        )) {
                            element.style.removeProperty(prop);
                        }
                    });
                }
            });
        });

        // DO NOT remove Tailwind dark mode classes - they're needed for proper functionality!
        // The .dark class on documentElement controls everything

        console.log('🎨 Removed inline style overrides to restore Tailwind functionality');
    }

    _resetColorApplierInterference() {
        // Clear only custom theme CSS variables, preserve system functionality
        const root = document.documentElement;
        
        // Remove ONLY custom theme CSS variables that interfere with dark mode
        const customThemeVariables = [
            '--navbar-bg', '--navbar-text',
            '--sidebar-bg', '--sidebar-text', 
            '--background-bg', '--background-text',
            '--accent-bg', '--accent-text',
            '--content-bg', '--content-text',
            '--bg-bg', '--bg-text',
            '--gqa-primary', '--gqa-secondary'
        ];
        
        customThemeVariables.forEach(variable => {
            root.style.removeProperty(variable);
        });
        
        // Only remove custom theme dynamic styles, not all styles
        const customStyles = document.querySelectorAll('style[data-theme]');
        customStyles.forEach(style => {
            try {
                style.remove();
            } catch (e) {
                console.warn('Could not remove custom style:', e);
            }
        });
        
        console.log('🧹 Cleared custom theme variables only');
    }

    _resetPrelineUI() {
        // Reset Preline UI theme appearance
        if (window.HSThemeAppearance) {
            try {
                if (window.HSThemeAppearance.setAppearance) {
                    const targetTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                    window.HSThemeAppearance.setAppearance(targetTheme, false);
                }
                
                // Force Preline to re-check theme state
                if (window.HSThemeAppearance.init) {
                    window.HSThemeAppearance.init();
                }
            } catch (e) {
                console.warn('⚠️ Error resetting Preline UI:', e);
            }
        }
        
        console.log('🔄 Reset Preline UI components');
    }

    _removeDarkModeClasses() {
        // Only remove dark mode classes from elements that shouldn't have them
        // Keep Tailwind dark: classes intact!
        
        // Only clean specific elements that might have manual dark classes
        const elementsToClean = [
            '.hospital-navbar', '.hospital-sidebar', '.hospital-content', '.hospital-main'
        ];
        
        elementsToClean.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    // Only remove our custom dark classes, not Tailwind ones
                    element.classList.remove('hs-dark-mode-active');
                    element.removeAttribute('data-theme');
                    // DO NOT remove 'dark' class - that breaks Tailwind!
                }
            });
        });
        
        console.log('🧹 Removed custom dark mode classes (preserving Tailwind)');
    }

    _updateThemeSwitchVisuals(isDark) {
        // Update all theme switches to match state
        const themeSwitches = document.querySelectorAll('[data-hs-theme-switch]');
        
        themeSwitches.forEach(switchElement => {
            try {
                // Update switch container class
                if (isDark) {
                    switchElement.classList.add('hs-dark-mode-active');
                } else {
                    switchElement.classList.remove('hs-dark-mode-active');
                }
                
                // Update knob position and styling
                const knob = switchElement.querySelector('.transform, .transition-all');
                if (knob) {
                    if (isDark) {
                        knob.classList.add('translate-x-5', 'bg-slate-800');
                        knob.classList.remove('translate-x-0', 'bg-white');
                    } else {
                        knob.classList.add('translate-x-0', 'bg-white');
                        knob.classList.remove('translate-x-5', 'bg-slate-800');
                    }
                }
                
                // Update icon visibility
                const sunIcon = switchElement.querySelector('.sun-icon');
                const moonIcon = switchElement.querySelector('.moon-icon');
                
                if (sunIcon && moonIcon) {
                    if (isDark) {
                        sunIcon.style.opacity = '0';
                        moonIcon.style.opacity = '1';
                    } else {
                        sunIcon.style.opacity = '1';
                        moonIcon.style.opacity = '0';
                    }
                }
                
                // Update checkbox state
                const checkbox = switchElement.querySelector('.hs-theme-checkbox');
                if (checkbox) {
                    checkbox.checked = isDark;
                }
            } catch (e) {
                console.warn('⚠️ Error updating theme switch visual:', e);
            }
        });
        
        console.log(`🎨 Updated theme switch visuals for ${isDark ? 'dark' : 'light'} mode`);
    }

    _forceStyleRecalculation() {
        // Force browser to recalculate styles by accessing offsetHeight
        // This ensures all CSS changes take effect immediately
        try {
            document.documentElement.offsetHeight;
            document.body.offsetHeight;
            
            // Force recalculation on key elements
            const keyElements = document.querySelectorAll(
                '.hospital-navbar, .hospital-sidebar, .hospital-content, .hospital-main'
            );
            keyElements.forEach(element => {
                if (element) {
                    element.offsetHeight;
                }
            });
            
            // Trigger a resize event to ensure responsive elements update
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            console.warn('⚠️ Error forcing style recalculation:', e);
        }
        
        console.log('🔄 Forced style recalculation');
    }

    _fixDropdownDarkMode(isDark) {
        // Fix dropdown dark mode issues specifically
        const dropdowns = document.querySelectorAll(
            '.dropdown, .dropdown-menu, .hs-dropdown-menu, [x-show], [role="menu"]'
        );
        
        dropdowns.forEach(dropdown => {
            if (dropdown) {
                // Remove any inline styles that might override Tailwind
                const stylesToClear = ['background-color', 'color', 'border-color'];
                stylesToClear.forEach(prop => {
                    const currentValue = dropdown.style[prop];
                    if (currentValue && (currentValue.includes('#') || currentValue.includes('rgb'))) {
                        dropdown.style.removeProperty(prop);
                    }
                });
                
                // Ensure dropdown has correct Tailwind classes for dark mode
                if (isDark) {
                    // Add dark mode classes if missing
                    if (!dropdown.className.includes('dark:')) {
                        dropdown.classList.add('dark:bg-gray-800', 'dark:text-white', 'dark:border-gray-700');
                    }
                } else {
                    // For light mode, remove any stuck dark styling
                    dropdown.classList.remove('hs-dark-mode-active');
                    dropdown.removeAttribute('data-theme');
                }
            }
        });
        
        console.log(`🔧 Fixed dropdown dark mode for ${isDark ? 'dark' : 'light'} theme`);
    }

    // Public API methods
    refresh() {
        this.findDarkModeElements();
        this.updateVisibility();
    }

    destroy() {
        // Clean up event listeners and restore original state
        this.showDarkModeToggles();
        this.hideCustomThemeNotices();
        
        if (this.originalDarkModeState) {
            this.restoreDarkMode();
        }
    }
}

export default DarkModeController;