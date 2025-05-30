/**
 * ImplantacaoTabulator - A module for managing Tabulator tables in the Implantacao system
 * 
 * This module follows SOLID principles to handle all Tabulator-related functionality:
 * - Single Responsibility: Each function has one clear purpose
 * - Open/Closed: The module can be extended without modification
 * - Liskov Substitution: All table operations follow consistent patterns
 * - Interface Segregation: Clear interfaces between ImplantacaoUI and this module
 * - Dependency Inversion: Core logic doesn't depend on specific UI implementations
 */

const ImplantacaoTabulator = {
  // State management
  state: {
    tables: {},                // Reference to all Tabulator instances
    translations: {},          // Loaded translations
    defaultLocale: 'pt-br',    // Default locale
    pendingRefresh: new Set(), // Tables pending refresh
    progressBars: {},          // Reference to progress bars
    config: {                  // Configuration settings
      height: "500px",
      minHeight: "400px",
      paginationSize: 15,
      paginationOptions: [10, 15, 25, 50, 100],
      theme: "bootstrap",
      tableClasses: "table table-bordered",
      footerClasses: "bg-light border-top",
      headerClasses: "bg-primary bg-gradient text-white py-2",
      loadingMessage: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>'
    }
  },

  /**
   * Initialize the module
   * @param {Object} options Configuration options
   */
  init: function(options = {}) {
    console.log("Initializing ImplantacaoTabulator module...");
    
    // Merge options with default config
    if (options.config) {
      this.state.config = {...this.state.config, ...options.config};
    }
    
    // Add Bootstrap CSS if not present
    this.ensureThemeCSS();
    
    // Load translations
    this.loadTranslation(this.state.defaultLocale)
      .then(() => {
        console.log("ImplantacaoTabulator initialized successfully");
      })
      .catch(error => {
        console.error("Failed to initialize ImplantacaoTabulator:", error);
      });
      
    return this;
  },

  // =========================================================================
  // INITIALIZATION AND CONFIGURATION
  // =========================================================================

  /**
   * Ensure the Tabulator theme CSS is loaded
   */
  ensureThemeCSS: function() {
    if (!document.getElementById('tabulator-bootstrap-css')) {
      const bootstrapThemeCSS = document.createElement('link');
      bootstrapThemeCSS.rel = 'stylesheet';
      bootstrapThemeCSS.id = 'tabulator-bootstrap-css';
      bootstrapThemeCSS.href = 'https://unpkg.com/tabulator-tables@5.4.4/dist/css/tabulator_bootstrap5.min.css';
      document.head.appendChild(bootstrapThemeCSS);
      console.log("Tabulator Bootstrap theme CSS added");
    }
  },

  /**
   * Load translation for Tabulator
   * @param {string} locale Locale code (e.g., 'pt-br')
   * @returns {Promise} Promise with translation data
   */
  loadTranslation: function(locale) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (this.state.translations[locale]) {
        console.log(`Translation for ${locale} already loaded`);
        resolve(this.state.translations[locale]);
        return;
      }
      
      // API URL to get translations
      const apiUrl = typeof ImplantacaoCRUD?.getApiUrl === 'function' ? 
                   ImplantacaoCRUD.getApiUrl() : 
                   '../../helpers/implantacao_helpers.php';
      
      // Fix: Use a direct path to the translation files instead of string replacement
      const url = `../../js/tabulator-langs/${locale}.json`;
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error loading translation (${response.status}): ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          // Store the loaded translation
          this.state.translations[locale] = data;
          console.log(`Translation loaded for ${locale}`);
          resolve(data);
        })
        .catch(error => {
          console.warn(`Failed to load translation for ${locale}:`, error);
          
          // Create default translation
          const defaultTranslation = this.getDefaultTranslation(locale);
          this.state.translations[locale] = defaultTranslation;
          resolve(defaultTranslation);
        });
    });
  },

  /**
   * Get default translation when language file cannot be loaded
   * @param {string} locale Locale code
   * @returns {Object} Default translation object
   */
  getDefaultTranslation: function(locale) {
    // Default translations
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
   * Initialize Tabulator tables for all sectors
   * @returns {Promise} Promise resolving when all tables are initialized
   */
  initializeTables: function() {
    return new Promise((resolve, reject) => {
      console.log("Initializing Tabulator tables...");
      
      // Make sure we have translations loaded
      this.loadTranslation(this.state.defaultLocale)
        .then(translation => {
          // Create tables with translation
          this.createTablesWithTranslation(translation);
          resolve();
        })
        .catch(error => {
          console.error("Error initializing tables:", error);
          reject(error);
        });
    });
  },

  /**
   * Create Tabulator tables with the loaded translation
   * @param {Object} translation Translation object
   */
  createTablesWithTranslation: function(translation) {
    // Wait to ensure DOM is ready
    setTimeout(() => {
      // Process all sector tabs
      document.querySelectorAll('.tab-pane[data-setor-id]').forEach((tabElement) => {
        const tabId = tabElement.id;
        const setorId = tabElement.getAttribute('data-setor-id');
        
        // Check if table container exists
        const tableContainer = document.getElementById(`tabulator-${tabId}`);
        if (!tableContainer) {
          console.warn(`Table container not found for sector: ${tabId}`);
          return;
        }
        
        // Get unit/period data
        const unidadeId = document.getElementById('unidadeSelect')?.value || "";
        const periodoId = document.getElementById('periodoId')?.value || "";
        
        if (!unidadeId || !periodoId) {
          console.warn("unidadeId or periodoId not found");
          return;
        }
        
        // Set container dimensions
        tableContainer.style.height = this.state.config.height;
        tableContainer.style.width = "100%";

        // Add Bootstrap theme class if not present
        if (!tableContainer.classList.contains('tabulator-bootstrap')) {
          tableContainer.classList.add('tabulator-bootstrap');
        }
        
        // Check if period is frozen
        const isPeriodoCongelado = window.periodoInfo && window.periodoInfo.is_frozen;
        
        // Choose the right URL based on freezing state
        let ajaxURL;
        if (isPeriodoCongelado) {
            ajaxURL = `${ImplantacaoCRUD.getApiUrl()}?action=get_diagnostico_frozen&setor_id=${setorId}&unidade_id=${unidadeId}&periodo_id=${periodoId}`;
            console.log(`[TABULATOR] Using URL for FROZEN period: ${ajaxURL}`);
        } else {
            ajaxURL = `${ImplantacaoCRUD.getApiUrl()}?action=get_itens_tabela&setor_id=${setorId}&unidade_id=${unidadeId}&periodo_id=${periodoId}`;
            console.log(`[TABULATOR] Using URL for NON-frozen period: ${ajaxURL}`);
        }
        
        // Configure Tabulator
        const tabulatorConfig = this.createTableConfig({
          tabId,
          setorId,
          ajaxURL,
          translation,
          isPeriodoExpirado: window.periodoInfo && window.periodoInfo.expirado === true
        });
        
        try {
          // Create the Tabulator instance
          const table = new Tabulator(`#tabulator-${tabId}`, tabulatorConfig);
          
          // Store table reference for later use
          this.state.tables[tabId] = table;
          
          // Add events
          table.on("tableBuilt", () => {
            console.log(`Table built for sector: ${tabId}`);
            
            // Mark tab as loaded
            tabElement.setAttribute('data-loaded', 'true');
            
            // Update progress bar (with small delay)
            setTimeout(() => {
              this.updateProgressBarWithAnimation(tabId);
            }, 100);
          });
          
          // After any render, update the progress bar
          table.on("renderComplete", () => {
            this.updateProgressBarWithAnimation(tabId);
          });
        } catch (e) {
          console.error("Error initializing Tabulator:", e);
          tableContainer.innerHTML = `
            <div class="alert alert-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Error initializing table: ${e.message}
            </div>
          `;
        }
      });
    }, 200);
  },

  /**
   * Create configuration for a Tabulator instance
   * @param {Object} params Parameters for table configuration
   * @returns {Object} Tabulator configuration object
   */
  createTableConfig: function(params) {
    const { tabId, setorId, ajaxURL, translation, isPeriodoExpirado } = params;
    
    return {
      layout: "fitColumns",
      height: this.state.config.height,
      minHeight: this.state.config.minHeight,
      responsiveLayout: "collapse",
      pagination: true,
      paginationSize: this.state.config.paginationSize,
      paginationSizeSelector: this.state.config.paginationOptions,
      
      // Use the custom data loader
      ajaxRequestFunc: (url, config, params) => {
        return this.customDataLoader(ajaxURL, {
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
      ajaxLoaderLoading: this.state.config.loadingMessage,
      placeholder: "Nenhum item encontrado",
      
      // Process AJAX response
      ajaxResponse: function(url, params, response) {
        // Check if we received a string instead of parsed JSON
        if (typeof response === 'string') {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error("Invalid JSON response:", e);
            console.log("Raw response:", response.substring(0, 500));
            return [];
          }
        }
        
        // Check if we received an error object
        if (response && response.error) {
          console.error("API error:", response.error);
          
          // Show error to user if notification system is available
          if (typeof ImplantacaoUI?.notificarErro === 'function') {
            ImplantacaoUI.notificarErro("Erro ao carregar dados: " + response.error);
          }
          return [];
        }
        
        return response;
      },
      
      // Handle AJAX errors
      ajaxError: (error, xhr) => {
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
        const container = document.getElementById(`tabulator-${tabId}`);
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
        
        // Show toast notification if available
        if (typeof ImplantacaoUI?.notificarErro === 'function') {
          ImplantacaoUI.notificarErro('Erro ao carregar dados da tabela: ' + (error.message || 'Erro desconhecido'));
        }
        
        return true; // Prevent default error handling
      },
      
      // Bootstrap theme settings
      theme: this.state.config.theme,
      
      // Add translation
      locale: "pt-br",
      langs: {
        "pt-br": translation
      },

      // Classes for Bootstrap 5 integration
      classes: {
        table: this.state.config.tableClasses,
        tableFooter: this.state.config.footerClasses,
        header: this.state.config.headerClasses
      },

      // Define columns
      columns: this.createColumnsConfig({
        tabId, 
        isPeriodoExpirado
      }),
      
      initialSort: [
        {column: "id", dir: "asc"}
      ],
      
      // Format rows
      rowFormatter: function(row) {
        // Add data-* attributes to row for easier manipulation
        const rowData = row.getData();
        row.getElement().setAttribute("data-item-id", rowData.id);
        
        // Add class for expired periods
        if (isPeriodoExpirado) {
          row.getElement().classList.add("periodo-expirado-item");
        }
        
        if (rowData.diagnostico_id) {
          row.getElement().setAttribute("data-diagnostico-id", rowData.diagnostico_id);
        }
      },
    };
  },

  /**
   * Create column configuration for Tabulator
   * @param {Object} params Configuration parameters
   * @returns {Array} Column configuration array
   */
  createColumnsConfig: function(params) {
    const { tabId, isPeriodoExpirado } = params;
    
    return [
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
        formatter: (cell) => {
          const value = cell.getValue();
          const data = cell.getRow().getData();
          let html = `<div class="fw-bold">${value}</div>`;
          
          // Check using estado_avaliacao field
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
        formatter: (cell) => {
          const data = cell.getRow().getData();
          
          // Check if period is expired to apply different style
          const opacityClass = isPeriodoExpirado ? 'opacity-75' : '';
          
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
        formatter: (cell) => {
          const data = cell.getRow().getData();
          const tabElement = document.querySelector(`#${tabId}`);
          const setorId = tabElement.getAttribute('data-setor-id');
          const periodoId = document.getElementById('periodoId')?.value || "";
          const unidadeId = document.getElementById('unidadeSelect')?.value || "";
          
          let html = '<div class="btn-actions-group">';
          
          // Simple and direct logic to determine if an item was evaluated: 
          // 1. If it has a defined status ("conforme", "nao_conforme", "parcialmente_conforme")
          // 2. OR if it's marked as "not applicable"
          const status = data.status || '';
          const naoAplica = data.nao_aplica === 1;
          
          const foiAvaliado = (status === 'conforme' || 
                                status === 'nao_conforme' || 
                                status === 'parcialmente_conforme' || 
                                naoAplica);
          
          if (isPeriodoExpirado) {
            // For expired periods, show only view icon
            html += `<button class="btn btn-outline-secondary btn-sm" 
                          title="Período expirado - apenas visualização"
                          onclick="window.editarAvaliacao(${data.id}, '${this.escapeString(data.item)}', '${tabId}', ${periodoId}, ${unidadeId}, ${setorId}, ${data.diagnostico_id || data.id})">
                    <i class="fas fa-eye me-1"></i> Visualizar
                  </button>`;
          } else {
            // For non-expired periods
            if (foiAvaliado) {
              // Edit button for evaluated items
              html += `<button class="btn btn-warning btn-sm" onclick="window.editarAvaliacao(${data.id}, '${this.escapeString(data.item)}', '${tabId}', ${periodoId}, ${unidadeId}, ${setorId}, ${data.diagnostico_id || data.id})">`;
              html += '<i class="fas fa-edit me-1"></i> Editar</button>';
            } else {
              // Evaluate button for non-evaluated or pending items
              html += `<button class="btn btn-primary btn-sm" onclick="window.editarAvaliacao(${data.id}, '${this.escapeString(data.item)}', '${tabId}', ${periodoId}, ${unidadeId}, ${setorId})">`;
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
    ];
  },

  /**
   * Escape string for safe use in HTML
   * @param {string} str String to escape
   * @returns {string} Escaped string
   */
  escapeString: function(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  },

  /**
   * Custom data loader for Tabulator with better error handling
   * @param {string} url URL to fetch data from
   * @param {Object} config Fetch configuration
   * @returns {Promise} Promise resolving to data
   */
  customDataLoader: function(url, config) {
    return new Promise((resolve, reject) => {
      // Add cache busting parameter
      const cacheBuster = `_=${Date.now()}`;
      const fullUrl = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
      
      console.log("Loading tabulator data from:", fullUrl);
      
      // Add timeout handling
      const timeoutId = setTimeout(() => {
        reject(new Error("Request timed out after 15 seconds"));
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
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        // First get response as text to help with debugging
        return response.text();
      })
      .then(text => {
        if (!text || text.trim() === '') {
          console.error("Empty response from server");
          resolve([]);
          return;
        }
        
        try {
          // Try to parse JSON
          const jsonData = JSON.parse(text);
          resolve(jsonData);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          console.log("Raw response:", text.substring(0, 500));
          reject(new Error("Invalid JSON response"));
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error("Error loading table data:", error);
        reject(error);
      });
    });
  },

  /**
   * Recalculate Tabulator tables with delay to allow CSS transitions
   */
  recalculateTablesWithDelay: function() {
    clearTimeout(this.recalcTimeout);
    
    this.recalcTimeout = setTimeout(() => {
      // Recalculate layout of Tabulator tables if they exist
      const tables = this.state.tables;
      for (const tabId in tables) {
        if (tables.hasOwnProperty(tabId)) {
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
    }, 300); // Delay to allow CSS transitions to complete
  },

  // =========================================================================
  // TABLE DATA MANIPULATION
  // =========================================================================

  /**
   * Update a specific row in Tabulator after saving
   * @param {Object} itemData Updated data returned by the server
   * @param {string} setorId Sector ID/tab
   * @returns {boolean} True if successful
   */
  updateItemInTable: function(itemData, setorId) {
    // Check if we have a valid Tabulator table
    const table = this.state.tables[setorId];
    if (!table) {
      console.warn(`Tabulator table not found for sector: ${setorId}`);
      return false;
    }
    
    console.log("Data received for update:", itemData);
    
    // First, look for the row by original item ID
    const itemOriginalId = itemData.item_id ? parseInt(itemData.item_id) : (itemData.id ? parseInt(itemData.id) : null);
    if (!itemOriginalId) {
      console.warn("Item ID not found in returned data:", itemData);
      return false;
    }
    
    // Find the row by item ID
    let row = table.getRow(itemOriginalId);
    
    if (row) {
      console.log("Row found, updating:", itemOriginalId);
      
      // Get current row data
      const currentData = row.getData();
      console.log("Current row data:", currentData);
      
      // Prepare data for update
      // IMPORTANT: Preserve original item ID to maintain reference
      let status = itemData.avaliacao_resultado || itemData.status || '';
      let naoSeAplica = parseInt(itemData.nao_se_aplica || 0);
      
      let statusInfo = this.getStatusInfo(status, naoSeAplica);
      
      // Create update object with correct data
      const rowData = {
        // Preserve original ID to maintain table reference
        id: currentData.id,
        // Update status field with new value
        status: status,
        // Ensure values are numbers for consistency
        nao_aplica: naoSeAplica,
        // Ensure we have diagnostico_id
        diagnostico_id: itemData.diagnostico_id ? parseInt(itemData.diagnostico_id) : 
                       (itemData.id ? parseInt(itemData.id) : currentData.diagnostico_id),
        // Update observations
        observacoes: itemData.observacoes || "",
        // Update visual status information
        status_desc: statusInfo.desc,
        status_class: statusInfo.class,
        status_icon: statusInfo.icon,
        // Update evaluation state
        estado_avaliacao: 'avaliado'
      };
      
      console.log("New data for row:", rowData);
      
      // Update the row
      row.update(rowData);
      
      // Wait a moment and redraw the row to ensure button updates
      setTimeout(() => {
        try {
          // Force row redraw
          row.reformat();
          // Force table redraw (optional, may be necessary in some cases)
          table.redraw(false);
        } catch (err) {
          console.error("Error redrawing row/table:", err);
        }
      }, 100);
      
      // Add visual effect for the updated row
      const el = row.getElement();
      
      // Add style for animation if it doesn't exist
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
      
      // Apply animation class
      el.classList.add('row-updated');
      
      // Remove class after animation
      setTimeout(() => {
        el.classList.remove('row-updated');
      }, 1500);
      
      return true;
    } else {
      console.warn("Row not found in table by ID:", itemOriginalId);
      return false;
    }
  },

  /**
   * Get formatting information for status display in Tabulator
   * @param {string} status Item status
   * @param {number|boolean} naoSeAplica Flag indicating if not applicable
   * @returns {Object} Object with formatting information
   */
  getStatusInfo: function(status, naoSeAplica) {
    // Convert to number if string
    if (typeof naoSeAplica === 'string') {
      naoSeAplica = parseInt(naoSeAplica) === 1;
    }
    
    // Ensure status is a valid string
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

  // =========================================================================
  // PROGRESS VISUALIZATION
  // =========================================================================

  /**
   * Update progress bar with animation
   * @param {string} tabId ID of the tab/sector
   * @param {string} subsetorId ID of subsector (optional)
   */
  updateProgressBarWithAnimation: function(tabId, subsetorId = null) {
    try {
      // Ensure LoadingBar.js is loaded
      this.ensureLoadingBarLoaded();
      
      // Verify the tab exists
      const tabElement = document.getElementById(tabId);
      if (!tabElement) {
        console.warn("Tab element not found:", tabId);
        return;
      }
      
      // Get necessary IDs
      const setorId = tabElement.getAttribute('data-setor-id');
      const unidadeId = document.getElementById('unidadeSelect')?.value;
      const periodoId = document.getElementById('periodoId')?.value;
      
      if (!setorId || !unidadeId || !periodoId) {
        console.warn("Missing required ID:", { setorId, unidadeId, periodoId });
        return;
      }
      
      // Get progress container
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
        const stats = this.normalizeProgressData(data);
        
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
          this.createProgressBar(progressContainer, tabId, stats, setorNome, subsetorNome);
          
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
   * Create progress bar using Loading-bar.js
   * @param {HTMLElement} container Container element
   * @param {string} tabId Tab ID
   * @param {Object} data Progress data
   * @param {string} setorNome Sector name
   * @param {string} subsetorNome Subsector name (optional)
   * @returns {HTMLElement} Container with progress bar
   */
  createProgressBar: function(container, tabId, data, setorNome = '', subsetorNome = null) {
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
          this.addMiniStatusBars(container, data);
          
          // Add class for animation
          container.classList.add('pulse-animation');
          
          // Remove animation after a while
          setTimeout(() => {
            container.classList.remove('pulse-animation');
          }, 1500);
          
        } catch (e) {
          console.error("Error creating progress bar with LoadingBar.js:", e);
          this.createFallbackProgressBar(container, data);
        }
      };
      
      // Start initialization
      initLoadingBar();
      
      return container;
      
    } catch (error) {
      console.error("Error creating progress bar:", error);
      
      // In case of error use fallback
      this.createFallbackProgressBar(container, data);
    }
  },

  /**
   * Create a fallback progress bar using Bootstrap
   * @param {HTMLElement} container Container element
   * @param {Object} data Progress data
   */
  createFallbackProgressBar: function(container, data) {
    if (!container) return;
    
    // Clear current content
    container.innerHTML = '';
    
    // Calculate percentage
    const percentConcluido = data.percentual_progresso || 
      (data.total > 0 ? Math.round(((data.total - data.pendentes) / data.total) * 100) : 0);
    
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
   * Normalize progress data to ensure consistent values
   * @param {Object} data Data received from API
   * @returns {Object} Normalized data object
   */
  normalizeProgressData: function(data) {
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
      normalized.pendentes = normalized.total - normalized.conformes - 
                          normalized.nao_conformes - normalized.parcialmente_conformes - 
                          normalized.nao_se_aplica;
      
      if (normalized.pendentes < 0) normalized.pendentes = 0;
      
      // Calculate percentage if not provided
      normalized.percentual_progresso = Math.round(
        ((normalized.total - normalized.pendentes) / normalized.total) * 100
      );
    }
    
    return normalized;
  },

  /**
   * Add mini progress bars for each status
   * @param {HTMLElement} container Container element
   * @param {Object} data Progress data
   */
  addMiniStatusBars: function(container, data) {
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
   * Generate HTML for status icons
   * @param {string} tipo Type of status (success, warning, danger, etc)
   * @param {string} icone Icon name
   * @returns {string} HTML of the icon
   */
  generateStatusIcon: function(tipo, icone) {
    return `<span class="health-icon health-icon-${tipo}" style="background-image: url('../../assets/icons/svg/${icone}.svg')"></span>`;
  },

  /**
   * Generate HTML for the status bar
   * @param {Object} data Progress data
   * @returns {string} HTML of the status bar
   */
  generateStatusBarHTML: function(data) {
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
          ${this.generateStatusIcon('success', 'yes')} Conforme: ${conformes}
        </span>
        <span class="progress-item text-warning">
          ${this.generateStatusIcon('warning', 'alert')} Parcial: ${parcialmenteConformes}
        </span>
        <span class="progress-item text-danger">
          ${this.generateStatusIcon('danger', 'no')} Não Conforme: ${naoConformes}
        </span>
        <span class="progress-item text-secondary">
          ${this.generateStatusIcon('secondary', 'unavailable')} Não se Aplica: ${naoSeAplica}
        </span>
        <span class="progress-item text-muted">
          ${this.generateStatusIcon('secondary', 'circle-medium')} Pendentes: ${pendentes}
        </span>
      </div>
      <div class="progress-text text-center mt-2">
        ${this.generateStatusIcon('info', 'bar-chart')}
        <strong>${pctAvaliados}%</strong> dos itens avaliados
      </div>
    `;
  },

  /**
   * Ensure Loading-bar.js library is loaded
   */
  ensureLoadingBarLoaded: function() {
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
    if (!document.getElementById('loading-bar-js') && typeof ldBar === 'undefined') {
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
        
        /* Fade-in animation for fresh content */
        .fade-in-animation {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

/**
 * Interface with ImplantacaoUI - These functions provide backwards compatibility
 * with the original ImplantacaoUI implementation
 */
window.addEventListener('DOMContentLoaded', () => {
  // Initialize the module when DOM is ready
  ImplantacaoTabulator.init();
  
  // Replace functions in ImplantacaoUI if it exists
  if (typeof ImplantacaoUI !== 'undefined') {
    // Table initialization functions
    ImplantacaoUI.inicializarTabulatorTables = function() {
      return ImplantacaoTabulator.initializeTables();
    };
    
    ImplantacaoUI.criarTabulasComTraducao = function(traducao) {
      return ImplantacaoTabulator.createTablesWithTranslation(traducao);
    };
    
    ImplantacaoUI.recalcularTabulasTabulatorComDelay = function() {
      return ImplantacaoTabulator.recalculateTablesWithDelay();
    };
    
    // Table data manipulation functions
    ImplantacaoUI.atualizarLinhaTabulatorAposSalvar = function(itemData, setorId) {
      return ImplantacaoTabulator.updateItemInTable(itemData, setorId);
    };
    
    ImplantacaoUI.getStatusInfo = function(status, naoSeAplica) {
      return ImplantacaoTabulator.getStatusInfo(status, naoSeAplica);
    };
    
    // Progress bar functions
    ImplantacaoUI.atualizarBarraProgressoComAnimacao = function(tabId, subsetorId) {
      return ImplantacaoTabulator.updateProgressBarWithAnimation(tabId, subsetorId);
    };
    
    ImplantacaoUI.criarProgressBar = function(container, tabId, data, setorNome, subsetorNome) {
      return ImplantacaoTabulator.createProgressBar(container, tabId, data, setorNome, subsetorNome);
    };
    
    ImplantacaoUI.criarBarraFallback = function(container, data) {
      return ImplantacaoTabulator.createFallbackProgressBar(container, data);
    };
    
    ImplantacaoUI.normalizarDadosProgresso = function(data) {
      return ImplantacaoTabulator.normalizeProgressData(data);
    };
    
    ImplantacaoUI.adicionarMiniBarrasStatus = function(container, data) {
      return ImplantacaoTabulator.addMiniStatusBars(container, data);
    };
    
    ImplantacaoUI.gerarHTMLBarraStatus = function(data) {
      return ImplantacaoTabulator.generateStatusBarHTML(data);
    };
    
    ImplantacaoUI.gerarIconeStatus = function(tipo, icone) {
      return ImplantacaoTabulator.generateStatusIcon(tipo, icone);
    };
    
    console.log("ImplantacaoTabulator: Successfully replaced ImplantacaoUI functions");
  }
});
