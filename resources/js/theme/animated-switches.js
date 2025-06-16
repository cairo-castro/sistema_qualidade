export class AnimatedSwitches {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.switches = new Map();
        this.animationDuration = 300;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) {
            console.log('⚠️ Animated switches already initialized');
            return;
        }

        console.log('🎬 Initializing animated theme switches...');
        this._setupAnimatedThemeSwitches();
        this._setupDarkModeAnimations();
        this.initialized = true;
        console.log('✅ Animated theme switches initialized');
    }

    _setupAnimatedThemeSwitches() {
        const themeSwitches = document.querySelectorAll('[data-theme-switch]');
        console.log(`🎬 Found ${themeSwitches.length} theme switches to animate`);

        themeSwitches.forEach((switchElement, index) => {
            const switchId = `theme-switch-${index}`;
            const themeType = switchElement.getAttribute('data-theme-switch');
            
            this.switches.set(switchId, {
                element: switchElement,
                type: themeType,
                isAnimating: false
            });

            this._attachSwitchListeners(switchElement, switchId, themeType);
            console.log(`🎬 Setup animated switch ${switchId} for type: ${themeType}`);
        });
    }

    _attachSwitchListeners(element, switchId, themeType) {
        const originalHandler = element.onclick;
        
        element.onclick = (event) => {
            event.preventDefault();
            this.handleThemeSwitch(switchId, themeType, originalHandler);
        };

        element.addEventListener('mouseenter', () => {
            this._addHoverAnimation(element);
        });

        element.addEventListener('mouseleave', () => {
            this._removeHoverAnimation(element);
        });
    }

    async handleThemeSwitch(switchId, themeType, originalHandler) {
        const switchData = this.switches.get(switchId);
        if (!switchData) {
            console.error(`❌ Switch ${switchId} not found`);
            return;
        }

        if (switchData.isAnimating) {
            console.log(`⏳ Switch ${switchId} is already animating, skipping...`);
            return;
        }

        console.log(`🎬 Handling animated theme switch: ${switchId} (${themeType})`);

        try {
            switchData.isAnimating = true;
            await this._animateSwitchPress(switchData.element);
            
            if (themeType === 'light-dark') {
                await this._handleLightDarkSwitch(originalHandler);
            } else if (themeType.startsWith('preset-')) {
                const presetName = themeType.replace('preset-', '');
                await this._handlePresetSwitch(presetName);
            }

            await this._animateSwitchRelease(switchData.element);
        } catch (error) {
            console.error(`❌ Error in theme switch animation: ${error}`);
        } finally {
            switchData.isAnimating = false;
        }
    }

    async _animateSwitchPress(element) {
        return new Promise(resolve => {
            element.style.transition = `transform ${this.animationDuration}ms ease-in-out`;
            element.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                resolve();
            }, this.animationDuration * 0.3);
        });
    }

    async _animateSwitchRelease(element) {
        return new Promise(resolve => {
            element.style.transform = 'scale(1)';
            
            setTimeout(() => {
                element.style.transition = '';
                element.style.transform = '';
                resolve();
            }, this.animationDuration * 0.7);
        });
    }

    async _handleLightDarkSwitch(originalHandler) {
        if (!this.themeManager.canApplyLightDarkTheme()) {
            this._showThemeBlockedNotification();
            return;
        }

        await this.applyThemeWithAnimation('light-dark', () => {
            if (originalHandler) {
                originalHandler();
            } else {
                this._toggleLightDarkMode();
            }
        });
    }

    async _handlePresetSwitch(presetName) {
        await this.applyThemeWithAnimation('preset', () => {
            this.themeManager.applyPreset(presetName);
        });
    }

    async applyThemeWithAnimation(themeType, applyCallback) {
        console.log(`🎬 Applying theme with animation: ${themeType}`);

        try {
            this._showLoadingIndicator();
            await this._animateThemeTransition();
            
            if (applyCallback) {
                applyCallback();
            }

            await this._animateThemeComplete();
            this._hideLoadingIndicator();
            
            console.log(`✅ Theme animation completed for: ${themeType}`);
        } catch (error) {
            console.error(`❌ Theme animation error: ${error}`);
            this._hideLoadingIndicator();
        }
    }

    async _animateThemeTransition() {
        const overlay = this._createTransitionOverlay();
        document.body.appendChild(overlay);

        return new Promise(resolve => {
            requestAnimationFrame(() => {
                overlay.style.opacity = '0.8';
                setTimeout(() => {
                    resolve();
                }, this.animationDuration);
            });
        });
    }

    async _animateThemeComplete() {
        const overlay = document.querySelector('.theme-transition-overlay');
        if (!overlay) return;

        return new Promise(resolve => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                resolve();
            }, this.animationDuration);
        });
    }

    _createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(0,0,0,0.1), rgba(255,255,255,0.1));
            opacity: 0;
            transition: opacity ${this.animationDuration}ms ease-in-out;
            pointer-events: none;
            z-index: 9999;
        `;
        return overlay;
    }

    _showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'theme-loading-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid #ffffff40;
                    border-top: 2px solid #ffffff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <span>Aplicando tema...</span>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(indicator);
    }

    _hideLoadingIndicator() {
        const indicator = document.getElementById('theme-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    _showThemeBlockedNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>⚠️</span>
                <span>Tema personalizado ativo - modo claro/escuro desabilitado</span>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    _addHoverAnimation(element) {
        element.style.transition = 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
        element.style.transform = 'translateY(-1px)';
        element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    }

    _removeHoverAnimation(element) {
        element.style.transform = '';
        element.style.boxShadow = '';
    }

    _toggleLightDarkMode() {
        const isDark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', !isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');
        console.log(`🌓 Toggled to ${!isDark ? 'dark' : 'light'} mode`);
    }

    _setupDarkModeAnimations() {
        const darkModeButtons = document.querySelectorAll('button[onclick="toggleHospitalTheme()"]');
        
        darkModeButtons.forEach(button => {
            this._enhanceDarkModeButton(button);
        });

        console.log(`🌓 Enhanced ${darkModeButtons.length} dark mode buttons with animations`);
    }

    _enhanceDarkModeButton(button) {
        const originalOnClick = button.onclick;
        
        button.onclick = async (event) => {
            event.preventDefault();
            
            if (button.disabled) {
                this._showThemeBlockedNotification();
                return;
            }

            await this._animateSwitchPress(button);
            
            if (originalOnClick) {
                originalOnClick.call(button, event);
            } else {
                this._toggleLightDarkMode();
            }
            
            await this._animateSwitchRelease(button);
        };

        button.addEventListener('mouseenter', () => {
            if (!button.disabled) {
                this._addHoverAnimation(button);
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                this._removeHoverAnimation(button);
            }
        });
    }

    enableDarkModeSwitch() {
        const switches = document.querySelectorAll('button[onclick="toggleHospitalTheme()"], [data-theme-toggle]');
        
        switches.forEach(switchElement => {
            switchElement.disabled = false;
            switchElement.classList.remove('opacity-50', 'cursor-not-allowed');
            switchElement.title = 'Alternar modo claro/escuro';
        });

        console.log(`🔓 Enabled ${switches.length} dark mode switches`);
    }

    disableDarkModeSwitch() {
        const switches = document.querySelectorAll('button[onclick="toggleHospitalTheme()"], [data-theme-toggle]');
        
        switches.forEach(switchElement => {
            switchElement.disabled = true;
            switchElement.classList.add('opacity-50', 'cursor-not-allowed');
            switchElement.title = 'Tema personalizado ativo - modo claro/escuro desabilitado';
        });

        console.log(`🔒 Disabled ${switches.length} dark mode switches`);
    }

    updateSwitchState(switchId, enabled) {
        const switchData = this.switches.get(switchId);
        if (!switchData) return;

        switchData.element.disabled = !enabled;
        
        if (enabled) {
            switchData.element.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            switchData.element.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    getSwitchState(switchId) {
        const switchData = this.switches.get(switchId);
        return switchData ? !switchData.element.disabled : false;
    }

    getAllSwitches() {
        return Array.from(this.switches.entries()).map(([id, data]) => ({
            id,
            type: data.type,
            enabled: !data.element.disabled,
            isAnimating: data.isAnimating
        }));
    }

    destroy() {
        this.switches.forEach((switchData, switchId) => {
            switchData.element.onclick = null;
            switchData.element.style.transition = '';
            switchData.element.style.transform = '';
        });

        this.switches.clear();
        
        const overlay = document.querySelector('.theme-transition-overlay');
        if (overlay) overlay.remove();
        
        const indicator = document.getElementById('theme-loading-indicator');
        if (indicator) indicator.remove();

        this.initialized = false;
        console.log('🧹 Animated switches destroyed');
    }
}