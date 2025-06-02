export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        colormin: true,
        convertValues: true,
        discardDuplicates: true,
        discardEmpty: true,
        mergeRules: true,
        mergeLonghand: true,
        minifySelectors: true,
        reduceTransforms: true,
        svgo: true,
      }]
    },
    'postcss-sort-media-queries': {
      sort: 'mobile-first'
    },
    'postcss-combine-duplicated-selectors': {
      removeDuplicatedProperties: true
    }
  }
}