var RangeOptions = require('./RangeOptions')

var BallsOptions = RangeOptions.extend({
    initialize: function (attrs) {
    	this.name = 'balls'
        this.get('min') || this.set('min', this.get('max'))
    }
})

module.exports = BallsOptions