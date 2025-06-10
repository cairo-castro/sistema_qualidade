// Lazy Loading Configuration
export const LazyLoader = {
    loadApexCharts: () => import('apexcharts'),
    loadDataTables: () => import('datatables.net-dt'),
    loadPrelineComponents: () => Promise.all([
        import('@preline/datatable'),
        import('@preline/dropdown'),
        import('@preline/tooltip')
    ])
};
