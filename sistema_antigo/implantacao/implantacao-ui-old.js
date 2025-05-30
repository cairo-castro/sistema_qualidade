/**
 * implantacao-ui.js
 * Responsável por interface do usuário e interações
 */

// Objeto para UI
const ImplantacaoUI = {
    // Estado e configurações 
    state: {
      tabulatorTables: {}, // Referência para tabelas Tabulator
      modalAtual: null,    // Modal atualmente aberto
      btnSalvarOriginal: '', // Texto original do botão salvar
      progressBars: {}     // Referência às barras de progresso
    },
    // Guardar referência ao método init original
    _initOriginal: null,
  
  // Método init original com a modificação para incluir a função adicionarIndicadoresCongelamento
/**
 * Updated init method for ImplantacaoUI
 */
/**
 * Add to ImplantacaoUI initialization to provide fallbacks
 * Add before other initializations in init method
 */
/**
 * Modified configurarFallbacks - Remove ProgressJS code
 */
configurarFallbacks: function() {
    // Remove ProgressJS fallback code completely
    
    // Keep only Toastr fallback
    if (typeof toastr === 'undefined') {
      console.warn('Toastr não disponível para configuração');
      window.toastr = {
        options: {},
        success: function(message) { 
          console.log('SUCCESS:', message);
          if (!this._showFallbackToast) return;
          this._showFallbackToast(message, 'success');
        },
        error: function(message) { 
          console.error('ERROR:', message);
          if (!this._showFallbackToast) return;
          this._showFallbackToast(message, 'error');
        },
        warning: function(message) { 
          console.warn('WARNING:', message);
          if (!this._showFallbackToast) return;
          this._showFallbackToast(message, 'warning');
        },
        info: function(message) { 
          console.info('INFO:', message); 
          if (!this._showFallbackToast) return;
          this._showFallbackToast(message, 'info');
        },
        _showFallbackToast: function(message, type) {
          // Create simple toast element
          const toast = document.createElement('div');
          toast.className = `alert alert-${type === 'success' ? 'success' : 
                                           type === 'error' ? 'danger' : 
                                           type === 'warning' ? 'warning' : 'info'} 
                            position-fixed bottom-0 end-0 m-3`;
          toast.innerHTML = message;
          toast.style.zIndex = '9999';
          document.body.appendChild(toast);
          
          // Remove after 3 seconds
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 3000);
        }
      };
    }
  },
/**
 * Modified init - Remove progressJS initialization and add Loading-bar.js initialization
 */
init: function() {
    // First install fallbacks for missing libraries
    this.configurarFallbacks();
    
    // Initialize CRUD
    ImplantacaoCRUD.init({ debug: false });
    
    // Add styles for header
    this.adicionarEstilosCabecalho();
    
    // Configure Toastr
    this.configurarToastr();
    
    // Initialize Select2
    this.inicializarSelect2();
    
    // Load Loading-bar.js instead of configuring ProgressJS
    this.carregarLoadingBar();
  
    // Add or update health icon styles
    this.adicionarEstilosHealthIcons();
    
    // Wait for DOM to be fully loaded
    var self = this;
    setTimeout(function() {
      try {
        // Initialize Tabulator tables
        self.inicializarTabulatorTables();
        
        // Create sectors header with dynamic icons
        self.criarCabecalhoSetores();
        
        // Configure events when a tab is clicked
        self.configurarEventosTabs();
        
        // Load the first tab
        self.carregarPrimeiraTab();
        
        // Configure form events
        self.configurarEventosFormulario();
        
        // Check if period modal should be shown
        self.verificarModalPeriodo();
  
        // Check if period is expired and apply restrictions if needed
        self.aplicarRestricoesPeriodoExpirado();
  
        // Add freezing indicators
        self.adicionarIndicadoresCongelamento();
        
        console.log("ImplantacaoUI initialization completed successfully");
      } catch (e) {
        console.error("Error during ImplantacaoUI initialization:", e);
      }
    }, 100);
    
    setTimeout(function() {
      try {
        self.substituirIconesTitulosSetores();
      } catch (e) {
        console.error("Error replacing sector title icons:", e);
      }
    }, 1000);
    
    // Setup periodic check to capture any new titles
    setInterval(function() {
      try {
        self.substituirIconesTitulosSetores();
      } catch (e) {
        console.error("Error in periodic icon replacement:", e);
      }
    }, 2000);
  },


      // Chamar o método para sobrescrever o init
      // Esta linha executa a função quando o arquivo é carregado
/**
 * Função para criar elemento de ícone SVG
 * @param {string} iconName - Nome do arquivo SVG sem a extensão
 * @param {string} className - Classes CSS adicionais (opcional)
 * @returns {HTMLElement} - Elemento span com o ícone como background
 */
createHealthIcon: function(iconName, className = '') {
  const iconElement = document.createElement('span');
  iconElement.className = `health-icon ${className}`;
  iconElement.style.backgroundImage = `url('../../assets/icons/svg/${iconName}.svg')`;
  return iconElement;
},
/**
 * Mapeamento de setores hospitalares para nomes de ícones Healthicons
 * @returns {Object} - Objeto com mapeamento de setor para nome do ícone
 */
definirIconesSetores: function() {
  return {
    // Setores de terapia intensiva com diferenciação
    "uti": "intensive-care_unit",
    "uti neonatal": "baby_incubator_alt", 
    "uti neo": "baby_incubator",
    "uti pediatrica": "pediatrics",
    "uti cardiaca": "heart",
    "uti adulto": "intensive-care_unit",
    "parto normal": "ancv",
    "centro cirurgico":"general_surgery",
    "ucinco":"ucinco",
    "ucinca":"ucinco,",
    
    // Setores clínicos/assistenciais
    "emergencia": "ambulance",
    "pronto_socorro": "accident-and-emergency",
    "centro_cirurgico": "general_surgery",
    "centro_obstetrico": "obstetricsmonia",
    "enfermaria": "hospitalized",
    "pediatria": "pediatrics",
    "maternidade": "baby",
    "oncologia": "oncology",
    "neurologia": "brain",
    "cardiologia": "heart",
    "ortopedia": "orthopaedics",
    "radiologia": "radiology",
    "laboratorio": "hematology-lab",
    "farmacia": "pharmacy",
    "nutricao": "nutrition",
    "fisioterapia": "physical-therapy",
    "psicologia": "mental-health",
    "hemodialise": "kidneys",
    "quimioterapia": "medicines",

    // Setores de atendimento
    "acolhimento": "nurse",
    "classificacao_de_risco": "patient_band",
    "ambulatorio": "outpatient",
    "ccih": "virus_alt",
    "enfermaria cirurgica": "hospital-bed",
    "enfermaria pediatrica": "pediatrics",
    "enfermaria ortopedica": "orthopaedics",
    "enfermaria clinica medica": "hospital-bed",
    "internacao obstetricia": "obstetricsmonia",
    "nucleo hospitalar epidemiologia": "virus-research",
    "raio x": "xray",
    "sala de exames imagem": "radiology",
    "sala de imobilizacao": "sling",
    "sala de medicacao": "medicines",
    "sala de nebulizacao": "ventilator",
    "sala de observacao": "observation",
    "sala de reanimacao neonatal": "obstetricsmonia",
    "sala de sutura": "staples",
    "seguranca do paciente": "security_worker",

    // Setores de apoio
    "farmacia almoxarifado": "pharmacy",
    "cme": "surgical_sterilization",
    "gestao": "crisis_response_center_person",

    // Setores administrativos
    "administracao": "finance",
    "recursos_humanos": "human-resources",
    "financeiro": "finance",
    "compras": "credit-card",
    "almoxarifado": "stock-out",
    "manutencao": "hammer",
    "ti": "health-it",
    "recepcao": "admissions",
    "limpeza": "cleaning",
    "seguranca": "person-security-worker",
    "lavanderia": "cleaning",

    // Ícone padrão
    "default": "hospital"
  };
},

/**
 * Função melhorada para atribuir ícones dinamicamente com base no nome do setor
 * @param {string} nomeSetor - Nome do setor
 * @returns {string} - Nome do arquivo SVG a ser usado
 */
atribuirIconeDinamico: function(nomeSetor) {
  // Converter para minúsculas para facilitar a comparação
  const setorLower = nomeSetor.toLowerCase().trim();
  
  // Obter o mapeamento de ícones
  const mapaIcones = this.definirIconesSetores();
  
  // Verificar correspondência exata primeiro
  if (mapaIcones[setorLower]) {
    return mapaIcones[setorLower];
  }
  
  // Verificar correspondências parciais - palavras específicas no nome
  for (const [chave, icone] of Object.entries(mapaIcones)) {
    // Substituir underscores por espaços para melhorar a correspondência
    const chavePesquisa = chave.replace(/_/g, ' ');
    
    // Se o nome do setor contém a chave, ou a chave contém o nome do setor
    if (setorLower.includes(chavePesquisa) || 
        (chavePesquisa.length > 5 && chavePesquisa.includes(setorLower))) {
      return icone;
    }
  }
  
  // Verificar por palavras-chave específicas quando não há correspondência direta
  const palavrasChave = {
    "uti": "intensive-care_unit",
    "neonatal": "baby-incubator",
    "neo": "baby_0203_alt",
    "emergencia": "ambulance",
    "urgencia": "accident-and-emergency",
    "cirurg": "general_surgery",
    "leito": "hospital_bed",
    "pediatr": "pediatrics",
    "cardio": "heart",
    "neuro": "brain",
    "laborat": "hematology-lab",
    "exame": "microscope",
    "imagem": "radiology",
    "farmac": "pharmacy",
    "nutri": "nutrition",
    "terapia": "physical_therapy",
    "psico": "mental-health",
    "admin": "finance",
    "compra": "credit-card",
    "almox": "stock-out",
    "manut": "hammer",
    "informatica": "health-it",
    "recep": "admissions",
    "higien": "cleaning"
  };
  
  // Verificar cada palavra-chave no nome do setor
  for (const [palavra, icone] of Object.entries(palavrasChave)) {
    if (setorLower.includes(palavra)) {
      return icone;
    }
  }

  // Fallback por primeira letra
  const primeiraLetra = setorLower.charAt(0);
  const iconesPadrao = {
    "a": "ambulance",
    "b": "baby",
    "c": "clinical-document",
    "d": "doctor",
    "e": "emergency_operations_center",
    "f": "family-planning",
    "g": "group",
    "h": "hospital",
    "i": "information",
    "j": "joint",
    "k": "kidneys",
    "l": "laboratory",
    "m": "medicines",
    "n": "nurse",
    "o": "outpatient",
    "p": "pharmacy",
    "q": "quality",
    "r": "rehabilitation",
    "s": "surgery",
    "t": "training",
    "u": "ultrasound",
    "v": "vaccine",
    "w": "wheelchair",
    "x": "xray",
    "y": "hospital",
    "z": "hospital"
  };

  return iconesPadrao[primeiraLetra] || "hospital";
},
  
  
 
/**
 * Aplica ícones aos setores no menu
 * Esta função deve substituir a função atual no objeto ImplantacaoUI
 */
 aplicarIconesSetores:function() {
  // Adicionar estilos CSS para os ícones SVG se ainda não existirem
  if (!document.getElementById('health-icons-styles')) {
    const style = document.createElement('style');
    style.id = 'health-icons-styles';
    style.textContent = `
      .health-icon {
        display: inline-block;
        width: 1.25em;
        height: 1.25em;
        vertical-align: middle;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 0.75rem;
      }
      
      .implantacao-sidebar-collapsed .health-icon,
      .tab-scroll-container.collapsed-menu .health-icon {
        margin-right: 0;
        width: 1.5em;
        height: 1.5em;
      }
    `;
    document.head.appendChild(style);
  }

  // Definir a variante (filled ou outline) que você prefere
  const variante = 'filled'; // 'filled' ou 'outline'

  // Selecionar todos os itens do menu de setores
  var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
  
  for (var i = 0; i < menuItems.length; i++) {
    var item = menuItems[i];
    var setorNome = item.getAttribute('data-setor-original') || '';
    
    // Remover ícone atual
    var iconElement = item.querySelector('i.fas');
    if (iconElement) {
      iconElement.remove();
    }
    
    // Determinar qual ícone usar com base no nome do setor
    var iconName = this.atribuirIconeDinamico(setorNome);
    
    // Criar elemento para o ícone SVG, ajustando para a variante
    var newIcon = document.createElement('span');
    newIcon.className = 'health-icon me-2';
    
    // Ajustar caminho para incluir a variante (filled/outline)
    newIcon.style.backgroundImage = `url('../../assets/icons/svg/${iconName}.svg')`;
    
    // Adicionar o ícone no início do item
    item.insertBefore(newIcon, item.firstChild);
    
    // Adicionar tooltip com o nome do setor completo
    item.setAttribute('title', setorNome);
    
    // Adicionar classe para mostrar apenas o ícone em modo colapsado
    if (!item.querySelector('.setor-text')) {
      // Encapsular o texto em um span para controlar sua visibilidade
      var textNode = document.createTextNode(item.textContent.trim());
      var badge = item.querySelector('.badge');
      
      // Limpar o conteúdo mantendo apenas os elementos importantes
      item.innerHTML = '';
      
      // Readicionar o ícone
      item.appendChild(newIcon);
      
      // Adicionar o texto em um span
      var textSpan = document.createElement('span');
      textSpan.className = 'setor-text';
      textSpan.textContent = setorNome;
      item.appendChild(textSpan);
      
      // Readicionar o badge se existir
      if (badge) {
        item.appendChild(badge);
      }
    }
  }
},
/**
 * Gera ícones para uso na barra de status
 * @param {string} tipo - Tipo de status (success, warning, danger, etc)
 * @param {string} icone - Nome do ícone
 * @returns {string} - HTML do ícone
 */
gerarIconeStatus:function (tipo, icone) {
  return `<span class="health-icon health-icon-${tipo}" style="background-image: url('../../assets/icons/svg/${icone}.svg')"></span>`;
},

/**
 * Gera HTML para a barra de status usando ícones
 * @param {Object} data - Dados do progresso
 * @returns {string} - HTML da barra de status
 */
gerarHTMLBarraStatus:function(data) {
  const total = data?.total || 0;
  const conformes = data?.conformes || 0;
  const naoConformes = data?.nao_conformes || 0;
  const parcialmenteConformes = data?.parcialmente_conformes || 0;
  const naoSeAplica = data?.nao_se_aplica || 0;
  const pendentes = data?.pendentes || 0;
  
  const pctAvaliados = total > 0 ? Math.round(((total - pendentes) / total) * 100) : 0;
  
  return `
    <div class="progress-details mt-2">
      <span class="progress-item text-success">
        ${this.gerarIconeStatus('success', 'yes')} Conforme: ${conformes}
      </span>
      <span class="progress-item text-warning">
        ${this.gerarIconeStatus('warning', 'alert')} Parcial: ${parcialmenteConformes}
      </span>
      <span class="progress-item text-danger">
        ${this.gerarIconeStatus('danger', 'no')} Não Conforme: ${naoConformes}
      </span>
      <span class="progress-item text-secondary">
        ${this.gerarIconeStatus('secondary', 'unavailable')} Não se Aplica: ${naoSeAplica}
      </span>
      <span class="progress-item text-muted">
        ${this.gerarIconeStatus('secondary', 'circle-medium')} Pendentes: ${pendentes}
      </span>
    </div>
    <div class="progress-text text-center mt-2">
      ${this.gerarIconeStatus('info', 'bar-chart')}
      <strong>${pctAvaliados}%</strong> dos itens avaliados
    </div>
  `;
},
/**
 * Adiciona estilos personalizados para os ícones do Health Icons
 */
adicionarEstilosHealthIcons: function() {
  if (!document.getElementById('health-icons-styles')) {
    var style = document.createElement('style');
    style.id = 'health-icons-styles';
    style.textContent = `
      .health-icon {
        width: 28px;
        height: 28px;
        vertical-align: middle;
        filter: brightness(0.7);
        transition: all 0.3s ease;
      }
      
      .active .health-icon {
        filter: brightness(1);
      }
      
      .tab-scroll-container.collapsed-menu .health-icon {
        margin-right: 0;
        margin-left: 0;
        display: block;
        margin: 0 auto 5px auto;
        width: 28px;
        height: 28px;
      }
      
      /* Ajuste para quando o menu está colapsado */
      .implantacao-sidebar-collapsed .health-icon,
      .compact-view .health-icon {
        margin-right: 0 !important;
        margin-left: 0 !important;
        display: block;
        margin: 0 auto !important;
      }
      
      /* Estilos para ícones em títulos de setor */
      .setor-title .health-icon {
        width: 28px;
        height: 28px;
        margin-right: 8px;
      }
      
      /* Estilos para o modo escuro, se aplicável */
      @media (prefers-color-scheme: dark) {
        .health-icon {
          filter: brightness(0.9);
        }
        .active .health-icon {
          filter: brightness(1);
        }
      }
    `;
    document.head.appendChild(style);
  }
},

/**
 * Exibe o título do setor acima da barra de progresso
 * @param {string} tabId ID da tab/setor
 * @param {string} setorNome Nome do setor a ser exibido
 */
exibirTituloSetor: function(tabId, setorNome) {
  // Para debugging
  console.log("Exibindo título do setor:", setorNome);
  
  // Obter o elemento da tab
  var tabElement = document.getElementById(tabId);
  if (!tabElement) return;
  
  // Obter o container do título (ou criar se não existir)
  var tituloContainer = tabElement.querySelector('.setor-title-container');
  
  if (!tituloContainer) {
    // Criar o container para o título
    tituloContainer = document.createElement('div');
    tituloContainer.className = 'setor-title-container mb-3';
    
    // Encontrar onde inserir (antes da barra de progresso)
    var progressContainer = tabElement.querySelector('.periodo-info');
    if (progressContainer) {
      tabElement.insertBefore(tituloContainer, progressContainer);
    } else {
      // Se não encontrar o container de progresso, inserir no início
      var firstChild = tabElement.firstChild;
      tabElement.insertBefore(tituloContainer, firstChild);
    }
  }

  // Primeiro, criar o título com o ícone FontAwesome (que será substituído depois)
  // Isso garante que a substituição funcionará mesmo se a função substituirIconesTitulosSetores() falhar
  tituloContainer.innerHTML = '<h4 class="setor-title">' +
    '<i class="fas fa-layer-group me-2"></i>' +
    (setorNome || tabId) +
    '</h4>' +
    '<hr class="mt-2 mb-3">';
  
  // Tentar substituir o ícone FontAwesome pelo ícone Health Icon
  var self = this;
  setTimeout(function() {
    self.substituirIconesTitulosSetores(true);
  }, 50);
},

// Adicionar método para desabilitar botões de edição quando o período estiver expirado
aplicarRestricoesPeriodoExpirado: function() {
  // Verificar se o período está expirado
  if (!this.verificarPeriodoExpirado()) {
    return; // Não fazer nada se o período não estiver expirado
  }
  
  console.log("Aplicando restrições para período expirado...");
  
  try {
    // 1. Desabilitar todos os botões de avaliação/edição nas tabelas
    const editButtons = document.querySelectorAll('.btn-primary, .btn-warning');
    editButtons.forEach(button => {
      if (button.innerHTML.includes('Avaliar') || button.innerHTML.includes('Editar')) {
        button.classList.remove('btn-primary', 'btn-warning');
        button.classList.add('btn-secondary');
        button.disabled = true;
        button.title = "Período expirado - apenas visualização";
        
        // Substituir ícone e texto
        if (button.innerHTML.includes('Avaliar')) {
          button.innerHTML = '<i class="fas fa-eye me-1"></i> Visualizar';
        } else if (button.innerHTML.includes('Editar')) {
          button.innerHTML = '<i class="fas fa-eye me-1"></i> Visualizar';
        }
      }
    });
    
    // 2. Desabilitar o botão de adicionar novo item
    const addButtons = document.querySelectorAll('button[id^="toggleButton_"]');
    addButtons.forEach(button => {
      button.classList.remove('btn-secondary');
      button.classList.add('btn-outline-secondary');
      button.disabled = true;
      button.title = "Não é possível adicionar itens a um período expirado";
    });
    
    // 3. Desabilitar os botões de sincronização
    const syncButtons = document.querySelectorAll('#btnShowSyncModal');
    syncButtons.forEach(button => {
      button.disabled = true;
      button.title = "Não é possível sincronizar itens em um período expirado";
    });
    
    // Removida a parte de adicionar o banner, já que existe uma mensagem similar
    
    console.log("Restrições aplicadas com sucesso.");
  } catch (e) {
    console.error("Erro ao aplicar restrições para período expirado:", e);
  }
},

// Sobrescrever a função de abrir o modal de avaliação para verificar período expirado
_abrirModalAvaliacaoOriginal: null,

_overrideAbrirModalAvaliacao: function() {
  if (!this._abrirModalAvaliacaoOriginal) {
    // Verificar se a função existe no objeto ou no escopo global
    if (typeof this.abrirModalAvaliacao === 'function') {
      this._abrirModalAvaliacaoOriginal = this.abrirModalAvaliacao;
    } else if (typeof window.editarAvaliacao === 'function') {
      this._abrirModalAvaliacaoOriginal = window.editarAvaliacao;
    } else {
      console.warn("Função original de abrir modal não encontrada.");
      return;
    }
  }
  
  // Sobrescrever a função do objeto
  if (typeof this.abrirModalAvaliacao === 'function') {
    var self = this;
    this.abrirModalAvaliacao = function() {
      // Verificar se o período está expirado
      if (self.verificarPeriodoExpirado()) {
        // Substituir para mostrar apenas visualização
        self.abrirModalVisualizacao.apply(this, arguments);
      } else {
        // Chamar a função original se não estiver expirado
        self._abrirModalAvaliacaoOriginal.apply(this, arguments);
      }
    };
  }
  
  // Sobrescrever a função global
  if (typeof window.editarAvaliacao === 'function') {
    var originalFunc = window.editarAvaliacao;
    window.editarAvaliacao = function() {
      // Verificar se o período está expirado
      if (ImplantacaoUI.verificarPeriodoExpirado()) {
        // Substituir para mostrar apenas visualização
        ImplantacaoUI.abrirModalVisualizacao.apply(this, arguments);
      } else {
        // Chamar a função original se não estiver expirado
        originalFunc.apply(this, arguments);
      }
    };
  }
},

// Adicionar método para verificar se o período está expirado
verificarPeriodoExpirado: function() {
  // Verificar se temos informações do período no window.periodoInfo
  if (!window.periodoInfo) {
    console.warn("Informações do período não estão disponíveis.");
    return false;
  }
  
  return window.periodoInfo.expirado === true;
},

// Adicionar método para desabilitar botões de edição quando o período estiver expirado
aplicarRestricoesPeriodoExpirado: function() {
  // Verificar se o período está expirado
  if (!this.verificarPeriodoExpirado()) {
    return; // Não fazer nada se o período não estiver expirado
  }
  
  console.log("Aplicando restrições para período expirado...");
  
  try {
    // 1. Desabilitar todos os botões de avaliação/edição nas tabelas
    const editButtons = document.querySelectorAll('.btn-primary, .btn-warning');
    editButtons.forEach(button => {
      if (button.innerHTML.includes('Avaliar') || button.innerHTML.includes('Editar')) {
        button.classList.remove('btn-primary', 'btn-warning');
        button.classList.add('btn-secondary');
        button.disabled = true;
        button.title = "Período expirado - apenas visualização";
        
        // Substituir ícone e texto
        if (button.innerHTML.includes('Avaliar')) {
          button.innerHTML = '<i class="fas fa-eye me-1"></i> Visualizar';
        } else if (button.innerHTML.includes('Editar')) {
          button.innerHTML = '<i class="fas fa-eye me-1"></i> Visualizar';
        }
      }
    });
    
    // 2. Desabilitar o botão de adicionar novo item
    const addButtons = document.querySelectorAll('button[id^="toggleButton_"]');
    addButtons.forEach(button => {
      button.classList.remove('btn-secondary');
      button.classList.add('btn-outline-secondary');
      button.disabled = true;
      button.title = "Não é possível adicionar itens a um período expirado";
    });
    
    // 3. Desabilitar os botões de sincronização
    const syncButtons = document.querySelectorAll('#btnShowSyncModal');
    syncButtons.forEach(button => {
      button.disabled = true;
      button.title = "Não é possível sincronizar itens em um período expirado";
    });
    
    // 4. Adicionar aviso visual no topo da página
    if (!document.querySelector('.periodo-expirado-banner')) {
      const banner = document.createElement('div');
      banner.className = 'periodo-expirado-banner';
      banner.innerHTML = `
        <div class="icon-container">
          <i class="fas fa-lock"></i>
        </div>
        <div class="content">
          <h5>Período Expirado</h5>
          <p class="mb-0">Este período está expirado. Os dados estão disponíveis apenas para consulta e não podem ser editados.</p>
        </div>
      `;
      
      // Inserir o banner no topo da página
      const contentHeader = document.querySelector('.content-header');
      if (contentHeader) {
        contentHeader.parentNode.insertBefore(banner, contentHeader.nextSibling);
      }
    }
    
    // 5. Sobrescrever a função global editarAvaliacao
    if (typeof window.editarAvaliacao === 'function' && !window._originalEditarAvaliacao) {
      window._originalEditarAvaliacao = window.editarAvaliacao;
      
      window.editarAvaliacao = function(itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId) {
        // Abrir o modal sem opção de edição
        const modal = document.getElementById('evaluationModal');
        if (!modal) return;
        
        // Atualizar o título
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = 'Visualizar Item (Período Expirado)';
        
        // Esconder o botão de salvar
        const saveButton = modal.querySelector('.btn-primary');
        if (saveButton) saveButton.style.display = 'none';
        
        // Chamar a função original que irá preencher o modal
        window._originalEditarAvaliacao(itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId);
        
        // Depois que o modal for carregado, desativar todos os campos
        setTimeout(() => {
          const inputs = modal.querySelectorAll('input, textarea, select');
          inputs.forEach(input => input.disabled = true);
          
          // Adicionar aviso de período expirado
          const formContainer = modal.querySelector('.modal-body');
          if (formContainer && !formContainer.querySelector('.alerta-periodo-expirado')) {
            const aviso = document.createElement('div');
            aviso.className = 'alert alert-warning alerta-periodo-expirado mb-3';
            aviso.innerHTML = '<i class="fas fa-clock me-2"></i>Este item pertence a um período expirado e está disponível apenas para visualização.';
            formContainer.insertBefore(aviso, formContainer.firstChild);
          }
        }, 500);
      };
    }
    
    console.log("Restrições aplicadas com sucesso.");
  } catch (e) {
    console.error("Erro ao aplicar restrições para período expirado:", e);
  }
},

