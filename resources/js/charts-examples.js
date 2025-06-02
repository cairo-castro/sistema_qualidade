/**
 * 📊 Exemplos práticos de ApexCharts - Sistema Hospital
 * 
 * Este arquivo contém exemplos de implementação dos gráficos ApexCharts
 * otimizados para o tema Hospital com máxima performance.
 */

// 🎯 Aguardar sistema estar pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Carregando exemplos de ApexCharts...');
    
    // 🔄 Inicializar gráficos quando os elementos estiverem prontos
    initializeChartExamples();
});

/**
 * 🚀 Inicializar todos os exemplos de gráficos
 */
async function initializeChartExamples() {
    // ⏳ Aguardar o sistema Hospital estar pronto
    if (!window.Hospital) {
        setTimeout(initializeChartExamples, 100);
        return;
    }
    
    // 📈 Exemplo 1: Gráfico de linha - Diagnósticos por mês
    await createDiagnosticsLineChart();
    
    // 📊 Exemplo 2: Gráfico de barras - Conformidade por setor
    await createComplianceBarChart();
    
    // 🍩 Exemplo 3: Gráfico donut - Distribuição de não conformidades
    await createNonComplianceDonutChart();
    
    // 📊 Exemplo 4: Gráfico de área - Evolução da qualidade
    await createQualityAreaChart();
    
    // 📋 Exemplo 5: Gráfico de radar - Performance por categoria
    await createPerformanceRadarChart();
}

/**
 * 📈 Exemplo 1: Gráfico de linha - Diagnósticos por mês
 */
async function createDiagnosticsLineChart() {
    const element = document.getElementById('diagnostics-chart');
    if (!element) return;
    
    try {
        const chart = await window.Hospital.charts.createLineChart('#diagnostics-chart', 
            [{
                name: 'Diagnósticos Realizados',
                data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 200, 220, 250]
            }, {
                name: 'Meta Mensal',
                data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
            }], 
            {
                chart: {
                    height: 400
                },
                xaxis: {
                    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                               'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    title: {
                        text: 'Meses do Ano',
                        style: {
                            color: window.Hospital.getCurrentTheme() === 'dark' ? '#d1d5db' : '#6b7280'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Quantidade de Diagnósticos',
                        style: {
                            color: window.Hospital.getCurrentTheme() === 'dark' ? '#d1d5db' : '#6b7280'
                        }
                    },
                    min: 0
                },
                title: {
                    text: 'Diagnósticos por Mês - 2024',
                    align: 'left',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600,
                        color: window.Hospital.getCurrentTheme() === 'dark' ? '#f9fafb' : '#111827'
                    }
                },
                stroke: {
                    width: [3, 2],
                    dashArray: [0, 5] // Linha tracejada para meta
                },
                markers: {
                    size: [6, 4],
                    hover: {
                        size: [8, 6]
                    }
                }
            }
        );
        
        console.log('✅ Gráfico de diagnósticos criado');
    } catch (error) {
        console.error('❌ Erro ao criar gráfico de diagnósticos:', error);
    }
}

/**
 * 📊 Exemplo 2: Gráfico de barras - Conformidade por setor
 */
async function createComplianceBarChart() {
    const element = document.getElementById('compliance-chart');
    if (!element) return;
    
    try {
        const chart = await window.Hospital.charts.createBarChart('#compliance-chart',
            [{
                name: 'Conformidade (%)',
                data: [85, 92, 78, 96, 88, 82, 94, 90]
            }],
            {
                chart: {
                    height: 350
                },
                xaxis: {
                    categories: ['Emergência', 'UTI', 'Cirurgia', 'Pediatria', 
                               'Cardiologia', 'Neurologia', 'Oncologia', 'Radiologia'],
                    labels: {
                        rotate: -45,
                        style: {
                            fontSize: '11px'
                        }
                    }
                },
                yaxis: {
                    max: 100,
                    labels: {
                        formatter: function(value) {
                            return value + '%';
                        }
                    }
                },
                title: {
                    text: 'Taxa de Conformidade por Setor',
                    align: 'left',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 6,
                        columnWidth: '70%',
                        distributed: false,
                        dataLabels: {
                            position: 'top'
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function(val) {
                        return val + '%';
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ['#111827']
                    }
                },
                // 🎨 Cores condicionais baseadas na performance
                colors: [{
                    ranges: [{
                        from: 0,
                        to: 70,
                        color: '#ef4444' // Vermelho para baixa conformidade
                    }, {
                        from: 71,
                        to: 85,
                        color: '#eab308' // Amarelo para conformidade média
                    }, {
                        from: 86,
                        to: 100,
                        color: '#22c55e' // Verde para alta conformidade
                    }]
                }]
            }
        );
        
        console.log('✅ Gráfico de conformidade criado');
    } catch (error) {
        console.error('❌ Erro ao criar gráfico de conformidade:', error);
    }
}

/**
 * 🍩 Exemplo 3: Gráfico donut - Distribuição de não conformidades
 */
async function createNonComplianceDonutChart() {
    const element = document.getElementById('noncompliance-chart');
    if (!element) return;
    
    try {
        const chart = await window.Hospital.charts.createDonutChart('#noncompliance-chart',
            [35, 25, 20, 15, 5], // Valores em percentual
            {
                chart: {
                    height: 400
                },
                labels: ['Documentação', 'Procedimentos', 'Equipamentos', 'Treinamento', 'Outros'],
                title: {
                    text: 'Tipos de Não Conformidades',
                    align: 'left',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600
                    }
                },
                legend: {
                    position: 'right',
                    fontSize: '14px',
                    fontWeight: 500,
                    formatter: function(seriesName, opts) {
                        return seriesName + ': ' + opts.w.globals.series[opts.seriesIndex] + '%';
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                name: {
                                    show: true,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: window.Hospital.getCurrentTheme() === 'dark' ? '#f9fafb' : '#111827'
                                },
                                value: {
                                    show: true,
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    color: window.Hospital.getCurrentTheme() === 'dark' ? '#f9fafb' : '#111827',
                                    formatter: function(val) {
                                        return val + '%';
                                    }
                                },
                                total: {
                                    show: true,
                                    label: 'Total',
                                    fontSize: '14px',
                                    color: window.Hospital.getCurrentTheme() === 'dark' ? '#9ca3af' : '#6b7280',
                                    formatter: function() {
                                        return '100%';
                                    }
                                }
                            }
                        }
                    }
                },
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
            }
        );
        
        console.log('✅ Gráfico donut criado');
    } catch (error) {
        console.error('❌ Erro ao criar gráfico donut:', error);
    }
}

