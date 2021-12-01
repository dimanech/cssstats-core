const _ = require('lodash')

module.exports = function (root, opts) {
  const result = {
    total: 0,
    size: {
      graph: [],
      max: 0,
      average: 0
    },
    selectorRuleSizes: []
  }

  root.walkRules(function (rule) {
    const selector = rule.selector
    let declarations = 0

    rule.nodes.forEach(function (node) {
      if (node.type === 'decl') {
        declarations++
      }
    })

    result.total++
    result.size.graph.push(declarations)
    result.selectorRuleSizes.push({
      selector: selector,
      declarations: declarations
    })
  })

  if (result.total > 0) {
    result.size.max = _.max(result.size.graph)
    result.size.average = _.sum(result.size.graph) / result.size.graph.length
  }

  result.selectorRuleSizes.sort(function (a, b) {
    return b.declarations - a.declarations
  })

  return result
}
