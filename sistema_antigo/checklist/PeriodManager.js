/**
 * PeriodManager.js
 * Componente responsável por gerenciar períodos no sistema de checklist hospitalar
 * Implementado seguindo princípios SOLID e Clean Code
 */

class PeriodManager {
  /**
   * Construtor do gerenciador de períodos
   * @param {Object} config Configuração do gerenciador
   * @param {String} config.modalId ID do modal de períodos
   * @param {String} config.selectPeriodId ID do select de períodos
   * @param {String} config.unitDropdownId ID do dropdown de unidades
   * @param {String} config.startDateId ID do campo de data inicial
   * @param {String} config.endDateId ID do campo de data final
   * @param {String} config.deletePeriodId ID do select para excluir períodos
   * @param {String} config.titleDisplaySelector Seletor onde exibir o período selecionado
   * @param {Function} config.onPeriodSelected Callback após seleção de período
   */
  constructor(config) {
    // Elementos do DOM
    this.modalId = config.modalId || 'periodModal';
    this.selectPeriodId = config.selectPeriodId || 'select-period-dropdown';
    this.unitDropdownId = config.unitDropdownId || 'unit-dropdown';
    this.startDateId = config.startDateId || 'start-date';
    this.endDateId = config.endDateId || 'end-date';
    this.deletePeriodId = config.deletePeriodId || 'delete-period-dropdown';
    this.titleDisplaySelector = config.titleDisplaySelector || '.card-title';
    
    // Estado interno
    this.periods = [];
    this.selectedPeriod = null;
    this.units = [
      { id: 1, name: 'Hospital Central' },
      { id: 2, name: 'Hospital Norte' },
      { id: 3, name: 'Hospital Sul' }
    ];
    
    // Callbacks
    this.onPeriodSelected = config.onPeriodSelected || (() => {});
    
    // Modais do Bootstrap
    this.periodModal = null;
  }

  /**
   * Inicializa o gerenciador de períodos
   */
  initialize() {
    this._loadPeriodsFromStorage();
    this._initializeModal();
    this._initializeSelect2Controls();
    this._setupEventListeners();
    
    // Abre o modal automaticamente se não houver período selecionado
    if (!this.selectedPeriod) {
      this.openModal();
    } else {
      this._updateTitleDisplay();
    }
    
    return this;
  }

  /**
   * Abre o modal de gerenciamento de períodos
   */
  openModal() {
    if (this.periodModal) {
      this.periodModal.show();
    }
  }

  /**
   * Fecha o modal de gerenciamento de períodos
   */
  closeModal() {
    if (this.periodModal) {
      this.periodModal.hide();
    }
  }

  /**
   * Seleciona um período específico
   * @param {Object} period Período a ser selecionado
   */
  selectPeriod(period) {
    this.selectedPeriod = period;
    localStorage.setItem('selectedPeriod', JSON.stringify(period));
    this._updateTitleDisplay();
    this.onPeriodSelected(period);
  }

  /**
   * Cria um novo período
   * @param {Object} periodData Dados do novo período
   * @returns {Object} Período criado
   */
  createPeriod(periodData) {
    const unitObj = this.units.find(unit => unit.id === Number(periodData.unitId));
    
    const newPeriod = {
      id: Date.now().toString(),
      unitId: periodData.unitId,
      unitName: unitObj ? unitObj.name : 'Unidade Desconhecida',
      startDate: periodData.startDate,
      endDate: periodData.endDate,
      label: this._formatPeriodLabel(unitObj ? unitObj.name : 'Unidade', periodData.startDate, periodData.endDate)
    };
    
    this.periods.push(newPeriod);
    this._savePeriodsToStorage();
    this._updatePeriodSelects();
    
    return newPeriod;
  }

