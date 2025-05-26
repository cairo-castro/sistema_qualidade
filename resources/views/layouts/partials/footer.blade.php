<!-- Footer -->
<footer class="footer footer-center p-6 bg-white border-t border-base-300 text-base-content">
    <div class="grid grid-flow-col gap-4">
        <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                </svg>
            </div>
            <span class="font-semibold">{{ config('sistema.name', 'Sistema Hospitalar') }}</span>
        </div>
    </div>
    
    <div class="grid grid-flow-col gap-4 text-sm text-base-content-60">
        <span>Versão {{ config('sistema.version', '1.0.0') }}</span>
        <span>•</span>
        <span>Laravel {{ app()->version() }}</span>
        <span>•</span>
        <span>PHP {{ PHP_VERSION }}</span>
        @if(config('app.env') !== 'production')
            <span>•</span>
            <span class="badge badge-warning badge-xs">{{ strtoupper(config('app.env')) }}</span>
        @endif
    </div>
    
    <div class="text-xs text-base-content-60">
        <p>
            Copyright © {{ date('Y') }} 
            <strong class="text-base-content">{{ config('sistema.company', 'EMSERH') }}</strong>
            - Todos os direitos reservados
        </p>
        <p class="mt-1">
            Sistema de Gestão da Qualidade Assistencial • 
            <a href="mailto:{{ config('sistema.mail.support_email', 'suporte@empresa.com') }}" 
               class="link link-primary">Suporte Técnico</a>
        </p>
    </div>
</footer>