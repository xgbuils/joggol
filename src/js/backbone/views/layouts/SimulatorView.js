var LayoutView = require('./LayoutView')
var Juggler    = require('../../../Juggler/juggler.js')

var SimulatorView = LayoutView.extend({
    initialize: function (options) {
        var view = this
        this.name = 'simulator'
        LayoutView.prototype.initialize.call(this, options)

        var model    = this.model    = options.model
        
        this.patternsKeyboardView = options.patternsKeyboardView
        this.patternsKeyboardView.simulatorView = this

        var appModel = this.appModel = options.appModel

        this.on('active', function () {
            this.appModel.set('keyboard', 'patterns')
            this.render()
        })
    },
    render: function (pattern) {
        if (!pattern) {
            var keys_list = this.patternsKeyboardView.keys_list
            var pattern = keys_list.slice(0, 1)[0]
        }
        if (!this.juggler) {
            var $simulator = this.$el
            var width      = $simulator.width()
            var height     = $simulator.height()
            this.juggler   = new Juggler({
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