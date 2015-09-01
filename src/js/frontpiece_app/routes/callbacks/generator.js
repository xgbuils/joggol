var createModel = require('../middleware/createModel')
var defaults    = require('../../models/siteswapOptionsDefaults')

function generator (qs) {
    qs || (qs = '')
	createModel.call(this, qs, this.model.get())

	this.appView.scroll('generator')
}

module.exports = generator