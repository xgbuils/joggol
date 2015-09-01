var View = require('frontpiece.view')

var LayoutView = View.extend({
    initialize: function (options) {
        var view = this
        var $el  = this.$el = $(options.el)
        this.el  = $el[0]

        var appRouter = this.appRouter = options.appRouter
        this.model    = options.model
        this.appModel = options.appModel

        this.height = $el.outerHeight()
        this.bottom = $el.offset().top + this.height

        
        this.appModel.on('layout-' + this.name + ':active', function () {
            var fragment = clearSlashes(appRouter.getFragment().split('?')[0])
            if ( fragment !== view.name && (fragment !== '' || view.name !== 'header')) {
                appRouter.navigate(view.name)
            }
        })
    }
})

function clearSlashes (path) {
    return path.replace(/^\//, '').replace(/\/$/, '')
}

module.exports = LayoutView