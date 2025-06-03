<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    /**
     * Instantiate a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('permission:manage permissions');
    }

    /**
     * Display a listing of permissions.
     */
    public function index(Request $request)
    {
        $query = Permission::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        // Filter by group
        if ($request->filled('group')) {
            $group = $request->input('group');
            $query->where('name', 'like', "%{$group}%");
        }

        // Sort functionality
        $sortBy = $request->input('sort_by', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        
        if (in_array($sortBy, ['name', 'created_at'])) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $permissions = $query->paginate(20)->withQueryString();

        // Group permissions for display
        $permissionGroups = Permission::all()->groupBy(function ($permission) {
            $parts = explode(' ', $permission->name);
            return count($parts) > 1 ? $parts[1] : 'other';
        });

        $groups = $permissionGroups->keys()->sort();

        return view('admin.permissions.index', compact('permissions', 'groups'));
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create()
    {
        // Get existing permission groups for suggestion
        $existingGroups = Permission::all()
            ->map(function ($permission) {
                $parts = explode(' ', $permission->name);
                return count($parts) > 1 ? $parts[1] : null;
            })
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return view('admin.permissions.create', compact('existingGroups'));
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions'],
        ]);

        Permission::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissão criada com sucesso!');
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission)
    {
        $permission->load('roles');
        return view('admin.permissions.show', compact('permission'));
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission)
    {
        // Get existing permission groups for suggestion
        $existingGroups = Permission::all()
            ->map(function ($perm) {
                $parts = explode(' ', $perm->name);
                return count($parts) > 1 ? $parts[1] : null;
            })
            ->filter()
            ->unique()
            ->sort()
            ->values();

        return view('admin.permissions.edit', compact('permission', 'existingGroups'));
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('permissions')->ignore($permission->id)],
        ]);

        $permission->update([
            'name' => $validated['name'],
        ]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissão atualizada com sucesso!');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy(Permission $permission)
    {
        // Check if permission is assigned to roles
        if ($permission->roles()->count() > 0) {
            return redirect()->route('admin.permissions.index')
                ->with('error', 'Não é possível deletar uma permissão que está associada a papéis!');
        }

        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permissão deletada com sucesso!');
    }

    /**
     * Bulk create permissions
     */
    public function bulkCreate(Request $request)
    {
        $validated = $request->validate([
            'actions' => ['required', 'array'],
            'actions.*' => ['string', 'max:50'],
            'resource' => ['required', 'string', 'max:50'],
        ]);

        $created = 0;
        $skipped = 0;

        foreach ($validated['actions'] as $action) {
            $permissionName = $action . ' ' . $validated['resource'];
            
            if (!Permission::where('name', $permissionName)->exists()) {
                Permission::create([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ]);
                $created++;
            } else {
                $skipped++;
            }
        }

        $message = "Criadas {$created} permissões";
        if ($skipped > 0) {
            $message .= " ({$skipped} já existiam)";
        }

        return redirect()->route('admin.permissions.index')
            ->with('success', $message);
    }
}
