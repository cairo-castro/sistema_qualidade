// resources/js/diagnostico.js
document.addEventListener('alpine:init', () => {
    Alpine.data('diagnostico', () => ({
        // Estado
        unidadeSelecionada: null,
        periodoSelecionado: null,
        setorSelecionado: null,
        subsetorSelecionado: null,
        carregando: false,
        
        // Dados
        unidades: [],
        periodos: [],
        setores: [],
        subsetores: [],
        itens: [],
        progresso: {},
        
        // Inicialização
        async init() {
            await this.carregarDados();
            
            // Watchers
            this.$watch('unidadeSelecionada', () => this.carregarPeriodos());
            this.$watch('periodoSelecionado', () => this.atualizarProgresso());
            this.$watch('setorSelecionado', () => {
                this.carregarSubsetores();
                this.carregarItens();
            });
            this.$watch('subsetorSelecionado', () => this.carregarItens());
        },
        
        async carregarDados() {
            this.carregando = true;
            try {
                const [unidadesRes, setoresRes] = await Promise.all([
                    fetch('/diagnostico/unidades'),
                    fetch('/diagnostico/setores')
                ]);
                
                this.unidades = await unidadesRes.json();
                this.setores = await setoresRes.json();
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                this.carregando = false;
            }
        },
        
        async carregarPeriodos() {
            if (!this.unidadeSelecionada) return;
            
            try {
                const response = await fetch(`/diagnostico/periodos?unidade_id=${this.unidadeSelecionada}`);
                this.periodos = await response.json();
            } catch (error) {
                console.error('Erro ao carregar períodos:', error);
            }
        },
        
        carregarSubsetores() {
            if (!this.setorSelecionado) {
                this.subsetores = [];
                return;
            }
            
            const setor = this.setores.find(s => s.id == this.setorSelecionado);
            this.subsetores = setor?.subsetores || [];
        },
        
        async carregarItens() {
            if (!this.periodoSelecionado || !this.setorSelecionado) return;
            
            this.carregando = true;
            try {
                const params = new URLSearchParams({
                    periodo_id: this.periodoSelecionado,
                    setor_id: this.setorSelecionado,
                    ...(this.subsetorSelecionado && { subsetor_id: this.subsetorSelecionado })
                });
                
                const response = await fetch(`/diagnostico/itens?${params}`);
                const data = await response.json();
                this.itens = data.data;
            } catch (error) {
                console.error('Erro ao carregar itens:', error);
            } finally {
                this.carregando = false;
            }
        },
        
        async salvarAvaliacao(item, resultado, observacoes = '') {
            try {
                const response = await fetch('/diagnostico/avaliar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        id_periodo_diagnostico: this.periodoSelecionado,
                        item_diagnostico_id: item.id,
                        unidade_id: this.unidadeSelecionada,
                        setor_id: this.setorSelecionado,
                        subsetor_id: this.subsetorSelecionado,
                        item: item.nome_item,
                        avaliacao_resultado: resultado,
                        observacoes
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.mostrarSucesso('Avaliação salva!');
                    await this.carregarItens();
                    await this.atualizarProgresso();
                } else {
                    this.mostrarErro(data.message);
                }
            } catch (error) {
                this.mostrarErro('Erro ao salvar avaliação');
            }
        },
        
        async sincronizar() {
            if (!this.periodoSelecionado) return;
            
            try {
                const response = await fetch(`/diagnostico/sincronizar/${this.periodoSelecionado}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.mostrarSucesso(data.message);
                    await this.carregarItens();
                }
            } catch (error) {
                this.mostrarErro('Erro ao sincronizar');
            }
        },
        
        async atualizarProgresso() {
            if (!this.periodoSelecionado) return;
            
            try {
                const response = await fetch(`/diagnostico/progresso/${this.periodoSelecionado}`);
                const data = await response.json();
                this.progresso = data.data;
            } catch (error) {
                console.error('Erro ao carregar progresso:', error);
            }
        },
        
        mostrarSucesso(msg) {
            // Implementar toast de sucesso
            if (window.toastr) {
                toastr.success(msg);
            } else {
                alert('Sucesso: ' + msg);
            }
        },
        
        mostrarErro(msg) {
            // Implementar toast de erro
            if (window.toastr) {
                toastr.error(msg);
            } else {
                alert('Erro: ' + msg);
            }
        }
    }));
});