// Nova função para abrir o modal em modo visualização
abrirModalVisualizacao: function(itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId = null) {
  console.log("Abrindo modal em modo visualização para:", {
    itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId
  });
  
  // Verificar se o modal existe
  const modalElement = document.getElementById('evaluationModal');
  if (!modalElement) {
    this.mostrarToast('error', 'Modal de avaliação não encontrado na página');
    return;
  }
  
  // Verificar se o formulário existe dentro do modal
  const formContainer = modalElement.querySelector('.modal-body');
  if (!formContainer) {
    this.mostrarToast('error', 'Container do formulário não encontrado no modal');
    return;
  }
  
  // Mostrar indicador de carregamento enquanto preparamos o formulário
  formContainer.innerHTML = `
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `;
  
  // Atualizar título do modal
  const modalTitle = document.getElementById('evaluationModalLabel');
  if (modalTitle) {
    modalTitle.textContent = 'Visualizar Item';
  }
  
  // Atualizar botões do modal
  const saveButton = modalElement.querySelector('.btn-primary');
  if (saveButton) {
    saveButton.style.display = 'none'; // Esconder botão de Salvar
  }
  
  // Se tiver ID de diagnóstico, carregar dados existentes
  if (diagnosticId) {
    console.log(`Carregando dados do diagnóstico ID: ${diagnosticId}`);
    
    // Carregar dados do diagnóstico
    ImplantacaoCRUD.obterDiagnostico(diagnosticId)
      .then(data => {
        console.log("Dados do diagnóstico recebidos:", data);
        
        if (data.error) {
          console.error("Erro ao carregar diagnóstico:", data.error);
          formContainer.innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-circle me-2"></i>
              Erro ao carregar dados: ${data.error}
            </div>
          `;
          return;
        }
        
        // Construir o formulário somente leitura
        let formHtml = `
          <div class="alert alert-warning mb-3">
            <i class="fas fa-clock me-2"></i>
            Este item pertence a um período expirado e está disponível apenas para visualização.
          </div>
          
          <h5 class="mb-3 text-primary">${this.escaparString(itemName) || 'Item'}</h5>
          
          <div class="mb-3">
            <label class="form-label fw-bold">Status:</label>
            <div>
        `;
        
        // Mostrar o status atual
        if (data.nao_se_aplica == 1) {
          formHtml += `
            <span class="badge bg-secondary p-2">
              <i class="fas fa-ban me-1"></i> Não se aplica
            </span>
          `;
        } else if (data.statu === 'conforme') {
          formHtml += `
            <span class="badge bg-success p-2">
              <i class="fas fa-check-circle me-1"></i> Conforme
            </span>
          `;
        } else if (data.statu === 'nao_conforme') {
          formHtml += `
            <span class="badge bg-danger p-2">
              <i class="fas fa-times-circle me-1"></i> Não Conforme
            </span>
          `;
        } else if (data.statu === 'parcialmente_conforme') {
          formHtml += `
            <span class="badge bg-warning p-2">
              <i class="fas fa-exclamation-circle me-1"></i> Parcialmente Conforme
            </span>
          `;
        } else {
          formHtml += `
            <span class="badge bg-light text-dark p-2">
              <i class="far fa-circle me-1"></i> Pendente
            </span>
          `;
        }
        
        formHtml += `
            </div>
          </div>
        `;
        
        // Mostrar observações se existirem
        if (data.observacoes) {
          formHtml += `
            <div class="mb-3">
              <label class="form-label fw-bold">Observações:</label>
              <div class="form-control bg-light" style="min-height: 100px; white-space: pre-wrap;">
                ${data.observacoes.replace(/\n/g, '<br>')}
              </div>
            </div>
          `;
        } else {
          formHtml += `
            <div class="mb-3">
              <label class="form-label fw-bold">Observações:</label>
              <div class="form-control bg-light text-muted" style="min-height: 100px;">
                Nenhuma observação registrada.
              </div>
            </div>
          `;
        }
        
        // Inserir o formulário no modal
        formContainer.innerHTML = formHtml;
      })
      .catch(error => {
        console.error("Erro ao carregar diagnóstico:", error);
        formContainer.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle me-2"></i>
            Erro ao carregar dados: ${error.message}
          </div>
        `;
      });
  } else {
    // Se não tiver diagnóstico, mostrar mensagem de item não avaliado
    formContainer.innerHTML = `
      <div class="alert alert-warning mb-3">
        <i class="fas fa-clock me-2"></i>
        Este item pertence a um período expirado e está disponível apenas para visualização.
      </div>
      
      <h5 class="mb-3 text-primary">${this.escaparString(itemName) || 'Item'}</h5>
      
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        Este item não foi avaliado durante o período ativo.
      </div>
    `;
  }
  
  // Exibir o modal
  try {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } catch (e) {
    console.error("Erro ao exibir modal:", e);
    this.mostrarToast('error', `Erro ao exibir modal: ${e.message}`);
  }
},
  
    /**
 * Exibe uma mensagem de toast utilizando Toastr
 * @param {string} type Tipo de mensagem (success, error, warning, info)
 * @param {string} message Mensagem a ser exibida
 * @param {object} options Opções adicionais para o toast
 */
    mostrarToast:function(type, message, options = {}) {
        if (!this.verificarToastr()) {
          // Fallback usando alert se o Toastr não puder ser carregado
          alert(type.toUpperCase() + ': ' + message);
          return;
        }
        
        // Garantir que o tipo está correto
        const validTypes = ['success', 'error', 'warning', 'info'];
        if (!validTypes.includes(type)) {
          type = 'info'; // Fallback para info se o tipo for inválido
        }
        
        // Configurações específicas por tipo
        const typeOptions = {
          success: { timeOut: 3000, positionClass: "toast-top-right", progressBar: true },
          error: { timeOut: 5000, positionClass: "toast-top-right", closeButton: true, progressBar: true },
          warning: { timeOut: 4000, positionClass: "toast-top-right", progressBar: true },
          info: { timeOut: 3000, positionClass: "toast-top-right", progressBar: true }
        };
        
        // Combinar opções
        const finalOptions = {...typeOptions[type], ...options};
        
        // Armazenar opções originais
        const originalOptions = {...toastr.options};
        
        // Aplicar opções temporárias
        Object.keys(finalOptions).forEach(key => {
          toastr.options[key] = finalOptions[key];
        });
        
        // Chamar o toast e registrar no console para debug
        console.log(`Exibindo toast ${type}: ${message}`);
        toastr[type](message);
        
        // Restaurar opções originais
        setTimeout(() => {
          toastr.options = originalOptions;
        }, 100);
      },
  
  // Funções específicas para cada tipo de toast
  notificarSucesso: function(message, options = {}) {
    console.log("Notificando sucesso:", message); // Log para debug
    this.mostrarToast('success', message, options);
  },
  
  notificarErro: function(message, options = {}) {
    console.log("Notificando erro:", message); // Log para debug
    this.mostrarToast('error', message, options);
  },
  
  notificarAviso: function(message, options = {}) {
    console.log("Notificando aviso:", message); // Log para debug
    this.mostrarToast('warning', message, options);
  },
  
  notificarInfo: function(message, options = {}) {
    console.log("Notificando info:", message); // Log para debug
    this.mostrarToast('info', message, options);
  },
  
/**
 * Configura a biblioteca Toastr para notificações
 */
configurarToastr: function() {
  if (typeof toastr !== 'undefined') {
    // Configuração principal - mais discreta e fluida
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-bottom-right", // Mudado para bottom-right para ser menos intrusivo
      "preventDuplicates": true,
      "showDuration": "300",
      "hideDuration": "500",
      "timeOut": "2500",           // Tempo reduzido
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
      "tapToDismiss": true         // Permitir fechar ao clicar
    };
    
    // Configurações específicas para cada tipo
    // Podemos definir configurações específicas para cada tipo de notificação
    toastr.options.toastClass = 'toastr'; // Classe base
    
    // Adicionar CSS personalizado para tornar as notificações mais elegantes
    if (!document.getElementById('toastr-custom-style')) {
      const style = document.createElement('style');
      style.id = 'toastr-custom-style';
      style.textContent = `
        .toast-success { background-color: rgba(16, 185, 129, 0.9); }
        .toast-error { background-color: rgba(239, 68, 68, 0.9); }
        .toast-info { background-color: rgba(59, 130, 246, 0.9); }
        .toast-warning { background-color: rgba(245, 158, 11, 0.9); }
        
        .toast-bottom-right { bottom: 12px; right: 12px; }
        .toastr { 
          opacity: 0.9;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #toast-container > div {
          opacity: 0.9;
          padding: 12px 15px 12px 50px;
          border-radius: 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #toast-container > div:hover {
          opacity: 1;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .toast-progress {
          height: 3px;
          opacity: 0.6;
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log("Toastr configurado para experiência fluida");
  } else {
    console.warn("Toastr não disponível para configuração");
  }
},
  
    /**
     * Inicializa a biblioteca Select2 nos selects
     */
    inicializarSelect2: function() {
      if (typeof $.fn.select2 !== 'undefined') {
        $('#unidadeSelectModal, #unidadeInput').select2({
          width: '100%',
          placeholder: "Selecione uma opção",
          allowClear: true,
          dropdownParent: $('#periodoModal'),
          minimumResultsForSearch: 0
        });
      }
    },
    /**
 * Carrega a tradução do Tabulator a partir de um arquivo JSON
 * @param {string} locale Código do idioma (ex: pt-br)
 * @returns {Promise} Promise com os dados de tradução
 */
carregarTraducaoTabulator: function(locale = 'pt-br') {
    return new Promise((resolve, reject) => {
      fetch(`${ImplantacaoCRUD.config.baseUrl}js/tabulator-langs/${locale}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro ao carregar tradução (${response.status}): ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(`Tradução do Tabulator carregada para ${locale}:`, data);
          
          // Guardar a tradução em um objeto global para uso posterior
          if (!window.TabulatorLanguages) {
            window.TabulatorLanguages = {};
          }
          window.TabulatorLanguages[locale] = data;
          
          resolve(data);
        })
        .catch(error => {
          console.error(`Erro ao carregar tradução do Tabulator (${locale}):`, error);
          
          // Resolver com a tradução padrão em caso de erro
          resolve(this.getDefaultTranslation(locale));
        });
    });
  },
  
  /**
   * Obtém uma tradução padrão para o Tabulator
   * @param {string} locale Código do idioma
   * @returns {Object} Objeto com a tradução padrão
   */
  getDefaultTranslation: function(locale) {
    // Traduções padrão pré-definidas
    const translations = {
      'pt-br': {
        "data": {
          "loading": "Carregando",
          "error": "Erro"
        },
        "pagination": {
          "page_size": "Tamanho da página",
          "page_title": "Mostrar página",
          "first": "Primeira",
          "first_title": "Primeira página",
          "last": "Última",
          "last_title": "Última página",
          "prev": "Anterior",
          "prev_title": "Página anterior",
          "next": "Próxima",
          "next_title": "Próxima página",
          "all": "Todas",
          "counter": {
            "showing": "Mostrando",
            "of": "de",
            "rows": "registros",
            "pages": "páginas"
          }
        },
        "headerFilters": {
          "default": "Filtrar..."
        }
      }
    };
    
    return translations[locale] || translations['pt-br'];
  },
  /**
 * Adições ao objeto ImplantacaoUI
 * 
 * Adicione estas funções ao arquivo implantacao-ui.js existente
 * antes do fechamento do objeto ImplantacaoUI (antes da última chave de fechamento)
 */

// 1. Adicione esta função para exibir o título do setor acima da barra de progresso

/**
 * Exibe o título do setor acima da barra de progresso
 * @param {string} tabId ID da tab/setor
 * @param {string} setorNome Nome do setor a ser exibido
 */
exibirTituloSetor: function(tabId, setorNome) {
    // Obter o elemento da tab
    var tabElement = document.getElementById(tabId);
    if (!tabElement) return;
    
    // Obter o container do título (ou criar se não existir)
    var tituloContainer = tabElement.querySelector('.setor-title-container');
    
    if (!tituloContainer) {
      // Criar o container para o título
      tituloContainer = document.createElement('div');
      tituloContainer.className = 'setor-title-container mb-3';
      
      // Encontrar onde inserir (antes da barra de progresso)
      var progressContainer = tabElement.querySelector('.periodo-info');
      if (progressContainer) {
        tabElement.insertBefore(tituloContainer, progressContainer);
      } else {
        // Se não encontrar o container de progresso, inserir no início
        var firstChild = tabElement.firstChild;
        tabElement.insertBefore(tituloContainer, firstChild);
      }
    }
    
    // Atualizar o conteúdo do título
    tituloContainer.innerHTML = '<h4 class="setor-title">' +
      '<i class="fas fa-layer-group me-2"></i>' +
      (setorNome || tabId) +
      '</h4>' +
      '<hr class="mt-2 mb-3">';
  },

/**
 * Inicializa tooltips do Bootstrap para os itens do menu
 */
inicializarTooltips: function() {
  // Verificar se o Bootstrap está disponível
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    // Primeiro, vamos destruir quaisquer tooltips existentes
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function(element) {
      if (element.tooltip) {
        element.tooltip.dispose();
        element.tooltip = null;
      }
    });
    
    // Selecionar todos os itens do menu de setores
    var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
    
    // Inicializar tooltips para cada item
    for (var i = 0; i < menuItems.length; i++) {
      // Verificar se já tem um tooltip
      if (menuItems[i].tooltip) {
        continue; // Pular este item se já tiver um tooltip
      }
      
      try {
        var tooltip = new bootstrap.Tooltip(menuItems[i], {
          placement: 'right',
          trigger: 'hover',
          container: 'body'
        });
        
        // Guardar referência para poder destruir depois se necessário
        menuItems[i].tooltip = tooltip;
      } catch (e) {
        console.warn('Erro ao inicializar tooltip:', e);
      }
    }
  } else {
    console.warn('Bootstrap Tooltip não está disponível');
  }
},
  
  
  /**
   * Cria o botão para colapsar o menu lateral
   */
  criarBotaoToggleSidebar: function() {
    // Verificar se o botão já existe
    if (document.getElementById('toggle-sidebar-btn')) {
      return;
    }
    
    var self = this; // Guardar referência para uso em closures
    
    // Criar o botão
    var toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-sidebar-btn';
    toggleButton.className = 'btn btn-sm btn-outline-secondary toggle-sidebar-button';
    toggleButton.setAttribute('type', 'button');
    toggleButton.setAttribute('title', 'Expandir/Recolher Menu');
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Adicionar evento de clique
    toggleButton.addEventListener('click', function(e) {
      // Importante: prevenir propagação do evento para evitar que afete o AdminLTE
      e.preventDefault();
      e.stopPropagation();
      
      // Verificar estado atual - agora usando nossa classe customizada
      var isCurrentlyCollapsed = document.body.classList.contains('implantacao-sidebar-collapsed');
      
      // Alternar para o estado oposto
      self.ajustarLayoutSidebar(!isCurrentlyCollapsed);
      
      return false;
    });
    
    // Encontrar o container para inserir o botão
    var tabScrollContainer = document.querySelector('.tab-scroll-container');
    if (tabScrollContainer) {
      // Criar um container para posicionar o botão
      var buttonContainer = document.createElement('div');
      buttonContainer.className = 'toggle-sidebar-container';
      
      // Adicionar título "Selecione um setor"
      var sectorTitle = document.createElement('div');
      sectorTitle.className = 'sector-selection-title';
      sectorTitle.innerHTML = 'Selecione um setor';
      
      buttonContainer.appendChild(sectorTitle);
      buttonContainer.appendChild(toggleButton);
      
      // Inserir antes da lista de tabs
      tabScrollContainer.insertBefore(buttonContainer, tabScrollContainer.firstChild);
    } else {
      console.warn('Container de tabs não encontrado para inserir o botão de toggle');
    }
  },
  
  /**
   * Ajusta o layout quando o sidebar muda de estado
   * @param {boolean} isCollapsed Se o sidebar está recolhido
   */
  ajustarLayoutSidebar: function(isCollapsed) {
    // Selecionar elementos relevantes
    var tabScrollContainer = document.querySelector('.tab-scroll-container');
    var contentContainer = document.querySelector('.col-lg-9');
    
    if (!tabScrollContainer || !contentContainer) {
      return;
    }
    
    // Atualizar o ícone do botão com base no estado
    var toggleButton = document.getElementById('toggle-sidebar-btn');
    if (toggleButton) {
      if (isCollapsed) {
        toggleButton.innerHTML = '<i class="fas fa-angle-right"></i>';
        toggleButton.setAttribute('title', 'Expandir Menu');
      } else {
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        toggleButton.setAttribute('title', 'Recolher Menu');
      }
    }
    
    if (isCollapsed) {
      // Quando o sidebar está recolhido, ajustamos o layout com nossa classe customizada
      // em vez de usar sidebar-collapse que conflita com AdminLTE
      document.body.classList.add('implantacao-sidebar-collapsed');
      
      tabScrollContainer.style.width = '4.6rem';
      contentContainer.style.width = 'calc(100% - 4.6rem)';
      
      // Esconder texto nos itens do menu, deixando apenas ícones
      var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
      for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];
        
        // Guardar texto original como atributo data se ainda não estiver guardado
        if (!item.hasAttribute('data-full-text')) {
          var textContent = item.textContent.trim();
          item.setAttribute('data-full-text', textContent);
          
          // Extrair o ícone (assumindo que está no formato <i class="..."></i>)
          var html = item.innerHTML;
          var iconMatch = html.match(/<i class="[^"]+"><\/i>/);
          if (iconMatch) {
            var badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
            item.innerHTML = iconMatch[0] + (badgeMatch ? badgeMatch[0] : '');
          }
        }
      }
    } else {
      // Quando o sidebar está expandido, restauramos o layout original
      document.body.classList.remove('implantacao-sidebar-collapsed');
      
      tabScrollContainer.style.width = '';
      contentContainer.style.width = '';
      
      // Restaurar texto completo nos itens do menu
      var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
      for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];
        
        if (item.hasAttribute('data-full-text')) {
          var fullText = item.getAttribute('data-full-text');
          var html = item.innerHTML;
          var iconMatch = html.match(/<i class="[^"]+"><\/i>/);
          var badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
          
          if (iconMatch) {
            // Reconstruir o item com seu texto original
            item.innerHTML = iconMatch[0] + ' ' + fullText;
            
            // Recolocar o badge se existir
            if (badgeMatch) {
              item.innerHTML += ' ' + badgeMatch[0];
            }
          } else {
            item.textContent = fullText;
          }
        }
      }
    }
    
    // Recalcular layout das tabelas Tabulator se existirem
    var tables = this.state.tabulatorTables;
    for (var tabId in tables) {
      if (tables.hasOwnProperty(tabId)) {
        var table = tables[tabId];
        if (table && typeof table.redraw === 'function') {
          try {
            // Usar closure para preservar a referência da tabela
            (function(t) {
              setTimeout(function() { t.redraw(true); }, 300);
            })(table);
          } catch (e) {
            console.warn("Erro ao redesenhar tabela:", e);
          }
        }
      }
    }
  },

/**
 * Cria o cabeçalho simples com botão toggle - versão otimizada
 */
criarCabecalhoSetores: function() {
  // Verificar se o cabeçalho já existe
  if (document.querySelector('.setor-header')) {
    return;
  }
  
  // Encontrar o container para inserir o cabeçalho
  var tabScrollContainer = document.querySelector('.tab-scroll-container');
  if (!tabScrollContainer) {
    console.warn('Container de tabs não encontrado');
    return;
  }
  
  // Obter o elemento list-group
  var listGroup = tabScrollContainer.querySelector('.list-group');
  if (!listGroup) {
    console.warn('List-group não encontrado dentro do container');
    return;
  }
  
  // Criar o cabeçalho
  var headerContainer = document.createElement('div');
  headerContainer.className = 'setor-header';
  
  // Adicionar o título e botão toggle
  headerContainer.innerHTML = '\
    <div class="setor-header-title">Selecione um setor</div>\
    <button type="button" id="toggle-setor-btn" class="btn btn-sm btn-outline-secondary">\
      <i class="fas fa-bars"></i>\
    </button>\
  ';
  
  // Inserir antes da lista de tabs
  tabScrollContainer.insertBefore(headerContainer, listGroup);
  
  // Adicionar evento de clique no botão toggle
  var self = this;
  document.getElementById('toggle-setor-btn').addEventListener('click', function() {
    // Verificar estado atual
    var isCollapsed = tabScrollContainer.classList.contains('collapsed-menu');
    
    if (isCollapsed) {
      // Expandir menu
      tabScrollContainer.classList.remove('collapsed-menu');
      document.querySelector('.col-lg-9').classList.remove('expanded-content');
      this.innerHTML = '<i class="fas fa-bars"></i>';
      
      // Desativar tooltips no modo expandido
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
        for (var i = 0; i < menuItems.length; i++) {
          if (menuItems[i].tooltip) {
            menuItems[i].tooltip.disable();
          }
        }
      }
    } else {
      // Colapsar menu
      tabScrollContainer.classList.add('collapsed-menu');
      document.querySelector('.col-lg-9').classList.add('expanded-content');
      this.innerHTML = '<i class="fas fa-angle-right"></i>';
      
      // Ativar tooltips no modo colapsado
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
        for (var i = 0; i < menuItems.length; i++) {
          if (menuItems[i].tooltip) {
            menuItems[i].tooltip.enable();
          }
        }
      }
    }
    
    // Recalcular tabelas depois da transição
    setTimeout(function() {
      // Buscar todas as tabelas Tabulator
      var tables = self.state.tabulatorTables;
      for (var tabId in tables) {
        if (tables.hasOwnProperty(tabId)) {
          var table = tables[tabId];
          if (table && typeof table.redraw === 'function') {
            try {
              table.redraw(true);
            } catch (e) {
              console.warn("Erro ao redesenhar tabela:", e);
            }
          }
        }
      }
    }, 300);
  });
  
  // Aplicar ícones específicos para cada setor
  this.aplicarIconesSetores();
  
  // Inicializar tooltips
  this.inicializarTooltips();
},

