var LayoutView    = require('./LayoutView')

var SimulatorView = LayoutView.extend({
    initialize: function (options) {
        LayoutView.prototype.initialize.call(this, options)
        this.name = 'simulator'
        this.patternsKeyboardView = options.patternsKeyboardView

        this.on('active', function () {
            this.controlBarView.trigger('active')
            this.patternsKeyboardView.$el.addClass('js-select')
        })

        this.on('inactive', function () {
            this.controlBarView.trigger('inactive')
            this.patternsKeyboardView.$el.removeClass('js-select')
        })
    },
    /*render: function (options) {
        if (!this.keyboardView.)
    }*/
})

module.exports = SimulatorView