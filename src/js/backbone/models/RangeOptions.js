var message = require('language').message
var RecursiveModel = require('frontpiece.recursive-model')

var RangeOptions = RecursiveModel.extend({
    validate: function (attrs) {
        if (attrs.min > attrs.max) {
            return message.invalidRange(attrs, this.name)
        }
    }
})

module.exports = RangeOptions