/**
 * 📊 Exemplo 4: Gráfico de área - Evolução da qualidade
 */
async function createQualityAreaChart() {
    const element = document.getElementById('quality-chart');
    if (!element) return;
    
    try {
        const chart = await window.Hospital.charts.create('#quality-chart', {
            type: 'area',
            series: [{
                name: 'Índice de Qualidade',
                data: [72, 75, 78, 82, 85, 88, 92, 89, 94, 96, 98, 95]
            }],
            options: {
                chart: {
                    height: 300,
                    sparkline: {
                        enabled: false
                    }
                },
                xaxis: {
                    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                               'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    labels: {
                        formatter: function(value) {
                            return value + '%';
                        }
                    }
                },
                title: {
                    text: 'Evolução do Índice de Qualidade - 2024',
                    align: 'left',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600
                    }
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.25,
                        gradientToColors: ['#4ade80'],
                        inverseColors: false,
                        opacityFrom: 0.8,
                        opacityTo: 0.1,
                        stops: [0, 100]
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                markers: {
                    size: 5,
                    strokeWidth: 2,
                    hover: {
                        size: 7
                    }
                },
                // 🎯 Anotações para destacar marcos importantes
                annotations: {
                    points: [{
                        x: 'Set',
                        y: 94,
                        marker: {
                            size: 8,
                            fillColor: '#ef4444',
                            strokeColor: '#ef4444',
                            radius: 2
                        },
                        label: {
                            borderColor: '#ef4444',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#ef4444'
                            },
                            text: 'Meta Atingida'
                        }
                    }]
                }
            }
        });
        
        console.log('✅ Gráfico de área criado');
    } catch (error) {
        console.error('❌ Erro ao criar gráfico de área:', error);
    }
}

/**
 * 📋 Exemplo 5: Gráfico de radar - Performance por categoria
 */
async function createPerformanceRadarChart() {
    const element = document.getElementById('performance-chart');
    if (!element) return;
    
    try {
        const chart = await window.Hospital.charts.create('#performance-chart', {
            type: 'radar',
            series: [{
                name: 'Performance Atual',
                data: [85, 92, 78, 88, 90, 82]
            }, {
                name: 'Meta',
                data: [90, 95, 85, 90, 95, 88]
            }],
            options: {
                chart: {
                    height: 400
                },
                xaxis: {
                    categories: ['Segurança', 'Eficiência', 'Qualidade', 
                               'Atendimento', 'Tecnologia', 'Treinamento']
                },
                yaxis: {
                    min: 0,
                    max: 100,
                    tickAmount: 5
                },
                title: {
                    text: 'Performance por Categoria',
                    align: 'left',
                    style: {
                        fontSize: '18px',
                        fontWeight: 600
                    }
                },
                plotOptions: {
                    radar: {
                        polygons: {
                            strokeColors: window.Hospital.getCurrentTheme() === 'dark' ? '#374151' : '#e5e7eb',
                            connectorColors: window.Hospital.getCurrentTheme() === 'dark' ? '#374151' : '#e5e7eb'
                        }
                    }
                },
                markers: {
                    size: 4,
                    hover: {
                        size: 6
                    }
                },
                stroke: {
                    width: 2
                },
                fill: {
                    opacity: 0.2
                }
            }
        });
        
        console.log('✅ Gráfico de radar criado');
    } catch (error) {
        console.error('❌ Erro ao criar gráfico de radar:', error);
    }
}

/**
 * 🔄 Função para atualizar dados dos gráficos (exemplo de uso dinâmico)
 */
window.updateChartData = function() {
    // 📊 Simular novos dados
    const newDiagnosticsData = Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 80);
    
    // 🔄 Atualizar gráfico de diagnósticos
    window.Hospital.charts.updateSeries('diagnostics-chart', [{
        name: 'Diagnósticos Realizados',
        data: newDiagnosticsData
    }, {
        name: 'Meta Mensal',
        data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150]
    }]);
    
    console.log('🔄 Dados dos gráficos atualizados');
};

/**
 * 🎨 Função para alternar tema dos gráficos
 */
window.toggleChartsTheme = function() {
    const currentTheme = window.Hospital.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 🌓 Alterar tema do documento
    document.documentElement.setAttribute('data-theme', newTheme);
    
    console.log(`🎨 Tema alterado para: ${newTheme}`);
};

// 🚀 Expor funções para debugging/desenvolvimento
if (typeof window !== 'undefined') {
    window.chartsExamples = {
        updateChartData: window.updateChartData,
        toggleChartsTheme: window.toggleChartsTheme,
        createDiagnosticsLineChart,
        createComplianceBarChart,
        createNonComplianceDonutChart,
        createQualityAreaChart,
        createPerformanceRadarChart
    };
}

console.log('📊 Exemplos de ApexCharts carregados e prontos!'); 