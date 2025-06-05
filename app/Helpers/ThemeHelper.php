<?php

namespace App\Helpers;

class ThemeHelper
{
    /**
     * Calculate contrasting text color based on background luminance
     *
     * @param string $hexColor
     * @return string
     */
    public static function getContrastingTextColor(string $hexColor): string
    {
        // Remove # if present
        $hexColor = ltrim($hexColor, '#');

        // Convert hex to RGB
        $r = hexdec(substr($hexColor, 0, 2));
        $g = hexdec(substr($hexColor, 2, 2));
        $b = hexdec(substr($hexColor, 4, 2));

        // Calculate luminance using relative luminance formula
        $luminance = (0.299 * $r + 0.587 * $g + 0.114 * $b) / 255;

        // Return white for dark backgrounds, dark for light backgrounds
        return $luminance > 0.5 ? '#1f2937' : '#ffffff';
    }

    /**
     * Convert hex to RGB array
     *
     * @param string $hexColor
     * @return array
     */
    public static function hexToRgb(string $hexColor): array
    {
        $hexColor = ltrim($hexColor, '#');

        return [
            'r' => hexdec(substr($hexColor, 0, 2)),
            'g' => hexdec(substr($hexColor, 2, 2)),
            'b' => hexdec(substr($hexColor, 4, 2))
        ];
    }

    /**
     * Convert RGB to hex
     *
     * @param int $r
     * @param int $g
     * @param int $b
     * @return string
     */
    public static function rgbToHex(int $r, int $g, int $b): string
    {
        return sprintf("#%02x%02x%02x", $r, $g, $b);
    }

    /**
     * Generate a lighter version of a color
     *
     * @param string $hexColor
     * @param float $percent
     * @return string
     */
    public static function lightenColor(string $hexColor, float $percent): string
    {
        $rgb = self::hexToRgb($hexColor);

        $r = min(255, $rgb['r'] + ($percent * 255));
        $g = min(255, $rgb['g'] + ($percent * 255));
        $b = min(255, $rgb['b'] + ($percent * 255));

        return self::rgbToHex((int)$r, (int)$g, (int)$b);
    }

    /**
     * Generate a darker version of a color
     *
     * @param string $hexColor
     * @param float $percent
     * @return string
     */
    public static function darkenColor(string $hexColor, float $percent): string
    {
        $rgb = self::hexToRgb($hexColor);

        $r = max(0, $rgb['r'] - ($percent * 255));
        $g = max(0, $rgb['g'] - ($percent * 255));
        $b = max(0, $rgb['b'] - ($percent * 255));

        return self::rgbToHex((int)$r, (int)$g, (int)$b);
    }

    /**
     * Check if a color is considered dark
     *
     * @param string $hexColor
     * @return bool
     */
    public static function isDarkColor(string $hexColor): bool
    {
        $rgb = self::hexToRgb($hexColor);
        $luminance = (0.299 * $rgb['r'] + 0.587 * $rgb['g'] + 0.114 * $rgb['b']) / 255;

        return $luminance <= 0.5;
    }
}
