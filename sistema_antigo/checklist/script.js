
// Constants Module - Single Responsibility Principle
const Constants = (() => {
  const STATUS_TYPES = {
    CONFORME: 'conforme',
    NAO_CONFORME: 'nao-conforme',
    PARCIALMENTE: 'parcialmente'
  };

  const PROBLEM_TYPES = [
    "Falta de equipamento",
    "Equipamento danificado",
    "Equipamento não calibrado",
    "Falha no sistema",
    "Falta de treinamento",
    "Falta de manutenção",
    "Erro de procedimento",
    "Item fora da validade",
    "Documentação incompleta",
    "Outro"
  ];

  const HOSPITAL_SECTORS = {
    emergency: "Emergência",
    icu: "UTI",
    surgery: "Centro Cirúrgico",
    wards: "Enfermarias"
  };

  const HOSPITAL_SUBSECTORS = {
    triage: { name: "Triagem", sector: "emergency" },
    observation: { name: "Observação", sector: "emergency" },
    trauma: { name: "Trauma", sector: "emergency" },
    "adult-icu": { name: "UTI Adulto", sector: "icu" },
    "pediatric-icu": { name: "UTI Pediátrica", sector: "icu" },
    "neonatal-icu": { name: "UTI Neonatal", sector: "icu" },
    "surgery-room": { name: "Sala de Cirurgia", sector: "surgery" },
    recovery: { name: "Recuperação", sector: "surgery" },
    materials: { name: "Central de Materiais", sector: "surgery" },
    medical: { name: "Clínica Médica", sector: "wards" },
    surgical: { name: "Cirúrgica", sector: "wards" },
    pediatrics: { name: "Pediatria", sector: "wards" }
  };

  const STATUS_COLORS = {
    [STATUS_TYPES.CONFORME]: '#28a745',
    [STATUS_TYPES.NAO_CONFORME]: '#dc3545',
    [STATUS_TYPES.PARCIALMENTE]: '#ffc107'
  };

  return {
    STATUS_TYPES,
    PROBLEM_TYPES,
    HOSPITAL_SECTORS,
    HOSPITAL_SUBSECTORS,
    STATUS_COLORS
  };
})();

// ExpandToggleComponent - Componente dedicado para o comportamento de expand/collapse
class ExpandToggleComponent {
  constructor(item, containerSelector) {
    this.item = item;
    this.problemRowId = `problema-row-${item.id}`;
    this.toggleContainerId = `toggle-container-${item.id}`;
    this.toggleIconId = `toggle-icon-${item.id}`;
    this.containerSelector = containerSelector;
    this.isExpanded = true;
  }

  render() {
    return `
      <div id="${this.toggleContainerId}" class="expand-toggle-container" data-item-id="${this.item.id}">
        <i id="${this.toggleIconId}" class="fas fa-chevron-down expand-toggle" data-item-id="${this.item.id}"></i>
      </div>
    `;
  }

  attach(container) {
    const toggleContainer = document.getElementById(this.toggleContainerId);
    if (!toggleContainer) return;

    // Remove qualquer listener existente antes de adicionar um novo
    const newToggleContainer = toggleContainer.cloneNode(true);
    toggleContainer.parentNode.replaceChild(newToggleContainer, toggleContainer);
    
    newToggleContainer.addEventListener('click', (e) => this.handleToggleClick(e));
  }

  handleToggleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    
    this.isExpanded = !this.isExpanded;
    this.updateUI();
  }

  updateUI() {
    const toggleIcon = document.getElementById(this.toggleIconId);
    const problemRow = document.querySelector(`.problema-row[data-for="${this.item.id}"]`);
    
    if (!toggleIcon || !problemRow) return;
    
    toggleIcon.classList.toggle('expanded', this.isExpanded);
    problemRow.style.display = this.isExpanded ? 'table-row' : 'none';
  }

  static removeIfExists(itemId) {
    const existingToggle = document.getElementById(`toggle-container-${itemId}`);
    if (existingToggle) {
      existingToggle.remove();
    }
  }
}

// Data Model - Single Responsibility Principle
class ChecklistItem {
  constructor({ id, item, status = "", nao_se_aplica = false, problemas = [], observacao = "", saved = false, sector = "", subsector = "" }) {
    this.id = id;
    this.item = item;
    this.status = status;
    this.nao_se_aplica = nao_se_aplica;
    this.problemas = Array.isArray(problemas) ? problemas : [problemas];
    this.observacao = observacao;
    this.saved = saved;
    this.sector = sector;
    this.subsector = subsector;
    this.isExpanded = false;
  }


  updateStatus(newStatus) {
    if (this.saved || this.nao_se_aplica) return false;
    this.status = newStatus;
    return true;
  }

  toggleNaoSeAplica() {
    if (this.saved) return false;
    this.nao_se_aplica = !this.nao_se_aplica;
    if (this.nao_se_aplica) {
      this.status = "";
      this.problema = "";
    }
    return true;
  }

  save() {
    if (!this.validateBeforeSave()) return false;
    this.saved = true;
    return true;
  }

