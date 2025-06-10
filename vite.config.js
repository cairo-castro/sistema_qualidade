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
    build: {
        cssMinify: 'esbuild',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log'],
                passes: 2,
            },
            mangle: {
                safari10: true,
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // ApexCharts chunk
                    if (id.includes('apexcharts')) {
                        return 'vendor-charts';
                    }
                    // DataTables chunk
                    if (id.includes('datatables')) {
                        return 'vendor-datatables';
                    }
                    // Alpine.js chunk
                    if (id.includes('alpinejs')) {
                        return 'vendor-alpine';
                    }
                    // Preline components chunk
                    if (id.includes('@preline')) {
                        return 'vendor-preline';
                    }
                    // Core vendor libraries
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
            external: [],
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
                tryCatchDeoptimization: false,
            },
        },
        chunkSizeWarningLimit: 1000,
        cssCodeSplit: true,
        sourcemap: false,
        target: ['es2020', 'chrome87', 'firefox78', 'safari14'],
        reportCompressedSize: false,
    },
        optimizeDeps: {
        include: [
            'alpinejs',
            'apexcharts',
            'datatables.net-dt',
            '@preline/datatable',
            '@preline/dropdown',
            '@preline/tooltip',
        ],
        exclude: ['@vite/client', '@vite/env'],
    },
    esbuild: {
        drop: ['console', 'debugger'],
        legalComments: 'none',
        target: 'es2020',
        charset: 'utf8',
    },
    css: {
        devSourcemap: false,
    },
    server: {
        hmr: {
            overlay: false,
        },
    },
    experimental: {
        renderBuiltUrl(filename, { hostType }) {
            return '/' + filename;
        },
    },
    define: {
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
    }
});
