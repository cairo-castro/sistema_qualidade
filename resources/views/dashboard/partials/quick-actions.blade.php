{{-- Ações Rápidas --}}
<div class="card">
    <div class="card-header">
        <h3 class="card-title">
            <i class="bi bi-lightning me-2"></i>
            Ações Rápidas
        </h3>
    </div>
    
    <div class="card-body">
        <div class="row g-3">
            <!-- Novo Diagnóstico -->
            <div class="col-6">
                <a href="#" 
                   class="btn btn-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-plus-circle display-6 mb-2"></i>
                    <span class="fw-bold">Novo Diagnóstico</span>
                    <small class="text-white-50">Criar diagnóstico</small>
                </a>
            </div>
            
            <!-- Novo Usuário -->
            <div class="col-6">
                <a href="#" 
                   class="btn btn-success w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-person-plus display-6 mb-2"></i>
                    <span class="fw-bold">Novo Usuário</span>
                    <small class="text-white-50">Cadastrar usuário</small>
                </a>
            </div>
            
            <!-- Gerar Relatório -->
            <div class="col-6">
                <a href="#" 
                   class="btn btn-info w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-file-earmark-text display-6 mb-2"></i>
                    <span class="fw-bold">Gerar Relatório</span>
                    <small class="text-white-50">Criar relatório</small>
                </a>
            </div>
            
            <!-- Configurações -->
            <div class="col-6">
                <a href="#" 
                   class="btn btn-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3">
                    <i class="bi bi-gear display-6 mb-2"></i>
                    <span class="fw-bold">Configurações</span>
                    <small class="text-white-50">Gerenciar sistema</small>
                </a>
            </div>
        </div>
    </div>
</div>

<style>
.btn i.display-6 {
    font-size: 2rem;
}

@media (max-width: 768px) {
    .btn i.display-6 {
        font-size: 1.5rem;
    }
}
</style>