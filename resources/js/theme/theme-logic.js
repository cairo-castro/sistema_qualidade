export class ThemeLogic {
    constructor() {
        this.initialized = false;
        this.processingEvent = false; // Prevent infinite recursion
    }

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
    }

    initializeThemeBusinessRules() {
        if (this.initialized) {
            console.log('⚠️ Theme business rules already initialized, skipping...');
            return;
        }

        console.log('🏢 Initializing theme business rules...');

        this.manageDarkModeSwitchVisibility();
        this.setupThemeStateListeners();
        this.validateThemeConsistency();

        this.initialized = true;
        console.log('✅ Theme business rules initialized successfully');
    }

    manageDarkModeSwitchVisibility() {
        console.log('🌓 Managing dark mode switch visibility based on custom theme state');

        const darkModeSwitch = document.querySelector('button[onclick="toggleHospitalTheme()"]');
        const darkModeSwitches = document.querySelectorAll('[data-theme-toggle], [data-dark-mode-toggle]');

        const allSwitches = darkModeSwitch ? [darkModeSwitch, ...darkModeSwitches] : [...darkModeSwitches];

        allSwitches.forEach((switchElement, index) => {
            if (!switchElement) return;

            console.log(`🌓 Processing dark mode switch ${index + 1}:`, switchElement.className || switchElement.tagName);

            if (window.hasCustomTheme) {
                this._disableDarkModeSwitch(switchElement);
            } else {
                this._enableDarkModeSwitch(switchElement);
            }
        });

        if (allSwitches.length === 0) {
            console.log('⚠️ No dark mode switches found in DOM');
        } else {
            console.log(`✅ Processed ${allSwitches.length} dark mode switches`);
        }
    }

    _disableDarkModeSwitch(switchElement) {
        switchElement.disabled = true;
        switchElement.classList.add('opacity-50', 'cursor-not-allowed');
        switchElement.title = 'Tema personalizado ativo - modo claro/escuro desabilitado';
        
        const label = switchElement.closest('label') || switchElement.querySelector('label');
        if (label) {
            label.classList.add('opacity-50', 'cursor-not-allowed');
        }

        console.log('🔒 Dark mode switch disabled due to custom theme');
    }

    _enableDarkModeSwitch(switchElement) {
        switchElement.disabled = false;
        switchElement.classList.remove('opacity-50', 'cursor-not-allowed');
        switchElement.title = 'Alternar modo claro/escuro';
        
        const label = switchElement.closest('label') || switchElement.querySelector('label');
        if (label) {
            label.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        console.log('🔓 Dark mode switch enabled (no custom theme active)');
    }

    setupThemeStateListeners() {
        window.addEventListener('themeActivated', () => {
            if (this.processingEvent) {
                console.log('📢 Ignoring themeActivated event - already processing');
                return;
            }
            console.log('📢 Custom theme activated - triggering business rules');
            this.onCustomThemeActivated();
        });

        window.addEventListener('themeReset', () => {
            if (this.processingEvent) {
                console.log('📢 Ignoring themeReset event - already processing');
                return;
            }
            console.log('📢 Theme reset - triggering business rules');
            this.onThemeResetToDefault();
        });

        console.log('👂 Theme state listeners setup complete');
    }

    onCustomThemeActivated() {
        if (this.processingEvent) {
            console.log('🎨 Already processing theme activation, skipping...');
            return;
        }
        
        this.processingEvent = true;
        console.log('🎨 Executing custom theme activation business rules');

        window.hasCustomTheme = true;
        window.isCustomActive = true;

        this.manageDarkModeSwitchVisibility();
        this._updateThemeIndicators('custom');
        
        // Don't trigger recursive events

        console.log('✅ Custom theme activation business rules completed');
        this.processingEvent = false;
    }

    onThemeResetToDefault() {
        if (this.processingEvent) {
            console.log('🔄 Already processing theme reset, skipping...');
            return;
        }
        
        this.processingEvent = true;
        console.log('🔄 Executing theme reset business rules');

        window.hasCustomTheme = false;
        window.isCustomActive = false;

        this.manageDarkModeSwitchVisibility();
        this._updateThemeIndicators('default');
        
        // Don't trigger recursive events

        console.log('✅ Theme reset business rules completed');
        this.processingEvent = false;
    }

    _updateThemeIndicators(themeType) {
        const indicators = document.querySelectorAll('[data-theme-indicator]');
        indicators.forEach(indicator => {
            if (themeType === 'custom') {
                indicator.textContent = 'Tema Personalizado';
                indicator.classList.add('text-blue-600', 'font-semibold');
                indicator.classList.remove('text-gray-500');
            } else {
                indicator.textContent = 'Tema Padrão';
                indicator.classList.add('text-gray-500');
                indicator.classList.remove('text-blue-600', 'font-semibold');
            }
        });

        console.log(`📊 Updated ${indicators.length} theme indicators to: ${themeType}`);
    }

    _triggerThemeActivatedEvent() {
        const event = new CustomEvent('themeActivated', {
            detail: {
                timestamp: new Date().toISOString(),
                hasCustomTheme: true
            }
        });
        window.dispatchEvent(event);
        console.log('📢 Dispatched themeActivated event');
    }

    _triggerThemeResetEvent() {
        const event = new CustomEvent('themeReset', {
            detail: {
                timestamp: new Date().toISOString(),
                hasCustomTheme: false
            }
        });
        window.dispatchEvent(event);
        console.log('📢 Dispatched themeReset event');
    }

    validateThemeConsistency() {
        console.log('🔍 Validating theme consistency...');

        const hasCustomTheme = window.hasCustomTheme;
        const userTheme = window.userTheme;
        const isCustomActive = window.isCustomActive;

        const inconsistencies = [];

        if (hasCustomTheme && !userTheme) {
            inconsistencies.push('hasCustomTheme is true but userTheme is null');
        }

        if (!hasCustomTheme && userTheme) {
            inconsistencies.push('hasCustomTheme is false but userTheme exists');
        }

        if (hasCustomTheme !== isCustomActive) {
            inconsistencies.push(`hasCustomTheme (${hasCustomTheme}) doesn't match isCustomActive (${isCustomActive})`);
        }

        if (userTheme) {
            const requiredFields = ['navbar_color', 'sidebar_color', 'background_color'];
            const missingFields = requiredFields.filter(field => !userTheme[field]);
            if (missingFields.length > 0) {
                inconsistencies.push(`userTheme missing fields: ${missingFields.join(', ')}`);
            }
        }

        if (inconsistencies.length > 0) {
            console.warn('⚠️ Theme consistency issues found:');
            inconsistencies.forEach((issue, index) => {
                console.warn(`   ${index + 1}. ${issue}`);
            });
            return false;
        }

        console.log('✅ Theme consistency validation passed');
        return true;
    }

    enforceThemeRules() {
        console.log('🔐 Enforcing theme rules...');

        if (window.hasCustomTheme) {
            this._enforceCustomThemeRules();
        } else {
            this._enforceDefaultThemeRules();
        }

        console.log('✅ Theme rules enforcement completed');
    }

    _enforceCustomThemeRules() {
        console.log('🎨 Enforcing custom theme rules');

        this.manageDarkModeSwitchVisibility();

        const themeButtons = document.querySelectorAll('[data-theme-switch="light-dark"]');
        themeButtons.forEach(button => {
            button.disabled = true;
            button.classList.add('opacity-50');
        });

        const customThemeWarning = document.querySelector('[data-custom-theme-warning]');
        if (customThemeWarning) {
            customThemeWarning.style.display = 'block';
        }
    }

    _enforceDefaultThemeRules() {
        console.log('🎯 Enforcing default theme rules');

        this.manageDarkModeSwitchVisibility();

        const themeButtons = document.querySelectorAll('[data-theme-switch="light-dark"]');
        themeButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('opacity-50');
        });

        const customThemeWarning = document.querySelector('[data-custom-theme-warning]');
        if (customThemeWarning) {
            customThemeWarning.style.display = 'none';
        }
    }

    canApplyLightDarkTheme() {
        const canApply = !window.hasCustomTheme;
        console.log(`🤔 Can apply light/dark theme: ${canApply}`);
        return canApply;
    }

    shouldShowThemeManager() {
        return true;
    }

    shouldAllowThemeCustomization() {
        return true;
    }

    getThemeConstraints() {
        return {
            allowLightDark: !window.hasCustomTheme,
            allowCustomColors: true,
            allowPresets: true,
            requireValidHexColors: true,
            maxCustomThemes: 1
        };
    }

    validateThemeTransition(fromTheme, toTheme) {
        console.log(`🔄 Validating theme transition: ${fromTheme} → ${toTheme}`);

        const validTransitions = {
            'default': ['custom', 'preset'],
            'custom': ['default', 'preset'],
            'preset': ['default', 'custom']
        };

        const isValid = validTransitions[fromTheme]?.includes(toTheme) ?? false;
        console.log(`✅ Transition ${fromTheme} → ${toTheme} is ${isValid ? 'valid' : 'invalid'}`);
        
        return isValid;
    }

    applyBusinessRulesAfterThemeChange(themeType) {
        console.log(`🏢 Applying business rules after theme change to: ${themeType}`);

        switch (themeType) {
            case 'custom':
                this.onCustomThemeActivated();
                break;
            case 'default':
                this.onThemeResetToDefault();
                break;
            case 'preset':
                this.onCustomThemeActivated();
                break;
        }

        this.enforceThemeRules();
        this.validateThemeConsistency();
    }

    logThemeState() {
        console.group('🎨 Current Theme State');
        console.log('hasCustomTheme:', window.hasCustomTheme);
        console.log('isCustomActive:', window.isCustomActive);
        console.log('userTheme:', window.userTheme);
        console.log('Theme constraints:', this.getThemeConstraints());
        console.groupEnd();
    }
}