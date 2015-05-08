var querystring = require('querystring')

function simulator (_, qs) {
	var options = querystring.decode(qs)
	this.appView.scroll('simulator')
}

module.exports = simulator