// Definição do método no objeto ImplantacaoUI
adicionarIndicadoresCongelamento: function() {
  // Verificar se temos as informações do período
  if (!window.periodoInfo) return;
  
  // Determinar o status de congelamento
  const isFrozen = window.periodoInfo.is_frozen || false;
  
  if (isFrozen) {
    // Adicionar banner de aviso no topo da página se ainda não existe
    if (!document.querySelector('.periodo-congelado-banner')) {
      const banner = document.createElement('div');
      banner.className = 'alert alert-warning periodo-congelado-banner';
      banner.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="fas fa-lock fa-2x me-3"></i>
          <div>
            <h5 class="alert-heading">Período Congelado</h5>
            <p class="mb-0">Este período está <strong>congelado</strong>. Novos itens não podem ser adicionados diretamente. 
            Utilize a opção <i class="fas fa-sync-alt"></i> <strong>Sincronizar Itens</strong> para adicionar novos itens.</p>
          </div>
        </div>
      `;
      
      // Inserir após o cabeçalho, antes da área de conteúdo principal
      const contentHeader = document.querySelector('.content-header');
      if (contentHeader) {
        contentHeader.parentNode.insertBefore(banner, contentHeader.nextSibling);
      }
    }
    
    // Adicionar ícone de cadeado ao título do período
    const periodoTitle = document.querySelector('.card-header h5');
    if (periodoTitle && !periodoTitle.querySelector('.periodo-lock-icon')) {
      const lockIcon = document.createElement('span');
      lockIcon.className = 'periodo-lock-icon ms-2';
      lockIcon.innerHTML = '<i class="fas fa-lock text-warning" title="Período congelado - novos itens precisam ser sincronizados manualmente"></i>';
      periodoTitle.appendChild(lockIcon);
    }
    
    // Desabilitar botões de adicionar novo item em todos os setores
    document.querySelectorAll('button[id^="toggleButton_"]').forEach(button => {
      // Alterar texto e ícone do botão
      button.innerHTML = '<i class="fas fa-lock me-1"></i> Período Congelado';
      button.classList.remove('btn-secondary');
      button.classList.add('btn-outline-warning');
      button.disabled = true;
      button.title = 'Este período está congelado. Para adicionar novos itens, use a opção Sincronizar Itens.';
    });
    
    // Destacar botão de sincronização
    const syncButton = document.getElementById('btnShowSyncModal');
    if (syncButton) {
      syncButton.classList.remove('btn-outline-warning');
      syncButton.classList.add('btn-warning');
      syncButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i><strong>Sincronizar Itens</strong>';
      
      // Adicionar classe de pulsante para chamar atenção
      if (!syncButton.classList.contains('pulse-button')) {
        syncButton.classList.add('pulse-button');
        
        // Adicionar estilo para animação de pulso se não existir
        if (!document.getElementById('pulse-button-style')) {
          const style = document.createElement('style');
          style.id = 'pulse-button-style';
          style.textContent = `
            @keyframes pulse-button {
              0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.5); }
              70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
              100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
            }
            .pulse-button {
              box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.5);
              animation: pulse-button 2s infinite;
            }
          `;
          document.head.appendChild(style);
        }
      }
    }
  }
  
  // Adicionar tooltip de informação em todos os itens avaliáveis
  const intervalId = setInterval(() => {
    // Buscar tabelas Tabulator que já foram renderizadas
    const tables = this.state.tabulatorTables;
    
    if (Object.keys(tables).length > 0) {
      clearInterval(intervalId);
      
      // Adicionar informação a todos os botões de ação
      for (const tabId in tables) {
        if (tables.hasOwnProperty(tabId)) {
          const table = tables[tabId];
          
          if (table && typeof table.getRows === 'function') {
            const rows = table.getRows();
            
            rows.forEach(row => {
              const data = row.getData();
              const cell = row.getCell("actions");
              
              if (cell) {
                const actionButtons = cell.getElement().querySelectorAll('button');
                
                actionButtons.forEach(button => {
                  if (isFrozen) {
                    // Adicionar informação de que o período está congelado no tooltip
                    button.title = button.title ? button.title + " (Período Congelado)" : "Período Congelado";
                    
                    // Adicionar ícone de cadeado pequeno ao lado do botão
                    if (!button.querySelector('.mini-lock-icon')) {
                      const iconSpan = document.createElement('span');
                      iconSpan.className = 'mini-lock-icon ms-1';
                      iconSpan.innerHTML = '<i class="fas fa-lock fa-xs text-warning"></i>';
                      button.appendChild(iconSpan);
                    }
                  }
                });
              }
            });
          }
        }
      }
    }
  }, 500);
},
  

  /**
  * Adiciona estilos necessários para o cabeçalho e toggle - versão melhorada
   */
adicionarEstilosCabecalho: function() {
    // Verificar se os estilos já foram adicionados
    if (document.getElementById('implantacao-menu-styles')) {
      return;
    }
    
    var style = document.createElement('style');
    style.id = 'implantacao-menu-styles';
    style.textContent = '\
      /* Cabeçalho do menu de setores */ \
      .setor-header { \
        background-color: #f8f9fa; \
        border-bottom: 1px solid #dee2e6; \
        padding: 0.75rem 1rem; \
        display: flex; \
        justify-content: space-between; \
        align-items: center; \
        position: sticky; \
        top: 0; \
        z-index: 10; \
      } \
      \
      .setor-header-title { \
        font-size: 0.9rem; \
        color: #6c757d; \
        font-weight: 500; \
      } \
      \
      /* Menu colapsado */ \
      .tab-scroll-container.collapsed-menu { \
        width: 4.5rem !important; \
      } \
      \
      .tab-scroll-container.collapsed-menu .setor-text { \
        display: none; \
      } \
      \
      .tab-scroll-container.collapsed-menu .setor-header-title { \
        display: none; \
      } \
      \
      .tab-scroll-container.collapsed-menu .list-group-item { \
        text-align: center; \
        padding: 0.75rem 0.5rem; \
        justify-content: center; \
      } \
      \
      .tab-scroll-container.collapsed-menu .list-group-item .badge { \
        display: none; \
      } \
      \
      .tab-scroll-container.collapsed-menu .list-group-item i.fas { \
        margin-right: 0 !important; \
        font-size: 1.2rem; \
      } \
      \
      /* Área de conteúdo expandida */ \
      .col-lg-9.expanded-content { \
        width: calc(100% - 4.5rem) !important; \
      } \
      \
      /* Transições suaves */ \
      .tab-scroll-container, \
      .col-lg-9, \
      .setor-text, \
      .list-group-item i.fas { \
        transition: all 0.3s ease; \
      } \
      \
      /* Estilo para os itens do menu */ \
      .list-group-item { \
        display: flex; \
        align-items: center; \
      } \
      \
      .list-group-item i.fas { \
        margin-right: 0.75rem; \
        min-width: 1rem; \
        text-align: center; \
      } \
      \
      /* Estilo para tooltips */ \
      .tooltip { \
        z-index: 9999; \
      } \
      \
      .tooltip-inner { \
        background-color: #343a40; \
        color: #fff; \
        border-radius: 0.25rem; \
        padding: 0.25rem 0.5rem; \
        max-width: 200px; \
        text-align: center; \
        box-shadow: 0 3px 6px rgba(0,0,0,0.16); \
      } \
    ';
    
    document.head.appendChild(style);
  },
  
  /**
   * Observar mudanças no estado do AdminLTE para sincronizar nossa interface
   */
  observarMudancasAdminLTE: function() {
    var self = this;
    
    // Verificar se já existe um observer
    if (this.adminLTEObserver) {
      return;
    }
    
    // Criar um novo MutationObserver
    this.adminLTEObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          // Quando AdminLTE muda suas classes, adaptamos nossa interface
          self.atualizarLayoutBaseadoNoAdminLTE();
        }
      });
    });
    
    // Iniciar observação do body
    this.adminLTEObserver.observe(document.body, { attributes: true });
    
    // Fazer verificação inicial
    this.atualizarLayoutBaseadoNoAdminLTE();
  },
  
  /**
   * Atualiza o layout dos setores baseado no estado atual do AdminLTE
   */
  atualizarLayoutBaseadoNoAdminLTE: function() {
    // Verificar se o sidebar do AdminLTE está colapsado
    var isAdminLTECollapsed = document.body.classList.contains('sidebar-collapse');
    
    // Selecionar elementos relevantes
    var tabScrollContainer = document.querySelector('.tab-scroll-container');
    var contentContainer = document.querySelector('.col-lg-9');
    
    if (!tabScrollContainer || !contentContainer) {
      return;
    }
    
    // Atualizar o estilo CSS com base no estado do AdminLTE
    if (isAdminLTECollapsed) {
      // Quando o AdminLTE está recolhido, ajustamos os tamanhos
      tabScrollContainer.classList.add('compact-view');
      contentContainer.classList.add('expanded-content');
      
      // Esconder texto nos itens do menu, deixando apenas ícones
      this.ajustarItensMenu(true);
    } else {
      // Quando o AdminLTE está expandido, restauramos os tamanhos originais
      tabScrollContainer.classList.remove('compact-view');
      contentContainer.classList.remove('expanded-content');
      
      // Restaurar texto completo nos itens do menu
      this.ajustarItensMenu(false);
    }
    
    // Recalcular layout das tabelas Tabulator se existirem
    this.recalcularTabulasTabulatorComDelay();
  },
  
  /**
   * Ajusta os itens do menu para mostrar apenas ícones ou texto completo
   * @param {boolean} apenasIcones Se true, mostra apenas ícones
   */
  ajustarItensMenu: function(apenasIcones) {
    var menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
    
    for (var i = 0; i < menuItems.length; i++) {
      var item = menuItems[i];
      
      if (apenasIcones) {
        // Guardar texto original como atributo data se ainda não estiver guardado
        if (!item.hasAttribute('data-full-text')) {
          var textContent = item.textContent.trim();
          item.setAttribute('data-full-text', textContent);
          
          // Extrair o ícone (assumindo que está no formato <i class="..."></i>)
          var html = item.innerHTML;
          var iconMatch = html.match(/<i class="[^"]+"><\/i>/);
          if (iconMatch) {
            var badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
            item.innerHTML = iconMatch[0] + (badgeMatch ? badgeMatch[0] : '');
          }
        }
      } else {
        // Restaurar texto completo nos itens do menu
        if (item.hasAttribute('data-full-text')) {
          var fullText = item.getAttribute('data-full-text');
          var html = item.innerHTML;
          var iconMatch = html.match(/<i class="[^"]+"><\/i>/);
          var badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
          
          if (iconMatch) {
            // Reconstruir o item com seu texto original
            item.innerHTML = iconMatch[0] + ' ' + fullText;
            
            // Recolocar o badge se existir
            if (badgeMatch) {
              item.innerHTML += ' ' + badgeMatch[0];
            }
          } else {
            item.textContent = fullText;
          }
        }
      }
    }
  },
  
  /**
   * Recalcula as tabelas Tabulator com delay para permitir transições CSS
   */
  recalcularTabulasTabulatorComDelay: function() {
    var self = this;
    clearTimeout(this.recalcTimeout);
    
    this.recalcTimeout = setTimeout(function() {
      // Recalcular layout das tabelas Tabulator se existirem
      var tables = self.state.tabulatorTables;
      for (var tabId in tables) {
        if (tables.hasOwnProperty(tabId)) {
          var table = tables[tabId];
          if (table && typeof table.redraw === 'function') {
            try {
              table.redraw(true);
            } catch (e) {
              console.warn("Erro ao redesenhar tabela:", e);
            }
          }
        }
      }
    }, 300); // Delay para permitir que as transições CSS sejam concluídas
  },
  
  
/**
 * Estilos clean e discretos para o cabeçalho de setores
 */
adicionarEstilosPersonalizados: function() {
    var style = document.createElement('style');
    style.textContent = '\
      /* Estilo clean para o cabeçalho do menu de setores */ \
      .setor-header { \
        background-color: #f8f9fa; \
        border-bottom: 1px solid #dee2e6; \
        padding: 0.75rem 1rem; \
        display: flex; \
        justify-content: space-between; \
        align-items: center; \
        position: sticky; \
        top: 0; \
        z-index: 10; \
      } \
      \
      .setor-header-title { \
        display: flex; \
        align-items: center; \
        font-size: 0.9rem; \
        color: #6c757d; \
        font-weight: 500; \
      } \
      \
      .setor-header-title i { \
        margin-right: 0.5rem; \
        font-size: 0.9rem; \
        color: #6c757d; \
      } \
      \
      /* Botão toggle para menu lateral de setores */ \
      .toggle-setor-btn { \
        border: none; \
        background: none; \
        color: #6c757d; \
        padding: 0.25rem; \
        display: flex; \
        align-items: center; \
        justify-content: center; \
        cursor: pointer; \
        transition: all 0.15s ease; \
        width: 2rem; \
        height: 2rem; \
        border-radius: 0.25rem; \
      } \
      \
      .toggle-setor-btn:hover { \
        background-color: #e9ecef; \
        color: #495057; \
      } \
      \
      /* Estilos para título do setor na área de conteúdo */ \
      .setor-title-container { \
        padding: 0.5rem 0; \
        margin-bottom: 1rem; \
        border-bottom: 1px solid #dee2e6; \
      } \
      \
      .setor-title { \
        color: #495057; \
        font-size: 1.25rem; \
        margin-bottom: 0; \
        font-weight: 500; \
        display: flex; \
        align-items: center; \
      } \
      \
      .setor-title i { \
        color: #6c757d; \
        margin-right: 0.5rem; \
      } \
      \
      /* Estilo para o menu lateral em formato compacto */ \
      .tab-scroll-container { \
        height: calc(100vh - 150px); \
        overflow-y: auto; \
        border-right: 1px solid #dee2e6; \
        transition: width 0.3s ease; \
        background-color: #f8f9fa; \
        width: 100%; \
      } \
      \
      .tab-scroll-container.compact-view { \
        width: 4.5rem !important; \
        overflow: hidden; \
      } \
      \
      .tab-scroll-container.compact-view .setor-header-title span { \
        display: none; \
      } \
      \
      .tab-scroll-container.compact-view .list-group-item { \
        padding: 0.75rem 0.5rem; \
        text-align: center; \
      } \
      \
      .tab-scroll-container.compact-view .list-group-item .badge { \
        display: none; \
      } \
      \
      /* Estilo para os itens do menu */ \
      .tab-scroll-container .list-group-item { \
        border-radius: 0; \
        border-right: none; \
        transition: all 0.2s ease; \
        padding: 0.75rem 1rem; \
        border-left: 3px solid transparent; \
        margin-bottom: 1px; \
      } \
      \
      .tab-scroll-container .list-group-item:hover { \
        background-color: #e9ecef; \
      } \
      \
      .tab-scroll-container .list-group-item.active { \
        background-color: rgba(13, 110, 253, 0.1); \
        border-left-color: #0d6efd; \
        color: #212529; \
      } \
      \
      .tab-scroll-container .list-group-item i { \
        width: 1.25rem; \
        text-align: center; \
        margin-right: 0.5rem; \
      } \
      \
      .tab-scroll-container .list-group-item .badge { \
        margin-left: auto; \
      } \
      \
      /* Estilo para a área de conteúdo expandida quando o menu está compacto */ \
      .col-lg-9.expanded-content { \
        width: calc(100% - 4.5rem) !important; \
        transition: width 0.3s ease; \
      } \
      \
      /* Animação mais sutil para a barra de progresso */ \
      .fade-in-animation { \
        animation: fadeIn 0.5s ease-in-out; \
      } \
      \
      @keyframes fadeIn { \
        0% { opacity: 0.7; } \
        100% { opacity: 1; } \
      } \
      \
      /* Adaptações para dispositivos móveis */ \
      @media (max-width: 991.98px) { \
        .setor-header { \
          cursor: pointer; \
        } \
        \
        .tab-scroll-container, \
        .tab-scroll-container.compact-view { \
          width: 100% !important; \
          margin-bottom: 1rem; \
          max-height: 300px; \
        } \
        \
        .col-lg-9, \
        .col-lg-9.expanded-content { \
          width: 100% !important; \
        } \
         .setor-title img { \
            width: 24px; \
            height: 24px; \
            vertical-align: middle; \
            margin-right: 8px; \
          } \
              }'
    
    document.head.appendChild(style);
  },
  /**
 * Adicione este código ao arquivo implantacao-ui.js
 * Mantenha a sintaxe consistente com o restante do arquivo
 */

// Adicionar método para mostrar o modal de sincronização forçada
mostrarModalSincronizacao: function() {
  // Verificar se um período está selecionado
  const periodoId = document.getElementById('periodoId')?.value;
  const unidadeId = document.getElementById('unidadeSelect')?.value;
  
  if (!periodoId || !unidadeId) {
    this.notificarAviso('Selecione um período antes de forçar a sincronização');
    return;
  }
  
  // Buscar informações do período para exibir no modal
  const periodoElement = document.querySelector('.card-header h5');
  const periodoInfo = periodoElement ? periodoElement.textContent.trim() : `Período ${periodoId}`;
  
  // Criar modal dinamicamente se não existir
  let syncModal = document.getElementById('forceSyncModal');
  
  if (!syncModal) {
    // Criar o modal
    syncModal = document.createElement('div');
    syncModal.id = 'forceSyncModal';
    syncModal.className = 'modal fade';
    syncModal.setAttribute('tabindex', '-1');
    syncModal.setAttribute('aria-labelledby', 'forceSyncModalLabel');
    syncModal.setAttribute('aria-hidden', 'true');
    
    syncModal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title" id="forceSyncModalLabel">Forçar Sincronização de Itens</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Atenção!</strong> Esta ação irá sincronizar todos os novos itens e alterações desde a criação do período congelado.
            </div>
            
            <p><strong>Período:</strong> <span id="sync-periodo-info"></span></p>
            
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="confirmarSincronizacao" required>
                <label class="form-check-label" for="confirmarSincronizacao">
                  Confirmo que desejo sincronizar todos os itens novos e modificados para este período.
                </label>
              </div>
            </div>
            
            <div id="sync-result" class="d-none alert mt-3"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <form action="implantacao.php" method="post" id="syncForm">
              <input type="hidden" name="action" value="force_sync_items">
              <input type="hidden" name="periodo_id" id="sync_periodo_id">
              <input type="hidden" name="unidade_id" id="sync_unidade_id">
              <button type="button" class="btn btn-warning" id="btnForceSyncItems" onclick="submitSyncForm()">
                <i class="fas fa-sync-alt me-2"></i>Forçar Sincronização
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Adicionar o modal ao DOM
    document.body.appendChild(syncModal);
  }
  
  // Preencher informações do período
  document.getElementById('sync-periodo-info').textContent = periodoInfo;
  
  // Preencher campos ocultos do formulário
  document.getElementById('sync_periodo_id').value = periodoId;
  document.getElementById('sync_unidade_id').value = unidadeId;
  
  // Resetar checkbox e resultado
  document.getElementById('confirmarSincronizacao').checked = false;
  const resultElement = document.getElementById('sync-result');
  resultElement.className = 'd-none alert mt-3';
  resultElement.innerHTML = '';
  
  // Exibir o modal
  const modal = new bootstrap.Modal(syncModal);
  modal.show();
},

/**
 * Substitui os ícones FontAwesome nos títulos dos setores por ícones Health Icons específicos
 * @param {boolean} forceUpdate Se verdadeiro, força a atualização mesmo se já tiver sido feito
 */
substituirIconesTitulosSetores: function(forceUpdate = false) {
  console.log("Substituindo ícones nos títulos dos setores");
  
  // Selecionar todos os títulos de setor
  const titulosSetor = document.querySelectorAll('.setor-title');
  
  titulosSetor.forEach(titulo => {
    // Verificar se já substituímos este ícone (a menos que forceUpdate seja true)
    if (!forceUpdate && titulo.querySelector('img.health-icon-img')) {
      return; // Este título já tem um ícone Health Icon
    }
    
    // Obter o texto do título (sem o ícone)
    const textoTitulo = titulo.textContent.trim();
    
    // Determinar o ícone apropriado usando nossa função existente
    const iconeName = this.atribuirIconeDinamico(textoTitulo);
    
    // Remover o ícone FontAwesome existente
    const iconeFontAwesome = titulo.querySelector('i.fas');
    if (iconeFontAwesome) {
      try {
        // Verificar se há algum tooltip associado e destruí-lo
        if (typeof bootstrap !== 'undefined' && 
            bootstrap.Tooltip && 
            iconeFontAwesome._tippy) {
          iconeFontAwesome._tippy.destroy();
        }
        
        // Criar o novo elemento de imagem
        const novoIcone = document.createElement('img');
        novoIcone.src = `../../assets/icons/svg/${iconeName}.svg`;
        novoIcone.className = 'health-icon-img me-2';
        novoIcone.style.width = '32px'; // Maior que antes (era 24px)
        novoIcone.style.height = '32px'; // Maior que antes (era 24px)
        novoIcone.style.verticalAlign = 'middle';
        
        // Substituir o ícone FontAwesome pelo ícone Health Icon
        iconeFontAwesome.parentNode.replaceChild(novoIcone, iconeFontAwesome);
      } catch (error) {
        console.error("Erro ao substituir ícone:", error);
      }
    }
  });
  
  // Adicionar estilos específicos para os ícones nos títulos, se ainda não existirem
  if (!document.getElementById('health-icons-title-styles')) {
    const style = document.createElement('style');
    style.id = 'health-icons-title-styles';
    style.textContent = `
      .health-icon-img {
        width: 32px !important;
        height: 32px !important;
        vertical-align: middle;
        margin-right: 8px;
        transition: transform 0.2s ease;
      }
      
      .health-icon-img:hover {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(style);
  }
},

/**
 * Inicializa as tabelas Tabulator
 */
inicializarTabulatorTables: function() {

      // Verificar se o CSS do tema Bootstrap já foi adicionado
    if (!document.getElementById('tabulator-bootstrap-css')) {
        // Adicionar o CSS do tema Bootstrap
        const bootstrapThemeCSS = document.createElement('link');
        bootstrapThemeCSS.rel = 'stylesheet';
        bootstrapThemeCSS.id = 'tabulator-bootstrap-css';
        bootstrapThemeCSS.href = 'https://unpkg.com/tabulator-tables@5.4.4/dist/css/tabulator_bootstrap5.min.css';
        document.head.appendChild(bootstrapThemeCSS);
        
        console.log("CSS do tema Bootstrap para Tabulator adicionado");
    }
    
    // Primeiro carregar a tradução
    this.carregarTraducaoTabulator('pt-br')
      .then(traducao => {
        // Agora inicialize as tabelas com a tradução carregada
        this.criarTabulasComTraducao(traducao);
      })
      .catch(error => {
        console.error("Erro ao carregar tradução do Tabulator:", error);
        // Inicializar com tradução padrão em caso de erro
        this.criarTabulasComTraducao(this.getDefaultTranslation('pt-br'));
      });
  },
  
  // Adicionar método para mostrar o modal de sincronização forçada
mostrarModalSincronizacao : function() {
  // Verificar se um período está selecionado
  const periodoId = document.getElementById('periodoId')?.value;
  const unidadeId = document.getElementById('unidadeSelect')?.value;
  
  if (!periodoId || !unidadeId) {
    this.notificarAviso('Selecione um período antes de forçar a sincronização');
    return;
  }
  
  // Buscar informações do período para exibir no modal
  const periodoElement = document.querySelector('.card-header h5');
  const periodoInfo = periodoElement ? periodoElement.textContent.trim() : `Período ${periodoId}`;
  
  // Criar modal dinamicamente se não existir
  let syncModal = document.getElementById('forceSyncModal');
  
  if (!syncModal) {
    // Criar o modal
    syncModal = document.createElement('div');
    syncModal.id = 'forceSyncModal';
    syncModal.className = 'modal fade';
    syncModal.setAttribute('tabindex', '-1');
    syncModal.setAttribute('aria-labelledby', 'forceSyncModalLabel');
    syncModal.setAttribute('aria-hidden', 'true');
    
    syncModal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title" id="forceSyncModalLabel">Forçar Sincronização de Itens</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Atenção!</strong> Esta ação irá sincronizar todos os novos itens e alterações desde a criação do período congelado.
            </div>
            
            <p><strong>Período:</strong> <span id="sync-periodo-info"></span></p>
            
            <div class="mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="confirmarSincronizacao" required>
                <label class="form-check-label" for="confirmarSincronizacao">
                  Confirmo que desejo sincronizar todos os itens novos e modificados para este período.
                </label>
              </div>
            </div>
            
            <div id="sync-result" class="d-none alert mt-3"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-warning" id="btnForceSyncItems" onclick="forcarSincronizacaoItens()">
              <i class="fas fa-sync-alt me-2"></i>Forçar Sincronização
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Adicionar o modal ao DOM
    document.body.appendChild(syncModal);
  }
  
  // Preencher informações do período
  document.getElementById('sync-periodo-info').textContent = periodoInfo;
  
  // Resetar checkbox e resultado
  document.getElementById('confirmarSincronizacao').checked = false;
  const resultElement = document.getElementById('sync-result');
  resultElement.className = 'd-none alert mt-3';
  resultElement.innerHTML = '';
  
  // Exibir o modal
  const modal = new bootstrap.Modal(syncModal);
  modal.show();
},


/**
 * Cria as tabelas Tabulator com a tradução carregada
 * @param {Object} traducao Objeto de tradução para o Tabulator
 */
