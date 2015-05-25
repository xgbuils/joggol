var RangeOptions = require('./RangeOptions')

var BallsOptions = RangeOptions.extend({
    initialize: function (attrs) {
    	this.name = 'balls'
        RangeOptions.prototype.initialize.apply(this, arguments)
        this.get('min') || this.set('min', this.get('max'))
    }
})

module.exports = BallsOptions