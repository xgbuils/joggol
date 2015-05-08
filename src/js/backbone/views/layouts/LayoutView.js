var LayoutView = Backbone.View.extend({
	initialize: function (options) {
        this.name = 'generator'
        var $el = this.$el = $(options.el)
        this.el = $el[0]

        this.controlBarView = options.controlBarView
        this.appRouter      = options.appRouter

        this.height = $el.outerHeight()
        //console.log('height', this.height, options.el)
        //console.log('offset', $el.offset().top, options.el)
        this.bottom = $el.offset().top + this.height

        this.on('active', function () {
            this.controlBarView.trigger('change-layout', this.name)
            console.log(this.name + ' activo!')
            if (Backbone.history.getFragment() !== '' || this.name !== 'header') {
                console.log('eo')
                this.appRouter.navigate('!' + this.name)
            }
        })
	}
})

module.exports = LayoutView