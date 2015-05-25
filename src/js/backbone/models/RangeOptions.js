var message = require('language').message
var RecursiveModel = require('frontpiece.recursive-model')

var RangeOptions = RecursiveModel.extend({
    validate: function (attrs) {
        console.log('VALIDANDO RANGO', attrs)
        if (attrs.min > attrs.max) {
            console.log('meeecSSDAFSA')
            return message.invalidRange(attrs, this.name)
        }
    }
})

module.exports = RangeOptions