module.exports = function (root, opts) {
  var result = {
    total: 0,
    src: []
  }

  root.walkAtRules(function (rule) {
    if (rule.name === 'font-face') {
      result.total++
      rule.walkDecls(function (decl) {
        if (decl.prop === 'src') {
          result.src.push(decl.value)
        }
      })
    }
  })

  return result
}
