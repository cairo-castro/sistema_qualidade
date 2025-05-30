import './bootstrap';
import Alpine from 'alpinejs';
import Chart from 'chart.js/auto';

// DataTables imports
import 'datatables.net-dt';
import { HSDataTable } from '@preline/datatable';

// Configurar Alpine.js globalmente
window.Alpine = Alpine;

// Configurações globais do Sistema
window.Hospital = {
    config: {
        theme: 'hospital',
        sidebarCollapsed: localStorage.getItem('hospital-sidebar-collapsed') === 'true',
        autoRefresh: true,
        refreshInterval: 30000,
        notifications: true,
        colors: {
            primary: '#22c55e',
            secondary: '#3b82f6',
            success: '#22c55e',
            warning: '#eab308',
            danger: '#ef4444',
            info: '#3b82f6'
        }
    },
    
    // Utilitários
    utils: {
        formatNumber(num) {
            return new Intl.NumberFormat('pt-BR').format(num);
        },
        
        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        },
        
        formatDate(date) {
            return new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(new Date(date));
        },
        
        formatDateTime(date) {
            return new Intl.DateTimeFormat('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).format(new Date(date));
        },
        
        showToast(message, type = 'info', duration = 4000) {
            const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
            
            const toast = document.createElement('div');
            toast.className = `transform translate-x-full transition-transform duration-300 mb-2`;
            
            const icons = {
                success: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
                error: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>',
                warning: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
                info: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
            };
            
            const colors = {
                success: 'bg-green-50 border-green-200 text-green-800',
                error: 'bg-red-50 border-red-200 text-red-800',
                warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                info: 'bg-blue-50 border-blue-200 text-blue-800'
            };
            
            toast.innerHTML = `
                <div class="flex items-center p-4 max-w-sm bg-white rounded-lg shadow-lg border-l-4 ${colors[type] || colors.info}">
                    <div class="flex-shrink-0">
                        ${icons[type] || icons.info}
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium">${message}</p>
                    </div>
                    <button class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.closest('div').parentElement.remove()">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            toastContainer.appendChild(toast);
            
            // Animar entrada
            setTimeout(() => {
                toast.classList.remove('translate-x-full');
            }, 100);
            
            // Auto remove
            setTimeout(() => {
                toast.classList.add('translate-x-full');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }, duration);
        },
        
        createToastContainer() {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
            return container;
        },
        
        confirm(message, title = 'Confirmar') {
            return new Promise((resolve) => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                modal.innerHTML = `
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                        </div>
                        <div class="p-6">
                            <p class="text-gray-600">${message}</p>
                        </div>
                        <div class="p-6 border-t flex justify-end space-x-3">
                            <button class="gqa-btn ghost" onclick="this.closest('.fixed').remove(); window.hospitalConfirmResolve(false)">
                                Cancelar
                            </button>
                            <button class="gqa-btn primary" onclick="this.closest('.fixed').remove(); window.hospitalConfirmResolve(true)">
                                Confirmar
                            </button>
                        </div>
                    </div>
                `;
                
                window.hospitalConfirmResolve = resolve;
                document.body.appendChild(modal);
                
                // Fechar com ESC
                const handleEsc = (e) => {
                    if (e.key === 'Escape') {
                        modal.remove();
                        resolve(false);
                        document.removeEventListener('keydown', handleEsc);
                    }
                };
                document.addEventListener('keydown', handleEsc);
                
                // Fechar clicando fora
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                        resolve(false);
                    }
                });
            });
        }
    },
    
    // Gerenciamento da sidebar
    sidebar: {
        toggle() {
            const sidebar = document.querySelector('.hospital-sidebar');
            const main = document.querySelector('.hospital-main');
            
            if (!sidebar || !main) return;
            
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            if (isCollapsed) {
                this.expand();
            } else {
                this.collapse();
            }
        },
        
        collapse() {
            const sidebar = document.querySelector('.hospital-sidebar');
            const main = document.querySelector('.hospital-main');
            
            if (!sidebar || !main) return;
            
            sidebar.classList.add('collapsed');
            main.classList.add('sidebar-collapsed');
            
            // Salvar estado
            localStorage.setItem('hospital-sidebar-collapsed', 'true');
            window.Hospital.config.sidebarCollapsed = true;
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('hospital:sidebar:collapsed'));
        },
        
        expand() {
            const sidebar = document.querySelector('.hospital-sidebar');
            const main = document.querySelector('.hospital-main');
            
            if (!sidebar || !main) return;
            
            sidebar.classList.remove('collapsed');
            main.classList.remove('sidebar-collapsed');
            
            // Salvar estado
            localStorage.setItem('hospital-sidebar-collapsed', 'false');
            window.Hospital.config.sidebarCollapsed = false;
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('hospital:sidebar:expanded'));
        },
        
        init() {
            // Aplicar estado salvo
            if (window.Hospital.config.sidebarCollapsed) {
                this.collapse();
            }
            
            // Responsivo
            this.handleResize();
            window.addEventListener('resize', () => this.handleResize());
        },
        
        handleResize() {
            const sidebar = document.querySelector('.hospital-sidebar');
            
            if (!sidebar) return;
            
            if (window.innerWidth < 1024) {
                // Mobile: sidebar sempre hidden por padrão
                sidebar.classList.remove('collapsed');
            } else {
                // Desktop: aplicar estado salvo
                if (window.Hospital.config.sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                }
            }
        }
    }
};

// Componente principal do Dashboard
Alpine.data('hospitalDashboard', () => ({
    // Estado da aplicação
    sidebarOpen: false,
    sidebarCollapsed: window.Hospital.config.sidebarCollapsed,
    loading: false,
    stats: {
        totalDiagnosticos: 0,
        taxaConformidade: 0,
        periodosAtivos: 0,
        itensNaoConformes: 0
    },
    notifications: [],
    
    // Métodos
    toggleSidebar() {
        if (window.innerWidth < 1024) {
            this.sidebarOpen = !this.sidebarOpen;
            
            // Toggle overlay
            const overlay = document.querySelector('.hospital-sidebar-overlay');
            if (overlay) {
                if (this.sidebarOpen) {
                    overlay.classList.add('show');
                } else {
                    overlay.classList.remove('show');
                }
            }
        } else {
            window.Hospital.sidebar.toggle();
            this.sidebarCollapsed = window.Hospital.config.sidebarCollapsed;
        }
    },
    
    closeSidebar() {
        this.sidebarOpen = false;
        const overlay = document.querySelector('.hospital-sidebar-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    },
    
    async loadStats() {
        this.loading = true;
        try {
            const response = await fetch('/dashboard/stats', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.stats = { ...this.stats, ...data.stats };
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            window.Hospital.utils.showToast('Erro ao carregar estatísticas', 'error');
        } finally {
            this.loading = false;
        }
    },
    
    async loadNotifications() {
        try {
            const response = await fetch('/dashboard/notifications', {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.notifications = data.notifications || [];
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    },
    
    formatNumber(num) {
        return window.Hospital.utils.formatNumber(num);
    },
    
    init() {
        // Inicializar sidebar
        window.Hospital.sidebar.init();
        this.sidebarCollapsed = window.Hospital.config.sidebarCollapsed;
        
        // Carregar dados iniciais se as rotas existirem
        if (typeof loadStats !== 'undefined') {
            this.loadStats();
        }
        if (typeof loadNotifications !== 'undefined') {
            this.loadNotifications();
        }
        
        // Auto-refresh se habilitado
        if (window.Hospital.config.autoRefresh) {
            setInterval(() => {
                if (typeof loadStats !== 'undefined') this.loadStats();
                if (typeof loadNotifications !== 'undefined') this.loadNotifications();
            }, window.Hospital.config.refreshInterval);
        }
        
        // Listeners para eventos da sidebar
        window.addEventListener('hospital:sidebar:collapsed', () => {
            this.sidebarCollapsed = true;
        });
        
        window.addEventListener('hospital:sidebar:expanded', () => {
            this.sidebarCollapsed = false;
        });
        
        // Listener para resize da tela
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                this.sidebarOpen = false;
                this.closeSidebar();
            }
        });
    }
}));

// Componente para gráficos
Alpine.data('gqaChart', () => ({
    chart: null,
    
    initChart(canvas, data, options = {}) {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js não está carregado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        color: '#6b7280'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6',
                        borderColor: '#e5e7eb'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        color: '#f3f4f6',
                        borderColor: '#e5e7eb'
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        color: '#6b7280'
                    }
                }
            },
            elements: {
                point: {
                    backgroundColor: window.Hospital.config.colors.primary,
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    radius: 4,
                    hoverRadius: 6
                },
                line: {
                    borderWidth: 3,
                    tension: 0.4
                }
            }
        };
        
        // Aplicar cores do tema
        if (data.datasets) {
            data.datasets.forEach((dataset, index) => {
                const colors = [
                    window.Hospital.config.colors.primary,
                    window.Hospital.config.colors.secondary,
                    window.Hospital.config.colors.success,
                    window.Hospital.config.colors.warning,
                    window.Hospital.config.colors.info
                ];
                
                if (!dataset.borderColor) {
                    dataset.borderColor = colors[index % colors.length];
                }
                
                if (!dataset.backgroundColor && options.type !== 'line') {
                    dataset.backgroundColor = colors[index % colors.length] + '20';
                }
                
                if (options.type === 'line' && !dataset.backgroundColor) {
                    dataset.backgroundColor = colors[index % colors.length] + '10';
                }
            });
        }
        
        this.chart = new Chart(ctx, {
            type: options.type || 'line',
            data: data,
            options: { ...defaultOptions, ...options }
        });
    },
    
    updateChart(data) {
        if (this.chart) {
            this.chart.data = data;
            this.chart.update('active');
        }
    },
    
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}));

// Event listeners globais
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    initTooltips();
    
    // Auto-hide flash messages
    hideFlashMessages();
    
    // Inicializar tema
    initTheme();
    
    // Adicionar listener para o toggle da sidebar via botão
    const toggleButton = document.querySelector('.hospital-sidebar-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.Hospital.sidebar.toggle();
        });
    }
    
    // Fechar sidebar no mobile ao clicar no overlay
    const overlay = document.querySelector('.hospital-sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            const sidebarComponent = Alpine.$data(document.querySelector('[x-data*="hospitalDashboard"]'));
            if (sidebarComponent) {
                sidebarComponent.closeSidebar();
            }
        });
    }
});

// Funções utilitárias
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const text = event.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'hospital-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + 'px';
    tooltip.style.top = rect.top - tooltipRect.height - 8 + 'px';
    
    event.target._tooltip = tooltip;
}

function hideTooltip(event) {
    if (event.target._tooltip) {
        event.target._tooltip.remove();
        delete event.target._tooltip;
    }
}

function hideFlashMessages() {
    const alerts = document.querySelectorAll('[data-auto-hide]');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
}

function initTheme() {
    // Detectar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('hospital-theme');
    const html = document.documentElement;
    
    let theme = 'light'; // default
    
    if (savedTheme) {
        theme = savedTheme;
    } else if (prefersDark) {
        theme = 'dark';
    }
    
    // Apply theme
    html.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    // Listener para mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('hospital-theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            if (newTheme === 'dark') {
                html.classList.add('dark');
            } else {
                html.classList.remove('dark');
            }
        }
    });
}

// Funções globais para uso em templates
window.hospitalUtils = {
    showLoading() {
        const loader = document.createElement('div');
        loader.id = 'hospital-global-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-xl">
                <div class="flex items-center space-x-3">
                    <div class="gqa-loading lg hospital"></div>
                    <span class="text-gray-700">Carregando...</span>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    },
    
    hideLoading() {
        const loader = document.getElementById('hospital-global-loader');
        if (loader) {
            loader.remove();
        }
    },
    
    confirmDelete(message = 'Tem certeza que deseja excluir este item?') {
        return window.Hospital.utils.confirm(message, 'Confirmar Exclusão');
    },
    
    async apiRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        };
        
        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            window.Hospital.utils.showToast(error.message, 'error');
            throw error;
        }
    },
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Set data-theme attribute for custom CSS
        html.setAttribute('data-theme', newTheme);
        
        // Toggle Tailwind's dark class
        if (newTheme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        // Save to localStorage
        localStorage.setItem('hospital-theme', newTheme);
        
        window.Hospital.utils.showToast(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`, 'info');
    }
};

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + B para toggle da sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        window.Hospital.sidebar.toggle();
    }
    
    // Ctrl/Cmd + K para busca (se existir)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar"], input[placeholder*="Buscar"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Inicializar HSDataTable
window.HSDataTable = HSDataTable;

// Inicializar Alpine.js
Alpine.start();

// Log de inicialização
console.log('🏥 Sistema GQA carregado com sucesso!');
console.log('🎨 Tema: Hospital Green');
console.log('📱 Layout responsivo ativo');
console.log('📊 Chart.js configurado');

// Expor para debugging
if (process.env.NODE_ENV === 'development') {
    window.debug = {
        Hospital: window.Hospital,
        hospitalUtils: window.hospitalUtils,
        Alpine: Alpine
    };
}