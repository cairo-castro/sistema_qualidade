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

// 🎨 Theme Manager Alpine.js Component
document.addEventListener('alpine:init', () => {
    Alpine.data('themeManager', () => ({
        open: false,
        loading: false,
        isCustomActive: window.hasCustomTheme || false,
        applyTimeout: null,
        colors: {
            navbar: window.userTheme?.navbar_color || '#ffffff',
            sidebar: window.userTheme?.sidebar_color || '#ffffff',
            background: window.userTheme?.background_color || '#f9fafb'
        },

        init() {
            // Initialize with current theme colors
            this.updateIsCustomActive();

            // Hide/show light/dark toggle based on custom theme status
            if (window.hasCustomTheme) {
                this.hideLightDarkToggle();
            } else {
                this.showLightDarkToggle();
            }
        },

        // Switch to light mode when starting theme customization if currently in dark mode
        startCustomization() {
            const currentTheme = window.Hospital.getCurrentTheme();
            if (currentTheme === 'dark') {
                // Switch to light mode automatically
                document.documentElement.setAttribute('data-theme', 'light');
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');

                // Update charts theme
                window.Hospital.updateChartTheme();
                if (window.Hospital.charts) {
                    window.Hospital.charts.updateAllThemes();
                }

                console.log('🎨 Modo escuro desativado automaticamente para personalização');
            }
        },        updateColor(type, value) {
            // Start customization process (switch to light mode if needed)
            this.startCustomization();

            // Validate hex color with improved regex
            if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
                // Try to fix common issues
                if (value.length === 7 && value.startsWith('#')) {
                    // Already correct format, might be validation issue
                    value = value.toLowerCase();
                } else if (value.length === 6 && !value.startsWith('#')) {
                    // Missing #
                    value = '#' + value.toLowerCase();
                } else if (value.length === 3 && !value.startsWith('#')) {
                    // Short hex, expand it
                    value = '#' + value.split('').map(c => c + c).join('').toLowerCase();
                } else if (value.length === 4 && value.startsWith('#')) {
                    // Short hex with #, expand it
                    const shortHex = value.slice(1);
                    value = '#' + shortHex.split('').map(c => c + c).join('').toLowerCase();
                } else {
                    // Invalid format, don't apply
                    return;
                }

                // Update the input to show the corrected value
                this.colors[type] = value;
            } else {
                this.colors[type] = value;
            }

            this.applyColorRealTime(type, value);
        },

        // Calculate text color based on background luminance (enhanced version)
        getContrastingTextColor(hexColor) {
            // Remove # if present
            const cleanHex = hexColor.replace('#', '');

            // Convert hex to RGB
            const r = parseInt(cleanHex.slice(0, 2), 16);
            const g = parseInt(cleanHex.slice(2, 4), 16);
            const b = parseInt(cleanHex.slice(4, 6), 16);

            // Calculate relative luminance using sRGB colorspace
            const rsRGB = r / 255;
            const gsRGB = g / 255;
            const bsRGB = b / 255;

            const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
            const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
            const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

            const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

            // Use WCAG contrast ratio guidelines
            return luminance > 0.179 ? '#1f2937' : '#ffffff';
        },

        applyColorRealTime(type, color) {
            const root = document.documentElement;
            const textColor = this.getContrastingTextColor(color);

            // Debounce rapid changes for better performance
            if (this.applyTimeout) {
                clearTimeout(this.applyTimeout);
            }

            this.applyTimeout = setTimeout(() => {
                switch(type) {
                    case 'navbar':
                        root.style.setProperty('--custom-navbar-bg', color);
                        root.style.setProperty('--custom-navbar-text', textColor);

                        // Use more specific selector to avoid conflict with sidebar and dropdowns
                        const navbar = document.querySelector('.hospital-navbar');
                        if (navbar) {
                            navbar.style.setProperty('background-color', color, 'important');
                            navbar.style.setProperty('color', textColor, 'important');

                            // Update all interactive elements in navbar (excluding dropdowns)
                            const interactiveElements = navbar.querySelectorAll('button:not(.gqa-dropdown *):not(.gqa-dropdown-item), a:not(.gqa-dropdown *):not(.gqa-dropdown-item), .gqa-btn:not(.gqa-dropdown *), .btn:not(.gqa-dropdown *), input[type="search"]:not(.gqa-dropdown *)');
                            interactiveElements.forEach(el => {
                                el.style.setProperty('color', textColor, 'important');
                                el.style.setProperty('border-color', textColor, 'important');

                                // Special handling for search input
                                if (el.tagName === 'INPUT') {
                                    el.style.setProperty('background-color', 'rgba(255,255,255,0.1)', 'important');
                                    el.style.setProperty('border-color', textColor, 'important');
                                }
                            });

                            // Update text elements including page headers and brand (excluding dropdowns)
                            const textElements = navbar.querySelectorAll('span:not(.gqa-dropdown *), p:not(.gqa-dropdown *), div:not(.gqa-dropdown):not([x-show]):not([x-data]), h1:not(.gqa-dropdown *), h2:not(.gqa-dropdown *), h3:not(.gqa-dropdown *), h4:not(.gqa-dropdown *), h5:not(.gqa-dropdown *), h6:not(.gqa-dropdown *), .page-header:not(.gqa-dropdown *), .navbar-brand:not(.gqa-dropdown *), .brand:not(.gqa-dropdown *), .logo:not(.gqa-dropdown *), .logo-text:not(.gqa-dropdown *)');
                            textElements.forEach(el => {
                                el.style.setProperty('color', textColor, 'important');
                            });

                            // Update SVG icons in navbar (excluding dropdowns)
                            const svgIcons = navbar.querySelectorAll('svg:not(.gqa-dropdown *)');
                            svgIcons.forEach(icon => {
                                icon.style.setProperty('color', textColor, 'important');
                                icon.style.setProperty('stroke', textColor, 'important');
                            });

                            // Update badges and quick stats in navbar (excluding dropdowns) - COMPLETE BADGE STYLING
                            const badges = navbar.querySelectorAll('.badge:not(.gqa-dropdown *), .hospital-badge:not(.gqa-dropdown *), .quick-stat:not(.gqa-dropdown *), [class*="badge"]:not(.gqa-dropdown *), [class*="stat"]:not(.gqa-dropdown *), .bg-green-50, .dark\\:bg-green-900\\/20, [class*="bg-"]:not(.gqa-dropdown *)');
                            badges.forEach(badge => {
                                const isDark = textColor === '#ffffff';
                                
                                // Set badge background and text colors based on navbar contrast
                                const badgeBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
                                const badgeTextColor = isDark ? '#ffffff' : '#1f2937';
                                
                                badge.style.setProperty('background-color', badgeBg, 'important');
                                badge.style.setProperty('color', badgeTextColor, 'important');
                                badge.style.setProperty('border-color', badgeTextColor, 'important');

                                // Fix ALL text elements within badges including spans, indicators, etc.
                                const badgeTextElements = badge.querySelectorAll('span, div, p, small, .w-2, .animate-pulse');
                                badgeTextElements.forEach(textEl => {
                                    textEl.style.setProperty('color', badgeTextColor, 'important');
                                    
                                    // Handle indicator dots (like the green pulse dot)
                                    if (textEl.classList.contains('w-2') || textEl.classList.contains('animate-pulse')) {
                                        const indicatorColor = isDark ? '#4ade80' : '#22c55e';
                                        textEl.style.setProperty('background-color', indicatorColor, 'important');
                                    }
                                });

                                // Apply to any direct text content
                                if (badge.firstChild && badge.firstChild.nodeType === Node.TEXT_NODE) {
                                    badge.style.setProperty('color', badgeTextColor, 'important');
                                }
                            });
                        }
                        break;

                    case 'sidebar':
                        root.style.setProperty('--custom-sidebar-bg', color);
                        root.style.setProperty('--custom-sidebar-text', textColor);

                        // Use specific selector for sidebar only
                        const sidebar = document.querySelector('.hospital-sidebar');
                        if (sidebar) {
                            sidebar.style.setProperty('background-color', color, 'important');
                            sidebar.style.setProperty('color', textColor, 'important');

                            // Update logo text and brand elements with comprehensive selectors
                            const logoSelectors = [
                                '.logo', '.logo-text', '.brand', '.sidebar-brand', '.navbar-brand',
                                '.hospital-brand', '.app-brand', '.brand-text',
                                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                                '[class*="logo"]', '[class*="brand"]', '[class*="title"]',
                                '.sidebar-header', '.brand-link'
                            ];

                            logoSelectors.forEach(logoSelector => {
                                const logoElements = sidebar.querySelectorAll(logoSelector);
                                logoElements.forEach(el => {
                                    el.style.setProperty('color', textColor, 'important');
                                    // Also update any child text elements
                                    const childTexts = el.querySelectorAll('span, div, p');
                                    childTexts.forEach(child => {
                                        child.style.setProperty('color', textColor, 'important');
                                    });
                                });
                            });

                            // Update ALL text elements in sidebar with enhanced coverage
                            const textSelectors = [
                                'a', 'span', 'div', 'p', 'li', 'label',
                                '.nav-link', '.sidebar-link', '.menu-item',
                                '.hospital-nav-item', '.nav-item',
                                '[class*="nav-"]', '[class*="menu-"]', '[class*="link"]'
                            ];

                            textSelectors.forEach(textSelector => {
                                const elements = sidebar.querySelectorAll(textSelector);
                                elements.forEach(el => {
                                    el.style.setProperty('color', textColor, 'important');
                                });
                            });

                            // Apply to ALL elements that might contain text
                            const allSidebarElements = sidebar.querySelectorAll('*');
                            allSidebarElements.forEach(el => {
                                // Apply color to elements with direct text content
                                if (el.childNodes.length > 0) {
                                    let hasDirectText = false;
                                    for (let node of el.childNodes) {
                                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                            hasDirectText = true;
                                            break;
                                        }
                                    }
                                    if (hasDirectText) {
                                        el.style.setProperty('color', textColor, 'important');
                                    }
                                }

                                // Also apply to leaf elements with text
                                if (el.children.length === 0 && el.textContent.trim()) {
                                    el.style.setProperty('color', textColor, 'important');
                                }
                            });

                            // Update navigation items with enhanced hover effects
                            const navItems = sidebar.querySelectorAll('.hospital-nav-item, a, .nav-link, li, [class*="nav"], .sidebar-link, .menu-item');
                            navItems.forEach(el => {
                                el.style.setProperty('color', textColor, 'important');

                                // Add improved hover effect for nav items
                                if (el.tagName === 'A' || el.classList.contains('hospital-nav-item') || el.classList.contains('nav-link') || el.classList.contains('sidebar-link')) {
                                    // Remove existing listeners to avoid duplicates
                                    if (el._themeHoverEnter) {
                                        el.removeEventListener('mouseenter', el._themeHoverEnter);
                                        el.removeEventListener('mouseleave', el._themeHoverLeave);
                                    }

                                    // Create new listeners with enhanced hover effect
                                    el._themeHoverEnter = () => {
                                        const isDark = this.getContrastingTextColor(color) === '#ffffff';
                                        const hoverBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
                                        el.style.setProperty('background-color', hoverBg, 'important');
                                        el.style.setProperty('border-radius', '6px', 'important');
                                        el.style.setProperty('transition', 'all 0.2s ease', 'important');
                                    };

                                    el._themeHoverLeave = () => {
                                        el.style.removeProperty('background-color');
                                        el.style.removeProperty('border-radius');
                                    };

                                    el.addEventListener('mouseenter', el._themeHoverEnter);
                                    el.addEventListener('mouseleave', el._themeHoverLeave);
                                }
                            });

                            // Update icons in sidebar
                            const icons = sidebar.querySelectorAll('i, svg, .icon, [class*="icon"]');
                            icons.forEach(icon => {
                                icon.style.setProperty('color', textColor, 'important');
                                icon.style.setProperty('fill', textColor, 'important');
                            });
                        }
                        break;

                    case 'background':
                        root.style.setProperty('--custom-background', color);
                        root.style.setProperty('--custom-background-text', textColor);

                        // Apply to body and main content areas with enhanced coverage
                        const contentSelectors = [
                            'body',
                            '.hospital-content',
                            '.hospital-layout',
                            '.main-content',
                            '.content',
                            '.container',
                            '.container-fluid',
                            'main',
                            '#app',
                            '.app-content',
                            '.page-wrapper',
                            '[class*="content"]',
                            '[class*="main"]'
                        ];

                        contentSelectors.forEach(selector => {
                            try {
                                const elements = document.querySelectorAll(selector);
                                elements.forEach(content => {
                                    // Skip navbar and sidebar elements
                                    if (!content.closest('.hospital-navbar') && !content.closest('.hospital-sidebar')) {
                                        content.style.setProperty('background-color', color, 'important');
                                        content.style.setProperty('color', textColor, 'important');

                                        // Apply stronger text contrast to all text elements within content
                                        const textSelectors = [
                                            'p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                                            'label', 'a', 'button', 'input', 'textarea', 'select',
                                            '.text-sm', '.text-lg', '.text-xl', '.text-base',
                                            '.font-bold', '.font-semibold', '.font-medium',
                                            '.breadcrumb-item', '.nav-item', '.dropdown-item'
                                        ];

                                        textSelectors.forEach(textSelector => {
                                            const textElements = content.querySelectorAll(textSelector);
                                            textElements.forEach(textEl => {
                                                // Skip elements inside cards, navbar, and sidebar
                                                if (!textEl.closest('.hospital-card') &&
                                                    !textEl.closest('.card') &&
                                                    !textEl.closest('.hospital-navbar') &&
                                                    !textEl.closest('.hospital-sidebar') &&
                                                    !textEl.closest('.bg-white') &&
                                                    !textEl.closest('[class*="card"]')) {
                                                    textEl.style.setProperty('color', textColor, 'important');
                                                }
                                            });
                                        });
                                    }
                                });
                            } catch (e) {
                                console.warn('Selector error:', selector, e);
                            }
                        });

                        // Update ALL cards with enhanced selector coverage and improved contrast
                        const cardSelectors = [
                            '.hospital-card',
                            '.card',
                            '.bg-white',
                            '.bg-gray-50',
                            '.bg-gray-100',
                            '.dark\\:bg-gray-800',
                            '.dark\\:bg-gray-900',
                            '[class*="card"]',
                            '[class*="stats"]',
                            '.stats-card',
                            '.dashboard-card',
                            '.metric-card',
                            '.info-card',
                            '.data-card',
                            '.panel',
                            '.panel-default',
                            '.panel-white',
                            '.box',
                            '.widget',
                            '.tile',
                            '.item-card'
                        ];

                        cardSelectors.forEach(selector => {
                            try {
                                const cards = document.querySelectorAll(selector);
                                cards.forEach(card => {
                                    // Skip navbar and sidebar elements
                                    if (card.closest('.hospital-navbar') || card.closest('.hospital-sidebar') || card.closest('nav')) {
                                        return;
                                    }

                                    const isDark = this.getContrastingTextColor(color) === '#ffffff';

                                    // Apply proper contrasting cards: dark cards for dark backgrounds, light cards for light backgrounds
                                    const cardBg = isDark ? '#2d3748' : 'rgba(255,255,255,0.95)';
                                    const cardTextColor = isDark ? '#f7fafc' : '#2d3748';
                                    const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

                                    card.style.setProperty('background-color', cardBg, 'important');
                                    card.style.setProperty('color', cardTextColor, 'important');
                                    card.style.setProperty('border-color', cardBorder, 'important');
                                    const cardShadow = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)';
                                    card.style.setProperty('box-shadow', `0 4px 6px -1px ${cardShadow}, 0 2px 4px -1px rgba(0,0,0,0.06)`, 'important');

                                    // Update ALL text elements within cards with comprehensive selection
                                    const cardTextSelectors = [
                                        'h1, h2, h3, h4, h5, h6',
                                        'p, span, div, a, label',
                                        '.card-title, .card-text, .card-subtitle',
                                        '.metric-value, .stat-value, .number',
                                        '.card-header, .card-body, .card-footer',
                                        '.text-sm, .text-lg, .text-xl',
                                        '.font-bold, .font-semibold, .font-medium',
                                        '[class*="text-"]'
                                    ];

                                    cardTextSelectors.forEach(textSelector => {
                                        const textElements = card.querySelectorAll(textSelector);
                                        textElements.forEach(el => {
                                            // Only apply to leaf elements or elements with minimal children
                                            if (el.children.length <= 1 || el.textContent.trim()) {
                                                el.style.setProperty('color', cardTextColor, 'important');
                                            }
                                        });
                                    });

                                    // Update badges within cards with better contrast
                                    const cardBadges = card.querySelectorAll('.badge, .hospital-badge, .tag, .chip, [class*="badge"], [class*="tag"]');
                                    cardBadges.forEach(badge => {
                                        const badgeBg = isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.1)';
                                        const badgeText = isDark ? '#ffffff' : '#1e40af';
                                        badge.style.setProperty('background-color', badgeBg, 'important');
                                        badge.style.setProperty('color', badgeText, 'important');
                                        badge.style.setProperty('border-color', badgeText, 'important');
                                    });

                                    // Update buttons within cards
                                    const cardButtons = card.querySelectorAll('button, .btn, .gqa-btn, a[class*="btn"]');
                                    cardButtons.forEach(btn => {
                                        if (!btn.classList.contains('btn-primary') && !btn.classList.contains('btn-secondary')) {
                                            btn.style.setProperty('color', cardTextColor, 'important');
                                            btn.style.setProperty('border-color', cardTextColor, 'important');
                                        }
                                    });
                                });
                            } catch (e) {
                                console.warn('Card selector error:', selector, e);
                            }
                        });

                        // Update page headers globally
                        const pageHeaders = document.querySelectorAll('.page-header, .content-header, h1, h2, h3, h4, h5, h6');
                        pageHeaders.forEach(header => {
                            if (!header.closest('.hospital-navbar') && !header.closest('.hospital-sidebar')) {
                                header.style.setProperty('color', textColor, 'important');
                            }
                        });

                        // Update quick stats and badges globally - COMPLETE BADGE STYLING WITH PROPER CONTRAST
                        const globalBadges = document.querySelectorAll('.quick-stat, .stat-badge, .hospital-badge, [class*="stat"]:not([class*="card"]), .badge, [class*="badge"], .bg-green-50, .dark\\:bg-green-900\\/20, [class*="bg-"][class*="50"], [class*="bg-"][class*="100"]');
                        globalBadges.forEach(badge => {
                            if (!badge.closest('.hospital-navbar') && !badge.closest('.hospital-sidebar')) {
                                const isDark = textColor === '#ffffff';
                                
                                // Use proper contrast for badge backgrounds and text
                                const badgeBg = isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(249, 250, 251, 0.9)';
                                const badgeTextColor = isDark ? '#f3f4f6' : '#1f2937';
                                const badgeBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)';
                                
                                badge.style.setProperty('background-color', badgeBg, 'important');
                                badge.style.setProperty('color', badgeTextColor, 'important');
                                badge.style.setProperty('border-color', badgeBorder, 'important');

                                // Fix ALL nested elements within badges
                                const allBadgeElements = badge.querySelectorAll('*');
                                allBadgeElements.forEach(el => {
                                    // Apply text color to all text-containing elements
                                    if (el.nodeType === Node.ELEMENT_NODE) {
                                        el.style.setProperty('color', badgeTextColor, 'important');
                                        
                                        // Handle special indicator elements (dots, icons, etc.)
                                        if (el.classList.contains('w-2') || el.classList.contains('animate-pulse') || 
                                            el.classList.contains('bg-green-500') || el.classList.contains('rounded-full')) {
                                            const indicatorColor = isDark ? '#10b981' : '#059669';
                                            el.style.setProperty('background-color', indicatorColor, 'important');
                                        }
                                    }
                                });

                                // Ensure direct text content gets proper styling
                                if (badge.childNodes.length > 0) {
                                    badge.childNodes.forEach(node => {
                                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                                            badge.style.setProperty('color', badgeTextColor, 'important');
                                        }
                                    });
                                }
                            }
                        });
                        break;
                }
            }, 50); // 50ms debounce
        },

        async saveTheme() {
            this.loading = true;

            try {
                const response = await fetch('/theme/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({
                        navbar_color: this.colors.navbar,
                        sidebar_color: this.colors.sidebar,
                        background_color: this.colors.background,
                        is_custom: true
                    })
                });

                const data = await response.json();                if (data.success) {
                    // Update global state
                    window.hasCustomTheme = true;
                    window.userTheme = data.theme_settings;
                    this.updateIsCustomActive();

                    // Hide light/dark mode toggle
                    this.hideLightDarkToggle();

                    // Show success message
                    window.Hospital.utils.showToast('Tema salvo com sucesso!', 'success');
                    this.open = false;
                } else {
                    throw new Error(data.message || 'Falha ao salvar tema');
                }
            } catch (error) {
                console.error('Theme save error:', error);
                window.Hospital.utils.showToast('Falha ao salvar tema: ' + error.message, 'error');
            } finally {
                this.loading = false;
            }
        },

        async resetTheme() {
            this.loading = true;

            try {
                const response = await fetch('/theme/reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    }
                });

                const data = await response.json();                if (data.success) {
                    // Reset colors to defaults
                    this.colors = {
                        navbar: '#ffffff',
                        sidebar: '#ffffff',
                        background: '#f9fafb'
                    };

                    // Remove custom styles
                    this.removeCustomStyles();

                    // Update global state
                    window.hasCustomTheme = false;
                    window.userTheme = data.theme_settings;
                    this.updateIsCustomActive();

                    // Show light/dark mode toggle again
                    this.showLightDarkToggle();

                    // Show success message
                    window.Hospital.utils.showToast('Tema resetado para o padrão', 'success');
                    this.open = false;
                } else {
                    throw new Error(data.message || 'Falha ao resetar tema');
                }
            } catch (error) {
                console.error('Theme reset error:', error);
                window.Hospital.utils.showToast('Falha ao resetar tema: ' + error.message, 'error');
            } finally {
                this.loading = false;
            }
        },        removeCustomStyles() {
            const root = document.documentElement;
            const customStyleElement = document.getElementById('user-theme-styles');

            // Clear any pending timeout
            if (this.applyTimeout) {
                clearTimeout(this.applyTimeout);
                this.applyTimeout = null;
            }

            // Remove CSS custom properties
            const customProperties = [
                '--custom-navbar-bg', '--custom-navbar-text',
                '--custom-sidebar-bg', '--custom-sidebar-text',
                '--custom-background', '--custom-background-text'
            ];

            customProperties.forEach(prop => {
                root.style.removeProperty(prop);
            });

            // Comprehensive selectors for all potentially affected elements
            const allSelectors = [
                // Main layout elements
                'body', '.hospital-layout', '.hospital-content', '.main-content', '.content',
                '.container', '.container-fluid', 'main', '#app', '.app-content', '.page-wrapper',
                '[class*="content"]', '[class*="main"]',

                // Navbar elements
                '.hospital-navbar', 'nav', '.navbar', '[class*="nav"]',
                '.hospital-navbar button', '.hospital-navbar a', '.hospital-navbar .gqa-btn', '.hospital-navbar .btn',
                '.hospital-navbar span', '.hospital-navbar p', '.hospital-navbar div',
                '.hospital-navbar h1', '.hospital-navbar h2', '.hospital-navbar h3', '.hospital-navbar h4', '.hospital-navbar h5', '.hospital-navbar h6',
                '.page-header', '.navbar-brand', '.brand', '.logo', '.logo-text',
                '.hospital-navbar .badge', '.hospital-navbar .hospital-badge', '.hospital-navbar .quick-stat',

                // Sidebar elements
                '.hospital-sidebar', '.sidebar', 'aside', '[class*="sidebar"]',
                '.sidebar .logo', '.sidebar .logo-text', '.sidebar .brand', '.sidebar .sidebar-brand',
                '.sidebar .navbar-brand', '.sidebar .hospital-brand', '.sidebar .app-brand', '.sidebar .brand-text',
                '.sidebar h1', '.sidebar h2', '.sidebar h3', '.sidebar h4', '.sidebar h5', '.sidebar h6',
                '.sidebar a', '.sidebar span', '.sidebar div', '.sidebar p', '.sidebar li', '.sidebar label',
                '.sidebar .nav-link', '.sidebar .sidebar-link', '.sidebar .menu-item',
                '.hospital-nav-item', '.nav-item', '.sidebar i', '.sidebar svg', '.sidebar .icon',

                // Card elements
                '.hospital-card', '.card', '.bg-white', '.bg-gray-50', '.bg-gray-100',
                '.dark\\:bg-gray-800', '.dark\\:bg-gray-900', '[class*="card"]',
                '.stats-card', '.dashboard-card', '.metric-card', '.info-card', '.data-card',
                '.panel', '.panel-default', '.panel-white', '.box', '.widget', '.tile', '.item-card',
                '.card h1', '.card h2', '.card h3', '.card h4', '.card h5', '.card h6',
                '.card p', '.card span', '.card div', '.card a', '.card label',
                '.card-title', '.card-text', '.card-subtitle', '.metric-value', '.stat-value', '.number',
                '.card-header', '.card-body', '.card-footer',
                '.card button', '.card .btn', '.card .gqa-btn',
                '.card .badge', '.card .hospital-badge', '.card .tag', '.card .chip',

                // Global elements
                '.page-header', '.content-header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                '.quick-stat', '.stat-badge', '.hospital-badge', '[class*="stat"]'
            ];

            // Remove styles from all potential elements with comprehensive cleanup
            allSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        // Remove all potentially applied style properties
                        const propertiesToRemove = [
                            'background-color', 'background', 'color', 'border-color', 'border',
                            'box-shadow', 'backdrop-filter', 'fill', 'border-radius', 'transition'
                        ];

                        propertiesToRemove.forEach(prop => {
                            element.style.removeProperty(prop);
                        });

                        // Remove any inline style attribute if it's empty after cleanup
                        if (element.style.length === 0) {
                            element.removeAttribute('style');
                        }

                        // Remove hover event listeners if they exist
                        if (element._themeHoverEnter) {
                            element.removeEventListener('mouseenter', element._themeHoverEnter);
                            element.removeEventListener('mouseleave', element._themeHoverLeave);
                            delete element._themeHoverEnter;
                            delete element._themeHoverLeave;
                        }
                    });
                } catch (error) {
                    // Ignore selector errors for complex selectors
                    console.warn('Selector cleanup warning (ignored):', selector, error.message);
                }
            });

            // Additional cleanup for any remaining styled elements
            const allStyledElements = document.querySelectorAll('[style]');
            allStyledElements.forEach(element => {
                const style = element.getAttribute('style');
                if (style && (
                    style.includes('background-color') ||
                    style.includes('color:') ||
                    style.includes('border-color') ||
                    style.includes('box-shadow') ||
                    style.includes('backdrop-filter')
                )) {
                    // Remove theme-related properties while preserving others
                    const styleProps = style.split(';').filter(prop => {
                        const cleanProp = prop.trim().toLowerCase();
                        return !cleanProp.startsWith('background-color') &&
                               !cleanProp.startsWith('color:') &&
                               !cleanProp.startsWith('border-color') &&
                               !cleanProp.startsWith('box-shadow') &&
                               !cleanProp.startsWith('backdrop-filter') &&
                               !cleanProp.startsWith('fill') &&
                               !cleanProp.startsWith('border-radius') &&
                               !cleanProp.startsWith('transition') &&
                               cleanProp.length > 0;
                    });

                    if (styleProps.length > 0) {
                        element.setAttribute('style', styleProps.join(';'));
                    } else {
                        element.removeAttribute('style');
                    }
                }
            });

            // Remove custom style element
            if (customStyleElement) {
                customStyleElement.remove();
            }

            // Force refresh of page styling by toggling classes
            document.body.classList.add('theme-reset');
            setTimeout(() => {
                document.body.classList.remove('theme-reset');
                // Force a reflow to ensure all styles are properly updated
                document.body.offsetHeight;
            }, 50);

            console.log('🎨 Todos os estilos customizados foram completamente removidos');
        },

        updateIsCustomActive() {
            this.isCustomActive = window.hasCustomTheme;
        },

        hideLightDarkToggle() {
            const toggle = document.querySelector('[onclick="toggleHospitalTheme()"]');
            if (toggle) {
                toggle.style.display = 'none';
            }
        },

        showLightDarkToggle() {
            const toggle = document.querySelector('[onclick="toggleHospitalTheme()"]');
            if (toggle) {
                toggle.style.display = 'block';
            }
        },

        disableLightDarkToggle() {
            const toggle = document.querySelector('[onclick="toggleHospitalTheme()"]');
            if (toggle) {
                toggle.disabled = true;
                toggle.classList.add('opacity-50', 'cursor-not-allowed');
                toggle.title = 'Tema personalizado ativo - modo claro/escuro desabilitado';
            }
        },

        enableLightDarkToggle() {
            const toggle = document.querySelector('[onclick="toggleHospitalTheme()"]');
            if (toggle) {
                toggle.disabled = false;
                toggle.classList.remove('opacity-50', 'cursor-not-allowed');
                toggle.title = 'Alternar modo claro/escuro';
            }
        }
    }));
});

// 🎯 Log de inicialização
console.log('✅ Sistema Hospital carregado com ApexCharts!');
console.log('📊 ApexCharts configurado com tema Hospital');
console.log('⚡ Lazy loading e performance otimizados');
console.log('🎨 Suporte a tema claro/escuro ativo');
console.log('🎨 Theme Manager inicializado!');
