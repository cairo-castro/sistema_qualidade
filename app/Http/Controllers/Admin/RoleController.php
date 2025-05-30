<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:manage permissions');
    }

    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $query = Role::withCount('users');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        // Sort functionality
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        
        if (in_array($sortBy, ['name', 'created_at', 'users_count'])) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $roles = $query->paginate(15)->withQueryString();

        return view('admin.roles.index', compact('roles'));
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode(' ', $permission->name)[1] ?? 'other';
        });

        return view('admin.roles.create', compact('permissions'));
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        DB::transaction(function () use ($validated) {
            $role = Role::create([
                'name' => $validated['name'],
                'guard_name' => 'web',
            ]);

            if (isset($validated['permissions'])) {
                $role->givePermissionTo($validated['permissions']);
            }
        });

        return redirect()->route('admin.roles.index')
            ->with('success', 'Papel criado com sucesso!');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $role->load('permissions', 'users');
        
        $permissionsByGroup = $role->permissions->groupBy(function ($permission) {
            return explode(' ', $permission->name)[1] ?? 'other';
        });

        return view('admin.roles.show', compact('role', 'permissionsByGroup'));
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::all()->groupBy(function ($permission) {
            return explode(' ', $permission->name)[1] ?? 'other';
        });

        $rolePermissions = $role->permissions->pluck('id')->toArray();

        return view('admin.roles.edit', compact('role', 'permissions', 'rolePermissions'));
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id'],
        ]);

        DB::transaction(function () use ($role, $validated) {
            $role->update([
                'name' => $validated['name'],
            ]);

            // Sync permissions
            if (isset($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            } else {
                $role->syncPermissions([]);
            }
        });

        return redirect()->route('admin.roles.index')
            ->with('success', 'Papel atualizado com sucesso!');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role)
    {
        // Prevent deleting Admin role
        if ($role->name === 'Admin') {
            return redirect()->route('admin.roles.index')
                ->with('error', 'O papel Admin não pode ser deletado!');
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'Não é possível deletar um papel que possui usuários associados!');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Papel deletado com sucesso!');
    }

    /**
     * Clone a role with all its permissions
     */
    public function clone(Role $role)
    {
        $newRole = Role::create([
            'name' => $role->name . ' (Cópia)',
            'guard_name' => 'web',
        ]);

        $newRole->syncPermissions($role->permissions);

        return redirect()->route('admin.roles.edit', $newRole)
            ->with('success', 'Papel clonado com sucesso! Você pode editá-lo agora.');
    }
}
