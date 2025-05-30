/**
 * implantacao-data.js
 * Central module for data operations in the Implantacao module
 * Follows SOLID principles and clean code practices
 */


const ImplantacaoData = {
  /**
   * Configuration settings for data operations
   */
  config: {
    apiUrl: '../../helpers/implantacao_helpers.php',
    defaultTimeout: 15000, // 15 seconds
    retryCount: 1,
    debugMode: false
  },

  /**
   * Initialize the data module
   * @param {Object} options Configuration options
   */
  init: function(options = {}) {
    // Merge configurations
    this.config = {...this.config, ...options};
    
    if (this.config.debugMode) {
      console.log('ImplantacaoData initialized with config:', this.config);
    }
    
    // Detect API URL if not provided
    if (!this.config.apiUrl && typeof ImplantacaoCRUD !== 'undefined' && typeof ImplantacaoCRUD.getApiUrl === 'function') {
      this.config.apiUrl = ImplantacaoCRUD.getApiUrl();
    }
    
    return this;
  },
  
  /**
   * Get the API URL
   * @returns {string} The API URL
   */
  getApiUrl: function() {
    return this.config.apiUrl;
  },
  
  /**
   * Log messages in debug mode
   * @param {...any} args Arguments to log
   */
  log: function(...args) {
    if (this.config.debugMode) {
      console.log(...args);
    }
  },
  
  /**
   * Enhanced fetch with timeout and error handling
   * @param {string} url URL to fetch
   * @param {Object} options Fetch options
   * @returns {Promise} Promise with the response
   */
  fetchWithTimeout: function(url, options = {}) {
    const { timeout = this.config.defaultTimeout } = options;
    
    this.log(`Fetching from: ${url}`);
    
    return new Promise((resolve, reject) => {
      // Create timeout promise
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
      
      // Default headers
      const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(options.headers || {})
      };
      
      // Make the request
      fetch(url, {
        ...options,
        headers
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
          this.log("Empty response from server");
          resolve({ empty: true, data: [] });
          return;
        }
        
        try {
          const data = JSON.parse(text);
          
          // Check for API error
          if (data && data.error) {
            reject(new Error(data.error));
            return;
          }
          
          resolve(data);
        } catch (e) {
          this.log("JSON parse error:", e, "Raw response:", text.substring(0, 500));
          reject(new Error(`Invalid JSON response: ${e.message}`));
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
  },

  findTabulatorTable: function(sectorName) {
  const setorSafe = this.sanitizeId(sectorName);
  
  // First, try the exact sanitized name
  if (window.ImplantacaoUI?.state?.tabulatorTables?.[setorSafe]) {
    return {
      table: window.ImplantacaoUI.state.tabulatorTables[setorSafe],
      id: setorSafe
    };
  }
  
  // If not found, try to find a table with a similar ID
  if (window.ImplantacaoUI?.state?.tabulatorTables) {
    const tableIds = Object.keys(window.ImplantacaoUI.state.tabulatorTables);
    
    // Try to find a match based on the first part of the ID
    const baseId = setorSafe.split('_')[0];
    
    for (const id of tableIds) {
      if (id.startsWith(baseId)) {
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[id],
          id: id
        };
      }
    }
    
    // If still not found, look for any ID that might contain our base ID
    for (const id of tableIds) {
      if (id.includes(baseId)) {
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[id],
          id: id
        };
      }
    }
    
    // If all else fails, just return the first table as a fallback
    if (tableIds.length > 0) {
      const firstId = tableIds[0];
      console.warn(`Using fallback table ${firstId} for sector ${sectorName}`);
      return {
        table: window.ImplantacaoUI.state.tabulatorTables[firstId],
        id: firstId
      };
    }
  }
  
  // No table found
  console.error(`No Tabulator table found for sector: ${sectorName}`);
  return { table: null, id: null };
},
  
  /**
   * Load items for a sector or subsector
   * @param {number} setorId Sector ID
   * @param {number|null} subsetorId Subsector ID (optional)
   * @param {number} unidadeId Unit ID
   * @param {number} periodoId Period ID
   * @returns {Promise} Promise with the items data
   */
  loadItems: function(setorId, unidadeId, periodoId, subsetorId = null) {
    // Build API URL
  const params = new URLSearchParams({
    action: 'get_itens_tabela',
    setor_id: setorId,
    unidade_id: unidadeId,
    periodo_id: periodoId,
    '_': Date.now() // Cache buster
  });
  
  // Add subsector if provided
  if (subsetorId !== null) {
    params.append('subsetor_id', subsetorId);
  }
  
  const url = `${this.getApiUrl()}?${params.toString()}`;
  console.log(`API Request URL: ${url}`);
  
  // Make the request with improved debugging
  return this.fetchWithTimeout(url)
    .then(data => {
      console.log(`API Response for setor_id=${setorId}, subsetor_id=${subsetorId || 'null'}:`, 
                  Array.isArray(data) ? `${data.length} items` : data);
      
      // If data is already an array, return it
      if (Array.isArray(data)) {
        // Add debugging information for first few items
        if (data.length > 0) {
          console.log("Sample items:", data.slice(0, 2));
        }
        return data;
      }
      
      // If we got an empty response flag
      if (data && data.empty) {
        console.warn("Empty response received from server");
        return [];
      }
      
      // Handle error
      if (data && data.error) {
        console.error("API Error:", data.error);
        throw new Error(data.error);
      }
      
      // Return the data or empty array
      return data || [];
    })
    .catch(error => {
      console.error('Error loading items:', error);
      
      // Try alternative method for frozen periods as a fallback
      if (window.periodoInfo && window.periodoInfo.is_frozen) {
        console.log("Trying alternative method for frozen period...");
        return this.loadItemsFromFrozenDiagnostico(setorId, unidadeId, periodoId, subsetorId);
      }
      
      throw error;
    });
  },
  
  /**
   * Get progress statistics for a sector or subsector
   * @param {number} setorId Sector ID
   * @param {number} unidadeId Unit ID
   * @param {number} periodoId Period ID
   * @param {number|null} subsetorId Subsector ID (optional)
   * @returns {Promise} Promise with the progress data
   */
  getProgress: function(setorId, unidadeId, periodoId, subsetorId = null) {
    // Build API URL
    const params = new URLSearchParams({
      action: 'get_progress',
      setor_id: setorId,
      unidade: unidadeId,
      periodo: periodoId,
      '_': Date.now() // Cache buster
    });
    
    // Add subsector if provided
    if (subsetorId) {
      params.append('subsetor_id', subsetorId);
    }
    
    const url = `${this.getApiUrl()}?${params.toString()}`;
    
    // Make the request
    return this.fetchWithTimeout(url)
      .then(data => {
        // Normalize the data to ensure consistent structure
        return this.normalizeProgressData(data);
      })
      .catch(error => {
        console.error('Error fetching progress:', error);
        // Return default progress data structure in case of error
        return this.getDefaultProgressData();
      });
  },
  
  /**
   * Normalize progress data to ensure consistent structure
   * @param {Object} data Raw progress data
   * @returns {Object} Normalized progress data
   */
  normalizeProgressData: function(data) {
    // Create default structure
    const normalized = this.getDefaultProgressData();
    
    // Merge with provided data if it exists
    if (data && typeof data === 'object') {
      // Check for error first
      if (data.error) {
        normalized.error = data.error;
        return normalized;
      }
      
      // Copy numeric values, ensuring they are numbers
      Object.keys(normalized).forEach(key => {
        if (data[key] !== undefined && key !== 'error') {
          normalized[key] = parseInt(data[key]) || 0;
        }
      });
      
      // Calculate derived values
      if (normalized.total > 0) {
        // Calculate pending if not provided
        if (!data.pendentes) {
          normalized.pendentes = normalized.total - normalized.avaliados - 
                               (data.em_avaliacao || 0);
        }
        
        // Calculate percentage if not provided
        if (!data.percentual_progresso) {
          normalized.percentual_progresso = Math.round(
            (normalized.avaliados / normalized.total) * 100
          );
        }
      }
    }
    
    return normalized;
  },
  
  /**
   * Get default progress data structure
   * @returns {Object} Default progress data
   */
  getDefaultProgressData: function() {
    return {
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
  },
  
  /**
   * Save evaluation data
   * @param {Object} data Evaluation data
   * @returns {Promise} Promise with the response
   */
  saveEvaluation: function(data) {
    if (!data) {
      return Promise.reject(new Error('No data provided for saving evaluation'));
    }
    
    // Ensure action is set
    const formData = new FormData();
    formData.append('action', 'save_evaluation');
    
    // Add all provided data
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Make the request
    return this.fetchWithTimeout(this.getApiUrl(), {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response && (response.success === true || response.status === 'Sucesso')) {
        return response;
      }
      
      throw new Error(response.message || 'Error saving evaluation');
    });
  },
  
  /**
   * Add a new item
   * @param {Object} data New item data
   * @returns {Promise} Promise with the response
   */
  saveNewItem: function(data) {
    if (!data) {
      return Promise.reject(new Error('No data provided for saving new item'));
    }
    
    // Ensure action is set
    const formData = new FormData();
    formData.append('action', 'save_item');
    
    // Add all provided data
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Make the request
    return this.fetchWithTimeout(this.getApiUrl(), {
      method: 'POST',
      body: formData
    })
    .then(response => {
      // Check for success response variations
      const isSuccess = 
        response && (
          response.success === true || 
          response.status === 'Sucesso' || 
          response.status === 'Salvo'
        );
        
      if (isSuccess) {
        return response;
      }
      
      throw new Error(response.message || 'Error saving new item');
    });
  },
  
  /**
   * Update an existing item
   * @param {Object} data Item data to update
   * @returns {Promise} Promise with the response
   */
  updateItem: function(data) {
    if (!data || !data.id) {
      return Promise.reject(new Error('No ID provided for updating item'));
    }
    
    // Ensure action is set
    const formData = new FormData();
    formData.append('action', 'update_saved_item');
    
    // Add all provided data
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Make the request
    return this.fetchWithTimeout(this.getApiUrl(), {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response && response.success === true) {
        return response;
      }
      
      throw new Error(response.message || 'Error updating item');
    });
  },
  
  /**
   * Get a single diagnostico by ID
   * @param {number} id Diagnostico ID
   * @returns {Promise} Promise with the diagnostico data
   */
  getDiagnostico: function(id) {
    if (!id) {
      return Promise.reject(new Error('No diagnostico ID provided'));
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('action', 'get_diagnostico_by_id');
    formData.append('diagnostico_id', id);
    
    // Make the request
    return this.fetchWithTimeout(this.getApiUrl(), {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response && response.error) {
        throw new Error(response.error);
      }
      
      return response;
    });
  },
  
  /**
   * Delete a period and all related diagnosticos
   * @param {number} periodoId Period ID
   * @returns {Promise} Promise with the response
   */
  deletePeriod: function(periodoId) {
    if (!periodoId) {
      return Promise.reject(new Error('No period ID provided'));
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('action', 'delete_period');
    formData.append('periodo_id', periodoId);
    
    // Make the request
    return this.fetchWithTimeout(this.getApiUrl(), {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response && response.success === true) {
        return response;
      }
      
      throw new Error(response.message || 'Error deleting period');
    });
  },
  
  /**
   * Force synchronization of items for a period
   * @param {number} periodoId Period ID
   * @param {number} unidadeId Unit ID
   * @returns {Promise} Promise with the response
   */
  forceSyncItems: function(periodoId, unidadeId) {
    if (!periodoId || !unidadeId) {
      return Promise.reject(new Error('Period ID and Unit ID are required'));
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('action', 'force_sync_items');
    formData.append('periodo_id', periodoId);
    formData.append('unidade_id', unidadeId);
    
    // Make the request
    return this.fetchWithTimeout(this.getApiUrl(), {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response && response.success === true) {
        return response;
      }
      
      throw new Error(response.message || 'Error synchronizing items');
    });
  },
  
  /**
   * Get sectors and subsectors for a unit
   * @param {number} unidadeId Unit ID
   * @returns {Promise} Promise with the sectors data
   */
  getSectorsWithSubsectors: function(unidadeId) {
    if (!unidadeId) {
      return Promise.reject(new Error('No unit ID provided'));
    }
    
    // Build API URL
    const params = new URLSearchParams({
      action: 'get_setores_with_subsectors',
      unidade_id: unidadeId,
      '_': Date.now() // Cache buster
    });
    
    const url = `${this.getApiUrl()}?${params.toString()}`;
    
    // Make the request
    return this.fetchWithTimeout(url)
      .then(data => {
        if (data && data.success === true && Array.isArray(data.setores)) {
          return data.setores;
        }
        
        // If no sectors found, return empty array
        if (data && data.error === 'No sectors found') {
          return [];
        }
        
        throw new Error(data.error || 'Error fetching sectors');
      });
  },
  
  /**
   * Check if a period is frozen
   * @param {number} periodoId Period ID
   * @returns {Promise<boolean>} Promise resolving to the frozen status
   */
  isPeriodFrozen: function(periodoId) {
    if (!periodoId) {
      return Promise.reject(new Error('No period ID provided'));
    }
    
    // Build API URL
    const params = new URLSearchParams({
      action: 'check_period_frozen',
      periodo_id: periodoId,
      '_': Date.now() // Cache buster
    });
    
    const url = `${this.getApiUrl()}?${params.toString()}`;
    
    // Make the request
    return this.fetchWithTimeout(url)
      .then(data => {
        if (data && data.hasOwnProperty('is_frozen')) {
          return Boolean(data.is_frozen);
        }
        
        return false; // Default to not frozen
      })
      .catch(() => false); // Default to not frozen on error
  },
  
  /**
   * Get info about status by code
   * @param {string} status Status code
   * @param {number|boolean} naoSeAplica Flag for "does not apply"
   * @returns {Object} Status information object
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

  findTabulatorTable: function(sectorName) {
  const setorSafe = this.sanitizeId(sectorName);
  
  // First, try the exact sanitized name
  if (window.ImplantacaoUI?.state?.tabulatorTables?.[setorSafe]) {
    return {
      table: window.ImplantacaoUI.state.tabulatorTables[setorSafe],
      id: setorSafe
    };
  }
  
  // If not found, try to find a table with a similar ID
  if (window.ImplantacaoUI?.state?.tabulatorTables) {
    const tableIds = Object.keys(window.ImplantacaoUI.state.tabulatorTables);
    
    // Try to find a match based on the first part of the ID
    const baseId = setorSafe.split('_')[0];
    
    for (const id of tableIds) {
      if (id.startsWith(baseId)) {
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[id],
          id: id
        };
      }
    }
    
    // If still not found, look for any ID that might contain our base ID
    for (const id of tableIds) {
      if (id.includes(baseId)) {
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[id],
          id: id
        };
      }
    }
    
    // If all else fails, just return the first table as a fallback
    if (tableIds.length > 0) {
      const firstId = tableIds[0];
      console.warn(`Using fallback table ${firstId} for sector ${sectorName}`);
      return {
        table: window.ImplantacaoUI.state.tabulatorTables[firstId],
        id: firstId
      };
    }
  }
  
  // No table found
  console.error(`No Tabulator table found for sector: ${sectorName}`);
  return { table: null, id: null };
},
  
  /**
   * Sanitize a string for use as an ID
   * @param {string} str String to sanitize
   * @returns {string} Sanitized string
   */
sanitizeId: function(str) {
  if (!str) return '';
  
  // Convert accents to their basic equivalents
  const normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Replace non-alphanumeric chars with underscore and trim excessive underscores
  const sanitized = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  
  // Limit the length and trim leading/trailing underscores
  return sanitized.replace(/^_+|_+$/g, '').substring(0, 40);
},
  
  /**
   * Escape a string for HTML
   * @param {string} str String to escape
   * @returns {string} Escaped string
   */
  escapeHtml: function(str) {
    if (typeof str !== 'string') return '';
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  
  /**
   * Escape a string for use in JavaScript
   * @param {string} str String to escape
   * @returns {string} Escaped string
   */
  escapeJs: function(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  }
};

// UI Helper functions for integration with the data module

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
  // Create loading indicator if it doesn't exist
  if (!document.getElementById('global-loading-indicator')) {
    const loading = document.createElement('div');
    loading.id = 'global-loading-indicator';
    loading.className = 'position-fixed top-50 start-50 translate-middle bg-white p-3 rounded shadow-lg';
    loading.style.zIndex = '9999';
    loading.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="spinner-border text-primary me-2" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        <span>Carregando dados...</span>
      </div>
    `;
    document.body.appendChild(loading);
  }
  
  document.getElementById('global-loading-indicator').style.display = 'flex';
}



/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
  const loading = document.getElementById('global-loading-indicator');
  if (loading) {
    loading.style.display = 'none';
  }
}

/**
 * Load items for a specific sector
 * @param {number} setorId Sector ID
 */
function loadSetorItems(setorId) {
  // Get required IDs from the page
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
  
  // Get sector name for display
  const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
  const setorNome = setorElement ? 
                   (setorElement.getAttribute('data-setor-original') || setorElement.textContent.trim()) : 
                   'Setor';
  
  // Update breadcrumb
  if (typeof updateSectorBreadcrumb === 'function') {
    updateSectorBreadcrumb(setorNome);
  }
  
  // Show loading indicator
  showLoadingIndicator();
  
  // Clear current subsector context
  window.currentSubsetorId = null;
  window.currentSetorId = setorId;
  
  // Load items data
  ImplantacaoData.loadItems(setorId, unidadeId, periodoId)
    .then(data => {
      hideLoadingIndicator();
      
      // Get the sanitized sector ID for the table
      const setorSafe = ImplantacaoData.sanitizeId(setorNome);
      
      // Update the table with data
      if (typeof updateItemsTable === 'function') {
        updateItemsTable(data, setorSafe);
      }
      
      // Update progress bar
      if (window.ImplantacaoUI && typeof window.ImplantacaoUI.atualizarBarraProgressoComAnimacao === 'function') {
        window.ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe);
      }
    })
    .catch(error => {
      hideLoadingIndicator();
      console.error('Error loading sector items:', error);
      
      if (typeof ImplantacaoUI?.notificarErro === 'function') {
        ImplantacaoUI.notificarErro(`Erro ao carregar itens: ${error.message}`);
      } else {
        alert(`Erro ao carregar itens: ${error.message}`);
      }
    });
}



/**
 * Load items for a specific subsector with improved error handling
 * @param {number} setorId Sector ID
 * @param {number} subsetorId Subsector ID
 */
function loadSubsetorItems(setorId, subsetorId) {
  try {
    // Get required IDs from the page
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
    
    // Get sector/subsector names for display
    const setorElement = document.querySelector(`[data-setor-id="${setorId}"][data-bs-toggle="collapse"]`);
    const subsetorElement = document.querySelector(`[data-setor-id="${setorId}"][data-subsetor-id="${subsetorId}"]`);
    
    const setorNome = setorElement ? 
                    (setorElement.getAttribute('data-setor-original') || setorElement.textContent.trim()) : 
                    'Setor';
    const subsetorNome = subsetorElement ? subsetorElement.textContent.trim() : 'Subsetor';
    
    console.log(`Loading subsector items for: Sector=${setorNome}, Subsector=${subsetorNome}`);
    console.log(`Sector ID: ${setorId}, Subsector ID: ${subsetorId}`);
    
    // Update breadcrumb
    if (typeof updateSectorBreadcrumb === 'function') {
      updateSectorBreadcrumb(setorNome, subsetorNome);
    }
    
    // Show loading indicator
    showLoadingIndicator();
    
    // Save context for later use
    window.currentSetorId = setorId;
    window.currentSubsetorId = subsetorId;
    
    // Fetch data with the updated API parameters
    ImplantacaoData.loadItems(setorId, unidadeId, periodoId, subsetorId)
      .then(data => {
        hideLoadingIndicator();
        
        // Get the sanitized sector ID for the table
        const setorSafe = ImplantacaoData.sanitizeId(setorNome);
        
        // Update the table with data
        if (typeof updateItemsTable === 'function') {
          updateItemsTable(data, setorSafe, subsetorId);
        }
        
        // Update progress bar
        if (window.ImplantacaoUI && typeof window.ImplantacaoUI.atualizarBarraProgressoComAnimacao === 'function') {
          window.ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe, subsetorId);
        }
        
        // Mark the subsector link as active
        if (subsetorElement) {
          // Remove active class from all links
          document.querySelectorAll('.subsector-link, .list-group-item').forEach(el => {
            if (!el.getAttribute('data-bs-toggle')) {
              el.classList.remove('active');
            }
          });
          
          // Add active class to this link
          subsetorElement.classList.add('active');
        }
      })
      .catch(error => {
        hideLoadingIndicator();
        console.error('Error loading subsector items:', error);
        
        if (typeof ImplantacaoUI?.notificarErro === 'function') {
          ImplantacaoUI.notificarErro(`Erro ao carregar itens: ${error.message}`);
        } else {
          alert(`Erro ao carregar itens: ${error.message}`);
        }
      });
  } catch (error) {
    console.error('Unexpected error in loadSubsetorItems:', error);
    hideLoadingIndicator();
    
    if (typeof ImplantacaoUI?.notificarErro === 'function') {
      ImplantacaoUI.notificarErro(`Erro inesperado: ${error.message}`);
    } else {
      alert(`Erro inesperado: ${error.message}`);
    }
  }
}

/**
 * Update breadcrumb navigation
 * @param {string} setorNome Sector name
 * @param {string} subsetorNome Subsector name (optional)
 */
function updateSectorBreadcrumb(setorNome, subsetorNome = null) {
  const breadcrumbContainers = document.querySelectorAll('.periodo-info');
  
  breadcrumbContainers.forEach(container => {
    if (!container) return;
    
    let html = `
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item">${ImplantacaoData.escapeHtml(setorNome)}</li>`;
    
    if (subsetorNome) {
      html += `<li class="breadcrumb-item active" aria-current="page">${ImplantacaoData.escapeHtml(subsetorNome)}</li>`;
    }
    
    html += `</ol>
      </nav>`;
    
    container.innerHTML = html;
  });
}

