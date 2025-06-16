import { ThemeConfig } from '../config/theme-config.js';
import { ColorUtils } from '../utils/color-utils.js';
import { ColorApplier } from './color-applier.js';
import { PresetHandler } from './preset-handler.js';
import { ThemeStorage } from './theme-storage.js';
import { ThemeLogic } from './theme-logic.js';

export class ThemeManager {
    constructor() {
        this.open = false;
        this.loading = false;
        this.isResetting = false;
        this.isCustomActive = window.hasCustomTheme || false;
        this.applyTimeout = null;
        this.colors = {
            navbar: window.userTheme?.navbar_color || ThemeConfig.DEFAULT_COLORS.navbar,
            sidebar: window.userTheme?.sidebar_color || ThemeConfig.DEFAULT_COLORS.sidebar,
            background: window.userTheme?.background_color || ThemeConfig.DEFAULT_COLORS.background,
            accent: window.userTheme?.accent_color || ThemeConfig.DEFAULT_COLORS.accent
        };

        this.colorApplier = new ColorApplier();
        this.presetHandler = new PresetHandler(this.colorApplier);
        this.themeStorage = new ThemeStorage();
        this.themeLogic = new ThemeLogic();
    }

    init() {
        this.updateIsCustomActive();
        this.themeLogic.toggleLightDarkButton();
        this.colorApplier.setupDynamicNavbarColorApplication();
        
        // Apply custom theme if one is stored
        if (window.hasCustomTheme && window.userTheme) {
            console.log('🎨 Restoring saved custom theme');
            this.colors = {
                navbar: window.userTheme.navbar_color,
                sidebar: window.userTheme.sidebar_color,
                background: window.userTheme.background_color,
                accent: window.userTheme.accent_color
            };
            this._applyStoredTheme();
        }
    }

    _applyStoredTheme() {
        // Apply each color using the color applier
        Object.entries(this.colors).forEach(([type, color]) => {
            if (color) {
                this.colorApplier.applyColorRealTime(type, color);
            }
        });
        console.log('✅ Stored custom theme applied');
    }

    toggle() {
        this.open = !this.open;
    }

    updateIsCustomActive() {
        this.isCustomActive = window.hasCustomTheme || false;
        window.isCustomActive = this.isCustomActive;
    }

    updateColor(type, value) {
        if (!ColorUtils.isValidHexColor(value)) {
            console.warn('Invalid hex color:', value);
            return;
        }

        console.log(`🎨 updateColor called: ${type} = ${value}`);
        this.colors[type] = value;
        this.colorApplier.applyColorRealTime(type, value);
    }

    applyColorRealTime(type, color) {
        console.log(`🎯 applyColorRealTime: ${type} = ${color}`);
        this.colorApplier.applyColorRealTime(type, color);
    }

    applyPreset(presetName) {
        console.log(`🎨 Applying preset: ${presetName}`);
        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) {
            this.showToast('Preset não encontrado: ' + presetName, 'error');
            return;
        }

        console.log(`🎨 Preset found:`, preset);

        this.colors.navbar = preset.navbar;
        this.colors.sidebar = preset.sidebar;
        this.colors.background = preset.background;
        this.colors.accent = preset.accent || preset.navbar;

        this.presetHandler.applyPresetColors(preset);

        if (typeof onCustomThemeActivated === 'function') {
            onCustomThemeActivated();
        }

