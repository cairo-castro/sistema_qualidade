import { ThemeConfig } from '../config/theme-config.js';
import { ColorUtils } from '../utils/color-utils.js';

export class PresetHandler {
    constructor(colorApplier) {
        this.colorApplier = colorApplier;
    }

    applyPresetColors(preset) {
        if (preset.navbar) {
            const navbarTextColor = ColorUtils.getSmartContrastColor(preset.navbar, {
                lightColor: '#ffffff',
                darkColor: '#1f2937',
                mediumLightColor: '#f8fafc',
                mediumDarkColor: '#374151'
            });
            this._applyNavbarColor(preset.navbar, navbarTextColor);
        }

        if (preset.sidebar) {
            const sidebarTextColor = ColorUtils.getSmartContrastColor(preset.sidebar, {
                lightColor: '#ffffff',
                darkColor: '#1f2937',
                mediumLightColor: '#f8fafc',
                mediumDarkColor: '#374151'
            });
            this._applySidebarColor(preset.sidebar, sidebarTextColor);
        }

        if (preset.background) {
            const backgroundTextColor = ColorUtils.getSmartContrastColor(preset.background, {
                lightColor: '#1f2937',
                darkColor: '#f8fafc',
                mediumLightColor: '#374151',
                mediumDarkColor: '#e5e7eb'
            });
            this._applyBackgroundColor(preset.background, backgroundTextColor);
        }

        if (preset.accent) {
            const accentTextColor = ColorUtils.getSmartContrastColor(preset.accent, {
                lightColor: '#ffffff',
                darkColor: '#1f2937',
                mediumLightColor: '#f8fafc',
                mediumDarkColor: '#374151'
            });
            this._applyAccentColor(preset.accent, accentTextColor);
        }
    }

    _applyNavbarColor(color, textColor) {
        console.log(`🎨 Applying navbar color: ${color} with text: ${textColor}`);

        document.documentElement.style.setProperty('--navbar-bg', color);
        document.documentElement.style.setProperty('--navbar-text', textColor);

        const navbars = document.querySelectorAll('.hospital-navbar, nav.hospital-navbar');
        navbars.forEach(navbar => {
            navbar.style.backgroundColor = color;
            navbar.style.color = textColor;

            const children = navbar.querySelectorAll('*:not([x-data*="themeManager"])');
            children.forEach(child => {
                if (!child.style.backgroundColor && !child.classList.contains('bg-')) {
                    child.style.color = textColor;
                    child.style.setProperty('color', textColor, 'important');

                    if (child.tagName === 'SVG') {
                        child.style.fill = textColor;
                        child.style.stroke = textColor;
                    }
                }
            });
        });
    }

    _applySidebarColor(color, textColor) {
        console.log(`🎨 Applying sidebar color: ${color} with text: ${textColor}`);

        document.documentElement.style.setProperty('--sidebar-bg', color);
        document.documentElement.style.setProperty('--sidebar-text', textColor);

        const sidebarSelectors = [
            '.hospital-sidebar',
            '.sidebar',
            'aside',
            '[class*="sidebar"]'
        ];

        sidebarSelectors.forEach(selector => {
            const sidebars = document.querySelectorAll(selector);
            sidebars.forEach(sidebar => {
                if (!sidebar.closest('[x-data*="themeManager"]')) {
                    sidebar.style.backgroundColor = color;
                    sidebar.style.color = textColor;

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
            });
        });
    }

    _applyBackgroundColor(color, textColor) {
        console.log(`🎨 Applying background color: ${color} with text: ${textColor}`);

        document.documentElement.style.setProperty('--bg-color', color);
        document.documentElement.style.setProperty('--text-color', textColor);
        document.documentElement.style.setProperty('--content-bg', color);
        document.documentElement.style.setProperty('--content-text', textColor);

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

        if (contentArea) {
            contentArea.style.backgroundColor = color;

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
            document.body.style.backgroundColor = color;
        }
    }

    _applyAccentColor(color, textColor) {
        console.log(`🎨 Applying accent color: ${color} with text: ${textColor}`);

        document.documentElement.style.setProperty('--accent-color', color);
        document.documentElement.style.setProperty('--accent-text', textColor);

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