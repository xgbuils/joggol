var FieldView = Backbone.View.extend({
    initialize: function (options) {
    	var view = this
        view.$el = $(options.el)
        view.el  = this.$el[0]

        view.on('focus', function () {

        })
    }
})

module.exports = FieldView