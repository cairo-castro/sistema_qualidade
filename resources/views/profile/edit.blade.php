<x-app-layout>
    <x-slot name="title">Meu Perfil</x-slot>
    <x-slot name="breadcrumbs">
        {{ [['title' => 'Meu Perfil']] }}
    </x-slot>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Informações do Perfil -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Dados Pessoais -->
            <div class="bg-white rounded-xl shadow-lg border border-base-300 p-6">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-base-content">Informações Pessoais</h2>
                        <p class="text-sm text-base-content-60">Atualize suas informações básicas</p>
                    </div>
                </div>
                
                @if (session('status') === 'profile-updated')
                    <div class="alert alert-success mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Perfil atualizado com sucesso!</span>
                    </div>
                @endif
                
                <form method="post" action="{{ route('profile.update') }}" class="space-y-6">
                    @csrf
                    @method('patch')
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">Nome Completo</span>
                        </label>
                        <input type="text" 
                               name="name" 
                               value="{{ old('name', $user->name) }}" 
                               class="input input-bordered w-full @error('name') input-error @enderror" 
                               required 
                               autofocus>
                        @error('name')
                            <label class="label">
                                <span class="label-text-alt text-error">{{ $message }}</span>
                            </label>
                        @enderror
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">Endereço de Email</span>
                        </label>
                        <input type="email" 
                               name="email" 
                               value="{{ old('email', $user->email) }}" 
                               class="input input-bordered w-full @error('email') input-error @enderror" 
                               required>
                        @error('email')
                            <label class="label">
                                <span class="label-text-alt text-error">{{ $message }}</span>
                            </label>
                        @enderror
                        
                        @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
                            <div class="alert alert-warning mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <p class="font-medium">Email não verificado</p>
                                    <p class="text-sm">
                                        Seu endereço de email ainda não foi verificado. 
                                        <button form="send-verification" class="link link-primary">
                                            Clique aqui para reenviar o email de verificação.
                                        </button>
                                    </p>
                                </div>
                            </div>
                            
                            @if (session('status') === 'verification-link-sent')
                                <div class="alert alert-info mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Um novo link de verificação foi enviado para seu email.</span>
                                </div>
                            @endif
                        @endif
                    </div>
                    
                    <div class="flex justify-end">
                        <button type="submit" class="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Alterar Senha -->
            <div class="bg-white rounded-xl shadow-lg border border-base-300 p-6">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-base-content">Alterar Senha</h2>
                        <p class="text-sm text-base-content-60">Mantenha sua conta segura com uma senha forte</p>
                    </div>
                </div>
                
                @if (session('status') === 'password-updated')
                    <div class="alert alert-success mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Senha alterada com sucesso!</span>
                    </div>
                @endif
                
                <form method="post" action="{{ route('password.update') }}" class="space-y-6">
                    @csrf
                    @method('put')
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">Senha Atual</span>
                        </label>
                        <input type="password" 
                               name="current_password" 
                               class="input input-bordered w-full @error('current_password', 'updatePassword') input-error @enderror" 
                               autocomplete="current-password">
                        @error('current_password', 'updatePassword')
                            <label class="label">
                                <span class="label-text-alt text-error">{{ $message }}</span>
                            </label>
                        @enderror
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">Nova Senha</span>
                        </label>
                        <input type="password" 
                               name="password" 
                               class="input input-bordered w-full @error('password', 'updatePassword') input-error @enderror" 
                               autocomplete="new-password">
                        @error('password', 'updatePassword')
                            <label class="label">
                                <span class="label-text-alt text-error">{{ $message }}</span>
                            </label>
                        @enderror
                    </div>
                    
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-medium">Confirmar Nova Senha</span>
                        </label>
                        <input type="password" 
                               name="password_confirmation" 
                               class="input input-bordered w-full @error('password_confirmation', 'updatePassword') input-error @enderror" 
                               autocomplete="new-password">
                        @error('password_confirmation', 'updatePassword')
                            <label class="label">
                                <span class="label-text-alt text-error">{{ $message }}</span>
                            </label>
                        @enderror
                    </div>
                    
                    <div class="flex justify-end">
                        <button type="submit" class="btn btn-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Alterar Senha
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Sidebar do Perfil -->
        <div class="space-y-6">
            <!-- Informações da Conta -->
            <div class="bg-white rounded-xl shadow-lg border border-base-300 p-6">
                <div class="text-center">
                    <div class="avatar mb-4">
                        <div class="w-24 h-24 rounded-full">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=random&size=96" 
                                 alt="{{ Auth::user()->name }}" />
                        </div>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-base-content">{{ Auth::user()->name }}</h3>
                    <p class="text-sm text-base-content-60 mb-4">{{ Auth::user()->email }}</p>
                    
                    @if(Auth::user()->getRoleNames()->isNotEmpty())
                        <div class="flex justify-center mb-4">
                            @foreach(Auth::user()->getRoleNames() as $role)
                                <span class="badge badge-primary">{{ $role }}</span>
                            @endforeach
                        </div>
                    @endif
                </div>
                
                <div class="divider"></div>
                
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-base-content-70">ID do Usuário</span>
                        <span class="text-sm font-mono">#{{ Auth::user()->id }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-base-content-70">Membro desde</span>
                        <span class="text-sm">{{ Auth::user()->created_at->format('d/m/Y') }}</span>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-base-content-70">Último login</span>
                        <span class="text-sm">{{ Auth::user()->updated_at->diffForHumans() }}</span>
                    </div>
                    
                    @if(Auth::user()->email_verified_at)
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-base-content-70">Email verificado</span>
                            <span class="badge badge-success badge-sm">Sim</span>
                        </div>
                    @else
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-base-content-70">Email verificado</span>
                            <span class="badge badge-warning badge-sm">Não</span>
                        </div>
                    @endif
                </div>
            </div>
            
            <!-- Permissões e Roles -->
            <div class="bg-white rounded-xl shadow-lg border border-base-300 p-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Permissões e Acessos</h3>
                
                <!-- Roles -->
                <div class="mb-4">
                    <h4 class="text-sm font-medium text-base-content-70 mb-2">Funções</h4>
                    <div class="space-y-2">
                        @forelse(Auth::user()->getRoleNames() as $role)
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-primary rounded-full"></div>
                                <span class="text-sm">{{ $role }}</span>
                            </div>
                        @empty
                            <p class="text-sm text-base-content-60">Nenhuma função atribuída</p>
                        @endforelse
                    </div>
                </div>
                
                <!-- Permissões Principais -->
                <div>
                    <h4 class="text-sm font-medium text-base-content-70 mb-2">Permissões Principais</h4>
                    <div class="space-y-2">
                        @php
                            $mainPermissions = [
                                'view diagnosticos' => 'Ver Diagnósticos',
                                'create diagnosticos' => 'Criar Diagnósticos',
                                'edit diagnosticos' => 'Editar Diagnósticos',
                                'view reports' => 'Ver Relatórios',
                                'manage users' => 'Gerenciar Usuários',
                                'manage system' => 'Administrar Sistema'
                            ];
                        @endphp
                        
                        @foreach($mainPermissions as $permission => $label)
                            <div class="flex items-center justify-between">
                                <span class="text-sm">{{ $label }}</span>
                                @can($permission)
                                    <span class="badge badge-success badge-xs">✓</span>
                                @else
                                    <span class="badge badge-error badge-xs">✗</span>
                                @endcan
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            
            <!-- Zona de Perigo -->
            <div class="bg-white rounded-xl shadow-lg border border-error p-6">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="w-12 h-12 bg-error rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-error">Zona de Perigo</h3>
                        <p class="text-sm text-base-content-60">Ações irreversíveis</p>
                    </div>
                </div>
                
                <div class="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                        <h4 class="font-bold">Atenção!</h4>
                        <div class="text-sm">
                            Uma vez que sua conta for deletada, todos os recursos e dados serão permanentemente excluídos.
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-error btn-outline w-full" onclick="deleteModal.showModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Deletar Conta
                </button>
            </div>
            
            <!-- Estatísticas do Usuário -->
            <div class="bg-white rounded-xl shadow-lg border border-base-300 p-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Suas Estatísticas</h3>
                
                <div class="space-y-4">
                    @php
                        // Simulação de estatísticas do usuário - você pode implementar queries reais aqui
                        $userStats = [
                            'diagnosticos' => rand(5, 50),
                            'conformidades' => rand(80, 100),
                            'periodos' => rand(2, 8),
                            'ultima_atividade' => now()->subHours(rand(1, 48))
                        ];
                    @endphp
                    
                    <div class="stat bg-base-100 rounded-lg p-4">
                        <div class="stat-title text-xs">Diagnósticos Realizados</div>
                        <div class="stat-value text-2xl text-primary">{{ $userStats['diagnosticos'] }}</div>
                        <div class="stat-desc">Este mês</div>
                    </div>
                    
                    <div class="stat bg-base-100 rounded-lg p-4">
                        <div class="stat-title text-xs">Taxa de Conformidade</div>
                        <div class="stat-value text-2xl text-success">{{ $userStats['conformidades'] }}%</div>
                        <div class="stat-desc">Média geral</div>
                    </div>
                    
                    <div class="stat bg-base-100 rounded-lg p-4">
                        <div class="stat-title text-xs">Períodos Ativos</div>
                        <div class="stat-value text-2xl text-warning">{{ $userStats['periodos'] }}</div>
                        <div class="stat-desc">Em andamento</div>
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="text-center">
                    <p class="text-xs text-base-content-60">
                        Última atividade: {{ $userStats['ultima_atividade']->diffForHumans() }}
                    </p>
                </div>
            </div>
            
            <!-- Links Úteis -->
            <div class="bg-white rounded-xl shadow-lg border border-base-300 p-6">
                <h3 class="text-lg font-semibold text-base-content mb-4">Links Úteis</h3>
                
                <div class="space-y-3">
                    <a href="{{ route('dashboard') }}" class="flex items-center space-x-3 p-2 hover:bg-base-100 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        <span class="text-sm">Voltar ao Dashboard</span>
                    </a>
                    
                    @can('view diagnosticos')
                    <a href="#" class="flex items-center space-x-3 p-2 hover:bg-base-100 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span class="text-sm">Meus Diagnósticos</span>
                    </a>
                    @endcan
                    
                    @can('view reports')
                    <a href="#" class="flex items-center space-x-3 p-2 hover:bg-base-100 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span class="text-sm">Relatórios</span>
                    </a>
                    @endcan
                    
                    <a href="#" class="flex items-center space-x-3 p-2 hover:bg-base-100 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm">Central de Ajuda</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal de Confirmação para Deletar Conta -->
    <dialog id="deleteModal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg text-error">Confirmar Exclusão da Conta</h3>
            <p class="py-4">
                Tem certeza que deseja deletar sua conta? Esta ação <strong>não pode ser desfeita</strong> 
                e todos os seus dados serão permanentemente removidos.
            </p>
            
            <form method="post" action="{{ route('profile.destroy') }}" class="space-y-4">
                @csrf
                @method('delete')
                
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">Digite sua senha para confirmar:</span>
                    </label>
                    <input type="password" 
                           name="password" 
                           class="input input-bordered w-full @error('password', 'userDeletion') input-error @enderror" 
                           placeholder="Sua senha atual" 
                           required>
                    @error('password', 'userDeletion')
                        <label class="label">
                            <span class="label-text-alt text-error">{{ $message }}</span>
                        </label>
                    @enderror
                </div>
                
                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" onclick="deleteModal.close()">
                        Cancelar
                    </button>
                    <button type="submit" class="btn btn-error">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Sim, Deletar Conta
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
    
    <!-- Form para reenvio de verificação de email -->
    @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
        <form id="send-verification" method="post" action="{{ route('verification.send') }}" style="display: none;">
            @csrf
        </form>
    @endif
</x-app-layout>