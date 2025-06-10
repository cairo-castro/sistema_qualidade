// Common Utility Functions
export class Utils {
    constructor() {
        this.formatters = this.initFormatters();
    }

    initFormatters() {
        return new Map([
            ['number', new Intl.NumberFormat('pt-BR')],
            ['currency', new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })],
            ['date', new Intl.DateTimeFormat('pt-BR')],
            ['datetime', new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            })]
        ]);
    }

    formatNumber(num) {
        if (typeof num !== 'number') return '0';
        return this.formatters.get('number').format(num);
    }

    formatCurrency(value) {
        if (typeof value !== 'number') return 'R$ 0,00';
        return this.formatters.get('currency').format(value);
    }

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return this.formatters.get('date').format(d);
    }

    formatDateTime(date) {
        if (!date) return '';
        const d = new Date(date);
        return this.formatters.get('datetime').format(d);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