/**
 * Update items table with data - enhanced with safe table operations
 * @param {Array} data Items data
 * @param {string} setorSafe Sanitized sector ID
 * @param {number} subsetorId Subsector ID (optional)
 */
function updateItemsTable(data, setorSafe, subsetorId = null) {
  // Ensure data is always an array
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid data received, using empty array");
    data = [];
  }
  
  // Handle adding subsector info to items if needed
  if (subsetorId && data.length > 0) {
    data.forEach(item => {
      if (!item.hasOwnProperty('subsetor_id') || item.subsetor_id === null) {
        item.subsetor_id = subsetorId;
      }
    });
  }
  
  // Track current context for form submissions
  window.currentContext = {
    setorSafe: setorSafe,
    setorId: window.currentSetorId,
    subsetorId: window.currentSubsetorId
  };
  
  // Use our new safe table update method
  ImplantacaoData.safeUpdateTable(setorSafe, data, {
    waitForInit: true,
    waitTimeout: 3000,
    retryCount: 5
  })
  .then(success => {
    console.log(`Table ${setorSafe} updated successfully with ${data.length} items`);
    
    // Update progress bar after successful table update
    if (window.ImplantacaoUI && typeof window.ImplantacaoUI.atualizarBarraProgressoComAnimacao === 'function') {
      window.ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe, subsetorId);
    }
    
    return true;
  })
  .catch(error => {
    console.error(`Error updating table ${setorSafe}:`, error);
    
    // Try to find any container to show an error message
    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab) {
      // Add an error message to the active tab
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger mt-3';
      errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle me-2"></i>
        <strong>Erro:</strong> Problema ao carregar dados da tabela: ${error.message}
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="window.location.reload()">
          <i class="fas fa-sync-alt me-1"></i> Recarregar página
        </button>
      `;
      
      // Add the error message if it doesn't exist already
      if (!activeTab.querySelector('.alert-danger')) {
        activeTab.prepend(errorDiv);
      }
    }
    
    return false;
  });
}

/**
 * Save evaluation data for new structure
 */
function saveEvaluation() {
  // Get values from form with validation
  let formData = {};
  try {
    // Helper functions
    const getValue = (id, defaultValue = '') => {
      const element = document.getElementById(id);
      return element ? element.value : defaultValue;
    };
    
    const getChecked = (id) => {
      const element = document.getElementById(id);
      return element && element.checked ? 1 : 0;
    };
    
    const getRadioValue = (name) => {
      const radios = document.getElementsByName(name);
      for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
          return radios[i].value;
        }
      }
      return '';
    };
    
    // Get form values
    formData = {
      item_id: getValue('item_id'),
      diagnostico_id: getValue('diagnostico_id'),
      item: getValue('item_name'),
      observacoes: getValue('observacoes'),
      nao_se_aplica: getChecked('nao_se_aplica'),
      setor_id: getValue('setor_id'),
      unidade_id: getValue('unidade_id'),
      periodo_id: getValue('periodo_id'),
      subsetor_id: getValue('subsetor_id') || window.currentSubsetorId // Include subsetor_id
    };
    
    // Get status from radio buttons
    formData.status = getRadioValue('status');
    
    // Validation
    if (!formData.item_id) {
      throw new Error('ID do item não informado');
    }
     // Validar subsetor_id - agora é obrigatório na nova estrutura
    if (!formData.subsetor_id) {
      throw new Error('ID do subsetor não informado');
    }
    
    // If "Não se aplica" is checked, status should be empty
    if (formData.nao_se_aplica) {
      formData.status = '';
    } else if (!formData.status) {
      throw new Error('Selecione um status para o item ou marque como "Não se aplica"');
    }
  } catch (e) {
    if (typeof ImplantacaoUI?.mostrarFeedbackNoFormulario === 'function') {
      ImplantacaoUI.mostrarFeedbackNoFormulario('error', e.message);
    } else {
      alert(e.message);
    }
    return;
  }
  
  // Disable save button to prevent multiple clicks
  const saveButton = document.querySelector('#evaluationModal .btn-primary');
  const originalButtonHTML = saveButton ? saveButton.innerHTML : '';
  const originalButtonClass = saveButton ? saveButton.className : '';
  
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
  }
  
  // Show feedback in form
  if (typeof ImplantacaoUI?.mostrarFeedbackNoFormulario === 'function') {
    ImplantacaoUI.mostrarFeedbackNoFormulario('info', 'Salvando dados...');
  }
  
  // Save evaluation with the revised data structure
  ImplantacaoData.saveEvaluation(formData)
    .then(response => {
      // Show success feedback in form
      if (typeof ImplantacaoUI?.mostrarFeedbackNoFormulario === 'function') {
        ImplantacaoUI.mostrarFeedbackNoFormulario('success', 'Avaliação salva com sucesso!');
      }
      
      // Highlight success button temporarily
      if (saveButton) {
        saveButton.innerHTML = '<i class="fas fa-check me-1"></i> Salvo';
        saveButton.classList.remove('btn-primary');
        saveButton.classList.add('btn-success');
      }
      
      // Create updated item object for row update
      const itemAtualizado = {
        id: response.diagnostico_id || formData.diagnostico_id || formData.item_id,
        item_id: formData.item_id,
        statu: formData.status,
        observacoes: formData.observacoes,
        nao_se_aplica: formData.nao_se_aplica,
        estado_avaliacao: 'avaliado',
        setor_id: formData.setor_id,
        subsetor_id: formData.subsetor_id
      };
      
      // Wait a moment for user to see success message
      setTimeout(() => {
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('evaluationModal'));
        if (modal) {
          modal.hide();
        }
        
        try {
          // Try to update specific row in the table
          const updated = typeof ImplantacaoUI?.atualizarLinhaTabulatorAposSalvar === 'function' ? 
            ImplantacaoUI.atualizarLinhaTabulatorAposSalvar(itemAtualizado, formData.setor_name || '') : 
            false;
          
          // If specific row update failed, reload the entire table
          if (!updated) {
            console.log("Could not update specific row. Reloading the entire table.");
            
            // Find the context to determine which items to reload
            const context = window.currentContext || {};
            
            if (context.setorId) {
              // If we have a subsetor, reload subsetor items
              if (context.subsetorId || formData.subsetor_id) {
                loadSubsetorItems(context.setorId, context.subsetorId || formData.subsetor_id);
              } else {
                // Otherwise reload sector items
                loadSetorItems(context.setorId);
              }
            } else {
              // If no context available, try to reload current table
              const tabulator = window.ImplantacaoUI?.state?.tabulatorTables?.[formData.setor_name];
              if (tabulator) {
                tabulator.replaceData();
              }
            }
          }
          
          // Update progress bar
          if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
            ImplantacaoUI.atualizarBarraProgressoComAnimacao(
              formData.setor_name, 
              formData.subsetor_id
            );
          }
          
          // Show discrete notification after modal closes
          if (typeof ImplantacaoUI?.mostrarToast === 'function') {
            ImplantacaoUI.mostrarToast('success', 'Item avaliado com sucesso', {
              timeOut: 2000,
              positionClass: "toast-bottom-right",
              progressBar: true
            });
          }
          
          // Restore original button state for future interactions
          if (saveButton) {
            setTimeout(() => {
              saveButton.disabled = false;
              saveButton.innerHTML = originalButtonHTML || 'Salvar';
              saveButton.className = originalButtonClass || 'btn btn-primary';
            }, 100);
          }
        } catch (e) {
          console.error("Error updating table:", e);
          if (typeof ImplantacaoUI?.mostrarToast === 'function') {
            ImplantacaoUI.mostrarToast('error', 'Erro ao atualizar a tabela: ' + e.message);
          }
        }
      }, 800);
    })
    .catch(error => {
      console.error("Error saving evaluation:", error);
      
      // Show error in form
      if (typeof ImplantacaoUI?.mostrarFeedbackNoFormulario === 'function') {
        ImplantacaoUI.mostrarFeedbackNoFormulario('error', error.message || 'Erro ao salvar avaliação');
      }
      
      // Restore button
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.innerHTML = originalButtonHTML || 'Salvar';
        saveButton.className = originalButtonClass || 'btn btn-primary';
      }
    });
}

/**
 * Função para salvar novo item - adaptada para nova estrutura
 * @param {string} setorSafe Sanitized sector ID
 * @param {number} setorId Sector ID
 */
function saveNewItem(setorSafe, setorId) {
  // Verificar se temos o subsetorId
  const subsetorId = window.currentSubsetorId;
  
  if (!subsetorId) {
    if (typeof ImplantacaoUI?.notificarAviso === 'function') {
      ImplantacaoUI.notificarAviso('É necessário selecionar um subsetor para adicionar um item.');
    } else {
      alert('É necessário selecionar um subsetor para adicionar um item.');
    }
    return;
  }
  
  // Get IDs and values
  const unidade = document.getElementById("unidadeSelect").value;
  const periodo = document.getElementById("periodoId").value;
  const item = document.getElementById(`new_item_name_${setorSafe}`).value;
  const radios = document.getElementsByName(`radio_new_${setorSafe}`);
  const problema = document.getElementById(`new_problema_${setorSafe}`)?.value || '';
  let statu = "";
  let naoSeAplica = 0;
  
  // Validations
  if (!item.trim()) {
    if (typeof ImplantacaoUI?.notificarAviso === 'function') {
      ImplantacaoUI.notificarAviso('Informe o nome do novo item.');
    } else {
      alert('Informe o nome do novo item.');
    }
    return;
  }
  
  if (!problema.trim()) {
    if (typeof ImplantacaoUI?.notificarAviso === 'function') {
      ImplantacaoUI.notificarAviso('Informe pelo menos um problema para este item.');
    } else {
      alert('Informe pelo menos um problema para este item.');
    }
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
  
  // Prepare data with the new structure
  const itemData = {
    unidade_id: unidade,
    id_periodo_diagnostico: periodo,
    item: item,
    setor_id: setorId,
    subsetor_id: subsetorId, // Incluir o subsetor_id
    status: statu,
    observacoes: observacoes,
    nao_se_aplica: naoSeAplica,
    problema: problema
  };
  
  // Save the item
  ImplantacaoData.saveNewItem(itemData)
    .then(response => {
      // Restore button
      if (saveBtn) {
        saveBtn.innerHTML = originalBtnText;
        saveBtn.disabled = false;
      }
      
      // Clear form and hide it
      document.getElementById(`new_item_name_${setorSafe}`).value = '';
      document.getElementById(`new_problema_${setorSafe}`).value = '';
      document.getElementById(`new_observacoes_${setorSafe}`).value = '';
      
      // Uncheck all radios
      for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
      }
      
      // Hide form
      if (typeof ImplantacaoUI?.alternarNovoItem === 'function') {
        ImplantacaoUI.alternarNovoItem(setorSafe);
      } else if (typeof toggleNewItem === 'function') {
        toggleNewItem(setorSafe);
      }
      
      // Reload table
      if (window.ImplantacaoUI?.state?.tabulatorTables?.[setorSafe]) {
        window.ImplantacaoUI.state.tabulatorTables[setorSafe].setData();
      }
      
      // Update progress
      if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
        ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe, subsetorId);
      }
      
      // Show success notification
      if (typeof ImplantacaoUI?.notificarSucesso === 'function') {
        ImplantacaoUI.notificarSucesso('Item adicionado com sucesso!');
      } else {
        alert('Item adicionado com sucesso!');
      }
    })
    .catch(error => {
      console.error("Error saving new item:", error);
      
      // Restore button
      if (saveBtn) {
        saveBtn.innerHTML = originalBtnText;
        saveBtn.disabled = false;
      }
      
      // Show error notification
      if (typeof ImplantacaoUI?.notificarErro === 'function') {
        ImplantacaoUI.notificarErro(error.message || 'Erro ao adicionar o item');
      } else {
        alert(error.message || 'Erro ao adicionar o item');
      }
    });
}

/**
 * Edit an item in the modal
 * @param {number} itemId Item ID
 * @param {string} itemName Item name
 * @param {string} status Current status
 * @param {string} observacoes Observations
 * @param {number} naoSeAplica "Does not apply" flag
 */
function editItem(itemId, itemName, status, observacoes, naoSeAplica) {
  // Ensure itemId is valid
  if (itemId === undefined || itemId === null) {
    console.error("Item ID not defined");
    return;
  }
  
  // Ensure data types
  itemName = itemName || "";
  status = status || "";
  observacoes = observacoes || "";
  
  // Convert naoSeAplica to boolean
  naoSeAplica = parseInt(naoSeAplica) === 1;
  
  // Get form elements
  const idInput = document.getElementById('edit_item_id');
  const nameInput = document.getElementById('edit_item_name');
  const displayEl = document.getElementById('edit_item_display');
  const obsInput = document.getElementById('edit_observacoes');
  const naoSeAplicaCheckbox = document.getElementById('edit_nao_se_aplica');
  const conformeRadio = document.getElementById('edit_conforme');
  const naoConformeRadio = document.getElementById('edit_nao_conforme');
  const parcialRadio = document.getElementById('edit_parcialmente_conforme');
  
  // Ensure all elements exist
  if (!idInput || !nameInput || !displayEl || !obsInput || !naoSeAplicaCheckbox || 
      !conformeRadio || !naoConformeRadio || !parcialRadio) {
    console.error("Form elements not found");
    return;
  }
  
  // Fill form
  idInput.value = itemId;
  nameInput.value = itemName;
  displayEl.textContent = itemName;
  obsInput.value = observacoes;
  
  // Set "Does not apply" checkbox
  naoSeAplicaCheckbox.checked = naoSeAplica;
  
  // Set status radio based on current status if "Does not apply" is not checked
  if (!naoSeAplica) {
    conformeRadio.checked = (status === 'conforme');
    naoConformeRadio.checked = (status === 'nao_conforme');
    parcialRadio.checked = (status === 'parcialmente_conforme');
  } else {
    // If "Does not apply" is checked, uncheck all status radios
    conformeRadio.checked = false;
    naoConformeRadio.checked = false;
    parcialRadio.checked = false;
  }
  
  // Disable status radios if "Does not apply" is checked
  toggleStatusRadios(naoSeAplica);
  
  // Show modal
  const modalElement = document.getElementById('editItemModal');
  if (modalElement) {
    try {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } catch (e) {
      console.error("Error opening modal:", e);
      if (typeof ImplantacaoUI?.mostrarToast === 'function') {
        ImplantacaoUI.mostrarToast('error', 'Erro ao abrir modal: ' + e.message);
      }
    }
  }
}

/**
 * Toggle status radio buttons based on "Does not apply" checkbox
 * @param {boolean} disable Whether to disable the radios
 */
function toggleStatusRadios(disable) {
  const statusRadios = document.querySelectorAll('input[name="edit_status"]');
  statusRadios.forEach(radio => {
    radio.disabled = disable;
  });
}

/**
 * Save edited item from modal
 */
function saveEditedItem() {
  // Get form data
  const id = document.getElementById('edit_item_id').value;
  const status = document.querySelector('input[name="edit_status"]:checked')?.value || '';
  const naoSeAplica = document.getElementById('edit_nao_se_aplica').checked ? 1 : 0;
  const observacoes = document.getElementById('edit_observacoes').value || '';
  
  // Validation
  if (!id) {
    if (typeof ImplantacaoUI?.mostrarToast === 'function') {
      ImplantacaoUI.mostrarToast('error', 'ID do item não informado');
    } else {
      alert('ID do item não informado');
    }
    return;
  }
  
  // If "Does not apply" is checked, status should be empty
  let finalStatus = status;
  if (naoSeAplica) {
    finalStatus = '';
  } else if (!finalStatus) {
    if (typeof ImplantacaoUI?.mostrarToast === 'function') {
      ImplantacaoUI.mostrarToast('warning', 'Selecione um status ou marque "Não se aplica"');
    } else {
      alert('Selecione um status ou marque "Não se aplica"');
    }
    return;
  }
  
  // Show loading on button
  const saveBtn = document.getElementById('saveEditedItemBtn');
  const originalBtnText = saveBtn ? saveBtn.innerHTML : '';
  
  if (saveBtn) {
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
    saveBtn.disabled = true;
  }
  
  // Prepare data
  const itemData = {
    id: id,
    status: finalStatus,
    nao_se_aplica: naoSeAplica,
    observacoes: observacoes
  };
  
  // Save the item
  ImplantacaoData.updateItem(itemData)
    .then(data => {
      // Restore button
      if (saveBtn) {
        saveBtn.innerHTML = originalBtnText;
        saveBtn.disabled = false;
      }
      
      // Close modal
      const modalElement = document.getElementById('editItemModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
      
      // Show success notification
      if (typeof ImplantacaoUI?.mostrarToast === 'function') {
        ImplantacaoUI.mostrarToast('success', 'Item atualizado com sucesso!');
      } else {
        alert('Item atualizado com sucesso!');
      }
      
      // Update saved items list
      if (typeof ImplantacaoUI?.atualizarItensSalvosDoModal === 'function') {
        ImplantacaoUI.atualizarItensSalvosDoModal();
      }
      
      // Update main table
      const mainModal = document.getElementById('savedItemsModal');
      if (mainModal) {
        const setorSafe = mainModal.getAttribute('data-setor-safe');
        
        // Prepare data for row update
        const itemAtualizado = {
          id: parseInt(id),
          statu: finalStatus,
          observacoes: observacoes,
          nao_se_aplica: naoSeAplica
        };
        
        // Try to update just the specific row
        if (setorSafe) {
          const updated = typeof ImplantacaoUI?.atualizarLinhaTabulatorAposSalvar === 'function' ? 
            ImplantacaoUI.atualizarLinhaTabulatorAposSalvar(itemAtualizado, setorSafe) : 
            false;
          
          // If row update failed, reload entire table
          if (!updated && window.ImplantacaoUI?.state?.tabulatorTables?.[setorSafe]) {
            window.ImplantacaoUI.state.tabulatorTables[setorSafe].setData();
          }
          
          // Update progress bar
          if (typeof ImplantacaoUI?.atualizarBarraProgressoComAnimacao === 'function') {
            ImplantacaoUI.atualizarBarraProgressoComAnimacao(setorSafe);
          }
        }
      }
    })
    .catch(error => {
      console.error("Error updating item:", error);
      
      // Restore button
      if (saveBtn) {
        saveBtn.innerHTML = originalBtnText;
        saveBtn.disabled = false;
      }
      
      // Show error notification
      if (typeof ImplantacaoUI?.mostrarToast === 'function') {
        ImplantacaoUI.mostrarToast('error', error.message || 'Erro ao atualizar o item');
      } else {
        alert(error.message || 'Erro ao atualizar o item');
      }
    });
}

/**
 * Delete a period and all related diagnosticos
 */
function excluirPeriodo() {
  // Get period ID and confirmation
  const periodoId = document.getElementById('periodoExcluirSelect').value;
  const confirmaExclusao = document.getElementById('confirmarExclusao').checked;
  
  // Validation
  if (!periodoId) {
    if (typeof ImplantacaoUI?.notificarAviso === 'function') {
      ImplantacaoUI.notificarAviso('Selecione um período para excluir.');
    } else {
      alert('Selecione um período para excluir.');
    }
    return;
  }
  
  if (!confirmaExclusao) {
    if (typeof ImplantacaoUI?.notificarAviso === 'function') {
      ImplantacaoUI.notificarAviso('Você precisa confirmar a exclusão marcando a caixa de seleção.');
    } else {
      alert('Você precisa confirmar a exclusão marcando a caixa de seleção.');
    }
    return;
  }
  
  // Show loading on button
  const btnExcluir = document.getElementById('btnExcluirPeriodo');
  const originalBtnText = btnExcluir ? btnExcluir.innerHTML : '';
  
  if (btnExcluir) {
    btnExcluir.disabled = true;
    btnExcluir.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Excluindo...';
  }
  
  // Delete the period
  ImplantacaoData.deletePeriod(periodoId)
    .then(data => {
      // Restore button
      if (btnExcluir) {
        btnExcluir.disabled = false;
        btnExcluir.innerHTML = originalBtnText;
      }
      
      // Clear form
      document.getElementById('periodoExcluirSelect').value = '';
      document.getElementById('confirmarExclusao').checked = false;
      
      // Show success notification
      if (typeof ImplantacaoUI?.notificarSucesso === 'function') {
        ImplantacaoUI.notificarSucesso(data.message || 'Período excluído com sucesso!');
      } else {
        alert(data.message || 'Período excluído com sucesso!');
      }
      
      // Redirect to main page after a short delay
      setTimeout(() => {
        window.location.href = 'implantacao.php';
      }, 2000);
    })
    .catch(error => {
      console.error("Error deleting period:", error);
      
      // Restore button
      if (btnExcluir) {
        btnExcluir.disabled = false;
        btnExcluir.innerHTML = originalBtnText;
      }
      
      // Show error notification
      if (typeof ImplantacaoUI?.notificarErro === 'function') {
        ImplantacaoUI.notificarErro(error.message || 'Erro ao excluir o período.');
      } else {
        alert(error.message || 'Erro ao excluir o período.');
      }
    });
}

/**
 * Force synchronization of items for a frozen period
 */
function forcarSincronizacaoItens() {
  // Check confirmation
  const confirmaSync = document.getElementById('confirmarSincronizacao').checked;
  
  if (!confirmaSync) {
    const resultElement = document.getElementById('sync-result');
    if (resultElement) {
      resultElement.className = 'alert alert-danger mt-3';
      resultElement.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Você precisa confirmar a sincronização marcando a caixa de seleção.';
      resultElement.classList.remove('d-none');
    }
    return;
  }
  
  // Get required IDs
  const periodoId = document.getElementById('periodoId').value;
  const unidadeId = document.getElementById('unidadeSelect').value;
  
  // Show loading on button
  const btnSync = document.getElementById('btnForceSyncItems');
  const originalBtnText = btnSync ? btnSync.innerHTML : '';
  
  if (btnSync) {
    btnSync.disabled = true;
    btnSync.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sincronizando...';
  }
  
  // Hide previous result
  const resultElement = document.getElementById('sync-result');
  if (resultElement) {
    resultElement.classList.add('d-none');
  }
  
  // Force sync items
  ImplantacaoData.forceSyncItems(periodoId, unidadeId)
    .then(data => {
      // Restore button
      if (btnSync) {
        btnSync.disabled = false;
        btnSync.innerHTML = originalBtnText;
      }
      
      // Show result
      if (resultElement) {
        resultElement.className = 'alert alert-success mt-3';
        
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
        
        resultElement.classList.remove('d-none');
        
        // Reload page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    })
    .catch(error => {
      console.error("Error in forced sync:", error);
      
      // Restore button
      if (btnSync) {
        btnSync.disabled = false;
        btnSync.innerHTML = originalBtnText;
      }
      
      // Show error
      if (resultElement) {
        resultElement.className = 'alert alert-danger mt-3';
        resultElement.innerHTML = `
          <i class="fas fa-exclamation-circle me-2"></i>
          <strong>Erro na sincronização:</strong> ${error.message || 'Erro desconhecido'}
        `;
        resultElement.classList.remove('d-none');
      }
    });
}

/**
 * Submit the synchronization form
 */
function submitSyncForm() {
  // Just call the main function
  forcarSincronizacaoItens();
}

// Export global handlers
window.loadSetorItems = loadSetorItems;
window.loadSubsetorItems = loadSubsetorItems;
window.updateSectorBreadcrumb = updateSectorBreadcrumb;
window.updateItemsTable = updateItemsTable;
window.saveEvaluation = saveEvaluation;
window.saveNewItem = saveNewItem;
window.saveEditedItem = saveEditedItem;
window.editItem = editItem;
window.toggleStatusRadios = toggleStatusRadios;
window.excluirPeriodo = excluirPeriodo;
window.forcarSincronizacaoItens = forcarSincronizacaoItens;
window.submitSyncForm = submitSyncForm;
window.showLoadingIndicator = showLoadingIndicator;
window.hideLoadingIndicator = hideLoadingIndicator;

// Initialize on document load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize data module
  ImplantacaoData.init({
    debugMode: false
  });
  
  console.log('ImplantacaoData module initialized');
});
// Setup event listeners for subsector links
document.addEventListener('DOMContentLoaded', function() {
  setupSubsectorLinks();
  
  // Add a MutationObserver to handle dynamically added subsector links
  const observer = new MutationObserver(function(mutations) {
    setupSubsectorLinks();
  });
  
  // Start observing the document body for DOM changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
});

// Function to set up event listeners for subsector links
function setupSubsectorLinks() {
  document.querySelectorAll('.subsector-link').forEach(function(link) {
    // Skip if already has event listener
    if (link.getAttribute('data-has-listener') === 'true') {
      return;
    }
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const setorId = parseInt(this.getAttribute('data-setor-id'), 10);
      const subsetorId = parseInt(this.getAttribute('data-subsetor-id'), 10);
      
      if (setorId && subsetorId) {
        window.loadSubsetorItems(setorId, subsetorId);
      }
    });
    
    // Mark as having listener to avoid duplicates
    link.setAttribute('data-has-listener', 'true');
  });
}
/**
 * Find or create a Tabulator table for a given sector
 * Uses multiple strategies to find the right table
 * @param {string} sectorName Original sector name
 * @param {number} sectorId Numeric sector ID
 * @param {number} subsectorId Optional subsector ID
 * @returns {Object} Object with table and tableId
 */
ImplantacaoData.findOrCreateTabulatorTable = function(sectorName, sectorId, subsectorId = null) {
  // Run diagnostic first
  this.logAvailableTables();
  
  // Sanitize the sector name to create an ID
  const sanitizedId = this.sanitizeId(sectorName);
  console.log(`Looking for table with sanitized ID: ${sanitizedId}`);
  
  // Create all possible variations of the sector ID
  const possibleIds = [
    sanitizedId,
    sanitizedId.replace(/_+/g, '_'),  // Replace multiple underscores with single
    sanitizedId.split('_')[0],        // First part before underscore
    `tab-${sanitizedId}`,             // With tab prefix
    sectorId.toString()               // Numeric ID as string
  ];
  
  // Add more variations based on the sector name
  if (sectorName) {
    possibleIds.push(
      sectorName.toLowerCase().replace(/\s+/g, '_'),
      sectorName.toLowerCase().replace(/\s+/g, ''),
      sectorName.toLowerCase().split(' ')[0]
    );
  }
  
  console.log("Possible table IDs:", possibleIds);
  
  // Strategy 1: Check if any of these IDs exist in the tabulatorTables
  if (window.ImplantacaoUI?.state?.tabulatorTables) {
    const availableIds = Object.keys(window.ImplantacaoUI.state.tabulatorTables);
    
    // Try each possible ID
    for (const id of possibleIds) {
      if (availableIds.includes(id)) {
        console.log(`Found table with ID: ${id}`);
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[id],
          tableId: id
        };
      }
    }
    
    // Strategy 2: Try to find a table that contains our sanitized ID
    for (const availableId of availableIds) {
      if (possibleIds.some(id => availableId.includes(id))) {
        console.log(`Found table with similar ID: ${availableId}`);
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[availableId],
          tableId: availableId
        };
      }
    }
  }
  
  // Strategy 3: Find the tab element for this sector
  let tabElement = null;
  
  // Try to find by data-setor-id
  if (sectorId) {
    tabElement = document.querySelector(`.tab-pane[data-setor-id="${sectorId}"]`);
  }
  
  // Try to find by data-setor-original
  if (!tabElement && sectorName) {
    tabElement = document.querySelector(`.tab-pane[data-setor-original="${sectorName}"]`);
  }
  
  // Try to find by ID containing the sanitized name
  if (!tabElement) {
    const tabElements = document.querySelectorAll('.tab-pane');
    for (const el of tabElements) {
      if (el.id && possibleIds.some(id => el.id.includes(id))) {
        tabElement = el;
        break;
      }
    }
  }
  
  // If we found a tab element, try to find the Tabulator container inside it
  if (tabElement) {
    console.log(`Found tab element with ID: ${tabElement.id}`);
    
    // Find the tabulator container
    const tabulatorContainer = tabElement.querySelector('[id^="tabulator-"]');
    if (tabulatorContainer) {
      const containerIdParts = tabulatorContainer.id.split('-');
      const tableId = containerIdParts.length > 1 ? containerIdParts[1] : tabulatorContainer.id;
      
      console.log(`Found Tabulator container with ID: ${tabulatorContainer.id}, using table ID: ${tableId}`);
      
      // Check if there's a table instance for this container
      if (window.ImplantacaoUI?.state?.tabulatorTables?.[tableId]) {
        return {
          table: window.ImplantacaoUI.state.tabulatorTables[tableId],
          tableId: tableId
        };
      }
      
      // No table instance found, try to create one
      try {
        if (window.Tabulator) {
          console.log(`Creating new Tabulator instance for ID: ${tableId}`);
          
          // Initialize Tabulator
          const table = new Tabulator(`#${tabulatorContainer.id}`, {
            layout: "fitColumns",
            placeholder: "Carregando itens...",
            columns: [
              { title: "ID", field: "id", width: 70 },
              { title: "Item", field: "item" },
              { title: "Status", field: "status_desc", width: 180 },
              { title: "Ações", width: 120 }
            ]
          });
          
          // Store the table
          if (!window.ImplantacaoUI) window.ImplantacaoUI = {};
          if (!window.ImplantacaoUI.state) window.ImplantacaoUI.state = {};
          if (!window.ImplantacaoUI.state.tabulatorTables) window.ImplantacaoUI.state.tabulatorTables = {};
          
          window.ImplantacaoUI.state.tabulatorTables[tableId] = table;
          
          return {
            table: table,
            tableId: tableId
          };
        }
      } catch (error) {
        console.error(`Failed to create Tabulator instance:`, error);
      }
    }
  }
  
  // Strategy 4: Last resort - activate the correct tab and try one more time
  console.log("Trying to activate the correct tab...");
  
  // Try to find and click the tab link
  if (sectorId) {
    const tabLink = document.querySelector(`[data-bs-toggle="pill"][data-setor-id="${sectorId}"]`);
    if (tabLink) {
      console.log("Found tab link, clicking it...");
      tabLink.click();
      
      // Try one more time after a short delay
      return new Promise(resolve => {
        setTimeout(() => {
          // Run the function again after clicking the tab
          const result = this.findOrCreateTabulatorTable(sectorName, sectorId, subsectorId);
          resolve(result);
        }, 100);
      });
    }
  }
  
  // Strategy 5: Ultimate fallback - use any available table
  if (window.ImplantacaoUI?.state?.tabulatorTables) {
    const availableIds = Object.keys(window.ImplantacaoUI.state.tabulatorTables);
    if (availableIds.length > 0) {
      const firstId = availableIds[0];
      console.log(`Using first available table as fallback: ${firstId}`);
      return {
        table: window.ImplantacaoUI.state.tabulatorTables[firstId],
        tableId: firstId
      };
    }
  }
  
  // Nothing worked
  console.error(`Could not find or create a Tabulator table for sector: ${sectorName}`);
  return {
    table: null,
    tableId: null
  };
};
/**
 * Log all available Tabulator tables and tab elements
 * This helps diagnose issues with table matching
 */