criarTabulasComTraducao: function(traducao) {
  // Aguardar um pouco mais para garantir que o DOM está pronto
  setTimeout(() => {
    // Percorrer todas as tabs de setores
    document.querySelectorAll('.tab-pane[data-setor-id]').forEach((tabElement) => {
      const tabId = tabElement.id;
      const setorId = tabElement.getAttribute('data-setor-id');
      
      // Verificar se o container da tabela existe
      const tableContainer = document.getElementById(`tabulator-${tabId}`);
      if (!tableContainer) {
        console.warn(`Container da tabela não encontrado para o setor: ${tabId}`);
        return;
      }
      
      // Obter dados da unidade/período
      const unidadeId = document.getElementById('unidadeSelect')?.value || "";
      const periodoId = document.getElementById('periodoId')?.value || "";
      
      if (!unidadeId || !periodoId) {
        console.warn("unidadeId ou periodoId não encontrados");
        return;
      }
      
      // Garantir que o container tem um tamanho definido
      tableContainer.style.height = "500px";
      tableContainer.style.width = "100%";

      // Adicionar classe de tema Bootstrap se ainda não existir
      if (!tableContainer.classList.contains('tabulator-bootstrap')) {
        tableContainer.classList.add('tabulator-bootstrap');
      }
      
      // IMPORTANTE: Verificar se o período está congelado
      const isPeriodoCongelado = window.periodoInfo && window.periodoInfo.is_frozen;
      
      // Escolher a URL correta com base no estado de congelamento
      let ajaxURL;
      if (isPeriodoCongelado) {
          ajaxURL = `${ImplantacaoCRUD.getApiUrl()}?action=get_diagnostico_frozen&setor_id=${setorId}&unidade_id=${unidadeId}&periodo_id=${periodoId}`;
          console.log(`[TABULATOR] Usando URL para período CONGELADO: ${ajaxURL}`);
      } else {
          ajaxURL = `${ImplantacaoCRUD.getApiUrl()}?action=get_itens_tabela&setor_id=${setorId}&unidade_id=${unidadeId}&periodo_id=${periodoId}`;
          console.log(`[TABULATOR] Usando URL para período NÃO congelado: ${ajaxURL}`);
      }
      
      // Configurações da tabela Tabulator
      const tabulatorConfig = {
        layout: "fitColumns",
        height: "500px", // Definir altura fixa
        minHeight: "400px", // Altura mínima para evitar problemas
        responsiveLayout: "collapse",
        pagination: true,
        paginationSize: 15,
        paginationSizeSelector: [10, 15, 25, 50, 100],
        
        // Use the custom data loader instead of ajaxURL
        ajaxRequestFunc: (url, config, params) => {
          return ImplantacaoUI.customTabulatorDataLoader(ajaxURL, {
            method: "GET",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              "Accept": "application/json"
            }
          });
        },
        
        ajaxConfig: {
          method: "GET",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json"
          }
        },
        ajaxLoaderLoading: "<div class='spinner-border text-primary' role='status'><span class='visually-hidden'>Carregando...</span></div>",
        placeholder: "Nenhum item encontrado",
        
        ajaxResponse: function(url, params, response) {
          // Check if we received a string instead of parsed JSON
          if (typeof response === 'string') {
            try {
              return JSON.parse(response);
            } catch (e) {
              console.error("Invalid JSON response:", e);
              console.log("Raw response:", response.substring(0, 500));
              // Return empty array to avoid breaking the tabulator
              return [];
            }
          }
          
          // Check if we received an error object
          if (response && response.error) {
            console.error("API error:", response.error);
            // Show error to user
            ImplantacaoUI.notificarErro("Erro ao carregar dados: " + response.error);
            return [];
          }
          
          return response;
        },
        
        ajaxError: function(error, xhr) {
          console.error("Tabulator AJAX Error:", error);
          
          // Try to get more info from the response
          if (xhr && xhr.responseText) {
            try {
              console.log("Raw response:", xhr.responseText.substring(0, 500));
            } catch (e) {
              console.log("Could not log raw response");
            }
          }
          
          // Show error in table container
          const container = this.element;
          if (container) {
            container.innerHTML = `
              <div class="alert alert-danger my-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Erro ao carregar dados:</strong> ${error.message || 'Erro desconhecido'}
                <hr>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="window.location.reload()">
                  <i class="fas fa-sync-alt me-1"></i> Tentar novamente
                </button>
              </div>
            `;
          }
          
          // Show toast notification
          ImplantacaoUI.notificarErro('Erro ao carregar dados da tabela: ' + (error.message || 'Erro desconhecido'));
          
          return true; // Prevent default error handling
        },
        
        // Tema Bootstrap
        theme: "bootstrap",
        
        // Adicionar a tradução carregada
        locale: "pt-br",
        langs: {
          "pt-br": traducao
        },

        // Classes personalizadas que ajudam na adaptação visual ao Bootstrap 5
        classes: {
          table: "table table-bordered",
          tableFooter: "bg-light border-top",
          header: "bg-primary bg-gradient text-white py-2"
        },

        columns: [
          { 
            title: "ID", 
            field: "id", 
            width: 70, 
            headerSort: true, 
            sorter: "number" 
          },
          { 
            title: "Item", 
            field: "item", 
            headerSort: true, 
            formatter: function(cell) {
              const value = cell.getValue();
              const data = cell.getRow().getData();
              let html = `<div class="fw-bold">${value}</div>`;
              
              // Verificar usando o campo estado_avaliacao
              if (data.estado_avaliacao === 'avaliado') {
                html += '<div class="small text-muted mt-1">';
                html += '<i class="fas fa-check-circle me-1"></i> Item avaliado';
                html += '</div>';
                
                if (data.observacoes) {
                  html += '<div class="small text-muted mt-1">';
                  html += '<i class="fas fa-comment-dots me-1"></i> <strong>Observações:</strong> ' + 
                        data.observacoes.replace(/\n/g, '<br>');
                  html += '</div>';
                }
              }
              
              return html;
            }
          },
          {
            title: "Status",
            field: "status_desc",
            headerSort: true,
            width: 180,
            cssClass: "cell-status",
            formatter: function(cell) {
              const data = cell.getRow().getData();
              
              // Verificar se o período está expirado para aplicar estilo diferente
              const periodoExpirado = window.periodoInfo && window.periodoInfo.expirado === true;
              const opacityClass = periodoExpirado ? 'opacity-75' : '';
              
              if (data.nao_aplica == 1) {
                return `<span class="badge bg-secondary p-2 ${opacityClass}"><i class="fas fa-ban me-1"></i> Não se Aplica</span>`;
              } else if (data.status == 'conforme') {
                return `<span class="badge bg-success p-2 ${opacityClass}"><i class="fas fa-check-circle me-1"></i> Conforme</span>`;
              } else if (data.status == 'nao_conforme') {
                return `<span class="badge bg-danger p-2 ${opacityClass}"><i class="fas fa-times-circle me-1"></i> Não Conforme</span>`;
              } else if (data.status == 'parcialmente_conforme') {
                return `<span class="badge bg-warning p-2 ${opacityClass}"><i class="fas fa-exclamation-circle me-1"></i> Parcialmente Conforme</span>`;
              } else {
                return `<span class="badge bg-light text-dark p-2 ${opacityClass}"><i class="far fa-circle me-1"></i> Pendente</span>`;
              }
            }
          },
          {
            title: "Ações",
            formatter: function(cell) {
              const data = cell.getRow().getData();
              const tabElement = document.querySelector(`#${tabId}`);
              const setorId = tabElement.getAttribute('data-setor-id');
              const periodoId = document.getElementById('periodoId')?.value || "";
              const unidadeId = document.getElementById('unidadeSelect')?.value || "";
              
              // Verificar se o período está expirado
              const periodoExpirado = window.periodoInfo && window.periodoInfo.expirado === true;
              
              let html = '<div class="btn-actions-group">';
              
              // Lógica simples e direta para determinar se um item foi avaliado: 
              // 1. Se tem status definido ("conforme", "nao_conforme", "parcialmente_conforme")
              // 2. OU se está marcado como "não se aplica"
              const status = data.status || '';
              const naoAplica = data.nao_aplica === 1;
              
              const foiAvaliado = (status === 'conforme' || 
                                    status === 'nao_conforme' || 
                                    status === 'parcialmente_conforme' || 
                                    naoAplica);
              
              // Debug info para ajudar a identificar problemas
              console.log(`Item: ${data.item}, ID: ${data.id}, Status: ${status}, Não aplica: ${naoAplica}, Foi avaliado: ${foiAvaliado}`);
              
              if (periodoExpirado) {
                // Para períodos expirados, mostrar apenas ícone de visualização
                html += `<button class="btn btn-outline-secondary btn-sm" 
                              title="Período expirado - apenas visualização">
                        <i class="fas fa-eye me-1"></i> Visualizar
                      </button>`;
              } else {
                // Para períodos não expirados
                if (foiAvaliado) {
                  // Botão Editar para itens já avaliados
                  html += `<button class="btn btn-warning btn-sm" onclick="window.editarAvaliacao(${data.id}, '${ImplantacaoUI.escaparString(data.item)}', '${tabId}', ${periodoId}, ${unidadeId}, ${setorId}, ${data.diagnostico_id || data.id})">`;
                  html += '<i class="fas fa-edit me-1"></i> Editar</button>';
                } else {
                  // Botão Avaliar para itens não avaliados ou pendentes
                  html += `<button class="btn btn-primary btn-sm" onclick="window.editarAvaliacao(${data.id}, '${ImplantacaoUI.escaparString(data.item)}', '${tabId}', ${periodoId}, ${unidadeId}, ${setorId})">`;
                  html += '<i class="fas fa-clipboard-check me-1"></i> Avaliar</button>';
                }
              }
              
              html += '</div>';
              return html;
            },
            cssClass: "cell-actions",
            width: 120,
            hozAlign: "center",
            headerSort: false
          }
        ],
        initialSort: [
          {column: "id", dir: "asc"}
        ],
        rowFormatter: function(row) {
          // Adicionar atributos data-* na linha para facilitar manipulação posterior
          const rowData = row.getData();
          row.getElement().setAttribute("data-item-id", rowData.id);
          
          // Adicionar classe para períodos expirados
          if (window.periodoInfo && window.periodoInfo.expirado === true) {
            row.getElement().classList.add("periodo-expirado-item");
          }
          
          if (rowData.diagnostico_id) {
            row.getElement().setAttribute("data-diagnostico-id", rowData.diagnostico_id);
          }
        },
      };
      
      // Criar a instância do Tabulator
      try {
        const table = new Tabulator(`#tabulator-${tabId}`, tabulatorConfig);
        
        // Armazenar referência da tabela para uso posterior
        this.state.tabulatorTables[tabId] = table;
        
        // Adicionar eventos
        table.on("tableBuilt", () => {
          console.log(`Tabela construída para setor: ${tabId}`);
          // Marcar a tab como carregada
          tabElement.setAttribute('data-loaded', 'true');
          // Atualizar a barra de progresso (com um pequeno delay)
          setTimeout(() => {
            this.atualizarBarraProgressoComAnimacao(tabId);
          }, 100);
        });
        
        // Após qualquer renderização, atualizar a barra de progresso
        table.on("renderComplete", () => {
          this.atualizarBarraProgressoComAnimacao(tabId);
        });
      } catch (e) {
        console.error("Erro ao inicializar Tabulator:", e);
        tableContainer.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Erro ao inicializar tabela: ${e.message}
          </div>
        `;
      }
    });
  }, 200);
},
/**
 * carregarLoadingBar - Function to load Loading-bar.js assets
 */
carregarLoadingBar: function() {
  // Check if the CSS is already added
  if (!document.getElementById('loading-bar-css')) {
    const cssLink = document.createElement('link');
    cssLink.id = 'loading-bar-css';
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = '../../assets/libs/loading-bar/loading-bar.min.css';
    document.head.appendChild(cssLink);
  }
  
  // Check if the JS is already added
  if (!document.getElementById('loading-bar-js')) {
    const script = document.createElement('script');
    script.id = 'loading-bar-js';
    script.type = 'text/javascript';
    script.src = '../../assets/libs/loading-bar/loading-bar.min.js';
    document.body.appendChild(script);
  }
  
  // Add custom styles if they don't exist yet
  if (!document.getElementById('loading-bar-custom-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-bar-custom-styles';
    style.textContent = `
      /* Styles for progress containers */
      .periodo-info {
        padding: 10px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        margin-bottom: 20px;
      }
      
      /* Sector/subsector title */
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .progress-title {
        font-size: 1rem;
        font-weight: 500;
      }
      
      .progress-subtitle {
        font-size: 0.85rem;
        color: #6c757d;
      }
      
      .subsector-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background-color: #f8f9fa;
        border-radius: 10px;
        font-size: 0.75rem;
        color: #495057;
        margin-left: 8px;
      }
      
      /* Progress statistics */
      .progress-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }
      
      .stat-item {
        display: flex;
        align-items: center;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        background-color: rgba(0,0,0,0.03);
      }
      
      .stat-item i {
        margin-right: 5px;
      }
      
      /* Colors for statistics */
      .stat-success { color: #28a745; }
      .stat-warning { color: #ffc107; }
      .stat-danger { color: #dc3545; }
      .stat-secondary { color: #6c757d; }
      .stat-light { color: #adb5bd; }
      
      /* Total progress */
      .progress-total {
        text-align: center;
        margin-top: 8px;
        font-weight: 500;
        font-size: 0.9rem;
      }
      
      /* Animation when updating */
      @keyframes progress-pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }
      
      .pulse-animation {
        animation: progress-pulse 1.5s ease-in-out;
      }
      
      /* Custom loading bar */
      .ldBar path.mainline {
        stroke-width: 3;
      }
      
      .ldBar-label {
        font-family: inherit;
        font-size: 1rem;
        font-weight: 500;
      }
      
      /* Detailed status bars */
      .mini-progress {
        margin-top: 12px;
      }
      
      .mini-progress-item {
        margin-bottom: 8px;
      }
      
      .mini-progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        font-size: 0.75rem;
      }
    `;
    document.head.appendChild(style);
  }
},
  
    /**
     * Configura eventos para as tabs
     */
    configurarEventosTabs: function() {
        var self = this;
        document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(function(tabElement) {
        tabElement.addEventListener('shown.bs.tab', function(event) {
            setTimeout(function() {
                self.substituirIconesTitulosSetores(true);
              }, 100);
            var tabId = event.target.getAttribute('aria-controls');
            var tabContent = document.getElementById(tabId);
            var setorNome = event.target.getAttribute('data-setor-original');
            
            // Exibir o título do setor quando a tab é clicada
            self.exibirTituloSetor(tabId, setorNome);
            
            if (tabContent && tabContent.getAttribute("data-loaded") === "false") {
            console.log("Carregando conteúdo para tab:", tabId);
            self.carregarDadosTabulator(tabId);
            } else {
            console.log("Tab já carregada anteriormente:", tabId);
            // Atualizar a barra de progresso
            self.atualizarBarraProgressoComAnimacao(tabId);
            }
        });
        });
    },
   /**
 * adicionarMiniBarrasStatus - Create mini progress bars for each status
 */
adicionarMiniBarrasStatus: function(container, data) {
  // Check if there is enough data
  if (!container || !data || data.total === 0) return;
  
  // Check if the mini-bars container already exists
  let miniProgressDiv = container.querySelector('.mini-progress');
  
  // Create if it doesn't exist
  if (!miniProgressDiv) {
    miniProgressDiv = document.createElement('div');
    miniProgressDiv.className = 'mini-progress';
    container.appendChild(miniProgressDiv);
  } else {
    // Clear existing content
    miniProgressDiv.innerHTML = '';
  }
  
  // Define status types to display
  const statusTypes = [
    { name: 'Conformes', count: data.conformes, color: '#28a745', class: 'success' },
    { name: 'Parcialmente Conformes', count: data.parcialmente_conformes, color: '#ffc107', class: 'warning' },
    { name: 'Não Conformes', count: data.nao_conformes, color: '#dc3545', class: 'danger' },
    { name: 'Não se Aplica', count: data.nao_se_aplica, color: '#6c757d', class: 'secondary' }
  ];
  
  // Only display bars for status with values
  statusTypes.forEach(status => {
    if (status.count > 0) {
      const percent = Math.round((status.count / data.total) * 100);
      
      const miniBarDiv = document.createElement('div');
      miniBarDiv.className = 'mini-progress-item';
      miniBarDiv.innerHTML = `
        <div class="mini-progress-header">
          <div class="stat-${status.class}">
            ${status.name}: ${status.count}/${data.total}
          </div>
          <div class="stat-${status.class} fw-bold">
            ${percent}%
          </div>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar bg-${status.class}" 
               role="progressbar" 
               style="width: ${percent}%" 
               aria-valuenow="${status.count}" 
               aria-valuemin="0" 
               aria-valuemax="${data.total}">
          </div>
        </div>
      `;
      
      miniProgressDiv.appendChild(miniBarDiv);
    }
  });
},
  
    /**
     * Carrega a primeira tab
     */
    carregarPrimeiraTab: function() {
      var firstTab = document.querySelector('.nav-link.active[data-bs-toggle="pill"]');
      if (firstTab) {
        var tabId = firstTab.getAttribute('aria-controls');
        var tabContent = document.getElementById(tabId);
        var setorNome = firstTab.getAttribute('data-setor-original');
        
        var self = this;
        setTimeout(function() {
          // Exibir o título do setor para a primeira tab
          self.exibirTituloSetor(tabId, setorNome);
          
          if (tabContent && tabContent.getAttribute("data-loaded") === "false") {
            console.log("Carregando conteúdo para primeira tab:", tabId);
            self.carregarDadosTabulator(tabId);
          }
        }, 300);
      }
    },
  
    /**
     * Configura eventos para formulários
     */
    configurarEventosFormulario: function() {
      // Gestão do checkbox "Não se aplica"
      const naoAplicaCheckbox = document.getElementById('nao_se_aplica');
      
      if (naoAplicaCheckbox) {
        // Remover evento anterior para evitar duplicação
        naoAplicaCheckbox.removeEventListener('change', this.alterarNaoSeAplica);
        
        // Adicionar novo evento
        naoAplicaCheckbox.addEventListener('change', this.alterarNaoSeAplica);
        
        // Verificar estado atual
        this.alternarOpcoesStatus(naoAplicaCheckbox.checked);
      }
    },
  
    /**
     * Manipula a alteração do checkbox "Não se aplica"
     */
    alterarNaoSeAplica: function() {
      ImplantacaoUI.alternarOpcoesStatus(this.checked);
    },
  
    /**
     * Ativa/desativa as opções de status com base no checkbox "Não se aplica"
     * @param {boolean} desativar Se true, desativa os campos de status
     */
    alternarOpcoesStatus: function(desativar) {
      const statusRadios = document.querySelectorAll('input[name="status"]');
      statusRadios.forEach(radio => {
        radio.disabled = desativar;
        if (desativar) radio.checked = false;
      });
    },
  
    /**
     * Escapa uma string para uso seguro em HTML
     * @param {string} str String a ser escapada
     * @returns {string} String escapada
     */
    escaparString: function(str) {
      if (typeof str !== 'string') return '';
      return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    },
  
    /**
     * Verifica se o modal de período deve ser exibido
     */
    verificarModalPeriodo: function() {
      if (document.getElementById('periodoModal')) {
        const unidadeSelect = document.getElementById('unidadeSelect');
        if (!unidadeSelect || !unidadeSelect.value) {
          var myModal = new bootstrap.Modal(document.getElementById('periodoModal'));
          myModal.show();
        }
      }
    },
  
    /**
     * Carrega dados para uma tabela Tabulator específica
     * @param {string} tabId ID da tab/setor
     */
    carregarDadosTabulator: function(tabId) {
      // Verificar se a tabela existe
      if (!this.state.tabulatorTables[tabId]) {
        console.warn(`Tabela Tabulator não encontrada para o setor: ${tabId}`);
        return;
      }
      
      // Obter o elemento da tab para atualizar a barra de progresso
      const tabElement = document.getElementById(tabId);
      if (!tabElement) {
        console.error("Elemento tab não encontrado:", tabId);
        return;
      }
      
      // Mostrar indicador de carregamento na área da barra de progresso
      const progressContainer = tabElement.querySelector('.periodo-info');
      if (progressContainer) {
        progressContainer.innerHTML = `
          <div class="text-center p-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando progresso...</p>
          </div>
        `;
      }
      
      console.log(`Carregando dados para tabela: ${tabId}`);
      
      // Disparar carregamento dos dados
      try {
        this.state.tabulatorTables[tabId].setData();
      } catch (e) {
        console.error("Erro ao carregar dados da tabela:", e);
        if (progressContainer) {
          progressContainer.innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Erro ao carregar dados: ${e.message}
            </div>
          `;
        }
      }
    },

    /**
 * Verifica a estrutura do objeto de retorno da API e cria uma versão padronizada
 * Esta função garante que todos os campos necessários existam, mesmo se a API retornar dados incompletos
 * @param {Object} data Dados recebidos da API
 * @returns {Object} Objeto normalizado com todos os campos necessários
 */
normalizarDadosProgresso: function(data) {
  // Garantir que retornamos um objeto válido mesmo se data for null ou undefined
  if (!data) {
    data = {};
  }
  
  // Criar objeto com valores padrão para todos os campos necessários
  return {
    total: data.total || 0,
    conformes: data.conformes || 0,
    nao_conformes: data.nao_conformes || 0,
    parcialmente_conformes: data.parcialmente_conformes || 0,
    nao_se_aplica: data.nao_se_aplica || 0,
    pendentes: data.pendentes || 0,
    error: data.error || null
  };
},
  
/**
 * Updated atualizarBarraProgressoComAnimacao - Use Loading-bar.js instead of ProgressJS
 */
atualizarBarraProgressoComAnimacao: function(tabId, subsetorId = null) {
    try {
      // Ensure Loading-bar.js is loaded
      this.carregarLoadingBar();
      
      // Verify if the tab exists
      const tabElement = document.getElementById(tabId);
      if (!tabElement) {
        console.warn("Tab element not found:", tabId);
        return;
      }
      
      // Get the necessary IDs
      const setorId = tabElement.getAttribute('data-setor-id');
      const unidadeId = document.getElementById('unidadeSelect')?.value;
      const periodoId = document.getElementById('periodoId')?.value;
      
      if (!setorId || !unidadeId || !periodoId) {
        console.warn("Missing required ID:", { setorId, unidadeId, periodoId });
        return;
      }
      
      // Get the progress container
      const progressContainer = tabElement.querySelector('.periodo-info');
      if (!progressContainer) {
        console.warn("Progress container not found for:", tabId);
        return;
      }
      
      // Generate unique ID for the container if it doesn't have one
      if (!progressContainer.id) {
        progressContainer.id = 'progress-container-' + tabId;
      }
      
      // Check if already loading
      if (progressContainer.getAttribute('data-loading') === 'true') {
        return; // Already loading, don't start another request
      }
      
      // Mark as loading
      progressContainer.setAttribute('data-loading', 'true');
      
      // Get sector and subsector information
      let setorNome = '';
      let subsetorNome = null;
      
      // Get sector name
      const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
      if (setorElement) {
        setorNome = setorElement.getAttribute('data-setor-original') || setorElement.textContent.trim();
      }
      
      // Get subsector name if provided
      if (subsetorId) {
        const subsetorElement = document.querySelector(`[data-setor-id="${setorId}"][data-subsetor-id="${subsetorId}"]`);
        if (subsetorElement) {
          subsetorNome = subsetorElement.textContent.trim();
        }
      }
      
      // Show loading indicator
      progressContainer.innerHTML = `
        <div class="d-flex justify-content-center align-items-center p-3">
          <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          <span>Carregando dados de progresso...</span>
        </div>
      `;
      
      // API URL to get progress
      const apiUrl = typeof ImplantacaoCRUD?.getApiUrl === 'function' ? 
                    ImplantacaoCRUD.getApiUrl() : 
                    '../../helpers/implantacao_helpers.php';
      
      // Build URL with all parameters
      let url = `${apiUrl}?action=get_progress&setor_id=${setorId}&unidade=${unidadeId}&periodo=${periodoId}`;
      
      // Add subsector if provided
      if (subsetorId) {
        url += `&subsetor_id=${subsetorId}`;
      }
      
      // Add timestamp to avoid cache
      url += `&_=${Date.now()}`;
      
      // Fetch progress data
      fetch(url, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Remove loading flag
        progressContainer.removeAttribute('data-loading');
        
        // Normalize data
        const stats = this.normalizarDadosProgresso(data);
        
        if (stats.error) {
          progressContainer.innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              ${stats.error}
            </div>
          `;
          return;
        }
        
        // Clear container before creating new progress bar
        progressContainer.innerHTML = '';
        
        // Remove any previous animation class
        progressContainer.classList.remove('pulse-animation');
        
        try {
          // Create elements to show progress
          this.criarProgressBar(progressContainer, tabId, stats, setorNome, subsetorNome);
          
          // Apply a temporary subtle class
          progressContainer.classList.add('fade-in-animation');
          
          // Remove animation class after a while
          setTimeout(function() {
            progressContainer.classList.remove('fade-in-animation');
          }, 1000);
        } catch (error) {
          console.error("Error creating progress bar:", error);
          progressContainer.innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Erro ao criar barra de progresso: ${error.message}
            </div>
          `;
        }
      })
      .catch(function(error) {
        // Remove loading flag in case of error
        progressContainer.removeAttribute('data-loading');
        
        console.error("Error updating progress bar:", error);
        progressContainer.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Erro ao carregar o progresso: ${error.message}
          </div>
        `;
      });
    } catch (error) {
      console.error("General error updating progress bar:", error);
    }
  },
/**
 * Fix for obterProgresso in ImplantacaoCRUD object
 */
obterProgresso: function(setorId, tabId, unidadeId, periodoId, subsetorId = null) {
  return new Promise((resolve, reject) => {
    if (!setorId || !unidadeId || !periodoId) {
      console.warn("Falta algum ID necessário:", { setorId, unidadeId, periodoId });
      resolve({
        total: 0,
        avaliados: 0,
        conformes: 0,
        nao_conformes: 0,
        parcialmente_conformes: 0,
        nao_se_aplica: 0,
        pendentes: 0,
        percentual_progresso: 0
      });
      return;
    }
    
    const apiUrl = this.getApiUrl();
    const cacheBuster = Date.now();
    const url = `${apiUrl}?action=get_progress&setor_id=${setorId}&unidade=${unidadeId}&periodo=${periodoId}&_=${cacheBuster}`;
    
    console.log("Obtendo progresso de:", url);
    
    // Add proper timeout handling
    const timeoutId = setTimeout(() => {
      console.error("Timeout ao buscar progresso");
      resolve({
        total: 0,
        avaliados: 0,
        conformes: 0,
        nao_conformes: 0,
        parcialmente_conformes: 0,
        nao_se_aplica: 0,
        pendentes: 0,
        percentual_progresso: 0,
        error: "Timeout ao buscar dados de progresso"
      });
    }, 5000);
    
    fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    .then(response => {
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      // First get the response as text
      return response.text();
    })
    .then(text => {
      if (!text || text.trim() === '') {
        console.error("Resposta vazia do servidor");
        return {
          total: 0,
          avaliados: 0,
          conformes: 0,
          nao_conformes: 0,
          parcialmente_conformes: 0,
          nao_se_aplica: 0,
          pendentes: 0,
          percentual_progresso: 0,
          error: "Resposta vazia do servidor"
        };
      }
      
      try {
        // Try to parse JSON
        return JSON.parse(text);
      } catch (e) {
        console.error("Erro ao fazer parse do JSON:", e, "Texto:", text.substring(0, 200));
        return {
          total: 0,
          avaliados: 0,
          conformes: 0,
          nao_conformes: 0,
          parcialmente_conformes: 0,
          nao_se_aplica: 0,
          pendentes: 0,
          percentual_progresso: 0,
          error: "Resposta não é um JSON válido"
        };
      }
    })
    .then(data => {
      resolve(data);
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.error("Erro ao obter progresso:", error);
      
      // Return default data structure on error
      resolve({
        total: 0,
        avaliados: 0,
        conformes: 0,
        nao_conformes: 0,
        parcialmente_conformes: 0,
        nao_se_aplica: 0,
        pendentes: 0,
        percentual_progresso: 0,
        error: error.message
      });
    });
  });
},
  
/**
 * New criarProgressBar using Loading-bar.js
 */
criarProgressBar: function(container, tabId, data, setorNome = '', subsetorNome = null) {
    try {
      // Check if container exists
      if (!container) {
        console.error("Container not provided to create progress bar");
        return;
      }
      
      // Clear any previous content
      container.innerHTML = '';
      
      // Generate a unique ID for LoadingBar
      const progressId = `ldbar-${tabId}${subsetorNome ? '-' + subsetorNome.replace(/\s+/g, '-').toLowerCase() : ''}`;
      
      // Calculate completion percentage
      const percentConcluido = data.percentual_progresso || 0;
      
      // Create header with sector/subsector title
      const headerDiv = document.createElement('div');
      headerDiv.className = 'progress-header';
      
      // Title with or without subsector
      let headerHtml = `
        <div>
          <span class="progress-title">${setorNome || 'Progresso'}</span>
      `;
      
      // Add subsector badge if it exists
      if (subsetorNome) {
        headerHtml += `
          <span class="subsector-badge">
            <i class="fas fa-layer-group me-1"></i>
            ${subsetorNome}
          </span>
        `;
      }
      
      headerHtml += `
        </div>
        <div class="progress-subtitle">
          Total: ${data.total} itens
        </div>
      `;
      
      headerDiv.innerHTML = headerHtml;
      container.appendChild(headerDiv);
      
      // Container for LoadingBar
      const barContainer = document.createElement('div');
      barContainer.className = 'progress-bar-container';
      barContainer.innerHTML = `
        <div class="ldBar" 
             id="${progressId}" 
             data-value="${percentConcluido}" 
             data-preset="line" 
             data-stroke="#17a2b8"
             data-stroke-width="3"
             style="width:100%;height:40px;">
        </div>
      `;
      
      container.appendChild(barContainer);
      
      // Add statistics
      const statsDiv = document.createElement('div');
      statsDiv.className = 'progress-stats';
      statsDiv.innerHTML = `
        <span class="stat-item stat-success">
          <i class="fas fa-check-circle"></i> Conforme: ${data.conformes}
        </span>
        <span class="stat-item stat-warning">
          <i class="fas fa-exclamation-circle"></i> Parcial: ${data.parcialmente_conformes}
        </span>
        <span class="stat-item stat-danger">
          <i class="fas fa-times-circle"></i> Não Conforme: ${data.nao_conformes}
        </span>
        <span class="stat-item stat-secondary">
          <i class="fas fa-ban"></i> Não se Aplica: ${data.nao_se_aplica}
        </span>
        <span class="stat-item stat-light">
          <i class="far fa-circle"></i> Pendentes: ${data.pendentes}
        </span>
      `;
      
      container.appendChild(statsDiv);
      
      // Add percentage text
      const totalDiv = document.createElement('div');
      totalDiv.className = 'progress-total';
      totalDiv.innerHTML = `
        <i class="fas fa-chart-pie me-1"></i>
        <strong>${percentConcluido}%</strong> dos itens avaliados
      `;
      
      container.appendChild(totalDiv);
      
      // Initialize LoadingBar.js
      const initLoadingBar = () => {
        // Check if the library is loaded
        if (typeof ldBar === 'undefined') {
          console.log("Waiting for LoadingBar.js to load...");
          setTimeout(initLoadingBar, 100);
          return;
        }
        
        try {
          // Create progress bar
          const progressBar = new ldBar(`#${progressId}`);
          
          // Animate to correct value
          progressBar.set(percentConcluido);
          
          // Add mini-bars for each status with values
          this.adicionarMiniBarrasStatus(container, data);
          
          // Add class for animation
          container.classList.add('pulse-animation');
          
          // Remove animation after a while
          setTimeout(() => {
            container.classList.remove('pulse-animation');
          }, 1500);
          
        } catch (e) {
          console.error("Error creating progress bar with LoadingBar.js:", e);
          this.criarBarraFallback(container, data);
        }
      };
      
      // Start initialization
      initLoadingBar();
      
      return container;
      
    } catch (error) {
      console.error("Error creating progress bar:", error);
      
      // In case of error use fallback
      this.criarBarraFallback(container, data);
    }
  },
  /**
 * criarBarraFallback - Create a fallback progress bar using Bootstrap
 */
criarBarraFallback: function(container, data) {
  if (!container) return;
  
  // Clear current content
  container.innerHTML = '';
  
  // Calculate percentage
  const percentConcluido = data.percentual_progresso || 
    (data.total > 0 ? Math.round((data.avaliados / data.total) * 100) : 0);
  
  // Create Bootstrap progress bar
  const progressDiv = document.createElement('div');
  progressDiv.innerHTML = `
    <div class="progress" style="height: 20px;">
      <div class="progress-bar bg-success" role="progressbar" style="width: ${data.conformes / data.total * 100}%" 
           aria-valuenow="${data.conformes}" aria-valuemin="0" aria-valuemax="${data.total}"></div>
      <div class="progress-bar bg-warning" role="progressbar" style="width: ${data.parcialmente_conformes / data.total * 100}%" 
           aria-valuenow="${data.parcialmente_conformes}" aria-valuemin="0" aria-valuemax="${data.total}"></div>
      <div class="progress-bar bg-danger" role="progressbar" style="width: ${data.nao_conformes / data.total * 100}%" 
           aria-valuenow="${data.nao_conformes}" aria-valuemin="0" aria-valuemax="${data.total}"></div>
      <div class="progress-bar bg-secondary" role="progressbar" style="width: ${data.nao_se_aplica / data.total * 100}%" 
           aria-valuenow="${data.nao_se_aplica}" aria-valuemin="0" aria-valuemax="${data.total}"></div>
      <div class="progress-bar bg-light text-dark" role="progressbar" style="width: ${data.pendentes / data.total * 100}%" 
           aria-valuenow="${data.pendentes}" aria-valuemin="0" aria-valuemax="${data.total}"></div>
    </div>
    <div class="text-center mt-2">
      <strong>${percentConcluido}%</strong> dos itens avaliados
    </div>
  `;
  
  container.appendChild(progressDiv);
  
  // Add statistics
  const statsDiv = document.createElement('div');
  statsDiv.className = 'progress-stats mt-2';
  statsDiv.innerHTML = `
    <span class="stat-item stat-success">
      <i class="fas fa-check-circle"></i> Conforme: ${data.conformes}
    </span>
    <span class="stat-item stat-warning">
      <i class="fas fa-exclamation-circle"></i> Parcial: ${data.parcialmente_conformes}
    </span>
    <span class="stat-item stat-danger">
      <i class="fas fa-times-circle"></i> Não Conforme: ${data.nao_conformes}
    </span>
    <span class="stat-item stat-secondary">
      <i class="fas fa-ban"></i> Não se Aplica: ${data.nao_se_aplica}
    </span>
    <span class="stat-item stat-light">
      <i class="far fa-circle"></i> Pendentes: ${data.pendentes}
    </span>
  `;
  
  container.appendChild(statsDiv);
},
/**
 * normalizarDadosProgresso - Normalize progress data to ensure consistent values
 */
normalizarDadosProgresso: function(data) {
    // Default values
    const normalized = {
      total: 0,
      avaliados: 0,
      conformes: 0,
      nao_conformes: 0,
      parcialmente_conformes: 0,
      nao_se_aplica: 0,
      pendentes: 0,
      percentual_progresso: 0,
      error: null
    };
    
    // Merge with provided data
    if (data && typeof data === 'object') {
      // Check for error first
      if (data.error) {
        normalized.error = data.error;
        return normalized;
      }
      
      Object.keys(normalized).forEach(key => {
        if (data[key] !== undefined) {
          normalized[key] = parseInt(data[key]) || 0;
        }
      });
    }
    
    // Ensure pending is calculated correctly
    if (normalized.total > 0) {
      normalized.pendentes = normalized.total - normalized.avaliados - 
                          (data.em_avaliacao || 0);
      
      // Calculate percentage if not provided
      normalized.percentual_progresso = Math.round(
        (normalized.avaliados / normalized.total) * 100
      );
    }
    
    return normalized;
  },
/**
 * Fix for loadSetoresWithSubsectors in ImplantacaoUI
 */
loadSetoresWithSubsectors: function() {
  const unidadeId = document.getElementById('unidadeSelect')?.value;
  const periodoId = document.getElementById('periodoId')?.value;
  
  if (!unidadeId || !periodoId) {
    console.warn("Unidade ID or Periodo ID not available for loading sectors");
    return;
  }
  
  // Add a loading indicator
  const container = document.getElementById('setores-container');
  if (container) {
    container.innerHTML = '<div class="text-center p-3"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Carregando setores...</p></div>';
  }
  
  // Create the API URL with a cache-busting parameter
  const apiUrl = ImplantacaoCRUD.getApiUrl();
  const cacheBuster = Date.now();
  const fullUrl = `${apiUrl}?action=get_setores_with_subsectors&unidade_id=${unidadeId}&_=${cacheBuster}`;
  
  console.log("Loading sectors and subsectors from:", fullUrl);
  
  // Add timeout handling
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
  });
  
  // Make the request with timeout
  Promise.race([
    fetch(fullUrl, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }),
    timeoutPromise
  ])
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    // First check if we have a valid response
    if (!text || text.trim() === '') {
      console.error("Empty response received from server");
      throw new Error('Empty response received from server');
    }
    
    console.log("Raw API response first 200 chars:", text.substring(0, 200));
    
    // As a fallback, if no sectors are found, create dummy data
    if (text.includes("Found 0 sectors")) {
      console.warn("No sectors found, creating dummy data");
      return {
        success: true,
        setores: [
          {
            id: 1,
            nome: "Setor Padrão",
            subsetores: []
          }
        ]
      };
    }
    
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("JSON parsing error:", e);
      console.log("Raw response:", text.substring(0, 500));
      throw new Error(`Failed to parse server response: ${e.message}`);
    }
  })
  .then(data => {
    if (data.error) {
      throw new Error(data.error || 'Unknown error');
    }
    
    if (!data.setores || !Array.isArray(data.setores)) {
      console.warn("API response doesn't contain setores array:", data);
      throw new Error('Invalid response format from server');
    }
    
    // If we have sectors, render them
    renderSetores(data.setores);
  })
  .catch(error => {
    console.error("Error loading sectors:", error);
    
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          Erro ao carregar setores: ${error.message}
        </div>
        <div class="btn-group mt-3">
          <button class="btn btn-primary" onclick="ImplantacaoUI.loadSetoresWithSubsectors()">
            <i class="fas fa-sync-alt me-2"></i>Tentar novamente
          </button>
          <button class="btn btn-outline-secondary" onclick="window.location.reload()">
            <i class="fas fa-redo me-2"></i>Recarregar página
          </button>
        </div>
      `;
    }
  });
},
    
    /**
     * Adiciona uma mini-barra de status ao container
     * @param {HTMLElement} container Container onde a mini-barra será adicionada
     * @param {string} type Tipo de status (success, warning, danger, etc)
     * @param {string} icon Ícone para a barra
     * @param {string} label Nome do status
     * @param {number} value Valor atual
     * @param {number} total Total de itens
     * @param {number} percentage Porcentagem calculada
     */
    adicionarMiniBarraStatus: function(container, type, icon, label, value, total, percentage) {
      const miniBar = document.createElement('div');
      miniBar.className = 'mini-status-bar mb-2';
      miniBar.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
          <div>
            <i class="fas fa-${icon} text-${type} me-1"></i>
            <small>${label}: ${value}/${total}</small>
          </div>
          <small class="text-${type} fw-bold">${percentage}%</small>
        </div>
        <div class="progress" style="height: 10px;">
          <div class="progress-bar bg-${type}" role="progressbar" 
               style="width: ${percentage}%" 
               aria-valuenow="${value}" 
               aria-valuemin="0" 
               aria-valuemax="${total}">
          </div>
        </div>
      `;
      container.appendChild(miniBar);
    },
  
    /**
     * Abre o modal de período
     */
    abrirModalPeriodo: function() {
      const modalElement = document.getElementById('periodoModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },
/**
 * Atualiza apenas uma linha específica no Tabulator após salvar
 * @param {Object} itemData Dados atualizados retornados pelo servidor
 * @param {string} setorId ID do setor/tab
 */
atualizarLinhaTabulatorAposSalvar: function(itemData, setorId) {
  // Verificar se temos uma tabela Tabulator válida
  const table = this.state.tabulatorTables[setorId];
  if (!table) {
    console.warn(`Tabela Tabulator não encontrada para o setor: ${setorId}`);
    return false;
  }
  
  console.log("Dados recebidos para atualização:", itemData);
  
  // Primeiro, procure a linha pelo ID do item original
  const itemOriginalId = itemData.item_id ? parseInt(itemData.item_id) : (itemData.id ? parseInt(itemData.id) : null);
  if (!itemOriginalId) {
    console.warn("ID do item não encontrado nos dados retornados:", itemData);
    return false;
  }
  
  // Buscar a linha pelo ID do item
  let row = table.getRow(itemOriginalId);
  
  if (row) {
    console.log("Linha encontrada, atualizando:", itemOriginalId);
    
    // Obter dados atuais da linha
    const dadosAtuais = row.getData();
    console.log("Dados atuais da linha:", dadosAtuais);
    
    // Preparar dados para atualização
    // IMPORTANTE: Preservar o ID do item original para não perder a referência
    // Note: Changed 'statu' to 'avaliacao_resultado' here or make sure to handle both
    let status = itemData.avaliacao_resultado || itemData.status || '';
    let naoSeAplica = parseInt(itemData.nao_se_aplica || 0);
    
    let statusInfo = this.getStatusInfo(status, naoSeAplica);
    
    // Criando o objeto de atualização com os dados corretos
    const rowData = {
      // Preservar ID original para manter a referência na tabela
      id: dadosAtuais.id,
      // Atualizar o campo de status com o novo valor
      status: status,
      // Garantir que sejam números para consistência
      nao_aplica: naoSeAplica,
      // Garantir que temos o ID do diagnóstico
      diagnostico_id: itemData.diagnostico_id ? parseInt(itemData.diagnostico_id) : 
                     (itemData.id ? parseInt(itemData.id) : dadosAtuais.diagnostico_id),
      // Atualizar observações
      observacoes: itemData.observacoes || "",
      // Atualizar informações visuais de status
      status_desc: statusInfo.desc,
      status_class: statusInfo.class,
      status_icon: statusInfo.icon,
      // Atualizar o estado de avaliação
      estado_avaliacao: 'avaliado'
    };
    
    console.log("Novos dados para a linha:", rowData);
    
    // Atualizar a linha
    row.update(rowData);
    
    // Aguardar um momento e redesenhar a linha para garantir atualização dos botões
    setTimeout(() => {
      try {
        // Forçar redesenho da linha
        row.reformat();
        // Forçar redesenho da tabela (opcional, pode ser necessário em alguns casos)
        table.redraw(false);
      } catch (err) {
        console.error("Erro ao redesenhar linha/tabela:", err);
      }
    }, 100);
    
    // Adicionar efeito visual para a linha atualizada
    const el = row.getElement();
    
    // Adicionar estilo para animação se não existir
    if (!document.getElementById('row-update-style')) {
      const style = document.createElement('style');
      style.id = 'row-update-style';
      style.textContent = `
        @keyframes pulse-highlight {
          0% { background-color: transparent; }
          30% { background-color: rgba(56, 189, 248, 0.2); }
          100% { background-color: transparent; }
        }
        .row-updated {
          animation: pulse-highlight 1.5s ease;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Aplicar classe de animação
    el.classList.add('row-updated');
    
    // Remover classe após animação
    setTimeout(() => {
      el.classList.remove('row-updated');
    }, 1500);
    
    return true;
  } else {
    console.warn("Linha não encontrada na tabela pelo ID:", itemOriginalId);
    return false;
  }
},
  
/**
 * Obtém informações de formatação do status para uso no Tabulator
 * @param {string} status Status do item
 * @param {number|boolean} naoSeAplica Flag indicando se não se aplica
 * @returns {Object} Objeto com informações de formatação
 */
getStatusInfo: function(status, naoSeAplica) {
  // Converter para número se for string
  if (typeof naoSeAplica === 'string') {
    naoSeAplica = parseInt(naoSeAplica) === 1;
  }
  
  // Garantir que status seja uma string válida
  status = status || '';
  
  if (naoSeAplica === true || naoSeAplica === 1) {
    return {
      desc: 'Não se aplica',
      class: 'bg-secondary',
      icon: 'ban'
    };
  } else if (status === 'conforme') {
    return {
      desc: 'Conforme',
      class: 'bg-success',
      icon: 'check-circle'
    };
  } else if (status === 'nao_conforme') {
    return {
      desc: 'Não Conforme',
      class: 'bg-danger',
      icon: 'times-circle'
    };
  } else if (status === 'parcialmente_conforme') {
    return {
      desc: 'Parcialmente Conforme',
      class: 'bg-warning',
      icon: 'exclamation-circle'
    };
  } else {
    return {
      desc: 'Pendente',
      class: 'bg-light text-dark',
      icon: 'circle'
    };
  }
},
/**
 * Abre o modal de avaliação para um item
 * @param {number} itemId ID do item
 * @param {string} itemName Nome do item
 * @param {string} sectorName Nome do setor
 * @param {number} periodId ID do período
 * @param {number} unitId ID da unidade
 * @param {number} sectorId ID do setor
 * @param {number|null} diagnosticId ID do diagnóstico (opcional)
 */
abrirModalAvaliacao: function(itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId = null) {
  console.log("Abrindo modal de avaliação para:", {
      itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId
  });
  
  // Verificar se o modal existe
  const modalElement = document.getElementById('evaluationModal');
  if (!modalElement) {
      this.mostrarToast('error', 'Modal de avaliação não encontrado na página');
      return;
  }
  
  // Verificar se o formulário existe dentro do modal
  const formContainer = modalElement.querySelector('.modal-body');
  if (!formContainer) {
      this.mostrarToast('error', 'Container do formulário não encontrado no modal');
      return;
  }
  
  // Mostrar indicador de carregamento enquanto preparamos o formulário
  formContainer.innerHTML = `
      <div class="d-flex justify-content-center my-5">
          <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
          </div>
      </div>
  `;
  
  // Atualizar título do modal
  const modalTitle = document.getElementById('evaluationModalLabel');
  if (modalTitle) {
      modalTitle.textContent = diagnosticId ? 'Editar Avaliação' : 'Nova Avaliação';
  }
  
  // Construir o HTML do formulário com os dados iniciais (incluindo área de feedback)
  const formHtml = `
      <form id="evaluationForm">
          <!-- Área de feedback -->
          <div id="formFeedback" class="d-none alert mb-3"></div>
          
          <!-- Campos ocultos -->
          <input type="hidden" id="item_id" name="item_id" value="${itemId || ''}">
          <input type="hidden" id="item_name" name="item_name" value="${this.escaparString(itemName) || ''}">
          <input type="hidden" id="setor_name" name="setor_name" value="${this.escaparString(sectorName) || ''}">
          <input type="hidden" id="periodo_id" name="periodo_id" value="${periodId || ''}">
          <input type="hidden" id="unidade_id" name="unidade_id" value="${unitId || ''}">
          <input type="hidden" id="setor_id" name="setor_id" value="${sectorId || ''}">
          <input type="hidden" id="diagnostico_id" name="diagnostico_id" value="${diagnosticId || ''}">
          
          <!-- Nome do item -->
          <div class="mb-3">
              <h5 id="item_name_display" class="text-primary">${this.escaparString(itemName) || 'Item'}</h5>
          </div>
          
          <!-- Status -->
          <div class="mb-3">
              <label class="form-label">Status:</label>
              <div class="form-check">
                  <input class="form-check-input" type="radio" name="status" id="conforme" value="conforme">
                  <label class="form-check-label" for="conforme">Conforme</label>
              </div>
              <div class="form-check">
                  <input class="form-check-input" type="radio" name="status" id="parcialmente_conforme" value="parcialmente_conforme">
                  <label class="form-check-label" for="parcialmente_conforme">Parcialmente Conforme</label>
              </div>
              <div class="form-check">
                  <input class="form-check-input" type="radio" name="status" id="nao_conforme" value="nao_conforme">
                  <label class="form-check-label" for="nao_conforme">Não Conforme</label>
              </div>
              <div class="form-check mt-2">
                  <input class="form-check-input" type="checkbox" id="nao_se_aplica" name="nao_se_aplica">
                  <label class="form-check-label" for="nao_se_aplica">Não se aplica</label>
              </div>
          </div>
          
          <!-- Observações -->
          <div class="mb-3">
              <label for="observacoes" class="form-label">Observações:</label>
              <textarea class="form-control" id="observacoes" name="observacoes" rows="3"></textarea>
          </div>
      </form>
  `;
  
  // Inserir o formulário no modal
  formContainer.innerHTML = formHtml;
  
  // Configurar evento para o checkbox "Não se aplica"
  const naoAplicaCheckbox = document.getElementById('nao_se_aplica');
  if (naoAplicaCheckbox) {
      naoAplicaCheckbox.addEventListener('change', function() {
          const statusRadios = document.querySelectorAll('input[name="status"]');
          statusRadios.forEach(radio => {
              radio.disabled = this.checked;
              if (this.checked) {
                  radio.checked = false;
              }
          });
      });
  }
  
  // Se tiver ID de diagnóstico, carregar dados existentes
  if (diagnosticId) {
      console.log(`Carregando dados do diagnóstico ID: ${diagnosticId}`);
      
      // Mostrar feedback no próprio formulário em vez de uma notificação
      this.mostrarFeedbackNoFormulario('info', 'Carregando dados...');
      
      // Carregar dados do diagnóstico
      ImplantacaoCRUD.obterDiagnostico(diagnosticId)
          .then(data => {
              console.log("Dados do diagnóstico recebidos:", data);
              
              // Limpar feedback
              this.limparFeedbackNoFormulario();
              
              if (data.error) {
                  console.error("Erro ao carregar diagnóstico:", data.error);
                  this.mostrarFeedbackNoFormulario('error', `Erro ao carregar dados: ${data.error}`);
                  return;
              }
              
              try {
                  // Preencher campos ocultos
                  this.definirValorSeguro('diagnostico_id', data.id || diagnosticId);
                  
                  // Preencher campos visíveis
                  this.definirValorSeguro('observacoes', data.observacoes || '');
                  
                  // Definir o status selecionado
                  if (data.nao_se_aplica == 1) {
                      this.definirCheckboxSeguro('nao_se_aplica', true);
                      
                      // Desabilitar os radios de status
                      document.querySelectorAll('input[name="status"]').forEach(radio => {
                          radio.disabled = true;
                      });
                  } else if (data.statu) {
                      this.definirRadioSeguro(data.statu, true);
                  }
                  
                  // Adicionar efeito sutil para indicar carregamento bem-sucedido
                  this.destacarFormulario();
                  
                  console.log("Formulário preenchido com sucesso");
              } catch (e) {
                  console.error("Erro ao preencher formulário:", e);
                  this.mostrarFeedbackNoFormulario('error', `Erro ao preencher formulário: ${e.message}`);
              }
          })
          .catch(error => {
              console.error("Erro ao carregar diagnóstico:", error);
              this.mostrarFeedbackNoFormulario('error', `Erro ao carregar diagnóstico: ${error.message}`);
              
              // Resetar o formulário em caso de erro
              if (document.getElementById('diagnostico_id')) {
                  document.getElementById('diagnostico_id').value = '';
              }
          });
  }
  
  // Exibir o modal
  try {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
  } catch (e) {
      console.error("Erro ao exibir modal:", e);
      this.mostrarToast('error', `Erro ao exibir modal: ${e.message}`);
  }
},
/**
 * Mostra feedback dentro do formulário
 * @param {string} tipo Tipo de feedback (success, error, warning, info)
 * @param {string} mensagem Mensagem de feedback
 */
mostrarFeedbackNoFormulario: function(tipo, mensagem) {
  const feedbackArea = document.getElementById('formFeedback');
  if (!feedbackArea) return;
  
  // Mapear tipo para classes Bootstrap
  const classes = {
      success: 'alert-success',
      error: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info'
  };
  
  // Mapear tipo para ícones
  const icons = {
      success: '<i class="fas fa-check-circle me-2"></i>',
      error: '<i class="fas fa-exclamation-circle me-2"></i>',
      warning: '<i class="fas fa-exclamation-triangle me-2"></i>',
      info: '<i class="fas fa-info-circle me-2"></i>'
  };
  
  // Atualizar conteúdo e classes
  feedbackArea.className = `alert ${classes[tipo] || 'alert-info'}`;
  feedbackArea.innerHTML = `${icons[tipo] || ''}${mensagem}`;
  feedbackArea.classList.remove('d-none');
  
  // Auto-ocultar após alguns segundos para tipos success e info
  if (tipo === 'success' || tipo === 'info') {
      setTimeout(() => {
          this.limparFeedbackNoFormulario();
      }, 3000);
  }
},

/**
* Limpa a área de feedback no formulário
*/
limparFeedbackNoFormulario: function() {
  const feedbackArea = document.getElementById('formFeedback');
  if (!feedbackArea) return;
  
  // Adicionar animação de saída
  feedbackArea.style.opacity = '0';
  feedbackArea.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
      feedbackArea.classList.add('d-none');
      feedbackArea.innerHTML = '';
      feedbackArea.style.opacity = '1';
  }, 300);
},

/**
* Adiciona um efeito de destaque ao formulário
*/
destacarFormulario: function() {
  const form = document.getElementById('evaluationForm');
  if (!form) return;
  
  // Adicionar classe para animação
  form.classList.add('highlight-pulse');
  
  // Adicionar estilo se não existir
  if (!document.getElementById('form-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'form-highlight-style';
      style.textContent = `
          @keyframes highlight-pulse {
              0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
              50% { box-shadow: 0 0 0 8px rgba(13, 110, 253, 0.15); }
              100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
          }
          .highlight-pulse {
              animation: highlight-pulse 1s ease;
          }
      `;
      document.head.appendChild(style);
  }
  
  // Remover classe após animação
  setTimeout(() => {
      form.classList.remove('highlight-pulse');
  }, 1000);
},
/**
 * Define o valor de um elemento com segurança, verificando se ele existe
 * @param {string} elementId ID do elemento
 * @param {string|number} valor Valor a definir
 * @returns {boolean} True se bem-sucedido, false se o elemento não existir
 */
definirValorSeguro: function(elementId, valor) {
  const elemento = document.getElementById(elementId);
  if (!elemento) {
      console.warn(`Elemento ${elementId} não encontrado no DOM`);
      return false;
  }
  
  if ('value' in elemento) {
      elemento.value = valor;
  } else if ('textContent' in elemento) {
      elemento.textContent = valor;
  } else {
      console.warn(`Não foi possível definir valor para ${elementId}`);
      return false;
  }
  
  return true;
},

/**
* Define o estado de um checkbox com segurança
* @param {string} elementId ID do checkbox
* @param {boolean} checked Estado para definir
* @returns {boolean} True se bem-sucedido
*/
definirCheckboxSeguro: function(elementId, checked) {
  const elemento = document.getElementById(elementId);
  if (!elemento || elemento.type !== 'checkbox') {
      console.warn(`Checkbox ${elementId} não encontrado`);
      return false;
  }
  
  elemento.checked = checked;
  return true;
},

/**
* Define um radio button como selecionado
* @param {string} value Valor do radio button a selecionar
* @param {boolean} checked Estado para definir
* @returns {boolean} True se bem-sucedido
*/
definirRadioSeguro: function(value, checked) {
  const radio = document.getElementById(value);
  if (radio && radio.type === 'radio') {
      radio.checked = checked;
      return true;
  }
  
  // Tentar encontrar por seletor de atributo
  const radioByValue = document.querySelector(`input[type="radio"][value="${value}"]`);
  if (radioByValue) {
      radioByValue.checked = checked;
      return true;
  }
  
  console.warn(`Radio com valor ${value} não encontrado`);
  return false;
},
  
    /**
     * Limpa o formulário de avaliação
     */
    limparFormularioAvaliacao: function() {
      // Limpar status
      const statusRadios = document.querySelectorAll('input[name="status"]');
      statusRadios.forEach(radio => {
        radio.checked = false;
        radio.disabled = false;
      });
  
      // Limpar checkbox "Não se aplica"
      const naoAplicaCheckbox = document.getElementById('nao_se_aplica');
      if (naoAplicaCheckbox) {
        naoAplicaCheckbox.checked = false;
      }
  
      // Limpar campo de observações
      const observacoesField = document.getElementById('observacoes');
      if (observacoesField) {
        observacoesField.value = '';
      }
  
      // Limpar campos ocultos
      const hiddenFields = ['item_id', 'item_name', 'setor_name', 'periodo_id', 'unidade_id', 'setor_id', 'diagnostico_id'];
      hiddenFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
      });
    },
/**
 * Salva a avaliação do item no banco de dados
 */
salvarAvaliacao: function() {
  // Obter valores do formulário com validação
  let itemId, itemName, setorName, periodoId, unidadeId, setorId, diagnosticoId, observacoes, naoSeAplica;
  
  try {
      // Obter valores com tratamento de erro para cada campo
      itemId = this.obterValorSeguro('item_id', '');
      itemName = this.obterValorSeguro('item_name', '');
      setorName = this.obterValorSeguro('setor_name', '');
      periodoId = this.obterValorSeguro('periodo_id', '');
      unidadeId = this.obterValorSeguro('unidade_id', '');
      setorId = this.obterValorSeguro('setor_id', '');
      diagnosticoId = this.obterValorSeguro('diagnostico_id', '');
      observacoes = this.obterValorSeguro('observacoes', '');
      naoSeAplica = this.obterCheckboxSeguro('nao_se_aplica') ? 1 : 0;
  } catch (e) {
      console.error("Erro ao obter valores do formulário:", e);
      this.mostrarFeedbackNoFormulario('error', 'Erro ao obter valores do formulário: ' + e.message);
      return;
  }
  
  // Verificar valores críticos
  if (!itemId) {
      this.mostrarFeedbackNoFormulario('warning', 'ID do item não informado');
      return;
  }
  
  if (!periodoId || !unidadeId || !setorId) {
      this.mostrarFeedbackNoFormulario('warning', 'Dados do diagnóstico incompletos (período, unidade ou setor)');
      return;
  }
  
  // Obter status selecionado
  let status = '';
  document.querySelectorAll('input[name="status"]').forEach(radio => {
      if (radio.checked) {
          status = radio.value;
      }
  });
  
  // Validar status
  if (!naoSeAplica && !status) {
      this.mostrarFeedbackNoFormulario('warning', 'Selecione um status para o item ou marque como "Não se aplica"');
      
      // Destacar área de status
      const statusArea = document.querySelector('input[name="status"]').closest('.mb-3');
      if (statusArea) {
          statusArea.classList.add('border', 'border-warning', 'p-2', 'rounded');
          
          setTimeout(() => {
              statusArea.classList.remove('border', 'border-warning', 'p-2', 'rounded');
          }, 2000);
      }
      
      return;
  }
  
  // Preparar dados para envio
  const dadosItem = {
      item_id: itemId,
      item: itemName,
      status: status,
      observacoes: observacoes,
      nao_se_aplica: naoSeAplica,
      setor_id: setorId,
      unidade_id: unidadeId,
      periodo_id: periodoId,
      action: 'save_evaluation'
  };
  
  if (diagnosticoId) {
      dadosItem.diagnostico_id = diagnosticoId;
  }
  
  console.log("Salvando avaliação:", dadosItem);
  
  // Desabilitar o botão de salvar para evitar cliques múltiplos
  const saveButton = document.querySelector('#evaluationModal .btn-primary');
  const originalButtonHTML = saveButton ? saveButton.innerHTML : '';
  const originalButtonClass = saveButton ? saveButton.className : '';
  
  if (saveButton) {
      saveButton.disabled = true;
      saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
  }
  
  // Mostrar feedback no formulário
  this.mostrarFeedbackNoFormulario('info', 'Salvando dados...');
  
  // Enviar dados para o servidor
  ImplantacaoCRUD.salvarItem(dadosItem)
      .then(response => {
          console.log("Resposta do servidor:", response);
          
          if (response.status === 'Sucesso' || response.success === true) {
              // Atualização bem-sucedida - mostrar feedback no formulário
              this.mostrarFeedbackNoFormulario('success', 'Avaliação salva com sucesso!');
              
              // Destacar botão de sucesso temporariamente
              if (saveButton) {
                  saveButton.innerHTML = '<i class="fas fa-check me-1"></i> Salvo';
                  saveButton.classList.remove('btn-primary');
                  saveButton.classList.add('btn-success');
              }
              
              // Criar objeto de item atualizado para passar para a função de atualização
              const itemAtualizado = {
                  id: response.diagnostico_id || diagnosticoId,
                  item_id: itemId,
                  statu: status,
                  observacoes: observacoes,
                  nao_se_aplica: naoSeAplica,
                  estado_avaliacao: 'avaliado' // Importante: marcar como avaliado
              };
              
              // Aguardar um pouco para o usuário ver a mensagem de sucesso
              setTimeout(() => {
                  // Fechar o modal
                  const modal = bootstrap.Modal.getInstance(document.getElementById('evaluationModal'));
                  if (modal) {
                      modal.hide();
                  }
                  
                  try {
                      // Tentar atualizar apenas a linha específica
                      const atualizouLinha = this.atualizarLinhaTabulatorAposSalvar(itemAtualizado, setorName);
                      
                      // Se não conseguiu atualizar a linha específica, recarregar a tabela inteira
                      if (!atualizouLinha) {
                          console.log("Não foi possível atualizar a linha específica. Recarregando a tabela inteira.");
                          const tabulator = this.state.tabulatorTables[setorName];
                          if (tabulator) {
                              tabulator.replaceData();
                          }
                      }
                      
                      // Atualizar a barra de progresso
                      this.atualizarBarraProgressoComAnimacao(setorName);
                      
                      // Mostrar uma única notificação discreta após o modal fechar
                      this.mostrarToast('success', 'Item avaliado com sucesso', {
                          timeOut: 2000,
                          positionClass: "toast-bottom-right",
                          progressBar: true
                      });
                      
                      // CORREÇÃO: Restaurar estado original do botão para futuras interações
                      if (saveButton) {
                          setTimeout(() => {
                              saveButton.disabled = false;
                              saveButton.innerHTML = originalButtonHTML || 'Salvar';
                              saveButton.className = originalButtonClass || 'btn btn-primary';
                          }, 100);
                      }
                  } catch (e) {
                      console.error("Erro ao atualizar tabela:", e);
                      this.mostrarToast('error', 'Erro ao atualizar a tabela: ' + e.message);
                  }
              }, 800);
          } else {
              // Mostrar mensagem de erro no formulário
              this.mostrarFeedbackNoFormulario('error', response.message || 'Erro ao salvar a avaliação.');
              
              // Restaurar botão
              if (saveButton) {
                  saveButton.disabled = false;
                  saveButton.innerHTML = originalButtonHTML || 'Salvar';
                  saveButton.className = originalButtonClass || 'btn btn-primary';
              }
          }
      })
      .catch(error => {
          console.error("Erro ao salvar avaliação:", error);
          this.mostrarFeedbackNoFormulario('error', 'Erro ao salvar avaliação: ' + error.message);
          
          // Restaurar botão
          if (saveButton) {
              saveButton.disabled = false;
              saveButton.innerHTML = originalButtonHTML || 'Salvar';
              saveButton.className = originalButtonClass || 'btn btn-primary';
          }
      });
},

/**
* Obtém o valor de um elemento com segurança
* @param {string} elementId ID do elemento
* @param {*} valorPadrao Valor padrão se o elemento não for encontrado
* @returns {*} Valor do elemento ou valor padrão
*/
obterValorSeguro: function(elementId, valorPadrao = '') {
  const elemento = document.getElementById(elementId);
  if (!elemento) {
      console.warn(`Elemento ${elementId} não encontrado para obter valor. Usando padrão.`);
      return valorPadrao;
  }
  
  return elemento.value || valorPadrao;
},

/**
* Verifica se um checkbox está marcado
* @param {string} elementId ID do checkbox
* @returns {boolean} Estado do checkbox
*/
obterCheckboxSeguro: function(elementId) {
  const elemento = document.getElementById(elementId);
  if (!elemento || elemento.type !== 'checkbox') {
      console.warn(`Checkbox ${elementId} não encontrado. Assumindo desmarcado.`);
      return false;
  }
  
  return elemento.checked;
},
  verificarToastr: function() {
    if (typeof toastr === 'undefined') {
      console.warn("Toastr não está disponível. Verificando se jQuery está carregado...");
      
      if (typeof jQuery === 'undefined') {
        console.error("jQuery não está carregado. Toastr não pode ser inicializado.");
        return false;
      }
      
      // Tentar carregar Toastr dinamicamente se jQuery estiver disponível
      const toastrScript = document.createElement('script');
      toastrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js';
      toastrScript.async = true;
      
      const toastrCSS = document.createElement('link');
      toastrCSS.rel = 'stylesheet';
      toastrCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css';
      
      document.head.appendChild(toastrCSS);
      document.head.appendChild(toastrScript);
      
      console.log("Tentando carregar Toastr dinamicamente...");
      return false;
    }
    
    // Se toastr existe mas não foi configurado
    if (!toastr.options || Object.keys(toastr.options).length === 0) {
      this.configurarToastr();
    }
    
    return true;
  },
  
    /**
     * Exibe ou oculta o formulário para adicionar novo item
     * @param {string} setorSafe ID do setor
     */
    alternarNovoItem: function(setorSafe) {
      var container = document.getElementById("newItemContainer_" + setorSafe);
      var btn = document.getElementById("toggleButton_" + setorSafe);
      
      if (!container || !btn) return;
      
      if (container.style.display === "none" || container.style.display === "") {
        container.style.display = "block";
        btn.innerHTML = '<i class="fas fa-minus-circle me-1"></i> Cancelar adição';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-danger');
        
        container.classList.add('fade-in');
      } else {
        container.style.display = "none";
        btn.innerHTML = '<i class="fas fa-plus-circle me-1"></i> Adicionar novo item';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-secondary');
        
        // Limpar os campos do formulário
        if (document.getElementById("new_item_name_" + setorSafe)) {
          document.getElementById("new_item_name_" + setorSafe).value = '';
        }
        if (document.getElementById("new_observacoes_" + setorSafe)) {
          document.getElementById("new_observacoes_" + setorSafe).value = '';
        }
        
        // Desmarcar os radios
        var radios = document.getElementsByName("radio_new_" + setorSafe);
        for (var i = 0; i < radios.length; i++) {
          radios[i].checked = false;
        }
      }
    },
  
    /**
     * Salva um novo item criado pelo usuário
     * @param {string} setorSafe ID do setor
     * @param {number} setorId ID do setor no banco de dados
     */
    salvarNovoItem: function(setorSafe, setorId) {
      var unidade = document.getElementById("unidadeSelect").value;
      var periodo = document.getElementById("periodoId").value;
      var item = document.getElementById("new_item_name_" + setorSafe).value;
      var radios = document.getElementsByName("radio_new_" + setorSafe);
      var statu = "";
      var naoSeAplica = 0;
      
      // Validações
      if (item.trim() === "") {
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Informe o nome do novo item.',
          confirmButtonText: 'Ok'
        });
        return;
      }
      
      // Verificar se alguma opção foi selecionada
      var statusSelecionado = false;
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          statu = radios[i].value;
          statusSelecionado = true;
          break;
        }
      }
      
      // Se nenhum status foi selecionado, marcar como "Não se aplica"
      if (!statusSelecionado) {
        naoSeAplica = 1;
      }
      
      // Obter o valor do campo de observações
      var observacoesElement = document.getElementById("new_observacoes_" + setorSafe);
      var observacoes = observacoesElement ? (observacoesElement.value || "") : "";
  
      // Mostrar carregamento
      var saveBtn = document.querySelector('#newItemForm_' + setorSafe + ' .btn-primary');
      var originalBtnText = saveBtn ? saveBtn.innerHTML : '';
      
      if (saveBtn) {
        saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        saveBtn.disabled = true;
      }
  
      // Dados para a requisição
      const dadosNovoItem = {
        action: 'save_item',
        unidade_id: unidade,
        id_periodo_diagnostico: periodo,
        item: item,
        setor_id: setorId,
        statu: statu,
        observacoes: observacoes,
        nao_se_aplica: naoSeAplica,
        setor: setorSafe
      };
      
      // Enviar requisição
      ImplantacaoCRUD.salvarNovoItem(dadosNovoItem)
        .then(data => {
          // Restaurar o botão
          if (saveBtn) {
            saveBtn.innerHTML = originalBtnText;
            saveBtn.disabled = false;
          }
          
          // Se a operação foi bem-sucedida
          const isSuccess = data.status === 'Salvo' || data.status === 'Atualizado' || 
                        data.message?.includes('sucesso') || data.success === true;
          
          if (isSuccess) {
            // Limpar valores do formulário
            document.getElementById("new_item_name_" + setorSafe).value = '';
            document.getElementById("new_observacoes_" + setorSafe).value = '';
            
            // Desmarcar radios
            for (var i = 0; i < radios.length; i++) {
              radios[i].checked = false;
            }
            
            // Esconder o formulário de novo item
            this.alternarNovoItem(setorSafe);
            
            // Recarregar a tabela Tabulator
            if (this.state.tabulatorTables[setorSafe]) {
              this.state.tabulatorTables[setorSafe].setData();
            }
            
            // Atualizar a barra de progresso
            this.atualizarBarraProgressoComAnimacao(setorSafe);
            
            // Mostrar notificação de sucesso
            this.mostrarToast('success', 'Novo item adicionado com sucesso!');
          } else {
            this.mostrarToast('error', data?.message || 'Erro ao adicionar o item');
          }
        })
        .catch(error => {
          console.error("Erro ao salvar novo item:", error);
          this.mostrarToast('error', 'Erro ao salvar o item: ' + error.message);
          
          // Restaurar o botão
          if (saveBtn) {
            saveBtn.innerHTML = originalBtnText;
            saveBtn.disabled = false;
          }
        });
    },
  
    /**
     * Abre o modal para editar itens salvos
     * @param {string} setorSafe ID seguro do setor
     * @param {number} setorId ID do setor no banco de dados
     */
    editarItensSalvos: function(setorSafe, setorId) {
      var unidade = document.getElementById("unidadeSelect").value;
      var periodo = document.getElementById("periodoId").value;
      
      if (!unidade || !periodo) {
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Unidade ou período não definidos.',
          confirmButtonText: 'Ok'
        });
        return;
      }
      
      // Verificar se o modal existe, e criar se não existir
      var modal = document.getElementById('savedItemsModal');
      if (!modal) {
        console.error("Modal não encontrado para exibição de itens salvos");
        return;
      }
      
      // Armazenar TODOS os parâmetros no modal para uso futuro
      modal.setAttribute('data-setor-id', setorId);
      modal.setAttribute('data-setor-safe', setorSafe);
      modal.setAttribute('data-unidade', unidade);
      modal.setAttribute('data-periodo', periodo);
      
      // Definir o título do modal
      var modalTitle = modal.querySelector('.modal-title');
      if (modalTitle) {
        // Converter underscores para espaços para um título mais legível
        var setorNome = setorSafe.replace(/_/g, ' ');
        modalTitle.textContent = 'Itens Salvos - ' + setorNome;
      }
      
      // Obter o container da tabela
      var tableContainer = document.getElementById('savedItemsTableContainer');
      if (!tableContainer) {
        console.error("Container da tabela não encontrado mesmo após criar o modal");
        return;
      }
      
      // Mostrar indicador de carregamento
      tableContainer.innerHTML = `
        <div class="text-center p-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="mt-2">Carregando itens salvos...</p>
        </div>
      `;
      
      // Abrir o modal
      var bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      
      // Carregar os itens salvos
      ImplantacaoCRUD.carregarItensSalvos(setorSafe, setorId, unidade, periodo)
        .then(html => {
          tableContainer.innerHTML = html;
        })
        .catch(error => {
          console.error("Erro ao carregar itens salvos:", error);
          tableContainer.innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Erro ao carregar os itens: ${error.message}
            </div>
          `;
        });
    },
  
    /**
     * Atualiza a lista de itens salvos a partir do modal
     */
    atualizarItensSalvosDoModal: function() {
      var modal = document.getElementById('savedItemsModal');
      if (!modal) {
        console.error("Modal não encontrado para atualização");
        return;
      }
      
      var setorId = modal.getAttribute('data-setor-id');
      var setorSafe = modal.getAttribute('data-setor-safe');
      var unidade = modal.getAttribute('data-unidade');
      var periodo = modal.getAttribute('data-periodo');
      
      if (!setorId || !setorSafe || !unidade || !periodo) {
        // Tentativa de recuperar valores faltantes
        if (!unidade) unidade = document.getElementById("unidadeSelect")?.value;
        if (!periodo) periodo = document.getElementById("periodoId")?.value;
        
        if (!setorId || !setorSafe || !unidade || !periodo) {
          this.mostrarToast('error', 'Parâmetros incompletos. Por favor, feche e reabra o modal.');
          return;
        }
      }
      
      // Atualizar o container
      var tableContainer = document.getElementById('savedItemsTableContainer');
      if (tableContainer) {
        tableContainer.innerHTML = `
          <div class="text-center p-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Atualizando lista de itens...</p>
          </div>
        `;
        
        // Carregar os itens salvos
        ImplantacaoCRUD.carregarItensSalvos(setorSafe, setorId, unidade, periodo)
          .then(html => {
            tableContainer.innerHTML = html;
          })
          .catch(error => {
            console.error("Erro ao atualizar itens salvos:", error);
            tableContainer.innerHTML = `
              <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Erro ao atualizar os itens: ${error.message}
              </div>
            `;
          });
      }
    },
    
  
    /**
     * Abre o modal para editar um item específico
     * @param {number} itemId ID do item no banco de dados
     * @param {string} itemName Nome do item
     * @param {string} status Status atual do item
     * @param {string} observacoes Observações atuais do item
     * @param {number} naoSeAplica Flag indicando se o item não se aplica
     */
    editarItem: function(itemId, itemName, status, observacoes, naoSeAplica) {
      // Garantir que itemId seja um número ou string
      if (itemId === undefined || itemId === null) {
        console.error("ID do item não definido");
        return;
      }
      
      // Garantir tipos de dados corretos
      itemName = itemName || "";
      status = status || "";
      observacoes = observacoes || "";
      
      // Converter naoSeAplica para número e depois para booleano
      naoSeAplica = parseInt(naoSeAplica) === 1;
      
      // Garantir que todos os elementos existem antes de usá-los
      var idInput = document.getElementById('edit_item_id');
      var nameInput = document.getElementById('edit_item_name');
      var displayEl = document.getElementById('edit_item_display');
      var obsInput = document.getElementById('edit_observacoes');
      var naoSeAplicaCheckbox = document.getElementById('edit_nao_se_aplica');
      var conformeRadio = document.getElementById('edit_conforme');
      var naoConformeRadio = document.getElementById('edit_nao_conforme');
      var parcialRadio = document.getElementById('edit_parcialmente_conforme');
      
      if (!idInput || !nameInput || !displayEl || !obsInput || !naoSeAplicaCheckbox || 
          !conformeRadio || !naoConformeRadio || !parcialRadio) {
        console.error("Elementos do formulário não encontrados");
        return;
      }
      
      // Preencher o formulário do modal
      idInput.value = itemId;
      nameInput.value = itemName;
      displayEl.textContent = itemName;
      obsInput.value = observacoes;
      
      // Selecionar o checkbox "Não se aplica"
      naoSeAplicaCheckbox.checked = naoSeAplica;
      
      // Selecionar o status correto, se "Não se aplica" não estiver marcado
      if (!naoSeAplica) {
        conformeRadio.checked = (status === 'conforme');
        naoConformeRadio.checked = (status === 'nao_conforme');
        parcialRadio.checked = (status === 'parcialmente_conforme');
      } else {
        // Se for "Não se aplica", desmarcar todos os status
        conformeRadio.checked = false;
        naoConformeRadio.checked = false;
        parcialRadio.checked = false;
      }
      
      // Desabilitar radios se "Não se aplica" estiver marcado
      this.alternarStatusRadios(naoSeAplica);
      
      // Mostrar o modal
      var modalElement = document.getElementById('editItemModal');
      if (modalElement) {
        try {
          var modal = new bootstrap.Modal(modalElement);
          modal.show();
        } catch (e) {
          console.error("Erro ao abrir modal:", e);
          this.mostrarToast('error', 'Erro ao abrir modal: ' + e.message);
        }
      }
    },
  
    /**
     * Alterna a visibilidade dos radios de status
     * @param {boolean} desativar True para desativar os radios
     */
    alternarStatusRadios: function(desativar) {
      const statusRadios = document.querySelectorAll('input[name="edit_status"]');
      statusRadios.forEach(radio => {
        radio.disabled = desativar;
      });
    },
    /**
 * Salva um novo item criado pelo usuário
 * @param {string} setorSafe ID do setor
 * @param {number} setorId ID do setor no banco de dados
 */
 saveNewItem:function(setorSafe, setorId) {
  var unidade = document.getElementById("unidadeSelect").value;
  var periodo = document.getElementById("periodoId").value;
  var item = document.getElementById("new_item_name_" + setorSafe).value;
  var radios = document.getElementsByName("radio_new_" + setorSafe);
  var statu = "";
  var naoSeAplica = 0;
  
  // Validações
  if (item.trim() === "") {
    alert("Informe o nome do novo item.");
    return;
  }
  
  // Verificar se alguma opção foi selecionada
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      statu = radios[i].value;
      break;
    }
  }
  
  // Obter o valor do campo de observações
  var observacoes = document.getElementById("new_observacoes_" + setorSafe).value || "";

  // Mostrar carregamento
  var saveBtn = document.querySelector('#newItemForm_' + setorSafe + ' .btn-primary');
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Salvando...';
  }

  // Dados para a requisição
  var formData = new FormData();
  formData.append('action', 'save_item');
  formData.append('unidade_id', unidade);
  formData.append('id_periodo_diagnostico', periodo);
  formData.append('item', item);
  formData.append('setor_id', setorId);
  formData.append('status', statu);
  formData.append('observacoes', observacoes);
  formData.append('nao_se_aplica', naoSeAplica ? 1 : 0);
  formData.append('setor', setorSafe);
  
  // Enviar requisição
  fetch(ImplantacaoCRUD.getApiUrl(), {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    return response.text();
  })
  .then(function(text) {
    // Restaurar o botão
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Salvar';
    }
    
    var data;
    try {
      data = JSON.parse(text);
    } catch(e) {
      data = { status: text.indexOf('sucesso') >= 0 ? 'Sucesso' : 'Erro', message: text };
    }
    
    if (data.status === 'Sucesso' || data.success === true) {
      // Limpar formulário
      document.getElementById("new_item_name_" + setorSafe).value = '';
      document.getElementById("new_observacoes_" + setorSafe).value = '';
      
      // Desmarcar radios
      for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
      }
      
      // Esconder formulário
      toggleNewItem(setorSafe);
      
      // Atualizar tabela
      if (window.ImplantacaoUI && window.ImplantacaoUI.state.tabulatorTables && 
          window.ImplantacaoUI.state.tabulatorTables[setorSafe]) {
        window.ImplantacaoUI.state.tabulatorTables[setorSafe].setData();
      }
      
      // Mostrar mensagem
      alert('Item adicionado com sucesso!');
    } else {
      alert(data.message || 'Erro ao adicionar o item');
    }
  })
  .catch(function(error) {
    console.error("Erro ao salvar novo item:", error);
    alert('Erro ao salvar o item: ' + error.message);
    
    // Restaurar o botão
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Salvar';
    }
  });
},
/**
 * Exclui um período e todos os diagnósticos relacionados
 */
 excluirPeriodo: function() {
  // Obter o ID do período
  var periodoId = document.getElementById('periodoExcluirSelect').value;
  var confirmaExclusao = document.getElementById('confirmarExclusao').checked;
  
  // Validações
  if (!periodoId) {
    ImplantacaoUI.notificarAviso('Selecione um período para excluir.');
    return;
  }
  
  if (!confirmaExclusao) {
    ImplantacaoUI.notificarAviso('Você precisa confirmar a exclusão marcando a caixa de seleção.');
    return;
  }
  
  // Mostrar carregamento
  var btnExcluir = document.getElementById('btnExcluirPeriodo');
  var originalBtnText = btnExcluir.innerHTML;
  
  btnExcluir.disabled = true;
  btnExcluir.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...';
  
  // Usar ImplantacaoCRUD para excluir
  ImplantacaoCRUD.excluirPeriodo(periodoId)
    .then(function(data) {
      // Restaurar o botão
      btnExcluir.disabled = false;
      btnExcluir.innerHTML = originalBtnText;
      
      if (data.success) {
        // Limpar o formulário
        document.getElementById('periodoExcluirSelect').value = '';
        document.getElementById('confirmarExclusao').checked = false;
        
        // Mostrar notificação
        ImplantacaoUI.notificarSucesso(data.message || 'Período excluído com sucesso!');
        
        // Redirecionar para a página inicial após 2 segundos
        setTimeout(function() {
          window.location.href = 'implantacao.php';
        }, 2000);
      } else {
        ImplantacaoUI.notificarErro(data.message || 'Erro ao excluir o período.');
      }
    })
    .catch(function(error) {
      console.error("Erro ao excluir período:", error);
      ImplantacaoUI.notificarErro('Erro ao excluir o período: ' + error.message);
      
      // Restaurar o botão
      btnExcluir.disabled = false;
      btnExcluir.innerHTML = originalBtnText;
    });
},
/**
 * Fix for customTabulatorDataLoader in ImplantacaoUI
 */
