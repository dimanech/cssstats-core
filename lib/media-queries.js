const _ = require('lodash')
const postcss = require('postcss')
const rules = require('./rules')
const selectors = require('./selectors')
const declarations = require('./declarations')

module.exports = function (root, opts) {
  const result = {
    total: 0,
    unique: 0,
    values: [],
    contents: []
  }

  root.walkAtRules(function (rule) {
    if (rule.name === 'media') {
      result.total++
      result.values.push(rule.params)

      if (opts.mediaQueries) {
        const qRoot = postcss.parse(rule.nodes)
        result.contents.push({
          value: rule.params,
          rules: rules(qRoot, opts),
          selectors: selectors(qRoot, opts),
          declarations: declarations(qRoot, opts)
        })
      } else {
        delete result.contents
      }
    }
  })

  result.unique = _.uniq(result.values).length
  return result
}
