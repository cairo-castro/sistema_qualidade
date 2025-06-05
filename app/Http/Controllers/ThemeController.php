<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ThemeController extends Controller
{
    /**
     * Update user theme settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'navbar_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'sidebar_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'background_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_custom' => 'boolean'
        ]);

        $user = Auth::user();
        $settings = [
            'navbar_color' => $request->input('navbar_color'),
            'sidebar_color' => $request->input('sidebar_color'),
            'background_color' => $request->input('background_color'),
            'is_custom' => $request->input('is_custom', false),
        ];

        $user->updateThemeSettings($settings);

        return response()->json([
            'success' => true,
            'message' => 'Theme updated successfully',
            'theme_settings' => $user->getThemeSettings()
        ]);
    }

    /**
     * Get user theme settings
     */
    public function show()
    {
        return response()->json([
            'theme_settings' => Auth::user()->getThemeSettings()
        ]);
    }

    /**
     * Reset theme to default
     */
    public function reset()
    {
        $user = Auth::user();
        $user->resetTheme();

        return response()->json([
            'success' => true,
            'message' => 'Theme reset to default',
            'theme_settings' => $user->getThemeSettings()
        ]);
    }
}
