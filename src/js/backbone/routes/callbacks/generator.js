var createModel = require('../middleware/createModel')
var defaults    = require('../../models/siteswapOptionsDefaults')

function generator (_, qs) {
	createModel.call(this, qs, defaults)
	this.appView.scroll('generator')
}

module.exports = generator