/**
 * 📊 Componentes Alpine.js para Dashboard - Sistema Hospital
 * 
 * Este arquivo contém os componentes Alpine.js específicos para o dashboard,
 * incluindo integração com ApexCharts e funcionalidades do sistema.
 */

// 🎯 Aguardar Alpine.js estar disponível
document.addEventListener('alpine:init', () => {
    console.log('🚀 Inicializando componentes Alpine.js do Dashboard...');
    
    // 📊 Componente principal do dashboard hospitalar
    Alpine.data('hospitalDashboard', () => ({
        // 🔄 Estado de carregamento
        loading: false,
        
        // 📱 Estado da sidebar
        sidebarCollapsed: localStorage.getItem('hospital-sidebar-collapsed') === 'true' || false,
        sidebarOpen: false,
        
        // 📊 Estatísticas do dashboard - Valores seguros
        stats: {
            totalDiagnosticos: 1247,
            taxaConformidade: 94.5,
            periodosAtivos: 3,
            itensNaoConformes: 23
        },
        
        // 🔔 Notificações
        notifications: [
            {
                id: 1,
                title: 'Novo diagnóstico pendente',
                message: 'UTI Geral requer atenção',
                type: 'warning',
                time: '5 min atrás',
                read: false
            },
            {
                id: 2,
                title: 'Conformidade atingida',
                message: 'Setor Cardiologia: 98%',
                type: 'success', 
                time: '15 min atrás',
                read: false
            }
        ],
        
        // 🔔 Computed property para verificar se há notificações novas
        get hasNew() {
            return this.notifications.some(n => !n.read);
        },
          // 🎯 Inicialização do componente
        init() {
            console.log('🏥 Componente hospitalDashboard inicializado');
            
                        
            try {
                // 🔄 Sincronizar estado da sidebar
                this.updateSidebarState();
                
                // 📱 Listener para mudanças na sidebar
                this.$watch('sidebarCollapsed', (value) => {
                    localStorage.setItem('hospital-sidebar-collapsed', value);
                    this.updateSidebarClasses();
                });
                
                // 📱 Handle window resize to properly manage sidebar state
                window.addEventListener('resize', () => {
                    if (window.innerWidth >= 1024) {
                        // Desktop: close mobile sidebar if open
                        if (this.sidebarOpen) {
                            this.sidebarOpen = false;
                            const sidebar = document.querySelector('.hospital-sidebar');
                            const overlay = document.querySelector('.mobile-sidebar-overlay');
                            
                            if (sidebar) {
                                sidebar.classList.remove('mobile-open');
                            }
                            
                            if (overlay) {
                                overlay.classList.remove('active');
                            }
                            
                            document.body.style.overflow = '';
                        }
                    }
                });
                
                // ⏳ Aguardar DOM estar completamente pronto antes de inicializar gráficos
                this.$nextTick(() => {
                    setTimeout(() => {
                        // 🚫 Não inicializar gráficos aqui - deixar para dashboard-charts.js
                        console.log('✅ Componente Alpine.js pronto - gráficos serão inicializados separadamente');
                    }, 100);
                });
                
            } catch (error) {
                console.error('❌ Erro na inicialização do componente:', error);
            }
        },
        
        // 📱 Atualizar estado da sidebar
        updateSidebarState() {
            try {
                const sidebar = document.querySelector('.hospital-sidebar');
                const main = document.querySelector('.hospital-main');
                
                if (this.sidebarCollapsed) {
                    sidebar?.classList.add('collapsed');
                    main?.classList.add('sidebar-collapsed');
                } else {
                    sidebar?.classList.remove('collapsed');
                    main?.classList.remove('sidebar-collapsed');
                }
            } catch (error) {
                console.error('❌ Erro ao atualizar estado da sidebar:', error);
            }
        },
        
        // 📱 Atualizar classes da sidebar
        updateSidebarClasses() {
            try {
                const sidebar = document.querySelector('.hospital-sidebar');
                const main = document.querySelector('.hospital-main');
                
                if (this.sidebarCollapsed) {
                    sidebar?.classList.add('collapsed');
                    main?.classList.add('sidebar-collapsed');
                } else {
                    sidebar?.classList.remove('collapsed');
                    main?.classList.remove('sidebar-collapsed');
                }
            } catch (error) {
                console.error('❌ Erro ao atualizar classes da sidebar:', error);
            }
        },
          // 📱 Toggle da sidebar
        toggleSidebar() {
            // Check if we're on mobile (window width < 1024px)
            if (window.innerWidth < 1024) {
                // Mobile: toggle the mobile sidebar
                this.sidebarOpen = !this.sidebarOpen;
                
                // Add/remove mobile-open class to sidebar
                const sidebar = document.querySelector('.hospital-sidebar');
                const overlay = document.querySelector('.mobile-sidebar-overlay');
                
                if (sidebar) {
                    sidebar.classList.toggle('mobile-open', this.sidebarOpen);
                }
                
                if (overlay) {
                    overlay.classList.toggle('active', this.sidebarOpen);
                }
                
                // Prevent body scroll when sidebar is open on mobile
                if (this.sidebarOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            } else {
                // Desktop: toggle collapsed state
                this.sidebarCollapsed = !this.sidebarCollapsed;
                localStorage.setItem('hospital-sidebar-collapsed', this.sidebarCollapsed);
            }
        },
        
        // 📱 Toggle mobile da sidebar
        toggleMobileSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        
        // 🔔 Marcar notificação como lida
        markNotificationAsRead(notificationId) {
            try {
                const notification = this.notifications.find(n => n.id === notificationId);
                if (notification) {
                    notification.read = true;
                }
            } catch (error) {
                console.error('❌ Erro ao marcar notificação como lida:', error);
            }
        },
        
        // 🔔 Marcar todas as notificações como lidas
        markAllNotificationsAsRead() {
            try {
                this.notifications.forEach(n => n.read = true);
            } catch (error) {
                console.error('❌ Erro ao marcar todas as notificações como lidas:', error);
            }
        },
        
        // 🔄 Recarregar dados do dashboard
        async reloadDashboard() {
            this.loading = true;
            
            try {
                console.log('🔄 Recarregando dashboard...');
                
                // 🎯 Simular carregamento
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 📊 Atualizar estatísticas com valores seguros
                const randomIncrement = Math.floor(Math.random() * 10);
                const newConformidade = 85 + Math.random() * 10;
                
                this.stats.totalDiagnosticos = Math.max(0, this.stats.totalDiagnosticos + randomIncrement);
                this.stats.taxaConformidade = Math.min(100, Math.max(0, parseFloat(newConformidade.toFixed(1))));
                
                // 🔄 Atualizar gráficos se existirem
                if (window.dashboardCharts && window.dashboardCharts.diagnostics) {
                    try {
                        // Simular novos dados para o gráfico
                        const newDiagnosticos = Array.from({length: 12}, () => 
                            Math.floor(Math.random() * 100) + 100
                        );
                        const newConformidades = newDiagnosticos.map(val => 
                            Math.floor(val * (0.8 + Math.random() * 0.2))
                        );
                        
                        await window.dashboardCharts.diagnostics.updateSeries([
                            {
                                name: 'Diagnósticos Realizados',
                                data: newDiagnosticos
                            },
                            {
                                name: 'Conformidades',
                                data: newConformidades
                            }
                        ]);
                        
                        console.log('✅ Gráficos atualizados');
                    } catch (chartError) {
                        console.error('❌ Erro ao atualizar gráficos:', chartError);
                    }
                }
                
                // 🎉 Mostrar toast de sucesso
                this.showToast('Dashboard atualizado com sucesso!', 'success', 3000);
                
            } catch (error) {
                console.error('❌ Erro ao recarregar dashboard:', error);
                this.showToast('Erro ao atualizar dashboard', 'error', 4000);
            } finally {
                this.loading = false;
            }
        },

        // 🎉 Mostrar toast notification
        showToast(message, type = 'info', duration = 3000) {
            try {
                // 🎯 Usar sistema de toast nativo se disponível
                if (window.Hospital && window.Hospital.utils && window.Hospital.utils.showToast) {
                    window.Hospital.utils.showToast(message, type, duration);
                    return;
                }
                
                // 🎯 Fallback toast simples
                const toast = document.createElement('div');
                toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm transform transition-all duration-300 ${
                    type === 'success' ? 'bg-green-500' :
                    type === 'error' ? 'bg-red-500' :
                    type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                }`;
                toast.textContent = message;
                
                document.body.appendChild(toast);
                
                // 🎯 Auto-remover após duração especificada
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.parentNode.removeChild(toast);
                        }
                    }, 300);
                }, duration);
                
            } catch (error) {
                console.error('❌ Erro ao mostrar toast:', error);
                console.log(`📢 ${type.toUpperCase()}: ${message}`);
            }
        },

        // 🔢 Formatar números com segurança
        formatNumber(value) {
            try {
                if (value === null || value === undefined || value === '') return '0';
                
                const num = Number(value);
                if (isNaN(num) || !isFinite(num)) return '0';
                
                return new Intl.NumberFormat('pt-BR').format(num);
            } catch (error) {
                console.error('❌ Erro ao formatar número:', error);
                return '0';
            }
        },

        // 💰 Formatar moeda com segurança
        formatCurrency(value) {
            try {
                if (value === null || value === undefined || value === '') return 'R$ 0,00';
                
                const num = Number(value);
                if (isNaN(num) || !isFinite(num)) return 'R$ 0,00';
                
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(num);
            } catch (error) {
                console.error('❌ Erro ao formatar moeda:', error);
                return 'R$ 0,00';
            }
        },

        // 📅 Formatar data com segurança
        formatDate(date) {
            try {
                if (!date) return '';
                
                const dateObj = new Date(date);
                if (isNaN(dateObj.getTime())) return '';
                
                return new Intl.DateTimeFormat('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(dateObj);
            } catch (error) {
                console.error('❌ Erro ao formatar data:', error);
                return '';
            }
        }
    }));
    
    console.log('✅ Componentes Alpine.js do Dashboard carregados!');
});

// 🌐 Expor funções globais para compatibilidade - Mais seguras
window.formatNumber = function(value) {
    try {
        if (value === null || value === undefined || value === '') return '0';
        
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) return '0';
        
        return new Intl.NumberFormat('pt-BR').format(num);
    } catch (error) {
        console.error('❌ Erro ao formatar número (global):', error);
        return '0';
    }
};

window.formatCurrency = function(value) {
    try {
        if (value === null || value === undefined || value === '') return 'R$ 0,00';
        
        const num = Number(value);
        if (isNaN(num) || !isFinite(num)) return 'R$ 0,00';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(num);
    } catch (error) {
        console.error('❌ Erro ao formatar moeda (global):', error);
        return 'R$ 0,00';
    }
};

window.formatDate = function(date) {
    try {
        if (!date) return '';
        
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(dateObj);
    } catch (error) {
        console.error('❌ Erro ao formatar data (global):', error);
        return '';
    }
};

// 🚀 Aguardar Alpine.js estar pronto
document.addEventListener('alpine:initialized', () => {
    console.log('✅ Alpine.js inicializado completamente');
});

console.log('📊 Dashboard Components carregado e pronto!');