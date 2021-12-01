const shorthandExpand = require('css-shorthand-expand')

module.exports = function (properties) {
  properties = properties || this.properties

  if (!properties) {
    return 0
  }

  let fontSizes = properties['font-size'] || []

  if (properties.font) {
    fontSizes = fontSizes.concat(properties.font
      // eslint-disable-next-line array-callback-return
      .map(function (value) {
        try {
          return shorthandExpand('font', value)['font-size']
        } catch (e) {}
      })
      .filter(function (value) {
        return value
      })
    )
  }

  return fontSizes
}
