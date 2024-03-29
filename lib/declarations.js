const getPropertyResets = require('./get-property-resets')
const getUniquePropertyCount = require('./get-unique-property-count')
const getPropertyValueCount = require('./get-property-value-count')
const getVendorPrefixedProperties = require('./get-vendor-prefixed-properties')
const getAllFontSizes = require('./get-all-font-sizes')
const getAllFontFamilies = require('./get-all-font-families')

module.exports = function (root, opts) {
  const result = {
    total: 0,
    unique: 0,
    important: [],
    properties: {},
    getPropertyResets: getPropertyResets,
    getUniquePropertyCount: getUniquePropertyCount,
    getPropertyValueCount: getPropertyValueCount,
    getVendorPrefixed: getVendorPrefixedProperties,
    getAllFontSizes: getAllFontSizes,
    getAllFontFamilies: getAllFontFamilies
  }

  root.walkRules(function (rule) {
    rule.walkDecls(function (declaration) {
      const prop = declaration.prop

      result.total++

      if (declaration.important) {
        result.important.push({
          property: declaration.prop,
          value: declaration.value
        })
      }

      result.properties[prop] = result.properties[prop] || []
      result.properties[prop].push(declaration.value)
    })
  })

  result.unique = Object.keys(result.properties).reduce(function (a, property) {
    return a + getUniquePropertyCount.call(result, property)
  }, 0)

  if (opts.propertyResets) {
    result.resets = result.getPropertyResets()
  }

  if (opts.vendorPrefixedProperties) {
    result.vendorPrefixes = result.getVendorPrefixed()
  }

  if (!opts.importantDeclarations) {
    delete result.important
  }

  return result
}