  edit() {
    this.saved = false;
    return true;
  }

  validateBeforeSave() {
    if (this.nao_se_aplica) return true;
    if (!this.status) return false;
    if ((this.status === Constants.STATUS_TYPES.NAO_CONFORME || 
         this.status === Constants.STATUS_TYPES.PARCIALMENTE) && 
        this.problemas.length === 0) {
      return false;
    }
    return true;
  }
}

// Progress Tracker - Single Responsibility Principle
class ProgressTracker {
  constructor() {
    this.totalItems = 0;
    this.conformeCount = 0;
    this.parcialmenteCount = 0;
    this.naoConformeCount = 0;
  }

  update(items) {
    this.totalItems = items.length;
    this.conformeCount = items.filter(item => 
      item.status === Constants.STATUS_TYPES.CONFORME && item.saved).length;
    this.parcialmenteCount = items.filter(item => 
      item.status === Constants.STATUS_TYPES.PARCIALMENTE && item.saved).length;
    this.naoConformeCount = items.filter(item => 
      item.status === Constants.STATUS_TYPES.NAO_CONFORME && item.saved).length;
  }

  render() {
    const totalVerified = this.conformeCount + this.parcialmenteCount + this.naoConformeCount;
    const remaining = this.totalItems - totalVerified;

    // Update counts
    document.getElementById('completed-count').textContent = totalVerified;
    document.getElementById('total-count').textContent = this.totalItems;
    document.getElementById('count-conforme').textContent = this.conformeCount;
    document.getElementById('count-parcialmente').textContent = this.parcialmenteCount;
    document.getElementById('count-nao-conforme').textContent = this.naoConformeCount;
    document.getElementById('count-restante').textContent = remaining;

    // Calculate percentages
    const conformePercent = (this.conformeCount / this.totalItems) * 100;
    const parcialmentePercent = (this.parcialmenteCount / this.totalItems) * 100;
    const naoConformePercent = (this.naoConformeCount / this.totalItems) * 100;

    // Update progress bars
    document.getElementById('progress-conforme').style.width = `${conformePercent}%`;
    document.getElementById('progress-parcialmente').style.width = `${parcialmentePercent}%`;
    document.getElementById('progress-nao-conforme').style.width = `${naoConformePercent}%`;

    // Update bar labels (only if enough space)
    document.getElementById('progress-conforme').textContent = conformePercent >= 15 ? 'Conforme' : '';
    document.getElementById('progress-parcialmente').textContent = parcialmentePercent >= 15 ? 'Parcialmente' : '';
    document.getElementById('progress-nao-conforme').textContent = naoConformePercent >= 15 ? 'Não Conforme' : '';
  }
}

// UI Renderer - Single Responsibility Principle
class ChecklistRenderer {
  constructor(tableBody, checklistItems) {
    this.tableBody = tableBody;
    this.checklistItems = checklistItems;
    this.currentFilter = null;
  }
  setupAllExpandToggles() {
  this.checklistItems.forEach(item => {
    if ((item.status === Constants.STATUS_TYPES.NAO_CONFORME || 
        item.status === Constants.STATUS_TYPES.PARCIALMENTE) && 
        !item.nao_se_aplica) {
      
      const toggleContainer = document.getElementById(`toggle-container-${item.id}`);
      if (toggleContainer) {
        const toggleComponent = new ExpandToggleComponent(item, toggleContainer.parentNode);
        toggleComponent.attach(toggleContainer.parentNode);
      }
    }
  });
}

renderTable() {
    // Mantenha os itens que já estão renderizados
    const existingRows = Array.from(this.tableBody.querySelectorAll('tr[data-id]'));
    
    const filteredItems = this.currentFilter 
      ? this.checklistItems.filter(item => item.subsector === this.currentFilter)
      : this.checklistItems;

    // Verifique quais itens precisam ser renderizados/atualizados
    filteredItems.forEach(item => {
      const existingRow = existingRows.find(row => row.dataset.id === item.id.toString());
      if (!existingRow) {
        this.renderItemRow(item);
      } else {
        this.updateItemRow(existingRow, item);
      }
    });

    // Remova itens que não estão mais na lista filtrada
    existingRows.forEach(row => {
      if (!filteredItems.some(item => item.id.toString() === row.dataset.id)) {
        row.remove();
        this.removeProblemRowIfExists(row.dataset.id);
      }
    });

    this.dispatchUpdateEvent();
  }

    updateItemRow(row, item) {
    // Atualize apenas as células necessárias
    const cells = row.cells;
    
    // Atualize célula de status
    cells[2].innerHTML = this.createStatusRadioHtml(item);
    
    // Atualize célula de "Não se Aplica"
    cells[3].innerHTML = this.createNsaCheckboxHtml(item);
    
    // Atualize célula de observação
    cells[4].innerHTML = this.createObservacaoInputHtml(item);
    
    // Atualize célula de ações
    cells[5].innerHTML = this.createActionCell(item).innerHTML;
    
    // Atualize classes de status
    this.applyRowClasses(row, item);
    
    // Mantenha ou atualize a linha de problema
    this.handleProblemRow(row, item, item.status);
    
    // Reanexe os event listeners
    this.addRowEventListeners(row, item);
  }

