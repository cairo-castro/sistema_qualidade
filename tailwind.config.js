import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
        './Modules/**/Resources/views/**/*.blade.php',
    ],

    darkMode: 'class', // Enable dark mode with class strategy

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Tema hospitalar principal
                hospital: {
                    // Verde principal (cor predominante hospitalar)
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e', // Verde principal
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                // Azul médico (secundário)
                medical: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6', // Azul médico
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                // Cinza neutro para contrastes
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                // Status médicos
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                warning: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
                info: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                // Primárias do sistema
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                secondary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'bounce-gentle': 'bounceGentle 2s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'sidebar-expand': 'sidebarExpand 0.3s ease-out',
                'sidebar-collapse': 'sidebarCollapse 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceGentle: {
                    '0%, 100%': { transform: 'translateY(-5%)' },
                    '50%': { transform: 'translateY(0)' },
                },
                sidebarExpand: {
                    '0%': { width: '6rem' },
                    '100%': { width: '16rem' },
                },
                sidebarCollapse: {
                    '0%': { width: '16rem' },
                    '100%': { width: '6rem' },
                },
            },
            boxShadow: {
                'hospital-soft': '0 2px 15px -3px rgba(34, 197, 94, 0.1), 0 10px 20px -2px rgba(34, 197, 94, 0.04)',
                'hospital-medium': '0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06)',
                'hospital-strong': '0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.04)',
                'medical-glow': '0 0 20px rgba(34, 197, 94, 0.3)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
                '112': '28rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            backdropBlur: {
                xs: '2px',
            },
            width: {
                'sidebar-collapsed': '6rem',
                'sidebar-expanded': '16rem',
            },
            margin: {
                'sidebar-collapsed': '6rem',
                'sidebar-expanded': '16rem',
            },
        },
    },

    plugins: [
        forms({
            strategy: 'class',
        }),
        typography,
        
        // Plugin customizado para componentes do sistema hospitalar
        function({ addComponents, addUtilities, theme }) {
            addComponents({
                // Componentes base do sistema
                '.hospital-container': {
                    minHeight: '100vh',
                    backgroundColor: theme('colors.gray.50'),
                },
                '.hospital-sidebar': {
                    backgroundColor: theme('colors.white'),
                    borderRight: `1px solid ${theme('colors.gray.200')}`,
                    minHeight: '100vh',
                    position: 'fixed',
                    left: '0',
                    top: '0',
                    zIndex: '40',
                    boxShadow: theme('boxShadow.hospital-soft'),
                    transition: 'width 0.3s ease, transform 0.3s ease',
                },
                '.hospital-sidebar-collapsed': {
                    width: theme('width.sidebar-collapsed'),
                },
                '.hospital-sidebar-expanded': {
                    width: theme('width.sidebar-expanded'),
                },
                '.hospital-main': {
                    minHeight: '100vh',
                    transition: 'margin-left 0.3s ease',
                },
                '.hospital-main-collapsed': {
                    marginLeft: theme('margin.sidebar-collapsed'),
                },
                '.hospital-main-expanded': {
                    marginLeft: theme('margin.sidebar-expanded'),
                },
                '.hospital-navbar': {
                    backgroundColor: theme('colors.white'),
                    borderBottom: `1px solid ${theme('colors.gray.200')}`,
                    padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
                    position: 'sticky',
                    top: '0',
                    zIndex: '30',
                    boxShadow: theme('boxShadow.hospital-soft'),
                },
                '.hospital-content': {
                    padding: theme('spacing.6'),
                },
                
                // Cards e componentes
                '.hospital-card': {
                    backgroundColor: theme('colors.white'),
                    borderRadius: theme('borderRadius.xl'),
                    border: `1px solid ${theme('colors.gray.200')}`,
                    padding: theme('spacing.6'),
                    boxShadow: theme('boxShadow.hospital-soft'),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: theme('boxShadow.hospital-medium'),
                        transform: 'translateY(-1px)',
                        borderColor: theme('colors.hospital.200'),
                    },
                },
                '.hospital-card-success': {
                    borderLeft: `4px solid ${theme('colors.hospital.500')}`,
                    backgroundColor: theme('colors.hospital.50'),
                },
                '.hospital-card-warning': {
                    borderLeft: `4px solid ${theme('colors.warning.500')}`,
                    backgroundColor: theme('colors.warning.50'),
                },
                '.hospital-card-danger': {
                    borderLeft: `4px solid ${theme('colors.danger.500')}`,
                    backgroundColor: theme('colors.danger.50'),
                },
                '.hospital-card-info': {
                    borderLeft: `4px solid ${theme('colors.medical.500')}`,
                    backgroundColor: theme('colors.medical.50'),
                },
                
                // Botões
                '.hospital-btn': {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
                    borderRadius: theme('borderRadius.lg'),
                    fontSize: theme('fontSize.sm'),
                    fontWeight: theme('fontWeight.medium'),
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    border: 'none',
                    textDecoration: 'none',
                    '&:focus': {
                        outline: 'none',
                        ringWidth: '2px',
                        ringOffsetWidth: '2px',
                    },
                    '&:disabled': {
                        opacity: '0.5',
                        cursor: 'not-allowed',
                    },
                },
                '.hospital-btn-primary': {
                    backgroundColor: theme('colors.hospital.600'),
                    color: theme('colors.white'),
                    '&:hover': {
                        backgroundColor: theme('colors.hospital.700'),
                    },
                    '&:focus': {
                        ringColor: theme('colors.hospital.500'),
                    },
                },
                '.hospital-btn-secondary': {
                    backgroundColor: theme('colors.medical.600'),
                    color: theme('colors.white'),
                    '&:hover': {
                        backgroundColor: theme('colors.medical.700'),
                    },
                    '&:focus': {
                        ringColor: theme('colors.medical.500'),
                    },
                },
                '.hospital-btn-success': {
                    backgroundColor: theme('colors.success.600'),
                    color: theme('colors.white'),
                    '&:hover': {
                        backgroundColor: theme('colors.success.700'),
                    },
                    '&:focus': {
                        ringColor: theme('colors.success.500'),
                    },
                },
                '.hospital-btn-warning': {
                    backgroundColor: theme('colors.warning.600'),
                    color: theme('colors.white'),
                    '&:hover': {
                        backgroundColor: theme('colors.warning.700'),
                    },
                    '&:focus': {
                        ringColor: theme('colors.warning.500'),
                    },
                },
                '.hospital-btn-danger': {
                    backgroundColor: theme('colors.danger.600'),
                    color: theme('colors.white'),
                    '&:hover': {
                        backgroundColor: theme('colors.danger.700'),
                    },
                    '&:focus': {
                        ringColor: theme('colors.danger.500'),
                    },
                },
                '.hospital-btn-outline': {
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme('colors.hospital.600')}`,
                    color: theme('colors.hospital.600'),
                    '&:hover': {
                        backgroundColor: theme('colors.hospital.50'),
                        borderColor: theme('colors.hospital.700'),
                        color: theme('colors.hospital.700'),
                    },
                },
                '.hospital-btn-ghost': {
                    backgroundColor: 'transparent',
                    color: theme('colors.gray.600'),
                    '&:hover': {
                        backgroundColor: theme('colors.gray.100'),
                        color: theme('colors.gray.900'),
                    },
                },
                
                // Navegação da sidebar
                '.hospital-nav-item': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
                    margin: `${theme('spacing.1')} ${theme('spacing.2')}`,
                    borderRadius: theme('borderRadius.lg'),
                    color: theme('colors.gray.700'),
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    fontSize: theme('fontSize.sm'),
                    fontWeight: theme('fontWeight.medium'),
                    '&:hover': {
                        backgroundColor: theme('colors.hospital.50'),
                        color: theme('colors.hospital.700'),
                    },
                },
                '.hospital-nav-item-active': {
                    backgroundColor: theme('colors.hospital.100'),
                    color: theme('colors.hospital.800'),
                    borderLeft: `3px solid ${theme('colors.hospital.600')}`,
                    '&:hover': {
                        backgroundColor: theme('colors.hospital.100'),
                        color: theme('colors.hospital.800'),
                    },
                },
                '.hospital-nav-icon': {
                    width: theme('spacing.5'),
                    height: theme('spacing.5'),
                    marginRight: theme('spacing.3'),
                    flexShrink: '0',
                },
                '.hospital-nav-text': {
                    transition: 'opacity 0.3s ease',
                },
                '.hospital-nav-text-hidden': {
                    opacity: '0',
                    width: '0',
                    overflow: 'hidden',
                },
                
                // Inputs
                '.hospital-input': {
                    display: 'block',
                    width: '100%',
                    borderRadius: theme('borderRadius.lg'),
                    border: `1px solid ${theme('colors.gray.300')}`,
                    padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
                    fontSize: theme('fontSize.sm'),
                    transition: 'all 0.2s ease',
                    '&::placeholder': {
                        color: theme('colors.gray.400'),
                    },
                    '&:focus': {
                        outline: 'none',
                        ringWidth: '2px',
                        ringColor: theme('colors.hospital.500'),
                        borderColor: theme('colors.hospital.500'),
                    },
                    '&.error': {
                        borderColor: theme('colors.danger.500'),
                        ringColor: theme('colors.danger.500'),
                    },
                },
                
                // Badges
                '.hospital-badge': {
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
                    borderRadius: theme('borderRadius.full'),
                    fontSize: theme('fontSize.xs'),
                    fontWeight: theme('fontWeight.medium'),
                    textTransform: 'uppercase',
                    letterSpacing: theme('letterSpacing.wide'),
                },
                '.hospital-badge-success': {
                    backgroundColor: theme('colors.success.100'),
                    color: theme('colors.success.800'),
                },
                '.hospital-badge-warning': {
                    backgroundColor: theme('colors.warning.100'),
                    color: theme('colors.warning.800'),
                },
                '.hospital-badge-danger': {
                    backgroundColor: theme('colors.danger.100'),
                    color: theme('colors.danger.800'),
                },
                '.hospital-badge-info': {
                    backgroundColor: theme('colors.info.100'),
                    color: theme('colors.info.800'),
                },
                '.hospital-badge-primary': {
                    backgroundColor: theme('colors.hospital.100'),
                    color: theme('colors.hospital.800'),
                },
                
                // Alertas
                '.hospital-alert': {
                    padding: theme('spacing.4'),
                    borderRadius: theme('borderRadius.lg'),
                    borderWidth: '1px',
                    marginBottom: theme('spacing.4'),
                },
                '.hospital-alert-success': {
                    backgroundColor: theme('colors.success.50'),
                    borderColor: theme('colors.success.200'),
                    color: theme('colors.success.800'),
                },
                '.hospital-alert-warning': {
                    backgroundColor: theme('colors.warning.50'),
                    borderColor: theme('colors.warning.200'),
                    color: theme('colors.warning.800'),
                },
                '.hospital-alert-danger': {
                    backgroundColor: theme('colors.danger.50'),
                    borderColor: theme('colors.danger.200'),
                    color: theme('colors.danger.800'),
                },
                '.hospital-alert-info': {
                    backgroundColor: theme('colors.info.50'),
                    borderColor: theme('colors.info.200'),
                    color: theme('colors.info.800'),
                },
                
                // Stats cards
                '.hospital-stat-card': {
                    backgroundColor: theme('colors.white'),
                    borderRadius: theme('borderRadius.xl'),
                    padding: theme('spacing.6'),
                    boxShadow: theme('boxShadow.hospital-soft'),
                    border: `1px solid ${theme('colors.gray.200')}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: theme('boxShadow.hospital-strong'),
                        transform: 'translateY(-2px)',
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '4px',
                        backgroundColor: theme('colors.hospital.500'),
                    },
                },
                
                // Responsive
                '@media (max-width: 1024px)': {
                    '.hospital-sidebar': {
                        transform: 'translateX(-100%)',
                        '&.open': {
                            transform: 'translateX(0)',
                        },
                    },
                    '.hospital-main': {
                        marginLeft: '0',
                    },
                },
                
                '@media (max-width: 768px)': {
                    '.hospital-content': {
                        padding: theme('spacing.4'),
                    },
                    '.hospital-navbar': {
                        padding: theme('spacing.4'),
                    },
                },
            });
            
            addUtilities({
                '.text-hospital': {
                    color: theme('colors.hospital.600'),
                },
                '.text-medical': {
                    color: theme('colors.medical.600'),
                },
                '.bg-hospital-gradient': {
                    background: `linear-gradient(135deg, ${theme('colors.hospital.500')} 0%, ${theme('colors.medical.500')} 100%)`,
                },
                '.border-hospital': {
                    borderColor: theme('colors.hospital.500'),
                },
                '.ring-hospital': {
                    ringColor: theme('colors.hospital.500'),
                },
            });
        },
    ],
};