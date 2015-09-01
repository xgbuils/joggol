var RangeOptions = require('./RangeOptions')

var HeightOptions = RangeOptions.extend({
    initialize: function () {
    	this.name = 'height'

        if (!this.get('min')) {
        	this.set('min', 1)
        }
    }
})

module.exports = HeightOptions