var LayoutView    = require('./LayoutView')

var GeneratorView = LayoutView.extend({
    initialize: function (options) {
        this.name = 'generator'
        LayoutView.prototype.initialize.call(this, options)
        var appModel = this.appModel

        this.on('active', function () {
            var keyboardName     = appModel.get('generatorKB')
            var controlBarActive = appModel.get('controlBarActive')
            if (keyboardName) {
                appModel.set('keyboard', keyboardName)
            }
        })
    }
})

module.exports = GeneratorView