  /**
   * Remove um período
   * @param {String} periodId ID do período a ser removido
   * @returns {Boolean} Sucesso da operação
   */
  deletePeriod(periodId) {
    const initialLength = this.periods.length;
    this.periods = this.periods.filter(period => period.id !== periodId);
    
    if (this.selectedPeriod && this.selectedPeriod.id === periodId) {
      this.selectedPeriod = null;
      localStorage.removeItem('selectedPeriod');
      this._updateTitleDisplay();
    }
    
    this._savePeriodsToStorage();
    this._updatePeriodSelects();
    
    return initialLength !== this.periods.length;
  }

  /**
   * Obter período selecionado atualmente
   * @returns {Object|null} Período selecionado ou null
   */
  getSelectedPeriod() {
    return this.selectedPeriod;
  }

  /**
   * Carrega períodos do armazenamento local
   * @private
   */
  _loadPeriodsFromStorage() {
    try {
      const storedPeriods = localStorage.getItem('periods');
      if (storedPeriods) {
        this.periods = JSON.parse(storedPeriods);
      }
      
      const selectedPeriod = localStorage.getItem('selectedPeriod');
      if (selectedPeriod) {
        this.selectedPeriod = JSON.parse(selectedPeriod);
      }
    } catch (error) {
      console.error('Erro ao carregar períodos:', error);
      this.periods = [];
      this.selectedPeriod = null;
    }
  }

  /**
   * Salva períodos no armazenamento local
   * @private
   */
  _savePeriodsToStorage() {
    try {
      localStorage.setItem('periods', JSON.stringify(this.periods));
    } catch (error) {
      console.error('Erro ao salvar períodos:', error);
    }
  }

