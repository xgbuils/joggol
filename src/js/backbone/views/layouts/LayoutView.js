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
            console.log(this.name, 'active')
            this.controlBarView.trigger('change-layout', this.name)
            //console.log(this.name + ' activo!')
            var fragment = Backbone.history.getFragment().substring(1, this.name.length + 1)
            //console.log('fragment', fragment)
            if ( fragment !== this.name && (fragment !== '' || this.name !== 'header')) {
                //console.log('NAVIGATE')
                this.appRouter.navigate('!' + this.name)
            }
        })

        this.on('inactive', function () {
            console.log(this.name, 'inactive')
        })
    }
})

module.exports = LayoutView