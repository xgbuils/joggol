var FieldsetView = Backbone.View.extend({
    initialize: function (options) {
        var view = view
        view.$el = $(options.el)
        view.el  = view.$el[0]

        view.$el.on('click', '.min', function (event) {
            event.preventDefault()
            view.minView.trigger('focus')
        })

        view.$el.on('click', '.max', function (event) {
            event.preventDefault()
            view.maxView.trigger('focus')
        })

        view.$el.on('click', function () {
            view.minView.trigger('focus')
        })
    }
})

module.exports = FieldsetView