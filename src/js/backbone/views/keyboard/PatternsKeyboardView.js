var KeyboardView = require('./KeyboardView')
var siteswap     = require('siteswap-generator')

var PatternsKeyboardView = KeyboardView.extend({
    initialize: function (options) {
        options.transform = function (pattern) {
            return pattern.join('')
        }
        options.lazyListOptions = options.model.toJSON()
        options.lazyListConstructor = function (siteswapOptions) {
            return new siteswap.Buffer(siteswapOptions)
        }
        KeyboardView.prototype.initialize.call(this, options)
    },
    
})

module.exports = PatternsKeyboardView