var LayoutView    = require('./LayoutView')

var GeneratorView = LayoutView.extend({
    initialize: function (options) {
        this.name = 'generator'
        LayoutView.prototype.initialize.call(this, options)

        this.appModel.on('layout-' + this.name + ':active', function () {
            var keyboardName     = this.get('generatorKB')
            if (keyboardName) {
                this.set('keyboard', keyboardName)
            }
        })
    }
})

module.exports = GeneratorView