# 📊 Guia ApexCharts - Sistema Hospital

Este guia contém informações completas sobre como usar ApexCharts no sistema Hospital de forma otimizada e seguindo as melhores práticas.

## 🎯 Visão Geral

ApexCharts substituiu Chart.js no sistema por oferecer:
- ⚡ **Melhor performance** - Rendering mais rápido
- 🎨 **Maior flexibilidade** - Mais opções de customização
- 📱 **Responsividade nativa** - Mobile-first design
- 🌓 **Suporte a temas** - Integração completa com modo escuro
- 📊 **Mais tipos de gráficos** - Biblioteca mais completa

## 🚀 Quick Start

### 1. Básico - Criar um gráfico simples

```javascript
// HTML
<div id="meu-grafico" data-chart="line" style="height: 350px;"></div>

// JavaScript - Aguardar o sistema estar pronto
document.addEventListener('DOMContentLoaded', async () => {
    const chart = await window.Hospital.charts.createLineChart('#meu-grafico', 
        [{
            name: 'Vendas',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }]
    );
});
```

### 2. Usando helpers especializados

```javascript
// Gráfico de linha
const lineChart = await window.Hospital.charts.createLineChart(selector, data, options);

// Gráfico de barras
const barChart = await window.Hospital.charts.createBarChart(selector, data, options);

// Gráfico donut
const donutChart = await window.Hospital.charts.createDonutChart(selector, data, options);
```

### 3. Configuração avançada

```javascript
const chart = await window.Hospital.charts.create('#grafico-avancado', {
    type: 'area',
    series: [{
        name: 'Série 1',
        data: [31, 40, 28, 51, 42, 109, 100]
    }],
    options: {
        chart: {
            height: 400
        },
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']
        },
        title: {
            text: 'Meu Gráfico Personalizado'
        }
        // Mais opções...
    }
});
```

## 🎨 Tema e Cores

### Cores Padrão do Sistema Hospital

```javascript
// Cores disponíveis
const cores = window.Hospital.config.chartTheme.colors;
// ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#06b6d4', '#f59e0b']

// Verde Hospital: #22c55e
// Azul: #3b82f6  
// Amarelo: #eab308
// Vermelho: #ef4444
// Roxo: #8b5cf6
// Ciano: #06b6d4
// Laranja: #f59e0b
```

### Tema Automático

O sistema detecta automaticamente:
- 🌞 Modo claro (`light`)
- 🌙 Modo escuro (`dark`)
- 🔄 Mudanças em tempo real

```javascript
// Verificar tema atual
const tema = window.Hospital.getCurrentTheme(); // 'light' ou 'dark'

// Os gráficos se adaptam automaticamente
```

## 📊 Tipos de Gráficos Disponíveis

### 1. 📈 Gráficos de Linha

**Ideal para:** Tendências ao longo do tempo, comparações temporais

```javascript
const chart = await window.Hospital.charts.createLineChart('#linha-chart', 
    [{
        name: 'Pacientes',
        data: [120, 132, 101, 134, 90, 230, 210]
    }, {
        name: 'Meta',
        data: [150, 150, 150, 150, 150, 150, 150]
    }],
    {
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']
        },
        title: {
            text: 'Pacientes Atendidos vs Meta'
        }
    }
);
```

### 2. 📊 Gráficos de Barras

**Ideal para:** Comparações entre categorias, rankings

```javascript
const chart = await window.Hospital.charts.createBarChart('#barra-chart',
    [{
        name: 'Conformidade (%)',
        data: [85, 92, 78, 96, 88, 82, 94, 90]
    }],
    {
        xaxis: {
            categories: ['UTI', 'Emergência', 'Cirurgia', 'Pediatria', 'Cardiologia', 'Neurologia', 'Oncologia', 'Radiologia']
        },
        title: {
            text: 'Taxa de Conformidade por Setor'
        }
    }
);
```

### 3. 🍩 Gráficos Donut/Pizza

**Ideal para:** Distribuições, percentuais

```javascript
const chart = await window.Hospital.charts.createDonutChart('#donut-chart',
    [35, 25, 20, 15, 5], // Percentuais
    {
        labels: ['Documentação', 'Procedimentos', 'Equipamentos', 'Treinamento', 'Outros'],
        title: {
            text: 'Distribuição de Não Conformidades'
        }
    }
);
```

### 4. 📊 Gráficos de Área

**Ideal para:** Volume ao longo do tempo, tendências suaves

```javascript
const chart = await window.Hospital.charts.create('#area-chart', {
    type: 'area',
    series: [{
        name: 'Qualidade',
        data: [72, 75, 78, 82, 85, 88, 92, 89, 94, 96, 98, 95]
    }],
    options: {
        xaxis: {
            categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        },
        fill: {
            type: 'gradient'
        }
    }
});
```

### 5. 🕸️ Gráficos Radar

**Ideal para:** Análises multidimensionais, performance em várias métricas

```javascript
const chart = await window.Hospital.charts.create('#radar-chart', {
    type: 'radar',
    series: [{
        name: 'Performance Atual',
        data: [85, 92, 78, 88, 90, 82]
    }, {
        name: 'Meta',
        data: [90, 95, 85, 90, 95, 88]
    }],
    options: {
        xaxis: {
            categories: ['Segurança', 'Eficiência', 'Qualidade', 'Atendimento', 'Tecnologia', 'Treinamento']
        }
    }
});
```