customTabulatorDataLoader: function(url, config, params) {
  return new Promise((resolve, reject) => {
    // Add cache busting parameter
    const cacheBuster = `_=${Date.now()}`;
    const fullUrl = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
    
    console.log("Loading tabulator data from:", fullUrl);
    
    // Add timeout handling
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout after 15 seconds'));
    }, 15000);
    
    // Use proper fetch with error handling
    fetch(fullUrl, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      ...(config || {})
    })
    .then(response => {
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response.text();
    })
    .then(text => {
      if (!text || text.trim() === '') {
        // For empty responses, return an empty array
        console.warn("Empty response from server");
        resolve([]);
        return;
      }
      
      try {
        // Log the raw response for debugging
        console.log("Raw response first 100 chars:", text.substring(0, 100));
        
        // Parse the JSON
        const data = JSON.parse(text);
        
        // Check for explicit error
        if (data && data.error) {
          throw new Error(data.error);
        }
        
        // Resolve with the data
        resolve(data);
      } catch (e) {
        console.error("JSON parse error:", e);
        console.log("Raw response:", text.substring(0, 500));
        
        // If parsing fails, return an empty array
        resolve([]);
      }
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.error("Error loading tabulator data:", error);
      
      // Return empty array on error to avoid breaking the table
      resolve([]);
    });
  });
},
  
   /**
 * Salva um item editado
 */
