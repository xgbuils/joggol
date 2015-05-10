var AppView = Backbone.View.extend({
    el: window,
    initialize: function (options) {
        this.domCompute()
        var view = this

        this.$el = $('body, html')
        this.el  = this.$el[0]

        if (options.appRouter) {
            this.appRouter = options.appRouter
            this.appRouter.appView = this
            //console.log(this.appRouter)
        }
        this.dashboard = options.dashboard
        
        this.layouts   = options.layouts

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

        this.layoutOn = this.layouts.header
        this.scrollState = 2

        this.on('create-model', function (model) {
            //console.log('AppView')
            this.model = model
            this.dashboard.trigger('create-model', model)
        })

        $(window).on('scroll', function () {
            if        (view.scrollState === 1) {
                ++view.scrollState
            } else if (view.scrollState === 2) {
                var top      = $(window).scrollTop()
                var layoutOn = view.layoutOn
                var bottoms  = view.bottoms
                var len      = bottoms.length
    
                for (var i = 0; i < len; ++i) {
                    var e = bottoms[i]
                    var layout = view.layouts[e.name]
                    if (e.bottom - 60 >= top) {
                        view.changeLayout(layout)
                        break
                    }
                }
            }
        })

        $('.internal-link').on('click', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var href = $(this).attr('href').substr(1)
            //console.log('click .internal-link')
            view.appRouter.navigate(href, {trigger: true})
        })

        this.$el.on('click', '.internal-link', function (event) {
            event.preventDefault()
            event.stopPropagation()
            var href = $(this).attr('href').substr(1)
            //console.log('click delegated .internal-link')
            view.appRouter.navigate(href, {trigger: true})
        })
    },
    changeLayout: function (newLayout) {
        var oldLayout = this.layoutOn
        if (oldLayout !== newLayout) {
            if (oldLayout) {
                oldLayout.trigger('inactive')
            }
            this.layoutOn = newLayout
            newLayout.trigger('active')
        }
    },
    scroll: function (layoutName, callback) {
        var view      = this
        var newLayout = this.layouts[layoutName]
        var targetTop = newLayout.$el.offset().top
        this.scrollState = 0

        $('body, html').animate({scrollTop: targetTop}, 300, 'swing', function () {
            //console.log(Backbone.history.getFragment())
            view.scrollState = 1
            //console.log(Backbone.history.getFragment())
            view.changeLayout(newLayout)
        })
    },
    domCompute: function () {
        $('.collapsed').each(function (index, item) {
            var $item = $(item)
            $item.removeClass('js-hide')
            var width = $item.outerWidth()
            $item.data('width', width)
            $item.css('width', width)
        })

        $('.word-expanded').each(function (index, item) {
            var $item = $(item)
            var width = $item.outerWidth()
            $item.data('width', width)
            $item.css('width', width)
        })
    }

})

module.exports = AppView