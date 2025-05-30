

<?php $__env->startSection('title', 'Editar Permissão'); ?>

<?php $__env->startSection('content'); ?>
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="h3 mb-1">Editar Permissão</h1>
                    <p class="text-muted">Modificar informações da permissão: <strong><?php echo e($permission->name); ?></strong></p>
                </div>
                <div>
                    <a href="<?php echo e(route('admin.permissions.show', $permission)); ?>" class="btn btn-outline-info me-2">
                        <i class="fas fa-eye"></i> Visualizar
                    </a>
                    <a href="<?php echo e(route('admin.permissions.index')); ?>" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </a>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">
                                <i class="fas fa-edit text-primary me-2"></i>
                                Editar Informações
                            </h5>
                        </div>
                        <div class="card-body">
                            <form action="<?php echo e(route('admin.permissions.update', $permission)); ?>" method="POST">
                                <?php echo csrf_field(); ?>
                                <?php echo method_field('PUT'); ?>

                                <div class="row">
                                    <div class="col-md-8">
                                        <div class="mb-3">
                                            <label for="name" class="form-label">
                                                Nome da Permissão <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" 
                                                   class="form-control <?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
                                                   id="name" 
                                                   name="name" 
                                                   value="<?php echo e(old('name', $permission->name)); ?>"
                                                   placeholder="Ex: user.create, role.edit, permission.delete"
                                                   required>
                                            <div class="form-text">
                                                Use o formato: recurso.ação (ex: user.create, role.edit)
                                            </div>
                                            <?php $__errorArgs = ['name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                                                <div class="invalid-feedback"><?php echo e($message); ?></div>
                                            <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="mb-3">
                                            <label for="guard_name" class="form-label">Guard</label>
                                            <select class="form-select <?php $__errorArgs = ['guard_name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> is-invalid <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>" 
                                                    id="guard_name" 
                                                    name="guard_name">
                                                <option value="web" <?php echo e(old('guard_name', $permission->guard_name) == 'web' ? 'selected' : ''); ?>>Web</option>
                                                <option value="api" <?php echo e(old('guard_name', $permission->guard_name) == 'api' ? 'selected' : ''); ?>>API</option>
                                            </select>
                                            <?php $__errorArgs = ['guard_name'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?>
                                                <div class="invalid-feedback"><?php echo e($message); ?></div>
                                            <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>
                                        </div>
                                    </div>
                                </div>

                                <!-- Informações da Permissão -->
                                <div class="mb-4">
                                    <h6 class="text-muted mb-3">Informações Atuais:</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card bg-light">
                                                <div class="card-body p-3">
                                                    <h6 class="card-title text-primary mb-2">
                                                        <i class="fas fa-info-circle me-1"></i> Detalhes
                                                    </h6>
                                                    <p class="mb-1"><strong>ID:</strong> <?php echo e($permission->id); ?></p>
                                                    <p class="mb-1"><strong>Criada em:</strong> <?php echo e($permission->created_at->format('d/m/Y H:i')); ?></p>
                                                    <p class="mb-0"><strong>Atualizada em:</strong> <?php echo e($permission->updated_at->format('d/m/Y H:i')); ?></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-6">
                                            <div class="card bg-light">
                                                <div class="card-body p-3">
                                                    <h6 class="card-title text-success mb-2">
                                                        <i class="fas fa-chart-bar me-1"></i> Uso
                                                    </h6>
                                                    <p class="mb-1"><strong>Perfis associados:</strong> <?php echo e($permission->roles->count()); ?></p>
                                                    <p class="mb-1"><strong>Usuários diretos:</strong> <?php echo e($permission->users->count()); ?></p>
                                                    <p class="mb-0">
                                                        <strong>Total de usuários:</strong> 
                                                        <?php echo e($permission->roles->sum(function($role) { return $role->users->count(); }) + $permission->users->count()); ?>

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Perfis que usam esta permissão -->
                                <?php if($permission->roles->count() > 0): ?>
                                <div class="mb-4">
                                    <h6 class="text-muted mb-3">Perfis que possuem esta permissão:</h6>
                                    <div class="d-flex flex-wrap gap-2">
                                        <?php $__currentLoopData = $permission->roles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $role): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <span class="badge bg-primary">
                                            <i class="fas fa-user-tag me-1"></i>
                                            <?php echo e($role->name); ?> (<?php echo e($role->users->count()); ?> usuários)
                                        </span>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                </div>
                                <?php endif; ?>

                                <!-- Usuários com permissão direta -->
                                <?php if($permission->users->count() > 0): ?>
                                <div class="mb-4">
                                    <h6 class="text-muted mb-3">Usuários com permissão direta:</h6>
                                    <div class="d-flex flex-wrap gap-2">
                                        <?php $__currentLoopData = $permission->users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <span class="badge bg-info">
                                            <i class="fas fa-user me-1"></i>
                                            <?php echo e($user->name); ?>

                                        </span>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                </div>
                                <?php endif; ?>

                                <!-- Aviso se há dependências -->
                                <?php if($permission->roles->count() > 0 || $permission->users->count() > 0): ?>
                                <div class="alert alert-warning">
                                    <i class="fas fa-exclamation-triangle me-2"></i>
                                    <strong>Atenção:</strong> Esta permissão está sendo utilizada por <?php echo e($permission->roles->count()); ?> perfil(is) e <?php echo e($permission->users->count()); ?> usuário(s). 
                                    Alterar o nome pode afetar o funcionamento do sistema.
                                </div>
                                <?php endif; ?>

                                <div class="d-flex justify-content-between">
                                    <a href="<?php echo e(route('admin.permissions.index')); ?>" class="btn btn-outline-secondary">
                                        <i class="fas fa-times"></i> Cancelar
                                    </a>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Ações perigosas -->
                    <div class="card mt-4 border-danger">
                        <div class="card-header bg-danger text-white">
                            <h5 class="card-title mb-0">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Zona de Perigo
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted mb-3">
                                Ações irreversíveis que podem afetar o funcionamento do sistema.
                            </p>
                            
                            <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                <i class="fas fa-trash"></i> Excluir Permissão
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Confirmação de Exclusão -->
<div class="modal fade" id="deleteModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="fas fa-exclamation-triangle text-danger me-2"></i>
                    Confirmar Exclusão
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>Tem certeza que deseja excluir a permissão <strong>"<?php echo e($permission->name); ?>"</strong>?</p>
                
                <?php if($permission->roles->count() > 0 || $permission->users->count() > 0): ?>
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Atenção:</strong> Esta permissão está sendo utilizada e sua exclusão pode afetar:
                    <ul class="mb-0 mt-2">
                        <?php if($permission->roles->count() > 0): ?>
                        <li><?php echo e($permission->roles->count()); ?> perfil(is)</li>
                        <?php endif; ?>
                        <?php if($permission->users->count() > 0): ?>
                        <li><?php echo e($permission->users->count()); ?> usuário(s)</li>
                        <?php endif; ?>
                    </ul>
                </div>
                <?php endif; ?>
                
                <p class="text-muted">Esta ação não pode ser desfeita.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <form action="<?php echo e(route('admin.permissions.destroy', $permission)); ?>" method="POST" class="d-inline">
                    <?php echo csrf_field(); ?>
                    <?php echo method_field('DELETE'); ?>
                    <button type="submit" class="btn btn-danger">
                        <i class="fas fa-trash"></i> Excluir Permanentemente
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
.card {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.border-danger {
    border-color: #dc3545 !important;
}
</style>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\projects\qualidade\sistema-qualidade\resources\views/admin/permissions/edit.blade.php ENDPATH**/ ?>