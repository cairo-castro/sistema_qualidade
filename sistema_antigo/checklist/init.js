/**
 * Inicialização para o Sistema de Checklist Hospitalar
 * Configura o PeriodManager e integra com a aplicação existente
 */

// Configuração do Gerenciador de Períodos
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o gerenciador de períodos
  const periodManager = new PeriodManager({
    modalId: 'periodModal',
    selectPeriodId: 'select-period-dropdown',
    unitDropdownId: 'unit-dropdown',
    startDateId: 'start-date',
    endDateId: 'end-date',
    deletePeriodId: 'delete-period-dropdown',
    titleDisplaySelector: '.card-title',
    onPeriodSelected: (period) => {
      console.log('Período selecionado:', period);
      // Aqui você pode realizar ações adicionais quando um período for selecionado
      // Por exemplo, carregar dados específicos do período
    }
  }).initialize();

  // Adiciona o botão de gerenciamento de períodos na barra de ferramentas
  const toolbarButtons = document.querySelector('.card-tools');
  if (toolbarButtons) {
    const periodBtn = document.createElement('button');
    periodBtn.type = 'button';
    periodBtn.className = 'btn btn-light btn-sm ms-2';
    periodBtn.id = 'btn-period';
    periodBtn.innerHTML = '<i class="fas fa-calendar-alt"></i> Período';
    periodBtn.addEventListener('click', () => periodManager.openModal());
    
    // Insere o botão antes do botão de exportação
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      toolbarButtons.insertBefore(periodBtn, exportBtn);
    } else {
      toolbarButtons.appendChild(periodBtn);
    }
  }

  // Inicia a aplicação existente após configurar o gerenciador de períodos
  const app = new ChecklistApp();
  app.initialize();
});