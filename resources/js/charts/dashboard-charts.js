/**
 * Dashboard Charts Module
 * Handles ApexCharts initialization and management for the dashboard
 */

import { LazyLoader } from '../config/lazy-loader.js';

class DashboardCharts {
    constructor() {
        this.charts = new Map();
        this.isApexChartsLoaded = false;
        this.loadPromise = null;
    }

    /**
     * Load ApexCharts library if not already loaded
     */
    async loadApexCharts() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise(async (resolve, reject) => {
            try {
                if (typeof ApexCharts !== 'undefined') {
                    console.log('✅ ApexCharts already loaded');
                    this.isApexChartsLoaded = true;
                    resolve(true);
                    return;
                }

                console.log('⏳ Loading ApexCharts...');
                const ApexChartsModule = await LazyLoader.loadApexCharts();
                
                // Make ApexCharts globally available
                window.ApexCharts = ApexChartsModule.default || ApexChartsModule;
                
                this.isApexChartsLoaded = true;
                console.log('✅ ApexCharts loaded successfully');
                resolve(true);
            } catch (error) {
                console.error('❌ Failed to load ApexCharts:', error);
                reject(error);
            }
        });

        return this.loadPromise;
    }

    /**
     * Initialize main dashboard diagnostics chart
     */
    async initializeDiagnosticsChart() {
        try {
            const container = document.getElementById('diagnosticsChart');
            if (!container) {
                console.error('❌ Chart container #diagnosticsChart not found');
                return null;
            }

            await this.loadApexCharts();

            // Clear container
            container.innerHTML = '';

            // Check if chart already exists
            if (this.charts.has('diagnosticsChart')) {
                this.charts.get('diagnosticsChart').destroy();
                this.charts.delete('diagnosticsChart');
            }

            // Determine theme
            const isDark = document.documentElement.classList.contains('dark');

            // Sample data - in production this would come from the server
            const chartData = {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45]
            };

            const options = {
                series: [{
                    name: 'Diagnósticos',
                    data: chartData.data,
                    color: '#22c55e'
                }],
                chart: {
                    height: 320,
                    type: 'line',
                    toolbar: {
                        show: true,
                        tools: {
                            download: true,
                            zoom: true,
                            reset: true
                        }
                    },
                    background: 'transparent',
                    fontFamily: 'Inter, system-ui, sans-serif'
                },
                theme: {
                    mode: isDark ? 'dark' : 'light'
                },
                xaxis: {
                    categories: chartData.labels,
                    labels: {
                        style: {
                            colors: isDark ? '#9ca3af' : '#6b7280'
                        }
                    }
                },
                yaxis: {
                    min: 0,
                    forceNiceScale: true,
                    labels: {
                        style: {
                            colors: isDark ? '#9ca3af' : '#6b7280'
                        }
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                grid: {
                    borderColor: isDark ? '#374151' : '#f3f4f6',
                    strokeDashArray: 3
                },
                tooltip: {
                    theme: isDark ? 'dark' : 'light',
                    y: {
                        formatter: function(val) {
                            return val + ' diagnósticos';
                        }
                    }
                },
                legend: {
                    labels: {
                        colors: isDark ? '#e5e7eb' : '#374151'
                    }
                },
                dataLabels: {
                    enabled: false
                },
                markers: {
                    size: 4,
                    colors: ['#22c55e'],
                    strokeColors: '#fff',
                    strokeWidth: 2,
                    hover: {
                        size: 6
                    }
                }
            };

            const chart = new ApexCharts(container, options);
            await chart.render();

            this.charts.set('diagnosticsChart', chart);
            console.log('✅ Diagnostics chart initialized successfully');

            return chart;

        } catch (error) {
            console.error('❌ Failed to initialize diagnostics chart:', error);
            
            // Show error message in container
            const container = document.getElementById('diagnosticsChart');
            if (container) {
                container.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center text-gray-600 dark:text-gray-400">
                            <svg class="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <p class="text-lg font-medium mb-2">Erro ao carregar gráfico</p>
                            <p class="text-sm mb-4">Não foi possível inicializar o ApexCharts</p>
                            <button onclick="window.dashboardCharts?.initializeDiagnosticsChart()" 
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                `;
            }
            
            return null;
        }
    }

    /**
     * Update chart theme when dark mode changes
     */
    updateChartsTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        
        this.charts.forEach((chart, chartId) => {
            try {
                chart.updateOptions({
                    theme: {
                        mode: isDark ? 'dark' : 'light'
                    },
                    xaxis: {
                        labels: {
                            style: {
                                colors: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: isDark ? '#9ca3af' : '#6b7280'
                            }
                        }
                    },
                    grid: {
                        borderColor: isDark ? '#374151' : '#f3f4f6'
                    },
                    tooltip: {
                        theme: isDark ? 'dark' : 'light'
                    },
                    legend: {
                        labels: {
                            colors: isDark ? '#e5e7eb' : '#374151'
                        }
                    }
                });
                console.log(`🌓 Updated ${chartId} theme to ${isDark ? 'dark' : 'light'} mode`);
            } catch (error) {
                console.error(`❌ Failed to update ${chartId} theme:`, error);
            }
        });
    }

    /**
     * Reload dashboard data - simulate API call
     */
    async reloadDashboard() {
        console.log('🔄 Reloading dashboard data...');
        
        // Show loading state
        window.loading = true;
        if (window.Alpine?.store?.hospital) {
            window.Alpine.store('hospital').setLoading(true);
        }

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update charts with new data
            const chart = this.charts.get('diagnosticsChart');
            if (chart) {
                // Generate random sample data
                const newData = Array.from({length: 12}, () => Math.floor(Math.random() * 50) + 10);
                
                chart.updateSeries([{
                    name: 'Diagnósticos',
                    data: newData
                }]);
                
                console.log('✅ Dashboard data reloaded');
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
    }

    /**
     * Destroy all charts
     */
    destroy() {
        this.charts.forEach((chart, chartId) => {
            try {
                chart.destroy();
                console.log(`🗑️ Destroyed chart: ${chartId}`);
            } catch (error) {
                console.error(`❌ Failed to destroy chart ${chartId}:`, error);
            }
        });
        
        this.charts.clear();
        console.log('✅ All charts destroyed');
    }
}

// The initialization is now handled in app.js
// This module just exports the DashboardCharts class

export { DashboardCharts };