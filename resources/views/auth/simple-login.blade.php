<x-guest-layout>
    <x-slot name="title">Login Simples</x-slot>
    
    <!-- Header -->
    <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Login Simples</h2>
        <p class="text-slate-600 dark:text-slate-400 mt-2">Teste de autenticação sem CSRF</p>
    </div>
    
    <!-- Session Status -->
    @if (session('status'))
        <div class="mb-4 font-medium text-sm text-green-600">
            {{ session('status') }}
        </div>
    @endif
    
    <!-- Simple Login Form WITHOUT CSRF -->
    <form method="POST" action="{{ route('simple-auth.store') }}" class="space-y-6">
        
        <!-- User Name -->
        <div>
            <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Nome de Usuário
            </label>
            <input type="text" 
                   name="name" 
                   value="{{ old('name') }}" 
                   class="w-full px-4 py-3 rounded-lg border @error('name') border-red-500 @else border-slate-300 @enderror"
                   placeholder="Digite seu nome de usuário"
                   required 
                   autofocus>
            @error('name')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Password -->
        <div>
            <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                Senha
            </label>
            <input type="password" 
                   name="password" 
                   class="w-full px-4 py-3 rounded-lg border @error('password') border-red-500 @else border-slate-300 @enderror"
                   placeholder="••••••••"
                   required>
            @error('password')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>
        
        <!-- Remember Me -->
        <div class="flex items-center">
            <input id="remember" name="remember" type="checkbox" class="rounded border-slate-300">
            <label for="remember" class="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                Lembrar de mim
            </label>
        </div>
        
        <!-- Submit Button -->
        <div>
            <button type="submit" 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                Entrar
            </button>
        </div>
        
        <!-- Demo Accounts -->
        <div class="mt-6 space-y-3">
            <p class="text-sm text-slate-600 dark:text-slate-400 text-center">Contas de demonstração:</p>
            <div class="flex flex-col space-y-2">
                <button type="button" onclick="fillDemo('admin', 'password')" 
                        class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-3 rounded">
                    Admin (admin / password)
                </button>
                <button type="button" onclick="fillDemo('gestor', 'password')" 
                        class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-3 rounded">
                    Gestor (gestor / password)
                </button>
                <button type="button" onclick="fillDemo('operador', 'password')" 
                        class="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 py-2 px-3 rounded">
                    Operador (operador / password)
                </button>
            </div>
        </div>
    </form>
    
    <!-- Regular Login Link -->
    <div class="mt-6 text-center">
        <a href="{{ route('login') }}" class="text-sm text-blue-600 hover:text-blue-500">
            ← Voltar ao login normal
        </a>
    </div>
    
    <script>
        function fillDemo(username, password) {
            document.querySelector('input[name="name"]').value = username;
            document.querySelector('input[name="password"]').value = password;
        }
    </script>
</x-guest-layout>
