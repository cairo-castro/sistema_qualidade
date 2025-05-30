/**
 * ImplantacaoCore.js
 * Core initialization and configuration module for the Implantação system
 * 
 * This module handles:
 * - Core initialization
 * - Library dependencies management
 * - UI configuration
 * - Event handling
 */

const ImplantacaoCore = {
  /**
   * Configuration and state
   */
  config: {
    debug: false,
    loadingDelay: 100,
    iconUpdateDelay: 1000,
    dateFormat: 'DD/MM/YYYY',
    defaultLocale: 'pt-br'
  },
  
  state: {
    initialized: false,
    librariesLoaded: {
      toastr: false,
      select2: false,
      tabulator: false,
      loadingBar: false
    },
    observers: []
  },
  
  /**
   * Initialize the entire system
   * @param {Object} options Configuration options
   */
  init: function(options = {}) {
    // Prevent double initialization
    if (this.state.initialized) {
      console.warn("ImplantacaoCore already initialized. Skipping initialization.");
      return;
    }
    
    console.log("Initializing ImplantacaoCore...");
    
    // Merge options with default config
    Object.assign(this.config, options);

    // First install fallbacks for missing libraries
    this.configurarFallbacks();
    
    // Initialize CRUD if it exists
    if (typeof ImplantacaoCRUD !== 'undefined') {
      ImplantacaoCRUD.init({ debug: this.config.debug });
    } else {
      console.warn("ImplantacaoCRUD not available. Some features may not work.");
    }
    
    // Add styles
    this.adicionarEstilosCabecalho();
    
    // Configure libraries
    this.configurarToastr();
    this.inicializarSelect2();
    this.carregarLoadingBar();
    
    // Initialize global tracking variables for sector/subsector context
    window.currentSetorId = null;
    window.currentSubsetorId = null;
    
    // Initialize core UI components with a delay to ensure DOM is ready
    const self = this;
    setTimeout(function() {
      try {
        // Configure events
        self.configurarEventosFormulario();
        self.configurarEventosTabsUnified();
        
        // Check if period modal should be shown
        self.verificarModalPeriodo();

        // Check if period is expired and apply restrictions if needed
        self.aplicarRestricoesPeriodoExpirado();

        // Add freezing indicators
        self.adicionarIconesCongelamento();
        
        // Observe AdminLTE layout changes
        self.observarMudancasAdminLTE();
        
        console.log("ImplantacaoCore initialization completed successfully");
        self.state.initialized = true;
      } catch (e) {
        console.error("Error during ImplantacaoCore initialization:", e);
      }
    }, this.config.loadingDelay);
  },

  /**
   * Configure fallbacks for missing libraries
   */
  configurarFallbacks: function() {
    // Configure Toastr fallback
    if (typeof toastr === 'undefined') {
      console.warn('Toastr not available. Using fallback implementation.');
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
    
    // Configure Bootstrap modal fallback
    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      console.warn('Bootstrap Modal not available. Using fallback implementation.');
      window.bootstrap = window.bootstrap || {};
      window.bootstrap.Modal = class Modal {
        constructor(element) {
          this.element = element;
        }
        
        show() {
          this.element.style.display = 'block';
          document.body.classList.add('modal-open');
        }
        
        hide() {
          this.element.style.display = 'none';
          document.body.classList.remove('modal-open');
        }
        
        static getInstance(element) {
          return new Modal(element);
        }
      };
    }
  },
  
  /**
   * Add header styles for various UI components
   */
  adicionarEstilosCabecalho: function() {
    // Check if styles already exist
    if (document.getElementById('implantacao-core-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'implantacao-core-styles';
    style.textContent = `
      /* Basic layout */
      .implantacao-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      /* Header styling */
      .implantacao-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      /* Menu styling */
      .tab-scroll-container {
        height: calc(100vh - 150px);
        overflow-y: auto;
        border-right: 1px solid #dee2e6;
        transition: width 0.3s ease;
        background-color: #f8f9fa;
        width: 100%;
      }
      
      /* Compact view */
      .tab-scroll-container.compact-view {
        width: 4.5rem !important;
        overflow: hidden;
      }
      
      .tab-scroll-container.compact-view .setor-header-title span {
        display: none;
      }
      
      /* Menu items */
      .tab-scroll-container .list-group-item {
        border-radius: 0;
        border-right: none;
        transition: all 0.2s ease;
        padding: 0.75rem 1rem;
        border-left: 3px solid transparent;
        margin-bottom: 1px;
        display: flex;
        align-items: center;
      }
      
      .tab-scroll-container .list-group-item:hover {
        background-color: #e9ecef;
      }
      
      .tab-scroll-container .list-group-item.active {
        background-color: rgba(13, 110, 253, 0.1);
        border-left-color: #0d6efd;
        color: #212529;
      }
      
      /* Icon styling */
      .tab-scroll-container .list-group-item i {
        width: 1.25rem;
        text-align: center;
        margin-right: 0.5rem;
      }
      
      /* Badge styling */
      .tab-scroll-container .list-group-item .badge {
        margin-left: auto;
      }
      
      /* Expanded content */
      .col-lg-9.expanded-content {
        width: calc(100% - 4.5rem) !important;
        transition: width 0.3s ease;
      }
      
      /* Animations */
      .fade-in-animation {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      @keyframes fadeIn {
        0% { opacity: 0.7; }
        100% { opacity: 1; }
      }
      
      /* Sector title */
      .setor-title-container {
        padding: 0.5rem 0;
        margin-bottom: 1rem;
        border-bottom: 1px solid #dee2e6;
      }
      
      .setor-title {
        color: #495057;
        font-size: 1.25rem;
        margin-bottom: 0;
        font-weight: 500;
        display: flex;
        align-items: center;
      }
      
      .setor-title i {
        color: #6c757d;
        margin-right: 0.5rem;
      }
      
      /* Period expired banner */
      .periodo-expirado-banner {
        background-color: #f8d7da;
        color: #721c24;
        padding: 0.75rem 1rem;
        margin-bottom: 1rem;
        border: 1px solid #f5c6cb;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
      }
      
      .periodo-expirado-banner .icon-container {
        margin-right: 1rem;
        font-size: 1.5rem;
      }
      
      /* Period frozen indicator */
      .periodo-congelado-banner {
        margin-bottom: 1rem;
      }
      
      /* Status icons */
      .status-congelamento {
        color: #ffc107;
        font-size: 0.9rem;
      }
      
      /* Mobile adaptations */
      @media (max-width: 991.98px) {
        .setor-header {
          cursor: pointer;
        }
        
        .tab-scroll-container,
        .tab-scroll-container.compact-view {
          width: 100% !important;
          margin-bottom: 1rem;
          max-height: 300px;
        }
        
        .col-lg-9,
        .col-lg-9.expanded-content {
          width: 100% !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  },
  
  /**
   * Add custom styles for specific UI elements
   */
  adicionarEstilosPersonalizados: function() {
    // Check if styles already exist
    if (document.getElementById('implantacao-custom-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'implantacao-custom-styles';
    style.textContent = `
      /* Clean header styles */
      .setor-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        padding: 0.75rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .setor-header-title {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        color: #6c757d;
        font-weight: 500;
      }
      
      .setor-header-title i {
        margin-right: 0.5rem;
        font-size: 0.9rem;
        color: #6c757d;
      }
      
      /* Toggle button */
      .toggle-setor-btn {
        border: none;
        background: none;
        color: #6c757d;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.15s ease;
        width: 2rem;
        height: 2rem;
        border-radius: 0.25rem;
      }
      
      .toggle-setor-btn:hover {
        background-color: #e9ecef;
        color: #495057;
      }
      
      /* Health icons styling */
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
      
      /* Tooltips */
      .tooltip {
        z-index: 9999;
      }
      
      .tooltip-inner {
        background-color: #343a40;
        color: #fff;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        max-width: 200px;
        text-align: center;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
      }
      
      /* Formular animation */
      @keyframes highlight-pulse {
        0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
        50% { box-shadow: 0 0 0 8px rgba(13, 110, 253, 0.15); }
        100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
      }
      
      .highlight-pulse {
        animation: highlight-pulse 1s ease;
      }
      
      /* Row update animation */
      @keyframes pulse-highlight {
        0% { background-color: transparent; }
        30% { background-color: rgba(56, 189, 248, 0.2); }
        100% { background-color: transparent; }
      }
      
      .row-updated {
        animation: pulse-highlight 1.5s ease;
      }
      
      /* Pulse button for sync */
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
  },

  /**
   * Check if the period modal should be displayed
   */
  verificarModalPeriodo: function() {
    const modalElement = document.getElementById('periodoModal');
    if (!modalElement) return;
    
    const unidadeSelect = document.getElementById('unidadeSelect');
    if (!unidadeSelect || !unidadeSelect.value) {
      try {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      } catch (e) {
        console.error("Error showing period modal:", e);
      }
    }
  },

  /**
   * Check if the current period is expired
   * @returns {boolean} True if the period is expired
   */
  verificarPeriodoExpirado: function() {
    // Check if we have period info in window.periodoInfo
    if (!window.periodoInfo) {
      console.warn("Period information is not available.");
      return false;
    }
    
    return window.periodoInfo.expirado === true;
  },

  /**
   * Apply restrictions to UI elements when period is expired
   */
  aplicarRestricoesPeriodoExpirado: function() {
    // Check if period is expired
    if (!this.verificarPeriodoExpirado()) {
      return; // Nothing to do if period is not expired
    }
    
    console.log("Applying restrictions for expired period...");
    
    try {
      // 1. Disable all evaluation/edit buttons in tables
      const editButtons = document.querySelectorAll('.btn-primary, .btn-warning');
      editButtons.forEach(button => {
        if (button.innerHTML.includes('Avaliar') || button.innerHTML.includes('Editar')) {
          button.classList.remove('btn-primary', 'btn-warning');
          button.classList.add('btn-secondary');
          button.disabled = true;
          button.title = "Period expired - view only";
          
          // Replace icon and text
          if (button.innerHTML.includes('Avaliar')) {
            button.innerHTML = '<i class="fas fa-eye me-1"></i> Visualizar';
          } else if (button.innerHTML.includes('Editar')) {
            button.innerHTML = '<i class="fas fa-eye me-1"></i> Visualizar';
          }
        }
      });
      
      // 2. Disable the button to add new item
      const addButtons = document.querySelectorAll('button[id^="toggleButton_"]');
      addButtons.forEach(button => {
        button.classList.remove('btn-secondary');
        button.classList.add('btn-outline-secondary');
        button.disabled = true;
        button.title = "Cannot add items to an expired period";
      });
      
      // 3. Disable sync buttons
      const syncButtons = document.querySelectorAll('#btnShowSyncModal');
      syncButtons.forEach(button => {
        button.disabled = true;
        button.title = "Cannot sync items in an expired period";
      });
      
      // 4. Add visual warning at the top of the page
      if (!document.querySelector('.periodo-expirado-banner')) {
        const banner = document.createElement('div');
        banner.className = 'periodo-expirado-banner';
        banner.innerHTML = `
          <div class="icon-container">
            <i class="fas fa-lock"></i>
          </div>
          <div class="content">
            <h5>Expired Period</h5>
            <p class="mb-0">This period is expired. Data is available for viewing only and cannot be edited.</p>
          </div>
        `;
        
        // Insert banner at the top of the page
        const contentHeader = document.querySelector('.content-header');
        if (contentHeader) {
          contentHeader.parentNode.insertBefore(banner, contentHeader.nextSibling);
        }
      }
      
      // 5. Override the global editarAvaliacao function
      this._overrideAbrirModalAvaliacao();
      
      console.log("Restrictions applied successfully.");
    } catch (e) {
      console.error("Error applying restrictions for expired period:", e);
    }
  },
  
  /**
   * Override the evaluation modal opening function to check for expired period
   */
  _abrirModalAvaliacaoOriginal: null,
  
  _overrideAbrirModalAvaliacao: function() {
    if (!this._abrirModalAvaliacaoOriginal) {
      // Check if the function exists in the object or global scope
      if (typeof this.abrirModalAvaliacao === 'function') {
        this._abrirModalAvaliacaoOriginal = this.abrirModalAvaliacao;
      } else if (typeof window.editarAvaliacao === 'function') {
        this._abrirModalAvaliacaoOriginal = window.editarAvaliacao;
      } else if (typeof ImplantacaoUI?.abrirModalAvaliacao === 'function') {
        this._abrirModalAvaliacaoOriginal = ImplantacaoUI.abrirModalAvaliacao;
      } else {
        console.warn("Original modal open function not found.");
        return;
      }
    }
    
    // Override the object method
    if (typeof this.abrirModalAvaliacao === 'function') {
      const self = this;
      this.abrirModalAvaliacao = function() {
        // Check if period is expired
        if (self.verificarPeriodoExpirado()) {
          // Replace with view-only mode
          if (typeof self.abrirModalVisualizacao === 'function') {
            self.abrirModalVisualizacao.apply(this, arguments);
          } else if (typeof ImplantacaoUI?.abrirModalVisualizacao === 'function') {
            ImplantacaoUI.abrirModalVisualizacao.apply(this, arguments);
          } else {
            console.warn("View-only modal function not available");
            self._abrirModalAvaliacaoOriginal.apply(this, arguments);
          }
        } else {
          // Call original function if not expired
          self._abrirModalAvaliacaoOriginal.apply(this, arguments);
        }
      };
    }
    
    // Override the global function
    if (typeof window.editarAvaliacao === 'function') {
      const originalFunc = window.editarAvaliacao;
      window.editarAvaliacao = function() {
        // Check if period is expired
        if (ImplantacaoCore.verificarPeriodoExpirado()) {
          // Replace with view-only mode
          if (typeof ImplantacaoCore.abrirModalVisualizacao === 'function') {
            ImplantacaoCore.abrirModalVisualizacao.apply(this, arguments);
          } else if (typeof ImplantacaoUI?.abrirModalVisualizacao === 'function') {
            ImplantacaoUI.abrirModalVisualizacao.apply(this, arguments);
          } else {
            console.warn("View-only modal function not available");
            originalFunc.apply(this, arguments);
          }
        } else {
          // Call original function if not expired
          originalFunc.apply(this, arguments);
        }
      };
    }
  },

  /**
   * Add freezing indicators (lock icons) to indicate frozen periods
   */
  adicionarIconesCongelamento: function() {
    // Check if we have period info
    if (!window.periodoInfo) return;
    
    // Determine freezing status
    const isFrozen = window.periodoInfo.is_frozen || false;
    
    if (isFrozen) {
      // Add warning banner at the top of the page if it doesn't exist yet
      if (!document.querySelector('.periodo-congelado-banner')) {
        const banner = document.createElement('div');
        banner.className = 'alert alert-warning periodo-congelado-banner';
        banner.innerHTML = `
          <div class="d-flex align-items-center">
            <i class="fas fa-lock fa-2x me-3"></i>
            <div>
              <h5 class="alert-heading">Frozen Period</h5>
              <p class="mb-0">This period is <strong>frozen</strong>. New items cannot be added directly. 
              Use the <i class="fas fa-sync-alt"></i> <strong>Sync Items</strong> option to add new items.</p>
            </div>
          </div>
        `;
        
        // Insert after the header, before the main content area
        const contentHeader = document.querySelector('.content-header');
        if (contentHeader) {
          contentHeader.parentNode.insertBefore(banner, contentHeader.nextSibling);
        }
      }
      
      // Add lock icon to the period title
      const periodoTitle = document.querySelector('.card-header h5');
      if (periodoTitle && !periodoTitle.querySelector('.periodo-lock-icon')) {
        const lockIcon = document.createElement('span');
        lockIcon.className = 'periodo-lock-icon ms-2';
        lockIcon.innerHTML = '<i class="fas fa-lock text-warning" title="Frozen period - new items must be synchronized manually"></i>';
        periodoTitle.appendChild(lockIcon);
      }
      
      // Disable buttons to add new item in all sectors
      document.querySelectorAll('button[id^="toggleButton_"]').forEach(button => {
        // Change button text and icon
        button.innerHTML = '<i class="fas fa-lock me-1"></i> Frozen Period';
        button.classList.remove('btn-secondary');
        button.classList.add('btn-outline-warning');
        button.disabled = true;
        button.title = 'This period is frozen. To add new items, use the Sync Items option.';
      });
      
      // Highlight sync button
      const syncButton = document.getElementById('btnShowSyncModal');
      if (syncButton) {
        syncButton.classList.remove('btn-outline-warning');
        syncButton.classList.add('btn-warning');
        syncButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i><strong>Sync Items</strong>';
        
        // Add pulsing class to draw attention
        if (!syncButton.classList.contains('pulse-button')) {
          syncButton.classList.add('pulse-button');
        }
      }
    }
    
    // Add freezing icons in the period selection list
    this.adicionarIconesCongelamentoNaLista();
  },

  /**
   * Add freezing icons to the period selection list
   */
  adicionarIconesCongelamentoNaLista: function() {
    // Find period select
    const periodosSelect = document.getElementById('periodoSelect') || 
                          document.getElementById('unidadeSelectModal');
    if (!periodosSelect) return;
    
    // Get all options in the select
    const opcoes = periodosSelect.querySelectorAll('option');
    
    // Function to determine if a period is frozen by its text
    function isPeriodoCongelado(texto) {
      // Heuristic - if you have actual data about which periods are frozen,
      // you should use that data instead
      return texto.includes('[Congelado]') || texto.includes('[C]') || texto.includes('🔒');
    }
    
    // Add icons to options (except the first one which is usually "Select")
    for (let i = 1; i < opcoes.length; i++) {
      const opcao = opcoes[i];
      const textoOriginal = opcao.textContent;
      
      // Check if this option is a frozen period and doesn't have the icon yet
      if (isPeriodoCongelado(textoOriginal) && !textoOriginal.includes('🔒')) {
        opcao.textContent = '🔒 ' + textoOriginal;
      }
      // If it's not already marked as frozen but it is frozen according to data
      else if (window.periodosCongelados && 
              window.periodosCongelados.includes(Number(opcao.value)) && 
              !textoOriginal.includes('🔒')) {
        opcao.textContent = '🔒 ' + textoOriginal;
      }
    }
  },

  /**
   * Add freezing text to the period information
   */
  adicionarTextoCongelamento: function() {
    // Check if we have period info
    if (!window.periodoInfo) return;
    
    // Get period information
    const isFrozen = window.periodoInfo.is_frozen || false;
    
    // Get the period title element
    const periodoTitle = document.querySelector('.card-header h5');
    if (!periodoTitle) return;
    
    // Add frozen text if needed
    if (isFrozen && !periodoTitle.textContent.includes('[Congelado]')) {
      periodoTitle.textContent += ' [Congelado]';
    }
  },

  /**
   * Observe changes to AdminLTE state to sync our interface
   */
  observarMudancasAdminLTE: function() {
    // Check if observer already exists
    if (this.state.observers.adminLTE) {
      return;
    }
    
    // Create new MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // When AdminLTE changes its classes, adapt our interface
          this.atualizarLayoutBaseadoNoAdminLTE();
        }
      });
    });
    
    // Start observing body
    observer.observe(document.body, { attributes: true });
    
    // Store reference to observer
    this.state.observers.adminLTE = observer;
    
    // Do initial check
    this.atualizarLayoutBaseadoNoAdminLTE();
  },
  
  /**
   * Update layout based on current AdminLTE state
   */
  atualizarLayoutBaseadoNoAdminLTE: function() {
    // Check if AdminLTE sidebar is collapsed
    const isAdminLTECollapsed = document.body.classList.contains('sidebar-collapse');
    
    // Select relevant elements
    const tabScrollContainer = document.querySelector('.tab-scroll-container');
    const contentContainer = document.querySelector('.col-lg-9');
    
    if (!tabScrollContainer || !contentContainer) {
      return;
    }
    
    // Update CSS style based on AdminLTE state
    if (isAdminLTECollapsed) {
      // When AdminLTE is collapsed, adjust sizes
      tabScrollContainer.classList.add('compact-view');
      contentContainer.classList.add('expanded-content');
      
      // Hide text in menu items, leaving only icons
      this._ajustarItensMenu(true);
    } else {
      // When AdminLTE is expanded, restore original sizes
      tabScrollContainer.classList.remove('compact-view');
      contentContainer.classList.remove('expanded-content');
      
      // Restore full text in menu items
      this._ajustarItensMenu(false);
    }
    
    // Recalculate Tabulator tables layout if they exist
    this._recalcularTabulasTabulatorComDelay();
  },
  
  /**
   * Adjust menu items to show only icons or full text
   * @param {boolean} apenasIcones If true, show only icons
   * @private
   */
  _ajustarItensMenu: function(apenasIcones) {
    const menuItems = document.querySelectorAll('.tab-scroll-container .list-group-item');
    
    for (let i = 0; i < menuItems.length; i++) {
      const item = menuItems[i];
      
      if (apenasIcones) {
        // Save original text as data attribute if not already saved
        if (!item.hasAttribute('data-full-text')) {
          const textContent = item.textContent.trim();
          item.setAttribute('data-full-text', textContent);
          
          // Extract icon (assuming it's in the format <i class="..."></i>)
          const html = item.innerHTML;
          const iconMatch = html.match(/<i class="[^"]+"><\/i>/);
          if (iconMatch) {
            const badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
            item.innerHTML = iconMatch[0] + (badgeMatch ? badgeMatch[0] : '');
          }
        }
      } else {
        // Restore full text in menu items
        if (item.hasAttribute('data-full-text')) {
          const fullText = item.getAttribute('data-full-text');
          const html = item.innerHTML;
          const iconMatch = html.match(/<i class="[^"]+"><\/i>/);
          const badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
          
          if (iconMatch) {
            // Rebuild the item with its original text
            item.innerHTML = iconMatch[0] + ' ' + fullText;
            
            // Put back the badge if it exists
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
   * Recalculate Tabulator tables with delay to allow CSS transitions
   * @private
   */
  _recalcularTabulasTabulatorComDelay: function() {
    clearTimeout(this._recalcTimeout);
    
    this._recalcTimeout = setTimeout(() => {
      // Recalculate layout of Tabulator tables if they exist
      if (typeof ImplantacaoUI !== 'undefined' && ImplantacaoUI.state && ImplantacaoUI.state.tabulatorTables) {
        const tables = ImplantacaoUI.state.tabulatorTables;
        for (const tabId in tables) {
          if (Object.hasOwnProperty.call(tables, tabId)) {
            const table = tables[tabId];
            if (table && typeof table.redraw === 'function') {
              try {
                table.redraw(true);
              } catch (e) {
                console.warn("Error redrawing table:", e);
              }
            }
          }
        }
      }
    }, 300); // Delay to allow CSS transitions to complete
  },
  
  /**
   * Configure the Toastr library for notifications
   */
  configurarToastr: function() {
    if (typeof toastr !== 'undefined') {
      // Main configuration - more discreet and fluid
      toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-bottom-right", // Changed to bottom-right to be less intrusive
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2500",           // Reduced time
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": true         // Allow closing by clicking
      };
      
      // Set base class
      toastr.options.toastClass = 'toastr';
      
      // Add custom CSS to make notifications more elegant
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
      
      console.log("Toastr configured for fluid experience");
      this.state.librariesLoaded.toastr = true;
    } else {
      console.warn("Toastr not available for configuration");
    }
  },
  
  /**
   * Verify if Toastr is available and try to load it if needed
   * @returns {boolean} True if Toastr is available
   */
  verificarToastr: function() {
    if (typeof toastr === 'undefined') {
      console.warn("Toastr is not available. Checking if jQuery is loaded...");
      
      if (typeof jQuery === 'undefined') {
        console.error("jQuery is not loaded. Toastr cannot be initialized.");
        return false;
      }
      
      // Try to load Toastr dynamically if jQuery is available
      const toastrScript = document.createElement('script');
      toastrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js';
      toastrScript.async = true;
      
      const toastrCSS = document.createElement('link');
      toastrCSS.rel = 'stylesheet';
      toastrCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css';
      
      document.head.appendChild(toastrCSS);
      document.head.appendChild(toastrScript);
      
      console.log("Attempting to load Toastr dynamically...");
      
      // Set timeout to check if Toastr was loaded
      setTimeout(() => {
        if (typeof toastr !== 'undefined') {
          this.configurarToastr();
          this.state.librariesLoaded.toastr = true;
        }
      }, 500);
      
      return false;
    }
    
    // If Toastr exists but has not been configured
    if (!toastr.options || Object.keys(toastr.options).length === 0) {
      this.configurarToastr();
    }
    
    return true;
  },
  
  /**
   * Initialize Select2 on select elements
   */
  inicializarSelect2: function() {
    if (typeof $.fn.select2 !== 'undefined') {
      $('#unidadeSelectModal, #unidadeInput, #periodoSelect').select2({
        width: '100%',
        placeholder: "Select an option",
        allowClear: true,
        dropdownParent: $('#periodoModal'),
        minimumResultsForSearch: 0
      });
      
      this.state.librariesLoaded.select2 = true;
    } else {
      console.warn("Select2 library not available");
    }
  },
  
  /**
   * Load Loading-bar.js assets
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
      script.onload = () => {
        this.state.librariesLoaded.loadingBar = true;
      };
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
   * Load Tabulator translation from a JSON file
   * @param {string} locale Language code (e.g., pt-br)
   * @returns {Promise} Promise with translation data
   */
  carregarTraducaoTabulator: function(locale = 'pt-br') {
    return new Promise((resolve, reject) => {
      // Check if translation is already loaded in memory
      if (window.TabulatorLanguages && window.TabulatorLanguages[locale]) {
        console.log(`Using cached Tabulator translation for ${locale}`);
        resolve(window.TabulatorLanguages[locale]);
        return;
      }
      
      // Try to determine base URL for API
      let baseUrl = '../../';
      if (typeof ImplantacaoCRUD !== 'undefined' && typeof ImplantacaoCRUD.config === 'object') {
        baseUrl = ImplantacaoCRUD.config.baseUrl || baseUrl;
      }
      
      // Load translation file
      fetch(`${baseUrl}js/tabulator-langs/${locale}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error loading translation (${response.status}): ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(`Tabulator translation loaded for ${locale}`);
          
          // Store translation in a global object for later use
          if (!window.TabulatorLanguages) {
            window.TabulatorLanguages = {};
          }
          window.TabulatorLanguages[locale] = data;
          
          this.state.librariesLoaded.tabulatorTranslation = true;
          resolve(data);
        })
        .catch(error => {
          console.error(`Error loading Tabulator translation (${locale}):`, error);
          
          // Resolve with default translation in case of error
          resolve(this.getDefaultTranslation(locale));
        });
    });
  },
  
  /**
   * Get default translation for Tabulator
   * @param {string} locale Language code
   * @returns {Object} Object with default translation
   */
  getDefaultTranslation: function(locale) {
    // Predefined default translations
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
      },
      'en': {
        "data": {
          "loading": "Loading",
          "error": "Error"
        },
        "pagination": {
          "page_size": "Page size",
          "page_title": "Show page",
          "first": "First",
          "first_title": "First page",
          "last": "Last",
          "last_title": "Last page",
          "prev": "Previous",
          "prev_title": "Previous page",
          "next": "Next",
          "next_title": "Next page",
          "all": "All",
          "counter": {
            "showing": "Showing",
            "of": "of",
            "rows": "rows",
            "pages": "pages"
          }
        },
        "headerFilters": {
          "default": "Filter..."
        }
      }
    };
    
    return translations[locale] || translations['en'];
  },
  
  /**
   * Configure form events
   */
  configurarEventosFormulario: function() {
    // Set up "Not applicable" checkbox event
    const naoAplicaCheckbox = document.getElementById('nao_se_aplica');
    
    if (naoAplicaCheckbox) {
      // Remove previous event to avoid duplication
      naoAplicaCheckbox.removeEventListener('change', this._handleNaoAplicaChange);
      
      // Add new event
      naoAplicaCheckbox.addEventListener('change', this._handleNaoAplicaChange);
      
      // Check current state
      this._alternarOpcoesStatus(naoAplicaCheckbox.checked);
    }
    
    // Add save button event
    const saveButton = document.querySelector('#evaluationModal .btn-primary');
    if (saveButton) {
      saveButton.removeEventListener('click', this._handleSaveButtonClick);
      saveButton.addEventListener('click', this._handleSaveButtonClick);
    }
    
    // Add event for form submission
    const form = document.getElementById('evaluationForm');
    if (form) {
      form.removeEventListener('submit', this._handleFormSubmit);
      form.addEventListener('submit', this._handleFormSubmit);
    }
  },
  
  /**
   * Event handler for "Not applicable" checkbox
   * @private
   */
  _handleNaoAplicaChange: function() {
    const isChecked = this.checked;
    ImplantacaoCore._alternarOpcoesStatus(isChecked);
  },
  
  /**
   * Toggle status options based on "Not applicable" checkbox
   * @param {boolean} desativar If true, disable status fields
   * @private
   */
  _alternarOpcoesStatus: function(desativar) {
    const statusRadios = document.querySelectorAll('input[name="status"]');
    statusRadios.forEach(radio => {
      radio.disabled = desativar;
      if (desativar) radio.checked = false;
    });
  },
  
  /**
   * Handle save button click
   * @param {Event} e Click event
   * @private
   */
  _handleSaveButtonClick: function(e) {
    e.preventDefault();
    
    if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.salvarAvaliacao === 'function') {
      ImplantacaoUI.salvarAvaliacao();
    } else {
      console.warn('ImplantacaoUI.salvarAvaliacao not available');
    }
  },
  
  /**
   * Handle form submission
   * @param {Event} e Submit event
   * @private
   */
  _handleFormSubmit: function(e) {
    e.preventDefault();
    
    if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.salvarAvaliacao === 'function') {
      ImplantacaoUI.salvarAvaliacao();
    } else {
      console.warn('ImplantacaoUI.salvarAvaliacao not available');
    }
  },
  
  /**
   * Configure all tab-related events in a unified way
   */
  configurarEventosTabsUnified: function() {
    const self = this;
    const tabs = document.querySelectorAll('a[data-bs-toggle="pill"]');
    
    // Setup click events for tabs
    tabs.forEach(function(tabEl) {
      tabEl.addEventListener('click', function(e) {
        // Prevent default if needed (e.g., for special handling)
        // e.preventDefault();
        
        // Get tab target ID from href or data attribute
        const targetSelector = this.getAttribute('data-bs-target') || this.getAttribute('href');
        if (!targetSelector) return;
        
        const targetId = targetSelector.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) {
          console.warn(`Tab target element not found: ${targetId}`);
          return;
        }
        
        // Store current sector/subsector context
        window.currentSetorId = targetElement.getAttribute('data-setor-id');
        window.currentSubsetorId = targetElement.getAttribute('data-subsetor-id');
        
        // Load data for tab if not loaded yet
        if (targetElement.getAttribute('data-loaded') !== 'true') {
          if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.carregarDadosTabulator === 'function') {
            ImplantacaoUI.carregarDadosTabulator(targetId);
          }
          
          // Display sector title
          const setorNome = tabEl.getAttribute('data-setor-original') || tabEl.textContent.trim();
          
          if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.exibirTituloSetor === 'function') {
            ImplantacaoUI.exibirTituloSetor(targetId, setorNome);
          }
          
          // Mark as loaded
          targetElement.setAttribute('data-loaded', 'true');
        }
      });
    });
    
    // Set up keyboard navigation
    document.addEventListener('keydown', function(e) {
      // Only handle if active element isn't an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }
      
      // Get active tab
      const activeTab = document.querySelector('a.nav-link.active[data-bs-toggle="pill"]');
      if (!activeTab) return;
      
      // Handle arrow keys
      switch (e.key) {
        case 'ArrowUp':
          // Previous tab
          const prevTab = activeTab.closest('li').previousElementSibling?.querySelector('a[data-bs-toggle="pill"]');
          if (prevTab) {
            e.preventDefault();
            prevTab.click();
          }
          break;
        case 'ArrowDown':
          // Next tab
          const nextTab = activeTab.closest('li').nextElementSibling?.querySelector('a[data-bs-toggle="pill"]');
          if (nextTab) {
            e.preventDefault();
            nextTab.click();
          }
          break;
      }
    });
    
    // Handle Bootstrap tab events for any additional initialization
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(function(tabEl) {
      tabEl.addEventListener('shown.bs.tab', function(e) {
        // Get newly activated tab
        const targetId = e.target.getAttribute('href')?.substring(1) || 
                        e.target.getAttribute('data-bs-target')?.substring(1);
        
        // Refresh any Tabulator tables if they exist
        if (typeof ImplantacaoUI !== 'undefined' && 
            ImplantacaoUI.state?.tabulatorTables && 
            ImplantacaoUI.state.tabulatorTables[targetId]) {
          setTimeout(() => {
            try {
              ImplantacaoUI.state.tabulatorTables[targetId].redraw(true);
              
              // Update progress bar if method exists
              if (typeof ImplantacaoUI.atualizarBarraProgressoComAnimacao === 'function') {
                ImplantacaoUI.atualizarBarraProgressoComAnimacao(targetId);
              }
            } catch (err) {
              console.warn("Error redrawing table on tab activation:", err);
            }
          }, 100);
        }
      });
    });
    
    console.log('Tab events configured successfully');
  }
};

// Auto-initialize if this script is loaded after the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => ImplantacaoCore.init(), 0);
} else {
  document.addEventListener('DOMContentLoaded', () => ImplantacaoCore.init());
}
