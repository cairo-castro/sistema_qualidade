import Alpine from 'alpinejs';
import { ThemeConfig } from './config/theme-config.js';
import { ColorUtils } from './utils/color-utils.js';
import { ThemeManager } from './theme/theme-manager.js';
import { AnimatedSwitches } from './theme/animated-switches.js';
import { DarkModeController } from './theme/dark-mode-controller.js';
import { registerAlpineComponents } from './theme/alpine-components.js';
import { DashboardCharts } from './charts/dashboard-charts.js';
import './charts/datatable-init.js';

class HospitalSystem {
    constructor() {
        this.theme = {
            toggle: () => {
                const isDark = document.documentElement.classList.contains('dark');
                document.documentElement.classList.toggle('dark', !isDark);
                localStorage.setItem('theme', !isDark ? 'dark' : 'light');
            }
        };
        this.charts = {
            destroyAll: () => {
                console.log('Charts destroyed');
            }
        };
        // Add utils with showToast implementation
        this.utils = {
            showToast: (message, type = 'info', duration = 3000) => {
                this.showToast(message, type, duration);
            }
        };
    }

    showToast(message, type = 'info', duration = 3000) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white transition-opacity duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        }`;
        toast.textContent = message;
        
        // Add to DOM
        document.body.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    init() {
        console.log('Hospital System initialized');
    }

    loadModule(moduleName) {
        console.log(`Loading module: ${moduleName}`);
    }
}

window.Alpine = Alpine;
window.themeManager = null;
window.isCustomActive = window.hasCustomTheme || false;
window.colors = {
    navbar: window.userTheme?.navbar_color || ThemeConfig.DEFAULT_COLORS.navbar,
    sidebar: window.userTheme?.sidebar_color || ThemeConfig.DEFAULT_COLORS.sidebar,
    background: window.userTheme?.background_color || ThemeConfig.DEFAULT_COLORS.background,
    accent: window.userTheme?.accent_color || ThemeConfig.DEFAULT_COLORS.accent
};

// Safe getter for theme colors (for use in HTML templates)
window.getThemeColor = function(type, defaultColor = '#ffffff') {
    if (window.Hospital?.themeManager?.colors?.[type]) {
        return window.Hospital.themeManager.colors[type];
    }
    if (window.colors?.[type]) {
        return window.colors[type];
    }
    return defaultColor;
};

// Safe setter for theme colors (for use in HTML templates)
window.setThemeColor = function(type, color) {
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.updateColor(type, color);
    } else {
        console.warn('Theme manager not available yet, color change ignored');
    }
};

window.getContrastingTextColor = ColorUtils.getContrastingTextColor;

// Global utility functions for Alpine.js templates
window.formatNumber = function(number) {
    if (number === null || number === undefined) return '0';
    return new Intl.NumberFormat('pt-BR').format(number);
};

// Global state variables
window.loading = false;
window.sidebarOpen = false;

// Safety wrapper for Alpine.js expressions to prevent undefined errors
window.safeGet = function(obj, path, defaultValue = null) {
    try {
        return path.split('.').reduce((o, p) => o && o[p], obj) || defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

// Wrapper to safely access store values
window.getStoreValue = function(storeName, path, defaultValue = null) {
    try {
        if (window.Alpine && window.Alpine.store && window.Alpine.store(storeName)) {
            return window.safeGet(window.Alpine.store(storeName), path, defaultValue);
        }
        return defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

window.resetSidebarState = function() {
    localStorage.removeItem('hospital-sidebar-collapsed');
    console.log('🔄 Sidebar state reset. Reload page to apply changes.');
    location.reload();
};

window.checkSidebarState = function() {
    const stored = localStorage.getItem('hospital-sidebar-collapsed');
    console.log('📋 Current sidebar state in localStorage:', stored);
    console.log('📋 Parsed value:', JSON.parse(stored || 'false'));
    console.log('📋 Expected: false (expanded), true (collapsed)');
};

window.Hospital = new HospitalSystem();

window.Hospital.themeManager = new ThemeManager();
window.themeManager = window.Hospital.themeManager; // Global access for backward compatibility

window.Hospital.animatedSwitches = new AnimatedSwitches(window.Hospital.themeManager);

window.Hospital.darkModeController = new DarkModeController();

registerAlpineComponents(Alpine);

// Global Alpine.js store for shared state
try {
    Alpine.store('hospital', {
        loading: false,
        sidebarOpen: false,
        stats: {
            totalDiagnosticos: 0,
            taxaConformidade: 0
        },
        
        setLoading(value) {
            this.loading = value;
            window.loading = value;
        },
        
        setSidebarOpen(value) {
            this.sidebarOpen = value;
            window.sidebarOpen = value;
        },
        
        updateStats(newStats) {
            this.stats = { ...this.stats, ...newStats };
        }
    });
} catch (error) {
    console.error('Error creating Alpine store:', error);
}

Alpine.data('hospitalDashboard', () => ({
    sidebarCollapsed: JSON.parse(localStorage.getItem('hospital-sidebar-collapsed') || 'false'),
    
    init() {
        console.log('🏥 Hospital Dashboard Alpine component initialized');
        console.log('📋 Initial sidebar state:', this.sidebarCollapsed);
        
        // Initialize global state
        this.$store.hospital.setSidebarOpen(!this.sidebarCollapsed);
        
        this.$watch('sidebarCollapsed', (value) => {
            console.log('📋 Sidebar state changed to:', value);
            localStorage.setItem('hospital-sidebar-collapsed', JSON.stringify(value));
            this.$store.hospital.setSidebarOpen(!value);
        });

        // Load initial data
        this.loadDashboardData();
    },

    get sidebarOpen() {
        return !this.sidebarCollapsed;
    },

    get loading() {
        return this.$store.hospital.loading;
    },

    get stats() {
        return this.$store.hospital.stats;
    },

    toggleSidebar() {
        console.log('📋 Toggling sidebar from:', this.sidebarCollapsed);
        this.sidebarCollapsed = !this.sidebarCollapsed;
        console.log('📋 Sidebar toggled to:', this.sidebarCollapsed);
    },

    collapseSidebar() {
        if (!this.sidebarCollapsed) {
            this.sidebarCollapsed = true;
            console.log('📋 Sidebar collapsed');
        }
    },

    expandSidebar() {
        if (this.sidebarCollapsed) {
            this.sidebarCollapsed = false;
            console.log('📋 Sidebar expanded');
        }
    },

    async loadDashboardData() {
        this.$store.hospital.setLoading(true);
        try {
            // Simulate loading dashboard stats - in real app this would be an API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.$store.hospital.updateStats({
                totalDiagnosticos: 150,
                taxaConformidade: 85
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            this.$store.hospital.setLoading(false);
        }
    },

    formatNumber(number) {
        return window.formatNumber(number);
    }
}));

function initializeThemeBusinessRules() {
    console.log('🏢 Initializing theme business rules...');
    
    if (window.Hospital?.themeManager?.themeLogic) {
        window.Hospital.themeManager.themeLogic.initializeThemeBusinessRules();
    }
    
    console.log('✅ Theme business rules initialization completed');
}

function onCustomThemeActivated() {
    console.log('🎨 Custom theme activated - executing business rules');
    
    if (window.Hospital?.themeManager?.themeLogic) {
        window.Hospital.themeManager.themeLogic.onCustomThemeActivated();
    }
}

function onThemeResetToDefault() {
    console.log('🔄 Theme reset to default - executing business rules');
    
    if (window.Hospital?.themeManager?.themeLogic) {
        window.Hospital.themeManager.themeLogic.onThemeResetToDefault();
    }
}

function testPreset(presetName) {
    console.log(`🧪 Testing preset: ${presetName}`);
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.testPreset(presetName);
    }
}

function testSimplePreset(presetName) {
    console.log(`🧪 Testing simple preset: ${presetName}`);
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.testSimplePreset(presetName);
    }
}

function verifyPresetApplication(presetName) {
    console.log(`🔍 Verifying preset application: ${presetName}`);
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.verifyPresetApplication(presetName);
    }
}

window.initializeThemeBusinessRules = initializeThemeBusinessRules;
window.onCustomThemeActivated = onCustomThemeActivated;
window.onThemeResetToDefault = onThemeResetToDefault;
window.testPreset = testPreset;
window.testSimplePreset = testSimplePreset;
window.verifyPresetApplication = verifyPresetApplication;

// Global theme toggle function for backward compatibility
window.toggleHospitalTheme = function() {
    // Check if custom theme is active
    if (window.hasCustomTheme) {
        console.log('⚠️ Cannot toggle dark mode - custom theme is active');
        if (window.Hospital?.themeManager?.showToast) {
            window.Hospital.themeManager.showToast('Tema personalizado ativo - modo claro/escuro desabilitado', 'error');
        }
        return;
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    const newIsDark = !isDark;
    
    console.log(`🌓 Toggling theme: ${isDark ? 'dark' : 'light'} → ${newIsDark ? 'dark' : 'light'}`);
    
    // Use dark mode controller for robust switching
    if (window.Hospital?.darkModeController) {
        if (newIsDark) {
            // Switching to dark mode
            window.Hospital.darkModeController.restoreDarkMode();
        } else {
            // Switching to light mode
            window.Hospital.darkModeController.forceLightMode();
        }
    } else {
        // Fallback to basic toggle if controller not available
        document.documentElement.classList.toggle('dark', newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        localStorage.setItem('hs_theme', newIsDark ? 'dark' : 'light');
        
        // Update all theme switch visuals
        const themeSwitches = document.querySelectorAll('[data-hs-theme-switch]');
        themeSwitches.forEach(switchElement => {
            updateThemeSwitchVisuals(switchElement, newIsDark);
        });
    }
    
    console.log(`✅ Theme toggled to ${newIsDark ? 'dark' : 'light'} mode`);
};

// Make theme manager methods available globally for HTML onclick handlers
window.applyPreset = function(presetName) {
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.applyPreset(presetName);
    }
};

window.updateColor = function(type, value) {
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.updateColor(type, value);
    }
};

window.saveTheme = function() {
    if (window.Hospital?.themeManager) {
        return window.Hospital.themeManager.saveTheme();
    }
};

window.resetTheme = function() {
    if (window.Hospital?.themeManager) {
        return window.Hospital.themeManager.resetTheme();
    }
};

// Global function for dashboard reload
window.reloadDashboard = async function() {
    console.log('🔄 Reloading dashboard...');
    
    // Show loading state
    window.loading = true;
    if (window.Alpine?.store?.hospital) {
        window.Alpine.store('hospital').setLoading(true);
    }

    try {
        // Use dashboard charts module if available
        if (window.dashboardCharts) {
            await window.dashboardCharts.reloadDashboard();
        } else {
            // Fallback: just simulate loading
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('✅ Dashboard reloaded (fallback)');
        }
    } catch (error) {
        console.error('❌ Failed to reload dashboard:', error);
    } finally {
        // Hide loading state
        window.loading = false;
        if (window.Alpine?.store?.hospital) {
            window.Alpine.store('hospital').setLoading(false);
        }
    }
};

// Global utility function for dark mode diagnostics
window.diagnoseDarkMode = function() {
    console.group('🔍 Dark Mode Diagnostic Report');
    
    // Document state
    console.log('📄 Document Classes:', document.documentElement.className);
    console.log('📄 Body Classes:', document.body.className);
    console.log('📄 Data Theme:', document.documentElement.getAttribute('data-theme'));
    
    // LocalStorage state
    console.log('💾 localStorage theme:', localStorage.getItem('theme'));
    console.log('💾 localStorage hs_theme:', localStorage.getItem('hs_theme'));
    console.log('💾 localStorage darkMode:', localStorage.getItem('darkMode'));
    
    // Custom theme state
    console.log('🎨 hasCustomTheme:', window.hasCustomTheme);
    console.log('🎨 isCustomActive:', window.isCustomActive);
    
    // CSS Variables
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    console.log('🎨 CSS Variables:');
    ['--navbar-bg', '--sidebar-bg', '--background-bg', '--gqa-primary'].forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value) console.log(`  ${prop}: ${value}`);
    });
    
    // Dark mode controllers
    console.log('🎛️ Dark Mode Controller Available:', !!window.Hospital?.darkModeController);
    console.log('🎛️ Theme Manager Available:', !!window.Hospital?.themeManager);
    
    // Theme switches
    const switches = document.querySelectorAll('[data-hs-theme-switch]');
    console.log('🔘 Theme Switches Found:', switches.length);
    switches.forEach((sw, i) => {
        console.log(`  Switch ${i}: classes=${sw.className}, visible=${sw.style.display !== 'none'}`);
    });
    
    console.groupEnd();
};

// Global utility function to force complete dark mode reset
window.forceResetDarkMode = function() {
    console.log('🔄 Gentle dark mode reset to light...');
    
    if (window.Hospital?.darkModeController) {
        window.Hospital.darkModeController.forceLightMode();
    } else {
        // Manual gentle reset - preserve Tailwind functionality
        document.documentElement.classList.remove('dark', 'hs-dark-mode-active');
        document.documentElement.removeAttribute('data-theme');
        
        localStorage.setItem('theme', 'light');
        localStorage.setItem('hs_theme', 'light');
        localStorage.removeItem('darkMode');
        
        // Update checkboxes
        document.querySelectorAll('.hs-theme-checkbox').forEach(cb => cb.checked = false);
        
        // Only clear custom theme inline styles, not all styles
        document.querySelectorAll('.hospital-navbar, .hospital-sidebar, .hospital-content').forEach(el => {
            if (el.style.backgroundColor && el.style.backgroundColor.includes('#')) {
                el.style.removeProperty('background-color');
            }
            if (el.style.color && el.style.color.includes('#')) {
                el.style.removeProperty('color');
            }
        });
        
        console.log('✅ Gentle dark mode reset completed (preserving Tailwind)');
    }
};

// Global utility to fix dropdown dark mode specifically
window.fixDropdowns = function() {
    console.log('🔧 Fixing dropdown dark mode issues...');
    
    const isDark = document.documentElement.classList.contains('dark');
    const dropdowns = document.querySelectorAll('.dropdown, .dropdown-menu, .hs-dropdown-menu, [x-show], [role="menu"]');
    
    console.log(`Found ${dropdowns.length} dropdowns to fix for ${isDark ? 'dark' : 'light'} mode`);
    
    dropdowns.forEach((dropdown, index) => {
        // Remove interfering inline styles
        ['background-color', 'color', 'border-color'].forEach(prop => {
            if (dropdown.style[prop] && dropdown.style[prop].includes('#')) {
                dropdown.style.removeProperty(prop);
                console.log(`Removed inline ${prop} from dropdown ${index}`);
            }
        });
        
        // Remove custom theme attributes
        dropdown.removeAttribute('data-theme');
        dropdown.classList.remove('hs-dark-mode-active');
        
        // Force Tailwind recalculation
        dropdown.offsetHeight;
    });
    
    console.log('✅ Dropdown fixes applied');
};

// Global utility to test SVG smart coloring
window.testSVGColoring = function(backgroundColor = '#2563eb') {
    console.log(`🧪 Testing SVG smart coloring with background: ${backgroundColor}`);
    
    const colorApplier = window.Hospital?.themeManager?.colorApplier;
    if (!colorApplier) {
        console.warn('⚠️ ColorApplier not available');
        return;
    }
    
    // Test the smart coloring system
    const svgs = document.querySelectorAll('svg');
    console.log(`Found ${svgs.length} SVG elements to test`);
    
    svgs.forEach((svg, index) => {
        console.log(`Testing SVG ${index}:`, svg);
        colorApplier._applySVGSmartColoring(svg, backgroundColor);
    });
    
    const isDark = colorApplier._isColorDark(backgroundColor);
    console.log(`✅ Applied ${isDark ? 'white' : 'dark'} SVG coloring for ${backgroundColor} background`);
};

// Initialize theme switches in the DOM
function initializeThemeSwitches() {
    console.log('🎛️ Initializing theme switches...');
    
    // Initialize Preline theme switches (for hs-theme components)
    const themeSwitches = document.querySelectorAll('[data-hs-theme-switch]');
    themeSwitches.forEach(switchElement => {
        const checkbox = switchElement.querySelector('.hs-theme-checkbox');
        if (checkbox) {
            // Set initial state based on current theme
            const isDark = document.documentElement.classList.contains('dark');
            checkbox.checked = isDark;
            updateThemeSwitchVisuals(switchElement, isDark);
            
            // Add click handler
            checkbox.addEventListener('change', function() {
                window.toggleHospitalTheme();
                // Update visuals after toggle
                setTimeout(() => {
                    const newIsDark = document.documentElement.classList.contains('dark');
                    updateThemeSwitchVisuals(switchElement, newIsDark);
                }, 50);
            });
            
            // Also handle label clicks
            const label = switchElement.querySelector('label');
            if (label) {
                label.addEventListener('click', function(e) {
                    if (e.target === checkbox) return; // Don't double handle
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    window.toggleHospitalTheme();
                    // Update visuals after toggle
                    setTimeout(() => {
                        const newIsDark = document.documentElement.classList.contains('dark');
                        updateThemeSwitchVisuals(switchElement, newIsDark);
                    }, 50);
                });
            }
        }
    });
    
    console.log(`✅ Initialized ${themeSwitches.length} theme switches`);
}

// Update theme switch visual state with animation
function updateThemeSwitchVisuals(switchElement, isDark) {
    // Add/remove dark mode class
    if (isDark) {
        switchElement.classList.add('hs-dark-mode-active');
        document.documentElement.classList.add('hs-dark-mode-active');
    } else {
        switchElement.classList.remove('hs-dark-mode-active');
        document.documentElement.classList.remove('hs-dark-mode-active');
    }
    
    // Update checkbox state
    const checkbox = switchElement.querySelector('.hs-theme-checkbox');
    if (checkbox) {
        checkbox.checked = isDark;
    }
    
    // Animate the toggle knob and icons
    const knobs = switchElement.querySelectorAll('[class*="hs-dark-mode-active:translate-x"]');
    const knob = knobs[0] || switchElement.querySelector('.transform, .transition-all');
    const sunIcon = switchElement.querySelector('.sun-icon');
    const moonIcon = switchElement.querySelector('.moon-icon');
    
    if (knob) {
        if (isDark) {
            knob.classList.add('translate-x-5', 'translate-x-4', 'bg-slate-800');
            knob.classList.remove('translate-x-0', 'bg-white');
        } else {
            knob.classList.add('translate-x-0', 'bg-white');
            knob.classList.remove('translate-x-5', 'translate-x-4', 'bg-slate-800');
        }
    }
    
    // Animate icons
    if (sunIcon && moonIcon) {
        if (isDark) {
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'rotate(180deg) scale(0.8)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'rotate(0deg) scale(1)';
        } else {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'rotate(0deg) scale(1)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'rotate(-180deg) scale(0.8)';
        }
    }
    
    console.log(`🌓 Updated theme switch visuals: ${isDark ? 'dark' : 'light'} mode`);
}

// Add CSS for theme switch animations
function addThemeSwitchAnimationCSS() {
    // Check if CSS is already added
    if (document.getElementById('theme-switch-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'theme-switch-animations';
    style.textContent = `
        /* Theme switch icon animations */
        .sun-icon, .moon-icon {
            transition: all 0.3s ease-in-out;
            position: absolute;
            inset: 0;
        }
        
        .moon-icon {
            opacity: 0;
            transform: rotate(-180deg) scale(0.8);
        }
        
        .sun-icon {
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }
        
        .hs-dark-mode-active .moon-icon {
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }
        
        .hs-dark-mode-active .sun-icon {
            opacity: 0;
            transform: rotate(180deg) scale(0.8);
        }
        
        /* Toggle knob animation */
        .hs-dark-mode-active .hs-dark-mode-active\\:translate-x-5 {
            transform: translateX(1.25rem) !important;
        }
        
        .hs-dark-mode-active .hs-dark-mode-active\\:translate-x-4 {
            transform: translateX(1rem) !important;
        }
        
        .hs-dark-mode-active .hs-dark-mode-active\\:bg-slate-800 {
            background-color: rgb(30 41 59) !important;
        }
        
        /* Ensure smooth transitions */
        [data-hs-theme-switch] .transition-all {
            transition: all 0.3s ease-in-out;
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Theme switch animation CSS added');
}

