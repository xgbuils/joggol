var createModel = require('../middleware/createModel')
var defaults    = require('../../models/siteswapOptionsDefaults')

function generator (qs) {
    qs || (qs = '')
	console.log(qs)
	createModel.call(this, qs, this.model.get())

	var appView = this.appView
	var generatorView = appView.layouts.generator
	appView.scroll('generator')
}

module.exports = generator