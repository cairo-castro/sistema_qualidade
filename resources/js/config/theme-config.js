// Core Theme Configuration
export const ThemeConfig = {
    STORAGE_KEYS: {
        THEME: 'theme',
        SIDEBAR_COLLAPSED: 'hospital-sidebar-collapsed'
    },

    DEFAULT_COLORS: {
        navbar: '#ffffff',
        sidebar: '#ffffff',
        background: '#f9fafb',
        accent: '#22c55e'
    },

    PRESETS: {
        blue: {
            name: 'Azul',
            navbar: '#2563eb',
            sidebar: '#1e40af',
            background: '#f8fafc',
            accent: '#3b82f6'
        },
        green: {
            name: 'Verde',
            navbar: '#16a34a',
            sidebar: '#15803d',
            background: '#f0fdf4',
            accent: '#22c55e'
        },
        purple: {
            name: 'Roxo',
            navbar: '#7c3aed',
            sidebar: '#6d28d9',
            background: '#faf5ff',
            accent: '#8b5cf6'
        },
        dark: {
            name: 'Escuro',
            navbar: '#1f2937',
            sidebar: '#111827',
            background: '#0f172a',
            accent: '#6b7280'
        }
    },

    SYSTEM_COLORS: {
        primary: '#22c55e',
        secondary: '#3b82f6',
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        info: '#3b82f6'
    },

    CHART_COLORS: ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4', '#f59e0b']
};
