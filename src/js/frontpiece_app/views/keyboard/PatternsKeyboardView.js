var KeyboardView = require('./KeyboardView')
var siteswap     = require('siteswap-generator')

var PatternsKeyboardView = KeyboardView.extend({
    initialize: function (options) {
        var view = this
        var appModel = this.appModel = options.appModel

        var abc = '0123456789abcdefghijklmnopqrstuvwxyz'
        options.transform = function (pattern) {
            return pattern
                .map(function (e) {
                    return abc[e]
                })
                .join('')
        }
        
        options.lazyListConstructor = function (siteswapOptions) {
            var buffer = new siteswap.Buffer(siteswapOptions)
            return buffer
        }
        KeyboardView.prototype.initialize.call(this, options)

        this.on('click-key', function ($key) {
            var pattern = $key.text()
            var simulatorView = this.simulatorView
            simulatorView.render(pattern)
        })

        appModel.on('create', function (options) {
            view.lazyListOptions = options
            view.create()
        })
    },
    
})

module.exports = PatternsKeyboardView