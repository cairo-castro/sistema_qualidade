/**
 * ImplantacaoUI_Layout - Module for managing UI layout components
 * Handles sidebar toggle, tab switching, and layout adjustments
 */
const ImplantacaoUI_Layout = (function() {
    // Private variables
    const config = {
        sidebarSelector: '.tab-scroll-container',
        contentSelector: '.col-lg-9',
        collapsedClass: 'implantacao-sidebar-collapsed',
        listItemSelector: '.tab-scroll-container .list-group-item',
        defaultIconSize: '28px',
        collapsedIconSize: '32px',
        transitionDuration: 300, // ms
        toggleButtonId: 'toggle-sidebar-btn',
        sidebarWidth: {
            expanded: '',  // Default/auto
            collapsed: '4.6rem'
        },
        tooltipPlacement: 'right',
        tooltipTrigger: 'hover',
        tabClassName: 'tab-pane',
        sectorTitleClass: 'setor-title-container',
        tabActiveClass: 'active'
    };
    
    // Cache DOM elements for better performance
    let elements = {
        tabScrollContainer: null,
        contentContainer: null,
        toggleButton: null
    };
    
    /**
     * Initialize module and DOM elements
     */
    function init() {
        // Cache DOM elements
        elements.tabScrollContainer = document.querySelector(config.sidebarSelector);
        elements.contentContainer = document.querySelector(config.contentSelector);
        
        // Add event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Create toggle button after DOM is fully loaded
            createToggleButton();
            
            // Initialize tooltips
            initializeTooltips();
            
            // Load first tab
            loadFirstTab();
            
            // Add styles
            addLayoutStyles();
            
            // Check if layout should start collapsed (e.g. from localStorage)
            const shouldStartCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (shouldStartCollapsed) {
                adjustSidebarLayout(true);
            }
        });
        
        // Listen for AdminLTE sidebar changes to sync our sidebar state
        setupAdminLTEObserver();
        
        // Listen for window resize events
        window.addEventListener('resize', debounce(handleWindowResize, 250));
    }
    
    /**
     * Creates the sidebar toggle button
     */
    function createToggleButton() {
        // Check if button already exists
        if (document.getElementById(config.toggleButtonId)) {
            return;
        }
        
        const tabScrollContainer = elements.tabScrollContainer;
        if (!tabScrollContainer) {
            console.warn('Tab scroll container not found for toggle button creation');
            return;
        }
        
        // Create the button
        const toggleButton = document.createElement('button');
        toggleButton.id = config.toggleButtonId;
        toggleButton.className = 'btn btn-sm btn-outline-secondary toggle-sidebar-button';
        toggleButton.setAttribute('type', 'button');
        toggleButton.setAttribute('title', 'Expandir/Recolher Menu');
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Add click event
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check current state
            const isCurrentlyCollapsed = document.body.classList.contains(config.collapsedClass);
            
            // Toggle state
            adjustSidebarLayout(!isCurrentlyCollapsed);
            
            // Remember state in localStorage
            localStorage.setItem('sidebarCollapsed', !isCurrentlyCollapsed);
            
            return false;
        });
        
        // Create a container for positioning the button
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'toggle-sidebar-container';
        
        // Add title "Selecione um setor"
        const sectorTitle = document.createElement('div');
        sectorTitle.className = 'sector-selection-title';
        sectorTitle.innerHTML = 'Selecione um setor';
        
        buttonContainer.appendChild(sectorTitle);
        buttonContainer.appendChild(toggleButton);
        
        // Insert before the list of tabs
        tabScrollContainer.insertBefore(buttonContainer, tabScrollContainer.firstChild);
        
        // Cache the toggle button
        elements.toggleButton = toggleButton;
    }
    
    /**
     * Adjusts layout when sidebar state changes
     * @param {boolean} isCollapsed Whether the sidebar is collapsed
     */
    function adjustSidebarLayout(isCollapsed) {
        const tabScrollContainer = elements.tabScrollContainer;
        const contentContainer = elements.contentContainer;
        
        if (!tabScrollContainer || !contentContainer) {
            console.warn('Required layout elements not found');
            return;
        }
        
        // Update the toggle button icon and title
        const toggleButton = elements.toggleButton || document.getElementById(config.toggleButtonId);
        if (toggleButton) {
            if (isCollapsed) {
                toggleButton.innerHTML = '<i class="fas fa-angle-right"></i>';
                toggleButton.setAttribute('title', 'Expandir Menu');
            } else {
                toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
                toggleButton.setAttribute('title', 'Recolher Menu');
            }
        }
        
        // Apply appropriate classes and styles
        if (isCollapsed) {
            // When sidebar is collapsed
            document.body.classList.add(config.collapsedClass);
            
            tabScrollContainer.style.width = config.sidebarWidth.collapsed;
            contentContainer.style.width = `calc(100% - ${config.sidebarWidth.collapsed})`;
            
            // Hide text in menu items, keep only icons
            adjustMenuItems(true);
            
            // Enable tooltips when collapsed
            enableTooltips();
        } else {
            // When sidebar is expanded
            document.body.classList.remove(config.collapsedClass);
            
            tabScrollContainer.style.width = config.sidebarWidth.expanded;
            contentContainer.style.width = '';
            
            // Restore full text in menu items
            adjustMenuItems(false);
            
            // Disable tooltips when expanded
            disableTooltips();
        }
        
        // Recalculate Tabulator tables
        recalculateTabulatorTables();
    }
    
    /**
     * Adjusts menu items to show only icons or full text
     * @param {boolean} iconsOnly If true, shows only icons
     */
    function adjustMenuItems(iconsOnly) {
        const menuItems = document.querySelectorAll(config.listItemSelector);
        
        menuItems.forEach(item => {
            if (iconsOnly) {
                // Save original text as data attribute if not already saved
                if (!item.hasAttribute('data-full-text')) {
                    const textContent = item.textContent.trim();
                    item.setAttribute('data-full-text', textContent);
                    
                    // Extract the icon and badge (if any)
                    const html = item.innerHTML;
                    const iconMatch = html.match(/<i class="[^"]+"><\/i>/) || 
                                      html.match(/<span class="health-icon[^>]+><\/span>/);
                    
                    const badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
                    
                    if (iconMatch) {
                        item.innerHTML = iconMatch[0] + (badgeMatch ? badgeMatch[0] : '');
                    }
                }
            } else {
                // Restore full text from data attribute
                if (item.hasAttribute('data-full-text')) {
                    const fullText = item.getAttribute('data-full-text');
                    const html = item.innerHTML;
                    
                    // Extract icon and badge
                    const iconMatch = html.match(/<i class="[^"]+"><\/i>/) || 
                                    html.match(/<span class="health-icon[^>]+><\/span>/);
                    
                    const badgeMatch = html.match(/<span class="badge[^>]+>[^<]+<\/span>/);
                    
                    if (iconMatch) {
                        // Rebuild with original text
                        item.innerHTML = iconMatch[0] + ' ' + fullText;
                        
                        // Re-add badge if it existed
                        if (badgeMatch) {
                            item.innerHTML += ' ' + badgeMatch[0];
                        }
                    } else {
                        item.textContent = fullText;
                    }
                }
            }
        });
    }
    
    /**
     * Displays the sector title above the progress bar
     * @param {string} tabId Tab/sector ID
     * @param {string} sectorName Name of the sector to display
     */
    function displaySectorTitle(tabId, sectorName) {
        // Get the tab element
        const tabElement = document.getElementById(tabId);
        if (!tabElement) {
            console.warn(`Tab element not found: ${tabId}`);
            return;
        }
        
        // Get or create the title container
        let titleContainer = tabElement.querySelector(`.${config.sectorTitleClass}`);
        
        if (!titleContainer) {
            // Create the container for the title
            titleContainer = document.createElement('div');
            titleContainer.className = `${config.sectorTitleClass} mb-3`;
            
            // Find where to insert (before progress bar)
            const progressContainer = tabElement.querySelector('.periodo-info');
            if (progressContainer) {
                tabElement.insertBefore(titleContainer, progressContainer);
            } else {
                // If no progress container is found, insert at the beginning
                tabElement.insertBefore(titleContainer, tabElement.firstChild);
            }
        }
        
        // Create title with placeholder icon (will be replaced later)
        titleContainer.innerHTML = `<h4 class="setor-title">
            <i class="fas fa-layer-group me-2"></i>
            ${sectorName || tabId}
        </h4>
        <hr class="mt-2 mb-3">`;
        
        // Try to replace FontAwesome icon with Health Icon
        if (typeof ImplantacaoUI !== 'undefined' && 
            typeof ImplantacaoUI.substituirIconesTitulosSetores === 'function') {
            setTimeout(function() {
                ImplantacaoUI.substituirIconesTitulosSetores(true);
            }, 50);
        }
    }
    
    /**
     * Loads content for the first tab
     */
    function loadFirstTab() {
        const firstTab = document.querySelector(`.nav-link.${config.tabActiveClass}[data-bs-toggle="pill"]`);
        if (!firstTab) {
            console.warn('No active tab found');
            return;
        }
        
        const tabId = firstTab.getAttribute('aria-controls');
        const tabContent = document.getElementById(tabId);
        const sectorName = firstTab.getAttribute('data-setor-original');
        
        if (!tabId || !tabContent) {
            console.warn('Tab content not found for first tab');
            return;
        }
        
        // Display sector title
        displaySectorTitle(tabId, sectorName);
        
        // Load tab content if not already loaded
        if (tabContent.getAttribute("data-loaded") === "false" && 
            typeof ImplantacaoUI !== 'undefined' && 
            typeof ImplantacaoUI.carregarDadosTabulator === 'function') {
            console.log(`Loading content for first tab: ${tabId}`);
            setTimeout(function() {
                ImplantacaoUI.carregarDadosTabulator(tabId);
            }, 300);
        }
    }
    
    /**
     * Toggles the new item form visibility
     * @param {string} sectorId Safe ID of the sector
     */
    function toggleNewItemForm(sectorId) {
        const container = document.getElementById(`newItemContainer_${sectorId}`);
        const btn = document.getElementById(`toggleButton_${sectorId}`);
        
        if (!container || !btn) {
            console.warn(`New item container or button not found for sector: ${sectorId}`);
            return;
        }
        
        const isVisible = container.style.display !== "none" && container.style.display !== "";
        
        if (!isVisible) {
            // Show the form
            container.style.display = "block";
            btn.innerHTML = '<i class="fas fa-minus-circle me-1"></i> Cancelar adição';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-danger');
            
            // Add fade-in animation
            container.classList.add('fade-in');
            
            // Focus on the first input
            setTimeout(() => {
                const firstInput = container.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 100);
        } else {
            // Hide the form
            container.style.display = "none";
            btn.innerHTML = '<i class="fas fa-plus-circle me-1"></i> Adicionar novo item';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-secondary');
            
            // Reset form fields
            resetNewItemForm(sectorId);
        }
    }
    
    /**
     * Reset new item form fields
     * @param {string} sectorId Safe ID of the sector
     */
    function resetNewItemForm(sectorId) {
        // Clear text fields
        const textInputs = [
            `new_item_name_${sectorId}`, 
            `new_observacoes_${sectorId}`
        ];
        
        textInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) input.value = '';
        });
        
        // Uncheck radio buttons
        const radios = document.getElementsByName(`radio_new_${sectorId}`);
        for (let i = 0; i < radios.length; i++) {
            radios[i].checked = false;
        }
    }
    
    /**
     * Initialize tooltips for menu items
     */
    function initializeTooltips() {
        // First check if Bootstrap is available
        if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) {
            console.warn('Bootstrap Tooltip is not available');
            return;
        }
        
        // Destroy any existing tooltips
        destroyExistingTooltips();
        
        // Select all menu items
        const menuItems = document.querySelectorAll(config.listItemSelector);
        
        // Initialize tooltips for each item
        menuItems.forEach(item => {
            try {
                const tooltip = new bootstrap.Tooltip(item, {
                    placement: config.tooltipPlacement,
                    trigger: config.tooltipTrigger,
                    container: 'body'
                });
                
                // Store reference for later disposal
                item.tooltip = tooltip;
                
                // Disable by default (will be enabled when sidebar collapses)
                tooltip.disable();
            } catch (e) {
                console.warn('Error initializing tooltip:', e);
            }
        });
    }
    
    /**
     * Destroy existing tooltips to prevent memory leaks
     */
    function destroyExistingTooltips() {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
            if (element.tooltip) {
                element.tooltip.dispose();
                element.tooltip = null;
            }
        });
    }
    
    /**
     * Enable tooltips when sidebar is collapsed
     */
    function enableTooltips() {
        if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
        
        const menuItems = document.querySelectorAll(config.listItemSelector);
        menuItems.forEach(item => {
            if (item.tooltip) item.tooltip.enable();
        });
    }
    
    /**
     * Disable tooltips when sidebar is expanded
     */
    function disableTooltips() {
        if (typeof bootstrap === 'undefined' || !bootstrap.Tooltip) return;
        
        const menuItems = document.querySelectorAll(config.listItemSelector);
        menuItems.forEach(item => {
            if (item.tooltip) item.tooltip.disable();
        });
    }
    
    /**
     * Observe AdminLTE sidebar changes to sync our interface
     */
    function setupAdminLTEObserver() {
        if (typeof MutationObserver === 'undefined') {
            console.warn('MutationObserver not supported in this browser');
            return;
        }
        
        // Create observer
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    // When AdminLTE changes its classes, adapt our interface
                    updateLayoutBasedOnAdminLTE();
                }
            });
        });
        
        // Start observing body
        observer.observe(document.body, { attributes: true });
        
        // Do initial check
        updateLayoutBasedOnAdminLTE();
    }
    
    /**
     * Update layout based on current AdminLTE state
     */
    function updateLayoutBasedOnAdminLTE() {
        // Check if AdminLTE sidebar is collapsed
        const isAdminLTECollapsed = document.body.classList.contains('sidebar-collapse');
        
        // Update CSS style based on AdminLTE state
        if (isAdminLTECollapsed) {
            // When AdminLTE is collapsed, adjust sizes
            elements.tabScrollContainer?.classList.add('compact-view');
            elements.contentContainer?.classList.add('expanded-content');
            
            // Hide text in menu items, show only icons
            adjustMenuItems(true);
            
            // Enable tooltips
            enableTooltips();
        } else {
            // When AdminLTE is expanded, restore original sizes
            elements.tabScrollContainer?.classList.remove('compact-view');
            elements.contentContainer?.classList.remove('expanded-content');
            
            // Restore text in menu items
            adjustMenuItems(false);
            
            // Disable tooltips
            disableTooltips();
        }
        
        // Recalculate Tabulator tables
        recalculateTabulatorTables();
    }
    
    /**
     * Recalculate Tabulator tables with delay to allow CSS transitions
     */
    function recalculateTabulatorTables() {
        // Use debounce to avoid multiple recalculations
        clearTimeout(window._recalcTimeout);
        
        window._recalcTimeout = setTimeout(() => {
            // Check if ImplantacaoUI and its tables are available
            if (typeof ImplantacaoUI !== 'undefined' && 
                ImplantacaoUI.state && 
                ImplantacaoUI.state.tabulatorTables) {
                
                const tables = ImplantacaoUI.state.tabulatorTables;
                
                // Redraw each table
                for (const tabId in tables) {
                    if (tables.hasOwnProperty(tabId)) {
                        const table = tables[tabId];
                        if (table && typeof table.redraw === 'function') {
                            try {
                                table.redraw(true);
                            } catch (e) {
                                console.warn(`Error redrawing table ${tabId}:`, e);
                            }
                        }
                    }
                }
            }
        }, config.transitionDuration);
    }
    
    /**
     * Handle window resize events
     */
    function handleWindowResize() {
        // Adjust tables on resize
        recalculateTabulatorTables();
    }
    
    /**
     * Add required CSS styles for layout
     */
    function addLayoutStyles() {
        // Check if styles already exist
        if (document.getElementById('implantacao-layout-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'implantacao-layout-styles';
        style.textContent = `
            /* Toggle sidebar container */
            .toggle-sidebar-container {
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
            
            .sector-selection-title {
                font-size: 0.9rem;
                color: #6c757d;
                font-weight: 500;
            }
            
            .toggle-sidebar-button {
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                transition: all 0.2s ease;
            }
            
            /* Collapsed sidebar styles */
            .${config.collapsedClass} .sector-selection-title {
                display: none;
            }
            
            .${config.collapsedClass} .tab-scroll-container {
                width: ${config.sidebarWidth.collapsed} !important;
            }
            
            .${config.collapsedClass} .col-lg-9 {
                width: calc(100% - ${config.sidebarWidth.collapsed}) !important;
            }
            
            /* Sector title styles */
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
            
            /* New item form animation */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-in-out;
            }
            
            /* Transitions */
            .tab-scroll-container,
            .col-lg-9,
            .list-group-item {
                transition: all ${config.transitionDuration}ms ease;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Simple debounce function for handling frequent events
     * @param {Function} func The function to debounce
     * @param {number} wait Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Return public API
    return {
        init,
        createToggleButton,
        adjustSidebarLayout,
        displaySectorTitle,
        loadFirstTab,
        toggleNewItemForm,
        initializeTooltips,
        recalculateTables: recalculateTabulatorTables
    };
})();

// Initialize the layout module
document.addEventListener('DOMContentLoaded', function() {
    ImplantacaoUI_Layout.init();
});

// Expose global functions for compatibility with existing code
window.toggleNewItem = function(sectorId) {
    ImplantacaoUI_Layout.toggleNewItemForm(sectorId);
};

// Export module for use in other files
if (typeof module !== 'undefined') {
    module.exports = ImplantacaoUI_Layout;
}

/**
 * ImplantacaoUI_Modal - Module for managing UI modals
 * Handles opening, manipulating and closing various modals in the application
 */
const ImplantacaoUI_Modal = (function() {
    // Private variables
    const config = {
        periodModalId: 'modalPeriodo',
        evaluationModalId: 'modalAvaliacao', 
        viewModalId: 'modalVisualizacao',
        editModalId: 'modalEdicaoItem',
        syncModalId: 'modalSincronizacao',
        fadeInClass: 'fade-in-modal',
        transitionDuration: 300 // ms
    };
    
    // Cache modal elements for better performance
    let modalElements = {};

    /**
     * Initialize module and cache modal elements
     */
    function init() {
        document.addEventListener('DOMContentLoaded', function() {
            // Cache modal elements after DOM is loaded
            cacheModalElements();
            
            // Add modal event listeners
            setupModalEventListeners();
        });
    }
    
    /**
     * Cache modal DOM elements for better performance
     */
    function cacheModalElements() {
        Object.keys(config).forEach(key => {
            if (key.endsWith('ModalId')) {
                const modalId = config[key];
                modalElements[modalId] = document.getElementById(modalId);
            }
        });
    }
    
    /**
     * Setup modal event listeners
     */
    function setupModalEventListeners() {
        // Setup form submission handlers
        setupFormSubmissionHandlers();
        
        // Add generic modal visibility handlers
        document.querySelectorAll('.modal').forEach(modal => {
            // Prevent closing when clicking inside modal content
            modal.querySelector('.modal-content')?.addEventListener('click', e => {
                e.stopPropagation();
            });
            
            // Clear form data when modal is hidden
            modal.addEventListener('hidden.bs.modal', function() {
                const forms = this.querySelectorAll('form');
                forms.forEach(form => {
                    form.reset();
                    
                    // Reset validation state
                    const inputs = form.querySelectorAll('.is-invalid');
                    inputs.forEach(input => input.classList.remove('is-invalid'));
                    
                    // Reset any feedback messages
                    const feedback = form.querySelectorAll('.invalid-feedback');
                    feedback.forEach(el => el.textContent = '');
                });
            });
        });
    }
    
    /**
     * Setup form submission handlers for modals
     */
    function setupFormSubmissionHandlers() {
        // Period form submission
        const periodForm = document.getElementById('formPeriodo');
        if (periodForm) {
            periodForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Check if ImplantacaoUI global functions exist
                if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.salvarPeriodo === 'function') {
                    ImplantacaoUI.salvarPeriodo();
                } else {
                    console.warn('ImplantacaoUI.salvarPeriodo function not found');
                }
            });
        }
        
        // Evaluation form submission
        const evaluationForm = document.getElementById('formAvaliacao');
        if (evaluationForm) {
            evaluationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Check if ImplantacaoUI global functions exist
                if (typeof ImplantacaoUI !== 'undefined' && typeof ImplantacaoUI.salvarAvaliacao === 'function') {
                    ImplantacaoUI.salvarAvaliacao();
                } else {
                    console.warn('ImplantacaoUI.salvarAvaliacao function not found');
                }
            });
        }
    }
    
    /**
     * Open Period Modal
     * @param {string} setorId - ID of the sector
     * @param {string} periodo - Period identifier (if editing existing period)
     */
    function abrirModalPeriodo(setorId, periodo = null) {
        const modal = document.getElementById(config.periodModalId);
        if (!modal) {
            console.error('Period modal not found');
            return;
        }
        
        // Clear previous data
        const inputSetor = document.getElementById('periodoSetor');
        const inputDataInicio = document.getElementById('periodoDataInicio');
        const inputDataFim = document.getElementById('periodoDataFim');
        const inputId = document.getElementById('periodoId');
        
        if (inputSetor) inputSetor.value = setorId;
        
        // Set modal title based on whether we're creating or editing
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = periodo ? 'Editar Período de Avaliação' : 'Novo Período de Avaliação';
        }
        
        // If editing, populate form with existing data
        if (periodo) {
            // Find period data from global state, if available
            if (typeof ImplantacaoUI !== 'undefined' && 
                ImplantacaoUI.state && 
                ImplantacaoUI.state.periodos && 
                ImplantacaoUI.state.periodos[setorId]) {
                
                const periodoData = ImplantacaoUI.state.periodos[setorId].find(p => p.id === periodo);
                
                if (periodoData) {
                    if (inputDataInicio) inputDataInicio.value = periodoData.dataInicio;
                    if (inputDataFim) inputDataFim.value = periodoData.dataFim;
                    if (inputId) inputId.value = periodoData.id;
                }
            }
        } else {
            // Clear fields for new period
            if (inputDataInicio) inputDataInicio.value = '';
            if (inputDataFim) inputDataFim.value = '';
            if (inputId) inputId.value = '';
        }
        
        // Show the modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Focus on first input after modal is shown
        modal.addEventListener('shown.bs.modal', function onShown() {
            inputDataInicio?.focus();
            modal.removeEventListener('shown.bs.modal', onShown);
        });
    }
    
    /**
     * Open Evaluation Modal
     * @param {string} setorId - ID of the sector
     * @param {string} itemId - ID of the item being evaluated
     * @param {string} periodo - Period identifier
     */
    function abrirModalAvaliacao(setorId, itemId, periodo) {
        // Check if modal exists
        const modal = document.getElementById(config.evaluationModalId);
        if (!modal) {
            console.error('Evaluation modal not found');
            return;
        }
        
        // Check if custom override function exists
        if (typeof window._overrideAbrirModalAvaliacao === 'function') {
            window._overrideAbrirModalAvaliacao(setorId, itemId, periodo);
            return;
        }
        
        // Otherwise use original implementation
        _abrirModalAvaliacaoOriginal(setorId, itemId, periodo);
    }
    
    /**
     * Original implementation of opening evaluation modal
     * @param {string} setorId - ID of the sector
     * @param {string} itemId - ID of the item being evaluated
     * @param {string} periodo - Period identifier
     * @private
     */
    function _abrirModalAvaliacaoOriginal(setorId, itemId, periodo) {
        const modal = document.getElementById(config.evaluationModalId);
        if (!modal) return;
        
        // Clear previous data
        const form = modal.querySelector('form');
        form?.reset();
        
        // Set hidden fields
        const inputSetor = document.getElementById('avaliacaoSetor');
        const inputItem = document.getElementById('avaliacaoItem');
        const inputPeriodo = document.getElementById('avaliacaoPeriodo');
        
        if (inputSetor) inputSetor.value = setorId;
        if (inputItem) inputItem.value = itemId;
        if (inputPeriodo) inputPeriodo.value = periodo;
        
        // Get item info if available
        let itemInfo = null;
        
        if (typeof ImplantacaoUI !== 'undefined' && 
            ImplantacaoUI.state && 
            ImplantacaoUI.state.itens && 
            ImplantacaoUI.state.itens[setorId]) {
            
            itemInfo = ImplantacaoUI.state.itens[setorId].find(item => item.id === itemId);
        }
        
        // Update modal title with item name
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle && itemInfo) {
            modalTitle.textContent = `Avaliação: ${itemInfo.nome || 'Item'}`;
        }
        
        // Check if there's an existing evaluation to edit
        let existingEvaluation = null;
        
        if (typeof ImplantacaoUI !== 'undefined' && 
            ImplantacaoUI.state && 
            ImplantacaoUI.state.avaliacoes && 
            ImplantacaoUI.state.avaliacoes[setorId] && 
            ImplantacaoUI.state.avaliacoes[setorId][periodo]) {
            
            existingEvaluation = ImplantacaoUI.state.avaliacoes[setorId][periodo].find(a => a.itemId === itemId);
        }
        
        // Populate form with existing data if editing
        if (existingEvaluation) {
            const selectStatus = document.getElementById('avaliacaoStatus');
            const textObservacoes = document.getElementById('avaliacaoObservacoes');
            
            if (selectStatus) selectStatus.value = existingEvaluation.status || '';
            if (textObservacoes) textObservacoes.value = existingEvaluation.observacoes || '';
            
            // Set editing flag
            const inputId = document.getElementById('avaliacaoId');
            if (inputId) inputId.value = existingEvaluation.id || '';
        }
        
        // Show the modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Focus on status select after modal is shown
        modal.addEventListener('shown.bs.modal', function onShown() {
            document.getElementById('avaliacaoStatus')?.focus();
            modal.removeEventListener('shown.bs.modal', onShown);
        });
    }
    
    /**
     * Allow for custom implementation of modal opening
     * @param {Function} customFunction - Custom function that will replace the default
     */
    function _overrideAbrirModalAvaliacao(customFunction) {
        if (typeof customFunction === 'function') {
            window._overrideAbrirModalAvaliacao = customFunction;
        }
    }
    
    /**
     * Open item visualization modal
     * @param {string} setorId - ID of the sector
     * @param {string} itemId - ID of the item to visualize
     */
    function abrirModalVisualizacao(setorId, itemId) {
        const modal = document.getElementById(config.viewModalId);
        if (!modal) {
            console.error('Visualization modal not found');
            return;
        }
        
        // Get item info
        let itemInfo = null;
        
        if (typeof ImplantacaoUI !== 'undefined' && 
            ImplantacaoUI.state && 
            ImplantacaoUI.state.itens && 
            ImplantacaoUI.state.itens[setorId]) {
            
            itemInfo = ImplantacaoUI.state.itens[setorId].find(item => item.id === itemId);
        }
        
        if (!itemInfo) {
            console.warn(`Item not found: ${itemId} in sector ${setorId}`);
            return;
        }
        
        // Update modal content with item data
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = itemInfo.nome || 'Visualizar Item';
        
        // Populate item details
        const detailsContainer = modal.querySelector('.item-details');
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <h5>${itemInfo.nome}</h5>
                <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(itemInfo.status)}">${itemInfo.status || 'Não avaliado'}</span></p>
                <p><strong>Observações:</strong> ${itemInfo.observacoes || 'Nenhuma observação'}</p>
                <p><strong>Última atualização:</strong> ${formatDate(itemInfo.dataAtualizacao) || 'N/A'}</p>
            `;
        }
        
        // Populate evaluation history if available
        const historyContainer = modal.querySelector('.item-history');
        if (historyContainer && typeof ImplantacaoUI !== 'undefined' && ImplantacaoUI.state && ImplantacaoUI.state.avaliacoes) {
            // Get evaluation history for this item
            const history = [];
            
            // Loop through periods
            const avaliacoes = ImplantacaoUI.state.avaliacoes[setorId] || {};
            
            for (const periodo in avaliacoes) {
                if (avaliacoes.hasOwnProperty(periodo)) {
                    const avaliacoesPeriodo = avaliacoes[periodo] || [];
                    const itemAvaliacao = avaliacoesPeriodo.find(a => a.itemId === itemId);
                    
                    if (itemAvaliacao) {
                        // Get period name
                        let periodoNome = periodo;
                        if (ImplantacaoUI.state.periodos && ImplantacaoUI.state.periodos[setorId]) {
                            const periodoInfo = ImplantacaoUI.state.periodos[setorId].find(p => p.id === periodo);
                            if (periodoInfo) {
                                periodoNome = `${periodoInfo.dataInicio} a ${periodoInfo.dataFim}`;
                            }
                        }
                        
                        history.push({
                            periodo: periodoNome,
                            status: itemAvaliacao.status,
                            observacoes: itemAvaliacao.observacoes,
                            data: itemAvaliacao.dataAvaliacao
                        });
                    }
                }
            }
            
            // Sort history by date (most recent first)
            history.sort((a, b) => {
                const dateA = a.data ? new Date(a.data) : new Date(0);
                const dateB = b.data ? new Date(b.data) : new Date(0);
                return dateB - dateA;
            });
            
            // Build history HTML
            if (history.length > 0) {
                let historyHtml = '<h5>Histórico de Avaliações</h5><div class="list-group">';
                
                history.forEach(item => {
                    historyHtml += `
                        <div class="list-group-item">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">Período: ${item.periodo}</h6>
                                <small>${formatDate(item.data)}</small>
                            </div>
                            <p class="mb-1"><span class="badge bg-${getStatusColor(item.status)}">${item.status || 'Não avaliado'}</span></p>
                            <small>${item.observacoes || 'Nenhuma observação'}</small>
                        </div>
                    `;
                });
                
                historyHtml += '</div>';
                historyContainer.innerHTML = historyHtml;
            } else {
                historyContainer.innerHTML = '<p>Nenhum histórico de avaliação disponível.</p>';
            }
        }
        
        // Show the modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
    
    /**
     * Edit saved items from modal
     * @param {string} setorId - ID of the sector
     */
    function editarItensSalvos(setorId) {
        // Show modal for editing items
        const modal = document.getElementById('modalGerenciarItens');
        if (!modal) {
            console.error('Item management modal not found');
            return;
        }
        
        // Get items for this sector
        let itens = [];
        
        if (typeof ImplantacaoUI !== 'undefined' && 
            ImplantacaoUI.state && 
            ImplantacaoUI.state.itens && 
            ImplantacaoUI.state.itens[setorId]) {
            
            itens = ImplantacaoUI.state.itens[setorId];
        }
        
        // Update modal title
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            const setorName = document.querySelector(`[data-bs-target="#tab${setorId}"]`)?.textContent.trim() || setorId;
            modalTitle.textContent = `Gerenciar Itens - ${setorName}`;
        }
        
        // Build items table
        const tableContainer = modal.querySelector('.items-table-container');
        if (tableContainer) {
            if (itens.length > 0) {
                let tableHtml = `
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                itens.forEach(item => {
                    tableHtml += `
                        <tr>
                            <td>${item.nome}</td>
                            <td><span class="badge bg-${getStatusColor(item.status)}">${item.status || 'Não definido'}</span></td>
                            <td>
                                <button type="button" class="btn btn-sm btn-primary me-1" onclick="ImplantacaoUI_Modal.editarItem('${setorId}', '${item.id}')">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button type="button" class="btn btn-sm btn-danger" onclick="ImplantacaoUI.excluirItem('${setorId}', '${item.id}')">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                tableHtml += '</tbody></table>';
                tableContainer.innerHTML = tableHtml;
            } else {
                tableContainer.innerHTML = '<p class="alert alert-info">Nenhum item cadastrado para este setor.</p>';
            }
        }
        
        // Input for new item
        const newItemForm = modal.querySelector('.new-item-form');
        if (newItemForm) {
            newItemForm.innerHTML = `
                <form id="formNovoItem" class="mt-3 border-top pt-3">
                    <h5>Adicionar novo item</h5>
                    <input type="hidden" id="novoItemSetor" value="${setorId}">
                    <div class="mb-3">
                        <label for="novoItemNome" class="form-label">Nome do Item</label>
                        <input type="text" class="form-control" id="novoItemNome" required>
                    </div>
                    <div class="mb-3">
                        <label for="novoItemStatus" class="form-label">Status Inicial</label>
                        <select class="form-select" id="novoItemStatus">
                            <option value="">-- Selecione --</option>
                            <option value="Não iniciado">Não iniciado</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Bloqueado">Bloqueado</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="novoItemObservacoes" class="form-label">Observações</label>
                        <textarea class="form-control" id="novoItemObservacoes" rows="3"></textarea>
                    </div>
                    <button type="button" class="btn btn-success" onclick="ImplantacaoUI.salvarNovoItem()">
                        <i class="fas fa-plus-circle"></i> Adicionar Item
                    </button>
                </form>
            `;
        }
        
        // Show the modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
    
    /**
     * Update saved items in the management modal
     * @param {string} setorId - ID of the sector
     */
    function atualizarItensSalvosDoModal(setorId) {
        // Just re-open the modal to refresh data
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalGerenciarItens'));
        if (modal) {
            modal.hide();
            
            // Re-open after modal transition
            setTimeout(() => {
                editarItensSalvos(setorId);
            }, 300);
        }
    }
    
    /**
     * Edit a specific item
     * @param {string} setorId - ID of the sector
     * @param {string} itemId - ID of the item to edit
     */
    function editarItem(setorId, itemId) {
        const modal = document.getElementById(config.editModalId);
        if (!modal) {
            console.error('Item edit modal not found');
            return;
        }
        
        // Get item info
        let itemInfo = null;
        
        if (typeof ImplantacaoUI !== 'undefined' && 
            ImplantacaoUI.state && 
            ImplantacaoUI.state.itens && 
            ImplantacaoUI.state.itens[setorId]) {
            
            itemInfo = ImplantacaoUI.state.itens[setorId].find(item => item.id === itemId);
        }
        
        if (!itemInfo) {
            console.warn(`Item not found: ${itemId} in sector ${setorId}`);
            return;
        }
        
        // Set form fields
        document.getElementById('editItemId')?.setAttribute('value', itemId);
        document.getElementById('editItemSetor')?.setAttribute('value', setorId);
        document.getElementById('editItemNome')?.setAttribute('value', itemInfo.nome || '');
        
        const statusSelect = document.getElementById('editItemStatus');
        if (statusSelect) {
            const options = statusSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === itemInfo.status) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        const observacoesField = document.getElementById('editItemObservacoes');
        if (observacoesField) observacoesField.value = itemInfo.observacoes || '';
        
        // Update modal title
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = `Editar Item: ${itemInfo.nome}`;
        
        // Show the modal
        const editManagerModal = bootstrap.Modal.getInstance(document.getElementById('modalGerenciarItens'));
        if (editManagerModal) {
            editManagerModal.hide();
        }
        
        setTimeout(() => {
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            
            // Focus on first field
            modal.addEventListener('shown.bs.modal', function onShown() {
                document.getElementById('editItemNome')?.focus();
                modal.removeEventListener('shown.bs.modal', onShown);
            });
        }, 300);
    }
    
    /**
     * Show synchronization modal
     * @param {Array} changes - List of changes to display
     */
    function mostrarModalSincronizacao(changes) {
        const modal = document.getElementById(config.syncModalId);
        if (!modal) {
            console.error('Synchronization modal not found');
            return;
        }
        
        // Update content with changes
        const changesContainer = modal.querySelector('.sync-changes');
        if (changesContainer) {
            if (changes && changes.length > 0) {
                let changesHtml = '<div class="list-group">';
                
                changes.forEach(change => {
                    let icon, colorClass, actionText;
                    
                    switch (change.type) {
                        case 'add':
                            icon = 'fa-plus-circle';
                            colorClass = 'text-success';
                            actionText = 'Adicionado';
                            break;
                        case 'update':
                            icon = 'fa-edit';
                            colorClass = 'text-primary';
                            actionText = 'Atualizado';
                            break;
                        case 'delete':
                            icon = 'fa-trash';
                            colorClass = 'text-danger';
                            actionText = 'Removido';
                            break;
                        default:
                            icon = 'fa-info-circle';
                            colorClass = 'text-secondary';
                            actionText = 'Alterado';
                    }
                    
                    changesHtml += `
                        <div class="list-group-item">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1 ${colorClass}">
                                    <i class="fas ${icon} me-2"></i>
                                    ${actionText}: ${change.entity || 'Item'}
                                </h6>
                                <small>${formatDate(change.timestamp)}</small>
                            </div>
                            <p class="mb-1">${change.description || 'Sem descrição'}</p>
                            ${change.details ? `<small>${change.details}</small>` : ''}
                        </div>
                    `;
                });
                
                changesHtml += '</div>';
                changesContainer.innerHTML = changesHtml;
            } else {
                changesContainer.innerHTML = '<p class="alert alert-info">Nenhuma alteração pendente de sincronização.</p>';
            }
        }
        
        // Show the modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
    
    /**
     * Get appropriate color class for status
     * @param {string} status - Status value
     * @returns {string} Color class
     */
    function getStatusColor(status) {
        switch (status) {
            case 'Concluído':
                return 'success';
            case 'Em andamento':
                return 'primary';
            case 'Não iniciado':
                return 'secondary';
            case 'Bloqueado':
                return 'danger';
            default:
                return 'secondary';
        }
    }
    
    /**
     * Format date for display
     * @param {string} dateString - Date string to format
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    // Return public API
    return {
        init,
        abrirModalPeriodo,
        abrirModalAvaliacao,
        abrirModalVisualizacao,
        editarItensSalvos,
        atualizarItensSalvosDoModal,
        editarItem,
        mostrarModalSincronizacao,
        // For overriding implementations
        _overrideAbrirModalAvaliacao
    };
})();

// Initialize the modal module when the layout module is ready
document.addEventListener('DOMContentLoaded', function() {
    ImplantacaoUI_Modal.init();
});

// Update layout based on current AdminLTE state
function updateLayoutBasedOnAdminLTE() {
    // Check if AdminLTE sidebar is collapsed
    const isAdminLTECollapsed = document.body.classList.contains('sidebar-collapse');
    
    // Update CSS style based on AdminLTE state
    if (isAdminLTECollapsed) {
        // When AdminLTE is collapsed, adjust sizes
        elements.tabScrollContainer?.classList.add('compact-view');
        elements.contentContainer?.classList.add('expanded-content');
        
        // Hide text in menu items, show only icons
        adjustMenuItems(true);
        
        // Enable tooltips
        enableTooltips();
    } else {
        // When AdminLTE is expanded, restore original sizes
        elements.tabScrollContainer?.classList.remove('compact-view');
        elements.contentContainer?.classList.remove('expanded-content');
        
        // Restore text in menu items
        adjustMenuItems(false);
        
        // Disable tooltips
        disableTooltips();
    }
    
    // Recalculate Tabulator tables
    recalculateTabulatorTables();
}

// Expose global functions for compatibility with existing code
window.abrirModalPeriodo = function(setorId, periodo) {
    ImplantacaoUI_Modal.abrirModalPeriodo(setorId, periodo);
};

window.abrirModalAvaliacao = function(setorId, itemId, periodo) {
    ImplantacaoUI_Modal.abrirModalAvaliacao(setorId, itemId, periodo);
};

window.abrirModalVisualizacao = function(setorId, itemId) {
    ImplantacaoUI_Modal.abrirModalVisualizacao(setorId, itemId);
};

window.editarItensSalvos = function(setorId) {
    ImplantacaoUI_Modal.editarItensSalvos(setorId);
};

window.editarItem = function(setorId, itemId) {
    ImplantacaoUI_Modal.editarItem(setorId, itemId);
};

window.mostrarModalSincronizacao = function(changes) {
    ImplantacaoUI_Modal.mostrarModalSincronizacao(changes);
};

// Export modules for use in other files
if (typeof module !== 'undefined') {
    module.exports = {
        ImplantacaoUI_Layout,
        ImplantacaoUI_Modal
    };
}

/**
 * ImplantacaoUI - Module for handling UI interactions in the Implantacao system
 * This version includes improved notification and form handling components
 * 
 * @module ImplantacaoUI
 */
const ImplantacaoUI = {
    // State and configuration 
    state: {
      tabulatorTables: {}, // Reference to Tabulator tables
      modalAtual: null,    // Current open modal
      btnSalvarOriginal: '', // Original text of the save button
      progressBars: {},    // Reference to progress bars
      notificationSystem: 'toastr', // Default notification system
      formFeedbackTimeout: null // Timeout for form feedback
    },
    
    /**
     * Notification System - Improved toast notifications with fallbacks
     */
    notifications: {
      /**
       * Configure the notification system
       * @param {Object} options - Configuration options
       */
      configure: function(options = {}) {
        // Configure toastr if available
        if (typeof toastr !== 'undefined') {
          // Primary configuration - more discrete and fluid
          toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-bottom-right",
            "preventDuplicates": true,
            "showDuration": "300",
            "hideDuration": "500",
            "timeOut": "2500",
            "extendedTimeOut": "1000", 
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "tapToDismiss": true
          };
          
          // Add custom CSS for more elegant notifications
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
        } else {
          console.warn("Toastr not available for configuration, using fallback");
        }
      },
      
      /**
       * Check if notification system is available and load it if possible
       * @returns {boolean} Whether a notification system is available
       */
      checkAvailability: function() {
        if (typeof toastr !== 'undefined') {
          return true;
        }
        
        // Try to load Toastr if jQuery is available
        if (typeof jQuery !== 'undefined') {
          // Don't create duplicate script tags
          if (!document.getElementById('toastr-script')) {
            const toastrScript = document.createElement('script');
            toastrScript.id = 'toastr-script';
            toastrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js';
            toastrScript.async = true;
            
            const toastrCSS = document.createElement('link');
            toastrCSS.id = 'toastr-css';
            toastrCSS.rel = 'stylesheet';
            toastrCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css';
            
            document.head.appendChild(toastrCSS);
            document.head.appendChild(toastrScript);
            
            console.log("Attempting to load Toastr dynamically...");
            return false;
          }
        }
        
        // Setup fallback notification system if none available
        if (!window.toastr) {
          window.toastr = this.createFallbackToastr();
        }
        
        return true;
      },
      
      /**
       * Create a fallback notification system if Toastr is not available
       * @returns {Object} A fallback implementation of Toastr
       */
      createFallbackToastr: function() {
        return {
          options: {},
          success: function(message) { 
            console.log('SUCCESS:', message);
            this._showFallbackToast(message, 'success');
          },
          error: function(message) { 
            console.error('ERROR:', message);
            this._showFallbackToast(message, 'error');
          },
          warning: function(message) { 
            console.warn('WARNING:', message);
            this._showFallbackToast(message, 'warning');
          },
          info: function(message) { 
            console.info('INFO:', message); 
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
      },
      
      /**
       * Show a notification with the appropriate type
       * @param {string} type - Type of notification (success, error, warning, info)
       * @param {string} message - Message to display
       * @param {Object} options - Additional options for the notification
       */
      show: function(type, message, options = {}) {
        // Ensure notification system is available
        if (!this.checkAvailability()) {
          // Fallback using alert if no system can be loaded
          alert(type.toUpperCase() + ': ' + message);
          return;
        }
        
        // Validate notification type
        const validTypes = ['success', 'error', 'warning', 'info'];
        if (!validTypes.includes(type)) {
          type = 'info'; // Fallback to info if type is invalid
        }
        
        // Type-specific configurations
        const typeOptions = {
          success: { timeOut: 3000, positionClass: "toast-top-right", progressBar: true },
          error: { timeOut: 5000, positionClass: "toast-top-right", closeButton: true, progressBar: true },
          warning: { timeOut: 4000, positionClass: "toast-top-right", progressBar: true },
          info: { timeOut: 3000, positionClass: "toast-top-right", progressBar: true }
        };
        
        // Combine options
        const finalOptions = {...typeOptions[type], ...options};
        
        // Store original options
        const originalOptions = {...toastr.options};
        
        // Apply temporary options
        Object.keys(finalOptions).forEach(key => {
          toastr.options[key] = finalOptions[key];
        });
        
        // Log the notification for debugging
        console.log(`Showing ${type} notification: ${message}`);
        
        // Show the notification
        toastr[type](message);
        
        // Restore original options
        setTimeout(() => {
          toastr.options = originalOptions;
        }, 100);
      },
      
      // Shorthand methods for specific notification types
      success: function(message, options = {}) {
        this.show('success', message, options);
      },
      
      error: function(message, options = {}) {
        this.show('error', message, options);
      },
      
      warning: function(message, options = {}) {
        this.show('warning', message, options);
      },
      
      info: function(message, options = {}) {
        this.show('info', message, options);
      }
    },
    
    /**
     * Form Feedback - Improved in-form feedback system
     */
    formFeedback: {
      /**
       * Shows feedback message inside a form
       * @param {string} type - Type of feedback (success, error, warning, info)
       * @param {string} message - Message to display
       * @param {string} containerId - ID of the container element (defaults to 'formFeedback')
       * @param {Object} options - Additional options like autohide, delay, etc.
       */
      show: function(type, message, containerId = 'formFeedback', options = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
          console.warn(`Form feedback container '${containerId}' not found`);
          return;
        }
        
        // Clear any existing timeout
        if (ImplantacaoUI.state.formFeedbackTimeout) {
          clearTimeout(ImplantacaoUI.state.formFeedbackTimeout);
        }
        
        // Map type to Bootstrap classes
        const classes = {
          success: 'alert-success',
          error: 'alert-danger',
          warning: 'alert-warning',
          info: 'alert-info'
        };
        
        // Map type to icons
        const icons = {
          success: '<i class="fas fa-check-circle me-2"></i>',
          error: '<i class="fas fa-exclamation-circle me-2"></i>',
          warning: '<i class="fas fa-exclamation-triangle me-2"></i>',
          info: '<i class="fas fa-info-circle me-2"></i>'
        };
        
        // Update content and classes with animation
        container.className = `alert ${classes[type] || 'alert-info'} fade show`;
        container.innerHTML = `${icons[type] || ''}${message}`;
        container.classList.remove('d-none');
        
        // Auto-hide after delay if specified
        const autoHide = options.autoHide !== undefined ? options.autoHide : (type === 'success' || type === 'info');
        const delay = options.delay || (type === 'error' ? 0 : 3000); // Don't auto-hide errors by default
        
        if (autoHide && delay > 0) {
          ImplantacaoUI.state.formFeedbackTimeout = setTimeout(() => {
            this.hide(containerId);
          }, delay);
        }
      },
      
      /**
       * Hides the form feedback with a fade out animation
       * @param {string} containerId - ID of the container element
       */
      hide: function(containerId = 'formFeedback') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Add fade out animation
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease';
        
        // Remove after animation completes
        setTimeout(() => {
          container.classList.add('d-none');
          container.innerHTML = '';
          container.style.opacity = '1';
        }, 300);
      },
      
      /**
       * Highlights a form element with a subtle animation to draw attention
       * @param {string} formId - ID of the form element
       * @param {Object} options - Animation options
       */
      highlightForm: function(formId = 'evaluationForm', options = {}) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        // Create highlight animation style if needed
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
        
        // Apply animation class
        form.classList.add('highlight-pulse');
        
        // Remove class after animation completes
        setTimeout(() => {
          form.classList.remove('highlight-pulse');
        }, options.duration || 1000);
      },
      
      /**
       * Highlights a specific field to draw user attention
       * @param {string} fieldId - ID of the field to highlight
       * @param {string} type - Type of highlight (warning, error, success)
       */
      highlightField: function(fieldId, type = 'warning') {
        const field = document.getElementById(fieldId);
        if (!field) return false;
        
        const container = field.closest('.mb-3') || field.parentElement;
        if (!container) return false;
        
        // Apply appropriate classes based on type
        const classes = {
          warning: ['border', 'border-warning', 'bg-warning-subtle', 'rounded'],
          error: ['border', 'border-danger', 'bg-danger-subtle', 'rounded'],
          success: ['border', 'border-success', 'bg-success-subtle', 'rounded']
        };
        
        // Add highlight classes
        const highlightClasses = classes[type] || classes.warning;
        container.classList.add(...highlightClasses, 'p-2');
        
        // Remove classes after animation
        setTimeout(() => {
          container.classList.remove(...highlightClasses, 'p-2');
        }, 2000);
        
        return true;
      }
    },
    
    /**
     * Form Control - Improved form interaction handling
     */
    formControl: {
      /**
       * Sets up event handlers for form controls
       * @param {Object} options - Configuration options
       */
      setupHandlers: function(options = {}) {
        // Handle "Not Applicable" checkbox interactions
        const notApplicableCheckboxes = document.querySelectorAll('.not-applicable-control');
        
        notApplicableCheckboxes.forEach(checkbox => {
          // Remove existing event to avoid duplication
          checkbox.removeEventListener('change', this._handleNotApplicableChange);
          
          // Add new event listener
          checkbox.addEventListener('change', this._handleNotApplicableChange);
          
          // Initialize state based on current checkbox value
          this.toggleStatusOptions(checkbox.checked, checkbox);
        });
      },
      
      /**
       * Event handler for "Not Applicable" checkbox changes
       * @param {Event} event - Change event
       * @private
       */
      _handleNotApplicableChange: function(event) {
        ImplantacaoUI.formControl.toggleStatusOptions(event.target.checked, event.target);
      },
      
      /**
       * Toggles availability of status options based on "Not Applicable" state
       * @param {boolean} disable - Whether to disable the status options
       * @param {HTMLElement} sourceElement - The element that triggered the change
       */
      toggleStatusOptions: function(disable, sourceElement) {
        // Find the related status radio group
        let statusRadios;
        
        if (sourceElement) {
          // Try to find related radios based on the form structure or data attributes
          const formGroup = sourceElement.closest('form') || sourceElement.closest('.modal-body');
          if (formGroup) {
            statusRadios = formGroup.querySelectorAll('input[type="radio"][name*="status"]');
          }
        }
        
        // Fallback to all status radios if specific ones can't be found
        if (!statusRadios || statusRadios.length === 0) {
          statusRadios = document.querySelectorAll('input[name="status"]');
        }
        
        // Apply the disabled state to each radio button
        statusRadios.forEach(radio => {
          radio.disabled = disable;
          if (disable) {
            radio.checked = false;
          }
        });
      },
      
      /**
       * Resets a form to its initial state
       * @param {string} formId - ID of the form to reset
       * @param {Object} options - Reset options
       */
      resetForm: function(formId, options = {}) {
        const form = document.getElementById(formId);
        if (!form) {
          console.warn(`Form '${formId}' not found for reset`);
          return false;
        }
        
        try {
          // Reset all form elements
          form.reset();
          
          // Additionally clear specific fields if needed
          if (options.clearHidden !== false) {
            const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
            hiddenInputs.forEach(input => {
              input.value = '';
            });
          }
          
          // Reset any disabled states
          const statusRadios = form.querySelectorAll('input[type="radio"]');
          statusRadios.forEach(radio => {
            radio.disabled = false;
          });
          
          // Reset "Not Applicable" checkbox if present
          const notApplicable = form.querySelector('#nao_se_aplica') || form.querySelector('.not-applicable-control');
          if (notApplicable) {
            notApplicable.checked = false;
            this.toggleStatusOptions(false, notApplicable);
          }
          
          return true;
        } catch (error) {
          console.error("Error resetting form:", error);
          return false;
        }
      },
      
      /**
       * Safely gets a value from a form element
       * @param {string} elementId - ID of the element
       * @param {*} defaultValue - Default value if element doesn't exist
       * @returns {*} Element value or default value
       */
      getSafeValue: function(elementId, defaultValue = '') {
        const element = document.getElementById(elementId);
        if (!element) {
          console.warn(`Element '${elementId}' not found. Using default value.`);
          return defaultValue;
        }
        
        return element.value || defaultValue;
      },
      
      /**
       * Safely gets checkbox state
       * @param {string} elementId - ID of the checkbox
       * @returns {boolean} Checkbox state or false if not found
       */
      getSafeCheckboxState: function(elementId) {
        const element = document.getElementById(elementId);
        if (!element || element.type !== 'checkbox') {
          console.warn(`Checkbox '${elementId}' not found. Assuming unchecked.`);
          return false;
        }
        
        return element.checked;
      },
      
      /**
       * Safely sets a value to a form element
       * @param {string} elementId - ID of the element
       * @param {*} value - Value to set
       * @returns {boolean} Success indicator
       */
      setSafeValue: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) {
          console.warn(`Element '${elementId}' not found for value setting.`);
          return false;
        }
        
        if ('value' in element) {
          element.value = value;
        } else if ('textContent' in element) {
          element.textContent = value;
        } else {
          console.warn(`Cannot set value for '${elementId}'`);
          return false;
        }
        
        return true;
      },
      
      /**
       * Safely sets a checkbox state
       * @param {string} elementId - ID of the checkbox
       * @param {boolean} checked - State to set
       * @returns {boolean} Success indicator
       */
      setSafeCheckboxState: function(elementId, checked) {
        const element = document.getElementById(elementId);
        if (!element || element.type !== 'checkbox') {
          console.warn(`Checkbox '${elementId}' not found`);
          return false;
        }
        
        element.checked = checked;
        return true;
      },
      
      /**
       * Sets a radio button as selected
       * @param {string} value - Value of the radio to select
       * @param {boolean} checked - State to set
       * @returns {boolean} Success indicator
       */
      setSafeRadioState: function(value, checked) {
        // Try to find by ID first
        const radio = document.getElementById(value);
        if (radio && radio.type === 'radio') {
          radio.checked = checked;
          return true;
        }
        
        // Try to find by attribute selector
        const radioByValue = document.querySelector(`input[type="radio"][value="${value}"]`);
        if (radioByValue) {
          radioByValue.checked = checked;
          return true;
        }
        
        console.warn(`Radio with value '${value}' not found`);
        return false;
      }
    },
    
    // Main initialization method
    init: function() {
      // Initialize notifications
      this.notifications.configure();
      
      // Set up form control handlers
      this.formControl.setupHandlers();
      
      console.log("ImplantacaoUI reload module initialized");
    },
    
    /**
     * Legacy compatibility methods to prevent breaking existing code
     * These delegate to the appropriate new module functions
     */
    
    // Notifications legacy methods
    mostrarToast: function(type, message, options = {}) {
      this.notifications.show(type, message, options);
    },
    
    notificarSucesso: function(message, options = {}) {
      this.notifications.success(message, options);
    },
    
    notificarErro: function(message, options = {}) {
      this.notifications.error(message, options);
    },
    
    notificarAviso: function(message, options = {}) {
      this.notifications.warning(message, options);
    },
    
    notificarInfo: function(message, options = {}) {
      this.notifications.info(message, options);
    },
    
    verificarToastr: function() {
      return this.notifications.checkAvailability();
    },
    
    configurarToastr: function(options = {}) {
      this.notifications.configure(options);
    },
    
    // Form feedback legacy methods
    mostrarFeedbackNoFormulario: function(tipo, mensagem, containerId = 'formFeedback', options = {}) {
      this.formFeedback.show(tipo, mensagem, containerId, options);
    },
    
    limparFeedbackNoFormulario: function(containerId = 'formFeedback') {
      this.formFeedback.hide(containerId);
    },
    
    destacarFormulario: function(formId = 'evaluationForm', options = {}) {
      this.formFeedback.highlightForm(formId, options);
    },
    
    // Form control legacy methods
    alterarNaoSeAplica: function(event) {
      const isChecked = event.target ? event.target.checked : event;
      this.formControl.toggleStatusOptions(isChecked, event.target);
    },
    
    alternarOpcoesStatus: function(desativar) {
      this.formControl.toggleStatusOptions(desativar);
    },
    
    alternarStatusRadios: function(desativar) {
      this.formControl.toggleStatusOptions(desativar);
    },
    
    limparFormularioAvaliacao: function(formId = 'evaluationForm') {
      return this.formControl.resetForm(formId);
    },
    
    obterValorSeguro: function(elementId, valorPadrao = '') {
      return this.formControl.getSafeValue(elementId, valorPadrao);
    },
    
    obterCheckboxSeguro: function(elementId) {
      return this.formControl.getSafeCheckboxState(elementId);
    },
    
    definirValorSeguro: function(elementId, valor) {
      return this.formControl.setSafeValue(elementId, valor);
    },
    
    definirCheckboxSeguro: function(elementId, checked) {
      return this.formControl.setSafeCheckboxState(elementId, checked);
    },
    
    definirRadioSeguro: function(value, checked) {
      return this.formControl.setSafeRadioState(value, checked);
    }
};

// Initialize the module when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  ImplantacaoUI.init();
});