  renderItemRow(item) {
    const row = document.createElement('tr');
    row.dataset.id = item.id;
    
    const cells = [
      this.createIdCell(item),
      this.createItemCell(item),
      this.createStatusCell(item),
      this.createNsaCell(item),
      this.createObservationCell(item),
      this.createActionCell(item)
    ];

    cells.forEach(cell => row.appendChild(cell));
    this.addRowEventListeners(row, item);
    this.tableBody.appendChild(row);

    if ((item.status === Constants.STATUS_TYPES.NAO_CONFORME || 
         item.status === Constants.STATUS_TYPES.PARCIALMENTE) && !item.nao_se_aplica) {
      this.renderProblemRow(item, row);
    }
  }

  createIdCell(item) {
    const cell = document.createElement('td');
    cell.textContent = item.id;
    this.applyStatusStyles(cell, item);
    return cell;
  }

  createItemCell(item) {
    const cell = document.createElement('td');
    cell.textContent = item.item;
    this.applyStatusStyles(cell, item);
    return cell;
  }

  createStatusCell(item) {
    const cell = document.createElement('td');
    cell.innerHTML = this.createStatusRadioHtml(item);
    this.applyStatusStyles(cell, item);
    return cell;
  }

  createNsaCell(item) {
    const cell = document.createElement('td');
    cell.className = 'text-center';
    cell.innerHTML = this.createNsaCheckboxHtml(item);
    this.applyStatusStyles(cell, item);
    return cell;
  }

  createObservationCell(item) {
    const cell = document.createElement('td');
    cell.innerHTML = this.createObservacaoInputHtml(item);
    this.applyStatusStyles(cell, item);
    return cell;
  }

  createActionCell(item) {
    const cell = document.createElement('td');
    cell.className = 'text-center action-cell';
    
    const actionBtnContainer = document.createElement('div');
    actionBtnContainer.className = 'action-button-container';
    
    const actionBtn = document.createElement('button');
    actionBtn.className = `action-button ${item.saved ? 'btn-edit' : 'btn-save'}`;
    actionBtn.textContent = item.saved ? 'Editar' : 'Salvar';
    actionBtnContainer.appendChild(actionBtn);
    cell.appendChild(actionBtnContainer);
    
    const hasProblemRow = (item.status === Constants.STATUS_TYPES.NAO_CONFORME || 
                         item.status === Constants.STATUS_TYPES.PARCIALMENTE) && 
                        !item.nao_se_aplica;
    
    if (hasProblemRow) {
      const toggleComponent = new ExpandToggleComponent(item, cell);
      cell.insertAdjacentHTML('beforeend', toggleComponent.render());
      setTimeout(() => toggleComponent.attach(cell), 0);
    }
    
    return cell;
  }

  createStatusRadioHtml(item) {
    return `
      <div class="radio-group">
        ${this.createStatusOptionHtml(item, Constants.STATUS_TYPES.CONFORME, "Conforme", "status-conforme")}
        ${this.createStatusOptionHtml(item, Constants.STATUS_TYPES.NAO_CONFORME, "Não Conforme", "status-nao-conforme")}
        ${this.createStatusOptionHtml(item, Constants.STATUS_TYPES.PARCIALMENTE, "Parcialmente", "status-parcialmente")}
      </div>
    `;
  }

  createStatusOptionHtml(item, value, label, cssClass) {
    const isActive = item.status === value ? 'active' : '';
    const isDisabled = item.saved || item.nao_se_aplica ? 'disabled' : '';
    const isChecked = item.status === value ? 'checked' : '';
    
    return `
      <label class="status-radio ${cssClass} ${isActive}">
        <input type="radio" name="status-${item.id}" value="${value}" 
               class="radio-input" ${isChecked} ${isDisabled}>
        ${label}
      </label>
    `;
  }

  createNsaCheckboxHtml(item) {
    const isChecked = item.nao_se_aplica ? 'checked' : '';
    const isDisabled = item.saved ? 'disabled' : '';
    
    return `
      <div class="checkbox-container">
        <input type="checkbox" class="nsa-checkbox" ${isChecked} ${isDisabled}>
      </div>
    `;
  }

  createObservacaoInputHtml(item) {
    const isDisabled = item.saved || item.nao_se_aplica ? 'disabled' : '';
    return `
      <textarea class="form-control observacao-input" rows="1" 
                placeholder="Adicione uma observação..." ${isDisabled}>${item.observacao || ''}</textarea>
    `;
  }

createProblemRow(item) {
  const template = document.getElementById('problema-template');
  const row = document.importNode(template.content, true).querySelector('tr');
  row.dataset.for = item.id;

  const select = row.querySelector('.problema-select');
  select.innerHTML = ''; // Start with empty select
  
  const problemSelect = new ProblemSelectComponent(
    select,
    Constants.PROBLEM_TYPES,
    item.problemas // Now passing an array
  ).initialize();
  
  problemSelect.onChange((values) => {
    item.problemas = values;
    this.dispatchUpdateEvent();
  });

  if (item.saved) {
    $(select).prop('disabled', true);
  }

  return row;
}

