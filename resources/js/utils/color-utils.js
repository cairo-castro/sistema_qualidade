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

            const [rsRGB, gsRGB, bsRGB] = [r, g, b].map(c => c / 255);

            const [rLinear, gLinear, bLinear] = [rsRGB, gsRGB, bsRGB].map(c =>
                c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );

            const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;

            return luminance > 0.179 ? '#1f2937' : '#ffffff';
        } catch (error) {
            console.warn('Error calculating contrasting text color:', error);
            return '#1f2937';
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
