/**
 * DataTables Initialization Module
 * Handles Preline DataTables setup for admin pages
 */

import { LazyLoader } from '../config/lazy-loader.js';

class DataTableManager {
    constructor() {
        this.tables = new Map();
        this.isPrelineLoaded = false;
        this.loadPromise = null;
    }

    /**
     * Load required libraries for DataTables
     */
    async loadDependencies() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise(async (resolve, reject) => {
            try {
                // Check if Preline datatable is available
                if (typeof HSDataTable !== 'undefined') {
                    console.log('✅ Preline DataTables already loaded');
                    this.isPrelineLoaded = true;
                    resolve(true);
                    return;
                }

                console.log('⏳ Loading Preline DataTables...');
                await LazyLoader.loadPrelineComponents();
                
                this.isPrelineLoaded = true;
                console.log('✅ Preline DataTables loaded successfully');
                resolve(true);
            } catch (error) {
                console.error('❌ Failed to load DataTables dependencies:', error);
                reject(error);
            }
        });

        return this.loadPromise;
    }

    /**
     * Initialize all DataTables on the page
     */
    async initializeDataTables() {
        try {
            await this.loadDependencies();

            // Find all data tables
            const tableElements = document.querySelectorAll('[data-hs-datatable]');
            
            if (tableElements.length === 0) {
                console.log('📋 No DataTables found on this page');
                return;
            }

            console.log(`📊 Found ${tableElements.length} DataTable(s) to initialize`);

            tableElements.forEach((element, index) => {
                try {
                    const tableId = element.id || `datatable-${index}`;
                    
                    // Initialize Preline DataTable
                    const dataTable = HSDataTable.getInstance(element, true);
                    
                    if (dataTable) {
                        this.tables.set(tableId, dataTable);
                        console.log(`✅ DataTable ${tableId} initialized successfully`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to initialize DataTable ${index}:`, error);
                }
            });

            console.log(`✅ Initialized ${this.tables.size} DataTable(s)`);

        } catch (error) {
            console.error('❌ Failed to initialize DataTables:', error);
        }
    }

    /**
     * Refresh all DataTables
     */
    refreshTables() {
        this.tables.forEach((table, tableId) => {
            try {
                if (table && typeof table.refresh === 'function') {
                    table.refresh();
                    console.log(`🔄 Refreshed DataTable: ${tableId}`);
                }
            } catch (error) {
                console.error(`❌ Failed to refresh DataTable ${tableId}:`, error);
            }
        });
    }

    /**
     * Destroy all DataTables
     */
    destroy() {
        this.tables.forEach((table, tableId) => {
            try {
                if (table && typeof table.destroy === 'function') {
                    table.destroy();
                    console.log(`🗑️ Destroyed DataTable: ${tableId}`);
                }
            } catch (error) {
                console.error(`❌ Failed to destroy DataTable ${tableId}:`, error);
            }
        });
        
        this.tables.clear();
        console.log('✅ All DataTables destroyed');
    }
}

// Initialize DataTables when DOM is ready
let dataTableManager = null;

document.addEventListener('DOMContentLoaded', function() {
    dataTableManager = new DataTableManager();
    
    // Make globally available
    window.dataTableManager = dataTableManager;
    
    // Initialize with a small delay to ensure DOM is fully ready
    setTimeout(() => {
        dataTableManager.initializeDataTables();
    }, 500);
    
    console.log('✅ DataTable manager initialized');
});

// Global function for manual initialization
window.initializeDataTables = function() {
    if (window.dataTableManager) {
        return window.dataTableManager.initializeDataTables();
    } else {
        console.error('❌ DataTable manager not available');
        return null;
    }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (dataTableManager) {
        dataTableManager.destroy();
    }
});

export { DataTableManager };