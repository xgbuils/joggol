var RangeOptions = require('./RangeOptions')

var HeightOptions = RangeOptions.extend({
    initialize: function () {
    	this.name = 'heights'

        if (!this.get('min')) {
        	this.set('min', 1)
        }
    }
})

module.exports = HeightOptions