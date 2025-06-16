import { ThemeConfig } from '../config/theme-config.js';
import { ColorUtils } from '../utils/color-utils.js';

export class PresetHandler {
    constructor(colorApplier) {
        this.colorApplier = colorApplier;
    }

    applyPresetColors(preset) {
        console.log('🎨 Applying preset colors using ColorApplier:', preset);
        
        // Usar o ColorApplier para garantir que toda a lógica de dropdown seja aplicada
        if (preset.navbar) {
            this.colorApplier.applyColorRealTime('navbar', preset.navbar);
        }

        if (preset.sidebar) {
            this.colorApplier.applyColorRealTime('sidebar', preset.sidebar);
        }

        if (preset.background) {
            this.colorApplier.applyColorRealTime('background', preset.background);
        }

        if (preset.accent) {
            this.colorApplier.applyColorRealTime('accent', preset.accent);
        }
        
        console.log('✅ Preset colors applied through ColorApplier');
    }

    validatePreset(presetName) {
        const preset = ThemeConfig.PRESETS[presetName];
        if (!preset) {
            console.error(`❌ Preset ${presetName} not found`);
            return false;
        }

        const requiredProperties = ['navbar', 'sidebar', 'background'];
        for (const prop of requiredProperties) {
            if (!preset[prop]) {
                console.error(`❌ Preset ${presetName} missing required property: ${prop}`);
                return false;
            }
            if (!ColorUtils.isValidHexColor(preset[prop])) {
                console.error(`❌ Preset ${presetName} has invalid color for ${prop}: ${preset[prop]}`);
                return false;
            }
        }

        console.log(`✅ Preset ${presetName} validation passed`);
        return true;
    }

    getPresetList() {
        return Object.keys(ThemeConfig.PRESETS).map(key => ({
            key,
            name: ThemeConfig.PRESETS[key].name,
            colors: ThemeConfig.PRESETS[key]
        }));
    }

    getPreset(presetName) {
        return ThemeConfig.PRESETS[presetName] || null;
    }

    presetExists(presetName) {
        return !!ThemeConfig.PRESETS[presetName];
    }

    testPreset(presetName) {
        console.log(`🧪 Testing preset: ${presetName}`);
        
        if (!this.validatePreset(presetName)) {
            console.error(`❌ Preset ${presetName} validation failed`);
            return false;
        }

        const preset = this.getPreset(presetName);
        this.applyPresetColors(preset);
        
        setTimeout(() => {
            this._verifyPresetApplication(presetName, preset);
        }, 500);

        return true;
    }

    _verifyPresetApplication(presetName, preset) {
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

    createCustomPreset(name, colors) {
        const requiredColors = ['navbar', 'sidebar', 'background'];
        
        for (const color of requiredColors) {
            if (!colors[color]) {
                throw new Error(`Missing required color: ${color}`);
            }
            if (!ColorUtils.isValidHexColor(colors[color])) {
                throw new Error(`Invalid hex color for ${color}: ${colors[color]}`);
            }
        }

        return {
            name,
            navbar: colors.navbar,
            sidebar: colors.sidebar,
            background: colors.background,
            accent: colors.accent || colors.navbar
        };
    }
}