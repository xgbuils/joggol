var lang  = require('language')
var utils = require('../utils.js')

module.exports = function validate (errorHandler, values, type, minmax, option) {
    var message = lang.message
    var range = values[type]
    var value = range[minmax]
    if (!utils.isInt(value)) {
        errorHandler.add(minmax + type, message.isNotAInt(value))
    } else {
        errorHandler.remove(minmax + type)
    }

    if (option === 'all' || option === 'range') {
        if(range.min > range.max) {
            console.log('min > max')
            errorHandler.add(type, message.invalidRange(range, type))
            console.log(errorHandler.ok())
        } else {
            errorHandler.remove(type)
        }
    }

    if (option === 'all') {
        var minBalls   = values.balls.min
        var maxHeights = values.heights.max
        var minPeriods = values.periods.min
    
        if (maxHeights <= minBalls && minPeriods > 1) {
            errorHandler.add('all', message.emptyWithBigPeriod())
        } else if(minPeriods === 1 && maxHeights < minBalls) {
            errorHandler.add('all', message.emptyWithLittlePeriod())
        } else {
            errorHandler.remove('all')
        }
    }
}