ImplantacaoData.logAvailableTables = function() {
  console.log("===== DIAGNOSTIC INFO =====");
  
  // Log all Tabulator tables
  if (window.ImplantacaoUI?.state?.tabulatorTables) {
    const tableIds = Object.keys(window.ImplantacaoUI.state.tabulatorTables);
    console.log(`Available Tabulator tables (${tableIds.length}):`, tableIds);
  } else {
    console.log("No ImplantacaoUI.state.tabulatorTables found");
  }
  
  // Log all tabulator containers in the DOM
  const tabulatorContainers = document.querySelectorAll('[id^="tabulator-"]');
  console.log(`Tabulator containers in DOM (${tabulatorContainers.length}):`, 
    Array.from(tabulatorContainers).map(el => el.id));
  
  // Log all tab panes
  const tabPanes = document.querySelectorAll('.tab-pane');
  console.log(`Tab panes (${tabPanes.length}):`, 
    Array.from(tabPanes).map(el => ({
      id: el.id,
      'data-setor-id': el.getAttribute('data-setor-id'),
      'data-setor-original': el.getAttribute('data-setor-original')
    })));
  
  console.log("==========================");
};
/*
 * Enhanced function to safely update table data with proper initialization checks
 * Resolves race conditions between table creation and data loading
 */
