var RangeOptions = require('./RangeOptions')

var HeightOptions = RangeOptions.extend({
    initialize: function () {
    	this.name = 'height'
        RangeOptions.prototype.initialize.apply(this, arguments)

        if (!this.get('min')) {
        	this.set('min', 1)
        }
    }
})

module.exports = HeightOptions