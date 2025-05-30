/**
 * ImplantacaoLoaders - Module for loading indicators and progress bars
 * This module centralizes loading and progress visualization functionality
 */
const ImplantacaoLoaders = {
    /**
     * Configuration and state
     */
    config: {
        spinnerHtml: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div>',
        loadingTextDefault: 'Carregando...',
        loadingClasses: 'text-center p-3',
        barColors: {
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            secondary: '#6c757d',
            light: '#adb5bd'
        }
    },

    /**
     * Shows a loading indicator in the specified element
     * @param {string|HTMLElement} elementSelector - Element selector or DOM element
     * @param {string} loadingText - Text to display (optional)
     * @param {boolean} replaceContent - Whether to replace existing content (default: true)
     * @returns {void}
     */
    showLoadingIndicator: function(elementSelector, loadingText, replaceContent = true) {
        const container = typeof elementSelector === 'string'
            ? document.querySelector(elementSelector)
            : elementSelector;

        if (!container) {
            console.warn('Loading indicator container not found:', elementSelector);
            return;
        }

        const text = loadingText || this.config.loadingTextDefault;
        const loadingHtml = `
            <div class="${this.config.loadingClasses}">
                ${this.config.spinnerHtml}
                <p class="mt-2">${text}</p>
            </div>
        `;

        if (replaceContent) {
            container.innerHTML = loadingHtml;
        } else {
            const loadingEl = document.createElement('div');
            loadingEl.className = 'loading-overlay';
            loadingEl.innerHTML = loadingHtml;
            container.appendChild(loadingEl);
        }

        // Mark the container as loading
        container.setAttribute('data-loading', 'true');
    },

    /**
     * Hides the loading indicator
     * @param {string|HTMLElement} elementSelector - Element selector or DOM element
     * @returns {void}
     */
    hideLoadingIndicator: function(elementSelector) {
        const container = typeof elementSelector === 'string'
            ? document.querySelector(elementSelector)
            : elementSelector;

        if (!container) {
            console.warn('Loading indicator container not found:', elementSelector);
            return;
        }

        // Remove loading overlays if they exist
        const overlays = container.querySelectorAll('.loading-overlay');
        overlays.forEach(overlay => overlay.remove());

        // Remove loading attribute
        container.removeAttribute('data-loading');
    },

    /**
     * Shows a loading indicator in a modal body
     * @param {string} modalId - ID of the modal
     * @param {string} message - Loading message
     * @returns {void}
     */
    showModalLoading: function(modalId, message) {
        const modalBody = document.querySelector(`#${modalId} .modal-body`);
        if (modalBody) {
            this.showLoadingIndicator(modalBody, message);
        }
    },

    /**
     * Shows a button loading state
     * @param {string|HTMLElement} buttonSelector - Button selector or DOM element
     * @param {string} loadingText - Text to display while loading
     * @returns {string} Original button HTML for restoration
     */
    showButtonLoading: function(buttonSelector, loadingText = 'Carregando...') {
        const button = typeof buttonSelector === 'string'
            ? document.querySelector(buttonSelector)
            : buttonSelector;

        if (!button) {
            console.warn('Button not found:', buttonSelector);
            return '';
        }

        const originalHtml = button.innerHTML;
        const originalClass = button.className;

        // Store original state
        if (!button.hasAttribute('data-original-html')) {
            button.setAttribute('data-original-html', originalHtml);
            button.setAttribute('data-original-class', originalClass);
        }

        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${loadingText}`;

        return originalHtml;
    },

    /**
     * Restores a button from loading state
     * @param {string|HTMLElement} buttonSelector - Button selector or DOM element
     * @returns {void}
     */
    hideButtonLoading: function(buttonSelector) {
        const button = typeof buttonSelector === 'string'
            ? document.querySelector(buttonSelector)
            : buttonSelector;

        if (!button) {
            console.warn('Button not found:', buttonSelector);
            return;
        }

        const originalHtml = button.getAttribute('data-original-html');
        const originalClass = button.getAttribute('data-original-class');

        if (originalHtml) {
            button.innerHTML = originalHtml;
            button.disabled = false;
        }

        if (originalClass) {
            button.className = originalClass;
        }

        // Clean up data attributes
        button.removeAttribute('data-original-html');
        button.removeAttribute('data-original-class');
    },

    /**
     * Normalizes progress data to ensure consistent values
     * @param {Object} data - Progress data from the server
     * @returns {Object} - Normalized data object
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
            // Calculate evaluated items
            if (normalized.avaliados === 0) {
                normalized.avaliados = normalized.conformes + 
                                       normalized.nao_conformes + 
                                       normalized.parcialmente_conformes + 
                                       normalized.nao_se_aplica;
            }
            
            // Calculate pending items
            normalized.pendentes = normalized.total - normalized.avaliados;
            
            // Calculate percentage if not provided
            if (normalized.percentual_progresso === 0) {
                normalized.percentual_progresso = Math.round(
                    (normalized.avaliados / normalized.total) * 100
                );
            }
        }
        
        return normalized;
    },

    /**
     * Generates HTML for status icon
     * @param {string} tipo - Type of status (success, warning, danger, etc)
     * @param {string} icone - Icon name
     * @returns {string} - HTML of the icon
     */
    gerarIconeStatus: function(tipo, icone) {
        return `<span class="health-icon health-icon-${tipo}" style="background-image: url('../../assets/icons/svg/${icone}.svg')"></span>`;
    },

    /**
     * Generates HTML for status bar using icons
     * @param {Object} data - Progress data
     * @returns {string} - HTML of the status bar
     */
    gerarHTMLBarraStatus: function(data) {
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
     * Adds mini progress bars for each status
     * @param {HTMLElement} container - DOM element to add bars to
     * @param {Object} data - Progress data
     * @returns {void}
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
     * Renders a complete progress bar with data visualization
     * @param {HTMLElement} container - Container element
     * @param {string} id - Unique ID for the progress bar
     * @param {Object} data - Progress data
     * @param {string} sectorName - Name of the sector
     * @param {string} subsectorName - Name of subsector (optional)
     * @returns {HTMLElement} - Container element with progress bar
     */
    renderizarBarraProgresso: function(container, id, data, sectorName = '', subsectorName = null) {
        try {
            // Check if container exists
            if (!container) {
                console.error("Container not provided to create progress bar");
                return null;
            }
            
            // Clear any previous content
            container.innerHTML = '';
            
            // Generate a unique ID for LoadingBar
            const progressId = `ldbar-${id}${subsectorName ? '-' + subsectorName.replace(/\s+/g, '-').toLowerCase() : ''}`;
            
            // Normalize data
            const stats = this.normalizarDadosProgresso(data);
            
            // Calculate completion percentage
            const percentConcluido = stats.percentual_progresso || 0;
            
            // Create header with sector/subsector title
            const headerDiv = document.createElement('div');
            headerDiv.className = 'progress-header';
            
            // Title with or without subsector
            let headerHtml = `
                <div>
                    <span class="progress-title">${sectorName || 'Progresso'}</span>
            `;
            
            // Add subsector badge if it exists
            if (subsectorName) {
                headerHtml += `
                    <span class="subsector-badge">
                        <i class="fas fa-layer-group me-1"></i>
                        ${subsectorName}
                    </span>
                `;
            }
            
            headerHtml += `
                </div>
                <div class="progress-subtitle">
                    Total: ${stats.total} itens
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
                    <i class="fas fa-check-circle"></i> Conforme: ${stats.conformes}
                </span>
                <span class="stat-item stat-warning">
                    <i class="fas fa-exclamation-circle"></i> Parcial: ${stats.parcialmente_conformes}
                </span>
                <span class="stat-item stat-danger">
                    <i class="fas fa-times-circle"></i> Não Conforme: ${stats.nao_conformes}
                </span>
                <span class="stat-item stat-secondary">
                    <i class="fas fa-ban"></i> Não se Aplica: ${stats.nao_se_aplica}
                </span>
                <span class="stat-item stat-light">
                    <i class="far fa-circle"></i> Pendentes: ${stats.pendentes}
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
                    this.adicionarMiniBarrasStatus(container, stats);
                    
                    // Add class for animation
                    container.classList.add('pulse-animation');
                    
                    // Remove animation after a while
                    setTimeout(() => {
                        container.classList.remove('pulse-animation');
                    }, 1500);
                    
                } catch (e) {
                    console.error("Error creating progress bar with LoadingBar.js:", e);
                    this.criarBarraFallback(container, stats);
                }
            };
            
            // Start initialization
            initLoadingBar();
            
            return container;
            
        } catch (error) {
            console.error("Error creating progress bar:", error);
            
            // In case of error use fallback
            this.criarBarraFallback(container, data);
            return container;
        }
    },

    /**
     * Creates a fallback progress bar using Bootstrap
     * @param {HTMLElement} container - Container element
     * @param {Object} data - Progress data
     */
    criarBarraFallback: function(container, data) {
        if (!container) return;
        
        // Clear current content
        container.innerHTML = '';
        
        // Normalize data
        const stats = this.normalizarDadosProgresso(data);
        
        // Calculate percentage
        const percentConcluido = stats.percentual_progresso || 0;
        
        // Create Bootstrap progress bar
        const progressDiv = document.createElement('div');
        progressDiv.innerHTML = `
            <div class="progress" style="height: 20px;">
                <div class="progress-bar bg-success" role="progressbar" style="width: ${stats.conformes / stats.total * 100}%" 
                    aria-valuenow="${stats.conformes}" aria-valuemin="0" aria-valuemax="${stats.total}"></div>
                <div class="progress-bar bg-warning" role="progressbar" style="width: ${stats.parcialmente_conformes / stats.total * 100}%" 
                    aria-valuenow="${stats.parcialmente_conformes}" aria-valuemin="0" aria-valuemax="${stats.total}"></div>
                <div class="progress-bar bg-danger" role="progressbar" style="width: ${stats.nao_conformes / stats.total * 100}%" 
                    aria-valuenow="${stats.nao_conformes}" aria-valuemin="0" aria-valuemax="${stats.total}"></div>
                <div class="progress-bar bg-secondary" role="progressbar" style="width: ${stats.nao_se_aplica / stats.total * 100}%" 
                    aria-valuenow="${stats.nao_se_aplica}" aria-valuemin="0" aria-valuemax="${stats.total}"></div>
                <div class="progress-bar bg-light text-dark" role="progressbar" style="width: ${stats.pendentes / stats.total * 100}%" 
                    aria-valuenow="${stats.pendentes}" aria-valuemin="0" aria-valuemax="${stats.total}"></div>
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
                <i class="fas fa-check-circle"></i> Conforme: ${stats.conformes}
            </span>
            <span class="stat-item stat-warning">
                <i class="fas fa-exclamation-circle"></i> Parcial: ${stats.parcialmente_conformes}
            </span>
            <span class="stat-item stat-danger">
                <i class="fas fa-times-circle"></i> Não Conforme: ${stats.nao_conformes}
            </span>
            <span class="stat-item stat-secondary">
                <i class="fas fa-ban"></i> Não se Aplica: ${stats.nao_se_aplica}
            </span>
            <span class="stat-item stat-light">
                <i class="far fa-circle"></i> Pendentes: ${stats.pendentes}
            </span>
        `;
        
        container.appendChild(statsDiv);
    },
    
    /**
     * Initialize loading-bar.js assets
     * @returns {Promise} Promise that resolves when loading-bar.js is loaded
     */
    carregarLoadingBar: function() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (typeof ldBar !== 'undefined') {
                resolve();
                return;
            }
            
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
                
                // Set up onload handler
                script.onload = () => {
                    console.log('Loading-bar.js loaded successfully');
                    resolve();
                };
                
                script.onerror = (error) => {
                    console.error('Error loading loading-bar.js:', error);
                    reject(error);
                };
                
                document.body.appendChild(script);
            } else {
                resolve();
            }
            
            // Add custom styles if they don't exist yet
            this.adicionarEstilosPersonalizados();
        });
    },
    
    /**
     * Adds custom styles for progress bars
     */
    adicionarEstilosPersonalizados: function() {
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
                
                /* Loading overlay */
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255,255,255,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// Provide backward compatibility with old function names
ImplantacaoLoaders.mostrarCarregamento = ImplantacaoLoaders.showLoadingIndicator;
ImplantacaoLoaders.mostrarCarregandoEmContainer = ImplantacaoLoaders.showLoadingIndicator;
ImplantacaoLoaders.esconderIndicadorCarregamento = ImplantacaoLoaders.hideLoadingIndicator;

// Export the module
window.ImplantacaoLoaders = ImplantacaoLoaders;