// Update theme input values to match current theme manager state
function updateThemeInputs() {
    if (!window.Hospital?.themeManager?.colors) return;
    
    console.log('🎨 Updating theme input values...');
    
    const colors = window.Hospital.themeManager.colors;
    
    // Update color inputs
    const inputs = {
        navbar: document.querySelectorAll('input[x-model*="navbar"], input[type="color"][value*="navbar"]'),
        sidebar: document.querySelectorAll('input[x-model*="sidebar"], input[type="color"][value*="sidebar"]'),
        background: document.querySelectorAll('input[x-model*="background"], input[type="color"][value*="background"]'),
        accent: document.querySelectorAll('input[x-model*="accent"], input[type="color"][value*="accent"]')
    };
    
    Object.entries(inputs).forEach(([type, elements]) => {
        elements.forEach(input => {
            if (colors[type]) {
                input.value = colors[type];
            }
        });
    });
    
    console.log('✅ Theme inputs updated');
}

// Fix navbar theme inputs to work with our theme system
function fixNavbarThemeInputs() {
    console.log('🔧 Fixing navbar theme inputs...');
    
    // Fix color input bindings
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        // Check if it's a theme color input by looking at surrounding HTML
        const isNavbar = input.outerHTML.includes('navbar') || input.getAttribute('x-model')?.includes('navbar');
        const isSidebar = input.outerHTML.includes('sidebar') || input.getAttribute('x-model')?.includes('sidebar');
        const isBackground = input.outerHTML.includes('background') || input.getAttribute('x-model')?.includes('background');
        const isAccent = input.outerHTML.includes('accent') || input.getAttribute('x-model')?.includes('accent');
        
        let colorType = null;
        if (isNavbar) colorType = 'navbar';
        else if (isSidebar) colorType = 'sidebar';
        else if (isBackground) colorType = 'background';
        else if (isAccent) colorType = 'accent';
        
        if (colorType) {
            // Set initial value
            const currentColor = window.getThemeColor(colorType);
            if (currentColor) {
                input.value = currentColor;
            }
            
            // Add change handler if not already added
            if (!input.hasAttribute('data-theme-fixed')) {
                input.addEventListener('input', function() {
                    window.setThemeColor(colorType, this.value);
                });
                input.setAttribute('data-theme-fixed', 'true');
                console.log(`🎨 Fixed ${colorType} color input`);
            }
        }
    });
    
    // Fix text inputs too
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        // Check if it has theme-related attributes
        const isNavbar = input.outerHTML.includes('navbar') || input.getAttribute('x-model')?.includes('navbar');
        const isSidebar = input.outerHTML.includes('sidebar') || input.getAttribute('x-model')?.includes('sidebar');
        const isBackground = input.outerHTML.includes('background') || input.getAttribute('x-model')?.includes('background');
        const isAccent = input.outerHTML.includes('accent') || input.getAttribute('x-model')?.includes('accent');
        
        let colorType = null;
        if (isNavbar) colorType = 'navbar';
        else if (isSidebar) colorType = 'sidebar';
        else if (isBackground) colorType = 'background';
        else if (isAccent) colorType = 'accent';
        
        if (colorType) {
            // Set initial value
            const currentColor = window.getThemeColor(colorType);
            if (currentColor) {
                input.value = currentColor;
            }
            
            // Add change handler if not already added
            if (!input.hasAttribute('data-theme-fixed')) {
                input.addEventListener('input', function() {
                    if (this.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                        window.setThemeColor(colorType, this.value);
                    }
                });
                input.setAttribute('data-theme-fixed', 'true');
                console.log(`🎨 Fixed ${colorType} text input`);
            }
        }
    });
    
    console.log('✅ Navbar theme inputs fixed');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 DOM loaded, initializing systems...');
    
    // Initialize dashboard charts
    window.dashboardCharts = new DashboardCharts();
    
    // Function to attempt chart initialization
    window.initializeDashboardChart = async function() {
        if (window.dashboardCharts) {
            return await window.dashboardCharts.initializeDiagnosticsChart();
        } else {
            console.error('❌ Dashboard charts not available');
            return null;
        }
    };
    
    // Try to initialize charts with delays
    setTimeout(() => {
        window.initializeDashboardChart();
    }, 1000);
    
    setTimeout(() => {
        window.initializeDashboardChart();
    }, 2500);
    
    // Initialize global state before Alpine starts
    const initialSidebarState = JSON.parse(localStorage.getItem('hospital-sidebar-collapsed') || 'false');
    window.sidebarOpen = !initialSidebarState;
    window.loading = false;
    
    // Initialize dark mode from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    }
    console.log(`🌓 Initial theme mode: ${savedTheme || 'default'}`);
    
    // Initialize theme switch elements
    initializeThemeSwitches();
    
    // Add CSS for theme switch animations
    addThemeSwitchAnimationCSS();
    
    // Update global colors from window.Hospital.themeManager after it's initialized
    setTimeout(() => {
        if (window.Hospital?.themeManager?.colors) {
            window.colors = { ...window.Hospital.themeManager.colors };
            console.log('🎨 Updated global colors:', window.colors);
            updateThemeInputs();
            fixNavbarThemeInputs();
        }
    }, 100);
    
    if (window.Hospital?.themeManager) {
        window.Hospital.themeManager.init();
        console.log('✅ Theme manager initialized');
    }
    
    if (window.Hospital?.animatedSwitches) {
        window.Hospital.animatedSwitches.initialize();
        console.log('✅ Animated switches initialized');
    }
    
    if (window.Hospital?.darkModeController) {
        console.log('✅ Dark mode controller initialized');
    }
    
    initializeThemeBusinessRules();
    
    Alpine.start();
    console.log('✅ Alpine.js started');
    
    console.log('🎉 All systems initialized successfully');
});

function cleanupResources() {
    console.log('🧹 Cleaning up resources...');
    
    if (window.Hospital?.animatedSwitches) {
        window.Hospital.animatedSwitches.destroy();
    }
    
    if (window.Hospital?.darkModeController) {
        window.Hospital.darkModeController.destroy();
    }
    
    console.log('✅ Cleanup completed');
}

window.addEventListener('beforeunload', cleanupResources);

export { HospitalSystem, ThemeManager, AnimatedSwitches, DarkModeController };