ImplantacaoData.safeUpdateTable = function(tableId, data, options = {}) {
  // Default options
  options = {
    waitForInit: true,
    waitTimeout: 2000,
    retryCount: 3,
    retryDelay: 200,
    ...options
  };
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    // Function to attempt the table update
    const attemptUpdate = () => {
      attempts++;
      
      // Check if we've exceeded retry count
      if (attempts > options.retryCount) {
        console.error(`Failed to update table ${tableId} after ${options.retryCount} attempts`);
        reject(new Error(`Table update retry limit exceeded for ${tableId}`));
        return;
      }
      
      // Find the table
      let table = null;
      
      // First try to get from ImplantacaoUI if available
      if (window.ImplantacaoUI?.state?.tabulatorTables?.[tableId]) {
        table = window.ImplantacaoUI.state.tabulatorTables[tableId];
      }
      
      // Then try to create a new instance if it doesn't exist
      if (!table) {
        const tableContainer = document.getElementById(`tabulator-${tableId}`);
        
        if (tableContainer) {
          try {
            console.log(`Creating new Tabulator instance for ${tableId}`);
            
            // Create a basic Tabulator with minimal config
            table = new Tabulator(`#tabulator-${tableId}`, {
              layout: "fitColumns",
              placeholder: "Carregando itens...",
              columns: [
                { title: "ID", field: "id", width: 70 },
                { title: "Item", field: "item" },
                { title: "Status", field: "status_desc", width: 180 },
                { title: "Ações", width: 120 }
              ]
            });
            
            // Store the table reference
            if (!window.ImplantacaoUI) window.ImplantacaoUI = {};
            if (!window.ImplantacaoUI.state) window.ImplantacaoUI.state = {};
            if (!window.ImplantacaoUI.state.tabulatorTables) window.ImplantacaoUI.state.tabulatorTables = {};
            
            window.ImplantacaoUI.state.tabulatorTables[tableId] = table;
          } catch (error) {
            console.error(`Error creating Tabulator instance for ${tableId}:`, error);
            
            // Try again after a delay
            setTimeout(attemptUpdate, options.retryDelay);
            return;
          }
        } else {
          console.error(`Table container #tabulator-${tableId} not found`);
          reject(new Error(`Table container not found for ${tableId}`));
          return;
        }
      }
      
      // Check if table is initialized
      const isInitialized = table && !table.initialized === false;
      
      if (isInitialized) {
        // Table is initialized, update it safely
        try {
          console.log(`Updating initialized table ${tableId} with ${data.length} items`);
          
          // Use setData instead of replaceData for better error handling
          table.setData(data)
            .then(() => {
              // Optional redraw
              if (options.redrawAfterUpdate) {
                try {
                  table.redraw(false);
                } catch (e) {
                  console.warn(`Non-critical error redrawing table ${tableId}:`, e);
                }
              }
              
              resolve(true);
            })
            .catch(error => {
              console.error(`Error updating table ${tableId}:`, error);
              reject(error);
            });
        } catch (error) {
          console.error(`Error during table ${tableId} update:`, error);
          reject(error);
        }
      } else if (options.waitForInit && attempts <= options.retryCount) {
        // Wait for initialization
        console.log(`Table ${tableId} not initialized, waiting... (attempt ${attempts}/${options.retryCount})`);
        
        // Store the data for when the table is ready
        if (!window._pendingTableData) window._pendingTableData = {};
        window._pendingTableData[tableId] = data;
        
        // Set up a one-time event listener for tableBuilt if we can
        if (table && typeof table.on === 'function') {
          table.on("tableBuilt", function tableBuiltHandler() {
            // Remove this handler to prevent duplicates
            table.off("tableBuilt", tableBuiltHandler);
            
            console.log(`Table ${tableId} built, applying pending data:`, window._pendingTableData[tableId]?.length || 0, "items");
            
            try {
              table.setData(window._pendingTableData[tableId] || [])
                .then(() => {
                  delete window._pendingTableData[tableId];
                  resolve(true);
                })
                .catch(error => {
                  console.error(`Error applying pending data to table ${tableId}:`, error);
                  delete window._pendingTableData[tableId];
                  reject(error);
                });
            } catch (error) {
              console.error(`Error in tableBuilt handler for ${tableId}:`, error);
              reject(error);
            }
          });
        }
        
        // Also set a timeout as backup
        setTimeout(attemptUpdate, options.retryDelay);
      } else {
        // Failed to find an initialized table and not waiting
        reject(new Error(`Table ${tableId} not initialized and not waiting`));
      }
    };
    
    // Start the first attempt
    attemptUpdate();
  });
};
/**
 * Initialize Tabulator tables when needed with proper configuration
 */
