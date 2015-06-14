var LayoutView    = require('./LayoutView')

var GeneratorView = LayoutView.extend({
    initialize: function (options) {
        this.name = 'generator'
        LayoutView.prototype.initialize.call(this, options)

        this.keyboardView   = options.keyboardView
        //this.controlBarView = options.controlBarView

        this.on('active', function () {
            var keyboardName     = this.model.get('generatorKB')
            var controlBarActive = this.model.get('controlBarActive')
            if (keyboardName) {
                if (!controlBarActive) {
                    this.controlBarView.trigger('active')
                }
                //this.controlBarView.keyboardViews[keyboardName].trigger('active')
            }
        })
    }
})

module.exports = GeneratorView