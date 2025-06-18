
class ProblemSelectComponent {
  constructor(selectElement, initialProblems = [], initialValues = []) {
    this.selectElement = selectElement;
    this.problems = [...initialProblems];
    this.initialValues = Array.isArray(initialValues) ? initialValues : [initialValues];
    this.onChangeCallback = null;
  }

  initialize() {
    this._prepareSelectElement();
    this._initializeSelect2();
    this._setupEventListeners();
    return this;
  }

  _prepareSelectElement() {
    this.selectElement.innerHTML = '';
    this.problems.forEach(problem => {
      const option = document.createElement('option');
      option.value = problem;
      option.textContent = problem;
      option.selected = this.initialValues.includes(problem);
      this.selectElement.appendChild(option);
    });
  }

  _initializeSelect2() {
    $(this.selectElement).select2({
      // Removendo dependências de tema Bootstrap 5
      tags: true,
      multiple: true,
      placeholder: 'Selecione um ou mais problemas...',
      allowClear: true,
      closeOnSelect: false,
      dropdownParent: this.selectElement.closest('.modal') || document.body,
      width: '100%',
      createTag: (params) => {
        const term = $.trim(params.term);
        if (term === '') return null;
        
        return {
          id: term,
          text: term,
          newTag: true
        };
      },
      templateResult: (data) => {
        if (data.loading) return data.text;
        
        const $result = $('<span>').text(data.text);
        
        if (data.newTag) {
          // Usando nossa classe personalizada em vez de text-muted
          $result.append(' <span class="select2-tag-new">(novo)</span>');
        }
        
        return $result;
      }
    });
  }

  _setupEventListeners() {
    $(this.selectElement).on('change', (e) => {
      const selectedValues = Array.from(e.target.selectedOptions)
        .map(option => option.value)
        .filter(value => value);
      
      // Add new problems to the list if they don't exist
      selectedValues.forEach(value => {
        if (value && !this.problems.includes(value)) {
          this.problems.push(value);
        }
      });
      
      if (this.onChangeCallback) {
        this.onChangeCallback(selectedValues);
      }
    });
  }

  onChange(callback) {
    this.onChangeCallback = callback;
    return this;
  }

  getValue() {
    return $(this.selectElement).val() || [];
  }

  setValue(values) {
    const arrayValues = Array.isArray(values) ? values : [values];
    $(this.selectElement).val(arrayValues).trigger('change');
    return this;
  }

  destroy() {
    $(this.selectElement).off('change');
    $(this.selectElement).select2('destroy');
  }
}

// Make available globally
window.ProblemSelectComponent = ProblemSelectComponent;