var View = require('frontpiece.view')

var AppView = View.extend({
    el: window,
    initialize: function (options) {
        var view = this
        this.$el = $('body, html')
        this.el  = this.$el[0]

        var appModel = this.model = options.model

        if (options.appRouter) {
            this.appRouter = options.appRouter
            this.appRouter.appView = this
        }
        
        this.layouts = options.layouts

        this.bottoms = []
        for (var name in this.layouts) {
            var layout = this.layouts[name]
            this.bottoms.push({
                bottom: layout.bottom,
                name: name
            })
        }
        this.bottoms.sort(function (a, b) {
            return a.bottom - b.bottom
        })

        appModel.on('simulator-disabled', function () {
            $('#wrapper', view.$el).addClass('simulator-disabled')
        })
        appModel.on('simulator-enabled', function () {
            $('#wrapper', view.$el).removeClass('simulator-disabled')
        })

        this.scrollState = 2

        $(window).on('scroll', function () {
            if        (view.scrollState === 1) {
                ++view.scrollState
            } else if (view.scrollState === 2) {
                var top      = $(window).scrollTop()
                var bottoms  = view.bottoms
                var len      = bottoms.length
    
                for (var i = 0; i < len; ++i) {
                    var e = bottoms[i]
                    var layout = view.layouts[e.name]
                    if (e.bottom - 60 >= top) {
                        if (e.name !== view.model.get('layout')) {
                            view.model.set('layout', e.name)
                        }                        
                        break
                    }
                }
            }
        })

        $('.internal-link').on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var href = $(this).attr('href').substr(1)
            view.appRouter.navigate(href, {trigger: true})
        })

        this.$el.on('click', '.internal-link', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var href = $(this).attr('href').substr(1)
            view.appRouter.navigate(href, {trigger: true})
        })
    },
    scroll: function (layoutName, callback) {
        var view         = this
        var newLayout    = this.layouts[layoutName]
        var targetTop    = newLayout.$el.offset().top
        this.scrollState = 0

        $('body, html').animate({scrollTop: targetTop}, 300, 'swing', function () {
            view.scrollState = 1
            view.model.set('layout', layoutName)
        })
    }
})

module.exports = AppView