ImplantacaoData.initializeTabulatorTables = function() {
  // Find all tabulator containers
  const tabulatorContainers = document.querySelectorAll('[id^="tabulator-"]');
  
  tabulatorContainers.forEach(container => {
    const containerId = container.id;
    const tableId = containerId.replace('tabulator-', '');
    
    // Skip if table is already initialized
    if (window.ImplantacaoUI?.state?.tabulatorTables?.[tableId]) {
      return;
    }
    
    try {
      // Create a basic configuration
      const config = {
        layout: "fitColumns",
        placeholder: "Carregando itens...",
        columns: [
          { title: "ID", field: "id", width: 70 },
          { title: "Item", field: "item" },
          { title: "Status", field: "status_desc", width: 180 },
          { title: "Ações", width: 120 }
        ]
      };
      
      // Initialize the table
      const table = new Tabulator(`#${containerId}`, config);
      
      // Store the reference
      if (!window.ImplantacaoUI) window.ImplantacaoUI = {};
      if (!window.ImplantacaoUI.state) window.ImplantacaoUI.state = {};
      if (!window.ImplantacaoUI.state.tabulatorTables) window.ImplantacaoUI.state.tabulatorTables = {};
      
      window.ImplantacaoUI.state.tabulatorTables[tableId] = table;
      
      console.log(`Initialized table ${tableId}`);
      
      // Check for pending data updates
      if (window._pendingTableData && window._pendingTableData[tableId]) {
        const pendingData = window._pendingTableData[tableId];
        
        table.on("tableBuilt", function() {
          console.log(`Applying pending data to newly built table ${tableId}`);
          table.setData(pendingData);
          delete window._pendingTableData[tableId];
        });
      }
    } catch (error) {
      console.error(`Error initializing Tabulator for ${containerId}:`, error);
    }
  });
};
/**
 * Alternative method to load items from frozen diagnostico table
 * For when the regular API fails with frozen periods
 */
