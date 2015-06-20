var LayoutView = require('./LayoutView')

var HeaderView = LayoutView.extend({
    initialize: function (options) {
        this.name = 'header'
        LayoutView.prototype.initialize.call(this, options)

        this.on('active', function () {
            this.$el.removeClass('reduce')
            this.appModel.set('keyboard', undefined)
        })

        this.on('inactive', function () {
            this.$el.addClass('reduce')
        })
    }
})

module.exports = HeaderView