  /**
   * Inicializa o modal do Bootstrap
   * @private
   */
  _initializeModal() {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      this.periodModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  /**
   * Inicializa os controles Select2
   * @private
   */
  _initializeSelect2Controls() {
    // Dropdown de seleção de período
    $(`#${this.selectPeriodId}`).select2({
      placeholder: 'Selecione um período',
      allowClear: true,
      width: '100%'
    });
    
    // Dropdown de unidades
    $(`#${this.unitDropdownId}`).select2({
      placeholder: 'Selecione uma unidade',
      allowClear: true,
      width: '100%'
    });
    
    // Dropdown para excluir período
    $(`#${this.deletePeriodId}`).select2({
      placeholder: 'Selecione um período para excluir',
      allowClear: true,
      width: '100%'
    });
    
    this._updatePeriodSelects();
  }

  /**
   * Atualiza os selects de períodos com os dados atuais
   * @private
   */
  _updatePeriodSelects() {
    // Atualiza o select de seleção de período
    const selectPeriod = $(`#${this.selectPeriodId}`);
    selectPeriod.empty();
    selectPeriod.append('<option value="">Selecione um período</option>');
    
    // Atualiza o select de exclusão de período
    const deletePeriod = $(`#${this.deletePeriodId}`);
    deletePeriod.empty();
    deletePeriod.append('<option value="">Selecione um período</option>');
    
    // Adiciona as opções em ambos os selects
    this.periods.forEach(period => {
      const option = new Option(period.label, period.id, false, false);
      selectPeriod.append(option);
      
      const deleteOption = new Option(period.label, period.id, false, false);
      deletePeriod.append(deleteOption);
    });
    
    // Se há um período selecionado, marca-o no select
    if (this.selectedPeriod) {
      selectPeriod.val(this.selectedPeriod.id).trigger('change');
    }
    
    // Recarrega os selects para aplicar as mudanças
    selectPeriod.trigger('change');
    deletePeriod.trigger('change');
  }

  /**
   * Configura os event listeners
   * @private
   */
  _setupEventListeners() {
    // Botão de confirmação de período
    const confirmBtn = document.getElementById('confirm-period-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this._handleConfirmPeriod());
    }
    
    // Botão de criação de período
    const createBtn = document.getElementById('create-period-btn');
    if (createBtn) {
      createBtn.addEventListener('click', () => this._handleCreatePeriod());
    }
    
    // Botão de exclusão de período
    const deleteBtn = document.getElementById('delete-period-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this._handleDeletePeriod());
    }
  }

  /**
   * Manipula o evento de confirmação de período
   * @private
   */
  _handleConfirmPeriod() {
    const periodId = $(`#${this.selectPeriodId}`).val();
    
    if (!periodId) {
      alert('Por favor, selecione um período válido.');
      return;
    }
    
    const selectedPeriod = this.periods.find(period => period.id === periodId);
    if (selectedPeriod) {
      this.selectPeriod(selectedPeriod);
      this.closeModal();
    }
  }

  /**
   * Manipula o evento de criação de período
   * @private
   */
  _handleCreatePeriod() {
    const unitId = $(`#${this.unitDropdownId}`).val();
    const startDate = document.getElementById(this.startDateId).value;
    const endDate = document.getElementById(this.endDateId).value;
    
    if (!unitId) {
      alert('Por favor, selecione uma unidade.');
      return;
    }
    
    if (!startDate) {
      alert('Por favor, selecione uma data de início.');
      return;
    }
    
    if (!endDate) {
      alert('Por favor, selecione uma data de fim.');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      alert('A data de início não pode ser posterior à data de fim.');
      return;
    }
    
    const newPeriod = this.createPeriod({
      unitId,
      startDate,
      endDate
    });
    
    // Limpa os campos do formulário
    $(`#${this.unitDropdownId}`).val('').trigger('change');
    document.getElementById(this.startDateId).value = '';
    document.getElementById(this.endDateId).value = '';
    
    // Seleciona a aba de seleção de período e seleciona o novo período
    const selectTab = document.getElementById('select-tab');
    if (selectTab) {
      const tabTrigger = new bootstrap.Tab(selectTab);
      tabTrigger.show();
      
      setTimeout(() => {
        $(`#${this.selectPeriodId}`).val(newPeriod.id).trigger('change');
      }, 300);
    }
    
    alert('Período criado com sucesso!');
  }

  /**
   * Manipula o evento de exclusão de período
   * @private
   */
  _handleDeletePeriod() {
    const periodId = $(`#${this.deletePeriodId}`).val();
    
    if (!periodId) {
      alert('Por favor, selecione um período para excluir.');
      return;
    }
    
    const confirmDelete = confirm('Tem certeza que deseja excluir este período? Esta ação não pode ser desfeita.');
    if (confirmDelete) {
      if (this.deletePeriod(periodId)) {
        alert('Período excluído com sucesso!');
        $(`#${this.deletePeriodId}`).val('').trigger('change');
      } else {
        alert('Erro ao excluir o período.');
      }
    }
  }

  /**
   * Atualiza a exibição do título com o período selecionado
   * @private
   */
  _updateTitleDisplay() {
    const titleElement = document.querySelector(this.titleDisplaySelector);
    if (titleElement && this.selectedPeriod) {
      // Verifica se já existe um elemento com a informação do período
      let periodInfoElement = titleElement.querySelector('.period-info');
      
      // Se não existir, cria um novo
      if (!periodInfoElement) {
        periodInfoElement = document.createElement('span');
        periodInfoElement.className = 'period-info badge bg-primary ms-2';
        titleElement.appendChild(periodInfoElement);
      }
      
      periodInfoElement.textContent = this.selectedPeriod.label;
    }
  }

  /**
   * Formata o rótulo do período
   * @param {String} unitName Nome da unidade
   * @param {String} startDate Data de início
   * @param {String} endDate Data de fim
   * @returns {String} Rótulo formatado
   * @private
   */
  _formatPeriodLabel(unitName, startDate, endDate) {
    const start = new Date(startDate).toLocaleDateString('pt-BR');
    const end = new Date(endDate).toLocaleDateString('pt-BR');
    return `${unitName} (${start} - ${end})`;
  }
}

// Disponibiliza globalmente
window.PeriodManager = PeriodManager;