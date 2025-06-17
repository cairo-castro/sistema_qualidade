import { ThemeConfig } from '../config/theme-config.js';

export class ThemeStorage {
    constructor() {
        this.apiEndpoint = '/api/theme';
        this.resetEndpoint = '/api/theme/reset';
    }

    async saveTheme(colors) {
        try {
            console.log('📡 Sending theme data to server:', colors);

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    navbar_color: colors.navbar,
                    sidebar_color: colors.sidebar,
                    background_color: colors.background,
                    accent_color: colors.accent || colors.navbar
                })
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Theme API endpoint not found, using localStorage fallback');
                    this._updateGlobalThemeState(colors);
                    localStorage.setItem('hospital-theme', JSON.stringify(colors));
                    return true;
                }
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Server response:', data);

            if (data.success) {
                this._updateGlobalThemeState(colors);
                return true;
            } else {
                throw new Error(data.message || 'Unknown server error');
            }
        } catch (error) {
            console.error('❌ Error in saveTheme:', error);
            
            // If this is a network error or 404, fall back to localStorage
            if (error.message.includes('404') || error.name === 'TypeError') {
                console.warn('⚠️ API not available, using localStorage fallback for save');
                this._updateGlobalThemeState(colors);
                localStorage.setItem('hospital-theme', JSON.stringify(colors));
                return true;
            }
            
            throw error;
        }
    }

    async resetTheme() {
        console.log('🔄 Resetting theme to default (client-side)...');
        
        try {
            // Follow the original implementation - pure client-side reset
            // No server call needed, just clear local state
            this._clearGlobalThemeState();
            localStorage.removeItem('hospital-theme');
            
            console.log('✅ Theme reset completed successfully');
            return true;
        } catch (error) {
            console.error('❌ Error during client-side theme reset:', error);
            // Even if there's an error, try to clear what we can
            this._clearGlobalThemeState();
            return true;
        }
    }

    _updateGlobalThemeState(colors) {
        window.hasCustomTheme = true;
        window.userTheme = {
            navbar_color: colors.navbar,
            sidebar_color: colors.sidebar,
            background_color: colors.background,
            accent_color: colors.accent || colors.navbar,
            is_custom: true
        };
        window.isCustomActive = true;

        console.log('🔄 Global theme state updated:', window.userTheme);
    }

    _clearGlobalThemeState() {
        window.hasCustomTheme = false;
        window.isCustomActive = false;
        
        // Keep userTheme structure but clear color values to match backend reset state
        if (window.userTheme) {
            window.userTheme = {
                navbar_color: null,
                sidebar_color: null,
                background_color: null,
                accent_color: null,
                is_custom: false
            };
        } else {
            window.userTheme = null;
        }

        console.log('🔄 Global theme state cleared');
    }

    getStoredTheme() {
        return window.userTheme || null;
    }

    hasStoredTheme() {
        return !!(window.hasCustomTheme && window.userTheme);
    }

    getThemeFromStorage() {
        if (this.hasStoredTheme()) {
            return {
                navbar: window.userTheme.navbar_color,
                sidebar: window.userTheme.sidebar_color,
                background: window.userTheme.background_color,
                accent: window.userTheme.accent_color
            };
        }
        return null;
    }

    saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`💾 Saved to localStorage: ${key}`, value);
            return true;
        } catch (error) {
            console.error(`❌ Error saving to localStorage: ${key}`, error);
            return false;
        }
    }

    loadFromLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                const parsed = JSON.parse(item);
                console.log(`📂 Loaded from localStorage: ${key}`, parsed);
                return parsed;
            }
            return null;
        } catch (error) {
            console.error(`❌ Error loading from localStorage: ${key}`, error);
            return null;
        }
    }

    removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            console.log(`🗑️ Removed from localStorage: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Error removing from localStorage: ${key}`, error);
            return false;
        }
    }

    saveLightDarkPreference(isDark) {
        return this.saveToLocalStorage(ThemeConfig.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    }

    loadLightDarkPreference() {
        const preference = this.loadFromLocalStorage(ThemeConfig.STORAGE_KEYS.THEME);
        return preference === 'dark';
    }

    saveSidebarState(isCollapsed) {
        return this.saveToLocalStorage(ThemeConfig.STORAGE_KEYS.SIDEBAR_COLLAPSED, isCollapsed);
    }

    loadSidebarState() {
        const state = this.loadFromLocalStorage(ThemeConfig.STORAGE_KEYS.SIDEBAR_COLLAPSED);
        return state !== null ? state : false;
    }

    clearAllThemeStorage() {
        this.removeFromLocalStorage(ThemeConfig.STORAGE_KEYS.THEME);
        this.removeFromLocalStorage(ThemeConfig.STORAGE_KEYS.SIDEBAR_COLLAPSED);
        this._clearGlobalThemeState();
        console.log('🧹 All theme storage cleared');
    }

    exportThemeSettings() {
        const settings = {
            hasCustomTheme: window.hasCustomTheme,
            userTheme: window.userTheme,
            lightDarkPreference: this.loadLightDarkPreference(),
            sidebarCollapsed: this.loadSidebarState(),
            timestamp: new Date().toISOString()
        };

        console.log('📤 Exported theme settings:', settings);
        return settings;
    }

    importThemeSettings(settings) {
        try {
            if (settings.userTheme) {
                this._updateGlobalThemeState({
                    navbar: settings.userTheme.navbar_color,
                    sidebar: settings.userTheme.sidebar_color,
                    background: settings.userTheme.background_color,
                    accent: settings.userTheme.accent_color
                });
            }

            if (typeof settings.lightDarkPreference === 'boolean') {
                this.saveLightDarkPreference(settings.lightDarkPreference);
            }

            if (typeof settings.sidebarCollapsed === 'boolean') {
                this.saveSidebarState(settings.sidebarCollapsed);
            }

            console.log('📥 Imported theme settings successfully');
            return true;
        } catch (error) {
            console.error('❌ Error importing theme settings:', error);
            return false;
        }
    }

    validateThemeData(colors) {
        const requiredFields = ['navbar', 'sidebar', 'background'];
        const errors = [];

        for (const field of requiredFields) {
            if (!colors[field]) {
                errors.push(`Missing required field: ${field}`);
            } else if (typeof colors[field] !== 'string') {
                errors.push(`Invalid type for ${field}: expected string`);
            } else if (!colors[field].match(/^#[0-9A-Fa-f]{6}$/)) {
                errors.push(`Invalid hex color format for ${field}: ${colors[field]}`);
            }
        }

        if (colors.accent && !colors.accent.match(/^#[0-9A-Fa-f]{6}$/)) {
            errors.push(`Invalid hex color format for accent: ${colors.accent}`);
        }

        if (errors.length > 0) {
            console.error('❌ Theme data validation failed:', errors);
            return { valid: false, errors };
        }

        console.log('✅ Theme data validation passed');
        return { valid: true, errors: [] };
    }

    async testConnection() {
        try {
            const response = await fetch('/api/theme/test', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('🔗 Connection test response:', response.status);
            return response.ok;
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            return false;
        }
    }
}