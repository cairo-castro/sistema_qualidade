<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Sistema da Qualiade Assistencial - Configurações
    |--------------------------------------------------------------------------
    */

    'name' => env('SISTEMA_NAME', 'Sistema da Qualidade Assistencial'),
    'version' => '1.0.0',
    'company' => env('SISTEMA_COMPANY', 'EMSERH'),
    
    /*
    |--------------------------------------------------------------------------
    | Configurações de Auditoria
    |--------------------------------------------------------------------------
    */
    'audit' => [
        'enabled' => env('SISTEMA_AUDIT_ENABLED', false),
        'log_activities' => env('LOG_ACTIVITIES', false),
        'retention_days' => env('AUDIT_RETENTION_DAYS', 365),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configurações de Integração
    |--------------------------------------------------------------------------
    */
    'integration' => [
        'sync_users' => env('SISTEMA_SYNC_USERS', true),
        'sync_frequency' => env('SISTEMA_SYNC_FREQUENCY', 24), // horas
        'batch_size' => env('SISTEMA_BATCH_SIZE', 100),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configurações de Performance
    |--------------------------------------------------------------------------
    */
    'performance' => [
        'cache_dashboard' => env('CACHE_DASHBOARD', true),
        'cache_ttl' => env('CACHE_TTL', 3600), // segundos
        'paginate_default' => env('PAGINATE_DEFAULT', 15),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configurações de Upload
    |--------------------------------------------------------------------------
    */
    'uploads' => [
        'max_file_size' => env('MAX_FILE_SIZE', 10240), // KB
        'allowed_types' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],
        'storage_disk' => env('UPLOAD_DISK', 'local'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configurações de Email
    |--------------------------------------------------------------------------
    */
    'mail' => [
        'from_name' => env('MAIL_FROM_NAME', 'Sistema da Qualidade Assistencial'),
        'support_email' => env('SUPPORT_EMAIL', 'suporte@empresa.com'),
        'notifications_enabled' => env('MAIL_NOTIFICATIONS', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Configurações de Backup
    |--------------------------------------------------------------------------
    */
    'backup' => [
        'enabled' => env('BACKUP_ENABLED', false),
        'frequency' => env('BACKUP_FREQUENCY', 'daily'), // daily, weekly, monthly
        'retention' => env('BACKUP_RETENTION', 30), // dias
        'notification_email' => env('BACKUP_NOTIFICATION_EMAIL'),
    ],
];