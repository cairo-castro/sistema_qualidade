<form method="post" action="{{ route('profile.update') }}">
    @csrf
    @method('patch')

    <div class="form-group">
        <label for="name">Nome</label>
        <input type="text" 
               class="form-control @error('name') is-invalid @enderror" 
               id="name" 
               name="name" 
               value="{{ old('name', $user->name) }}" 
               required 
               autofocus>
        @error('name')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror
    </div>

    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" 
               class="form-control @error('email') is-invalid @enderror" 
               id="email" 
               name="email" 
               value="{{ old('email', $user->email) }}" 
               required>
        @error('email')
            <span class="invalid-feedback">{{ $message }}</span>
        @enderror

        @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
            <div class="mt-2">
                <p class="text-sm text-warning">
                    Seu endereço de email não foi verificado.
                    <button form="send-verification" class="btn btn-link p-0 text-decoration-none">
                        Clique aqui para reenviar o email de verificação.
                    </button>
                </p>

                @if (session('status') === 'verification-link-sent')
                    <p class="text-sm text-success">
                        Um novo link de verificação foi enviado para seu endereço de email.
                    </p>
                @endif
            </div>
        @endif
    </div>

    <div class="form-group">
        <button type="submit" class="btn btn-primary">
            <i class="fas fa-save mr-2"></i>
            Salvar Alterações
        </button>

        @if (session('status') === 'profile-updated')
            <span class="text-success ml-2">
                <i class="fas fa-check"></i> Salvo com sucesso!
            </span>
        @endif
    </div>
</form>

@if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
    <form id="send-verification" method="post" action="{{ route('verification.send') }}">
        @csrf
    </form>
@endif