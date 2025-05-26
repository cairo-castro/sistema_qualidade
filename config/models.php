<?php

return [
    'models' => [
        'path' => app_path('Models/Sistema'), // Separar em subpasta
        'namespace' => 'App\Models\Sistema',
        'parent' => Illuminate\Database\Eloquent\Model::class,
        'use' => [],
        'connection' => null,
        'table_prefix' => '',
    ],

    'schemas' => [
        'default' => [
            'connection' => null,
            'tables' => [
                // Só suas tabelas específicas
                'unidade',
                'diagnostico',
                'setores',
                'subsetores',
                'items_diagnostico',
                'periodo_diagnostico',
                'setor_diagnostico',
                'unidade_setores',
                'problemas_diagnostico',
                'tarefas'
            ],
            'except' => [
                // Excluir tabelas padrão do Laravel/Spatie
                'migrations',
                'password_resets',
                'password_reset_tokens',
                'personal_access_tokens',
                'failed_jobs',
                'jobs',
                'job_batches',
                'cache',
                'cache_locks',
                'sessions',
                'users',
                'roles',
                'permissions',
                'model_has_permissions',
                'model_has_roles',
                'role_has_permissions'
            ],
        ],
    ],

    'naming' => [
        'models' => '{table}',
        'relations' => [
            'belongs_to' => '{related}',
            'belongs_to_many' => '{related}',
            'has_many' => '{related}',
            'has_one' => '{related}',
        ],
    ],

    'timestamps' => [
        'enabled' => true,
        'fields' => [
            'created_at' => 'criado_em',
            'updated_at' => 'atualizado_em',
        ],
    ],

    'soft_deletes' => [
        'enabled' => true,
        'field' => 'deletado_em',
    ],
];