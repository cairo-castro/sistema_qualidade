<?php

namespace App\Services;

use Illuminate\Support\Facades\Session;

class NotificationService
{
    /**
     * Adicionar notificação de sucesso
     */
    public static function success($message, $title = null)
    {
        return self::flash('success', $message, $title);
    }

    /**
     * Adicionar notificação de erro
     */
    public static function error($message, $title = null)
    {
        return self::flash('error', $message, $title);
    }

    /**
     * Adicionar notificação de aviso
     */
    public static function warning($message, $title = null)
    {
        return self::flash('warning', $message, $title);
    }

    /**
     * Adicionar notificação de informação
     */
    public static function info($message, $title = null)
    {
        return self::flash('info', $message, $title);
    }

    /**
     * Adicionar notificação à sessão
     */
    private static function flash($type, $message, $title = null)
    {
        $notification = [
            'type' => $type,
            'message' => $message,
            'title' => $title,
            'timestamp' => now()->toISOString()
        ];

        Session::flash('notification', $notification);
        
        // Também adicionar ao flash tradicional para compatibilidade
        Session::flash($type, $message);

        return $notification;
    }

    /**
     * Obter notificação da sessão
     */
    public static function get()
    {
        return Session::get('notification');
    }

    /**
     * Verificar se existe notificação
     */
    public static function has()
    {
        return Session::has('notification');
    }
}