var createModel = require('../middleware/createModel')
var defaults    = require('../../models/siteswapOptionsDefaults')

function simulator (_, qs) {
    var options = createModel.call(this, qs, defaults)

    var appView       = this.appView
    var simulatorView = appView.layouts.simulator
    simulatorView.trigger('create', options)
    
    //console.log('SCROLL')
    appView.scroll('simulator', function () {
        simulatorView.trigger('active')
    })
}

module.exports = simulator