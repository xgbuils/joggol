var decode = require('../../../utils/siteswapOptionsDecode')
var SiteswapOptions = require('../../models/SiteswapOptions')

function createModel(qs, defaults) {
    var options = decode(qs)
    ;['balls', 'period', 'height'].forEach(function (field) {
        options[field] || (options[field] = {})
        ;['min', 'max'].forEach(function (type) {
            options[field][type] || (options[field][type] = defaults[field][type])
        })
    })

    console.log(options)

    console.log('CREATE')

    if (!this.model) {
        this.model = new SiteswapOptions(options)
        this.appView.trigger('create-model', this.model)
    }

    return options
}

module.exports = createModel