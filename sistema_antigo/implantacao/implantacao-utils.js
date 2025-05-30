/**
 * ImplantacaoUtils - A utility module for the Implantacao system
 * 
 * This module follows SOLID principles to handle all utility functions:
 * - Single Responsibility: Each function has one specific task
 * - Open/Closed: Can be extended without modifying existing code
 * - Liskov Substitution: Functions with similar signatures are interchangeable
 * - Interface Segregation: Clear interfaces between different utility groups
 * - Dependency Inversion: Core logic doesn't depend on specific implementations
 */

const ImplantacaoUtils = (function() {
  // Private module state
  const _state = {
    activeLoaders: new Set(),
    eventListeners: new Map(),
    intervals: new Set(),
    loadingIndicators: new Map(),
    safeDefaults: {
      string: '',
      number: 0,
      boolean: false,
      object: null
    }
  };

  // =========================================================================
  // SAFE DOM MANIPULATION FUNCTIONS
  // =========================================================================
  
  /**
   * Sanitizes an ID by removing special characters
   * @param {string} id The ID to sanitize
   * @returns {string} Sanitized ID
   */
  function sanitizeId(id) {
    if (!id) return '';
    
    // First convert to string
    const idStr = String(id);
    
    // Remove anything that's not alphanumeric, underscore, or hyphen
    return idStr.replace(/[^a-zA-Z0-9_-]/g, '');
  }
  
  /**
   * Escapes a string for safe use in HTML and attributes
   * @param {string} str String to escape
   * @returns {string} Escaped string
   */
  function escaparString(str) {
    if (!str) return '';
    if (typeof str !== 'string') {
      str = String(str);
    }
    
    // Use the browser's built-in HTML escaping
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Safely sets the value of an input element
   * @param {string} id Element ID
   * @param {*} value Value to set
   * @param {boolean} sanitize Whether to sanitize the input
   * @returns {boolean} Success status
   */
  function definirValorSeguro(id, value, sanitize = true) {
    try {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`Element with id ${id} not found`);
        return false;
      }
      
      // Handle special case for contenteditable
      if (element.hasAttribute('contenteditable')) {
        element.textContent = sanitize ? escaparString(value) : value;
        return true;
      }
      
      // Handle different input types
      switch (element.tagName.toLowerCase()) {
        case 'input':
        case 'textarea':
        case 'select':
          element.value = sanitize && typeof value === 'string' ? 
            escaparString(value) : value;
          
          // Trigger change event for React-like frameworks that might listen for it
          element.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
          
        default:
          // For other elements, set as inner text
          element.textContent = sanitize ? escaparString(value) : value;
          return true;
      }
    } catch (error) {
      console.error(`Error setting value for ${id}:`, error);
      return false;
    }
  }

  /**
   * Safely sets the checked state of a checkbox
   * @param {string} id Checkbox ID
   * @param {boolean} checked Checked state
   * @returns {boolean} Success status
   */
  function definirCheckboxSeguro(id, checked) {
    try {
      const element = document.getElementById(id);
      if (!element || element.type !== 'checkbox') {
        console.warn(`Element ${id} is not a checkbox`);
        return false;
      }
      
      element.checked = Boolean(checked);
      
      // Trigger change event
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (error) {
      console.error(`Error setting checkbox ${id}:`, error);
      return false;
    }
  }

  /**
   * Safely sets a radio button in a group
   * @param {string} name Radio group name
   * @param {string} value Value to check
   * @returns {boolean} Success status
   */
  function definirRadioSeguro(name, value) {
    try {
      const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
      if (!radios.length) {
        console.warn(`No radio buttons with name ${name} found`);
        return false;
      }
      
      let found = false;
      radios.forEach(radio => {
        if (radio.value === String(value)) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          found = true;
        } else {
          radio.checked = false;
        }
      });
      
      return found;
    } catch (error) {
      console.error(`Error setting radio ${name}:`, error);
      return false;
    }
  }

  /**
   * Safely gets the value of an input element
   * @param {string} id Element ID
   * @param {*} defaultValue Default value if element not found
   * @returns {*} Element value or default
   */
  function obterValorSeguro(id, defaultValue = '') {
    try {
      const element = document.getElementById(id);
      if (!element) {
        return defaultValue;
      }
      
      // Handle contenteditable
      if (element.hasAttribute('contenteditable')) {
        return element.textContent.trim();
      }
      
      // Handle form elements
      if (element.tagName.toLowerCase() === 'input' || 
          element.tagName.toLowerCase() === 'textarea' || 
          element.tagName.toLowerCase() === 'select') {
        return element.value;
      }
      
      // Default to innerText for other elements
      return element.textContent.trim();
    } catch (error) {
      console.error(`Error getting value for ${id}:`, error);
      return defaultValue;
    }
  }

  /**
   * Safely gets the checked state of a checkbox
   * @param {string} id Checkbox ID
   * @param {boolean} defaultValue Default value if element not found
   * @returns {boolean} Checkbox state or default
   */
  function obterCheckboxSeguro(id, defaultValue = false) {
    try {
      const element = document.getElementById(id);
      if (!element || element.type !== 'checkbox') {
        return defaultValue;
      }
      
      return element.checked;
    } catch (error) {
      console.error(`Error getting checkbox state for ${id}:`, error);
      return defaultValue;
    }
  }

  // =========================================================================
  // UI AND DOM MANIPULATION
  // =========================================================================
  
  /**
   * Shows a loading indicator
   * @param {string} containerId Container element ID
   * @param {string} message Loading message
   * @param {Object} options Display options
   * @returns {string} Unique loader ID
   */
  function showLoadingIndicator(containerId, message = 'Carregando...', options = {}) {
    try {
      const container = containerId ? document.getElementById(containerId) : document.body;
      
      if (!container) {
        console.warn(`Loading indicator container ${containerId} not found`);
        return null;
      }
      
      // Generate unique ID for this loader
      const loaderId = `loader-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Default options
      const defaultOptions = {
        fullscreen: false,
        spinnerClass: 'spinner-border text-primary',
        spinnerSize: '', // empty for default, 'spinner-border-sm' for small
        backdropClass: 'bg-white',
        opacity: 0.7,
        zIndex: 1050,
        position: 'absolute', // absolute or fixed
        hideContent: true
      };
      
      const settings = {...defaultOptions, ...options};
      
      // Create loader element
      const loader = document.createElement('div');
      loader.id = loaderId;
      loader.className = `loading-indicator ${settings.fullscreen ? 'position-fixed' : 'position-' + settings.position}`;
      loader.style.cssText = `
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: ${settings.backdropClass};
        opacity: ${settings.opacity};
        z-index: ${settings.zIndex};
      `;
      
      // Create spinner
      const spinnerHTML = `
        <div class="${settings.spinnerClass} ${settings.spinnerSize}" role="status">
          <span class="visually-hidden">Carregando...</span>
        </div>
        ${message ? `<div class="mt-3">${escaparString(message)}</div>` : ''}
      `;
      loader.innerHTML = spinnerHTML;
      
      // If hideContent, we add a special class to the container
      if (settings.hideContent && !settings.fullscreen) {
        container.classList.add('content-loading');
      }
      
      // Append loader to container
      container.appendChild(loader);
      
      // Store in the active loaders set
      _state.activeLoaders.add(loaderId);
      _state.loadingIndicators.set(loaderId, { container, settings });
      
      return loaderId;
    } catch (error) {
      console.error('Error showing loading indicator:', error);
      return null;
    }
  }

  /**
   * Hides a specific loading indicator or all if no ID provided
   * @param {string} loaderId Loader ID to hide (optional)
   * @returns {boolean} Success status
   */
  function hideLoadingIndicator(loaderId = null) {
    try {
      // If no ID provided, hide all loaders
      if (!loaderId) {
        let success = true;
        
        // Create a copy of the set to avoid modification during iteration
        const loaderIds = [..._state.activeLoaders];
        
        // Hide each loader
        loaderIds.forEach(id => {
          if (!hideLoadingIndicator(id)) {
            success = false;
          }
        });
        
        return success;
      }
      
      // Get loader element
      const loader = document.getElementById(loaderId);
      if (!loader) {
        console.warn(`Loader ${loaderId} not found`);
        _state.activeLoaders.delete(loaderId);
        _state.loadingIndicators.delete(loaderId);
        return false;
      }
      
      // Get container info
      const loaderInfo = _state.loadingIndicators.get(loaderId);
      const container = loaderInfo?.container;
      
      // If hideContent was enabled, remove the class
      if (loaderInfo?.settings?.hideContent && container) {
        container.classList.remove('content-loading');
      }
      
      // Remove the loader
      loader.remove();
      
      // Clean up state
      _state.activeLoaders.delete(loaderId);
      _state.loadingIndicators.delete(loaderId);
      
      return true;
    } catch (error) {
      console.error('Error hiding loading indicator:', error);
      return false;
    }
  }

  /**
   * Adds a synchronization button to an element
   * @param {string} containerId Container element ID
   * @param {Function} syncCallback Function to call when sync button is clicked
   * @param {Object} options Button options
   * @returns {HTMLElement|null} Created button or null
   */
  function adicionarBotaoSincronizacao(containerId, syncCallback, options = {}) {
    try {
      const container = document.getElementById(containerId);
      
      if (!container) {
        console.warn(`Container ${containerId} not found`);
        return null;
      }
      
      // Default options
      const defaultOptions = {
        text: 'Sincronizar',
        icon: 'sync-alt',
        btnClass: 'btn-outline-primary btn-sm',
        position: 'append', // append, prepend, after, before
        tooltip: 'Sincronizar dados',
        attributes: {}
      };
      
      const settings = {...defaultOptions, ...options};
      
      // Create button
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `btn ${settings.btnClass} sync-button`;
      button.setAttribute('data-bs-toggle', 'tooltip');
      button.setAttribute('title', settings.tooltip);
      button.innerHTML = `<i class="fas fa-${settings.icon} me-1"></i> ${settings.text}`;
      
      // Add any custom attributes
      for (const [key, value] of Object.entries(settings.attributes)) {
        button.setAttribute(key, value);
      }
      
      // Add click event listener
      const eventHandler = (e) => {
        e.preventDefault();
        
        // Visual feedback - add spinner
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-spinner fa-spin me-1';
        button.disabled = true;
        
        // Call the sync function, handle both promise and regular function
        try {
          const result = syncCallback();
          
          if (result instanceof Promise) {
            result
              .then(() => {
                // Restore button state
                icon.className = originalClass;
                button.disabled = false;
              })
              .catch(error => {
                console.error('Error in sync callback:', error);
                icon.className = originalClass;
                button.disabled = false;
              });
          } else {
            // For non-promise returns, restore immediately
            setTimeout(() => {
              icon.className = originalClass;
              button.disabled = false;
            }, 500);
          }
        } catch (callbackError) {
          console.error('Error executing sync callback:', callbackError);
          icon.className = originalClass;
          button.disabled = false;
        }
      };
      
      button.addEventListener('click', eventHandler);
      
      // Store the event listener for cleanup
      _state.eventListeners.set(button, {
        type: 'click',
        handler: eventHandler
      });
      
      // Add to container based on position
      switch (settings.position) {
        case 'prepend':
          container.prepend(button);
          break;
        case 'after':
          container.parentNode.insertBefore(button, container.nextSibling);
          break;
        case 'before':
          container.parentNode.insertBefore(button, container);
          break;
        case 'append':
        default:
          container.append(button);
      }
      
      // Initialize tooltip if Bootstrap is available
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        new bootstrap.Tooltip(button);
      }
      
      return button;
    } catch (error) {
      console.error('Error adding sync button:', error);
      return null;
    }
  }

  /**
   * Clears all setInterval timers registered in the module
   */
  function clearAllIntervals() {
    try {
      // Clear all intervals
      _state.intervals.forEach(intervalId => {
        clearInterval(intervalId);
      });
      
      // Clear the set
      _state.intervals.clear();
      
      return true;
    } catch (error) {
      console.error('Error clearing intervals:', error);
      return false;
    }
  }
  
  // =========================================================================
  // STATE MANAGEMENT FUNCTIONS
  // =========================================================================
  
  /**
   * Cleans up event listeners registered through the module
   * @param {Element} element Specific element to clean (optional)
   * @returns {boolean} Success status
   */
  function limparEventListeners(element = null) {
    try {
      if (element) {
        // Remove listeners from a specific element
        const listenerInfo = _state.eventListeners.get(element);
        if (listenerInfo) {
          element.removeEventListener(listenerInfo.type, listenerInfo.handler);
          _state.eventListeners.delete(element);
        }
      } else {
        // Remove all listeners
        _state.eventListeners.forEach((info, el) => {
          if (el && typeof el.removeEventListener === 'function') {
            el.removeEventListener(info.type, info.handler);
          }
        });
        
        _state.eventListeners.clear();
      }
      
      return true;
    } catch (error) {
      console.error('Error clearing event listeners:', error);
      return false;
    }
  }

  /**
   * Toggles the new item form visibility
   * @param {string} formContainerId Form container ID
   * @param {string} toggleButtonId Toggle button ID (optional)
   * @returns {boolean} New visibility state
   */
  function toggleNewItem(formContainerId, toggleButtonId = null) {
    try {
      const container = document.getElementById(formContainerId);
      if (!container) {
        console.warn(`Form container ${formContainerId} not found`);
        return false;
      }
      
      // Toggle visibility
      const isCurrentlyVisible = !container.classList.contains('d-none');
      
      if (isCurrentlyVisible) {
        container.classList.add('d-none');
      } else {
        container.classList.remove('d-none');
      }
      
      // Update button text if provided
      if (toggleButtonId) {
        const button = document.getElementById(toggleButtonId);
        if (button) {
          button.innerHTML = isCurrentlyVisible
            ? '<i class="fas fa-plus me-1"></i> Novo Item'
            : '<i class="fas fa-times me-1"></i> Cancelar';
            
          // Update button class
          button.classList.toggle('btn-primary', isCurrentlyVisible);
          button.classList.toggle('btn-danger', !isCurrentlyVisible);
        }
      }
      
      // Return new state
      return !isCurrentlyVisible;
    } catch (error) {
      console.error('Error toggling new item form:', error);
      return false;
    }
  }

  /**
   * Toggles visibility of status radio buttons based on "Not Applicable" state
   * @param {string} containerId Container with radio buttons
   * @param {boolean} isNotApplicable Whether "Not Applicable" is checked
   * @returns {boolean} Success status
   */
  function toggleStatusRadios(containerId, isNotApplicable) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Status container ${containerId} not found`);
        return false;
      }
      
      // Find the status radio elements
      const statusElements = container.querySelectorAll('input[type="radio"][name$="resultado"]');
      
      // Find the container divs for styling
      const statusContainers = [];
      statusElements.forEach(radio => {
        const parentLabel = radio.closest('label');
        if (parentLabel) {
          statusContainers.push(parentLabel);
        }
      });
      
      if (isNotApplicable) {
        // Disable status radios and add visual indication
        statusElements.forEach(radio => {
          radio.disabled = true;
          radio.checked = false;
        });
        
        statusContainers.forEach(container => {
          container.classList.add('disabled-status');
          container.classList.add('opacity-50');
        });
      } else {
        // Enable status radios and remove visual indication
        statusElements.forEach(radio => {
          radio.disabled = false;
        });
        
        statusContainers.forEach(container => {
          container.classList.remove('disabled-status');
          container.classList.remove('opacity-50');
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling status radios:', error);
      return false;
    }
  }

  /**
   * Edits saved items in a modal
   * @param {Object} itemData Item data to edit
   * @param {Object} options Edit options
   * @returns {boolean} Success status
   */
  function editSavedItems(itemData, options = {}) {
    if (!itemData) {
      console.warn('No item data provided for editing');
      return false;
    }
    
    try {
      // Default options
      const defaultOptions = {
        formId: 'editForm',
        idField: 'editId',
        onComplete: null
      };
      
      const settings = {...defaultOptions, ...options};
      
      // Set form fields based on item data
      for (const [key, value] of Object.entries(itemData)) {
        // Skip null values
        if (value === null) continue;
        
        // Find field ID based on key
        const fieldId = `${settings.formId}_${key}`;
        const element = document.getElementById(fieldId);
        
        if (!element) continue;
        
        // Handle different field types
        switch (element.type) {
          case 'checkbox':
            definirCheckboxSeguro(fieldId, value);
            break;
            
          case 'radio':
            // For radio buttons, find by name
            const radioName = element.name;
            if (radioName) {
              definirRadioSeguro(radioName, value);
            }
            break;
            
          default:
            // Text, textarea, select
            definirValorSeguro(fieldId, value);
        }
      }
      
      // Set ID field separately
      if (settings.idField && itemData.id) {
        definirValorSeguro(settings.idField, itemData.id);
      }
      
      // Call completion handler if provided
      if (typeof settings.onComplete === 'function') {
        settings.onComplete(itemData);
      }
      
      return true;
    } catch (error) {
      console.error('Error editing saved items:', error);
      return false;
    }
  }

  /**
   * Refreshes saved items list from a modal
   * @param {Array} items Items to display
   * @param {string} containerId Container element ID
   * @param {Object} options Display options
   * @returns {boolean} Success status
   */
  function refreshSavedItemsFromModal(items, containerId, options = {}) {
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn(`Items container ${containerId} not found`);
        return false;
      }
      
      // Default options
      const defaultOptions = {
        emptyMessage: 'Nenhum item encontrado',
        itemClass: 'list-group-item',
        onEdit: null,
        onDelete: null,
        idField: 'id',
        displayField: 'nome',
        renderItem: null // Custom render function
      };
      
      const settings = {...defaultOptions, ...options};
      
      // Clear container
      container.innerHTML = '';
      
      // Check if items array exists and has items
      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = `<div class="alert alert-info">${settings.emptyMessage}</div>`;
        return true;
      }
      
      // Create container for items
      const listGroup = document.createElement('div');
      listGroup.className = 'list-group';
      
      // Add each item
      items.forEach(item => {
        // Create item element
        const itemElement = document.createElement('div');
        itemElement.className = settings.itemClass;
        itemElement.setAttribute('data-id', item[settings.idField] || '');
        
        // Use custom render function if provided, otherwise use default
        if (typeof settings.renderItem === 'function') {
          const renderedContent = settings.renderItem(item);
          if (typeof renderedContent === 'string') {
            itemElement.innerHTML = renderedContent;
          } else if (renderedContent instanceof Node) {
            itemElement.appendChild(renderedContent);
          }
        } else {
          // Default rendering
          const displayContent = item[settings.displayField] || 'Item sem nome';
          
          itemElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
              <span>${escaparString(displayContent)}</span>
              <div class="btn-group">
                ${typeof settings.onEdit === 'function' ? 
                  `<button type="button" class="btn btn-sm btn-outline-primary edit-btn">
                    <i class="fas fa-edit"></i>
                  </button>` : ''}
                ${typeof settings.onDelete === 'function' ? 
                  `<button type="button" class="btn btn-sm btn-outline-danger delete-btn">
                    <i class="fas fa-trash"></i>
                  </button>` : ''}
              </div>
            </div>
          `;
          
          // Add event handlers
          if (typeof settings.onEdit === 'function') {
            const editBtn = itemElement.querySelector('.edit-btn');
            if (editBtn) {
              const editHandler = () => settings.onEdit(item);
              editBtn.addEventListener('click', editHandler);
              
              // Store event listener for cleanup
              _state.eventListeners.set(editBtn, {
                type: 'click',
                handler: editHandler
              });
            }
          }
          
          if (typeof settings.onDelete === 'function') {
            const deleteBtn = itemElement.querySelector('.delete-btn');
            if (deleteBtn) {
              const deleteHandler = () => settings.onDelete(item);
              deleteBtn.addEventListener('click', deleteHandler);
              
              // Store event listener for cleanup
              _state.eventListeners.set(deleteBtn, {
                type: 'click',
                handler: deleteHandler
              });
            }
          }
        }
        
        // Add to list
        listGroup.appendChild(itemElement);
      });
      
      // Add list to container
      container.appendChild(listGroup);
      
      return true;
    } catch (error) {
      console.error('Error refreshing saved items:', error);
      return false;
    }
  }

  /**
   * Opens an edit form for an item
   * @param {Object} itemData Item data to edit
   * @param {Object} options Edit options
   * @returns {Promise<boolean>} Success status
   */
  function editItem(itemData, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Default options
        const defaultOptions = {
          modalId: 'editModal',
          formId: 'editForm',
          title: 'Editar Item',
          saveButtonId: 'saveEditButton',
          onBeforeSave: null, // Function to call before save
          onAfterSave: null,  // Function to call after save
          onModalOpen: null,  // Function to call when modal opens
          onModalClose: null  // Function to call when modal closes
        };
        
        const settings = {...defaultOptions, ...options};
        
        // Get modal element
        const modalElement = document.getElementById(settings.modalId);
        if (!modalElement) {
          console.warn(`Modal ${settings.modalId} not found`);
          reject(new Error(`Modal ${settings.modalId} not found`));
          return;
        }
        
        // Set modal title if element exists
        const titleElement = modalElement.querySelector('.modal-title');
        if (titleElement) {
          titleElement.textContent = settings.title;
        }
        
        // Fill form with item data
        const success = editSavedItems(itemData, {
          formId: settings.formId,
          onComplete: settings.onModalOpen
        });
        
        if (!success) {
          reject(new Error('Failed to populate edit form'));
          return;
        }
        
        // Initialize modal
        let modal;
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          modal = new bootstrap.Modal(modalElement);
        } else {
          reject(new Error('Bootstrap Modal not available'));
          return;
        }
        
        // Set up event listeners for modal
        const onModalShown = function() {
          if (typeof settings.onModalOpen === 'function') {
            settings.onModalOpen(itemData, modalElement);
          }
        };
        
        const onModalHidden = function() {
          // Remove all event listeners we added
          modalElement.removeEventListener('shown.bs.modal', onModalShown);
          modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
          
          if (typeof settings.onModalClose === 'function') {
            settings.onModalClose(itemData, modalElement);
          }
        };
        
        // Add event listeners
        modalElement.addEventListener('shown.bs.modal', onModalShown);
        modalElement.addEventListener('hidden.bs.modal', onModalHidden);
        
        // Set up save button handler
        const saveButton = document.getElementById(settings.saveButtonId);
        if (saveButton) {
          const saveHandler = function(event) {
            event.preventDefault();
            
            // Show loading
            const loaderId = showLoadingIndicator(settings.modalId, 'Salvando...', {
              opacity: 0.5,
              position: 'absolute'
            });
            
            // Call onBeforeSave if provided
            Promise.resolve(
              typeof settings.onBeforeSave === 'function' ? 
              settings.onBeforeSave(itemData, modalElement) : 
              true
            )
            .then(shouldContinue => {
              if (shouldContinue === false) {
                // User canceled
                hideLoadingIndicator(loaderId);
                return;
              }
              
              // Simulate save (replace with actual save logic)
              setTimeout(() => {
                hideLoadingIndicator(loaderId);
                
                // Hide modal
                modal.hide();
                
                // Call onAfterSave if provided
                if (typeof settings.onAfterSave === 'function') {
                  settings.onAfterSave(itemData, modalElement);
                }
                
                resolve(true);
              }, 500);
            })
            .catch(error => {
              console.error('Error in beforeSave handler:', error);
              hideLoadingIndicator(loaderId);
              reject(error);
            });
          };
          
          // Remove any existing handler and add new one
          saveButton.replaceWith(saveButton.cloneNode(true));
          const newSaveButton = document.getElementById(settings.saveButtonId);
          newSaveButton.addEventListener('click', saveHandler);
          
          // Store event listener
          _state.eventListeners.set(newSaveButton, {
            type: 'click',
            handler: saveHandler
          });
        }
        
        // Show modal
        modal.show();
      } catch (error) {
        console.error('Error opening edit modal:', error);
        reject(error);
      }
    });
  }

  /**
   * Saves an edited item
   * @param {string} formId Form ID containing item data
   * @param {string} apiEndpoint API endpoint for saving
   * @param {Object} options Save options
   * @returns {Promise<Object>} Saved item data
   */
  function saveEditedItem(formId, apiEndpoint, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const form = document.getElementById(formId);
        if (!form) {
          reject(new Error(`Form ${formId} not found`));
          return;
        }
        
        // Default options
        const defaultOptions = {
          method: 'POST',
          idField: 'id',
          extraData: {},
          onBeforeSave: null,
          onProgress: null
        };
        
        const settings = {...defaultOptions, ...options};
        
        // Create FormData from form
        const formData = new FormData(form);
        
        // Add extra data
        for (const [key, value] of Object.entries(settings.extraData)) {
          formData.append(key, value);
        }
        
        // Call onBeforeSave if provided
        Promise.resolve(
          typeof settings.onBeforeSave === 'function' ? 
          settings.onBeforeSave(formData) : 
          formData
        )
        .then(processedData => {
          if (!processedData) {
            reject(new Error('Form data processing failed'));
            return;
          }
          
          // Make API request
          const xhr = new XMLHttpRequest();
          
          xhr.open(settings.method, apiEndpoint, true);
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          
          // Set up progress handler
          if (typeof settings.onProgress === 'function') {
            xhr.upload.onprogress = function(event) {
              if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                settings.onProgress(percentComplete, event);
              }
            };
          }
          
          // Set up completion handler
          xhr.onload = function() {
            if (xhr.status === 200) {
              try {
                // Parse response
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (parseError) {
                console.error('Error parsing response:', parseError);
                reject(new Error('Invalid JSON response'));
              }
            } else {
              reject(new Error(`Server returned status ${xhr.status}`));
            }
          };
          
          // Set up error handler
          xhr.onerror = function() {
            reject(new Error('Network error'));
          };
          
          // Send the form data
          xhr.send(processedData);
        })
        .catch(error => {
          console.error('Error processing form data:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Error saving edited item:', error);
        reject(error);
      }
    });
  }

  /**
   * Opens a period selection modal
   * @param {Object} options Modal options
   * @returns {Promise<Object>} Selected period data
   */
  function openPeriodoModal(options = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Default options
        const defaultOptions = {
          modalId: 'periodoModal',
          title: 'Selecionar Período',
          confirmButtonId: 'confirmPeriodoButton',
          periodoSelectId: 'periodoSelect',
          onConfirm: null,
          onCancel: null,
          preloadedPeriodos: null // Array of periods or function that returns them
        };
        
        const settings = {...defaultOptions, ...options};
        
        // Get modal element
        const modalElement = document.getElementById(settings.modalId);
        if (!modalElement) {
          reject(new Error(`Modal ${settings.modalId} not found`));
          return;
        }
        
        // Set modal title if element exists
        const titleElement = modalElement.querySelector('.modal-title');
        if (titleElement) {
          titleElement.textContent = settings.title;
        }
        
        // Get period select element
        const periodoSelect = document.getElementById(settings.periodoSelectId);
        if (!periodoSelect) {
          reject(new Error(`Period select ${settings.periodoSelectId} not found`));
          return;
        }
        
        // Clear existing options
        periodoSelect.innerHTML = '<option value="">Carregando períodos...</option>';
        
        // Load periods
        const loadPeriods = settings.preloadedPeriodos instanceof Function ? 
                          settings.preloadedPeriodos() : 
                          Promise.resolve(settings.preloadedPeriodos || []);
        
        // Initialize modal
        let modal;
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          modal = new bootstrap.Modal(modalElement);
        } else {
          reject(new Error('Bootstrap Modal not available'));
          return;
        }
        
        // Show modal
        modal.show();
        
        // Get periods and fill select
        Promise.resolve(loadPeriods)
          .then(periods => {
            // Clear loading option
            periodoSelect.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione um período';
            periodoSelect.appendChild(defaultOption);
            
            // Add periods
            if (Array.isArray(periods)) {
              periods.forEach(period => {
                const option = document.createElement('option');
                option.value = period.id || '';
                option.textContent = period.nome || '';
                
                // Add data attributes
                if (period.data_attributes) {
                  for (const [key, value] of Object.entries(period.data_attributes)) {
                    option.dataset[key] = value;
                  }
                }
                
                periodoSelect.appendChild(option);
              });
            } else {
              console.warn('No periods available');
              periodoSelect.innerHTML = '<option value="">Nenhum período disponível</option>';
            }
          })
          .catch(error => {
            console.error('Error loading periods:', error);
            periodoSelect.innerHTML = '<option value="">Erro ao carregar períodos</option>';
          });
        
        // Set up event listeners for modal
        const onModalHidden = function() {
          // Remove all event listeners we added
          modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
          
          if (confirmButton) {
            confirmButton.removeEventListener('click', confirmHandler);
          }
        };
        
        // Confirm button handler
        const confirmHandler = function() {
          // Get selected period
          const selectedOption = periodoSelect.options[periodoSelect.selectedIndex];
          
          if (!selectedOption || !selectedOption.value) {
            // Show error or warning
            alert('Por favor, selecione um período válido');
            return;
          }
          
          // Create period data
          const periodData = {
            id: selectedOption.value,
            nome: selectedOption.textContent,
            // Add any data attributes
            ...Object.fromEntries(Object.entries(selectedOption.dataset))
          };
          
          // Call onConfirm handler if provided
          if (typeof settings.onConfirm === 'function') {
            const result = settings.onConfirm(periodData);
            
            // If handler returns false, prevent closing
            if (result === false) {
              return;
            }
          }
          
          // Close modal
          modal.hide();
          
          // Resolve promise with period data
          resolve(periodData);
        };
        
        // Add event listeners
        modalElement.addEventListener('hidden.bs.modal', onModalHidden);
        
        // Set up confirm button
        const confirmButton = document.getElementById(settings.confirmButtonId);
        if (confirmButton) {
          confirmButton.addEventListener('click', confirmHandler);
        }
        
        // Handle cancel
        modalElement.addEventListener('hidden.bs.modal', function onHidden() {
          modalElement.removeEventListener('hidden.bs.modal', onHidden);
          
          // Call cancel handler if provided
          if (typeof settings.onCancel === 'function') {
            settings.onCancel();
          }
          
          // Reject promise if not already resolved
          reject(new Error('Modal closed without selection'));
        }, { once: true });
      } catch (error) {
        console.error('Error opening period modal:', error);
        reject(error);
      }
    });
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================
  
  return {
    // Safe DOM manipulation
    sanitizeId,
    escaparString,
    definirValorSeguro,
    definirCheckboxSeguro,
    definirRadioSeguro,
    obterValorSeguro,
    obterCheckboxSeguro,
    
    // UI and DOM manipulation
    showLoadingIndicator,
    hideLoadingIndicator,
    adicionarBotaoSincronizacao,
    clearAllIntervals,
    
    // State management
    limparEventListeners,
    toggleNewItem,
    toggleStatusRadios,
    editSavedItems,
    refreshSavedItemsFromModal,
    editItem,
    saveEditedItem,
    openPeriodoModal,
    
    // Module info
    version: '1.0.0'
  };
})();

// Export for usage with ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImplantacaoUtils;
}