salvarItemEditado: function() {
    // Obter os dados do formulário
    var id = document.getElementById('edit_item_id').value;
    var status = document.querySelector('input[name="edit_status"]:checked')?.value || '';
    var naoSeAplica = document.getElementById('edit_nao_se_aplica').checked ? 1 : 0;
    var observacoes = document.getElementById('edit_observacoes').value || '';
    
    // Validações
    if (!id) {
      this.mostrarToast('error', 'ID do item não informado');
      return;
    }
    
    // Se "Não se aplica" estiver marcado, o status deve ser vazio
    if (naoSeAplica) {
      status = '';
    } else if (!status) {
      this.mostrarToast('warning', 'Selecione um status ou marque "Não se aplica"');
      return;
    }
    
    // Mostrar indicador de carregamento no botão
    var saveBtn = document.getElementById('saveEditedItemBtn');
    var originalBtnText = saveBtn ? saveBtn.innerHTML : '';
    
    if (saveBtn) {
      saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
      saveBtn.disabled = true;
    }
    
    // Preparar os dados
    const dadosItem = {
      action: 'update_saved_item',
      id: id,
      status: status,
      nao_se_aplica: naoSeAplica,
      observacoes: observacoes
    };
    
    // Enviar a requisição
    ImplantacaoCRUD.atualizarItem(dadosItem)
      .then(data => {
        // Restaurar o botão
        if (saveBtn) {
          saveBtn.innerHTML = originalBtnText;
          saveBtn.disabled = false;
        }
        
        if (data.success) {
          // Fechar o modal
          var modalElement = document.getElementById('editItemModal');
          if (modalElement) {
            var modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
          
          this.mostrarToast('success', 'Item atualizado com sucesso!');
          
          // Atualizar a lista de itens salvos
          this.atualizarItensSalvosDoModal();
          
          // Obter os dados do modal savedItemsModal para atualizar a tabela principal
          var mainModal = document.getElementById('savedItemsModal');
          if (mainModal) {
            var setorSafe = mainModal.getAttribute('data-setor-safe');
            
            // Preparar objeto de dados para atualização da linha
            const itemAtualizado = {
              id: parseInt(id),
              statu: status,
              observacoes: observacoes,
              nao_se_aplica: naoSeAplica
            };
            
            // Tentar atualizar apenas a linha específica
            if (setorSafe) {
              const atualizouLinha = this.atualizarLinhaTabulatorAposSalvar(itemAtualizado, setorSafe);
              
              // Se não conseguiu atualizar a linha específica, recarregar a tabela
              if (!atualizouLinha && this.state.tabulatorTables[setorSafe]) {
                this.state.tabulatorTables[setorSafe].setData();
              }
              
              // Atualizar a barra de progresso de qualquer forma
              this.atualizarBarraProgressoComAnimacao(setorSafe);
            }
          }
        } else {
          this.mostrarToast('error', data.message || 'Erro ao atualizar o item');
        }
      })
      .catch(error => {
        console.error("Erro ao atualizar item:", error);
        this.mostrarToast('error', 'Erro ao atualizar o item: ' + error.message);
        
        // Restaurar o botão
        if (saveBtn) {
          saveBtn.innerHTML = originalBtnText;
          saveBtn.disabled = false;
        }
      });
  },
  // Função para adicionar ícones de cadeado indicando congelamento
adicionarIconesCongelamento: function() {
  // Verificar se temos as informações do período
  if (!window.periodoInfo) return;
  
  // Obter o cabeçalho com informações do período
  const periodoHeader = document.querySelector('.card-header h5');
  if (!periodoHeader) return;
  
  // Verificar se o ícone já existe para evitar duplicação
  if (periodoHeader.querySelector('.status-congelamento')) return;
  
  // Determinar o status de congelamento
  // Tentamos obter de diferentes fontes possíveis
  let isFrozen = false;
  
  if (window.periodoInfo.hasOwnProperty('is_frozen')) {
    // Se temos a propriedade diretamente no objeto
    isFrozen = !!window.periodoInfo.is_frozen;
  } else if (window.periodoInfo.hasOwnProperty('congelado')) {
    // Nome alternativo para a propriedade
    isFrozen = !!window.periodoInfo.congelado;
  } else {
    // Tentar buscar do HTML da página
    const periodoText = periodoHeader.textContent || '';
    
    // Verificar se o texto menciona congelamento (isso pode ser ajustado conforme necessário)
    isFrozen = periodoText.toLowerCase().includes('congelado');
  }
  
  // Criar o ícone apropriado (cadeado aberto ou fechado)
  const iconSpan = document.createElement('span');
  iconSpan.className = 'status-congelamento ms-2';
  
  if (isFrozen) {
    // Cadeado fechado para período congelado
    iconSpan.innerHTML = '<i class="fas fa-lock text-warning" title="Período congelado - novos itens precisam ser sincronizados manualmente"></i>';
  } else {
    // Cadeado aberto para período não congelado
    iconSpan.innerHTML = '<i class="fas fa-lock-open text-success" title="Período não congelado - novos itens são sincronizados automaticamente"></i>';
  }
  
  // Adicionar o ícone ao cabeçalho
  periodoHeader.appendChild(iconSpan);
  
  // Adicionar estilo para o ícone se ainda não existir
  if (!document.getElementById('icones-congelamento-style')) {
    const style = document.createElement('style');
    style.id = 'icones-congelamento-style';
    style.textContent = `
      .status-congelamento {
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
        font-size: 0.9em;
      }
      
      .status-congelamento i {
        cursor: help;
        transition: transform 0.2s ease;
      }
      
      .status-congelamento i:hover {
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Adicionar ícones também na lista de seleção de períodos
  this.adicionarIconesCongelamentoNaLista();
},

// Função para adicionar ícones na lista de seleção de períodos
adicionarIconesCongelamentoNaLista: function() {
  // Encontrar o select de períodos
  const periodosSelect = document.getElementById('unidadeSelectModal');
  if (!periodosSelect) return;
  
  // Obter todas as opções do select
  const opcoes = periodosSelect.querySelectorAll('option');
  
  // Função para determinar se um período é congelado pelo seu texto
  // Isso é uma heurística - se você tiver dados reais sobre quais períodos são congelados,
  // deve usar esses dados em vez disso
  function isPeriodoCongelado(texto) {
    // Esta é uma heurística simples - ajuste conforme necessário
    // Por padrão, assumimos que períodos mais antigos são congelados
    // Você pode modificar esta lógica ou usar dados reais
    
    if (texto.toLowerCase().includes('congelado')) return true;
    if (texto.toLowerCase().includes('arquivado')) return true;
    
    // Se temos uma lista de períodos congelados, podemos verificar nela
    // Por exemplo, se houver uma variável global com IDs ou nomes de períodos congelados
    if (window.periodosCongelados && Array.isArray(window.periodosCongelados)) {
      const periodoId = opcao.value;
      return window.periodosCongelados.includes(periodoId);
    }
    
    return false; // Padrão: não congelado
  }
  
  // Adicionar ícones às opções (exceto a primeira que normalmente é "Selecione")
  for (let i = 1; i < opcoes.length; i++) {
    const opcao = opcoes[i];
    const textoOriginal = opcao.textContent;
    
    // Verificar se o ícone já foi adicionado
    if (textoOriginal.includes('fa-lock') || textoOriginal.includes('fa-lock-open')) continue;
    
    // Determinar se o período é congelado
    const congelado = isPeriodoCongelado(textoOriginal);
    
    // Adicionar o ícone apropriado
    if (congelado) {
      opcao.innerHTML = `<i class="fas fa-lock text-warning me-1"></i> ${textoOriginal}`;
    } else {
      opcao.innerHTML = `<i class="fas fa-lock-open text-success me-1"></i> ${textoOriginal}`;
    }
  }
},

// Método para adicionar verificação de congelamento ao texto dos períodos
adicionarTextoCongelamento: function() {
  // Verificar se temos as informações do período
  if (!window.periodoInfo) return;
  
  // Verificar status de congelamento
  const isFrozen = window.periodoInfo.is_frozen || window.periodoInfo.congelado || false;
  
  // Obter o container de alerta do período
  const alertaContainer = document.querySelector('.periodo-status-alert');
  
  if (alertaContainer) {
    // Adicionar badge de congelamento ao alerta existente
    if (!alertaContainer.querySelector('.badge-congelamento')) {
      const badge = document.createElement('span');
      badge.className = `badge ${isFrozen ? 'bg-warning text-dark' : 'bg-success'} badge-congelamento ms-2`;
      badge.innerHTML = isFrozen ? 
        '<i class="fas fa-lock me-1"></i> Período Congelado' : 
        '<i class="fas fa-lock-open me-1"></i> Período Não Congelado';
      
      const firstIcon = alertaContainer.querySelector('i');
      if (firstIcon && firstIcon.parentNode) {
        firstIcon.parentNode.appendChild(badge);
      } else {
        alertaContainer.appendChild(badge);
      }
    }
  } else {
    // Se não há alerta, criar um novo para mostrar o status de congelamento
    const periodoInfo = document.querySelector('.periodo-info');
    if (periodoInfo && !document.querySelector('.alerta-congelamento')) {
      const alerta = document.createElement('div');
      alerta.className = `alert ${isFrozen ? 'alert-warning' : 'alert-success'} alerta-congelamento mb-3`;
      alerta.innerHTML = isFrozen ? 
        '<i class="fas fa-lock me-2"></i>Este período está <strong>congelado</strong>. Novos itens precisam ser sincronizados manualmente.' : 
        '<i class="fas fa-lock-open me-2"></i>Este período está <strong>não congelado</strong>. Novos itens são sincronizados automaticamente.';
      
      // Inserir antes do primeiro elemento filho
      if (periodoInfo.firstChild) {
        periodoInfo.insertBefore(alerta, periodoInfo.firstChild);
      } else {
        periodoInfo.appendChild(alerta);
      }
    }
  }
},
  
  
    /**
     * Exibe uma mensagem de toast
     * @param {string} type Tipo de mensagem (success, error, warning, info)
     * @param {string} message Mensagem a ser exibida
     */
    mostrarToast: function(type, message) {
      if (typeof toastr !== 'undefined') {
        toastr[type](message);
      } else {
        alert(type.toUpperCase() + ': ' + message);
      }
    }
  };
  
/**
 * Função para adicionar o botão de sincronização
 * Esta função é definida fora do objeto ImplantacaoUI para evitar problemas de referência
 */
function adicionarBotaoSincronizacao() {
  const periodoInfo = document.querySelector('.card-header .d-flex');
  if (!periodoInfo) return;
  
  // Verificar se o botão já existe para evitar duplicação
  if (document.getElementById('btnShowSyncModal')) return;
  
  // Criar o botão
  const syncBtn = document.createElement('button');
  syncBtn.id = 'btnShowSyncModal';
  syncBtn.className = 'btn btn-outline-warning ms-2';
  syncBtn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Sincronizar Itens';
  syncBtn.onclick = function() {
    if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.mostrarModalSincronizacao === 'function') {
      ImplantacaoUI.mostrarModalSincronizacao();
    } else {
      alert('Funcionalidade de sincronização não está disponível no momento.');
    }
  };
  
  // Adicionar o botão antes do botão de trocar período
  const trocarBtn = periodoInfo.querySelector('button');
  if (trocarBtn) {
    periodoInfo.insertBefore(syncBtn, trocarBtn);
  } else {
    // Caso não encontre o botão de trocar, adiciona no final
    periodoInfo.appendChild(syncBtn);
  }
}

// Inicialização segura quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar a UI principal primeiro
  ImplantacaoUI.init();
  
  // Depois da inicialização, adicionar o botão com um pequeno delay
  setTimeout(function() {
    adicionarBotaoSincronizacao();
  }, 500);
});

// Expor funções necessárias ao escopo global
window.editarAvaliacao = function(itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId) {
  ImplantacaoUI.abrirModalAvaliacao(itemId, itemName, sectorName, periodId, unitId, sectorId, diagnosticId);
};

// Outras funções necessárias para as ações em onclick
window.saveEvaluation = function() {
  ImplantacaoUI.salvarAvaliacao();
};

window.toggleNewItem = function(setorSafe) {
  ImplantacaoUI.alternarNovoItem(setorSafe);
};

window.saveNewItem = function(setorSafe, setorId) {
  ImplantacaoUI.salvarNovoItem(setorSafe, setorId);
};

window.toggleStatusRadios = function(checked) {
  ImplantacaoUI.alternarStatusRadios(checked);
};

window.editSavedItems = function(setorSafe, setorId) {
  ImplantacaoUI.editarItensSalvos(setorSafe, setorId);
};

window.refreshSavedItemsFromModal = function() {
  ImplantacaoUI.atualizarItensSalvosDoModal();
};

window.editItem = function(itemId, itemName, status, observacoes, naoSeAplica) {
  ImplantacaoUI.editarItem(itemId, itemName, status, observacoes, naoSeAplica);
};

window.saveEditedItem = function() {
  ImplantacaoUI.salvarItemEditado();
};

window.openPeriodoModal = function() {
  ImplantacaoUI.abrirModalPeriodo();
};

// Função global para excluir período
window.excluirPeriodo = function() {
  var periodoId = document.getElementById('periodoExcluirSelect').value;
  var confirmaExclusao = document.getElementById('confirmarExclusao').checked;
  
  if (!periodoId) {
    ImplantacaoUI.notificarAviso('Selecione um período para excluir.');
    return;
  }
  
  if (!confirmaExclusao) {
    ImplantacaoUI.notificarAviso('Você precisa confirmar a exclusão marcando a caixa de seleção.');
    return;
  }
  
  // Mostrar carregamento
  var btnExcluir = document.getElementById('btnExcluirPeriodo');
  var originalBtnText = btnExcluir.innerHTML;
  
  btnExcluir.disabled = true;
  btnExcluir.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...';
  
  ImplantacaoCRUD.excluirPeriodo(periodoId)
    .then(function(data) {
      btnExcluir.disabled = false;
      btnExcluir.innerHTML = originalBtnText;
      
      if (data.success) {
        document.getElementById('periodoExcluirSelect').value = '';
        document.getElementById('confirmarExclusao').checked = false;
        
        ImplantacaoUI.notificarSucesso(data.message || 'Período excluído com sucesso!');
        
        setTimeout(function() {
          window.location.href = 'implantacao.php';
        }, 2000);
      } else {
        ImplantacaoUI.notificarErro(data.message || 'Erro ao excluir o período.');
      }
    })
    .catch(function(error) {
      console.error("Erro ao excluir período:", error);
      ImplantacaoUI.notificarErro('Erro ao excluir o período: ' + error.message);
      
      btnExcluir.disabled = false;
      btnExcluir.innerHTML = originalBtnText;
    });
};

// Função global para forçar a sincronização de itens
window.forcarSincronizacaoItens = function() {
  // Verificar confirmação
  const confirmaSync = document.getElementById('confirmarSincronizacao').checked;
  
  if (!confirmaSync) {
    const resultElement = document.getElementById('sync-result');
    resultElement.className = 'alert alert-danger mt-3';
    resultElement.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Você precisa confirmar a sincronização marcando a caixa de seleção.';
    resultElement.classList.remove('d-none');
    return;
  }
  
  // Obter IDs necessários
  const periodoId = document.getElementById('periodoId').value;
  const unidadeId = document.getElementById('unidadeSelect').value;
  
  // Mostrar carregamento
  const btnSync = document.getElementById('btnForceSyncItems');
  const originalBtnText = btnSync.innerHTML;
  
  btnSync.disabled = true;
  btnSync.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sincronizando...';
  
  // Esconder resultado anterior
  const resultElement = document.getElementById('sync-result');
  resultElement.classList.add('d-none');
  
  // Adicionar cabeçalhos para indicar que é uma requisição AJAX
  const headers = new Headers();
  headers.append('X-Requested-With', 'XMLHttpRequest');
  
  // Preparar os dados para envio
  const formData = new FormData();
  formData.append('action', 'force_sync_items');
  formData.append('periodo_id', periodoId);
  formData.append('unidade_id', unidadeId);
  
  // Executar a sincronização
  fetch(ImplantacaoCRUD.getApiUrl(), {
    method: 'POST',
    headers: headers,
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.text();
  })
  .then(text => {
    // Restaurar o botão
    btnSync.disabled = false;
    btnSync.innerHTML = originalBtnText;
    
    // Verificar se a resposta é HTML
    if (text.includes("<br />") || text.includes("<!DOCTYPE") || text.includes("<html")) {
      console.error("Recebeu HTML em vez de JSON:", text.substring(0, 200));
      resultElement.className = 'alert alert-danger mt-3';
      resultElement.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Erro na sincronização:</strong> O servidor retornou HTML em vez de JSON. Isso geralmente indica um erro de PHP.
      `;
      resultElement.classList.remove('d-none');
      return;
    }
    
    // Tentar processar como JSON
    try {
      const data = JSON.parse(text);
      
      // Mostrar resultado
      resultElement.className = `alert alert-${data.success ? 'success' : 'danger'} mt-3`;
      
      if (data.success) {
        const stats = data.data || { itens_inseridos: 0, itens_atualizados: 0, setores_sincronizados: 0 };
        
        resultElement.innerHTML = `
          <i class="fas fa-check-circle me-2"></i>
          <strong>Sincronização concluída com sucesso!</strong>
          <hr>
          <ul>
            <li><strong>Novos itens:</strong> ${stats.itens_inseridos}</li>
            <li><strong>Itens atualizados:</strong> ${stats.itens_atualizados}</li>
            <li><strong>Setores processados:</strong> ${stats.setores_sincronizados}</li>
          </ul>
          <p class="mb-0">Recarregando a página em 3 segundos...</p>
        `;
        
        // Recarregar todas as tabelas de itens após um breve intervalo
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        resultElement.innerHTML = `
          <i class="fas fa-exclamation-circle me-2"></i>
          <strong>Erro na sincronização:</strong> ${data.message}
        `;
      }
      
      resultElement.classList.remove('d-none');
    } catch (e) {
      console.error("Erro ao analisar resposta:", e, "Texto completo:", text);
      resultElement.className = 'alert alert-danger mt-3';
      resultElement.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Erro ao processar resposta:</strong> A resposta não é um JSON válido.
      `;
      resultElement.classList.remove('d-none');
    }
  })
  .catch(error => {
    console.error("Erro ao forçar sincronização:", error);
    
    // Restaurar o botão
    btnSync.disabled = false;
    btnSync.innerHTML = originalBtnText;
    
    // Mostrar erro
    resultElement.className = 'alert alert-danger mt-3';
    resultElement.innerHTML = `
      <i class="fas fa-exclamation-circle me-2"></i>
      <strong>Erro ao sincronizar:</strong> ${error.message}
    `;
    resultElement.classList.remove('d-none');
  });
};
// Verificação de segurança para garantir que window.periodoInfo está disponível
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
      if (!window.periodoInfo) {
          console.error("ERRO CRÍTICO: window.periodoInfo não foi inicializado corretamente!");
          
          // Tentar resolver o problema
          const periodoId = document.getElementById('periodoId')?.value;
          if (periodoId) {
              // Buscar informação de congelamento diretamente
              fetch(`implantacao.php?action=check_period_frozen&periodo_id=${periodoId}`)
                  .then(response => response.json())
                  .then(data => {
                      window.periodoInfo = {
                          id: periodoId,
                          is_frozen: data.is_frozen
                      };
                      console.warn("Recuperado estado de congelamento via AJAX:", window.periodoInfo);
                      
                      // Recarregar as tabelas
                      if (window.ImplantacaoUI && typeof window.ImplantacaoUI.inicializarTabulatorTables === 'function') {
                          window.ImplantacaoUI.inicializarTabulatorTables();
                      }
                  })
                  .catch(error => {
                      console.error("Falha ao recuperar estado de congelamento:", error);
                  });
          }
      }
  }, 1000); // Verificar após 1 segundo
});

/**
 * Renders sectors and subsectors in the sidebar
 * @param {Array} setores Array of sectors with their subsectors
 */
function renderSetores(setores) {
    const container = document.getElementById('setores-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    setores.forEach((setor, index) => {
        const setorSafe = sanitizeId(setor.nome);
        const isActive = (index === 0) ? 'active' : '';
        
        // Create sector container
        const setorDiv = document.createElement('div');
        setorDiv.className = 'setor-group mb-2';
        
        // Create sector header
        const setorHeader = document.createElement('a');
        setorHeader.className = `list-group-item list-group-item-action nav-link ${isActive}`;
        setorHeader.id = `tab-${setorSafe}`;
        setorHeader.setAttribute('data-bs-toggle', 'collapse');
        setorHeader.href = `#collapse-${setorSafe}`;
        setorHeader.setAttribute('role', 'button');
        setorHeader.setAttribute('data-setor-id', setor.id);
        setorHeader.setAttribute('data-setor-original', setor.nome);
        setorHeader.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
        setorHeader.setAttribute('aria-controls', `collapse-${setorSafe}`);
        
        // Add icon and name to header
        const iconSpan = document.createElement('span');
        iconSpan.className = 'health-icon me-2';
        const iconName = ImplantacaoUI.atribuirIconeDinamico(setor.nome);
        iconSpan.style.backgroundImage = `url('../../assets/icons/svg/${iconName}.svg')`;
        
        setorHeader.appendChild(iconSpan);
        setorHeader.appendChild(document.createTextNode(setor.nome));
        
        // Add badge if there are subsectors
        if (setor.subsetores && setor.subsetores.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'badge bg-secondary float-end';
            badge.textContent = setor.subsetores.length;
            setorHeader.appendChild(badge);
        }
        
        setorDiv.appendChild(setorHeader);
        
        // Create subsectors collapsible section
        if (setor.subsetores && setor.subsetores.length > 0) {
            const collapseDiv = document.createElement('div');
            collapseDiv.className = `collapse ${index === 0 ? 'show' : ''}`;
            collapseDiv.id = `collapse-${setorSafe}`;
            
            const listDiv = document.createElement('div');
            listDiv.className = 'list-group list-group-flush ps-4';
            
            // Add each subsector
            setor.subsetores.forEach(subsetor => {
                const subsetorSafe = sanitizeId(subsetor.nome);
                const subsetorLink = document.createElement('a');
                subsetorLink.className = 'list-group-item list-group-item-action';
                subsetorLink.href = '#';
                subsetorLink.setAttribute('data-setor-id', setor.id);
                subsetorLink.setAttribute('data-subsetor-id', subsetor.id);
                subsetorLink.onclick = function(e) {
                    e.preventDefault();
                    loadSubsetorItems(setor.id, subsetor.id);
                };
                
                const chevronIcon = document.createElement('i');
                chevronIcon.className = 'fas fa-chevron-right me-2';
                subsetorLink.appendChild(chevronIcon);
                subsetorLink.appendChild(document.createTextNode(subsetor.nome));
                
                listDiv.appendChild(subsetorLink);
            });
            
            collapseDiv.appendChild(listDiv);
            setorDiv.appendChild(collapseDiv);
        }
        
        container.appendChild(setorDiv);
    });
    
    // Apply icons and setup event listeners
    ImplantacaoUI.aplicarIconesSetores();
    ImplantacaoUI.inicializarTooltips();
    setupSectorSubsectorEvents();
}

