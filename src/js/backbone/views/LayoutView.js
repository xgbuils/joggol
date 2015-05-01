var LayoutView = Backbone.View.extend({
	initialize: function (options) {
        var $el = this.$el = $(options.el)
        this.el = $el[0]

        this.buttonsView = options.buttonsView

        this.height = $el.outerHeight()
        //console.log('height', this.height, options.el)
        //console.log('offset', $el.offset().top, options.el)
        this.bottom = $el.offset().top + this.height

        this.on('active', function () {
            console.log(this.el.id + ' activo!')
        })
	}
})

module.exports = LayoutView