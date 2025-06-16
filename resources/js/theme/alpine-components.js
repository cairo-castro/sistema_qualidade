export function createAlpineThemeComponents() {
    return {
        themeManager() {
            // Use the global theme manager instance instead of creating a new one
            const getThemeManager = () => window.Hospital?.themeManager;
            
            return {
                // Reactive properties for Alpine.js
                open: false,
                loading: false,
                isResetting: false,
                
                init() {
                    const tm = getThemeManager();
                    if (tm) {
                        console.log('🎨 Alpine.js Theme Manager initialized');
                        
                        // Don't sync with global theme manager state in init
                        // Alpine.js will handle reactivity
                    } else {
                        console.error('❌ Global theme manager not available');
                    }
                },

                async saveTheme() {
                    console.log('🎨 Alpine: Saving theme...');
                    this.loading = true;
                    try {
                        const tm = getThemeManager();
                        if (tm) {
                            await tm.saveTheme();
                        }
                    } catch (error) {
                        console.error('❌ Alpine: Error saving theme:', error);
                    } finally {
                        this.loading = false;
                    }
                },

                async resetTheme() {
                    console.log('🔄 Alpine: Resetting theme...');
                    this.isResetting = true;
                    this.loading = true;
                    try {
                        const tm = getThemeManager();
                        if (tm && tm.resetThemeWithoutState) {
                            // Use a version that doesn't manage isResetting internally
                            await tm.resetThemeWithoutState();
                        } else if (tm) {
                            await tm.resetTheme();
                        }
                    } catch (error) {
                        console.error('❌ Alpine: Error resetting theme:', error);
                    } finally {
                        this.isResetting = false;
                        this.loading = false;
                    }
                },

                applyPreset(presetName) {
                    console.log(`🎨 Alpine: Applying preset ${presetName}`);
                    const tm = getThemeManager();
                    if (tm) {
                        tm.applyPreset(presetName);
                    }
                },

                updateColor(type, value) {
                    console.log(`🎨 Alpine: Updating ${type} color to ${value}`);
                    const tm = getThemeManager();
                    if (tm) {
                        tm.updateColor(type, value);
                    }
                },

                toggle() {
                    console.log('🎨 Alpine: Toggle called, current open:', this.open);
                    this.open = !this.open;
                    
                    // Also sync with global theme manager
                    const tm = getThemeManager();
                    if (tm) {
                        tm.open = this.open;
                    }
                    
                    console.log('🎨 Alpine: New open state:', this.open);
                },

                get isOpen() {
                    return this.open;
                },

                get isLoading() {
                    return this.loading;
                },


                get isCustomActive() {
                    const tm = getThemeManager();
                    return tm ? tm.isCustomActive : false;
                },

                get colors() {
                    const tm = getThemeManager();
                    return tm ? tm.colors : { navbar: '#ffffff', sidebar: '#ffffff', background: '#f9fafb', accent: '#22c55e' };
                },

                testPreset(presetName) {
                    console.log(`🧪 Alpine: Testing preset ${presetName}`);
                    const tm = getThemeManager();
                    if (tm) {
                        tm.testPreset(presetName);
                    }
                }
            };
        },

        hospitalDashboard() {
            return {
                sidebarCollapsed: JSON.parse(localStorage.getItem('hospital-sidebar-collapsed') || 'false'),
                
                init() {
                    console.log('🏥 Hospital Dashboard Alpine component initialized');
                    console.log('📋 Initial sidebar state:', this.sidebarCollapsed);
                    
                    this.$watch('sidebarCollapsed', (value) => {
                        console.log('📋 Sidebar state changed to:', value);
                        localStorage.setItem('hospital-sidebar-collapsed', JSON.stringify(value));
                    });
                },

                toggleSidebar() {
                    console.log('📋 Toggling sidebar from:', this.sidebarCollapsed);
                    this.sidebarCollapsed = !this.sidebarCollapsed;
                    console.log('📋 Sidebar toggled to:', this.sidebarCollapsed);
                },

                collapseSidebar() {
                    if (!this.sidebarCollapsed) {
                        this.sidebarCollapsed = true;
                        console.log('📋 Sidebar collapsed');
                    }
                },

                expandSidebar() {
                    if (this.sidebarCollapsed) {
                        this.sidebarCollapsed = false;
                        console.log('📋 Sidebar expanded');
                    }
                },

                get sidebarClasses() {
                    return this.sidebarCollapsed ? 'w-16' : 'w-64';
                },

                get contentClasses() {
                    return this.sidebarCollapsed ? 'ml-16' : 'ml-64';
                }
            };
        },

        themeColorPicker() {
            return {
                selectedColor: '#ffffff',
                colorType: 'navbar',
                isPickerOpen: false,
                recentColors: JSON.parse(localStorage.getItem('theme-recent-colors') || '[]'),
                
                init() {
                    console.log('🎨 Theme Color Picker initialized');
                    this.loadRecentColors();
                },

                openPicker(type) {
                    this.colorType = type;
                    this.selectedColor = window.Hospital?.themeManager?.colors?.[type] || '#ffffff';
                    this.isPickerOpen = true;
                    console.log(`🎨 Opened color picker for: ${type}`);
                },

                closePicker() {
                    this.isPickerOpen = false;
                    console.log('🎨 Closed color picker');
                },

                applyColor() {
                    if (window.Hospital?.themeManager) {
                        window.Hospital.themeManager.updateColor(this.colorType, this.selectedColor);
                        this.addToRecentColors(this.selectedColor);
                        this.closePicker();
                        console.log(`🎨 Applied color ${this.selectedColor} to ${this.colorType}`);
                    }
                },

                selectRecentColor(color) {
                    this.selectedColor = color;
                    this.applyColor();
                },

                addToRecentColors(color) {
                    if (!this.recentColors.includes(color)) {
                        this.recentColors.unshift(color);
                        if (this.recentColors.length > 8) {
                            this.recentColors = this.recentColors.slice(0, 8);
                        }
                        this.saveRecentColors();
                    }
                },

                saveRecentColors() {
                    localStorage.setItem('theme-recent-colors', JSON.stringify(this.recentColors));
                },

                loadRecentColors() {
                    const saved = localStorage.getItem('theme-recent-colors');
                    if (saved) {
                        this.recentColors = JSON.parse(saved);
                    }
                },

                clearRecentColors() {
                    this.recentColors = [];
                    localStorage.removeItem('theme-recent-colors');
                    console.log('🧹 Cleared recent colors');
                }
            };
        },

        themePresetSelector() {
            return {
                selectedPreset: null,
                isApplying: false,
                
                init() {
                    console.log('🎨 Theme Preset Selector initialized');
                },

                async selectPreset(presetName) {
                    if (this.isApplying) {
                        console.log('⏳ Preset application in progress, skipping...');
                        return;
                    }

                    this.isApplying = true;
                    this.selectedPreset = presetName;
                    
                    try {
                        console.log(`🎨 Selecting preset: ${presetName}`);
                        
                        if (window.Hospital?.themeManager) {
                            window.Hospital.themeManager.applyPreset(presetName);
                        }

                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        console.log(`✅ Preset ${presetName} applied successfully`);
                    } catch (error) {
                        console.error(`❌ Error applying preset ${presetName}:`, error);
                    } finally {
                        this.isApplying = false;
                    }
                },

                isSelected(presetName) {
                    return this.selectedPreset === presetName;
                },

                getPresetClasses(presetName) {
                    const baseClasses = 'preset-option cursor-pointer p-3 border rounded transition-all';
                    const selectedClasses = 'border-blue-500 bg-blue-50';
                    const defaultClasses = 'border-gray-200 hover:border-gray-300';
                    
                    return this.isSelected(presetName) 
                        ? `${baseClasses} ${selectedClasses}`
                        : `${baseClasses} ${defaultClasses}`;
                }
            };
        },

        themeSaveButton() {
            return {
                isSaving: false,
                saveStatus: null,
                
                init() {
                    console.log('💾 Theme Save Button initialized');
                },

                async saveTheme() {
                    if (this.isSaving) {
                        console.log('⏳ Save already in progress');
                        return;
                    }

                    this.isSaving = true;
                    this.saveStatus = 'saving';
                    
                    try {
                        console.log('💾 Starting theme save...');
                        
                        if (window.Hospital?.themeManager) {
                            await window.Hospital.themeManager.saveTheme();
                            this.saveStatus = 'success';
                            console.log('✅ Theme saved successfully');
                        } else {
                            throw new Error('Theme manager not available');
                        }
                    } catch (error) {
                        console.error('❌ Error saving theme:', error);
                        this.saveStatus = 'error';
                    } finally {
                        this.isSaving = false;
                        
                        setTimeout(() => {
                            this.saveStatus = null;
                        }, 3000);
                    }
                },

                get buttonText() {
                    switch (this.saveStatus) {
                        case 'saving':
                            return 'Salvando...';
                        case 'success':
                            return 'Salvo!';
                        case 'error':
                            return 'Erro ao salvar';
                        default:
                            return 'Salvar Tema';
                    }
                },

                get buttonClasses() {
                    const baseClasses = 'px-4 py-2 rounded transition-colors';
                    
                    switch (this.saveStatus) {
                        case 'saving':
                            return `${baseClasses} bg-yellow-500 text-white cursor-not-allowed`;
                        case 'success':
                            return `${baseClasses} bg-green-500 text-white`;
                        case 'error':
                            return `${baseClasses} bg-red-500 text-white`;
                        default:
                            return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white`;
                    }
                }
            };
        },

        themeResetButton() {
            return {
                isResetting: false,
                resetStatus: null,
                showConfirmation: false,
                
                init() {
                    console.log('🔄 Theme Reset Button initialized');
                },

                showConfirmDialog() {
                    this.showConfirmation = true;
                    console.log('🔄 Showing reset confirmation dialog');
                },

                hideConfirmDialog() {
                    this.showConfirmation = false;
                    console.log('🔄 Hiding reset confirmation dialog');
                },

                async confirmReset() {
                    if (this.isResetting) {
                        console.log('⏳ Reset already in progress');
                        return;
                    }

                    this.isResetting = true;
                    this.resetStatus = 'resetting';
                    this.showConfirmation = false;
                    
                    try {
                        console.log('🔄 Starting theme reset...');
                        
                        if (window.Hospital?.themeManager) {
                            await window.Hospital.themeManager.resetTheme();
                            this.resetStatus = 'success';
                            console.log('✅ Theme reset successfully');
                        } else {
                            throw new Error('Theme manager not available');
                        }
                    } catch (error) {
                        console.error('❌ Error resetting theme:', error);
                        this.resetStatus = 'error';
                    } finally {
                        this.isResetting = false;
                        
                        setTimeout(() => {
                            this.resetStatus = null;
                        }, 3000);
                    }
                },

                get buttonText() {
                    switch (this.resetStatus) {
                        case 'resetting':
                            return 'Restaurando...';
                        case 'success':
                            return 'Restaurado!';
                        case 'error':
                            return 'Erro ao restaurar';
                        default:
                            return 'Restaurar Tema';
                    }
                },

                get buttonClasses() {
                    const baseClasses = 'px-4 py-2 rounded transition-colors';
                    
                    switch (this.resetStatus) {
                        case 'resetting':
                            return `${baseClasses} bg-yellow-500 text-white cursor-not-allowed`;
                        case 'success':
                            return `${baseClasses} bg-green-500 text-white`;
                        case 'error':
                            return `${baseClasses} bg-red-500 text-white`;
                        default:
                            return `${baseClasses} bg-gray-500 hover:bg-gray-600 text-white`;
                    }
                }
            };
        }
    };
}

export function registerAlpineComponents(Alpine) {
    const components = createAlpineThemeComponents();
    
    Object.entries(components).forEach(([name, component]) => {
        Alpine.data(name, component);
        console.log(`📝 Registered Alpine component: ${name}`);
    });
    
    console.log('✅ All Alpine theme components registered');
}