ImplantacaoData.loadItemsFromFrozenDiagnostico = function(setorId, unidadeId, periodoId, subsetorId = null) {
  // Build URL specifically for frozen diagnostico
  const params = new URLSearchParams({
    action: 'get_diagnostico_frozen',
    setor_id: setorId,
    unidade_id: unidadeId,
    periodo_id: periodoId,
    '_': Date.now() // Cache buster
  });
  
  // Add subsector if provided
  if (subsetorId !== null) {
    params.append('subsetor_id', subsetorId);
  }
  
  const url = `${this.getApiUrl()}?${params.toString()}`;
  console.log(`Trying frozen diagnostico API: ${url}`);
  
  return this.fetchWithTimeout(url)
    .then(data => {
      console.log(`Frozen diagnostico response for setor_id=${setorId}, subsetor_id=${subsetorId || 'null'}:`, 
                 Array.isArray(data) ? `${data.length} items` : data);
      
      return Array.isArray(data) ? data : [];
    });
};

/**
 * Check if the database still contains items with nao_se_aplica=1 despite empty results
 * This is a diagnostic function to help identify database inconsistencies
 */
ImplantacaoData.checkForItemsWithDirectQuery = function(setorId, unidadeId, periodoId, subsetorId = null) {
  const params = new URLSearchParams({
    action: 'debug_diagnostico_query',
    setor_id: setorId,
    unidade_id: unidadeId,
    periodo_id: periodoId,
    '_': Date.now()
  });
  
  if (subsetorId !== null) {
    params.append('subsetor_id', subsetorId);
  }
  
  const url = `${this.getApiUrl()}?${params.toString()}`;
  console.log("Checking database directly with:", url);
  
  return this.fetchWithTimeout(url)
    .then(data => {
      console.log("Direct database query results:", data);
      if (data && data.count > 0) {
        console.log(`Found ${data.count} items directly in the database!`);
        
        // Fix the items data for display
        const fixedItems = data.items.map(item => {
          return {
            id: parseInt(item.id),
            item: item.item,
            status: item.status || '',
            nao_aplica: parseInt(item.nao_aplica || 0),
            diagnostico_id: parseInt(item.id), // Use diagnostico ID as the main ID
            observacoes: item.observacoes || '',
            estado_avaliacao: 'avaliado',
            subsetor_id: item.subsetor_id ? parseInt(item.subsetor_id) : null,
            // Add display information
            status_desc: this.getStatusInfo(item.status, item.nao_aplica).desc,
            status_class: this.getStatusInfo(item.status, item.nao_aplica).class,
            status_icon: this.getStatusInfo(item.status, item.nao_aplica).icon
          };
        });
        
        return fixedItems;
      }
      return [];
    })
    .catch(error => {
      console.error("Error checking database directly:", error);
      return [];
    });
};

