var LayoutView = require('./LayoutView')
var Juggler    = require('../../../Juggler/juggler.js')

var SimulatorView = LayoutView.extend({
    initialize: function (options) {
        LayoutView.prototype.initialize.call(this, options)
        this.name = 'simulator'
        this.patternsKeyboardView = options.patternsKeyboardView
        this.patternsKeyboardView.simulatorView = this

        this.on('active', function () {
            this.controlBarView.trigger('active')
            this.patternsKeyboardView.$el.addClass('js-select')
            this.render()
        })

        this.on('inactive', function () {
            this.controlBarView.trigger('inactive')
            this.patternsKeyboardView.$el.removeClass('js-select')
        })

        this.on('create', function (options) {
            // set pattern 
            this.patternsKeyboardView.lazyListOptions = options
            this.patternsKeyboardView.create()
        })
    },
    render: function (pattern) {
        console.log(pattern)
        if (!pattern) {
            var keys_list = this.patternsKeyboardView.keys_list
            var pattern = keys_list.slice(0, 1)[0].join('')
        }
        if (!this.juggler) {
            var $simulator    = this.$el
            var width  = $simulator.width()
            var height = $simulator.height()
            this.juggler = new Juggler({
                stage: {
                    container: 'juggler-simulator',
                    width:  width,
                    height: height
                }
            })
        }
        if (this.pattern !== pattern) {
            this.juggler.stop()
            this.juggler.setPattern(pattern)
            this.juggler.play()
            this.pattern = pattern
        }
    }
})

module.exports = SimulatorView