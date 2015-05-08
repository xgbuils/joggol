var LayoutView    = require('./LayoutView')

var GeneratorView = LayoutView.extend({
    initialize: function (options) {
        LayoutView.prototype.initialize.call(this, options)

        this.keyboardView   = options.keyboardView
        this.controlBarView = options.controlBarView

        this.on('active', function () {
            if (this.controlBarView.currentKB[this.name]) {
                this.controlBarView.trigger('active')
            }
        })
    }
})

module.exports = GeneratorView