/**
 * Sets up event listeners for sectors and subsectors
 */
function setupSectorSubsectorEvents() {
    // Event handler for subsector clicks
    document.querySelectorAll('[data-subsetor-id]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear any active item
            document.querySelectorAll('.list-group-item.active').forEach(item => {
                if (!item.hasAttribute('data-bs-toggle')) {
                    item.classList.remove('active');
                }
            });
            
            // Mark this subsector as active
            this.classList.add('active');
            
            // Load items for this subsector
            loadSubsetorItems(
                parseInt(this.getAttribute('data-setor-id')),
                parseInt(this.getAttribute('data-subsetor-id'))
            );
        });
    });
    
    // Event handler for sector clicks that don't have subsectors
    document.querySelectorAll('[data-setor-id][data-bs-toggle="collapse"]').forEach(element => {
        // Check if this sector has any subsectors
        const setorId = element.getAttribute('data-setor-id');
        const collapseId = element.getAttribute('aria-controls');
        const collapseElement = document.getElementById(collapseId);
        
        // If no subsectors or empty collapse, add click event to load items directly
        if (!collapseElement || collapseElement.querySelectorAll('.list-group-item').length === 0) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                loadSetorItems(parseInt(setorId));
            });
        }
    });
}

/**
* Loads items for a specific sector (no subsector)
* @param {number} setorId The sector ID
*/
function loadSetorItems(setorId) {
 const unidadeId = document.getElementById('unidadeSelect')?.value;
 const periodoId = document.getElementById('periodoId')?.value;
 
 if (!setorId || !unidadeId || !periodoId) {
     if (window.ImplantacaoUI && typeof window.ImplantacaoUI.notificarAviso === 'function') {
         window.ImplantacaoUI.notificarAviso('Dados incompletos para carregar itens do setor.');
     } else {
         alert('Dados incompletos para carregar itens do setor.');
     }
     return;
 }
 
 // Get sector info for breadcrumb
 const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
 const setorNome = setorElement ? setorElement.getAttribute('data-setor-original') || 
                   setorElement.textContent.trim() : 'Setor';
 
 // Update breadcrumb
 if (typeof updateSectorBreadcrumb === 'function') {
     updateSectorBreadcrumb(setorNome);
 }
 
 // Show loading indicator
 if (typeof showLoadingIndicator === 'function') {
     showLoadingIndicator();
 }
 
 // Reset current subsector
 window.currentSubsetorId = null;
 window.currentSetorId = setorId;
 
 // Get items
 const params = new URLSearchParams({
     action: 'get_itens_tabela',
     setor_id: setorId,
     unidade_id: unidadeId,
     periodo_id: periodoId
 });
 
 fetch(`${ImplantacaoCRUD.getApiUrl()}?${params}`)
     .then(response => {
         if (!response.ok) {
             throw new Error(`Erro HTTP: ${response.status}`);
         }
         return response.json();
     })
     .then(data => {
         if (typeof hideLoadingIndicator === 'function') {
             hideLoadingIndicator();
         }
         
         if (data.error) {
             if (window.ImplantacaoUI && typeof window.ImplantacaoUI.notificarErro === 'function') {
                 window.ImplantacaoUI.notificarErro(data.error);
             } else {
                 alert('Erro: ' + data.error);
             }
             return;
         }
         
         // Get the tabulator container for this sector
         const setorSafe = sanitizeId(setorNome);
         if (typeof updateItemsTable === 'function') {
             updateItemsTable(data, setorSafe);
         }
         
         // Update progress information
         if (window.ImplantacaoUI && typeof window.ImplantacaoUI.atualizarBarraProgressoComAnimacao === 'function') {
             window.ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe);
         }
     })
     .catch(error => {
         if (typeof hideLoadingIndicator === 'function') {
             hideLoadingIndicator();
         }
         console.error('Erro ao carregar itens do setor:', error);
         if (window.ImplantacaoUI && typeof window.ImplantacaoUI.notificarErro === 'function') {
             window.ImplantacaoUI.notificarErro('Erro ao carregar itens do setor.');
         } else {
             alert('Erro ao carregar itens do setor.');
         }
     });
}
// Helper function to debug API responses
function debugApiResponse(url) {
  console.log("Fetching from URL:", url);
  
  fetch(url)
      .then(response => {
          console.log("Response status:", response.status);
          return response.text();
      })
      .then(text => {
          console.log("Raw API response:", text.substring(0, 500));
          try {
              const json = JSON.parse(text);
              console.log("Valid JSON response:", json);
          } catch (e) {
              console.error("Invalid JSON:", e);
          }
      })
      .catch(error => {
          console.error("Fetch error:", error);
      });
}



