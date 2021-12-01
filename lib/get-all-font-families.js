const shorthandExpand = require('css-shorthand-expand')

module.exports = function (properties) {
  properties = properties || this.properties

  if (!properties) {
    return 0
  }

  let families = properties['font-family'] || []

  if (properties.font) {
    families = families.concat(properties.font
      // eslint-disable-next-line array-callback-return
      .map(function (value) {
        try {
          return shorthandExpand('font', value)['font-family']
        } catch (e) {}
      })
      .filter(function (value) {
        return value
      })
    )
  }

  return families
}
