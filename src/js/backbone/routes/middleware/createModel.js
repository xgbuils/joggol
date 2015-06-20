var decode = require('../../../utils/siteswapOptionsDecode')
var SiteswapOptions = require('../../models/SiteswapOptions')
var objectAssign = require('object-assign')

function createModel(qs, defaults) {
    var options = decode(qs)
    ;['balls', 'period', 'height'].forEach(function (field) {
        options[field] || (options[field] = {})
        ;['min', 'max'].forEach(function (type) {
            options[field][type] || (options[field][type] = defaults[field][type])
        })
    })
    this.model.set(options)

    return options
}

module.exports = createModel