## 🔄 Gerenciamento de Gráficos

### Atualizar Dados

```javascript
// Atualizar um gráfico específico
window.Hospital.charts.updateSeries('meu-grafico-id', [{
    name: 'Novos Dados',
    data: [100, 200, 300, 400, 500]
}]);

// Com animação (padrão: true)
window.Hospital.charts.updateSeries('meu-grafico-id', newData, true);

// Sem animação
window.Hospital.charts.updateSeries('meu-grafico-id', newData, false);
```

### Destruir Gráficos

```javascript
// Destruir um gráfico específico
window.Hospital.charts.destroy('meu-grafico-id');

// Destruir todos os gráficos (limpeza)
window.Hospital.charts.destroyAll();
```

### Alternar Tema

```javascript
// Os gráficos se atualizam automaticamente quando o tema muda
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-theme', 'light');

// Ou usar helper
window.toggleChartsTheme(); // Alterna entre claro/escuro
```

## ⚡ Performance e Otimizações

### Lazy Loading

Os gráficos são carregados apenas quando necessário:

```html
<!-- O atributo data-chart ativa o lazy loading -->
<div id="meu-grafico" data-chart="line"></div>

<!-- Intersection Observer detecta quando o elemento entra na viewport -->
```

### Redução de Animações

Sistema detecta automaticamente:
- `prefers-reduced-motion: reduce`
- Bateria baixa (< 20%)
- Configuração manual

```javascript
// Desabilitar animações manualmente
window.Hospital.config.chartTheme.performance.reducedMotion = true;
```

### Responsividade

```javascript
// Configuração automática para mobile
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
```

## 🛠️ Configurações Avançadas

### Formatação de Dados

```javascript
const chart = await window.Hospital.charts.create('#grafico', {
    series: [/*...*/],
    options: {
        tooltip: {
            y: {
                formatter: function(value) {
                    // Usar formatters do sistema
                    return window.Hospital.utils.formatCurrency(value);
                    // ou
                    return window.Hospital.utils.formatNumber(value);
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function(value) {
                    return window.Hospital.utils.formatCurrency(value);
                }
            }
        }
    },
    formatCurrency: true // Ativa formatação automática
});
```

### Exportação

```javascript
// Configuração de exportação personalizada
chart: {
    toolbar: {
        export: {
            csv: {
                filename: 'hospital-dados-' + new Date().toISOString().split('T')[0],
                columnDelimiter: ',',
                headerCategory: 'Categoria',
                headerValue: 'Valor'
            },
            png: {
                filename: 'hospital-grafico-' + Date.now()
            }
        }
    }
}
```

### Anotações

```javascript
// Destacar pontos importantes
annotations: {
    points: [{
        x: 'Mar',
        y: 85,
        marker: {
            size: 8,
            fillColor: '#ef4444'
        },
        label: {
            text: 'Meta Atingida',
            style: {
                background: '#ef4444'
            }
        }
    }]
}
```

## 🧪 Debugging e Desenvolvimento

### Console Helpers

```javascript
// Verificar gráficos carregados
console.log(window.Hospital.charts.instances);

// Verificar tema atual
console.log(window.Hospital.getCurrentTheme());

// Atualizar dados de exemplo
window.updateChartData();

// Alternar tema
window.toggleChartsTheme();

// Funções de exemplo
window.chartsExamples.createDiagnosticsLineChart();
window.chartsExamples.createComplianceBarChart();
```

### Performance Monitoring

```javascript
// Monitoramento automático em desenvolvimento
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('📊 Performance da página:');
    console.log(`⏱️ DOM: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
    console.log(`🚀 Total: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
});
```

## 📋 Checklist para Novos Gráficos

- [ ] **HTML**: Adicionar `data-chart` para lazy loading
- [ ] **ID único**: Cada gráfico precisa de um ID único
- [ ] **Altura mínima**: Definir `min-height` no CSS
- [ ] **Loading state**: Placeholder enquanto carrega
- [ ] **Responsivo**: Testar em mobile
- [ ] **Tema**: Verificar em modo claro e escuro
- [ ] **Performance**: Usar helpers otimizados quando possível
- [ ] **Cleanup**: Destruir gráficos ao sair da página

## 🔧 Troubleshooting

### Gráfico não aparece
1. Verificar se o elemento existe no DOM
2. Confirmar que o ID é único
3. Verificar console para erros
4. Aguardar sistema Hospital estar carregado

### Performance lenta
1. Reduzir dados ou usar paginação
2. Desabilitar animações
3. Usar lazy loading
4. Verificar memory leaks

### Tema não atualiza
1. Verificar se `data-theme` está no `<html>`
2. Confirmar listener de mudança de tema
3. Forçar atualização: `window.Hospital.charts.updateAllThemes()`

## 📚 Recursos Adicionais

- [Documentação ApexCharts](https://apexcharts.com/docs/)
- [Exemplos de gráficos](resources/views/examples/charts.blade.php)
- [Arquivo de exemplos JS](resources/js/charts-examples.js)
- [Sistema Hospital JS](resources/js/app.js)

---

**📊 ApexCharts + Sistema Hospital = Performance + Flexibilidade + Tema Integrado** 🚀 