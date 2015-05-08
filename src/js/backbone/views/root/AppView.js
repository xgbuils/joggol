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

        this.layoutOn = undefined
        this.scrollOn = true

        $(window).on('scroll', function () {
            if (view.scrollOn) {
                var top      = $(window).scrollTop()
                var layoutOn = view.layoutOn
                var bottoms  = view.bottoms
                var len      = bottoms.length
    
                for (var i = 0; i < len; ++i) {
                    var e = bottoms[i]
                    var layout = view.layouts[e.name]
                    if (e.bottom - 60 >= top) {
                        if (layout !== layoutOn) {
                            if (layoutOn) {
                                layoutOn.trigger('inactive')
                            }
                            view.layoutOn = layout
                            layout.trigger('active')
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
    scroll: function (layoutName) {
        var view      = this
        var targetTop = view.layouts[layoutName].$el.offset().top
        view.scrollOn = false
        $('body, html').animate({scrollTop: targetTop}, 300, 'swing', function () {
            view.scrollOn = true
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