function loadSubsetorItems(setorId, subsetorId) {
  // Garantir que os IDs sejam números
  setorId = parseInt(setorId, 10);
  subsetorId = parseInt(subsetorId, 10);
  
  console.log(`Carregando itens para setor=${setorId}, subsetor=${subsetorId}`);
  
  const unidadeId = document.getElementById('unidadeSelect')?.value;
  const periodoId = document.getElementById('periodoId')?.value;
  
  if (!setorId || !subsetorId || !unidadeId || !periodoId) {
      console.error("Dados incompletos para carregar itens", { 
          setorId, subsetorId, unidadeId, periodoId 
      });
      
      if (typeof ImplantacaoUI?.notificarAviso === 'function') {
          ImplantacaoUI.notificarAviso('Dados incompletos para carregar itens do subsetor.');
      } else {
          alert('Dados incompletos para carregar itens do subsetor.');
      }
      return;
  }
  
  // Obter informações do setor/subsetor para breadcrumb
  const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
  const subsetorElement = document.querySelector(`[data-setor-id="${setorId}"][data-subsetor-id="${subsetorId}"]`);
  
  const setorNome = setorElement ? setorElement.getAttribute('data-setor-original') || 
                  setorElement.textContent.trim() : 'Setor';
  const subsetorNome = subsetorElement ? subsetorElement.textContent.trim() : 'Subsetor';
  
  console.log(`Setor: "${setorNome}", Subsetor: "${subsetorNome}"`);
  
  // Atualizar o breadcrumb
  if (typeof updateSectorBreadcrumb === 'function') {
      updateSectorBreadcrumb(setorNome, subsetorNome);
  }
  
  // Mostrar indicador de carregamento
  if (typeof showLoadingIndicator === 'function') {
      showLoadingIndicator();
  } else {
      // Criar um indicador simples se a função não existir
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'loading-indicator';
      loadingDiv.innerHTML = '<div class="spinner-border text-primary"></div><div>Carregando...</div>';
      loadingDiv.style.position = 'fixed';
      loadingDiv.style.top = '50%';
      loadingDiv.style.left = '50%';
      loadingDiv.style.transform = 'translate(-50%, -50%)';
      loadingDiv.style.background = 'white';
      loadingDiv.style.padding = '20px';
      loadingDiv.style.borderRadius = '5px';
      loadingDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      loadingDiv.style.zIndex = '9999';
      document.body.appendChild(loadingDiv);
  }
  
  // Salvar contexto atual para uso global
  window.currentSetorId = setorId;
  window.currentSubsetorId = subsetorId;
  
  // Obter URL correta da API
  const apiUrl = typeof ImplantacaoCRUD?.getApiUrl === 'function' ? 
                 ImplantacaoCRUD.getApiUrl() : 
                 '../../helpers/implantacao_helpers.php';
  
  // Preparar parâmetros com um timestamp para evitar cache
  const params = new URLSearchParams({
      action: 'get_itens_tabela',
      setor_id: setorId,
      subsetor_id: subsetorId,
      unidade_id: unidadeId,
      periodo_id: periodoId,
      '_': Date.now() // Prevenir cache
  });
  
  const fullUrl = `${apiUrl}?${params.toString()}`;
  console.log(`Fazendo requisição para: ${fullUrl}`);
  
  // Definir um timeout para a requisição
  const timeoutId = setTimeout(() => {
      hideLoadingIndicator();
      if (typeof ImplantacaoUI?.notificarErro === 'function') {
          ImplantacaoUI.notificarErro('Timeout na requisição. Verifique a conexão de rede.');
      } else {
          alert('Timeout na requisição. Verifique a conexão de rede.');
      }
  }, 15000); // 15 segundos
  
  // Fazer a requisição com cabeçalhos completos
  fetch(fullUrl, {
      method: 'GET',
      headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
      }
  })
  .then(response => {
      clearTimeout(timeoutId);
      
      console.log(`Resposta recebida: status ${response.status}`);
      console.log(`Headers:`, Object.fromEntries([...response.headers.entries()]));
      
      if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      return response.text();
  })
  .then(text => {
      // Ocultar indicador de carregamento
      hideLoadingIndicator();
      
      console.log(`Resposta bruta (primeiros 200 caracteres): ${text.substring(0, 200)}`);
      
      // Verificar se a resposta está vazia
      if (!text || text.trim() === '') {
          console.error("Resposta vazia do servidor");
          
          // Mesmo com resposta vazia, tentar continuar com array vazio
          const setorSafe = typeof sanitizeId === 'function' ? 
              sanitizeId(setorNome) : 
              setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
          
          if (typeof ImplantacaoUI?.notificarAviso === 'function') {
              ImplantacaoUI.notificarAviso("Nenhum item encontrado para este subsetor.");
          }
          
          if (typeof updateItemsTable === 'function') {
              updateItemsTable([], setorSafe, subsetorId);
          }
          
          return;
      }
      
      try {
          // Tentar analisar o JSON
          const data = JSON.parse(text);
          
          if (data.error) {
              console.error("Erro retornado pelo servidor:", data.error);
              if (typeof ImplantacaoUI?.notificarErro === 'function') {
                  ImplantacaoUI.notificarErro(data.error);
              }
              return;
          }
          
          // Se não houver erro, proceder com a atualização da tabela
          const setorSafe = typeof sanitizeId === 'function' ? 
                          sanitizeId(setorNome) : 
                          setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
          
          console.log(`Atualizando tabela para setor=${setorSafe}, itens encontrados=${data.length}`);
          
          // Atualizar a tabela
          if (typeof updateItemsTable === 'function') {
              updateItemsTable(data, setorSafe, subsetorId);
          }
          
          // Atualizar a barra de progresso
          if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
              ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe, subsetorId);
          }
          
      } catch (e) {
          console.error("Erro ao analisar JSON:", e);
          console.log("Resposta bruta:", text);
          
          // Criar estrutura de dados vazia para evitar erros na UI
          const emptyData = [];
          const setorSafe = typeof sanitizeId === 'function' ? 
                          sanitizeId(setorNome) : 
                          setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
          
          // Mostrar erro, mas tentar continuar com dados vazios
          if (typeof ImplantacaoUI?.notificarErro === 'function') {
              ImplantacaoUI.notificarErro(`Erro ao processar resposta: ${e.message}`);
          }
          
          if (typeof updateItemsTable === 'function') {
              updateItemsTable(emptyData, setorSafe, subsetorId);
          }
      }
  })
  .catch(error => {
      clearTimeout(timeoutId);
      hideLoadingIndicator();
      
      console.error('Erro na requisição:', error);
      
      if (typeof ImplantacaoUI?.notificarErro === 'function') {
          ImplantacaoUI.notificarErro(`Erro ao carregar itens: ${error.message}`);
      } else {
          alert(`Erro ao carregar itens: ${error.message}`);
      }
  });
  
  // Função auxiliar para ocultar o indicador de carregamento
  function hideLoadingIndicator() {
      if (typeof window.hideLoadingIndicator === 'function') {
          window.hideLoadingIndicator();
      } else {
          const loadingIndicator = document.getElementById('loading-indicator');
          if (loadingIndicator) {
              loadingIndicator.remove();
          }
      }
  }
}

/**
 * Updates the sector/subsector breadcrumb navigation
 * @param {string} setorNome The sector name
 * @param {string|null} subsetorNome The subsector name (optional)
 */
function updateSectorBreadcrumb(setorNome, subsetorNome = null) {
  const breadcrumbContainers = document.querySelectorAll('.periodo-info');
  
  breadcrumbContainers.forEach(container => {
      if (!container) return;
      
      let html = `
          <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">${setorNome}</li>`;
      
      if (subsetorNome) {
          html += `<li class="breadcrumb-item active" aria-current="page">${subsetorNome}</li>`;
      }
      
      html += `</ol>
          </nav>`;
      
      container.innerHTML = html;
  });
}

/**
 * Shows loading indicator during data fetching
 */
function showLoadingIndicator() {
  // Create loading indicator if it doesn't exist
  if (!document.getElementById('global-loading-indicator')) {
      const loading = document.createElement('div');
      loading.id = 'global-loading-indicator';
      loading.className = 'position-fixed top-50 start-50 translate-middle bg-white p-3 rounded shadow-lg';
      loading.innerHTML = `
          <div class="d-flex align-items-center">
              <div class="spinner-border text-primary me-2" role="status">
                  <span class="visually-hidden">Carregando...</span>
              </div>
              <span>Carregando itens...</span>
          </div>`;
      document.body.appendChild(loading);
  }
  
  document.getElementById('global-loading-indicator').style.display = 'flex';
}

/**
 * Hides loading indicator
 */
function hideLoadingIndicator() {
  const loading = document.getElementById('global-loading-indicator');
  if (loading) {
      loading.style.display = 'none';
  }
}

/**
 * Updates the items table with the loaded data
 * @param {Array} data The items data
 * @param {string} setorSafe The sanitized sector ID
 * @param {number|null} subsetorId The subsector ID (optional)
 */
function updateItemsTable(data, setorSafe, subsetorId = null) {
  console.log(`updateItemsTable chamado: setor=${setorSafe}, subsetor=${subsetorId}, itens=${data ? data.length : 0}`);
  
  // Garantir que data seja sempre um array
  if (!data || !Array.isArray(data)) {
      console.warn("Dados inválidos recebidos, usando array vazio");
      data = [];
  }
  
  // Verificar se temos uma instância Tabulator para este setor
  if (window.ImplantacaoUI && window.ImplantacaoUI.state && 
      window.ImplantacaoUI.state.tabulatorTables && 
      window.ImplantacaoUI.state.tabulatorTables[setorSafe]) {
      
      const table = window.ImplantacaoUI.state.tabulatorTables[setorSafe];
      
      // Adicionar info do subsetor a cada item se fornecido
      if (subsetorId && data.length > 0) {
          data.forEach(item => {
              if (!item.hasOwnProperty('subsetor_id') || item.subsetor_id === null) {
                  item.subsetor_id = subsetorId;
              }
          });
      }
      
      // Atualizar dados da tabela
      try {
          table.replaceData(data);
          console.log(`Tabela atualizada com ${data.length} itens`);
          
          // Se não houver itens, mostrar mensagem na tabela
          if (data.length === 0) {
              // Verificar se o Tabulator tem opção para texto personalizado quando não há dados
              if (table.options && typeof table.options.placeholder === 'string') {
                  table.options.placeholder = "Nenhum item encontrado para este subsetor";
                  
                  // Forçar redesenho para mostrar o placeholder
                  table.redraw(true);
              } else {
                  console.log("Tabela vazia, mas não foi possível definir placeholder personalizado");
              }
          }
      } catch (e) {
          console.error("Erro ao atualizar tabela:", e);
      }
      
      // Armazenar contexto para submissões de formulário
      window.currentContext = {
          setorSafe: setorSafe,
          setorId: window.currentSetorId,
          subsetorId: window.currentSubsetorId
      };
  } else {
      console.error(`Instância Tabulator não encontrada para setor: ${setorSafe}`);
      
      // Tentar recuperar mostrando uma mensagem de erro
      const container = document.querySelector(`#tabulator-${setorSafe}`);
      if (container) {
          container.innerHTML = `
              <div class="alert alert-warning">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Não foi possível carregar a tabela para este setor/subsetor.
                  <button class="btn btn-sm btn-outline-primary mt-2" onclick="window.location.reload()">
                      <i class="fas fa-sync-alt me-1"></i> Recarregar página
                  </button>
              </div>
          `;
      }
  }
}



/**
 * Modificação na função loadSubsetorItems para melhor suporte a subsetores
 */
window.loadSubsetorItems = function(setorId, subsetorId) {
    const unidadeId = document.getElementById('unidadeSelect')?.value;
    const periodoId = document.getElementById('periodoId')?.value;
    
    if (!setorId || !subsetorId || !unidadeId || !periodoId) {
        if (typeof ImplantacaoUI?.notificarAviso === 'function') {
            ImplantacaoUI.notificarAviso('Dados incompletos para carregar itens do subsetor.');
        } else {
            alert('Dados incompletos para carregar itens do subsetor.');
        }
        return;
    }
    
    // Obter informações do setor e subsetor para breadcrumb
    const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
    const subsetorElement = document.querySelector(`[data-setor-id="${setorId}"][data-subsetor-id="${subsetorId}"]`);
    
    const setorNome = setorElement ? setorElement.getAttribute('data-setor-original') || 
                    setorElement.textContent.trim() : 'Setor';
    const subsetorNome = subsetorElement ? subsetorElement.textContent.trim() : 'Subsetor';
    
    // Atualizar breadcrumb
    if (typeof updateSectorBreadcrumb === 'function') {
        updateSectorBreadcrumb(setorNome, subsetorNome);
    }
    
    // Mostrar indicador de carregamento
    if (typeof showLoadingIndicator === 'function') {
        showLoadingIndicator();
    } else {
        // Criar um indicador simples se a função não existir
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'global-loading-indicator';
        loadingDiv.className = 'position-fixed top-50 start-50 translate-middle bg-white p-3 rounded shadow-lg';
        loadingDiv.style.zIndex = '9999';
        loadingDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border text-primary me-2" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <span>Carregando itens...</span>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }
    
    // Salvar contexto atual para uso global
    if (typeof window.currentSetorId !== 'undefined') {
        window.currentSetorId = setorId;
    }
    if (typeof window.currentSubsetorId !== 'undefined') {
        window.currentSubsetorId = subsetorId;
    }
    
    // Obter URL correta da API
    const apiUrl = typeof ImplantacaoCRUD?.getApiUrl === 'function' ? 
                ImplantacaoCRUD.getApiUrl() : 
                '../../helpers/implantacao_helpers.php';
    
    // Preparar parâmetros
    const params = new URLSearchParams({
        action: 'get_itens_tabela',
        setor_id: setorId,
        subsetor_id: subsetorId,
        unidade_id: unidadeId,
        periodo_id: periodoId,
        '_': Date.now() // Cache buster
    });
    
    // Fazer a requisição
    fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        // Esconder indicador de carregamento
        hideLoadingIndicator();
        
        // Verificar resposta vazia
        if (!text || text.trim() === '') {
            console.error("Resposta vazia do servidor");
            if (typeof ImplantacaoUI?.notificarErro === 'function') {
                ImplantacaoUI.notificarErro("Resposta vazia do servidor. Tente novamente.");
            }
            return;
        }
        
        try {
            // Parse JSON
            const data = JSON.parse(text);
            
            if (data.error) {
                if (typeof ImplantacaoUI?.notificarErro === 'function') {
                    ImplantacaoUI.notificarErro(data.error);
                }
                return;
            }
            
            // Obter o container da tabela para este setor
            const setorSafe = typeof sanitizeId === 'function' ? 
                           sanitizeId(setorNome) : 
                           setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            // Atualizar tabela
            if (typeof updateItemsTable === 'function') {
                updateItemsTable(data, setorSafe, subsetorId);
            }
            
            // Atualizar barra de progresso com o LoadingBar.js
            if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
                // Passar o ID do subsetor para exibir corretamente o progresso
                ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe, subsetorId);
            }
        } catch (e) {
            console.error("JSON parse error:", e, "Raw response:", text.substring(0, 200));
            
            // Criar estrutura de dados vazia para evitar erros na UI
            const emptyData = [];
            const setorSafe = typeof sanitizeId === 'function' ? 
                           sanitizeId(setorNome) : 
                           setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            // Mostrar erro, mas tentar continuar com dados vazios
            if (typeof ImplantacaoUI?.notificarErro === 'function') {
                ImplantacaoUI.notificarErro(`Erro ao processar resposta do servidor: ${e.message}`);
            }
            
            // Atualizar tabela com dados vazios
            if (typeof updateItemsTable === 'function') {
                updateItemsTable(emptyData, setorSafe, subsetorId);
            }
        }
    })
    .catch(error => {
        // Esconder indicador de carregamento
        hideLoadingIndicator();
        
        console.error('Erro ao carregar itens do subsetor:', error);
        
        if (typeof ImplantacaoUI?.notificarErro === 'function') {
            ImplantacaoUI.notificarErro(`Erro ao carregar itens do subsetor: ${error.message}`);
        }
    });
    
    // Função auxiliar para esconder o indicador de carregamento
    function hideLoadingIndicator() {
        if (typeof window.hideLoadingIndicator === 'function') {
            window.hideLoadingIndicator();
        } else {
            // Fallback simples
            const loadingIndicator = document.getElementById('global-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }
    }
};

/**
 * Também atualizar a função loadSetorItems para ser consistente com loadSubsetorItems
 */
window.loadSetorItems = function(setorId) {
    const unidadeId = document.getElementById('unidadeSelect')?.value;
    const periodoId = document.getElementById('periodoId')?.value;
    
    if (!setorId || !unidadeId || !periodoId) {
        if (typeof ImplantacaoUI?.notificarAviso === 'function') {
            ImplantacaoUI.notificarAviso('Dados incompletos para carregar itens do setor.');
        } else {
            alert('Dados incompletos para carregar itens do setor.');
        }
        return;
    }
    
    // Obter informações do setor para breadcrumb
    const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
    const setorNome = setorElement ? setorElement.getAttribute('data-setor-original') || 
                   setorElement.textContent.trim() : 'Setor';
    
    // Atualizar breadcrumb
    if (typeof updateSectorBreadcrumb === 'function') {
        updateSectorBreadcrumb(setorNome);
    }
    
    // Mostrar indicador de carregamento
    if (typeof showLoadingIndicator === 'function') {
        showLoadingIndicator();
    } else {
        // Criar um indicador simples se a função não existir
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'global-loading-indicator';
        loadingDiv.className = 'position-fixed top-50 start-50 translate-middle bg-white p-3 rounded shadow-lg';
        loadingDiv.style.zIndex = '9999';
        loadingDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border text-primary me-2" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <span>Carregando itens...</span>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }
    
    // Salvar contexto atual para uso global
    if (typeof window.currentSetorId !== 'undefined') {
        window.currentSetorId = setorId;
    }
    if (typeof window.currentSubsetorId !== 'undefined') {
        window.currentSubsetorId = null; // Resetar subsetor ao carregar setor principal
    }
    
    // Obter URL correta da API
    const apiUrl = typeof ImplantacaoCRUD?.getApiUrl === 'function' ? 
                ImplantacaoCRUD.getApiUrl() : 
                '../../helpers/implantacao_helpers.php';
    
    // Preparar parâmetros
    const params = new URLSearchParams({
        action: 'get_itens_tabela',
        setor_id: setorId,
        unidade_id: unidadeId,
        periodo_id: periodoId,
        '_': Date.now() // Cache buster
    });
    
    // Fazer a requisição
    fetch(`${apiUrl}?${params}`, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        // Esconder indicador de carregamento
        hideLoadingIndicator();
        
        // Verificar resposta vazia
        if (!text || text.trim() === '') {
            console.error("Resposta vazia do servidor");
            if (typeof ImplantacaoUI?.notificarErro === 'function') {
                ImplantacaoUI.notificarErro("Resposta vazia do servidor. Tente novamente.");
            }
            return;
        }
        
        try {
            // Parsear JSON
            const data = JSON.parse(text);
            
            if (data.error) {
                if (typeof ImplantacaoUI?.notificarErro === 'function') {
                    ImplantacaoUI.notificarErro(data.error);
                }
                return;
            }
            
            // Obter o container da tabela para este setor
            const setorSafe = typeof sanitizeId === 'function' ? 
                           sanitizeId(setorNome) : 
                           setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            // Atualizar tabela
            if (typeof updateItemsTable === 'function') {
                updateItemsTable(data, setorSafe);
            }
            
            // Atualizar barra de progresso com o LoadingBar.js
            if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
                // Não passar ID do subsetor pois estamos no setor principal
                ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe);
            }
        } catch (e) {
            console.error("JSON parse error:", e, "Raw response:", text.substring(0, 200));
            
            // Criar estrutura de dados vazia para evitar erros na UI
            const emptyData = [];
            const setorSafe = typeof sanitizeId === 'function' ? 
                           sanitizeId(setorNome) : 
                           setorNome.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            // Mostrar erro, mas tentar continuar com dados vazios
            if (typeof ImplantacaoUI?.notificarErro === 'function') {
                ImplantacaoUI.notificarErro(`Erro ao processar resposta do servidor: ${e.message}`);
            }
            
            // Atualizar tabela com dados vazios
            if (typeof updateItemsTable === 'function') {
                updateItemsTable(emptyData, setorSafe);
            }
        }
    })
    .catch(error => {
        // Esconder indicador de carregamento
        hideLoadingIndicator();
        
        console.error('Erro ao carregar itens do setor:', error);
        
        if (typeof ImplantacaoUI?.notificarErro === 'function') {
            ImplantacaoUI.notificarErro(`Erro ao carregar itens do setor: ${error.message}`);
        }
    });
    
    // Função auxiliar para esconder o indicador de carregamento
    function hideLoadingIndicator() {
        if (typeof window.hideLoadingIndicator === 'function') {
            window.hideLoadingIndicator();
        } else {
            // Fallback simples
            const loadingIndicator = document.getElementById('global-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }
    }
};

/**
 * Adicionar evento para atualizar barras de progresso quando a tab muda
 */
document.addEventListener('DOMContentLoaded', function() {
    // Eventos para tabs de Bootstrap para atualizar as barras de progresso quando uma tab é exibida
    const tabs = document.querySelectorAll('[data-bs-toggle="pill"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            // Tab que foi ativada
            const targetId = e.target.getAttribute('aria-controls');
            if (!targetId) return;
            
            const targetTab = document.getElementById(targetId);
            if (!targetTab) return;
            
            // Buscar ID do setor e subsetor (se houver)
            const setorId = targetTab.getAttribute('data-setor-id');
            const subsetorId = targetTab.getAttribute('data-subsetor-id');
            
            if (setorId) {
                // Atualizar a barra de progresso para esta tab
                if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
                    setTimeout(() => {
                        ImplantacaoUI.atualizarBarraProgressoComAnimacao(targetId, subsetorId);
                    }, 100);
                }
            }
        });
    });
    
    // Atualizar progresso para a tab inicial
    setTimeout(() => {
        const activeTab = document.querySelector('.tab-pane.active');
        if (activeTab) {
            const tabId = activeTab.id;
            const subsetorId = activeTab.getAttribute('data-subsetor-id');
            
            if (tabId && typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
                ImplantacaoUI.atualizarBarraProgressoComAnimacao(tabId, subsetorId);
            }
        }
    }, 500);
});

/**
 * Helper function to sanitize a string for use as an element ID
 * @param {string} str The string to sanitize
 * @returns {string} The sanitized string
 */
function sanitizeId(str) {
    // Convert accents to their basic equivalents
    const normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Replace non-alphanumeric chars with underscore
    return normalized.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Updated function to save a new item that includes subsector support
 * @param {string} setorSafe The sanitized sector ID
 * @param {number} setorId The sector ID
 */
function saveNewItemWithSubsector(setorSafe, setorId) {
    const unidade = document.getElementById("unidadeSelect").value;
    const periodo = document.getElementById("periodoId").value;
    const item = document.getElementById(`new_item_name_${setorSafe}`).value;
    const radios = document.getElementsByName(`radio_new_${setorSafe}`);
    const problema = document.getElementById(`new_problema_${setorSafe}`).value;
    let statu = "";
    let naoSeAplica = 0;
    
    // Validations
    if (!item.trim()) {
        ImplantacaoUI.notificarAviso('Informe o nome do novo item.');
        return;
    }
    
    if (!problema.trim()) {
        ImplantacaoUI.notificarAviso('Informe pelo menos um problema para este item.');
        return;
    }
    
    // Check if any option is selected
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            statu = radios[i].value;
            break;
        }
    }
    
    // Get observations
    const observacoes = document.getElementById(`new_observacoes_${setorSafe}`)?.value || "";
    
    // Show loading
    const saveBtn = document.querySelector(`#newItemForm_${setorSafe} .btn-primary`);
    const originalBtnText = saveBtn ? saveBtn.innerHTML : '';
    
    if (saveBtn) {
        saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
        saveBtn.disabled = true;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('action', 'save_item');
    formData.append('unidade_id', unidade);
    formData.append('id_periodo_diagnostico', periodo);
    formData.append('item', item);
    formData.append('setor_id', setorId);
    formData.append('statu', statu);
    formData.append('observacoes', observacoes);
    formData.append('nao_se_aplica', naoSeAplica);
    formData.append('problema', problema);
    
    // Add subsector ID if present
    if (currentSubsetorId) {
        formData.append('subsetor_id', currentSubsetorId);
    }
    
    // Send request
    fetch(ImplantacaoCRUD.getApiUrl(), {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        // Restore button
        if (saveBtn) {
            saveBtn.innerHTML = originalBtnText;
            saveBtn.disabled = false;
        }
        
        // Parse response
        let data;
        try {
            data = JSON.parse(text);
        } catch(e) {
            data = { 
                status: text.includes('sucesso') ? 'Sucesso' : 'Erro', 
                message: text 
            };
        }
        
        if (data.status === 'Sucesso' || data.status === 'Salvo' || data.success === true) {
            // Clear form
            document.getElementById(`new_item_name_${setorSafe}`).value = '';
            document.getElementById(`new_problema_${setorSafe}`).value = '';
            document.getElementById(`new_observacoes_${setorSafe}`).value = '';
            
            // Uncheck radios
            for (let i = 0; i < radios.length; i++) {
                radios[i].checked = false;
            }
            
            // Hide form
            ImplantacaoUI.alternarNovoItem(setorSafe);
            
            // Reload table data
            if (ImplantacaoUI.state.tabulatorTables && ImplantacaoUI.state.tabulatorTables[setorSafe]) {
                ImplantacaoUI.state.tabulatorTables[setorSafe].setData();
            }
            
            // Update progress bar
            ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe, currentSubsetorId);
            
            // Show success message
            ImplantacaoUI.notificarSucesso('Item adicionado com sucesso!');
        } else {
            ImplantacaoUI.notificarErro(data.message || 'Erro ao adicionar o item');
        }
    })
    .catch(error => {
        console.error("Erro ao salvar novo item:", error);
        ImplantacaoUI.notificarErro('Erro ao salvar o item: ' + error.message);
        
        // Restore button
        if (saveBtn) {
            saveBtn.innerHTML = originalBtnText;
            saveBtn.disabled = false;
        }
    });
}

// Add to ImplantacaoUI initialization
const originalInit = ImplantacaoUI.init;
ImplantacaoUI.init = function() {
    // Call the original init function
    originalInit.apply(this, arguments);
    
    // Add subsector loading
    setTimeout(() => {
        // Load sectors with subsectors
        this.loadSetoresWithSubsectors();
        
        // Override saveNewItem to support subsectors
        window.saveNewItem = saveNewItemWithSubsector;
    }, 200);
};

// Global variables to track current sector and subsector
let currentSetorId = null;
let currentSubsetorId = null;