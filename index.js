const _ = require('lodash')
const postcss = require('postcss')
const safeParser = require('postcss-safe-parser')
const bytes = require('bytes')
const gzipSize = require('gzip-size')
const size = require('./lib/size')
const rules = require('./lib/rules')
const selectors = require('./lib/selectors')
const declarations = require('./lib/declarations')
const mediaQueries = require('./lib/media-queries')
const fontFaces = require('./lib/font-faces')

module.exports = function (src, opts) {
  opts = opts || {}
  opts = _.defaults(opts, {
    safe: true,
    mediaQueries: true,
    importantDeclarations: false,
    specificityGraph: false,
    sortedSpecificityGraph: false,
    repeatedSelectors: false,
    propertyResets: false,
    vendorPrefixedProperties: false
  })

  function parse (root, result) {
    const stats = {}

    const string = postcss().process(root).css
    stats.size = size(string)
    stats.gzipSize = gzipSize.sync(string)
    stats.humanizedSize = bytes(stats.size, { decimalPlaces: 0 })
    stats.humanizedGzipSize = bytes(stats.gzipSize, { decimalPlaces: 0 })

    stats.rules = rules(root, opts)
    stats.selectors = selectors(root, opts)
    stats.declarations = declarations(root, opts)
    stats.mediaQueries = mediaQueries(root, opts)
    stats.fontFaces = fontFaces(root, opts)

    // Push message to PostCSS when used as a plugin
    if (result && result.messages) {
      result.messages.push({
        type: 'cssstats',
        plugin: 'postcss-cssstats',
        stats: stats
      })
    }

    stats.toJSON = function () {
      // Remove methods when using JSON.stringify
      delete stats.selectors.getSpecificityGraph
      delete stats.selectors.getRepeatedValues
      delete stats.selectors.getSortedSpecificity
      delete stats.declarations.getPropertyResets
      delete stats.declarations.getUniquePropertyCount
      delete stats.declarations.getPropertyValueCount
      delete stats.declarations.getVendorPrefixed
      delete stats.declarations.getAllFontSizes
      delete stats.declarations.getAllFontFamilies
      return stats
    }

    // Return stats for default usage
    return stats
  }

  if (typeof src === 'string') {
    // Default behavior
    const root = postcss().process(src, { parser: safeParser }).root
    const result = parse(root, {})
    return result
  } else if (typeof src === 'object' || typeof src === 'undefined') {
    // Return a PostCSS plugin
    return parse
  } else {
    throw new TypeError('cssstats expects a string or to be used as a PostCSS plugin')
  }
}
