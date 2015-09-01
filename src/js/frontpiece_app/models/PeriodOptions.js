var RangeOptions = require('./RangeOptions')

var PeriodOptions = RangeOptions.extend({
    initialize: function (attrs) {
    	this.name = 'period'

    	if (!this.get('min')) {
    		this.set('min', 1)
    	}
    }
})

module.exports = PeriodOptions