/**
 * Special handler to get items that don't apply (nao_se_aplica = 1)
 * This is helpful when regular API calls don't return these items
 */
ImplantacaoData.getItemsNaoSeAplica = function(setorId, unidadeId, periodoId, subsetorId = null) {
  // Direct SQL query through our debugging endpoint
  const params = new URLSearchParams({
    action: 'debug_diagnostico_query',
    setor_id: setorId,
    unidade_id: unidadeId,
    periodo_id: periodoId,
    nao_se_aplica: 1, // Only get items with nao_se_aplica = 1
    '_': Date.now()
  });
  
  if (subsetorId !== null) {
    params.append('subsetor_id', subsetorId);
  }
  
  const url = `${this.getApiUrl()}?${params.toString()}`;
  console.log("Getting items with nao_se_aplica=1:", url);
  
  return this.fetchWithTimeout(url)
    .then(data => {
      if (data && data.items && Array.isArray(data.items)) {
        console.log(`Found ${data.items.length} items with nao_se_aplica=1`);
        
        // Process these items for display
        return data.items.map(item => ({
          id: parseInt(item.id),
          item: item.item,
          status: '', // Should be empty for nao_se_aplica items
          nao_aplica: 1,
          diagnostico_id: parseInt(item.id),
          observacoes: item.observacoes || '',
          estado_avaliacao: 'avaliado',
          status_desc: 'Não se aplica',
          status_class: 'bg-secondary',
          status_icon: 'ban',
          subsetor_id: item.subsetor_id ? parseInt(item.subsetor_id) : null
        }));
      }
      return [];
    });
};
/**
 * Checks for and offers to fix data inconsistencies
 */
