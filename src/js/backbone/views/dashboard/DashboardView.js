var View = require('frontpiece.view')

var DashboardView = View.extend({
    initialize: function (options) {
        var view = this
        this.$el = $(options.el)
        this.el  = this.$el[0]
        this.appModel = options.appModel
        var model = this.model = options.model

        this.$el.on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var fieldset = model.get('fieldset')
            var field    = model.get('field')
            var fieldModel
            if (fieldset && field) {
                fieldModel = model.getModel(fieldset + '.' + field)
                fieldModel.set('active', false)
            }
        })
    }
})

module.exports = DashboardView