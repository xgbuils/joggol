var LayoutView    = require('./LayoutView')
var GeneratorView = LayoutView.extend({
    initialize: function (options) {
        LayoutView.call(this, options)

        this.keyboardView   = options.keyboardView
        this.controlBarView = options.controlBarView

        this.on('active', function () {
            if (this.keyboardView.active) {
                this.controlBarView.trigger('active', this.keyboardView)
            }
        })
    }
})