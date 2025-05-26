<?php

if (!function_exists('formatBytes')) {
    /**
     * Formatar bytes em formato legível
     */
    function formatBytes($size, $precision = 2)
    {
        if ($size > 0) {
            $size = (int) $size;
            $base = log($size) / log(1024);
            $suffixes = array(' bytes', ' KB', ' MB', ' GB', ' TB');
            return round(pow(1024, $base - floor($base)), $precision) . $suffixes[floor($base)];
        }
        return $size;
    }
}

if (!function_exists('timeAgo')) {
    /**
     * Retorna tempo relativo (ex: "há 2 horas")
     */
    function timeAgo($date)
    {
        if (!$date instanceof \Carbon\Carbon) {
            $date = \Carbon\Carbon::parse($date);
        }
        return $date->diffForHumans();
    }
}

if (!function_exists('activeRoute')) {
    /**
     * Verifica se rota está ativa
     */
    function activeRoute($routeName, $class = 'active')
    {
        return request()->routeIs($routeName) ? $class : '';
    }
}

if (!function_exists('activeUrl')) {
    /**
     * Verifica se URL está ativa
     */
    function activeUrl($url, $class = 'active')
    {
        return request()->is($url) ? $class : '';
    }
}

if (!function_exists('userCan')) {
    /**
     * Verifica se usuário tem permissão
     */
    function userCan($permission)
    {
        return auth()->check() && auth()->user()->can($permission);
    }
}

if (!function_exists('userRole')) {
    /**
     * Verifica se usuário tem role
     */
    function userRole($role)
    {
        return auth()->check() && auth()->user()->hasRole($role);
    }
}

if (!function_exists('systemInfo')) {
    /**
     * Informações do sistema
     */
    function systemInfo($key = null)
    {
        $info = [
            'version' => '1.0.0',
            'name' => 'Sistema de Qualidade',
            'company' => 'Sua Empresa',
            'support_email' => 'suporte@empresa.com',
            'laravel_version' => app()->version(),
            'php_version' => PHP_VERSION,
        ];

        return $key ? ($info[$key] ?? null) : $info;
    }
}

if (!function_exists('alertClass')) {
    /**
     * Classe CSS para alertas baseado no tipo
     */
    function alertClass($type)
    {
        $classes = [
            'success' => 'alert-success',
            'error' => 'alert-danger',
            'warning' => 'alert-warning',
            'info' => 'alert-info',
        ];

        return $classes[$type] ?? 'alert-info';
    }
}

if (!function_exists('statusBadge')) {
    /**
     * Badge para status
     */
    function statusBadge($status)
    {
        $badges = [
            'ativo' => 'badge-success',
            'inativo' => 'badge-secondary',
            'pendente' => 'badge-warning',
            'erro' => 'badge-danger',
            'processando' => 'badge-info',
            'concluido' => 'badge-success',
            'cancelado' => 'badge-dark',
        ];

        $class = $badges[strtolower($status)] ?? 'badge-secondary';
        return "<span class=\"badge {$class}\">" . ucfirst($status) . "</span>";
    }
}