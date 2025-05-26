<p class="text-muted">
    Uma vez que sua conta for deletada, todos os recursos e dados serão permanentemente excluídos. 
    Antes de deletar sua conta, faça o download de qualquer dado ou informação que deseja manter.
</p>

<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#confirmUserDeletionModal">
    <i class="fas fa-trash mr-2"></i>
    Deletar Conta
</button>

<!-- Modal -->
<div class="modal fade" id="confirmUserDeletionModal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form method="post" action="{{ route('profile.destroy') }}">
                @csrf
                @method('delete')
                
                <div class="modal-header bg-danger">
                    <h5 class="modal-title text-white">Confirmar Exclusão da Conta</h5>
                    <button type="button" class="close text-white" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                
                <div class="modal-body">
                    <p class="text-danger">
                        <strong>Atenção:</strong> Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua conta.
                    </p>
                    
                    <div class="form-group">
                        <label for="password">Digite sua senha para confirmar:</label>
                        <input type="password" 
                               class="form-control @error('password', 'userDeletion') is-invalid @enderror" 
                               id="password" 
                               name="password" 
                               placeholder="Senha">
                        @error('password', 'userDeletion')
                            <span class="invalid-feedback">{{ $message }}</span>
                        @enderror
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-danger">
                        <i class="fas fa-trash mr-2"></i>
                        Deletar Conta
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>