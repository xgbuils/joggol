var message = require('language').message
var ErrorHandler   = require('../../validation/ErrorHandler.js')
var RecursiveModel = require('frontpiece.recursive-model')

var SiteswapOptions = RecursiveModel.extend({
    initialize: function (attrs, opt) {
        var model = this
        var balls  = attrs.balls
          , period = attrs.period
          , height = attrs.height

        this.set('balls' , balls)
        this.set('period', period)
        height.get('max') || (height.set('max', balls.get('max') * period.get('max')))
        this.set('height', height)
    },
    validate: function (attrs) {
        if (attrs.height.max <= attrs.balls.min && attrs.period.min > 1) {
            return message.emptyWithBigPeriod()
        } else if(attrs.period.min === 1 && attrs.height.max < attrs.balls.min) {
            return message.emptyWithLittlePeriod()
        }
    }
})

module.exports = SiteswapOptions