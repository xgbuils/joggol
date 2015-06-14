var Model = require('frontpiece.model')

var AppModel = Model.extend({
	initialize: function (attrs, options) {
        this.on('change:layout', function (previous) {
        	console.log('change:layout', previous)
        	var layout   = this.get('layout')
        	//var previous = this.get('previous-layout')
        	this.trigger('layout.off:' + previous)
        	this.trigger('layout:' + layout)
        })
	}
})

module.exports = AppModel