  renderProblemRow(item, mainRow) {
    this.removeProblemRowIfExists(item.id);
    
    const problemRow = this.createProblemRow(item);
    problemRow.id = `problema-row-${item.id}`;
    mainRow.insertAdjacentElement('afterend', problemRow);
    problemRow.style.display = 'table-row';
    
    return problemRow;
  }

  applyStatusStyles(cell, item) {
    cell.classList.toggle('row-saved', item.saved);
    cell.classList.toggle('row-disabled', item.nao_se_aplica);
    
    if (item.status && !item.nao_se_aplica) {
      cell.classList.add(`row-status-${item.status}`);
    }
    
    if (cell.cellIndex === 0) {
      this.applyBorderStyle(cell, item);
    }
  }

  applyBorderStyle(cell, item) {
    const borderClasses = ['border-conforme', 'border-nao-conforme', 'border-parcialmente', 'border-nao-se-aplica'];
    cell.classList.remove(...borderClasses);
    
    if (item.status && !item.nao_se_aplica) {
      cell.classList.add(`border-${item.status}`);
    } else if (item.nao_se_aplica) {
      cell.classList.add('border-nao-se-aplica');
    }
  }

  addRowEventListeners(row, item) {
    this.setupStatusRadioListeners(row, item);
    this.setupNsaCheckboxListener(row, item);
    this.setupObservationListener(row, item);
    this.setupActionButtonListener(row, item);
  }

  setupStatusRadioListeners(row, item) {
    row.querySelectorAll('.radio-input').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (item.updateStatus(e.target.value)) {
          row.querySelectorAll('.status-radio').forEach(label => 
            label.classList.remove('active'));
          e.target.parentElement.classList.add('active');
          
          this.applyRowClasses(row, item);
          this.handleProblemRow(row, item, e.target.value);
          this.dispatchUpdateEvent();
        }
      });
    });
  }

  setupNsaCheckboxListener(row, item) {
    const nsaCheckbox = row.querySelector('.nsa-checkbox');
    if (nsaCheckbox) {
      nsaCheckbox.addEventListener('change', () => {
        if (item.toggleNaoSeAplica()) {
          this.applyRowClasses(row, item);
          this.toggleDisabledFields(row, item.nao_se_aplica);
          this.removeProblemRowIfExists(item.id);
          this.dispatchUpdateEvent();
        }
      });
    }
  }

  setupObservationListener(row, item) {
    const obsTextarea = row.querySelector('.observacao-input');
    if (obsTextarea) {
      obsTextarea.addEventListener('input', (e) => {
        item.observacao = e.target.value;
        this.dispatchUpdateEvent();
      });
    }
  }

  setupActionButtonListener(row, item) {
  const actionButton = row.querySelector('.action-button');
  if (actionButton) {
    actionButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (item.saved) {
        item.edit();
      } else {
        if (!item.validateBeforeSave()) {
          alert("Preencha todos os campos obrigatórios antes de salvar!");
          return;
        }
        item.save();
      }
      
      // Atualize apenas esta linha em vez de toda a tabela
      this.updateItemRow(row, item);
      this.dispatchUpdateEvent();
    });
  }
}

  applyRowClasses(row, item) {
    const cells = Array.from(row.cells).slice(0, -1);
    cells.forEach(cell => {
      cell.classList.toggle('row-saved', item.saved);
      cell.classList.toggle('row-disabled', item.nao_se_aplica);
      cell.classList.remove('row-status-conforme', 'row-status-nao-conforme', 'row-status-parcialmente');
      
      if (item.status && !item.nao_se_aplica) {
        cell.classList.add(`row-status-${item.status}`);
      }
    });
    
    this.applyBorderStyle(row.cells[0], item);
  }

  handleProblemRow(row, item, newStatus) {
    this.removeProblemRowIfExists(item.id);
    
    if (newStatus === Constants.STATUS_TYPES.NAO_CONFORME || 
        newStatus === Constants.STATUS_TYPES.PARCIALMENTE) {
      this.addExpandToggle(row);
      this.renderProblemRow(item, row);
    } else {
      this.removeExpandToggle(row);
    }
  }

  toggleDisabledFields(row, isDisabled) {
    row.querySelectorAll('.radio-input').forEach(radio => {
      radio.disabled = isDisabled;
    });
    
    const obsTextarea = row.querySelector('.observacao-input');
    if (obsTextarea) {
      obsTextarea.disabled = isDisabled;
    }
  }

  removeProblemRowIfExists(itemId) {
    const existingProblemRow = document.querySelector(`.problema-row[data-for="${itemId}"]`);
    if (existingProblemRow) {
      existingProblemRow.remove();
    }
  }

  addExpandToggle(row) {
    const actionCell = row.querySelector('.action-cell');
    if (actionCell && !actionCell.querySelector('.expand-toggle-container')) {
      actionCell.insertAdjacentHTML('beforeend', 
        '<div class="expand-toggle-container"><i class="fas fa-chevron-down expand-toggle expanded"></i></div>');
    }
  }

  removeExpandToggle(row) {
    const expandContainer = row.querySelector('.expand-toggle-container');
    if (expandContainer) expandContainer.remove();
  }

  filterBySubsector(subsector) {
    this.currentFilter = subsector;
    this.renderTable();
  }

  clearFilter() {
    this.currentFilter = null;
    this.renderTable();
  }

  dispatchUpdateEvent() {
    document.dispatchEvent(new CustomEvent('checklistUpdated'));
  }
}

