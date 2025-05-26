<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'usuario_sistema_id', // FK para sua tabela usuarios (quando existir)
    ];

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName()
    {
        return 'name';
    }

    /**
     * Override username method for Laravel Auth
     * 
     * @return string
     */
    public function username()
    {
        return 'name';
    }

    /**
     * Find the user instance for the given username.
     *
     * @param  string  $name
     * @return \App\Models\User|null
     */
    public static function findForPassport($name)
    {
        return static::where('name', $name)->first();
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relacionamento com sua tabela de usuários do sistema (comentado por enquanto)
    // public function usuarioSistema()
    // {
    //     return $this->belongsTo(\App\Models\Sistema\Usuario::class, 'usuario_sistema_id');
    // }

    // Método para sincronizar dados (comentado por enquanto)
    // public function syncFromSistema()
    // {
    //     if ($this->usuarioSistema) {
    //         $this->name = $this->usuarioSistema->usuario;
    //         $this->email = $this->usuarioSistema->usuario . '@sistema.local';
    //         $this->save();
    //     }
    // }
}