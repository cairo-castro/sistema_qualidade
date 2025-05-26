import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js'
            ],
            refresh: true,
        }),
    ],
    
    // Otimizações de build
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separar bibliotecas grandes em chunks
                    'chart': ['chart.js'],
                    'alpine': ['alpinejs'],
                    'preline': ['preline'],
                },
            },
        },
        // Reduzir tamanho dos chunks
        chunkSizeWarningLimit: 1000,
        // Otimizações específicas para o sistema hospitalar
        minify: 'esbuild',
        target: 'es2020',
        sourcemap: process.env.NODE_ENV === 'development',
    },
    
    // Server configuration para desenvolvimento
    server: {
        hmr: {
            host: 'localhost',
        },
        watch: {
            // Observar mudanças em módulos também
            include: [
                'resources/**', 
                'Modules/**/Resources/**',
                'app/View/Components/**'
            ],
        },
        // Proxy para APIs externas se necessário
        proxy: {
            // Exemplo para APIs médicas ou integrações hospitalares
            // '/api/external': 'http://localhost:8080'
        }
    },
    
    // Resolver aliases úteis para o projeto hospitalar
    resolve: {
        alias: {
            '@': '/resources/js',
            '@css': '/resources/css',
            '@components': '/resources/js/components',
            '@hospital': '/resources/js/hospital',
            '@modules': '/Modules',
            '@images': '/resources/images',
        },
    },
    
    // CSS configuration
    css: {
        // PostCSS será configurado via postcss.config.js
        devSourcemap: true,
        // Preprocessor options para variáveis CSS customizadas
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "resources/css/variables.scss";
                `
            }
        }
    },
    
    // Configurações específicas para desenvolvimento
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
        __HOSPITAL_THEME__: JSON.stringify('hospital-green'),
    },
    
    // Otimização de dependências
    optimizeDeps: {
        include: [
            'alpinejs',
            'chart.js',
            'preline'
        ],
        exclude: [
            // Excluir dependências que podem causar problemas
        ]
    },
    
   
});