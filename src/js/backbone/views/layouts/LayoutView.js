var View = require('frontpiece.view')

var LayoutView = View.extend({
    initialize: function (options) {
        //this.name = 'generator'
        var view = this
        var $el  = this.$el = $(options.el)
        this.el  = $el[0]

        //this.controlBarView = options.controlBarView
        this.appRouter      = options.appRouter
        this.model          = options.model

        this.height = $el.outerHeight()
        this.bottom = $el.offset().top + this.height

        this.on('active', function () {
            console.log(this.name, 'active')
            
            var fragment = clearSlashes(this.appRouter.getFragment().split('?')[0])
            console.log('fragment: ', fragment, this.name)
            if ( fragment !== this.name && (fragment !== '' || this.name !== 'header')) {
                this.appRouter.navigate(this.name)
            }
        })

        this.on('inactive', function () {
            console.log(this.name, 'inactive')
        })
    }
})

function clearSlashes (path) {
    return path.replace(/^\//, '').replace(/\/$/, '')
}

module.exports = LayoutView