// Data Service - Single Responsibility Principle
class ChecklistService {
  constructor() {
    this.items = [
      new ChecklistItem({ id: 1, item: "Leitos hospitalares em bom estado", sector: "wards", subsector: "medical" }),
      new ChecklistItem({ id: 2, item: "Medicamentos dentro da validade", sector: "icu", subsector: "adult-icu" }),
      new ChecklistItem({ id: 3, item: "Equipamentos de emergência funcionando", sector: "emergency", subsector: "triage" }),
      new ChecklistItem({ id: 4, item: "Sinalização de segurança adequada", sector: "surgery", subsector: "surgery-room" }),
      new ChecklistItem({ id: 5, item: "Materiais de proteção individual disponíveis", sector: "emergency", subsector: "trauma" }),
      new ChecklistItem({ id: 6, item: "Sistema de oxigênio operacional", sector: "icu", subsector: "pediatric-icu" }),
      new ChecklistItem({ id: 7, item: "Limpeza e higienização dos ambientes", sector: "wards", subsector: "pediatrics" }),
      new ChecklistItem({ id: 8, item: "Registro de temperatura de medicamentos", sector: "surgery", subsector: "materials" })
    ];
  }

  addNewItem(sector = "", subsector = "") {
    const lastId = this.items.length > 0 ? Math.max(...this.items.map(item => item.id)) : 0;
    const newItem = new ChecklistItem({
      id: lastId + 1,
      item: "Novo Item",
      sector,
      subsector
    });
    this.items.push(newItem);
    return newItem;
  }

  exportToCSV() {
    const headers = ['ID', 'Item', 'Status', 'Não se Aplica', 'Problema', 'Observação', 'Setor', 'Subsetor'];
    const rows = this.items.map(item => [
      item.id,
      item.item,
      item.status,
      item.nao_se_aplica ? 'Sim' : 'Não',
      item.problema,
      item.observacao,
      Constants.HOSPITAL_SECTORS[item.sector] || '',
      Constants.HOSPITAL_SUBSECTORS[item.subsector]?.name || ''
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

// Hospital Sectors Menu - Single Responsibility Principle
class HospitalSectorsMenu {
  constructor(menuSelector) {
    this.menu = document.querySelector(menuSelector);
    this.sectors = this.menu ? Array.from(this.menu.querySelectorAll('.custom-sector')) : [];
    this.activeSubsector = null;
    this.card = document.getElementById('sectors-card');
    this.collapseBtn = this.card ? this.card.querySelector('.custom-collapse') : null;
    this.isCollapsed = false;
  }

  initialize() {
    if (!this.menu) return;
    
    this.setupSectorToggleEvents();
    this.setupSubsectorClickEvents();
    this.setupCollapseButton();
    
    if (this.sectors.length > 0) {
      this.toggleSector(this.sectors[0], true);
    }
    
    const firstSubsector = this.menu.querySelector('.custom-subsector-link');
    if (firstSubsector) {
      this.setActiveSubsector(firstSubsector);
    }
  }

  setupSectorToggleEvents() {
    this.sectors.forEach(sector => {
      const header = sector.querySelector('.custom-sector-header');
      if (header) {
        header.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.isCollapsed) {
            this.toggleCardCollapse();
            setTimeout(() => this.toggleSector(sector), 300);
          } else {
            this.toggleSector(sector);
          }
        });
      }
    });
  }

  setupSubsectorClickEvents() {
    const subsectorLinks = this.menu.querySelectorAll('.custom-subsector-link');
    subsectorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.isCollapsed) {
          this.toggleCardCollapse();
          setTimeout(() => this.setActiveSubsector(link), 300);
        } else {
          this.setActiveSubsector(link);
        }
      });
    });
  }

  setupCollapseButton() {
    if (this.collapseBtn) {
      this.collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleCardCollapse();
      });
      this.ensureCollapseButtonVisibility();
    }
  }

  ensureCollapseButtonVisibility() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      #sectors-card .card-tools {
        opacity: 1 !important;
        visibility: visible !important;
      }
      #sectors-card .card-tools .btn-tool i {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(styleElement);
  }

  toggleSector(sector, forceExpand = false) {
    const subsectors = sector.querySelector('.custom-subsectors');
    const toggle = sector.querySelector('.custom-sector-toggle');
    
    if (!subsectors || !toggle) return;
    
    const isExpanding = forceExpand || !subsectors.classList.contains('expanded');
    
    if (isExpanding) {
      subsectors.classList.add('expanded');
      toggle.classList.add('rotated');
    } else {
      subsectors.classList.remove('expanded');
      toggle.classList.remove('rotated');
    }
  }

  setActiveSubsector(subsectorLink) {
    this.menu.querySelectorAll('.custom-subsector-link').forEach(link => {
      link.classList.remove('active');
      link.querySelector('i').classList.replace('fa-dot-circle', 'fa-circle');
    });
    
    subsectorLink.classList.add('active');
    subsectorLink.querySelector('i').classList.replace('fa-circle', 'fa-dot-circle');
    
    this.activeSubsector = subsectorLink.dataset.subsector;
    
    const event = new CustomEvent('subsectorChanged', {
      detail: { subsector: this.activeSubsector }
    });
    document.dispatchEvent(event);
  }

  toggleCardCollapse() {
    if (this.card) {
      this.card.classList.toggle('collapsed');
      this.isCollapsed = this.card.classList.contains('collapsed');
      
      const icon = this.collapseBtn.querySelector('i');
      if (this.isCollapsed) {
        icon.classList.replace('fa-minus', 'fa-plus');
      } else {
        icon.classList.replace('fa-plus', 'fa-minus');
      }
      
      setTimeout(this.ensureCollapseButtonVisibility.bind(this), 300);
    }
  }

  getActiveSubsector() {
    return this.activeSubsector;
  }

  isCardCollapsed() {
    return this.isCollapsed;
  }
}

