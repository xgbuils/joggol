var View = require('frontpiece.view')

var DashboardView = View.extend({
    initialize: function (options) {
        var view = this
        this.$el = $(options.el)
        this.el  = this.$el[0]
        var appModel = this.appModel = options.appModel
        var model    = this.model    = options.model

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var fieldName = appModel.get('focus')
            if (fieldName) {
                appModel.set('focus', undefined)
            }
        })
    }
})

module.exports = DashboardView