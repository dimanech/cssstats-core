const _ = require('lodash')
const hasIdSelector = require('has-id-selector')
const hasClassSelector = require('has-class-selector')
const hasPseudoElement = require('has-pseudo-element')
const hasPseudoClass = require('has-pseudo-class')
const hasElementSelector = require('has-element-selector')
const getSpecificityGraph = require('./get-specificity-graph')
const getRepeatedValues = require('./get-repeated-values')
const getSpecificityValues = require('./get-specificity-values')
const getSortedSpecificity = require('./get-sorted-specificity')

module.exports = function (root, opts) {
  const result = {
    total: 0,
    type: 0,
    class: 0,
    id: 0,
    pseudoClass: 0,
    pseudoElement: 0,
    values: [],
    specificity: {
      max: 0,
      average: 0
    },
    selectorsLists: [],
    getSpecificityGraph: getSpecificityGraph,
    getSpecificityValues: getSpecificityValues,
    getSortedSpecificity: getSortedSpecificity,
    getRepeatedValues: getRepeatedValues
  }

  root.walkRules(function (rule) {
    const selector = rule.selector
    if (/,/g.test(selector)) {
      result.selectorsLists.push(selector)
    }
    rule.selectors.forEach(function (selector) {
      result.total++
      result.values.push(selector)

      if (hasElementSelector(selector)) {
        result.type++
      }

      if (hasClassSelector(selector)) {
        result.class++
      }

      if (hasIdSelector(selector)) {
        result.id++
      }

      if (hasPseudoElement(selector)) {
        result.pseudoElement++
      }

      if (hasPseudoClass(selector)) {
        result.pseudoClass++
      }
    })
  })

  const graph = result.getSpecificityGraph()
  result.specificity.max = _.max(graph) || 0
  result.specificity.average = _.sum(graph) / graph.length || 0

  if (opts.specificityGraph) {
    result.specificity.graph = graph
  }

  if (opts.sortedSpecificityGraph) {
    result.specificity.sortedGraph = result.getSortedSpecificity()
  }

  if (opts.repeatedSelectors) {
    result.repeated = result.getRepeatedValues()
  }

  return result
}