// Hospital Sectors Sidebar - Single Responsibility Principle
class HospitalSectorsSidebar {
  constructor(container, sectors, subsectors) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.sectors = sectors || {};
    this.subsectors = subsectors || {};
    this.sidebarElement = null;
    this.activeSubsector = null;
    this.isCollapsed = localStorage.getItem('hospitalSectorsCollapsed') === 'true';
  }

  initialize() {
    if (!this.container) {
      console.error('Container para o menu de setores não encontrado');
      return;
    }

    this.render();
    this.setupEventListeners();
    this.applyCollapseState();
    
    const firstSector = this.sidebarElement.querySelector('.hospital-sector-item');
    if (firstSector) this.toggleSector(firstSector, true);
    
    const firstSubsector = this.sidebarElement.querySelector('.hospital-subsector-link');
    if (firstSubsector) this.setActiveSubsector(firstSubsector);
    
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  }

  render() {
    this.container.innerHTML = '';
    this.sidebarElement = document.createElement('div');
    this.sidebarElement.className = 'hospital-sectors-sidebar';
    this.sidebarElement.innerHTML = `
      <div class="hospital-sectors-card">
        <div class="hospital-sectors-header">
          <h3 class="hospital-sectors-title">
            <i class="fas fa-sitemap hospital-sectors-title-icon"></i>
            <span class="hospital-sectors-title-text">Setores Hospitalares</span>
          </h3>
          <button type="button" class="hospital-sectors-collapse-btn">
            <i class="fas fa-angle-left"></i>
          </button>
        </div>
        <div class="hospital-sectors-container">
          <ul class="hospital-sectors-menu">
            ${this.renderSectors()}
          </ul>
        </div>
      </div>
    `;
    this.container.appendChild(this.sidebarElement);
  }

  renderSectors() {
    return Object.entries(this.sectors).map(([sectorKey, sectorName]) => {
      const sectorSubsectors = Object.entries(this.subsectors)
        .filter(([, data]) => data.sector === sectorKey)
        .map(([key, data]) => ({ key, ...data }));
      
      if (sectorSubsectors.length === 0) return '';
      
      return `
        <li class="hospital-sector-item" data-sector="${sectorKey}">
          <div class="hospital-sector-header">
            <i class="hospital-sector-icon ${this.getSectorIcon(sectorKey)}" data-sector="${sectorKey}"></i>
            <span class="hospital-sector-text">${sectorName}</span>
            <i class="fas fa-angle-left hospital-sector-toggle"></i>
          </div>
          <ul class="hospital-subsectors">
            ${sectorSubsectors.map(subsector => `
              <li class="hospital-subsector-item">
                <a href="#" class="hospital-subsector-link" data-subsector="${subsector.key}">
                  <i class="far fa-circle hospital-subsector-icon"></i>
                  <span class="hospital-subsector-text">${subsector.name}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </li>
      `;
    }).join('');
  }

  getSectorIcon(sector) {
    const icons = {
      'emergency': 'fas fa-ambulance',
      'icu': 'fas fa-procedures',
      'surgery': 'fas fa-syringe',
      'wards': 'fas fa-bed'
    };
    return icons[sector] || 'fas fa-folder';
  }

  setupEventListeners() {
    const collapseBtn = this.sidebarElement.querySelector('.hospital-sectors-collapse-btn');
    if (collapseBtn) collapseBtn.addEventListener('click', this.toggleCollapse);
    
    const sectorHeaders = this.sidebarElement.querySelectorAll('.hospital-sector-header');
    sectorHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const sectorItem = header.closest('.hospital-sector-item');
        if (sectorItem) this.toggleSector(sectorItem);
      });
    });
    
    const subsectorLinks = this.sidebarElement.querySelectorAll('.hospital-subsector-link');
    subsectorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveSubsector(link);
      });
    });
  }

  toggleCollapse = () => {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('hospitalSectorsCollapsed', this.isCollapsed);
    this.applyCollapseState();
    
    const event = new CustomEvent('hospitalSidebarStateChanged', {
      detail: { isCollapsed: this.isCollapsed }
    });
    document.dispatchEvent(event);
  }

  applyCollapseState() {
    if (this.sidebarElement) {
      this.sidebarElement.classList.toggle('collapsed', this.isCollapsed);
      const parentCol = this.findParentColumn();
      if (parentCol) parentCol.classList.toggle('sidebar-collapsed', this.isCollapsed);
      this.setupHoverBehavior(this.isCollapsed);
    }
  }

  setupHoverBehavior(enable) {
    if (!this.sidebarElement) return;
    
    this.sidebarElement.removeEventListener('mouseenter', this.handleMouseEnter);
    this.sidebarElement.removeEventListener('mouseleave', this.handleMouseLeave);
    
    if (enable) {
      this.handleMouseEnter = () => {
        if (this.isCollapsed) {
          this.sidebarElement.classList.add('hover-expanded');
          const sectors = this.sidebarElement.querySelectorAll('.hospital-sector-item');
          sectors.forEach(sector => {
            const subsectors = sector.querySelector('.hospital-subsectors');
            const toggle = sector.querySelector('.hospital-sector-toggle');
            if (subsectors && toggle) {
              subsectors.classList.add('expanded');
              toggle.classList.add('rotated');
            }
          });
        }
      };
      
      this.handleMouseLeave = () => {
        if (this.isCollapsed) {
          this.sidebarElement.classList.remove('hover-expanded');
          const sectors = this.sidebarElement.querySelectorAll('.hospital-sector-item');
          sectors.forEach(sector => {
            if (!sector.dataset.wasExpanded) {
              const subsectors = sector.querySelector('.hospital-subsectors');
              const toggle = sector.querySelector('.hospital-sector-toggle');
              if (subsectors && toggle) {
                subsectors.classList.remove('expanded');
                toggle.classList.remove('rotated');
              }
            }
          });
        }
      };
      
      this.sidebarElement.addEventListener('mouseenter', this.handleMouseEnter);
      this.sidebarElement.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  findParentColumn() {
    let element = this.sidebarElement;
    while (element && !element.classList.contains('col-md-3')) {
      element = element.parentElement;
    }
    return element;
  }

  toggleSector(sectorItem, forceExpand = false) {
    const subsectors = sectorItem.querySelector('.hospital-subsectors');
    const toggle = sectorItem.querySelector('.hospital-sector-toggle');
    
    if (!subsectors || !toggle) return;
    
    const isExpanding = forceExpand || !subsectors.classList.contains('expanded');
    
    if (isExpanding) {
      subsectors.classList.add('expanded');
      toggle.classList.add('rotated');
    } else {
      subsectors.classList.remove('expanded');
      toggle.classList.remove('rotated');
    }
  }

  setActiveSubsector(subsectorLink) {
    this.sidebarElement.querySelectorAll('.hospital-subsector-link').forEach(link => {
      link.classList.remove('active');
      const icon = link.querySelector('.hospital-subsector-icon');
      if (icon) icon.className = 'far fa-circle hospital-subsector-icon';
    });
    
    subsectorLink.classList.add('active');
    const icon = subsectorLink.querySelector('.hospital-subsector-icon');
    if (icon) icon.className = 'far fa-dot-circle hospital-subsector-icon';
    
    this.activeSubsector = subsectorLink.dataset.subsector;
    
    const event = new CustomEvent('hospitalSubsectorChanged', {
      detail: { subsector: this.activeSubsector }
    });
    document.dispatchEvent(event);
  }

  handleWindowResize = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !this.isCollapsed) {
      this.isCollapsed = true;
      this.applyCollapseState();
    }
  }

  getActiveSubsector() {
    return this.activeSubsector;
  }

  isSidebarCollapsed() {
    return this.isCollapsed;
  }
}

// Main Application - Composition Root
class ChecklistApp {
  constructor() {
    this.service = new ChecklistService();
    this.renderer = new ChecklistRenderer(
      document.querySelector('#checklist-table tbody'),
      this.service.items
    );
    this.progressTracker = new ProgressTracker();
    this.currentSubsector = null;
    this.sectorsSidebar = null;
  }

  initialize() {
    this.setupStyling();
    this.initializeSectorsSidebar();
    this.setupEventListeners();
    this.renderTable();
  }

  initializeSectorsSidebar() {
    const sectorsContainer = document.querySelector('.col-md-3.d-print-none');
    if (!sectorsContainer) {
      console.error('Container para menu de setores não encontrado');
      return;
    }
    
    sectorsContainer.innerHTML = '';
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'hospital-sectors-sidebar-container';
    sidebarContainer.style.height = '100%';
    sectorsContainer.appendChild(sidebarContainer);
    
    this.sectorsSidebar = new HospitalSectorsSidebar(
      sidebarContainer,
      Constants.HOSPITAL_SECTORS,
      Constants.HOSPITAL_SUBSECTORS
    );
    this.sectorsSidebar.initialize();
    
    const isCollapsed = localStorage.getItem('hospitalSectorsCollapsed') === 'true';
    if (isCollapsed) sectorsContainer.classList.add('sidebar-collapsed');
    
    this.adjustLayoutContainers();
  }

  adjustLayoutContainers() {
    const containerFluid = document.querySelector('.content-wrapper .container-fluid');
    if (containerFluid) containerFluid.style.padding = '0';
    
    const row = document.querySelector('.content-wrapper .row');
    if (row) {
      row.style.margin = '0';
      row.style.display = 'flex';
      row.style.flexWrap = 'nowrap';
      row.style.height = 'calc(100vh - 115px)';
    }
    
    const mainCard = document.querySelector('.col-md-9 .card');
    if (mainCard) {
      mainCard.style.height = '100%';
      mainCard.style.display = 'flex';
      mainCard.style.flexDirection = 'column';
      mainCard.style.marginBottom = '0';
      
      const cardBody = mainCard.querySelector('.card-body');
      if (cardBody) {
        cardBody.style.flex = '1';
        cardBody.style.overflow = 'auto';
      }
    }
    
    document.addEventListener('hospitalSidebarStateChanged', this.handleSidebarStateChange.bind(this));
  }

  handleSidebarStateChange(event) {
    const isCollapsed = event.detail?.isCollapsed || false;
    const sidebarCol = document.querySelector('.col-md-3.d-print-none');
    const contentCol = document.querySelector('.col-md-9');
    
    if (sidebarCol && contentCol) {
      sidebarCol.classList.toggle('sidebar-collapsed', isCollapsed);
      contentCol.style.maxWidth = isCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 250px)';
    }
  }

  setupStyling() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .radio-group {
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #eaeaea;
        background-color: #ffffff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
      .status-radio {
        flex: 1;
        padding: 6px 8px;
        cursor: pointer;
        font-weight: normal;
        text-align: center;
        transition: all 0.2s ease;
        border-right: 1px solid #eaeaea;
        margin: 0;
        position: relative;
        font-size: 0.85rem;
        color: #6c757d;
      }
      .status-radio:last-child {
        border-right: none;
      }
      .status-conforme.active {
        background-color: rgba(40, 167, 69, 0.1) !important;
        color: #28a745 !important;
        border-left: 3px solid #28a745;
        font-weight: 500;
      }
      .status-nao-conforme.active {
        background-color: rgba(220, 53, 69, 0.1) !important;
        color: #dc3545 !important;
        border-left: 3px solid #dc3545;
        font-weight: 500;
      }
      .status-parcialmente.active {
        background-color: rgba(255, 193, 7, 0.1) !important;
        color: #ffc107 !important;
        border-left: 3px solid #ffc107;
        font-weight: 500;
      }
      .status-radio:hover {
        background-color: #f8f9fa;
      }
      #checklist-table tbody tr {
        transition: border-left 0.3s ease;
      }
      .action-cell {
      position: relative;
    }
    
    .expand-toggle-container {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(0,0,0,0.03);
      cursor: pointer;
      z-index: 1;
      transition: background-color 0.2s ease;
    }

    .expand-toggle-container:hover {
      background-color: rgba(0,0,0,0.08);
    }

    .expand-toggle {
      color: #6c757d;
      transition: transform 0.3s ease;
      font-size: 12px;
    }

    .expand-toggle.expanded {
      transform: rotate(180deg);
    }
    
    /* Garante que o container do botão de ação tenha espaço para o toggle */
    .action-button-container {
      padding-right: 30px;
    }
    `;
    document.head.appendChild(styleElement);
  }

  setupEventListeners() {
    document.addEventListener('hospitalSubsectorChanged', (e) => {
      this.currentSubsector = e.detail.subsector;
      this.renderer.filterBySubsector(this.currentSubsector);
    });

    document.addEventListener('checklistUpdated', () => {
      this.progressTracker.update(this.service.items);
      this.progressTracker.render();
    });

    document.getElementById("btn-add").addEventListener("click", () => {
      const subsector = this.sectorsSidebar.getActiveSubsector();
      this.service.addNewItem(
        Constants.HOSPITAL_SUBSECTORS[subsector]?.sector,
        subsector
      );
      this.renderer.renderItemRow(newItem); 
      this.dispatchUpdateEvent();
    });

    document.getElementById("btn-export").addEventListener("click", () => {
      this.downloadCSV(this.service.exportToCSV(), 'checklist_hospitalar.csv');
    });
  }

  renderTable() {
    this.renderer.renderTable();
    this.progressTracker.update(this.service.items);
    this.progressTracker.render();
  }

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Initialize the application
const app = new ChecklistApp();
document.addEventListener('DOMContentLoaded', () => app.initialize());