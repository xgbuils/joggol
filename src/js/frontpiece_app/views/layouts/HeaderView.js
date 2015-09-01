var LayoutView = require('./LayoutView')

var HeaderView = LayoutView.extend({
    initialize: function (options) {
        var view  = this
        this.name = 'header'
        LayoutView.prototype.initialize.call(this, options)
        var appModel = this.appModel

        appModel.on('layout-' + this.name + ':active', function () {
            view.$el.removeClass('reduce')
            this.set('keyboard', undefined)
        })

        appModel.on('layout-' + this.name + ':inactive', function () {
            view.$el.addClass('reduce')
        })
    }
})

module.exports = HeaderView