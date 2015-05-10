var KeyboardView = require('./KeyboardView')
var siteswap     = require('siteswap-generator')

var PatternsKeyboardView = KeyboardView.extend({
    initialize: function (options) {
        var abc = '0123456789abcdefghijklmnopqrstuvwxyz'
        options.transform = function (pattern) {
            return pattern
                .map(function (e) {
                    return abc[e]
                })
                .join('')
        }
        
        options.lazyListConstructor = function (siteswapOptions) {
            //console.log('siteswapOptions', siteswapOptions)
            var buffer = new siteswap.Buffer(siteswapOptions)
            //console.log('buffer', buffer)
            return buffer
        }
        KeyboardView.prototype.initialize.call(this, options)

        this.on('click-key', function ($key) {
            var pattern = $key.text()
            var simulatorView = this.simulatorView
            simulatorView.render(pattern)
        })
    },
    
})

module.exports = PatternsKeyboardView