        console.log(`✅ Preset ${presetName} applied successfully!`);
    }

    async saveTheme() {
        if (this.loading) {
            console.log('⏳ Save already in progress, skipping...');
            return;
        }

        this.loading = true;
        console.log('💾 Saving theme...');

        try {
            const success = await this.themeStorage.saveTheme(this.colors);
            
            if (success) {
                this.updateIsCustomActive();
                window.hasCustomTheme = true;
                this.showToast('Tema salvo com sucesso!', 'success');
                console.log('✅ Theme saved successfully');
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('❌ Error saving theme:', error);
            this.showToast('Erro ao salvar tema. Tente novamente.', 'error');
        } finally {
            this.loading = false;
        }
    }

    async resetTheme() {
        if (this.isResetting) {
            console.log('⏳ Reset already in progress, skipping...');
            return;
        }

        this.isResetting = true;
        this.loading = true;
        console.log('🔄 Resetting theme...');

        try {
            // Perform the theme reset (now client-side only)
            const success = await this.themeStorage.resetTheme();
            
            if (success) {
                // Reset colors to defaults
                this.colors = { ...ThemeConfig.DEFAULT_COLORS };
                this.updateIsCustomActive();
                
                // Apply default theme visually
                this.colorApplier.applyDefaultTheme();
                this.themeLogic.toggleLightDarkButton();

                // Trigger business rules for theme reset to default
                if (typeof onThemeResetToDefault === 'function') {
                    onThemeResetToDefault();
                }

                this.showToast('Tema restaurado com sucesso!', 'success');
                console.log('✅ Theme reset completed successfully');
            } else {
                throw new Error('Reset failed');
            }
        } catch (error) {
            console.error('❌ Error resetting theme:', error);
            this.showToast('Erro ao restaurar tema. Tente novamente.', 'error');
        } finally {
            this.isResetting = false;
            this.loading = false;
        }
    }

    // Version of resetTheme that doesn't manage isResetting state (for Alpine.js usage)
    async resetThemeWithoutState() {
        this.loading = true;
        console.log('🔄 Resetting theme (without state management)...');

        try {
            // Client-side reset only (no server call)
            const success = await this.themeStorage.resetTheme();
            
            if (success) {
                // Reset colors to defaults
                this.colors = { ...ThemeConfig.DEFAULT_COLORS };
                this.updateIsCustomActive();
                
                // Apply default theme visually
                this.colorApplier.applyDefaultTheme();
                this.themeLogic.toggleLightDarkButton();

                // Trigger business rules for theme reset to default
                if (typeof onThemeResetToDefault === 'function') {
                    onThemeResetToDefault();
                }

                this.showToast('Tema restaurado com sucesso!', 'success');
                console.log('✅ Theme reset completed successfully');
            } else {
                throw new Error('Reset failed');
            }
        } catch (error) {
            console.error('❌ Error resetting theme:', error);
            this.showToast('Erro ao restaurar tema. Tente novamente.', 'error');
            throw error; // Re-throw so Alpine can handle it
        } finally {
            this.loading = false;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    testSimplePreset(presetName) {
        console.log(`🧪 Testing simple preset: ${presetName}`);
        
        if (!ThemeConfig.PRESETS[presetName]) {
            console.error(`❌ Preset ${presetName} not found`);
            return;
        }

        this.applyPreset(presetName);
        console.log(`✅ Simple preset ${presetName} test completed`);
    }

    testPreset(presetName) {
        console.log(`🧪 Testing preset: ${presetName}`);
        this.testSimplePreset(presetName);
        
        setTimeout(() => {
            this.verifyPresetApplication(presetName);
        }, 500);
    }

    verifyPresetApplication(presetName) {
        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) return;

        console.log(`🔍 Verifying preset application: ${presetName}`);
        
        const navbar = document.querySelector('.hospital-navbar');
        const sidebar = document.querySelector('.hospital-sidebar');
        
        if (navbar) {
            const navbarBg = window.getComputedStyle(navbar).backgroundColor;
            console.log(`📊 Navbar background: Expected ${preset.navbar}, Got ${navbarBg}`);
        }
        
        if (sidebar) {
            const sidebarBg = window.getComputedStyle(sidebar).backgroundColor;
            console.log(`📊 Sidebar background: Expected ${preset.sidebar}, Got ${sidebarBg}`);
        }

        console.log(`✅ Preset ${presetName} verification completed`);
    }

    canApplyLightDarkTheme() {
        return this.themeLogic.canApplyLightDarkTheme();
    }

    toggleLightDarkButton() {
        this.themeLogic.toggleLightDarkButton();
    }
}