ImplantacaoData.checkForDataInconsistencies = function() {
  // Skip if we've already checked recently (within 1 hour)
  const lastCheck = localStorage.getItem('lastInconsistencyCheck');
  if (lastCheck && (Date.now() - parseInt(lastCheck)) < 3600000) {
    return Promise.resolve(false);
  }
  
  // Get context
  const unidadeId = document.getElementById('unidadeSelect')?.value;
  const periodoId = document.getElementById('periodoId')?.value;
  
  if (!unidadeId || !periodoId) {
    return Promise.resolve(false);
  }
  
  // Build URL to check for inconsistencies
  const params = new URLSearchParams({
    action: 'debug_diagnostico_query',
    setor_id: '0', // All sectors
    unidade_id: unidadeId,
    periodo_id: periodoId,
    check_inconsistencies: '1',
    '_': Date.now()
  });
  
  const url = `${this.getApiUrl()}?${params.toString()}`;
  console.log("Checking for data inconsistencies:", url);
  
  return this.fetchWithTimeout(url)
    .then(data => {
      // Save check timestamp
      localStorage.setItem('lastInconsistencyCheck', Date.now().toString());
      
      if (data && data.count > 0) {
        console.warn(`Found ${data.count} inconsistent items in database`);
        
        // Show notification to user if notification function exists
        if (typeof ImplantacaoUI?.notificarAviso === 'function') {
          ImplantacaoUI.notificarAviso(
            `Foram encontradas ${data.count} inconsistências no banco de dados. ` +
            `Isto pode causar problemas na exibição dos itens. <br>` +
            `<button class="btn btn-sm btn-warning mt-2" onclick="ImplantacaoData.fixDataInconsistencies()">` +
            `<i class="fas fa-tools me-1"></i> Corrigir dados</button>`,
            { timeOut: 0, extendedTimeOut: 0 }
          );
        }
        
        return true;
      }
      
      return false;
    })
    .catch(error => {
      console.error("Error checking for inconsistencies:", error);
      return false;
    });
};

/**
 * Fixes data inconsistencies in the database
 */
ImplantacaoData.fixDataInconsistencies = function() {
  // Show loading indicator on button if possible
  const fixButton = document.querySelector('.notifyjs-corner button');
  if (fixButton) {
    fixButton.innerHTML = '<i class="fas fa-circle-notch fa-spin me-1"></i> Corrigindo...';
    fixButton.disabled = true;
  }
  
  // Call the fix endpoint
  const params = new URLSearchParams({
    action: 'fix_diagnostico_data',
    '_': Date.now()
  });
  
  const url = `${this.getApiUrl()}?${params.toString()}`;
  console.log("Fixing data inconsistencies:", url);
  
  return this.fetchWithTimeout(url)
    .then(data => {
      console.log("Fix result:", data);
      
      if (data && data.success) {
        // Show success notification
        if (typeof ImplantacaoUI?.notificarSucesso === 'function') {
          ImplantacaoUI.notificarSucesso(
            `${data.message}<br>` +
            `<button class="btn btn-sm btn-primary mt-2" onclick="window.location.reload()">` +
            `<i class="fas fa-sync-alt me-1"></i> Recarregar página</button>`
          );
        }
        
        // Close previous notification
        if (typeof ImplantacaoUI?.fecharNotificacoes === 'function') {
          ImplantacaoUI.fecharNotificacoes();
        }
        
        return true;
      } else {
        throw new Error(data.message || "Erro desconhecido ao corrigir dados");
      }
    })
    .catch(error => {
      console.error("Error fixing inconsistencies:", error);
      
      // Reset button
      if (fixButton) {
        fixButton.innerHTML = '<i class="fas fa-tools me-1"></i> Corrigir dados';
        fixButton.disabled = false;
      }
      
      // Show error
      if (typeof ImplantacaoUI?.notificarErro === 'function') {
        ImplantacaoUI.notificarErro(`Erro ao corrigir dados: ${error.message}`);
      }
      
      return false;
    });
};

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Initialize
  ImplantacaoData.init({
    debugMode: true
  });
  
  // Check for data inconsistencies
  setTimeout(() => {
    ImplantacaoData.checkForDataInconsistencies();
  }, 2000);
  
  console.log('ImplantacaoData module initialized with inconsistency check');
});
// Auto-initialize tables on page load
document.addEventListener('DOMContentLoaded', function() {
  // Ensure we initialize any tables not already handled
  setTimeout(ImplantacaoData.initializeTabulatorTables, 500);
});