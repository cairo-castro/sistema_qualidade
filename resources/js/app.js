import './bootstrap';

// Lazy loading para bibliotecas pesadas - ApexCharts substituindo Chart.js
const loadApexCharts = () => import('apexcharts');
const loadDataTables = () => import('datatables.net-dt');
const loadPrelineComponents = () => Promise.all([
  import('@preline/datatable'),
  import('@preline/dropdown'),
  import('@preline/tooltip')
]);

// Alpine.js - mantém carregamento normal pois é framework base
import Alpine from 'alpinejs';
window.Alpine = Alpine;

// Configurações globais otimizadas do Sistema
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
        },
        // 🎨 Configurações específicas para ApexCharts - Tema Hospital
        chartTheme: {
            mode: 'light', // ou 'dark' baseado no tema atual
            palette: 'palette1', // ApexCharts palette
            monochrome: {
                enabled: false,
                color: '#22c55e',
                shadeTo: 'light',
                shadeIntensity: 0.65
            },
            // 📊 Cores personalizadas alinhadas com o tema Hospital
            colors: ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4', '#f59e0b'],
            grid: {
                borderColor: '#e5e7eb',
                strokeDashArray: 0,
                position: 'back',
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            // 🎯 Configurações de performance
            performance: {
                animationSpeed: 'fast', // 'slow', 'medium', 'fast'
                reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            }
        }
    },
    
    // Módulos lazy-loaded
    apexChartsModule: null,
    dataTablesModule: null,
    prelineModule: null,
    
    // 🚀 Inicialização otimizada
    async init() {
        // Inicializar componentes críticos
        this.sidebar.init();
        this.utils.createToastContainer();
        
        // 🔍 Detectar tema atual e configurar ApexCharts
        this.updateChartTheme();
        
        // 📈 Lazy load de módulos pesados apenas quando necessário
        if (document.querySelector('[data-chart]')) {
            await this.loadApexChartsModule();
        }
        
        // 🏥 Carregar ApexCharts sempre se estivermos numa página de dashboard
        if (document.querySelector('#diagnosticsChart, #diagnosticsChartPartial')) {
            await this.loadApexChartsModule();
        }
        
        if (document.querySelector('.data-table')) {
            await this.loadDataTablesModule();
        }
        
        if (document.querySelector('[data-preline]')) {
            await this.loadPrelineModule();
        }
        
        // 🌓 Listener para mudanças de tema
        this.setupThemeObserver();
    },
    
    // 📊 Lazy loading otimizado de ApexCharts
    async loadApexChartsModule() {
        if (!this.apexChartsModule) {
            console.log('🚀 Carregando ApexCharts module...');
            const ApexCharts = await loadApexCharts();
            this.apexChartsModule = ApexCharts.default || ApexCharts;
            
            // 🌐 Tornar ApexCharts disponível globalmente
            window.ApexCharts = this.apexChartsModule;
            
            // ⚡ Configurar defaults globais do ApexCharts
            this.setupApexChartsDefaults();
        }
        return this.apexChartsModule;
    },
    
    // ⚙️ Configurar defaults globais do ApexCharts para performance
    setupApexChartsDefaults() {
        if (!this.apexChartsModule) return;
        
        // 🎨 Aplicar tema padrão do Hospital
        this.apexChartsModule.exec('setGlobalOptions', {
            theme: this.config.chartTheme,
            chart: {
                fontFamily: 'Inter, system-ui, sans-serif',
                foreColor: this.getCurrentTheme() === 'dark' ? '#d1d5db' : '#6b7280',
                background: 'transparent',
                // 🚀 Configurações de performance
                animations: {
                    enabled: !this.config.chartTheme.performance.reducedMotion,
                    easing: 'easeinout',
                    speed: this.config.chartTheme.performance.animationSpeed === 'fast' ? 400 : 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                // 📱 Responsividade otimizada
                responsive: [{
                    breakpoint: 768,
                    options: {
                        chart: {
                            height: 300
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            colors: this.config.chartTheme.colors,
            grid: this.config.chartTheme.grid,
            stroke: {
                width: 2,
                curve: 'smooth'
            },
            dataLabels: {
                enabled: false
            },
            tooltip: {
                theme: this.getCurrentTheme(),
                style: {
                    fontSize: '12px',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }
            }
        });
    },
    
    // 🌓 Detectar tema atual
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    },
    
    // 🎨 Atualizar tema dos charts
    updateChartTheme() {
        const currentTheme = this.getCurrentTheme();
        this.config.chartTheme.mode = currentTheme;
        
        // 🎨 Ajustar cores baseado no tema
        if (currentTheme === 'dark') {
            this.config.chartTheme.grid.borderColor = '#374151';
        } else {
            this.config.chartTheme.grid.borderColor = '#e5e7eb';
        }
    },
    
    // 👀 Observer para mudanças de tema
    setupThemeObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.updateChartTheme();
                    // 🔄 Atualizar charts existentes com novo tema
                    this.charts.updateAllThemes();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    },
    
    // 📊 Lazy loading otimizado de DataTables
    async loadDataTablesModule() {
        if (!this.dataTablesModule) {
            console.log('🚀 Carregando DataTables module...');
            this.dataTablesModule = await loadDataTables();
        }
        return this.dataTablesModule;
    },
    
    // 🎛️ Lazy loading otimizado de Preline
    async loadPrelineModule() {
        if (!this.prelineModule) {
            console.log('🚀 Carregando Preline modules...');
            const [datatable, dropdown, tooltip] = await loadPrelineComponents();
            this.prelineModule = { datatable, dropdown, tooltip };
        }
        return this.prelineModule;
    },
    
    // 🛠️ Utilitários otimizados com memoização
    utils: {
        formatters: new Map(),
        
        formatNumber(num) {
            const key = `number_${num}`;
            if (!this.formatters.has(key)) {
                this.formatters.set(key, new Intl.NumberFormat('pt-BR').format(num));
            }
            return this.formatters.get(key);
        },
        
        formatCurrency(value) {
            const key = `currency_${value}`;
            if (!this.formatters.has(key)) {
                this.formatters.set(key, new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value));
            }
            return this.formatters.get(key);
        },
        
        formatDate(date) {
            const key = `date_${date}`;
            if (!this.formatters.has(key)) {
                this.formatters.set(key, new Intl.DateTimeFormat('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(new Date(date)));
            }
            return this.formatters.get(key);
        },
        
        formatDateTime(date) {
            const key = `datetime_${date}`;
            if (!this.formatters.has(key)) {
                this.formatters.set(key, new Intl.DateTimeFormat('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(new Date(date)));
            }
            return this.formatters.get(key);
        },
        
        // 🎨 Toast system otimizado com pool de objetos
        toastPool: [],
        
        showToast(message, type = 'info', duration = 4000) {
            const toastContainer = this.getToastContainer();
            const toast = this.createToast(message, type);
            
            toastContainer.appendChild(toast);
            
            // ✨ Animate entrada com requestAnimationFrame para melhor performance
            requestAnimationFrame(() => {
                toast.classList.remove('translate-x-full');
            });
            
            // ⏱️ Auto remove otimizado
            setTimeout(() => {
                this.removeToast(toast);
            }, duration);
        },
        
        createToast(message, type) {
            const toast = document.createElement('div');
            toast.className = 'transform translate-x-full transition-transform duration-300 mb-2';
            
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
                    <button class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="window.Hospital.utils.removeToast(this.closest('.transform'))">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            return toast;
        },
        
        removeToast(toast) {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        },
        
        getToastContainer() {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = this.createToastContainer();
            }
            return container;
        },
        
        createToastContainer() {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
            return container;
        },
        
        // 🔄 Modal otimizado com pool
        modalPool: [],
        
        confirm(message, title = 'Confirmar') {
            return new Promise((resolve) => {
                const modal = this.createConfirmModal(message, title, resolve);
                document.body.appendChild(modal);
                
                // 🎯 Event listeners otimizados
                this.setupModalEvents(modal, resolve);
            });
        },
        
        createConfirmModal(message, title, resolve) {
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
                        <button class="gqa-btn ghost cancel-btn">Cancelar</button>
                        <button class="gqa-btn primary confirm-btn">Confirmar</button>
                    </div>
                </div>
            `;
            return modal;
        },
        
        setupModalEvents(modal, resolve) {
            const confirmBtn = modal.querySelector('.confirm-btn');
            const cancelBtn = modal.querySelector('.cancel-btn');
            
            const handleConfirm = () => {
                modal.remove();
                resolve(true);
            };
            
            const handleCancel = () => {
                modal.remove();
                resolve(false);
            };
            
            confirmBtn.addEventListener('click', handleConfirm);
            cancelBtn.addEventListener('click', handleCancel);
            
            // ⌨️ Fechar com ESC
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    handleCancel();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
            
            // 🖱️ Fechar clicando fora
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    handleCancel();
                }
            });
        },
        
        // ⏱️ Debounce otimizado
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
        }
    },
    
    // 📱 Gerenciamento otimizado da sidebar
    sidebar: {
        element: null,
        mainElement: null,
        
        init() {
            this.element = document.querySelector('.hospital-sidebar');
            this.mainElement = document.querySelector('.hospital-main');
            
            if (window.Hospital.config.sidebarCollapsed) {
                this.collapse(false);
            }
            
            this.handleResize();
            window.addEventListener('resize', this.debounceResize);
        },
        
        debounceResize: null,
        
        handleResize() {
            if (!this.debounceResize) {
                this.debounceResize = window.Hospital.utils.debounce(() => {
                    if (window.innerWidth <= 1024) {
                        this.element?.classList.remove('open');
                    }
                }, 100);
            }
            this.debounceResize();
        },
        
        toggle() {
            if (!this.element || !this.mainElement) return;
            
            const isCollapsed = this.element.classList.contains('collapsed');
            
            if (isCollapsed) {
                this.expand();
            } else {
                this.collapse();
            }
        },
        
        collapse(animate = true) {
            if (!this.element || !this.mainElement) return;
            
            this.element.classList.add('collapsed');
            this.mainElement.classList.add('sidebar-collapsed');
            
            localStorage.setItem('hospital-sidebar-collapsed', 'true');
            window.Hospital.config.sidebarCollapsed = true;
            
            // 🚀 Performance: usar will-change apenas durante animação
            if (animate) {
                this.element.style.willChange = 'width';
                this.mainElement.style.willChange = 'margin-left';
                
                setTimeout(() => {
                    this.element.style.willChange = 'auto';
                    this.mainElement.style.willChange = 'auto';
                }, 300);
            }
        },
        
        expand(animate = true) {
            if (!this.element || !this.mainElement) return;
            
            this.element.classList.remove('collapsed');
            this.mainElement.classList.remove('sidebar-collapsed');
            
            localStorage.setItem('hospital-sidebar-collapsed', 'false');
            window.Hospital.config.sidebarCollapsed = false;
            
            // 🚀 Performance: usar will-change apenas durante animação
            if (animate) {
                this.element.style.willChange = 'width';
                this.mainElement.style.willChange = 'margin-left';
                
                setTimeout(() => {
                    this.element.style.willChange = 'auto';
                    this.mainElement.style.willChange = 'auto';
                }, 300);
            }
        }
    },
    
    // 📊 ApexCharts otimizados com lazy loading e tema Hospital
    charts: {
        instances: new Map(),
        
        /**
         * 🎯 Criar um gráfico ApexCharts otimizado
         * @param {string|HTMLElement} selector - Seletor ou elemento do gráfico  
         * @param {Object} config - Configuração do gráfico
         * @param {string} config.type - Tipo: 'line', 'area', 'bar', 'pie', 'donut', 'radial', etc.
         * @param {Array} config.series - Dados do gráfico
         * @param {Object} config.options - Opções personalizadas (opcional)
         * @returns {Promise<ApexChart>} Instância do gráfico
         */
        async create(selector, config) {
            const ApexCharts = await window.Hospital.loadApexChartsModule();
            
            // 🎨 Configurações padrão otimizadas para o tema Hospital
            const defaultOptions = {
                chart: {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    height: config.height || 350,
                    type: config.type || 'line',
                    background: 'transparent',
                    foreColor: window.Hospital.getCurrentTheme() === 'dark' ? '#d1d5db' : '#6b7280',
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            selection: false,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: false,
                            reset: true
                        },
                        export: {
                            csv: {
                                filename: 'hospital-chart-data',
                                columnDelimiter: ',',
                                headerCategory: 'Categoria',
                                headerValue: 'Valor'
                            },
                            svg: {
                                filename: 'hospital-chart'
                            },
                            png: {
                                filename: 'hospital-chart'
                            }
                        }
                    },
                    // ⚡ Configurações de performance
                    animations: {
                        enabled: !window.Hospital.config.chartTheme.performance.reducedMotion,
                        easing: 'easeinout',
                        speed: window.Hospital.config.chartTheme.performance.animationSpeed === 'fast' ? 400 : 800,
                        animateGradually: {
                            enabled: true,
                            delay: 50
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 250
                        }
                    },
                    // 📱 Responsividade otimizada
                    responsive: [{
                        breakpoint: 768,
                        options: {
                            chart: {
                                height: 300
                            },
                            legend: {
                                position: 'bottom',
                                fontSize: '12px'
                            },
                            xaxis: {
                                labels: {
                                    style: {
                                        fontSize: '11px'
                                    }
                                }
                            },
                            yaxis: {
                                labels: {
                                    style: {
                                        fontSize: '11px'
                                    }
                                }
                            }
                        }
                    }]
                },
                // 🎨 Cores do tema Hospital
                colors: window.Hospital.config.chartTheme.colors,
                // 📊 Grid otimizada
                grid: {
                    ...window.Hospital.config.chartTheme.grid,
                    padding: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 20
                    }
                },
                // 🎯 Stroke suave
                stroke: {
                    width: 2,
                    curve: 'smooth',
                    lineCap: 'round'
                },
                // 📝 DataLabels desabilitado para performance
                dataLabels: {
                    enabled: false
                },
                // 🔍 Tooltip personalizado
                tooltip: {
                    theme: window.Hospital.getCurrentTheme(),
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Inter, system-ui, sans-serif'
                    },
                    y: {
                        formatter: function(value) {
                            // 💰 Formatar valores monetários se aplicável
                            if (config.formatCurrency) {
                                return window.Hospital.utils.formatCurrency(value);
                            }
                            // 🔢 Formatar números
                            return window.Hospital.utils.formatNumber(value);
                        }
                    }
                },
                // 📍 Legend otimizada
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'left',
                    fontSize: '13px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 500,
                    markers: {
                        width: 8,
                        height: 8,
                        radius: 2
                    }
                },
                // 📐 Eixo X
                xaxis: {
                    labels: {
                        style: {
                            colors: window.Hospital.getCurrentTheme() === 'dark' ? '#9ca3af' : '#6b7280',
                            fontSize: '12px',
                            fontFamily: 'Inter, system-ui, sans-serif'
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: window.Hospital.getCurrentTheme() === 'dark' ? '#374151' : '#e5e7eb'
                    },
                    axisTicks: {
                        show: true,
                        color: window.Hospital.getCurrentTheme() === 'dark' ? '#374151' : '#e5e7eb'
                    }
                },
                // 📏 Eixo Y  
                yaxis: {
                    labels: {
                        style: {
                            colors: window.Hospital.getCurrentTheme() === 'dark' ? '#9ca3af' : '#6b7280',
                            fontSize: '12px',
                            fontFamily: 'Inter, system-ui, sans-serif'
                        },
                        formatter: function(value) {
                            // 💰 Formatar valores monetários se aplicável
                            if (config.formatCurrency) {
                                return window.Hospital.utils.formatCurrency(value);
                            }
                            // 🔢 Formatar números
                            return window.Hospital.utils.formatNumber(value);
                        }
                    }
                }
            };
            
            // 🔄 Merge configurações customizadas
            const mergedOptions = this.deepMerge(defaultOptions, config.options || {});
            
            // 🎯 Configuração final do gráfico
            const chartConfig = {
                series: config.series || [],
                ...mergedOptions
            };
            
            // 📊 Criar instância do gráfico
            const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
            if (!element) {
                console.error('❌ Elemento não encontrado para o gráfico:', selector);
                return null;
            }
            
            const chart = new ApexCharts(element, chartConfig);
            
            // 🚀 Renderizar com tratamento de erro
            try {
                await chart.render();
                
                // 💾 Armazenar instância para controle
                const chartId = element.id || `chart-${Date.now()}`;
                this.instances.set(chartId, chart);
                
                console.log(`✅ Gráfico ApexCharts criado: ${chartId}`);
                return chart;
                
            } catch (error) {
                console.error('❌ Erro ao renderizar gráfico:', error);
                return null;
            }
        },
        
        /**
         * 🔄 Atualizar dados de um gráfico existente
         * @param {string} chartId - ID do gráfico
         * @param {Array} newSeries - Novos dados
         * @param {boolean} animate - Animar atualização
         */
        updateSeries(chartId, newSeries, animate = true) {
            const chart = this.instances.get(chartId);
            if (chart) {
                chart.updateSeries(newSeries, animate);
                console.log(`🔄 Gráfico atualizado: ${chartId}`);
            }
        },
        
        /**
         * 🎨 Atualizar tema de todos os gráficos
         */
        updateAllThemes() {
            this.instances.forEach((chart, chartId) => {
                const newTheme = window.Hospital.getCurrentTheme();
                chart.updateOptions({
                    chart: {
                        foreColor: newTheme === 'dark' ? '#d1d5db' : '#6b7280'
                    },
                    tooltip: {
                        theme: newTheme
                    },
                    grid: {
                        borderColor: newTheme === 'dark' ? '#374151' : '#e5e7eb'
                    }
                });
                console.log(`🎨 Tema atualizado para: ${chartId}`);
            });
        },
        
        /**
         * 🗑️ Destruir gráfico específico
         * @param {string} chartId - ID do gráfico
         */
        destroy(chartId) {
            const chart = this.instances.get(chartId);
            if (chart) {
                chart.destroy();
                this.instances.delete(chartId);
                console.log(`🗑️ Gráfico destruído: ${chartId}`);
            }
        },
        
        /**
         * 🧹 Destruir todos os gráficos (cleanup)
         */
        destroyAll() {
            this.instances.forEach((chart, chartId) => {
                chart.destroy();
                console.log(`🧹 Gráfico limpo: ${chartId}`);
            });
            this.instances.clear();
            console.log('🧹 Todos os gráficos foram limpos');
        },
        
        /**
         * 🔧 Merge profundo de objetos (utility)
         * @param {Object} target - Objeto alvo
         * @param {Object} source - Objeto fonte
         * @returns {Object} Objeto merged
         */
        deepMerge(target, source) {
            const result = { ...target };
            
            for (const key in source) {
                if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    result[key] = this.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
            
            return result;
        },
        
        /**
         * 📊 Helpers para tipos de gráficos comuns
         */
        // 📈 Gráfico de linha otimizado
        async createLineChart(selector, data, options = {}) {
            return this.create(selector, {
                type: 'line',
                series: data,
                options: {
                    stroke: {
                        width: 3,
                        curve: 'smooth'
                    },
                    markers: {
                        size: 4,
                        strokeWidth: 2,
                        hover: {
                            size: 6
                        }
                    },
                    ...options
                }
            });
        },
        
        // 📊 Gráfico de barras otimizado
        async createBarChart(selector, data, options = {}) {
            return this.create(selector, {
                type: 'bar',
                series: data,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            columnWidth: '60%'
                        }
                    },
                    ...options
                }
            });
        },
        
        // 🍩 Gráfico de donut otimizado
        async createDonutChart(selector, data, options = {}) {
            return this.create(selector, {
                type: 'donut',
                series: data,
                options: {
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '70%'
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function(val) {
                            return Math.round(val) + '%';
                        }
                    },
                    ...options
                }
            });
        }
    }
};

// 🚀 Inicialização otimizada com Intersection Observer para lazy loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 Inicializando Sistema Hospital com ApexCharts...');
    
    // 🎯 Inicializar Hospital System
    window.Hospital.init();
    
    // 🚀 Inicializar Alpine.js
    Alpine.start();
    
    // 👀 Lazy loading de componentes com Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // 📊 Chart lazy loading
                if (element.hasAttribute('data-chart')) {
                    window.Hospital.loadApexChartsModule().then(() => {
                        console.log('📊 ApexCharts module carregado para:', element.id);
                        // 🎯 Trigger evento personalizado para inicialização
                        element.dispatchEvent(new CustomEvent('chartReady'));
                    });
                }
                
                // 📋 DataTable lazy loading
                if (element.classList.contains('data-table')) {
                    window.Hospital.loadDataTablesModule().then(() => {
                        console.log('📋 DataTables module carregado para:', element.id);
                    });
                }
                
                observer.unobserve(element);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // 🔍 Observar elementos que precisam de lazy loading
    document.querySelectorAll('[data-chart], .data-table').forEach(el => {
        observer.observe(el);
    });
});

// 🧹 Performance: limpar recursos quando necessário
window.addEventListener('beforeunload', () => {
    window.Hospital.charts.destroyAll();
    console.log('🧹 Recursos limpos antes do unload');
});

// 🔋 Performance: reduzir animações em dispositivos com bateria baixa
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
            document.documentElement.style.setProperty('--gqa-transition-fast', '0ms');
            document.documentElement.style.setProperty('--gqa-transition-normal', '0ms');
            window.Hospital.config.chartTheme.performance.reducedMotion = true;
            console.log('🔋 Modo economia de bateria ativado');
        }
    });
}

// 🎨 Hospital Utils - Utilitários para tema e interface
window.hospitalUtils = {
    // 🌓 Alternar tema
    toggleTheme() {
        const currentTheme = window.Hospital.getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar novo tema
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Adicionar/remover classe dark para compatibilidade com Tailwind
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Salvar preferência no localStorage
        localStorage.setItem('theme', newTheme);
        
        // Atualizar tema dos charts
        window.Hospital.updateChartTheme();
        
        // Atualizar charts existentes
        if (window.Hospital.charts) {
            window.Hospital.charts.updateAllThemes();
        }
        
        console.log(`🎨 Tema alterado para: ${newTheme}`);
    },
    
    // 🎨 Inicializar tema baseado na preferência salva ou sistema
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme = 'light'; // padrão
        
        if (savedTheme) {
            theme = savedTheme;
        } else if (systemPrefersDark) {
            theme = 'dark';
        }
        
        // Aplicar tema inicial
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        console.log(`🎨 Tema inicial configurado: ${theme}`);
    },
    
    // 🎨 Escutar mudanças no tema do sistema
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Só seguir o sistema se não há tema manual salvo
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                
                // Atualizar tema dos charts
                window.Hospital.updateChartTheme();
                
                if (window.Hospital.charts) {
                    window.Hospital.charts.updateAllThemes();
                }
                
                console.log(`🎨 Tema automático alterado para: ${newTheme}`);
            }
        });
    }
};

// 🎨 Inicializar tema ao carregar
window.hospitalUtils.initTheme();
window.hospitalUtils.setupSystemThemeListener();

// 🎯 Log de inicialização
console.log('✅ Sistema Hospital carregado com ApexCharts!');
console.log('📊 ApexCharts configurado com tema Hospital');
console.log('⚡ Lazy loading e performance otimizados');
console.log('🎨 Suporte a tema claro/escuro ativo');