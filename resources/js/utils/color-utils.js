// Color Utility Functions
export class ColorUtils {
    static getContrastingTextColor(hexColor) {
        if (!hexColor) return '#1f2937';

        try {
            const cleanHex = hexColor.replace('#', '');

            if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
                return '#1f2937';
            }

            const [r, g, b] = [0, 2, 4].map(i => parseInt(cleanHex.slice(i, i + 2), 16));

            // Cálculo de luminância relativa mais preciso
            const [rsRGB, gsRGB, bsRGB] = [r, g, b].map(c => c / 255);

            const [rLinear, gLinear, bLinear] = [rsRGB, gsRGB, bsRGB].map(c =>
                c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );

            const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

            // Threshold mais sensível e sistema de contraste melhorado
            if (luminance > 0.5) {
                // Cores muito claras - texto escuro
                return '#1f2937';
            } else if (luminance > 0.18) {
                // Cores médias claras - texto escuro
                return '#374151';
            } else if (luminance > 0.05) {
                // Cores médias escuras - texto claro
                return '#f9fafb';
            } else {
                // Cores muito escuras - texto branco
                return '#ffffff';
            }
        } catch (error) {
            console.warn('Error calculating contrasting text color:', error);
            return '#1f2937';
        }
    }

    // Nova função para verificar se uma cor é escura
    static isDarkColor(hexColor) {
        if (!hexColor) return false;

        try {
            const cleanHex = hexColor.replace('#', '');
            if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return false;

            const [r, g, b] = [0, 2, 4].map(i => parseInt(cleanHex.slice(i, i + 2), 16));
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            
            return luminance < 0.5;
        } catch (error) {
            return false;
        }
    }

    // Nova função para calcular contraste mais inteligente
    static getSmartContrastColor(backgroundColor, options = {}) {
        const {
            lightColor = '#ffffff',
            darkColor = '#1f2937',
            mediumLightColor = '#f3f4f6',
            mediumDarkColor = '#374151'
        } = options;

        if (!backgroundColor) return darkColor;

        const luminance = this.getLuminance(backgroundColor);
        
        if (luminance > 0.7) return darkColor;
        if (luminance > 0.5) return mediumDarkColor;
        if (luminance > 0.2) return mediumLightColor;
        return lightColor;
    }

    // Função auxiliar para calcular luminância
    static getLuminance(hexColor) {
        if (!hexColor) return 0;

        try {
            const cleanHex = hexColor.replace('#', '');
            if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) return 0;

            const [r, g, b] = [0, 2, 4].map(i => parseInt(cleanHex.slice(i, i + 2), 16));
            const [rsRGB, gsRGB, bsRGB] = [r, g, b].map(c => c / 255);

            const [rLinear, gLinear, bLinear] = [rsRGB, gsRGB, bsRGB].map(c =>
                c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );

            return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
        } catch (error) {
            return 0;
        }
    }

    static validateColor(value) {
        if (!value) return null;

        // Se já está no formato correto
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            return value.toLowerCase();
        }

        // Se tem 7 caracteres e começa com #
        if (value.length === 7 && value.startsWith('#')) {
            return value.toLowerCase();
        }

        // Se tem 6 caracteres e não começa com #
        if (value.length === 6 && !value.startsWith('#')) {
            return '#' + value.toLowerCase();
        }

        // Se tem 3 caracteres (formato abreviado)
        if (value.length === 3 && !value.startsWith('#')) {
            const expanded = value.split('').map(c => c + c).join('');
            return '#' + expanded.toLowerCase();
        }

        console.warn('Invalid color format:', value);
        return null;
    }

    static isValidHexColor(value) {
        return /^#[0-9A-Fa-f]{6}$/.test(value);
    }
}
